import copy from "./copy";
import countDown from "./countDown";
const directives = {
  copy,
  countDown
};

export default {
  install(Vue) {
    Object.keys(directives).forEach(key => {
      Vue.directive(key, directives[key]);
    });
  }
};
