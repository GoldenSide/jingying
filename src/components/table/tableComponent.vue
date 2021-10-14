<!---*
* @description 表格组件
* @fileName tableComponent.vue
* @author 叶金龙
* @date 2020/10/26 13:58:41
*--->
<template>
  <div class="tableComponent">
    <el-table
      ref="dataTable"
      :data="tableData"
      v-loading="loading"
      :height="height"
      tooltip-effect="light"
      @select="selectOne"
      @select-all="selectAll"
      @sort-change="sortChange"
    >
      <el-table-column
        v-if="selectionShow"
        :selectable="isSelection"
        fixed="left"
        type="selection"
        width="55"
      >
      </el-table-column>

      <el-table-column
        v-for="(item, index) in column"
        :align="item.align || 'left'"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :fixed="item.fixed"
        :sortable="item.sortable"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          <cellRender
            :column="item"
            :row="row"
            :render="item.render"
            v-if="item.render"
          />
          <div v-else>{{ row[item.prop] }}</div>
        </template>
      </el-table-column>
    </el-table>
    <PaginationCom
      :limit.sync="pageSize"
      :page.sync="pageIndex"
      :total="pageTotal"
      @pagination="handlerPageChange"
    />
  </div>
</template>
<script>
import cellRender from "./cellRender";
export default {
  name: "tableComponent",
  components: { cellRender },
  data() {
    return {
      pageSize: 15,
      pageIndex: 1,
      pageTotal: 0,
    };
  },

  props: {
    tableData: {
      type: Array,
      default() {
        return [];
      },
    },
    selectionShow: {
      type: Boolean,
      default: false,
    },
    column: {
      type: Array,
      default() {
        return [];
      },
    },
    height: {
      type: String,
      default: "calc(100vh - 361px)",
    },
    page: {
      type: Number,
      default: 1,
    },
    page_size: {
      type: Number,
      default: 15,
    },
    sort_field: {
      type: String,
      default: "",
    },
    sort_direction: {
      type: String,
      default: "",
    },
    total: {
      type: Number,
      default: 0,
    },
    pageAct: {
      type: Function,

      // default: "getList",
    },
    loading: Boolean,
    tabelSelectOne: {
      type: Function,
    },
    tabelSelectAll: {
      type: Function,
    },
    isSelection: {
      type: Function,
      default() {
        return function () {
          return true;
        };
      },
    },
  },
  watch: {
    page: {
      immediate: true,
      deep: true,
      handler(val) {
        this.pageIndex = val;
      },
    },
    page_size: {
      immediate: true,
      deep: true,
      handler(val) {
        this.pageSize = val;
      },
    },
    total: {
      immediate: true,
      deep: true,
      handler(val) {
        this.pageTotal = val;
      },
    },
  },
  created() {},
  methods: {
    handlerPageChange(val) {
      this.$nextTick(() => {
        this.$emit("update:page", val.page);
        this.$emit("update:page_size", val.limit);
        this.refreshPageAct();
      });
    },
    refreshPageAct() {
      this.pageAct();
      // if (this.$parent[this.pageAct]) {
      //   this.$parent[this.pageAct]();
      // } else {
      //   this.$parent.$parent[this.pageAct]();
      // }
    },
    toggleRowSelect(row, bool) {
      this.$nextTick(() => {
        this.$refs["dataTable"].toggleRowSelection(row, bool);
      });
    },
    selectOne(selection, row) {
      row.checked = !row.checked;
      this.tabelSelectOne(row);
    },
    selectAll(selection) {
      this.tabelSelectAll();
      selection.forEach((v) => {
        this.selectOne(selection, v);
      });
    },
    sortChange(obj) {
      this.$nextTick(() => {
        this.$emit("update:sort_field", obj.prop);
        this.$emit("update:sort_direction", obj.order);
        this.refreshPageAct();
      });
    },
  },
};
</script>

<style scoped lang="scss"></style>
