<!---*
* @description  搜索结果
* @fileName result.vue
* @author 叶金龙
* @date 2021/03/05 16:17:14
*--->
<template>
  <div class="result-container">
    <div class="title">筛选结果</div>
    <slot />
    <div class="resultBox" v-if="haveRes && !loading">
      <span>本次共筛选出</span><span class="total">{{ total }}</span
      ><span>个符合条件的客户</span>
      <span class="actText" v-if="total > 0" @click="exportList"
        >导出筛选结果</span
      >
    </div>
    <div class="resultBox" v-if="!haveRes && !loading">无</div>
  </div>
</template>

<script>
export default {
  name: "filterResult",
  components: {},
  data() {
    return {};
  },
  props: {
    total: {
      type: Number,
      default: 0,
    },
    exportList: {
      type: Function,
      default() {
        return function () {
          return false;
        };
      },
    },
    haveRes: {
      type: [Boolean],
      default: false,
    },
    loading: {
      type: [Boolean],
      default: false,
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
.result-container {
  padding: 16px;
  background-color: #fff;
  margin-top: 16px;
  box-shadow: 0px 1px 3px 0px rgba(35, 35, 112, 0.12),
    0px 0px 0px 1px rgba(67, 67, 145, 0.05);
  border-radius: 4px;
  .title {
    height: 22px;
    font-size: 16px;
    font-weight: 600;
    color: #1c3246;
    line-height: 22px;
    margin-bottom: 16px;
  }

  .resultBox {
    font-size: 14px;
    .total {
      background: rgba(242, 133, 71, 0.1);
      display: inline-block;
      color: #f19829;
      margin: 0 3px;
      padding: 0 2px;
    }
    .actText {
      color: #409eff;
      margin-left: 16px;
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
</style>