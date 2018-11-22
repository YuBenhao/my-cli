const defaultConfig = require('./default')
const getFileConfig = require('./file')

let dirty = false
let config = {
  ...defaultConfig
}

module.exports = {
  getConfig (key) {
    return key ? config[key] : config
  },

  setConfig (cfg) {
    if (dirty) {
      config = {
        ...config,
        ...cfg
      }
    } else {
      config = {
        ...config,             // 默认的设置参数
        ...getFileConfig(cfg.__projectPath),         // 项目中的 redskull、browserlist 参数
        ...cfg                 // 命令行传入的参数
      }
      dirty = true
    }
  }
}
