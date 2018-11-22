'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _require = require('../config'),
    getConfig = _require.getConfig;

var hooks = require('./webpack-hook');

var config = getConfig();

module.exports = _extends({
  contentBase: false,
  stats: {
    colors: true
  },
  inline: true,
  hot: true,
  overlay: {
    warnings: true,
    errors: true
  },
  noInfo: config.noInfo,
  https: config.https,
  historyApiFallback: true,
  allowedHosts: config.allowedHosts,
  index: 'html/index.html'
}, hooks);