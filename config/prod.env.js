"use strict";
let HOST = process.env.npm_lifecycle_event;

const productbaseConfig = {
  test: {
    //测试
    baseURL: '"https://oms-api.xshoppy.top"',
    baseURL_emysale: '"https://emysale-oms-api.xshoppy.top"',
    // appId: '"dingoaiiyhq3m6x1eectol"',
    appId: '"dingeebofojxqapv0mig"',
    webURL: '"https://oms.xshoppy.top"'
  },
  beta: {
    //灰度
    baseURL: '"https://gray-oms-api.xshoppy.shop"',
    baseURL_emysale: '"https://gray-oms-api.emysale.com"',
    // appId: '"dingoandagmjhphbwcrgwz"',
    appId: '"ding9lll5jeyh1swyahy"',
    webURL: '"https://gray-oms.xshoppy.shop"'
  },
  build: {
    //生产
    baseURL: '"https://oms-api.xshoppy.shop"',
    baseURL_emysale: '"https://oms-api.emysale.com"',
    appId: '"ding9lll5jeyh1swyahy"',
    webURL: '"https://oms.xshoppy.shop"'
  },
  deve: {
    //开发
    baseURL: '"https://oms-api.jrtkqk.com"',
    baseURL_emysale: '"https://emysale-oms-api.jrtkqk.com"',
    // appId: '"dingoadjew0mdqlwlpxxtu"',
    appId: '"dingeebofojxqapv0mig"',
    webURL: '"https://oms.jrtkqk.com"'
  },
  devTest: {
    //预测试
    baseURL: '"https://oms-api2.jrtkqk.com"',
    baseURL_emysale: '"https://emysale-oms2-api.jrtkqk.com"',
    // appId: '"dingoao3qrhz4zvmukgwl4"',
    appId: '"dingeebofojxqapv0mig"',
    webURL: '"https://oms2.jrtkqk.com"'
  },
  dev: {
    //本地
    baseURL: '"https://oms-api.jrtkqk.com"',
    baseURL_emysale: '"https://emysale-oms-api.jrtkqk.com"',
    // appId: '"dingoadjew0mdqlwlpxxtu"',//old appId
    appId: '"dingeebofojxqapv0mig"',
    webURL: `"localhost:8080"`
  }
};
module.exports = {
  NODE_ENV: '"production"',
  BASE_API: productbaseConfig[HOST]["baseURL"],
  BASE_API_EMYSALE: productbaseConfig[HOST]["baseURL_emysale"],
  APP_ID: productbaseConfig[HOST]["appId"],
  WEB_URL: productbaseConfig[HOST]["webURL"]
};
