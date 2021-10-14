<!---*
* @description  公司基础信息
* @fileName basicInfo.vue
* @author 叶金龙
* @date 2021/04/02 15:06:09
*--->
<template>
  <div class="companybasicInfo-container">
    <ul class="lists">
      <li class="item">公司名称：{{ arr[0].company_name || "--" }}</li>
      <li class="item">公司类型：{{ arr[0].company_type_name || "--" }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "companybasicInfo",
  components: {},
  data() {
    return {};
  },
  props: {
    arr: {
      type: Array,
    },
  },
  watch: {
    xxx: {},
  },
  created() {},
  methods: {},
};
</script>

<style scoped lang='scss'>
.companybasicInfo-container {
  .lists {
    .item {
      margin-bottom: 12px;
      line-height: 22px;
    }
  }
}
</style>