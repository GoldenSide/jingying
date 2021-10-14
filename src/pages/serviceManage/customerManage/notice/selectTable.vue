<!---*
* @description 表格选择
* @fileName selectTable.vue
* @author 叶金龙
* @date 2020/12/21 19:54:02
*--->
<template>
  <selectDialog
    :topTitle="topTitle"
    :columnClac="columnClac"
    :dataList="dataList"
    :selectVisible.sync="selectVisible"
    :calcCurrentStatus="calcCurrentStatus"
    :copytagList="copytagList"
    :search="search"
    :pagination="pagination"
    :tabelSelectOne="tabelSelectOne"
    :tabelSelectAll="tabelSelectAll"
    :submit="submit"
    :getData="getList"
    :closeFn="closeFn"
    :placeholder="placeholderClac"
    :searchKey="searchKeyClac"
    :loading="loading"
    :init="init"
  />
</template>
<script>
import selectDialog from "@/components/selectTable/dialog";
import {
  shopListSelect,
  companyListSelect,
  supplierListSelect,
} from "@/api/common";
export default {
  name: "selectObj",
  components: { selectDialog },
  data() {
    return {
      pagination: {
        total: 0,
      },
      search: {
        page: 1,
        page_size: 10,
      },
      dataList: [],
      columnCompanys: [
        {
          label: "企业ID",
          prop: "id",
        },
        {
          label: "企业名称",
          prop: "company_name",
        },
        {
          label: "企业代码",
          prop: "company_code",
        },
      ],
      columnShops: [
        {
          label: "店铺ID",
          prop: "id",
        },
        {
          label: "店铺名称",
          prop: "name",
        },
      ],
      columnSupplys: [
        {
          label: "供应商代码",
          prop: "companyCode",
        },
        {
          label: "供应商名称",
          prop: "companyName",
        },
      ],
      columnObj: {
        1: {
          col: "columnCompanys",
          syncHandler: "getCompanys",
          showKey: "company_name",
          handleKey: "id",
          placeholder: "请输入企业名称/企业ID",
          searchKey: "company_name",
        },
        2: {
          col: "columnShops",
          syncHandler: "getShops",
          showKey: "name",
          handleKey: "id",
          placeholder: "请输入店铺名称",
          searchKey: "name",
        },
        3: {
          col: "columnSupplys",
          syncHandler: "getSupplys",
          showKey: "companyName",
          handleKey: "companyCode",
          placeholder: "请输入供应商名称",
          searchKey: "company_name",
        },
      },
      loading: false,
      copytagList: [],
    };
  },
  props: {
    selectVisible: {
      type: Boolean,
      default: false,
    },
    currentStatus: {
      type: String,
      default: "",
    },
    topTitle: {
      type: String,
      default: "",
    },
    tagList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  watch: {
    currentStatus: {
      immediate: true,
      handler(val) {
        if (val) {
          this.$set(this.search, this.searchKeyClac, "");
          this.getList();
        }
      },
    },
    tagList: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val && val.length > 0) {
          this.copytagList = this.utils.deepClone(val);
        }
      },
    },
  },
  created() {},
  methods: {
    init() {
      this.copytagList = []
      this.search.page = 1;
      this.getList();
    },
    getList() {
      this.loading = true;
      let handlerStr = this.columnObj[this.currentStatus].syncHandler;
      this[handlerStr]();
      setTimeout(() => {
        this.loading = false;
      }, 700);
    },
    getCompanys() {
      companyListSelect(this.search).then((res) => {
        this.completeData(res.data);
      });
    },
    getShops() {
      shopListSelect(this.search).then((res) => {
        this.completeData(res.data);
      });
    },
    getSupplys() {
      supplierListSelect(this.search).then((res) => {
        this.completeData(res.data);
      });
    },
    completeData({ list, count }) {
      list.forEach((element) => {
        this.$set(element, "checked", false);
        const row = this.copytagList.find((v) => {
          return (
            v[this.columnObj[this.currentStatus].handleKey] ==
            element[this.columnObj[this.currentStatus].handleKey]
          );
        });
        if (row) {
          this.$set(element, "checked", true);
        }
      });
      this.dataList = list;
      this.pagination.total = count;
    },
    tabelSelectOne(val) {
      if (val.checked) {
        this.copytagList = [...this.copytagList, val];
      } else {
        const index = this.copytagList.findIndex((v) => {
          return (
            v[this.columnObj[this.currentStatus].handleKey] ==
            val[this.columnObj[this.currentStatus].handleKey]
          );
        });
        if (index > -1) {
          this.copytagList.splice(index, 1);
        }
      }
    },
    tabelSelectAll() {
      this.dataList.forEach((v) => {
        const index = this.copytagList.findIndex((element) => {
          return (
            v[this.columnObj[this.currentStatus].handleKey] ==
            element[this.columnObj[this.currentStatus].handleKey]
          );
        });
        if (index > -1) {
          v.checked = false;
          this.copytagList.splice(index, 1);
        }
      });
    },
    closeFn() {
      this.$emit("update:selectVisible", false);
    },
    submit() {
      this.$emit("getSelect", this.copytagList);
      this.closeFn();
    },
  },
  computed: {
    columnClac() {
      return this[this.columnObj[this.currentStatus].col];
    },
    calcCurrentStatus() {
      return this.columnObj[this.currentStatus].showKey;
    },
    placeholderClac() {
      return this.columnObj[this.currentStatus].placeholder;
    },
    searchKeyClac() {
      return this.columnObj[this.currentStatus].searchKey;
    },
  },
};
</script>

<style scoped lang='scss'>
</style>