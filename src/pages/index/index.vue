<template>
  <div class="container">
    <h2>今天又是愉快的一天!</h2>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapActions } from "vuex";
export default {
  name: "",
  data() {
    return {};
  },
  beforeCreate() {
    // if (window.screen.availWidth < 640) {
    //   this.$router.push({ path: "/mobile/boardData" });
    // }
  },
  computed: {
    ...mapGetters(["userInfo", "is_login"])
  },
  methods: {
    _isMobile() {
      let flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      );
      return flag;
    }
  },
  components: {},
  mounted() {
    // if (this._isMobile() && window.screen.availWidth < 640) {
    //   this.$router.push("/mobile/boardData");
    //   // window.location.href = `https://${process.env.HREF_URL}/admin/mobile/boardData`;
    // } else {
    //   let activeType = "";
    //   if (this.userInfo.menu && this.userInfo.menu.length > 0) {
    //     if (this.userInfo.menu[0].child[0].type) {
    //       activeType = this.userInfo.menu[0].child[0].type;
    //     } else {
    //       activeType = "/";
    //     }
    //   }
    //   this.$router.push(activeType);
    // }
  }
};
</script>

<style scoped lang="scss">
</style>
