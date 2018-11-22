'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var babelPresetEnv = require('babel-preset-env');
var babelPresetReact = require('babel-preset-react');
var babelPresetStage = require('babel-preset-stage-0');
var babelPluginTransformVueJsx = require('babel-plugin-transform-vue-jsx');
var babelPluginTransformRuntime = require('babel-plugin-transform-runtime');
var babelPluginTransformReactJsx = require('babel-plugin-transform-react-jsx');
var genLoaders = require('./webpack-loader');
var getPath = require('../utils/getPath');

var _require = require('../config'),
    getConfig = _require.getConfig;

var config = getConfig();
var loadToExtMap = { css: /\.css$/, less: /\.less$/, stylus: /.styl$/ };
var cssRule = [];

var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
  for (var _iterator = Object.entries(loadToExtMap)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
    var _ref = _step.value;

    var _ref2 = _slicedToArray(_ref, 2);

    var loaderName = _ref2[0];
    var reExt = _ref2[1];

    cssRule.push({
      test: reExt,
      use: genLoaders(loaderName)
    });
  }
} catch (err) {
  _didIteratorError = true;
  _iteratorError = err;
} finally {
  try {
    if (!_iteratorNormalCompletion && _iterator.return) {
      _iterator.return();
    }
  } finally {
    if (_didIteratorError) {
      throw _iteratorError;
    }
  }
}

var presets = [[babelPresetEnv, {
  targets: {
    browsers: config.browserslist
  },
  modules: false
}], babelPresetStage];

var plugins = [babelPluginTransformRuntime];

if (config.vue) {
  plugins.push(babelPluginTransformVueJsx);
} else {
  presets.push(babelPresetReact);
  plugins.push([babelPluginTransformReactJsx, {
    'pragma': config.jsx
  }]);
}

module.exports = {
  rules: [].concat(cssRule, [{
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
        presets: presets,
        plugins: plugins
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
    test: function test(filename) {
      return (/\.(png|jpe?g|gif|svg)$/.test(filename) && !/-file\.(png|jpe?g|gif|svg)$/.test(filename)
      );
    },
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
  }]),
  noParse: function noParse(content) {
    var keys = Object.keys(config.externals).join('|');
    if (keys.length) {
      var reKeys = new RegExp('(?:' + keys + ')(?:\\.min)?\\.js$');
      return reKeys.test(content);
    }
    return false;
  }
};