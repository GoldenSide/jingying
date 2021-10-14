<!--  -->
<template>
  <div class="login" :style="boxStyle">
    <div
      style="display: flex; justify-content: center; padding-top: 12rem"
      v-if="showMobile === true"
    >
      <div class="mobile-box">
        <p class="logo">
          <i
            class="iconfont icon-sailinglogoyinshuaban_fanganerfuben3"
            style="font-size: 3.8rem"
          ></i>
        </p>
        <p class="desc">登录你的管理平台</p>
      </div>
    </div>
    <div v-if="showMobile === false" class="login-box">
      <div class="form">
        <p class="logo">
          <i class="iconfont icon-sailinglogoyinshuaban_fanganerfuben3"></i>
        </p>
        <p class="desc">登录你的管理平台</p>

        <div
          class="data"
          style="
            margin-top: 8px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
          "
        >
          <div v-show="isLogin" class="login-qrcode">
            <div id="login_container"></div>
          </div>
          <div v-if="!isLogin && !isLoginAccount" class="jh-loader-box">
            <div class="jh-loader">
              <div class="dot">
                <div class="first"></div>
              </div>
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="jh-logged">正在登录...</div>
            </div>
          </div>
          <div v-show="isLoginAccount">
            <el-form
              ref="login"
              :model="formData"
              style="width: 366px; margin: 58px auto 0 auto"
            >
              <el-form-item
                class="seller_email"
                prop="name"
                :rules="[{ required: true, message: '请输入账号', trigger: 'blur' }]"
              >
                <el-input
                  @keyup.enter.native="login"
                  type="text"
                  style="width: 366px"
                  v-model.trim="formData.name"
                  placeholder="请输入账号"
                >
                  <i
                    slot="suffix"
                    class="iconfont icon-youxiang"
                    style="
                      font-size: 20px;
                      line-height: 46px;
                      color: #1a1d2c;
                      margin-right: 0px;
                    "
                  ></i>
                </el-input>
              </el-form-item>
              <el-form-item
                class="seller_email"
                prop="passwd"
                :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]"
              >
                <el-input
                  @keyup.enter.native="login"
                  type="password"
                  style="width: 366px"
                  v-model.trim="formData.passwd"
                  placeholder="请输入密码"
                >
                  <i
                    slot="suffix"
                    class="iconfont icon-youxiang"
                    style="
                      font-size: 20px;
                      line-height: 46px;
                      color: #1a1d2c;
                      margin-right: 0px;
                    "
                  ></i>
                </el-input>
              </el-form-item>
              <p class="item" style="margin-top: 30px">
                <el-button
                  style="width: 366px; height: 46px"
                  type="primary"
                  @click="loginApply()"
                  >登录</el-button
                >
              </p>
            </el-form>
          </div>
          <a class="login-type" @click="loginType" v-if="isDev">{{ loginTypeTxt }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "login",
  data() {
    return {
      showMobile: false,
      appid: process.env.APP_ID,
      aliUrl: "https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=",
      param: "&response_type=code&scope=snsapi_login&state=STATE&",
      isLogin: true,
      loginTypeTxt: "切换账号登录",
      isLoginAccount: false,
      formData: {
        name: "",
        passwd: "",
      },
      islogin: false,
      loading: false,
    };
  },

  computed: {
    boxStyle() {
      return {
        width: "100%",
        height: "100%",
        background: "url(../../../static/img/bg.jpg) center center",
        backgroundSize: "contain",
      };
    },
    isDev() {
      return process.env.NODE_ENV == "development";
    },
  },
  mounted() {
    if (this._isMobile()) {
      this.showMobile = true;
    } else {
      this.showMobile = false;
    }
    this.initDing();
  },
  methods: {
    hanndleMessage({ origin, data }) {
      if (origin == "https://login.dingtalk.com" && typeof data == "string") {
        if (data == "IS_NEED_PIXEL_INJECT") return;
        var url = `${this.userLoginUrl}&loginTmpCode=${data}`;
        window.location.href = url;
      }
    },
    loginType() {
      if (this.isLoginAccount === true) {
        this.isLoginAccount = false;
        this.isLogin = true;
        this.loginTypeTxt = "切换账号登录";
        this.initDing();
      } else {
        this.isLoginAccount = true;
        this.isLogin = false;
        this.loginTypeTxt = "切换钉钉登录";
      }
    },
    _isMobile() {
      let flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      );
      return flag;
    },
    loginApply(code = {}) {
      if (process.env.NODE_ENV == "development") {
        code = { code: "123456" };
      }
      this.loginAct(code).then((response) => {
        if (response.code == 0) {
          if (process.env.NODE_ENV == "production") {
            window.location.href = process.env.WEB_URL + "/#/index";
          } else {
            this.$router.push({ path: "/index" });
          }
        }
      });
      return;
    },
    initDing() {
      let that = this;
      let href = window.location.href;
      if (href.indexOf("?code=") != -1) {
        let start = href.indexOf("?"),
          end = href.indexOf("&"),
          code = href.substring(start + 6, end);
        this.loginApply({ code });
      }
      if (this.showMobile === false) {
        that.userLoginUrl =
          that.aliUrl + that.appid + that.param + "redirect_uri=" + process.env.WEB_URL; // that.hostUrl
        DDLogin({
          id: "login_container",
          goto: encodeURIComponent(that.userLoginUrl),
          style: "border:none;background-color:#FFFFFF;",
          width: "300",
          height: "300",
        });
        if (typeof window.addEventListener != "undefined") {
          window.addEventListener("message", that.hanndleMessage, false);
        } else if (typeof window.attachEvent != "undefined") {
          window.attachEvent("onmessage", that.hanndleMessage);
        }
      }
    },
    loginSystem() {
      this.$refs.login.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.login(this.formData)
            .then((res) => {
              if (res) {
                this.$message.success("登录成功");
                //  window.location.href = `https://${process.env.HREF_URL}/admin/mobile/boardData`;
                this.$router.push({ path: "/mobile/boardData" });
                // setTimeout(() => {
                //   this.$router.push({
                //     path: this.redirect ? this.redirect : "/",
                //     query: this.getOtherQuery(this.$route.query)
                //   });
                // }, 1000);
              }
              this.loading = false;
            })
            .catch((fail) => {
              this.loading = false;
            });
        }
      });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
    ...mapActions("user", ["loginAct", "GetUserInfo"]),
  },
};
</script>

