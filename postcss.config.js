const defaultConfig = require('./config/default')
const { getConfig } = require('./config')
const config = getConfig()

const plugins = [
  require('autoprefixer')({ browsers: config.browsers })
]

if (config.toRem) {
  const toRemOption = { ...defaultConfig.toRemOption, ...config.toRemOption }
  plugins.push(require('postcss-pxtorem')(toRemOption))
}

module.exports = { plugins }
