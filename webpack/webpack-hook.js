const fs = require('fs')
const url = require('url')
const bodyParser = require('body-parser')
const connectMockMiddleware = require('connect-mock-middleware')
const httpProxyMiddleware = require('http-proxy-middleware')
const serveStatic = require('serve-static')
const isHttpUrl = require('is-http-url')
const isPlainObject = require('is-plain-object')
const getPath = require('../utils/getPath')
const { getConfig } = require('../config')
const logger = require('../utils/logger')

const config = getConfig()
const mockDir = getPath.cwd(config.__projectPath, config.mockDir)
const staticDir = getPath.cwd(config.__projectPath, config.staticDir)
const reIP4 = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/
let proxyValid = false

exports.before = function (app) {
  if (config.proxy && isPlainObject(config.cookie)) {
    app.use((req, res, next) => {
      const cookieOption = {
        httpOnly: true
      }
      if (!reIP4.test(req.hostname)) {
        cookieOption.domain = '.51talk.com'
      }
      Object.keys(config.cookie).forEach(key => {
        res.cookie(key, encodeURIComponent(config.cookie[key] + ''), cookieOption)
      })
      next()
    })
  }

  if (!config.proxy && fs.existsSync(mockDir)) {
    logger.info('Mock服务已开启')
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use(connectMockMiddleware(mockDir, {
      prefix: addSlash(config.mockContext),
      callback: config.mockCallback
    }))
  }

  if (config.proxy) {
    config.proxyConfig.forEach(proxyItem => {
      if (proxyItem.proxyTarget && proxyItem.proxyContext) {
        if (!/^https?:/.test(proxyItem.proxyTarget)) {
          proxyItem.proxyTarget = 'http://' + proxyItem.proxyTarget
        }

        if (!isHttpUrl(proxyItem.proxyTarget)) {
          logger.warning(`Oops, 指定的${proxyItem.proxyTarget}无效！`)
          return
        }

        proxyItem.proxyContext = addSlash(proxyItem.proxyContext)

        if (Array.isArray(proxyItem.proxyContext)) {
          proxyItem.proxyContext.forEach(contextItem => {
            app.use(contextItem, httpProxyMiddleware({
              target: proxyItem.proxyTarget,
              changeOrigin: proxyItem.changeOrigin || !reIP4.test(url.parse(proxyItem.proxyTarget).hostname),
              secure: false
            }))
          })
          proxyValid = true
        }
      }
    })

    if (proxyValid) {
      logger.info('联调模式已开启')
    }
  }
}

exports.after = function (app) {
  if (fs.existsSync(staticDir)) {
    app.use(config.staticContext, serveStatic(staticDir))
  }
}

function addSlash (arr) {
  return arr.map(item => '/' + item.replace(/^\//, ''))
}
