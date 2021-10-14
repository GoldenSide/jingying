"use strict";
let HOST = process.env.npm_lifecycle_event;

const merge = require("webpack-merge");
const prodEnv = require("./prod.env");

const devebaseConfig = {
  dev: {
    //本地
    baseURL: '"https://oms-api.jrtkqk.com"',
    baseURL_emysale: '"https://emysale-oms-api.jrtkqk.com"',
    // appId: '"dingoadjew0mdqlwlpxxtu"',//old appId
    appId: '"dingeebofojxqapv0mig"',
    webURL: `"localhost:8080"`
  }
};
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: devebaseConfig[HOST]["baseURL"],
  BASE_API_EMYSALE: devebaseConfig[HOST]["baseURL_emysale"],
  APP_ID: devebaseConfig[HOST]["appId"],
  WEB_URL: devebaseConfig[HOST]["webURL"]
});
