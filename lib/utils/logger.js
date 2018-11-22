'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var chalk = require('chalk');
var format = require('util').format;

var prefix = 'my-cli';
var sep = chalk.gray('>');

module.exports = {

  info: function info() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var msg = format.apply(undefined, args);
    console.info(chalk.white(prefix), sep, chalk.cyan(msg));
  },

  success: function success() {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    var msg = format.apply(undefined, args);
    console.log(chalk.white(prefix), sep, chalk.green(msg));
  },

  warning: function warning() {
    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    var msg = format.apply(undefined, args);
    console.warn(chalk.white(prefix), sep, chalk.yellow(msg));
  },

  error: function error() {
    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    var error = args[0],
        rest = args.slice(1);

    if (error instanceof Error) error = error.stack ? error.stack : error.message;
    var msg = format.apply(undefined, [error].concat(_toConsumableArray(rest)));
    console.error(chalk.white(prefix), sep, chalk.red(msg));
  }

};