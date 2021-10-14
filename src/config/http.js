/**
 * by Alen-gao / ndoegeek.gao@gmail.com * 2018-08-15 18:44:57 */

 const settings = require('../../config/settings')

 import axios from 'axios'
 import { Message } from 'element-ui'
 window.elMessage = Message
 // console.log('Message',Object.keys(Message))
 axios.defaults.withCredentials = true
 let http = {};
 const API_HOST =(()=>{
   let hostArr=window.location.host.split('.')
   let host=hostArr[hostArr.length-2]+'.'+hostArr[hostArr.length-1]
   return process.env.API_HOST=='/rest'?'/rest':process.env.API_HEAD+host 
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
 
 http.base = async (type, url, params, callback) => {
   let token = window.localStorage.getItem('token') || 'asdadasdasdasd';
   let types = 'postJson' ? 'post' : type
   params = filterNull(params) || {}
   let islogin = url === process.env.LOGINURL;
   // auth = params.auth, !auth && !token && !islogin
   let err = '';
   if (!token && !islogin) {
     window.location.href = process.env.LOGINURL;
     return;
   };
   let config = {
     headers: {
       "X-Requested-With": "XMLHttpRequest",
     },
     url: API_HOST + url,
     method: types,
   };
   config.timeout = params.timeout || 60 * 1000
   // config['params'] = params
   type == 'postJson' ? config['data'] = params : config['params'] = params;
   let {
     data,
     status,
     statusText
   } = await axios(config).catch((error) => {
     
     Message.error(error.toString());
     err = error;
   }) || {
       data: {
         data: [],
         code: -100,
         msg: '后台接口出现故障:' + err
       }
     }
     if(data.code!=0){
      let locationParams = window.location.href.split('?')
      if(data.code == 10){
        Message.error('登录失效！');
        setTimeout(() => {
        window.location.href = '/login'+(locationParams.length>1?`?${locationParams[1]}`:'')
        }, 1000)
      }else if(data.code == 11){
        Message.error('未登录！');
        setTimeout(() => {
        window.location.href = '/login'+(locationParams.length>1?`?${locationParams[1]}`:'')
        }, 1000)
      }else{
        Message.error(data.msg || '接口异常错误');
      }
    }
     callback && callback(data);
   return {
     data
   }
 };
 
 ['get', 'post', 'postJson'].map((x) => http[x] = async (url, d, callback) => {
   let res = await http.base(x, url, d, callback);
   return res
 })
 
 
 http.download = function (url, d) {
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
 };
 http.down = async (url, params, callback) => {
   let token = window.localStorage.getItem('token') || 'asdadasdasdasd';
   params = filterNull(params) || {}
   let islogin = url === process.env.LOGINURL;
   // auth = params.auth, !auth && !token && !islogin
   let err = '';
   if (!token && !islogin) {
     window.location.href = process.env.LOGINURL;
     return;
   };
   let config = {
     headers: {
       "X-Requested-With": "XMLHttpRequest",
       // "token": token
     },
     url: API_HOST + url,
     method: 'post'
   };
   config.timeout = params.timeout || 60 * 1000
   // config['params'] = params
   config['data'] = params
   let {
     data,
     status,
     statusText
   } = await axios(config).catch((error) => {
     Message.error(error.toString());
     err = error;
   })|| {
       data: {
         data: [],
         code: -100,
         msg: '后台接口出现故障:' + err
       }
     }
     if (!islogin && data.code == '-40001') {
       Message.error('登录失效！');
       setTimeout(() => {
         window.location.href = process.env.LOGINURL
       }, 1000)
       return;console.log()
     } 
     if(data.code!=0){
      let locationParams = window.location.href.split('?')
      if(data.code == 10){
        Message.error('登录失效！');
        setTimeout(() => {
        window.location.href = '/login'+(locationParams.length>1?`?${locationParams[1]}`:'')
        }, 1000)
      }else if(data.code == 11){
        Message.error('未登录！');
        setTimeout(() => {
        window.location.href = '/login'+(locationParams.length>1?`?${locationParams[1]}`:'')
        }, 1000)
      }else{
        Message.error(data.msg || '接口异常错误');
      }
    } 
     callback && callback(data);
   
     if(data.code==0){
       let link = document.createElement('a')
       link.style.display = 'none'
       link.download=""
       link.href = data.data.url
       document.body.appendChild(link)
       link.click()
       document.body.removeChild(link)      
       // let link = document.createElement('form')
       // link.setAttribute('method', 'get')
       // link.setAttribute("action",data.data.url)
       // document.body.appendChild(link)
       // link.submit()
       //document.body.removeChild(link)
     }
   // console.log(data,Object.prototype.toString.call(data))
   // if (Object.prototype.toString.call(data) == '[object Blob]') {
   //   let url = window.URL.createObjectURL(new Blob([data]))
   //   if (window.navigator.msSaveOrOpenBlob) {
   //     navigator.msSaveBlob(blob, fileName);
   //   } else {
   //     let link = document.createElement('a')
   //     link.style.display = 'none'
   //     link.href = url
   //     link.setAttribute('download', 'order.xls')
   //     document.body.appendChild(link)
   //     link.click()
   //   }
   // }
 };
 http.install = (Vue, options) => {
   Vue.prototype.$http = http
 }
 
 
 export default http
 