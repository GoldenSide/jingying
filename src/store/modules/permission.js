// 权限相关
const permission = {
  namespaced: true,
  state: {
    currentTarget: {
      bool: null,
      arr: [],
      level: null,
      menu_id: null
    }
  },
  mutations: {
    SET_CURRENT_TARGET: (state, currentTarget) => {
      state.currentTarget = { ...state.currentTarget, ...currentTarget };
    }
  }
};
export default permission;
