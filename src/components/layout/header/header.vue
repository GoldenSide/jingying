<template>
  <div class="jh-header" :style="{ background: btnConfig[platFormIndex].bgc }">
    <div class="logo">
      <i class="iconfont iconlogo"></i>
    </div>
    <div class="header-menu">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        background-color="transparent"
        text-color="#fff"
        active-text-color="rgba(255, 196, 83, 1)"
      >
        <el-menu-item
          :index="item.path"
          v-for="(item, index) in routes"
          :key="index"
          @click="itemClick(item, index)"
          >{{ item.meta.title }}</el-menu-item
        >
      </el-menu>
    </div>
    <div class="rightBox">

   
    <div class="toggleBtnBox">
      <div class="posiBox" title="系统切换">
        <el-dropdown @command="sysToggleCommand" trigger="click">
          <span class="el-dropdown-link">
            {{ platform }}<i class="el-icon-caret-bottom el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown" :width="200">
            <el-dropdown-item
              v-for="(item, index) in btnConfig"
              :key="index"
              :command="{ index, item }"
              >{{ item.content }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="userBox">
      <span class="user-img">
        <i class="iconfont iconmorentouxiang"></i>
      </span>
      <span class="username">
        <el-dropdown @command="handleCommand" trigger="click">
          <span class="el-dropdown-link" style="cursor: pointer; color: #fff">
            <span style="color: #ffffff; vertical-align: middle">
              {{ userInfo.name || "未登录" }}
            </span>
            <i
              style="margin-left: 4px; vertical-align: middle"
              class="el-icon-caret-bottom"
            ></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="logoutAct" style="color: #1a1d2c">
              <div>
                <i
                  class="iconfont icon-_quit"
                  style="
                    vertical-align: baseline;
                    margin-right: 8px;
                    font-size: 20px;
                    line-height: 20px;
                    vertical-align: middle;
                  "
                ></i
                >退出
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </span>
    </div>
     </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import { getCurRouteRoot, setCurRouteRoot } from "@/utils/cookie";
import {
  getBaseUrl,
  setBaseUrl,
  setPlatForm,
  getPlatForm
} from "@/utils/cookie";
import { MessageBox } from "element-ui";
import router from "@/router";
export default {
  data() {
    return {
      activeIndex: "",
      myindex: null,
      btnConfig: [
        {
          content: "XShoppy",
          bgc: "#273A8A",
          key: "BASE_API"
        },
        {
          content: "Emysale",
          bgc: "#34385C",
          key: "BASE_API_EMYSALE"
        }
      ],
      platFormIndex: 0
    };
  },

  watch: {},

  computed: {
    routes() {
      let routes = this.$router.options.routes.filter(
        item => item.hidden !== true
      );
      routes.forEach((element, index) => {
        return this.$set(element, "myindex", index);
      });
      return routes;
    },
    userInfo() {
      return this.$store.getters.userInfo;
    },
    ...mapGetters(["platform"])
  },

  mounted() {
    this.visibleHiddden();
    this.showLeftMenu(this.routes[getCurRouteRoot()]);
    this.platFormIndex =
      getBaseUrl() && getBaseUrl().includes("emy") == true ? 1 : 0;
    this.SET_PLATFORM(this.btnConfig[this.platFormIndex].content);
  },
  methods: {
    getHiddenProp() {
      var prefixes = ["webkit", "moz", "ms", "o"];

      // if 'hidden' is natively supported just return it
      if ("hidden" in document) return "hidden";

      // otherwise loop over all the known prefixes until we find one
      for (var i = 0; i < prefixes.length; i++) {
        if (prefixes[i] + "Hidden" in document) return prefixes[i] + "Hidden";
      }

      // otherwise it's not supported
      return null;
    },
    getVisibilityState() {
      var prefixes = ["webkit", "moz", "ms", "o"];
      if ("visibilityState" in document) return "visibilityState";
      for (var i = 0; i < prefixes.length; i++) {
        if (prefixes[i] + "VisibilityState" in document)
          return prefixes[i] + "VisibilityState";
      }
      // otherwise it's not supported
      return null;
    },

    visibleHiddden() {
      var visProp = this.getHiddenProp();
      if (visProp) {
        var evtname = visProp.replace(/[H|h]idden/, "") + "visibilitychange";
        let $this = this;
        document.addEventListener(
          evtname,
          function() {
            if (
              getPlatForm() !== $this.platform &&
              document[$this.getVisibilityState()] == "visible"
            ) {
              MessageBox.confirm(
                `浏览器检测到你已经切换到${getPlatForm()}系统，请点击"确定"按钮进行切换。`,
                "提示",
                {
                  confirmButtonText: "确定",
                  showCancelButton: false,
                  showClose: false,
                  closeOnPressEscape: false,
                  closeOnHashChange: false,
                  closeOnClickModal: false
                }
              )
                .then(() => {
                  let index = $this.btnConfig.findIndex(
                    v => v.content == getPlatForm()
                  );
                  $this.toggleBtn(index, $this.btnConfig[index]);
                })
                .catch(() => {});
            } else if (getPlatForm() == $this.platform) {
              MessageBox.close();
            }
            //   document.title = document[getVisibilityState()] + "状态";
          },
          false
        );
      }
    },
    itemClick(item) {
      this.$router.push({ path: item.redirect });
      this.showLeftMenu(item);
    },
    showLeftMenu(item) {
      this.activeIndex = item.path;
      if (this.myindex === getCurRouteRoot()) return;
      this.SET_CURRENT_ROUTEARR(item.children);
      this.SET_CURRENT_ROUTEROOT(item.path);
      setCurRouteRoot(item["myindex"]);
      this.myindex = item["myindex"];
    },
    handleCommand(command) {
      switch (command) {
        case "logoutAct":
          this.logoutAct().then(res => {});
          break;
      }
    },
    sysToggleCommand(model) {
      let { index, item } = model;
      this.toggleBtn(index, item);
    },
    toggleBtn(index, item) {
      if (this.platFormIndex == index) return;
      this.platFormIndex = index;
      setBaseUrl(process.env[item.key]);
      setPlatForm(item.content);
      this.SET_PLATFORM(item.content);
      setCurRouteRoot(0);
      this.$nextTick(() => {
        if (process.env.NODE_ENV == "production") {
          this.GenerateRoutes().then(routers => {
            router.addRoutes(routers);
            this.refreshRoute();
          });
        } else {
          this.refreshRoute();
        }
      });
    },

    refreshRoute() {
      this.$router.push({ path: "/index/serviceMana/sysNotice" });
      const loading = this.$loading({
        lock: true,
        text: "系统正在切换中,请勿做任何操作，loading...",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.98)"
      });

      setTimeout(() => {
        this.$router.go(0);
      }, 1500);

      setTimeout(() => {
        loading.close();
      }, 2000);
    },
    ...mapActions("user", ["logoutAct", "GenerateRoutes"]),
    ...mapMutations("routeView", [
      "SET_CURRENT_ROUTEARR",
      "SET_CURRENT_ROUTEROOT",
      "SET_PLATFORM"
    ])
  }
};
</script>

