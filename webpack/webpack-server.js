const { getConfig } = require('../config')
const hooks = require('./webpack-hook')

const config = getConfig()

module.exports = {
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
  index: 'html/index.html',
  ...hooks
}
