const fs = require('fs')

const inquirer = require('inquirer')
const ora = require('ora')
const downGitRepo = require('download-git-repo')
const execa = require('execa')

const logger = require('../utils/logger')
const getPath = require('../utils/getPath')

const templates = {
  'react-demo': 'ccbabi/talk-template-static'
}

module.exports = (template, projectname, option) => {

  if (!templates.hasOwnProperty(template)) {
    logger.warning('Opps，不存在模板%s，无法初始化', template)
    // 退出码1, 未捕获异常 : 有一个未被捕获的异常, 并且没被一个 domain 或 an 'uncaughtException' 事件处理器处理
    process.exit(1)
  }

  projectname = projectname || './'
  // 已创建 project 则在 project 目录下初始化, 否则在当前目录初始化
  if (fs.existsSync(projectname)) {
    message = projectname === './'
      ? '要在当前目录初始化模板吗？'
      : `目录 ${projectname} 已存在，继续生成？`
    inquirer.prompt([{
      type: 'confirm',
      name: 'answer',
      message
    }]).then(answer => {
      if (answer) downTemplate()
    }).catch(err => {
      throw err
    })
  } else {
    downTemplate()
  }

  function downTemplate() {
    const spinner = ora().start('[1/2] 正在初始化模板...')
    spinner.color = 'yellow'
    downGitRepo(templates[template], getPath.cwd(projectname), { clone: option.clone }, err => {
      if (err) {
        spinner.fail('下载错误，未能完成初始化模板')
        process.exit(1)
      }
      spinner.succeed('[1/2] 已完成模板初始化')
      setTimeout(install, 0)
    })
  }

  function install() {
    const spinner = ora().start('[2/2] 正在安装依赖...')
    const command = option.npm ?
      ['npm', ['install', '--registry=https://registry.npm.taobao.org'], { cwd: getPath.cwd(projectname) }]
      : ['yarn', { cwd: getPath.cwd(projectname) }]
    execa(...command).then(() => {
      spinner.succeed('[2/2] 已完成依赖安装')
    })
  }

}