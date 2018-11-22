const path = require('path')

const baseCmd = path.resolve(__dirname, '../')
const baseCwd = process.cwd()

const cmd = (...rest) => {
  rest.unshift(baseCmd)
  return path.resolve.apply(null, rest)
}

const cwd = (...rest) => {
  rest.unshift(baseCwd)
  return path.resolve.apply(null, rest)
}

module.exports = { cmd, cwd }