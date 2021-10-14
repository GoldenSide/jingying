/*!
 * utils.js 
 * (c) 2018-09-28 Alen-gao
 * Web common method extraction
 * 
 */

class utils {
  // 月数和天数不足10天时 前面补充 0
  doHandleMonth(month) {
    return month.toString().length == 1 ? "0" + month : month;
  }

  // 根据天数获取日期
  getdates(day) {
    let startTime = new Date(),
      endTime = new Date(),
      arr = [],
      Stime = "",
      Etime = "";
    endTime.setTime(endTime.getTime() - 1000 * 60 * 60 * 24 * 1);
    startTime.setTime(startTime.getTime() - 1000 * 60 * 60 * 24 * day);
    Stime =
      startTime.getFullYear() +
      "-" +
      this.doHandleMonth(startTime.getMonth() + 1) +
      "-" +
      this.doHandleMonth(startTime.getDate());
    Etime =
      endTime.getFullYear() +
      "-" +
      this.doHandleMonth(endTime.getMonth() + 1) +
      "-" +
      this.doHandleMonth(endTime.getDate());
    arr.push(Stime);
    day == 0 ? arr.push(Stime) : arr.push(Etime);
    return arr;
  }

  // 根据日期获取天数
  getdays(arr) {
    let startTime = new Date(arr[0]).getTime(),
      endTime = new Date(arr[1]).getTime(),
      day = "";
    return (endTime - startTime) / 86400000;
  }

  // 格式化金钱
  money(value) {
    if (value == 0 || !value) {
      return "0.00";
    }
    value = Number(value).toFixed(2);
    var monArr = value.split(".");
    return (
      monArr[0].replace(/(?=((?!\b)\d{3})+$)/g, ",") +
      "." +
      (monArr[1] ? monArr[1] : "00")
    );
  }

  // 检测对象是否存在某个值
  isExist(origin, obj) {
    let index = -1,
      o = [...origin],
      len = Object.keys(obj).length;
    o.map((v, i) => {
      Object.keys(obj).forEach(ele => {
        if (v[ele] && obj[ele] == v[ele]) {
          len--;
          len <= 0 && (index = i);
        }
      });
    });
    return index;
  }
  formatDate(time = new Date()) {
    var date = new Date(time);

    var year = date.getFullYear(),
      month =
        date.getMonth() + 1 > 9
          ? date.getMonth() + 1
          : "0" + (date.getMonth() + 1), //月份是从0开始的
      day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate(),
      hour = date.getHours(),
      min = date.getMinutes(),
      sec = date.getSeconds();
    var newTime =
      year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
    return newTime;
  }
  numberInpChange(item, key, min = 0, max) {
    let value = item[key].replace(/\,/g, "");

    if (
      Number(value).toString() === "NaN" ||
      Number(value) < min ||
      value == ""
    ) {
      item[key] = "";
    } else if (max && Number(value) > max) {
      item[key] = "";
    } else {
      item[key] = Number(value).toFixed(2);
    }
  }
  numberInpChange2(val, min = 0, max, deci = 2) {
    let value = val.replace(/\,/g, "");
    if (
      Number(value).toString() === "NaN" ||
      Number(value) < min ||
      value == ""
    ) {
      value = "";
    } else if (max && Number(value) > max) {
      value = "";
    } else {
      value = Number(value).toFixed(deci);
    }
    console.log(value);
    return value;
  }
  numberInpFocus(item, key) {
    let value = item[key].replace(/\,/g, "");
    item[key] = value;
    console.log(value);
  }
  numberInpBlur(item, key, min = "", zeroQqual = true) {
    console.log(value);
    let value = item[key].replace(/\,/g, "");
    if (
      Number(value).toString() === "NaN" ||
      (zeroQqual ? Number(value) <= 0 : Number(value) < 0) ||
      Number(value) < Number(min.replace(/\,/g, ""))
    ) {
      item[key] = "";
    } else {
      item[key] = this.money(value);
    }
  }

