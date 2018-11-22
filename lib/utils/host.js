'use strict';

/* 
* 获取 ip 
* 也可直接使用 const ip = require('ip'), 通过 ip.address() 获取
*/

var os = require('os');

var ifaces = os.networkInterfaces();
var host = ['127.0.0.1'];

Object.keys(ifaces).some(function (dev) {
  ifaces[dev].some(function (details) {
    if (details.family === 'IPv4' && !details.internal) {
      host.push(details.address);
    }
  });
});

module.exports = host;