import axios from "axios";
import { Message } from "element-ui";
import router from "@/router";
import context from "../main";
import store from "@/store";
import { getBaseUrl, haveToken } from "@/utils/cookie";
import { sign_md5 } from "./md5";
axios.defaults.withCredentials = false; //cookie 验证必须设置为true
const errorLog = function(res, type = "default") {
  if (process.env.NODE_ENV == "production") return;
  console.log(
    `%c request【Error】 url: ${res.config.url}`,
    "color: #F74242",
    "result: ",
    res
  );
  return;
};
const successLog = function(res, type = "default") {
  if (process.env.NODE_ENV == "production") return;
  console.log(
    `%c request 【Success】 url: ${res.config.url}`,
    "color: #0EB13C",
    "result:",
    res.data
  );
  return;
};

let cancelArr = [];
const service = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 45000,
  headers: {
    Authorization: "",
    Sign: ""
  }
});
service.interceptors.request.use(
  config => {
    config.cancelToken = new axios.CancelToken(cancel => {
      cancelArr.push({
        cancel,
        url: config.url,
        timeStamp: new Date().getTime()
      });
      let len = cancelArr.length;
      let last = cancelArr[len - 1];
      let lastSec = cancelArr[len - 2];
      if (
        len >= 2 &&
        last.url == lastSec.url &&
        last.timeStamp - lastSec.timeStamp <= 1500 &&
        config.isValid
      ) {
        last.cancel();
        cancelArr.splice(len - 1, 1);
      }
    });
    config.baseURL = getBaseUrl() || process.env.BASE_API;
    config.headers.Authorization = haveToken();
    let obj = context.utils.deepClone(config.data);
    config.headers.Sign = sign_md5(obj, haveToken());
    return config;
  },
  error => {
    Message.closeAll();
    Message({
      message: error,
      type: "error",
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);
service.interceptors.response.use(
  response => {
    if (response.data.code == 0) {
      successLog(response);
      return response.data;
    } else {
      Message.closeAll();
      Message({
        message: response.data.msg || "请求错误，请刷新后重试",
        type: "error",
        duration: 5 * 1000
      });
      errorLog(response);
      if (response.data.code == 10 || response.data.code == 11) {
        context.utils.clearAllCookie();
        router.push({ path: "/login" });
      }
      return Promise.reject(response);
    }
  },
  error => {
    if (
      error.code == "ECONNABORTED" &&
      error.message.indexOf("timeout") != -1
    ) {
      Message({
        message: "请求超时",
        type: "error",
        duration: 5 * 1000
      });
      errorLog(error, "Timeout");
    } else if (error.toString() == "Cancel") {
    }
    return Promise.reject(error);
  }
);
export default service;
export { cancelArr };
