'use strict';

var HtmlWebpackPlugin = require('html-webpack-plugin');
var getPath = require('../utils/getPath');
var entryInfos = require('./webpack-entry');

var _require = require('../config'),
    getConfig = _require.getConfig;

var config = getConfig();

function getEntry() {
  return entryInfos.reduce(function (webpackEntry, entryInfo) {
    var entryExists = entryInfo.entryExists,
        pageName = entryInfo.pageName,
        entry = entryInfo.entry;

    if (entryExists) {
      var newEntry = [entry];
      if (config.__env === 'production' && config.publicPath.startsWith('.')) {
        newEntry.unshift(getPath.cmd('./src/utils/public-path'));
      }
      if (config.__env === 'development' && config.vue) {
        newEntry.unshift('webpack/hot/dev-server', 'webpack-dev-server/client?' + (config.https ? 'https' : 'http') + '://0.0.0.0:' + config.port + '/');
      }
      webpackEntry[pageName] = newEntry;
    }
    return webpackEntry;
  }, {});
}

function getHtmlPlugins() {
  var plugins = entryInfos.reduce(function (plugins, entryInfo) {
    var entryExists = entryInfo.entryExists,
        template = entryInfo.template,
        templateExists = entryInfo.templateExists,
        pageName = entryInfo.pageName;

    var htmlOption = void 0;

    if (!entryExists && !templateExists) return plugins;

    htmlOption = {
      title: pageName,
      filename: 'html/' + pageName + '.html',
      minify: {
        removeComments: true
      }
    };

    if (templateExists) {
      htmlOption.template = template;
    }

    if (!entryExists) {
      htmlOption.inject = false;
    } else {
      htmlOption.chunks = ['base', 'common', pageName];
    }

    plugins.push(new HtmlWebpackPlugin(htmlOption));

    return plugins;
  }, []);

  return plugins;
}

function getNavPages() {
  return entryInfos.reduce(function (htmls, entryInfo) {
    if (entryInfo.entryExists || entryInfo.templateExists) {
      htmls.push(entryInfo.pageName);
    }
    return htmls;
  }, []);
}

module.exports = {
  entry: getEntry(),
  htmlPlugins: getHtmlPlugins(),
  navPages: getNavPages()
};