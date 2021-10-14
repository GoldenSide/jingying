<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :default-active="routerPath"
      :collapse="isCollapse"
      :unique-opened="true"
      :background-color="variables.menuBg"
      :text-color="variables.menuText"
      :active-text-color="variables.menuActiveText"
      mode="vertical"
    >
      <sidebar-item
        v-for="route in routes"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from "vuex";
import variables from "@/styles/variables.scss";
import SidebarItem from "./SidebarItem";
import { devRoutes } from "@/router";

export default {
  components: { SidebarItem },
  computed: {
    routerPath(){
      return this.$route.meta.jumpPath || this.$route.path
    },
    ...mapGetters(["currentRouteArr"]),
    variables() {
      return variables;
    },
    routes() {
      return this.currentRouteArr;
    },
    isCollapse() {
      return false;
      // return !this.sidebar.opened
    },
  },
};
</script>
