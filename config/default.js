module.exports = {
  port: 8080,
  https: false,
  open: false,
  watch: false,
  proxy: false,
  proxyConfig: [{
    proxyTarget: null,
    proxyContext: ['/api'],
    changeOrigin: null
  }],
  provide: {},
  define: {},
  alias: {},
  externals: {},
  base: [],
  compress: true,
  noInfo: true,
  mockDir: 'mock',
  mockContext: ['/api'],
  mockCallback: 'callback',
  staticDir: 'static',
  staticContext: '/static',
  copyDir: 'src/assets',
  publicPath: '../',
  jsx: 'React.createElement',
  vue: false,
  browserslist: [
    '> 1%',
    'last 2 versions',
    'ie >= 8'
  ],
  allowedHosts: [
    '.51talk.com'
  ],
  cookie: {},
  toRem: false,
  toRemOption: {
    replace: true,
    rootValue: 75,
    unitPrecision: 5,
    propList: ['*'],
    selectorBlackList: [],
    mediaQuery: false,
    minPixelValue: 0
  },
  polyfill: {
    promise: true
  },
  dest: 'dist',
  inlineFlexible: true,
  normalizeCss: true,
  versionFile: false
}
