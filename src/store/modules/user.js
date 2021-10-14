import router from "@/router";
import { getOwnMenuList, loginByQrcode, getUserInfo, logOut } from "@/api/user";
import { removeToken, setToken } from "@/utils/cookie";
import { commonRoute } from "@/router";
import Layout from "@/components/layout/layout";
import Content from "@/components/layout/content";
import context from "../../main";
function getAsyncRouter(routes) {
  routes.forEach(item => {
    if (item.level == 1) {
      item.path = "/" + item.name;
      item.component = Layout;
      item.redirect =
        item.path +
        "/" +
        item.children[0].path +
        "/" +
        item.children[0].children[0].path;
    } else if (item.level == 2) {
      item.component = Content;
    } else if (item.level == 3) {
      let filePath = item.component;
      item.component = () => import(`@/pages${filePath}`);
    }
    getAsyncRouter(item.children);
  });
  return routes;
}

const user = {
  namespaced: true,
  state: {
    userInfo: {}
  },

  mutations: {
    SET_USERINFO: (state, infoObj) => {
      state.userInfo = infoObj;
    }
  },
  actions: {
    // 登录操作
    loginAct({ commit }, data) {
      return new Promise((resolve, reject) => {
        loginByQrcode(data)
          .then(response => {
            if (response.code == 0) {
              setToken(response.data.token);
              resolve(response);
            }
          })
          .catch(error => {
            removeToken();
            removeToken();
            reject(error);
          });
      });
    },
    // 获取用户信息
    GetUserInfo({ commit, dispatch }) {
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then(response => {
            if (response.code == 0) {
              commit("SET_USERINFO", response.data);
              resolve(response);
            }
          })
          .catch(error => {
            dispatch("logoutAct");
            reject(error);
          });
      });
    },
    // 退出登录
    logoutAct({ commit }) {
      return new Promise((resolve, reject) => {
        logOut()
          .then(response => {
            if (response.code == 0) {
              removeToken();
              context.$nextTick(() => router.push("/login"));
              resolve(response);
            }
          })
          .catch(error => {
            removeToken();
            router.push({ path: "/login" });
            reject(error);
          });
      });
    },
    // 获取异步路由
    GenerateRoutes({ commit }) {
      return new Promise((resolve, reject) => {
        getOwnMenuList().then(res => {
          let { menu_list } = res.data;
          let addRoutes = getAsyncRouter(menu_list);
          addRoutes.push({
            path: "*",
            redirect: "/404",
            hidden: true
          });
          router.options.routes = [...addRoutes, ...commonRoute];
          resolve(addRoutes);
        });
      });
    }
  }
};

export default user;
