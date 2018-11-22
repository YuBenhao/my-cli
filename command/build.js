const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const rimraf = require('rimraf')
const Pea = require('pea-js').default

module.exports = () => {
  const relative = require('../utils/getPath')
  const webpackConfig = require('../webpack')
  const { getConfig } = require('../config')
  const config = getConfig()

  const distPath = path.isAbsolute(config.dest)
    ? config.dest
    : relative.cwd(config.__projectPath, config.dest)

  const distExists = fs.existsSync(distPath)
  const ctrl = new Pea()

  ctrl.use(next => {
    if (!distExists) return next()
    rimraf(distPath, next)
  }).use(() => {
    const compiler = webpack(webpackConfig)
    const handler = (err, stats) => {
      if (err) {
        console.error(err.stack || err)
        if (err.details) {
          console.error(err.details)
        }
        process.exit(1)
      }

      const info = stats.toJson()
      if (stats.hasErrors()) {
        console.error(info.errors.join(''))
        process.exit(1)
      }

      if (stats.hasWarnings()) {
        console.warn(info.warnings.join(''))
        process.exit(1)
      }
      if (config.watch) {
        console.log(`[${new Date().toLocaleString()}] 编译完成`)
      } else {
        console.log('编译完成')
        process.exit(0)
      }
    }

    if (config.watch) {
      compiler.watch({
        ignored: /node_modules/
      }, handler)
    } else {
      compiler.run(handler)
    }
  }).start()
}
