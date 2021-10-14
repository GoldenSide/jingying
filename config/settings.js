// gulp file path 
// Alen-gao data: 2018-09-04
module.exports = {
  proxyTable: {
    '/rest': {
      // target: 'http://gaopeng.seller.backend-manager.com',
      // target: 'http://xiaxiang.mgr-backend.com',
    //   target: 'http://xionglei.pepper.com',
      target: 'https://mgr-api.jrtkqk.com',
      changeOrigin: true,
      secure: false,  // https代理需要加这一句
      cookieDomainRewrite: "nicholas",
      pathRewrite: {
        '^/rest': ''
      }
    }
  },
  // download: 'http://aishujian.beta.seller-backend.jhongnet.com'
}
