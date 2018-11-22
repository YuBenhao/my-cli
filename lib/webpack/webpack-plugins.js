'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ReloadPlugin = require('reload-html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var AssetsVersionWebpackPlugin = require('assets-version-webpack-plugin');
var InlineSourceHtmlWebpackPlugin = require('inline-source-html-webpack-plugin');
var HtmlWebpackInjectPlugin = require('../plugins/html-webpack-inject-plugin');
var isPlainObject = require('is-plain-object');
var helper = require('./webpack-helper');

var _require = require('../config'),
    getConfig = _require.getConfig;

var getPath = require('../utils/getPath');

var config = getConfig();
var assetsPath = getPath.cwd(config.__projectPath, 'src/assets');
var entries = Object.keys(helper.entry);

var plugins = [].concat(_toConsumableArray(helper.htmlPlugins), [new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/), new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify(process.env.NODE_ENV)
  }
}), new ExtractTextPlugin({
  filename: 'css/[name].css?v=[contentHash:7]',
  disable: config.__env === 'development',
  allChunks: true
}), new webpack.optimize.OccurrenceOrderPlugin(), new webpack.optimize.ModuleConcatenationPlugin(), new InlineSourceHtmlWebpackPlugin({
  rootpath: getPath.cwd(config.__projectPath),
  saveRemote: false,
  compress: config.compress && config.__env === 'production'
})]);

if (entries.length > 1) {
  plugins.push(new webpack.optimize.CommonsChunkPlugin({
    name: 'common',
    minChunks: 2,
    chunks: helper.navPages
  }));
}

if (config.normalizeCss || config.base && config.base.length) {
  plugins.push(new webpack.optimize.CommonsChunkPlugin({
    name: 'base',
    chunks: [entries.length > 1 ? 'common' : entries[0], 'base']
  }));
}

if (isPlainObject(config.provide)) {
  plugins.push(new webpack.ProvidePlugin(config.provide));
}

if (isPlainObject(config.define)) {
  plugins.push(new webpack.DefinePlugin(config.define));
}

if (config.toRem && config.inlineFlexible) {
  var flexiblePath = path.getPath(getPath.cwd(config.__projectPath), getPath.cmd('node_modules/amfe-flexible/index.js'));

  plugins.push(new HtmlWebpackInjectPlugin({
    externals: [{
      tag: 'script',
      attrs: {
        src: flexiblePath,
        type: 'text/javascript',
        inline: true
      }
    }],
    parent: 'head'
  }));
}

if (config.__env === 'development') {
  plugins.push(new webpack.HotModuleReplacementPlugin(), new webpack.NoEmitOnErrorsPlugin());

  if (!config.vue) {
    plugins.push(new ReloadPlugin());
  }
}

if (config.__env === 'production') {
  plugins.push(new webpack.ProgressPlugin());

  if (config.versionFile) {
    plugins.push(new AssetsVersionWebpackPlugin());
  }

  if (fs.existsSync(assetsPath)) {
    plugins.push(new CopyWebpackPlugin([{
      context: assetsPath,
      from: '**/*',
      toType: 'dir'
    }]));
  }

  if (config.compress) {
    plugins.push(new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true,
        collapse_vars: true,
        reduce_vars: true
      },
      output: {
        beautify: false,
        comments: false
      },
      ie8: true
    }));
  }
}

module.exports = plugins;