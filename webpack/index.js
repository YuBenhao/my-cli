const path = require('path')
const isPlainObject = require('is-plain-object')
const getPath = require('../utils/getPath')
const helper = require('../webpack/webpack-helper')
const plugins = require('../webpack/webpack-plugins')
const module_ = require('../webpack/webpack-module')

const { getConfig } = require('../config')

const config = getConfig()
const cmdModules = getPath.cmd('node_modules')
const cwdModules = getPath.cwd(config.__projectPath, 'node_modules')
const libModules = getPath.cwd(config.__projectPath, 'src/lib')
const baseEntry = {}

if (config.normalizeCss) {
  baseEntry.base = (baseEntry.base || []).concat('normalize.css')
}

if (config.polyfill.promise) {
  baseEntry.base = (baseEntry.base || []).concat('es6-promise/auto')
}

if (Array.isArray(config.base) && config.base.length) {
  baseEntry.base = baseEntry.base.concat(config.base)
}

module.exports = {
  entry: {
    ...helper.entry,
    ...baseEntry
  },
  output: {
    path: path.isAbsolute(config.dest)
      ? config.dest
      : getPath.cwd(config.__projectPath, config.dest),
    filename: `js/[name].js${config.__env === 'production' ? '?v=[chunkhash:7]' : ''}`,
    chunkFilename: 'js/[name]-[chunkhash:7].js',
    publicPath: config.publicPath
  },
  module: module_,
  plugins,
  resolve: {
    modules: [ cmdModules, cwdModules, libModules ],
    alias: {
      '@': getPath.cwd(config.__projectPath, 'src'),
      ...config.alias
    },
    extensions: ['.js', '.vue', '.jsx', '.ts', '.tsx']
  },
  resolveLoader: {
    modules: [ cmdModules, cwdModules ]
  },
  devtool: config.__env === 'development'
    ? 'cheap-module-eval-source-map'
    : 'none',
  externals: config.externals,
  performance: {
    hints: config.__env === 'production' ? 'warning' : false,
    maxEntrypointSize: 400000,
    maxAssetSize: 200000,
    assetFilter: assetFilename => {
      return (/\.(?:css|js)$/.test(assetFilename))
    }
  }
}
