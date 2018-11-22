const HtmlWebpackPlugin = require('html-webpack-plugin')
const getPath = require('../utils/getPath')
const entryInfos = require('./webpack-entry')
const { getConfig } = require('../config')

const config = getConfig()

function getEntry () {
  return entryInfos.reduce((webpackEntry, entryInfo) => {
    const { entryExists, pageName, entry } = entryInfo
    if (entryExists) {
      const newEntry = [ entry ]
      if (config.__env === 'production' && config.publicPath.startsWith('.')) {
        newEntry.unshift(getPath.cmd('utils/public-path'))
      }
      if (config.__env === 'development' && config.vue) {
        newEntry.unshift(
          'webpack/hot/dev-server',
          `webpack-dev-server/client?${config.https ? 'https' : 'http'}://0.0.0.0:${config.port}/`
        )
      }
      webpackEntry[pageName] = newEntry
    }
    return webpackEntry
  }, {})
}

function getHtmlPlugins () {
  const plugins = entryInfos.reduce((plugins, entryInfo) => {
    const { entryExists, template, templateExists, pageName } = entryInfo
    let htmlOption

    if (!entryExists && !templateExists) return plugins

    htmlOption = {
      title: pageName,
      filename: `html/${pageName}.html`,
      minify: {
        removeComments: true
      }
    }

    if (templateExists) {
      htmlOption.template = template
    }

    if (!entryExists) {
      htmlOption.inject = false
    } else {
      htmlOption.chunks = ['base', 'common', pageName]
    }

    plugins.push(new HtmlWebpackPlugin(htmlOption))

    return plugins
  }, [])

  return plugins
}

function getNavPages () {
  return entryInfos.reduce((htmls, entryInfo) => {
    if (entryInfo.entryExists || entryInfo.templateExists) {
      htmls.push(entryInfo.pageName)
    }
    return htmls
  }, [])
}

module.exports = {
  entry: getEntry(),
  htmlPlugins: getHtmlPlugins(),
  navPages: getNavPages()
}
