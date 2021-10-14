import vue from "vue";
import vuex from "vuex";
import app from "./modules/app";
import tagsView from "./modules/tagsView";
import user from "./modules/user";
import routeView from "./modules/routeView";
import permission from "./modules/permission";
import getters from "./getters";
import createLogger from "vuex/dist/logger"; // 修改日志
vue.use(vuex);
const debug = process.env.NODE_ENV !== "production"; // 开发环境中为true，否则为false

const store = new vuex.Store({
  modules: {
    app,
    tagsView,
    user,
    routeView,
    permission
  },
  getters,
  strict: debug,
  plugins: debug ? [createLogger()] : [] // 开发环境下显示vuex的状态修改
});
export default store;
