'use strict';

var fs = require('fs');
var path = require('path');
var getPath = require('../utils/getPath');
var logger = require('../utils/logger');

var _require = require('../config'),
    getConfig = _require.getConfig;

var config = getConfig();
var exists = false;
var entryInfos = void 0;

var pagesRoot = getPath.cwd(config.__projectPath, 'src', 'pages');
if (!fs.existsSync(pagesRoot)) {
  logger.error('Oops, ' + pagesRoot + ' \u76EE\u5F55\u4E0D\u5B58\u5728\uFF01');
  process.exit(1);
}

entryInfos = fs.readdirSync(pagesRoot).reduce(function (entryInfos, dirName) {
  entryInfos.push(genEntryInfo(path.join(pagesRoot, dirName)));
  return entryInfos;
}, []);

function genEntryInfo(pageName) {
  var templateExtensions = ['html', 'pug', 'ejs', 'hbs'];
  var entryExtensions = ['js', 'ts'];

  var template = void 0,
      templateExists = void 0,
      templateExtension = void 0;
  var entry = void 0,
      entryExists = void 0,
      entryExtension = void 0;

  while (!templateExists && templateExtensions.length) {
    templateExtension = templateExtensions.shift();
    template = getPath.cwd(pageName + '/index.' + templateExtension);
    templateExists = fs.existsSync(template);
  }

  while (!entryExists && entryExtensions.length) {
    entryExtension = entryExtensions.shift();
    entry = getPath.cwd(pageName + '/index.' + entryExtension);
    entryExists = fs.existsSync(entry);
  }

  if (!exists) {
    exists = entryExists || templateExists;
  }

  return {
    pageName: path.basename(pageName),
    entry: entry,
    entryExists: entryExists,
    template: template,
    templateExists: templateExists
  };
}

if (!exists) {
  console.log('');
  logger.error('Oops, 没有找到页面！');
  console.log('');
  process.exit(1);
}

module.exports = entryInfos;