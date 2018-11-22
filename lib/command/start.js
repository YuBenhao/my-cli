'use strict';

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var opn = require('opn');

module.exports = function () {
  var _require = require('../config'),
      getConfig = _require.getConfig;

  var logger = require('../utils/logger');
  var host = require('../utils/host');
  var webpackConfig = require('../webpack');
  var devOption = require('../webpack/webpack-server');

  var config = getConfig(); // 参数: default + package.json + 命令行
  console.log(config);
  var compiler = webpack(webpackConfig);
  var server = new WebpackDevServer(compiler, devOption);

  server.listen(config.port, '0.0.0.0', function () {
    logger.success('\u670D\u52A1\u5668\u542F\u52A8\u5728:');
    host.forEach(function (h) {
      return void logger.success(getUrl(h));
    });
    config.open && opn(getUrl(host[0]), { app: ['google chrome', '--incognito'] });
  });

  function getUrl(host) {
    return (config.https ? 'https' : 'http') + '://' + host + ':' + config.port;
  }
};