// 路由相关
const routeView = {
  namespaced: true,
  state: {
    currentRouteArr: [],
    currentRoutePath: "",
    platform: "XShoppy"
  },
  mutations: {
    SET_CURRENT_ROUTEARR: (state, routeArr) => {
      state.currentRouteArr = routeArr;
    },
    SET_CURRENT_ROUTEROOT: (state, rootPath) => {
      state.currentRoutePath = rootPath;
    },
    SET_PLATFORM: (state, platform) => {
      state.platform = platform;
    }
  },
  actions: {}
};
export default routeView;
