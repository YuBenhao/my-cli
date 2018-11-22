'use strict';

var path = require('path');

var baseCmd = path.resolve(__dirname, '../../');
var baseCwd = process.cwd();

var cmd = function cmd() {
  for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
    rest[_key] = arguments[_key];
  }

  rest.unshift(baseCmd);
  return path.resolve.apply(null, rest);
};

var cwd = function cwd() {
  for (var _len2 = arguments.length, rest = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    rest[_key2] = arguments[_key2];
  }

  rest.unshift(baseCwd);
  return path.resolve.apply(null, rest);
};

module.exports = { cmd: cmd, cwd: cwd };