  // 时间距离tag
  intervalTime(start, end = new Date()) {
    let a = new Date(start).getTime(),
      b = new Date().getTime();
    let c = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    ).getTime();
    let d = new Date(
      new Date(start).getFullYear(),
      new Date(start).getMonth(),
      new Date(start).getDate()
    ).getTime();
    let dayInterval = (c - d) / (24 * 60 * 60000);
    if (dayInterval >= 2 && dayInterval <= 7) {
      return {
        value: start,
        desc: dayInterval + "天前",
        format: true
      };
    }
    let interval = b - a;
    //一分钟之内
    if (interval < 60000) {
      return {
        value: start,
        desc: "一分钟内",
        format: true
      };
    } else if (interval >= 60000 && interval < 60000 * 60) {
      //一个小时之内
      return {
        value: start,
        desc: Math.floor(interval / 60000) + "分钟前",
        format: true
      };
    } else if (interval >= 60000 * 60 && interval < b - c) {
      //当天几点几分
      return {
        value: start,
        desc:
          new Date(start).getHours() +
          ":" +
          (new Date(start).getMinutes() > 9
            ? new Date(start).getMinutes()
            : "0" + new Date(start).getMinutes()),
        format: true
      };
    }
    if (interval > b - c && interval < 60000 * 60 * 48 && dayInterval < 2) {
      return {
        value: start,
        desc:
          "昨天 " +
          (new Date(start).getHours() > 9
            ? new Date(start).getHours()
            : "0" + new Date(start).getHours()) +
          ":" +
          (new Date(start).getMinutes() > 9
            ? new Date(start).getMinutes()
            : "0" + new Date(start).getMinutes()),
        format: true
      };
    }
    return {
      value: start,
      desc: start.replace(/\-/g, "/"),
      format: false
    };
  }
  //防抖
  debounce = (fn, interval = 300) => {
    let timer;
    return function() {
      let ctx = this;
      let args = arguments;
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        timer = null;
        fn.apply(ctx, args);
      }, interval);
    };
  };

  //节流
  throttle = (fn, interval = 300) => {
    let last;
    let timer;
    interval = interval || 600;
    return function() {
      let ctx = this;
      let args = arguments;
      let now = new Date();
      if (last && now - last < interval) {
        clearTimeout(timer);
        timer = setTimeout(function() {
          last = now;
          fn.apply(ctx, args);
        }, interval);
      } else {
        last = now;
        fn.apply(ctx, args);
      }
    };
  };

  isvalidPhone = str => {
    const reg = /^(1[3-9])\d{9}$/;
    return reg.test(str);
  };
  validPhone = (rule, value, callback) => {
    if (rule.required && !value) {
      callback(new Error("请输入电话号码"));
    } else if (value && !this.isvalidPhone(value)) {
      callback(new Error("请输入正确的11位手机号码"));
    } else {
      callback();
    }
  };
  deepClone = obj => {
    let objClone = Array.isArray(obj) ? [] : {};
    if (obj && typeof obj === "object") {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          //判断ojb子元素是否为对象，如果是，递归复制
          if (obj[key] && typeof obj[key] === "object") {
            objClone[key] = this.deepClone(obj[key]);
          } else {
            //如果不是，简单复制
            objClone[key] = obj[key];
          }
        }
      }
    }
    return objClone;
  };
  // 清除domain下所有可读的cookie
  clearAllCookie() {
    let keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
      for (var i = keys.length; i--; )
        document.cookie =
          keys[i] + "=0;path='/';expires=" + new Date(0).toUTCString();
    }
  }
  // 快速弹窗配置
  deleConfig(that, text, title, btns = [], cb, type = "warning", close) {
    that
      .$confirm(text, title, {
        confirmButtonText: btns[0],
        cancelButtonText: btns[1],
        type,
        dangerouslyUseHTMLString: true
      })
      .then(() => {
        if (typeof cb == "function") {
          cb();
        } else {
          that[cb]();
        }
      })
      .catch(() => {
        if (close && typeof close == "function") {
          close();
        }
      });
  }
  // 递归删除json对象中的某个属性
  deleRecursiveNullKey(source = [], key) {
    source.forEach(v => {
      if (v.hasOwnProperty(key)) {
        if (v[key].length <= 0) {
          delete v[key];
        } else {
          this.deleRecursiveNullKey(v[key], key);
        }
      }
    });
    return source;
  }
}
const munfocus$ = () => {
  setTimeout(() => {
    document.querySelector(".el-message-box__btns .el-button--primary").blur();
  }, 100);
};
utils.install = (Vue, options) => {
  Vue.prototype.utils = new utils();
  Vue.filter("money", Vue.prototype.utils.money);
  //移除messagebox自动聚焦
  Vue.directive("munfocus", {
    inserted: function(el) {
      el.addEventListener("click", function() {
        munfocus$();
      });
    }
  });
  Vue.prototype.munfocus$ = munfocus$;
};

export default utils;
