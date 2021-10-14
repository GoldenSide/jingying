import axios from 'axios'
import { Message } from 'element-ui'
const settings = require('../../config/settings')
const API_HOST = (() => {
  let hostArr = window.location.host.split('.')
  let host = hostArr[hostArr.length - 2] + '.' + hostArr[hostArr.length - 1]
  return process.env.API_HOST == '/rest' ? '/rest' : process.env.API_HEAD + host
})();
const download = settings.download || API_HOST
const toType = (obj) => {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}
const filterNull = (o) => {
  if (toType(o) !== 'object' || o.nofilter) return o;
  for (var key in o) {
    // if (o[key] === null) {
    //   delete o[key]
    // };
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim();
      // if (o[key].length === 0) {
      //   delete o[key]
      // }
    };
  };
  return o;
}
let timeout = 60 * 1000
let service = axios.create({
  baseURL: API_HOST,
  timeout: timeout,
  withCredentials: true
})
//请求前request拦截器
service.interceptors.request.use(config => {
  // if(store.getters.token){
  //   config.headers['access-token'] = '1213'
  // }
  return config
}, err => {
  console.log(error) // for debug
  Promise.reject(error)
})
//响应后respone拦截器
service.interceptors.response.use(response => {
  const res = response.data 
  if (res.code != 0 && res.status != 200&&res.code !== 3) {
    Message({
      message: res.msg || 'Error',
      type: 'error',
      duration: 5 * 1000
    })
    // return Promise.reject(new Error(res.msg || 'Error'))
    new Error(res.msg || 'Error')
    return false
  }
  else if (res.code === 3) {
    return res
  }
  else {
    return res.data
  }
}, err => {
  Message({
    message: err.message,
    type: 'error',
    duration: 5 * 1000
  })
  new Error(err.msg || 'Error')
  // return Promise.reject(err)
  return false
})
let http = {
  get(url, param = {}) {//get请求
    timeout = param.timeout ? param.timeout : timeout
    return new Promise((resolve, reject) => {
      service({
        method: 'get',
        url,
        params: param,
        timeout
      }).then(res => { 
        resolve(res)
      })
    })
  },
  post(url, param = {}) {//post请求 
    timeout = param.timeout ? param.timeout : timeout
    return new Promise((resolve, reject) => {
      service({
        method: 'post',
        url,
        data: param,
        timeout
      }).then(res => {
        resolve(res)
      })
    })
  },
  postJson(url, param = {}) {//post请求
    timeout = param.timeout ? param.timeout : timeout
    return new Promise((resolve, reject) => {
      service({
        method: 'post',
        url,
        data: param,
        timeout
      }).then(res => {
        resolve(res)
      })
    })
  },
  download(url, d) {
    return new Promise((resolve, reject) => {
      try {
        var iframe, idoc, ihtml, data = filterNull(d);
        iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.name = 'jh_dd_if';
        iframe.id = 'jh_dd_if';
        var form = document.createElement('form');
        var load = function () {
          var doc = iframe.contentWindow || iframe.contentDocument;
          if (doc.document) doc = doc.document;
          var req = doc.body.textContent;
          if (req) {
            var reqData = eval("(" + req + ")") || {}
            if (reqData.code == '00000003' || reqData.code == '00000002') {
              window.location.href = '/JcLogin';
              return;
            };
            if (reqData.code == '00000000') {
              alert('下载成功')
            } else {
              alert(reqData.msg || '下载失败', 'error')
            }
          }
          setTimeout(function () {
            document.body.removeChild(iframe);
            document.body.removeChild(form);
          }, 5000 * 60 * 5)
        }
        iframe.attachEvent ? iframe.attachEvent('onload', load) : iframe.onload = load;
        document.body.appendChild(iframe);
        form.style.display = 'none';
        form.action = download + url;
        form.method = 'GET';
        form.target = 'jh_dd_if';
        Object.keys(data).forEach(function (key) {
          ihtml += "<input type='hidden' name='" + key + "' value='" + (data[key] || '') + "'>";
        });
        form.innerHTML += ihtml;
        document.body.appendChild(form);
        setTimeout(function () {
          form.submit();
        })
        //请求的时间不定
        setTimeout(() => {
          resolve()
        }, 3500);
      } catch (error) {
        reject(error)
        console.error(error)
      }
    })

  },
  down(url, param = {}) {
    timeout = param.timeout ? param.timeout : timeout
    return new Promise((resolve, reject) => {
      service({
        method: 'post',
        url,
        data: param,
        timeout
      }).then(res => {
        console.log(res)
        // if(data.code==0){
        let link = document.createElement('a')
        link.style.display = 'none'
        link.download = ""
        link.href = res.url
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        // }
        resolve(res)
      })
    })

  },
  base: service
}
http.install = (Vue, options) => {
  Vue.prototype.$http = http
}
export default http