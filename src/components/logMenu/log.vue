<!---*
* @description 
* @fileName log.vue
* @author 龙伟
* @date 2020/11/17 14:32:36
*--->
<template>
  <el-dialog
    :title="logData.title"
    :visible.sync="logVisible"
    :before-close="logClose"
    :width="logData.width"
  >
    <div class="log-contaniner">
      <tableComponent
        :column="logData.logColumn"
        :tableData="logData.dataList"
        :page.sync="logData.logSearch.page"
        :page_size.sync="logData.logSearch.page_size"
        :total.sync="logData.pagination.total"
        :loading.sync="logLoading"
        height="calc(100vh - 385px)"
        :pageAct="getList"
      />
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "logContent",
  components: {},
  data() {
    return {
      logLoading: false,
    };
  },
  props: {
    logData: {
      type: Object,
      default() {
        return {};
      },
    },
    logVisible: {
      type: Boolean,
      default: false,
    },
    getLogData: {
      type: Function,
    },
  },
  watch: {},
  created() {},
  methods: {
    //   关闭日志
    logClose() {
      this.logData.dataList = [];
      this.$emit("update:logVisible", false);
    },
    getList() {
      this.logLoading = true;
      this.getLogData();
      setTimeout(() => {
        this.logLoading = false;
      }, 500);
    },
  },
};
</script>

<style scoped lang='scss'>
/deep/.log-contaniner {
  .page-contentainer {
    padding-bottom: 0;
    padding-right: 0;
  }
}
</style>