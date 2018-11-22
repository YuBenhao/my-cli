'use strict';

var fs = require('fs');

var inquirer = require('inquirer');
var ora = require('ora');
var downGitRepo = require('download-git-repo');
var execa = require('execa');

var logger = require('../utils/logger');
var getPath = require('../utils/getPath');

var templates = {
  'react-demo': 'ccbabi/talk-template-static'
};

module.exports = function (template, projectname, option) {

  if (!templates.hasOwnProperty(template)) {
    logger.warning('Opps，不存在模板%s，无法初始化', template);
    // 退出码1, 未捕获异常 : 有一个未被捕获的异常, 并且没被一个 domain 或 an 'uncaughtException' 事件处理器处理
    process.exit(1);
  }

  projectname = projectname || './';
  // 已创建 project 则在 project 目录下初始化, 否则在当前目录初始化
  if (fs.existsSync(projectname)) {
    var message = projectname === './' ? '要在当前目录初始化模板吗？' : '\u76EE\u5F55 ' + projectname + ' \u5DF2\u5B58\u5728\uFF0C\u7EE7\u7EED\u751F\u6210\uFF1F';
    inquirer.prompt([{
      type: 'confirm',
      name: 'answer',
      message: message
    }]).then(function (answer) {
      if (answer) downTemplate();
    }).catch(function (err) {
      throw err;
    });
  } else {
    downTemplate();
  }

  function downTemplate() {
    var spinner = ora().start('[1/2] 正在初始化模板...');
    spinner.color = 'yellow';
    downGitRepo(templates[template], getPath.cwd(projectname), { clone: option.clone }, function (err) {
      if (err) {
        spinner.fail('下载错误，未能完成初始化模板');
        process.exit(1);
      }
      spinner.succeed('[1/2] 已完成模板初始化');
      setTimeout(install, 0);
    });
  }

  function install() {
    var spinner = ora().start('[2/2] 正在安装依赖...');
    var command = option.npm ? ['npm', ['install', '--registry=https://registry.npm.taobao.org'], { cwd: getPath.cwd(projectname) }] : ['yarn', { cwd: getPath.cwd(projectname) }];
    execa.apply(undefined, command).then(function () {
      spinner.succeed('[2/2] 已完成依赖安装');
    });
  }
};