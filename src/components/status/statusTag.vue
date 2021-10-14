<!---*
* @description 
* @fileName statusTag.vue
* @author 叶金龙
* @date 2021/04/01 10:48:01
*--->
<template>
  <div class="statusTag-container">
    <slot name="status-slot" />
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {};
  },
  props: {},
  watch: {
    xxx: {},
  },
  created() {},
  methods: {},
};
</script>

<style scoped lang="scss">
.statusTag-container {
  display: inline-block;
  height: 28px;
  line-height: 28px;
  text-align: center;
  padding: 0 8px;
  border-radius: 28px;
}
</style>
