<!---*
* @description 
* @fileName dialog.vue
* @author 叶金龙
* @date 2020/12/23 14:54:40
*--->
<template>
  <el-dialog
    :title="topTitle"
    :visible.sync="selectVisible"
    width="642px"
    :close-on-click-modal="false"
    @close="closeDia"
  >
    <div class="searchTop">
      <el-input
        v-model="search[searchKey]"
        :placeholder="placeholder"
        size="normal"
        clearable
        :inline="true"
      ></el-input>
      <el-button type="primary" :inline="true" size="medium" @click="init"
        >搜 索</el-button
      >
    </div>
    <div class="selectTips">
      已选择：<span>{{ copytagList.length }}</span
      >个
    </div>
    <tableComponent
      ref="tableChild"
      :column="columnClac"
      :tableData="dataList"
      :page.sync="search.page"
      :page_size.sync="search.page_size"
      :total.sync="pagination.total"
      :loading.sync="loading"
      :selectionShow="true"
      :tabelSelectOne="tabelSelectOne"
      :tabelSelectAll="tabelSelectAll"
      height="calc(100vh - 440px)"
      :pageAct="getList"
    />

    <!-- <div class="selectTags">
      <selectTags
        :tagList="copytagList"
        :iterationTable="iterationTable"
        :showkey="calcCurrentStatus"
      />
    </div> -->
    <span slot="footer">
      <el-button @click="simpleClose" size="medium">取 消</el-button>
      <el-button type="primary" @click="submit" size="medium">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
// import selectTags from "./selectTags";
export default {
  name: "selectDialog",
  components: {},
  data() {
    return {};
  },
  props: {
    topTitle: {
      type: String,
      default: "",
    },
    columnClac: {
      type: Array,
      default() {
        return [];
      },
    },
    dataList: {
      type: Array,
      default() {
        return [];
      },
    },
    selectVisible: {
      type: Boolean,
    },
    calcCurrentStatus: {
      type: String,
    },
    copytagList: {
      type: Array,
      default() {
        return [];
      },
    },
    search: {
      type: Object,
    },
    pagination: {
      type: Object,
    },
    tabelSelectOne: {
      type: Function,
    },
    tabelSelectAll: {
      type: Function,
    },
    submit: {
      type: Function,
    },
    getData: {
      type: Function,
    },
    closeFn: {
      type: Function,
    },
    placeholder: {
      type: String,
    },
    searchKey: {
      type: String,
    },
    loading: {
      type: Boolean,
    },
    init: {
      type: Function,
    },
  },
  watch: {
    dataList: {
      immediate: true,
      deep: true,
      handler(val) {
        this.iterationTable(val);
      },
    },
  },
  created() {},
  methods: {
    closeDia() {
      this.closeFn();
    },
    simpleClose() {
      this.closeFn();
    },
    iterationTable(rows = []) {
      this.$nextTick(() => {
        rows.forEach((row) => {
          this.$refs["tableChild"].toggleRowSelect(row, row.checked);
        });
      });
    },
    getList() {
      this.getData();
    },
  },
};
</script>

<style scoped lang='scss'>
.searchTop {
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  padding-bottom: 16px;
  .el-input {
    margin-right: 20px;
  }
}
.selectTags {
  border-top: 1px solid #dcdfe6;
  padding-top: 16px;
}
</style>