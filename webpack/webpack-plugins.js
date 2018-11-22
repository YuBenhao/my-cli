const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ReloadPlugin = require('reload-html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const AssetsVersionWebpackPlugin = require('assets-version-webpack-plugin')
const InlineSourceHtmlWebpackPlugin = require('inline-source-html-webpack-plugin')
const HtmlWebpackInjectPlugin = require('../plugins/html-webpack-inject-plugin')
const isPlainObject = require('is-plain-object')
const helper = require('./webpack-helper')
const { getConfig } = require('../config')
const getPath = require('../utils/getPath')

const config = getConfig()
const assetsPath = getPath.cwd(config.__projectPath, 'src/assets')
const entries = Object.keys(helper.entry)

const plugins = [
  ...helper.htmlPlugins,
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    }
  }),
  new ExtractTextPlugin({
    filename: 'css/[name].css?v=[contentHash:7]',
    disable: config.__env === 'development',
    allChunks: true
  }),
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.optimize.ModuleConcatenationPlugin(),
  new InlineSourceHtmlWebpackPlugin({
    rootpath: getPath.cwd(config.__projectPath),
    saveRemote: false,
    compress: config.compress && config.__env === 'production'
  })
]

if (entries.length > 1) {
  plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      minChunks: 2,
      chunks: helper.navPages
    })
  )
}

if (config.normalizeCss || (config.base && config.base.length)) {
  plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
      name: 'base',
      chunks: [entries.length > 1 ? 'common' : entries[0], 'base']
    })
  )
}

if (isPlainObject(config.provide)) {
  plugins.push(new webpack.ProvidePlugin(config.provide))
}

if (isPlainObject(config.define)) {
  plugins.push(new webpack.DefinePlugin(config.define))
}

if (config.toRem && config.inlineFlexible) {
  const flexiblePath = path.getPath(
    getPath.cwd(config.__projectPath),
    getPath.cmd('node_modules/amfe-flexible/index.js')
  )

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
  }))
}

if (config.__env === 'development') {
  plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )

  if (!config.vue) {
    plugins.push(new ReloadPlugin())
  }
}

if (config.__env === 'production') {
  plugins.push(new webpack.ProgressPlugin())

  if (config.versionFile) {
    plugins.push(new AssetsVersionWebpackPlugin())
  }

  if (fs.existsSync(assetsPath)) {
    plugins.push(
      new CopyWebpackPlugin([{
        context: assetsPath,
        from: '**/*',
        toType: 'dir'
      }])
    )
  }

  if (config.compress) {
    plugins.push(
      new webpack.optimize.UglifyJsPlugin({
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
      })
    )
  }
}

module.exports = plugins
