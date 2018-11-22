'use strict';

var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var rimraf = require('rimraf');

module.exports = function () {
  var getPath = require('../utils/getPath');
  var webpackConfig = require('../webpack');

  var _require = require('../config'),
      getConfig = _require.getConfig;

  var logger = require('../utils/logger');
  var config = getConfig();

  var distPath = path.isAbsolute(config.dest) ? config.dest : getPath.cwd(config.__projectPath, config.dest);

  var distExists = fs.existsSync(distPath);

  var compile = function compile() {
    var compiler = webpack(webpackConfig);
    var handler = function handler(err, stats) {
      if (err) {
        logger.error(err.stack || err);
        if (err.details) {
          logger.error(err.details);
        }
        process.exit(1);
      }

      var info = stats.toJson();
      if (stats.hasErrors()) {
        logger.error(info.errors.join(''));
        process.exit(1);
      }

      if (stats.hasWarnings()) {
        logger.warning(info.warnings.join(''));
        process.exit(1);
      }
      // 输出编译信息
      logger.info(stats.toString({
        chunks: false, // 使构建过程更静默无输出
        colors: true // 在控制台展示颜色
      }));

      if (config.watch) {
        logger.success('[' + new Date().toLocaleString() + '] \u7F16\u8BD1\u5B8C\u6210');
      } else {
        logger.success('编译完成');
        // 正常情况下，如果没有异步操作正在等待，那么Node.js会以状态码0退出
        process.exit(0);
      }
    };

    if (config.watch) {
      compiler.watch({
        ignored: /node_modules/,
        aggregateTimeout: 6000 // 6s内的所有更改都会一次重新编译
      }, handler);
    } else {
      compiler.run(handler);
    }
  };

  if (distExists) {
    rimraf(distPath, compile);
  } else {
    compile();
  }
};