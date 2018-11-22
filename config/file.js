const fs = require('fs')
const getPath = require('../utils/getPath')

module.exports = path => {
  const packagePath = getPath.cwd(path, './package.json')

  if (fs.existsSync(packagePath)) {
    const packageConfig = require(packagePath)
    const redSkullConfig = packageConfig.redskull || {}
    const browserslist = packageConfig.browserslist || {}

    return {
      ...redSkullConfig,
      browserslist
    }
  }
  return {}
}
