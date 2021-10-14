<template>
  <el-container class="jh-main-layout">
    <el-header style="padding: 0; height: 60px; z-index: 2000">
      <JhHeader />
    </el-header>
    <el-container class="section-container">
      <el-aside width="auto" class="sidebar-container">
        <JhMenu />
      </el-aside>
      <el-main class="main-container">
        <JhMain />
      </el-main>
    </el-container>
  </el-container>
</template>
<script type="text/ecmascript-6">
import JhHeader from "./header/header";
import JhMenu from "./menu/Sidebar";
import JhMain from "./content";
import { mapGetters } from 'vuex'
import { getCurRouteRoot} from "@/utils/cookie";
export default {
  components: { JhHeader, JhMenu, JhMain },
  data() {
    return {};
  }, 
  computed:{ 
      ...mapGetters(['cachedViews']), 
    routes() {
      let routes = this.$router.options.routes.filter(
        item => item.hidden !== true
      );
      routes.forEach((element, index) => {
        return this.$set(element, "myindex", index);
      });
      return routes;
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
        if(to.path =='/index' ){ 
          next(vm.routes[getCurRouteRoot()].redirect); 
        }
       
    });
  }
};
</script>

<style lang="scss" scoped>
.jh-main-layout {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
</style>
