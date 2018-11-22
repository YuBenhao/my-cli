'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var defaultConfig = require('./default');
var getFileConfig = require('./file');

var dirty = false;
var config = _extends({}, defaultConfig);

module.exports = {
  getConfig: function getConfig(key) {
    return key ? config[key] : config;
  },
  setConfig: function setConfig(cfg) {
    if (dirty) {
      config = _extends({}, config, cfg);
    } else {
      config = _extends({}, config, getFileConfig(cfg.__projectPath), cfg);
      dirty = true;
    }
  }
};