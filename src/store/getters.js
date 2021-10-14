const getter = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  // refreshToken: state => state.user.refreshToken,
  // avatar: state => state.user.avatar,
  // name: state => state.user.name,
  // status: state => state.user.status,
  // roles: state => state.user.roles,
  // company: state => state.user.company,
  // setting: state => state.user.setting,
  currentRouteArr: state => state.routeView.currentRouteArr,
  currentRoutePath: state => state.routeView.currentRoutePath,
  userInfo: state => state.user.userInfo,
  currentTarget: state => state.permission.currentTarget,
  axiosSource: state => state.routeView.axiosSource,
  // platIndex: state => (state.routeView.platform == "XShoppy" ? 0 : 1)
  platform: state => state.routeView.platform || "XShoppy"
};

export default getter;
