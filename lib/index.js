'use strict';

var program = require('commander');
var pkg = require('../package.json');
var chalk = require('chalk');

var _require = require('./config'),
    setConfig = _require.setConfig;

program.version(chalk.red(pkg.version)).on('--help', function () {
  console.log();
  console.log(chalk.blue('例如:'));
  console.log(chalk.blue('  $ my-cli init <模板名称> [项目名称]'));
  console.log();
});

program.command('init <template> [projectname]').description(chalk.red('  指定一个模板，初始化项目')).option('-c, --clone', '使用 git clone').option('-n, --npm', '使用 npm 安装').option('-y, --yarn', '使用 yarn 安装').action(require('./command/init')).on('--help', function () {
  console.log();
  console.log(chalk.blue('  如: $ my-cli init <模板名称> [项目名称]'));
  console.log();
});

program.command('start [projectName]').description(chalk.red('  开发一个项目')).option('-o --open', '打开浏览器').option('-p --port <port>', '指定服务端口').option('-P --proxy', '开启联调模式').option('-H --https', '开启https服务').action(function (projectName, option) {
  process.env.NODE_ENV = 'development';
  setConfig({
    open: option.open,
    proxy: option.proxy,
    https: option.https,
    __projectPath: !projectName || projectName === '.' ? '.' : projectName,
    __env: 'development'
  });

  if (option.port) {
    setConfig({ port: option.port });
  }

  require('./command/start')();
});

program.command('build [projectName]').description(chalk.red('  打包一个项目')).option('-w --watch', '监听模式打包').option('--no-compress', '不压缩代码').action(function (projectName, option) {
  process.env.NODE_ENV = 'production';
  setConfig({
    watch: option.watch,
    compress: option.compress,
    __projectPath: !projectName || projectName === '.' ? '.' : projectName,
    __env: 'production'
  });

  require('./command/build')();
});

program
// nohelp: * 命令不展示在 help 信息中
.command('*', { noHelp: true }).action(function () {
  // 输出 help 信息, 并 exit
  program.help(function (txt) {
    return txt;
  });
  // 输出 help 信息, 不 exit
  // program.outputHelp(txt => txt)
});

program.parse(process.argv);