<style lang="scss" scoped>
.login {
  // .mobile-box {
  //   .desc {
  //     font-size: 1.5rem;
  //     text-align: center;
  //     font-weight: 400;
  //     color: rgba(26, 29, 44, 1);
  //     line-height: 2.0625rem;
  //   }
  //   width: 24rem;
  //   height: 18rem;
  //   margin-top: 8px;
  //   text-align: center;
  //   display: flex;
  //   flex-direction: column;
  //   /* align-items: center; */
  //   border-radius: 0.5rem;
  //   box-shadow: 0 0 0.2em, 0 0 0.4em, 0 0 0.6em, 0 0 0.8em, 0 0 0.1em,
  //     0 0 0 0.05em rgba(255, 255, 0, 0.1);
  //   background: white;
  //   box-shadow: 0px 1px 3px 0px rgba(35, 35, 112, 0.2),
  //     0px 0px 0px 1px rgba(67, 67, 145, 0.05);
  // }
  // .login-type {
  //   font-size: 14px;
  //   font-family: PingFangSC-Regular, PingFang SC;
  //   font-weight: 400;
  //   color: rgba(0, 0, 0, 0.85);
  //   position: absolute;
  //   bottom: 30px;
  // }
  .login-box {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    position: relative;
    .login-qrcode {
      width: 300px;
      height: 300px;
      padding-bottom: 20px;
      position: relative;
    }
    .form {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -240px;
      margin-left: -300px;
      width: 600px;
      height: 500px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 1px 3px 0px rgba(35, 35, 112, 0.2),
        0px 0px 0px 1px rgba(67, 67, 145, 0.05);
      border-radius: 4px;
      .logo,
      .desc {
        text-align: center;
      }
      .logo {
        padding: 30px 0 10px 0;
        i {
          font-size: 62px;
        }
      }
      .desc {
        font-size: 24px;

        font-weight: 400;
        color: rgba(26, 29, 44, 1);
        line-height: 33px;
      }
      .item {
        text-align: center;
      }
    }

    .el-button--primary {
      background-color: #2c3e50;
      border-color: #2c3e50;
    }
    .el-button--primary:focus,
    .el-button--primary:hover {
      background: #1c2a2d;
      border-color: #1c2a2d;
    }
    .el-input__inner {
      border-color: #1a1d2c;
      height: 46px;
      color: #1a1d2c;
      box-sizing: border-box;
    }
    .el-checkbox__inner::after {
      border-color: #1a1d2c;
    }
    .el-checkbox__input.is-checked .el-checkbox__inner,
    .el-checkbox__input.is-indeterminate .el-checkbox__inner {
      background-color: #fff;
      border-color: #1a1d2c;
      color: #1a1d2c;
    }
    .el-checkbox__label {
      color: #1a1d2c;
    }
    .el-form-item {
      margin-bottom: 30px;
    }
    .el-form-item.is-success .el-input__inner,
    .el-form-item.is-success .el-input__inner:focus,
    .el-form-item.is-success .el-textarea__inner,
    .el-form-item.is-success .el-textarea__inner:focus {
      border-color: #1a1d2c;
    }
    .el-input__inner:focus {
      border-width: 2px;
    }
    .el-form-item__error::after {
    }
    .el-form-item.is-error .el-input__inner,
    .el-form-item.is-error .el-input__inner:focus,
    .el-form-item.is-error .el-textarea__inner,
    .el-form-item.is-error .el-textarea__inner:focus,
    .el-message-box__input input.invalid,
    .el-message-box__input input.invalid:focus {
      border-color: #1a1d2c;
    }
    .el-form-item__error {
      padding-top: 8px;
      color: #c22f2f;
    }
    .seller_email {
      .el-form-item__error {
        // color:blue;
      }
    }
    .jh-loader-box {
      font-family: "Lato", sans-serif;
      font-weight: 600;
      font-size: 16px;
      color: #fff;
      text-align: center;
      -webkit-font-smoothing: antialiased;
      .jh-logged {
        color: #999;
        bottom: -78px;
        font-size: 16px;
        position: absolute;
      }
    }
    .jh-loader {
      width: 80px;
      height: 80px;
      position: relative;
      margin: auto;
      margin-top: 90px;
      margin-bottom: 100px;
    }
    .jh-loader .dot {
      position: absolute;
      top: 0;
      left: 0;
      width: 80px;
      height: 80px;
      animation: 1.7s dotrotate cubic-bezier(0.775, 0.005, 0.31, 1) infinite;
    }
    .jh-loader .dot:nth-child(1) {
      animation-delay: 0.2s;
    }
    .jh-loader .dot:nth-child(2) {
      animation-delay: 0.35s;
    }
    .jh-loader .dot:nth-child(3) {
      animation-delay: 0.45s;
    }
    .jh-loader .dot:nth-child(4) {
      animation-delay: 0.55s;
    }
    .jh-loader .dot:after,
    .jh-loader .dot .first {
      content: "";
      position: absolute;
      width: 8px;
      height: 8px;
      background: #ccc;
      border-radius: 50%;
      left: 50%;
      margin-left: -4px;
    }
    .jh-loader .dot .first {
      background: #ccc;
      margin-top: -4px;
      animation: 1.7s dotscale cubic-bezier(0.775, 0.005, 0.31, 1) infinite;
      animation-delay: 0.2s;
    }
  }
}
</style>
