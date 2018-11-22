const ExtractTextPlugin = require('extract-text-webpack-plugin')
const getPath = require('../utils/getPath')
const { getConfig } = require('../config')

const config = getConfig()

module.exports = function (loaderName, isVue) {
  const loaders = [{
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
  }]

  if (loaderName && loaderName !== 'css') {
    loaders.push({
      loader: `${loaderName}-loader`
    })
  }

  return ExtractTextPlugin.extract({
    use: loaders,
    fallback: isVue ? 'vue-style-loader' : 'style-loader'
  })
}
