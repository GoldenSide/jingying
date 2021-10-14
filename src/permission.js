import router from "./router";
import store from "./store";
import { haveToken } from "@/utils/cookie";
import { cancelArr } from "./config/requestConfig.js";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
NProgress.configure({
  showSpinner: false
}); // NProgress Configuration

const whiteList = ["/login"]; // no redirect whitelist
router.beforeEach((to, from, next) => {
  const { cachedViews } = store.state.tagsView;
  // 清除除列表到详情外的缓存, 列表与详情需isback为对方name
  // if(from.name == 'sysNotice')
  // if (from.name !=="msgList"){
  if (!(to.meta.isback && to.meta.isback.includes(from.name))) {
    store.dispatch("tagsView/delAllCachedViews");
  }
  // }
  cachedViews.forEach((name, index) => {
    if (
      name === from.name &&
      cachedViews[index - 1] &&
      cachedViews[index - 1] === to.name
    ) {
      store.dispatch("tagsView/delCachedView", from);
    }
  });
  const { name } = to;
  if (name) {
    store.dispatch("tagsView/addCachedView", to);
  }

  cancelArr.forEach((ele, index) => {
    ele.cancel();
    cancelArr.splice(index, 1);
  });
  NProgress.start();
  if (haveToken()) {
    if (to.path == "/login" || to.path == "/") {
      next({
        path: "/index"
      });
      NProgress.done();
    } else {
      if (Object.keys(store.getters.userInfo).length <= 0) {
        store
          .dispatch("user/GetUserInfo")
          .then(res => {
            if (res) {
              if (process.env.NODE_ENV == "production") {
                store
                  .dispatch("user/GenerateRoutes")
                  .then(routers => {
                    router.addRoutes(routers);
                    next({
                      ...to,
                      replace: true
                    });
                  })
                  .catch(error => {
                    store.dispatch("user/logoutAct").then(res => {});
                  });
              } else {
                next();
              }
            }
          })
          .catch(error => {
            store.dispatch("user/logoutAct").then(res => {});
          });
      } else {
        if (to.path === "/404") {
          next({ path: "/index" });
          return;
        }
        next();
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      if (to.path.indexOf("/login") === 0) {
        next();
      } else {
        next({
          path: "/login"
        });
      }
      NProgress.done(); // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
});
router.afterEach(() => {
  NProgress.done(); // finish progress bar
});
