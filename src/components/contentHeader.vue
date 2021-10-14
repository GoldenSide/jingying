<!---*
* @description 
* @fileName contentHeader.vue
* @author 叶金龙
* @date 2020/09/26 12:10:51
*--->
<template>
  <div class="header">
    <h1 class="left-txt ft18 fw600">{{ titleText }}</h1>
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
    titleText: {
      type: String,
      default: "",
    },
  },
  watch: {
    xxx: {},
  },
  methods: {},
  mounted() {},
};
</script>

<style scoped lang='scss'>
</style>