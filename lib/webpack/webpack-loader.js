'use strict';

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var getPath = require('../utils/getPath');

var _require = require('../config'),
    getConfig = _require.getConfig;

var config = getConfig();

module.exports = function (loaderName, isVue) {
  var loaders = [{
    loader: 'css-loader',
    options: {
      importLoaders: 1,
      minimize: config.compress
    }
  }, {
    loader: 'postcss-loader',
    options: {
      config: {
        path: getPath.cmd('postcss.config.js')
      },
      sourceMap: true
    }
  }];

  if (loaderName && loaderName !== 'css') {
    loaders.push({
      loader: loaderName + '-loader'
    });
  }

  return ExtractTextPlugin.extract({
    use: loaders,
    fallback: isVue ? 'vue-style-loader' : 'style-loader'
  });
};