<style scoped lang="scss">
.jh-header .header-menu .el-menu {
  background: transparent;
}

.jh-header .header-menu .el-menu--horizontal > .el-menu-item.is-active {
  border-radius: 2px;
  font-weight: bold;
  color: #ffffff;
}

.jh-header .header-menu .el-menu.el-menu--horizontal {
  border: 0px;
}

.jh-header .header-menu .el-menu--horizontal > .el-menu-item {
  border: 0px;
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
  height: 40px;
  line-height: 40px;
  padding: 0px;
  margin: 0 40px;
}

.jh-header .header-menu .el-menu-item:hover,
.jh-header .header-menu .el-menu-item:focus {
  border-radius: 2px;
  color: #ffffff;
  background: transparent !important;
}
</style>
<style lang="scss" scoped>
.jh-header {
  position: relative;
  width: 100%;
  padding-right: 20px;
  box-sizing: border-box;
  height: 60px;
  box-shadow: 0px 1px 5px 2px rgba(35, 35, 112, 0.06),
    0px 1px 3px 1px rgba(5, 14, 95, 0.07);
  display: flex;
  align-items: center;
  justify-items: center;
  text-align: right;
  .logo {
    align-self: stretch;
    width: 178px;
    .iconlogo {
      color: #fff;
      display: block;
      height: 100%;
      text-align: center;
      &::before {
        font-size: 32px;
        line-height: 60px;
      }
    }
  }
  .header-menu {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .rightBox {
    position: absolute;
    right: 0;
    display: flex;
    align-items: center;
    .toggleBtnBox {
      height: 100%;

      display: flex;
      justify-content: space-between;
      align-items: center;
      .posiBox {
        height: 36px;
        background-color: #fff;
        border-radius: 2px;
        padding: 0 16px;
        .el-dropdown {
          height: 36px;
          line-height: 36px;
          user-select: none;
          .el-dropdown-link {
            outline: none;
            border: none;
          }
        }
      }
    }
    .userBox {
      .user-img {
        margin-right: 8px;
        width: 36px;
        height: 36px;
        border-radius: 16px;
        display: inline-block;
        vertical-align: middle;
        i {
          display: block;
          width: 100%;
          height: 100%;
          font-size: 32px;
          color: #fff;
        }
      }
    }
  }
}
</style>
