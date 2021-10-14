<!---*
* @description 
* @fileName goBack.vue
* @author 叶金龙
* @date 2020/09/26 17:14:33
*--->
<template>
  <div class="goback-container">
    <p class="go-back" @click="handlerClick">
      <i class="el-icon-arrow-left" />返回
    </p>
  </div>
</template>
<script>
export default {
  name: "",
  components: {},
  data() {
    return {};
  },
  props: {
    act: {
      type: String,
      default: "",
    },
  },
  watch: {
    xxx: {},
  },
  methods: {
    handlerClick() {
      if (this.act == "") {
        this.$router.go(-1);
      } else {
        this.$parent[this.act]();
      }
    },
  },
};
</script>

<style scoped lang='scss'>
.goback-container {
  color: #31373d;
  font-size: 12px;
  margin-bottom: 8px;
  .go-back {
    line-height: 20px;
    cursor: pointer;
    i {
      color: #333951;
      font-weight: 800;
    }
  }
}
</style>