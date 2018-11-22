const chalk = require('chalk')
const format = require('util').format

const prefix = 'Talk'
const sep = chalk.gray('>')

module.exports = {

  info: (...args) => {
    const msg = format.apply(undefined, args)
    console.info(chalk.white(prefix), sep, chalk.cyan(msg))
  },

  success: (...args) => {
    const msg = format.apply(undefined, args)
    console.log(chalk.white(prefix), sep, chalk.green(msg))
  },

  warning: (...args) => {
    const msg = format.apply(undefined, args)
    console.warn(chalk.white(prefix), sep, chalk.yellow(msg))
  },

  error: (...args) => {
    let [error, ...rest] = args
    if (error instanceof Error) error = error.stack ? error.stack : error.message
    const msg = format.apply(undefined, [error,...rest])
    console.error(chalk.white(prefix), sep, chalk.red(msg))
  }
  
}

