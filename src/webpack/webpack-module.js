const babelPresetEnv = require('babel-preset-env')
const babelPresetReact = require('babel-preset-react')
const babelPresetStage = require('babel-preset-stage-0')
const babelPluginTransformVueJsx = require('babel-plugin-transform-vue-jsx')
const babelPluginTransformRuntime = require('babel-plugin-transform-runtime')
const babelPluginTransformReactJsx = require('babel-plugin-transform-react-jsx')
const genLoaders = require('./webpack-loader')
const getPath = require('../utils/getPath')
const { getConfig } = require('../config')

const config = getConfig()
const loadToExtMap = { css: /\.css$/, less: /\.less$/, stylus: /.styl$/ }
const cssRule = []

for (let [ loaderName, reExt ] of Object.entries(loadToExtMap)) {
  cssRule.push({
    test: reExt,
    use: genLoaders(loaderName)
  })
}

const presets = [ [ babelPresetEnv, {
  targets: {
    browsers: config.browserslist
  },
  modules: false
} ], babelPresetStage ]

const plugins = [ babelPluginTransformRuntime ]

if (config.vue) {
  plugins.push(babelPluginTransformVueJsx)
} else {
  presets.push(babelPresetReact)
  plugins.push([babelPluginTransformReactJsx, {
    'pragma': config.jsx
  }])
}

module.exports = {
  rules: [
    ...cssRule,
    {
      test: /\.vue$/,
      loader: 'vue-loader',
      include: getPath.cwd(config.__projectPath, 'src'),
      options: {
        loaders: {
          css: genLoaders('css', true),
          less: genLoaders('less', true),
          stylus: genLoaders('stylus', true)
        },
        transformToRequire: {
          audio: 'src',
          video: 'src'
        }
      }
    }, {
      test: /\.html$/,
      loader: 'html-loader'
    }, {
      test: /\.ejs$/,
      loader: 'ejs-loader'
    }, {
      test: /\.pug$/,
      use: [{
        loader: 'pug-loader',
        options: {
          pretty: true
        }
      }]
    }, {
      test: /\.(hbs|jade)$/,
      loader: 'handlebars-loader'
    }, {
      test: /\.jsx?$/,
      use: {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          presets,
          plugins
        }
      },
      include: getPath.cwd(config.__projectPath, 'src')
    }, {
      test: /\.tsx?$/,
      use: [{
        loader: 'ts-loader',
        options: {
          context: getPath.cwd(config.__projectPath),
          configFile: getPath.cmd('tsconfig.json')
        }
      }],
      include: getPath.cwd(config.__projectPath, 'src')
    }, {
      test: /-file\.(png|jpe?g|gif|svg)$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: 'images/[name]-[hash:7].[ext]'
        }
      }]
    }, {
      test: filename => /\.(png|jpe?g|gif|svg)$/.test(filename) && !/-file\.(png|jpe?g|gif|svg)$/.test(filename),
      use: [{
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'images/[name]-[hash:7].[ext]'
        }
      }]
    }, {
      test: /\.(mp[34]|ogg|wav)$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: 'media/[name]-[hash:7].[ext]'
        }
      }]
    }, {
      test: /\.(eot|ttf|woff2?)$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: 'font/[name]-[hash:7].[ext]'
        }
      }]
    }
  ],
  noParse: content => {
    const keys = Object.keys(config.externals).join('|')
    if (keys.length) {
      const reKeys = new RegExp(`(?:${keys})(?:\\.min)?\\.js$`)
      return reKeys.test(content)
    }
    return false
  }
}
