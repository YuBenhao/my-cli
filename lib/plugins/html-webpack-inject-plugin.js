'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HtmlWebpackInjectPlugin = function () {
  function HtmlWebpackInjectPlugin(config) {
    _classCallCheck(this, HtmlWebpackInjectPlugin);

    var _config$externals = config.externals,
        externals = _config$externals === undefined ? [] : _config$externals,
        _config$parent = config.parent,
        parent = _config$parent === undefined ? 'head' : _config$parent;


    this.assets = externals.map(function (_ref) {
      var _ref$tag = _ref.tag,
          tag = _ref$tag === undefined ? 'meta' : _ref$tag,
          _ref$attrs = _ref.attrs,
          attrs = _ref$attrs === undefined ? {} : _ref$attrs;

      return {
        tagName: tag,
        attributes: attrs,
        closeTag: true
      };
    });

    if (parent !== 'head' && parent !== 'body') {
      throw new TypeError('parent should be one of head and body');
    }
    this.parent = parent;
  }

  _createClass(HtmlWebpackInjectPlugin, [{
    key: 'apply',
    value: function apply(compiler) {
      var _this = this;

      compiler.plugin('compilation', function (compilation) {
        compilation.plugin('html-webpack-plugin-alter-asset-tags', function (htmlPluginData, callback) {
          if (_this.parent === 'head') {
            htmlPluginData.head = htmlPluginData.head.concat(_this.assets);
          } else {
            htmlPluginData.body = _this.assets.concat(htmlPluginData.body);
          }
          callback(null, htmlPluginData);
        });
      });
    }
  }]);

  return HtmlWebpackInjectPlugin;
}();

module.exports = HtmlWebpackInjectPlugin;