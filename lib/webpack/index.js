'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var path = require('path');
var isPlainObject = require('is-plain-object');
var getPath = require('../utils/getPath');
var helper = require('../webpack/webpack-helper');
var plugins = require('../webpack/webpack-plugins');
var module_ = require('../webpack/webpack-module');

var _require = require('../config'),
    getConfig = _require.getConfig;

var config = getConfig();
var cmdModules = getPath.cmd('node_modules');
var cwdModules = getPath.cwd(config.__projectPath, 'node_modules');
var libModules = getPath.cwd(config.__projectPath, 'src/lib');
var baseEntry = {};

if (config.normalizeCss) {
  baseEntry.base = (baseEntry.base || []).concat('normalize.css');
}

if (config.polyfill.promise) {
  baseEntry.base = (baseEntry.base || []).concat('es6-promise/auto');
}

if (Array.isArray(config.base) && config.base.length) {
  baseEntry.base = baseEntry.base.concat(config.base);
}

module.exports = {
  entry: _extends({}, helper.entry, baseEntry),
  output: {
    path: path.isAbsolute(config.dest) ? config.dest : getPath.cwd(config.__projectPath, config.dest),
    filename: 'js/[name].js' + (config.__env === 'production' ? '?v=[chunkhash:7]' : ''),
    chunkFilename: 'js/[name]-[chunkhash:7].js',
    publicPath: config.publicPath
  },
  module: module_,
  plugins: plugins,
  resolve: {
    modules: [cmdModules, cwdModules, libModules],
    alias: _extends({
      '@': getPath.cwd(config.__projectPath, 'src')
    }, config.alias),
    extensions: ['.js', '.vue', '.jsx', '.ts', '.tsx']
  },
  resolveLoader: {
    modules: [cmdModules, cwdModules]
  },
  devtool: config.__env === 'development' ? 'cheap-module-eval-source-map' : 'none',
  externals: config.externals,
  performance: {
    hints: config.__env === 'production' ? 'warning' : false,
    maxEntrypointSize: 400000,
    maxAssetSize: 200000,
    assetFilter: function assetFilter(assetFilename) {
      return (/\.(?:css|js)$/.test(assetFilename)
      );
    }
  }
};