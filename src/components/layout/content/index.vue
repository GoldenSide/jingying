<template>
  <transition name="fade-transform" mode="out-in">
    <keep-alive :include="cachedViews" :max="10">
      <router-view  />
    </keep-alive>
  </transition>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
export default {
  data() {
    return {  
       };
  },
  computed: {
     ...mapGetters(['cachedViews']), 
    key() { 
      return this.$route.fullPath;  //  :key="key"  这个不能写在路由里面，不然keep-alive还是会加载created
    },
  }, 
};
</script>


