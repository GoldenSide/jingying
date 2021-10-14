<!---*
* @description   审核详情
* @fileName checkInfoDia.vue
* @author 叶金龙
* @date 2021/03/31 18:06:16
*--->
<template>
  <el-dialog
    title="审核详情"
    :visible.sync="checkInfoVisible"
    width="634px"
    :before-close="simpleClose"
  >
    <ul class="lists">
      <li class="item" v-for="(item, index) in textConfig" :key="index">
        {{ item.label }}：{{ infoObj[item.prop] }}
      </li>
    </ul>
  </el-dialog>
</template>

<script>
export default {
  name: "billCheckInfo",
  components: {},
  data() {
    return {
      textConfig: [
        {
          label: "审核人",
          prop: "auditor_name",
        },
        {
          label: "审核时间",
          prop: "audit_time",
        },
        {
          label: "审核结果",
          prop: "status_text",
        },
        {
          label: "详细内容",
          prop: "reason",
        },
      ],
    };
  },
  props: {
    infoObj: {
      type: Object,
    },
    checkInfoVisible: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    infoObj: {
      immediate: true,
      deep: true,
      handler(val) {
        if (Object.keys(val).length > 0 && val.status == "2") {
          val.reason = "审核通过";
        }
      },
    },
  },
  created() {},
  methods: {
    simpleClose() {
      this.$emit("update:checkInfoVisible", false);
    },
  },
};
</script>

<style scoped lang='scss'>
.lists {
  .item {
    font-size: 14px;
    line-height: 22px;
    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }
}
</style>