'use strict';

var fs = require('fs');
var url = require('url');
var bodyParser = require('body-parser');
var connectMockMiddleware = require('connect-mock-middleware');
var httpProxyMiddleware = require('http-proxy-middleware');
var serveStatic = require('serve-static');
var isHttpUrl = require('is-http-url');
var isPlainObject = require('is-plain-object');
var getPath = require('../utils/getPath');

var _require = require('../config'),
    getConfig = _require.getConfig;

var logger = require('../utils/logger');

var config = getConfig();
var mockDir = getPath.cwd(config.__projectPath, config.mockDir);
var staticDir = getPath.cwd(config.__projectPath, config.staticDir);
var reIP4 = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
var proxyValid = false;

exports.before = function (app) {
  if (config.proxy && isPlainObject(config.cookie)) {
    app.use(function (req, res, next) {
      var cookieOption = {
        httpOnly: true
      };
      if (!reIP4.test(req.hostname)) {
        cookieOption.domain = '.51talk.com';
      }
      Object.keys(config.cookie).forEach(function (key) {
        res.cookie(key, encodeURIComponent(config.cookie[key] + ''), cookieOption);
      });
      next();
    });
  }

  if (!config.proxy && fs.existsSync(mockDir)) {
    logger.info('Mock服务已开启');
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(connectMockMiddleware(mockDir, {
      prefix: addSlash(config.mockContext),
      callback: config.mockCallback
    }));
  }

  if (config.proxy) {
    config.proxyConfig.forEach(function (proxyItem) {
      if (proxyItem.proxyTarget && proxyItem.proxyContext) {
        if (!/^https?:/.test(proxyItem.proxyTarget)) {
          proxyItem.proxyTarget = 'http://' + proxyItem.proxyTarget;
        }

        if (!isHttpUrl(proxyItem.proxyTarget)) {
          logger.warning('Oops, \u6307\u5B9A\u7684' + proxyItem.proxyTarget + '\u65E0\u6548\uFF01');
          return;
        }

        proxyItem.proxyContext = addSlash(proxyItem.proxyContext);

        if (Array.isArray(proxyItem.proxyContext)) {
          proxyItem.proxyContext.forEach(function (contextItem) {
            app.use(contextItem, httpProxyMiddleware({
              target: proxyItem.proxyTarget,
              changeOrigin: proxyItem.changeOrigin || !reIP4.test(url.parse(proxyItem.proxyTarget).hostname),
              secure: false
            }));
          });
          proxyValid = true;
        }
      }
    });

    if (proxyValid) {
      logger.info('联调模式已开启');
    }
  }
};

exports.after = function (app) {
  if (fs.existsSync(staticDir)) {
    app.use(config.staticContext, serveStatic(staticDir));
  }
};

function addSlash(arr) {
  return arr.map(function (item) {
    return '/' + item.replace(/^\//, '');
  });
}