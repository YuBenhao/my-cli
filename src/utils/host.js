/* 
* 获取 ip 
* 也可直接使用 const ip = require('ip'), 通过 ip.address() 获取
*/

const os = require('os')

const ifaces = os.networkInterfaces()
let host = ['127.0.0.1']

Object.keys(ifaces).some(dev => {
   ifaces[dev].some(details => {
    if (details.family === 'IPv4' && !details.internal) {
      host.push(details.address)
    }
  })
})

module.exports = host
