const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const opn = require('opn')

module.exports = () => {
  const { getConfig } = require('../config')
  const logger = require('../utils/logger')
  const host = require('../utils/host')
  const webpackConfig = require('../webpack')
  const devOption = require('../webpack/webpack-server')

  const config = getConfig()  // 参数: default + package.json + 命令行
  console.log(config)
  const compiler = webpack(webpackConfig)
  const server = new WebpackDevServer(compiler, devOption)

  server.listen(config.port, '0.0.0.0', () => {
    logger.success(`服务器启动在:`)
    host.forEach(h => void logger.success(getUrl(h)))
    config.open && opn(getUrl(host[0]), {app: ['google chrome', '--incognito']})
  })

  function getUrl (host) {
    return `${config.https ? 'https' : 'http'}://${host}:${config.port}`
  }
}
