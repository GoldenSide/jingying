<template>
  <div class="bill-detail">
    <goBack />
    <contHeader :titleText="$route.query.order_no + ' 账单信息'" />
    <div class="content-detail common-box">
      <el-row>
        <el-col :span="12">账单基础信息</el-col>
        <el-col :span="12">账单金额信息</el-col>
      </el-row>
      <ul class="itemLists">
        <li class="item" v-for="(item, index) in infoConfig" :key="index">
          {{ item.label }}：{{ infoObj[item.prop] || "--" }}
        </li>
      </ul>
    </div>
    <div class="content-list">
      <div class="sectionTitle">订单明细</div>
      <div class="list">
        <el-table :data="dataList" v-loading="loading" row-key="id">
          <el-table-column
            v-for="(item, index) in tableConfig"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :align="item.align || 'right'"
          >
          </el-table-column>
        </el-table>
        <PaginationCom
          :limit.sync="search.page_size"
          :page.sync="search.page"
          :total="pagination.total"
          @pagination="getList"
        />
      </div>
    </div>
  </div>
</template>

<script>
import contHeader from "@/components/contentHeader";
import goBack from "@/components/goBack";
import { billDetail, getListCount } from "@/api/finance/detail";
export default {
  name: "detail",
  components: {
    contHeader,
    goBack
  },
  data() {
    return {
      pagination: {
        total: 0
      },
      search: {
        id: null,
        page: 1,
        page_size: 10
      },
      infoConfig: [
        { label: "账单编号", prop: "order_no" },
        { label: "店铺", prop: "shop_name" },
        { label: "公司", prop: "company_name" },
        { label: "公司类型", prop: "company_type_name" },
        { label: "账单生成时间", prop: "create_time" },
        { label: "是否已发客户", prop: "is_send_user_str" },
        { label: "发送客户时间", prop: "send_user_time" },
        { label: "账单状态", prop: "trade_status_str" },
        { label: "支付状态", prop: "pay_status_str" },
        { label: "支付方式", prop: "pay_way_str" },
        { label: "第三方交易号", prop: "third_part_order_no" },
        { label: "GMV($)", prop: "gmv_amount" },
        { label: "交易佣金($)", prop: "commission_amount" },
        { label: "交易佣金(¥)", prop: "commission_amount_rmb" },
        { label: "佣金优惠金额($)", prop: "discount_commission_amount" },
        { label: "惠后佣金金额($)", prop: "discount_after_commission_amount" }
      ],
      infoObj: {},
      dataList: [],
      tableConfig: [
        { prop: "order_no", label: "订单号", align: "left" },
        { prop: "user_pay_time", label: "支付时间", align: "left" },
        { prop: "order_amount", label: "订单金额($)" },
        { prop: "commission_rate", label: "佣金费率(%)" },
        { prop: "commission_amount", label: "交易佣金($)" },
        // { prop: "order_amount_rmb", label: "交易佣金(¥)" },
        { prop: "exchange_rate", label: "汇率" },
        { prop: "discount", label: "优惠折扣(%)" },
        { prop: "discount_commission_amount", label: "佣金优惠金额($)" },
        { prop: "discount_after_commission_amount", label: "惠后佣金金额($)" }
      ],

      currentPage: 1,
      pageSize: 10,
      totalNum: 0,
      reason: "",
      initEditor: false,
      company_type: 3,
      errorMessage: "",
      dialogVisibleError: false,
      dialogRefuse: false,
      dialogVisible: false,
      srcListFront: [],
      srcListBack: [],
      srcListBussiness: [],
      loading: true
    };
  },
  filters: {},
  created() {},
  watch: {
    $route: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val.query.id) {
          this.search = {
            ...this.search,
            id: val.query.id,
            shop_id: val.query.shop_id
          };
          this.init();
        }
      }
    }
  },
  methods: {
    // ----------------new
    init() {
      this.search.page = 1;
      this.getList();
    },
    getList() {
      this.loading = true;
      let listPro = new Promise((resolve, reject) => {
        billDetail(this.search)
          .then(res => {
            let { bill, order_detail } = res.data;
            resolve({ bill, order_detail });
          })
          .catch(err => {
            reject(err);
          });
      });
      let countPro = new Promise((resolve, reject) => {
        getListCount(this.search)
          .then(res => {
            let { count } = res.data.order_detail;
            resolve(count);
          })
          .catch(err => {
            reject(err);
          });
      });
      Promise.all([listPro, countPro])
        .then(result => {
          let [listObj, count] = result;
          this.infoObj = listObj.bill;
          this.dataList = listObj.order_detail.list;
          this.pagination.total = count;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    }
    // sortChange(obj) {
    //   if (obj.prop) {
    //     this.search.sort_field = obj.prop;
    //     this.search.sort_direction = obj.order == "ascending" ? "asc" : "desc";
    //   } else {
    //     this.search.sort_field = "";
    //     this.search.sort_direction = "";
    //   }
    //   this.getDetail();
    // },
    // ----------------new
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
.orange-status {
  background: #ffc48b;
}
.green-status {
  background: rgba(187, 229, 179, 1);
}
.yellow-status {
  background: #ffea8a;
}
.red-status {
  background: #ff4343;
}
.bill-detail {
  .common-box {
    background: #ffffff;
    box-shadow: 0px 1px 3px 0px rgba(35, 35, 112, 0.12),
      0px 0px 0px 1px rgba(67, 67, 145, 0.05);
    border-radius: 4px;
    padding: 16px;
    margin-bottom: 16px;
    .el-col {
      font-size: 16px;
      font-weight: 600;
      color: #1c3246;
      line-height: 22px;
      margin-bottom: 13px;
    }
    .itemLists {
      max-height: 330px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex-wrap: wrap;
      align-items: flex-start;
      .item {
        margin-bottom: 10px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #303133;
        line-height: 20px;
        width: 50%;
      }
    }
  }
  .content-list {
    background-color: #fff;
    .sectionTitle {
      padding: 16px;
      border-bottom: 1px solid rgba(223, 227, 232, 1);
      font-size: 16px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #1c3246;
      line-height: 22px;
    }
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    height: 36px;
  }
}
</style>
