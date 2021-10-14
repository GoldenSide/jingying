<!---*
* @description 
* @fileName goBackIcon.vue
* @author 龙伟
* @date 2021/03/30 10:24:48
*--->
<template>
  <div class="goback-container">
    <span class="go-back" @click="handlerClick">
      <i class="el-icon-back"></i>
    </span>
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
  display: inline-block;
  margin-right: 16px;
  .go-back {
    width: 36px;
    height: 36px;
    background: #f5f5f5;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #d4d9de;
    box-sizing: border-box;
    cursor: pointer;
    i {
      color: #09121f;
      font-size: 16px;
      font-weight: 600;
    }
  }
}
</style>