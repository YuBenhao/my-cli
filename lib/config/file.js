'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var fs = require('fs');
var getPath = require('../utils/getPath');

module.exports = function (path) {
  var packagePath = getPath.cwd(path, './package.json');

  if (fs.existsSync(packagePath)) {
    var packageConfig = require(packagePath);
    var redSkullConfig = packageConfig.redskull || {};
    var browserslist = packageConfig.browserslist || {};

    return _extends({}, redSkullConfig, {
      browserslist: browserslist
    });
  }
  return {};
};