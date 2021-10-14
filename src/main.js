import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/styles/index.scss";
import Vue from "vue";
import App from "./App";
import router from "./router";
import "@/permission";
import "@/icons";
import utils from "@/utils";
import directives from "./directive";
import store from "./store";
import PaginationCom from "./components/pagination";
import contHeader from "@/components/contentHeader";
import tableComponent from "@/components/table/tableComponent";
import searchComponent from "@/components/search/searchComponent";
import goBack from "@/components/goBack";
import goBackIcon from "@/components/goBackIcon.vue";
import logMenu from "@/components/logMenu/log";
Vue.component("PaginationCom", PaginationCom);
Vue.component("contHeader", contHeader);
Vue.component("tableComponent", tableComponent);
Vue.component("searchComponent", searchComponent);
Vue.component("goBack", goBack);
Vue.component("goBackIcon", goBackIcon);
Vue.component("logMenu", logMenu);
import "babel-polyfill";
import { krryPaging } from "krry-transfer";
Vue.use(directives);
Vue.use(krryPaging);
Vue.use(utils);
Vue.use(ElementUI);
Vue.config.productionTip = false;
var vue = new Vue({
  el: "#jh-main",
  store,
  router,
  components: { App },
  template: "<App/>"
});

export default vue;
