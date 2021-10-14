<!---*
* @description 账单表格
* @fileName orderTable.vue
* @author 叶金龙
* @date 2021/04/02 13:42:19
*--->
<template>
  <tableComponent
    :column="column"
    :tableData="dataList"
    :page.sync="search.page"
    :page_size.sync="search.page_size"
    :total.sync="pagination.total"
    :loading.sync="loading"
    height="200px"
    :pageAct="getList"
  />
</template>
<script>
import { overdueList } from "@/api/serviceMn/customerMn/overdueBillFollow";
export default {
  name: "orderTable",
  components: {},
  data() {
    return {
      column: [
        {
          prop: "order_no",
          label: "账单编号",
          width: 210,
          render: ({ h, row }) => {
            return (
              <div>
                <el-link
                  type="primary"
                  size="default"
                  onClick={() => this.toDetail(row)}
                  style=""
                >
                  {row.order_no}
                </el-link>
              </div>
            );
          },
        },
        { prop: "name", label: "店铺名称" },
        {
          prop: "should_pay_amount_usd",
          label: "逾期账单金额($)",
          align: "right",
        },
        {
          prop: "should_pay_amount",
          label: "逾期账单金额(￥)",
          align: "right",
        },
      ],
      dataList: [],
      search: {
        search_words: "",
        search_id: null,
        page: 1,
        page_size: 10,
        ids: [],
        work_order_id: null,
      },
      pagination: {
        total: 0,
      },
      loading: false,
    };
  },
  props: {
    ids: {
      type: Array,
      default() {
        return [];
      },
    },
    work_order_id: {
      type: [Number, String],
      default: null,
    },
  },
  watch: {
    ids: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val.length > 0) {
          this.search = { ...this.search, ...{ ids: val } };
          this.getList();
        }
      },
    },
    work_order_id: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val != null && val != "") {
          this.search = { ...this.search, ...{ work_order_id: val } };
          this.getList();
        }
      },
    },
  },
  created() {},
  methods: {
    getList() {
      this.loading = true;
      overdueList(this.search).then((res) => {
        let { count, list } = res.data;
        this.dataList = list;
        this.pagination.total = count;
        this.loading = false;
      });
    },
    toDetail({ trades_id, order_no }) {
      this.$router.push(
        `/financeMana/settlement/detail?id=${trades_id}&order_no=${order_no}`
      );
    },
  },
};
</script>

<style scoped lang='scss'>
</style>