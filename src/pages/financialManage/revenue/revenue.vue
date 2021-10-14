<!---*
* @description 
* @fileName revenue.vue(套餐收入流水)
* @author 龙伟
* @date 2021/03/26 14:54:35
*--->
<template>
  <div class="revenue-contaniner">
    <contHeader :titleText="$route.meta.title" />
    <el-button
      type="primary"
      class="exportbtn"
      size="medium"
      :loading="exportLoading"
      @click.stop="exportExcel"
      >导出</el-button
    >
    <div class="conditions-content">
      <div class="toggleBtns">
        <el-tabs v-model="search.tab_type" @tab-click="toggleBtn">
          <el-tab-pane label="店铺购买" name="shop"></el-tab-pane>
          <el-tab-pane label="公司购买" name="company"></el-tab-pane>
        </el-tabs>
      </div>
      <searchComponent
        :search="search"
        :btnConfig="btnConfig"
        :searchTypeArr="searchTypeArr"
        :elpopoverArr="elpopoverArr"
        :dateConfig="dateConfig"
        :inputEnter="init"
      >
        <!-- 批量搜索 -->
        <template slot="multipleSearch">
          <el-tooltip placement="left" :disabled="!tooltipVal" effect="light">
            <div slot="content" v-html="tooltipVal"></div>
            <el-button @click.stop="batchSearchShow">批量搜索</el-button>
          </el-tooltip>
        </template>
        <template :slot="elpopoverArr[0].slotName">
          <el-checkbox-group
            v-model="search.company_type_ids"
            @change="(val) => checkStatus(val, typeData, 'companyName', 'id')"
          >
            <el-checkbox
              v-for="(item, index) in typeData"
              :label="item.id"
              :value="item.id"
              :key="index"
            >
              {{ item.name }}</el-checkbox
            >
          </el-checkbox-group>
          <span class="clear-checkbox" @click="deleCondition('company_type')"
            >清除</span
          >
        </template>
        <template :slot="elpopoverArr[1].slotName">
          <el-radio-group
            v-model="search.platform_product_id"
            @change="
              (val) => changeStatus(val, platformData, 'platformName', 'id')
            "
          >
            <el-radio
              style="padding: 5px 0"
              v-for="(item, index) in platformData"
              :key="index"
              :label="item.id"
              >{{ item.name }}</el-radio
            >
          </el-radio-group>
        </template>
        <template :slot="elpopoverArr[2].slotName">
          <el-radio-group
            v-model="search.pay_way"
            @change="
              (val) => changeStatus(val, payWayEnums, 'payWayTypeName', 'value')
            "
          >
            <el-radio
              style="padding: 5px 0"
              v-for="(item, index) in payWayEnums"
              :key="index"
              :label="item.value"
              >{{ item.name }}</el-radio
            >
          </el-radio-group>
        </template>
        <template :slot="elpopoverArr[3].slotName">
          <el-radio-group
            v-model="search.invoice_status"
            @change="
              (val) =>
                changeStatus(val, invoiceStatusArr, 'invoiceStatus', 'value')
            "
          >
            <el-radio
              style="padding: 5px 0"
              v-for="(item, index) in invoiceStatusArr"
              :key="index"
              :label="item.value"
              >{{ item.name }}</el-radio
            >
          </el-radio-group>
        </template>

        <template>
          <el-tag
            closable
            v-if="search.company_type_ids.length > 0"
            @close="deleCondition('company_type_ids')"
            style="margin-right: 10px"
            >公司类型： {{ companyName }}</el-tag
          >
        </template>
        <template>
          <el-tag
            closable
            v-if="search.platform_product_id != ''"
            @close="deleCondition('platform_product_id')"
            style="margin-right: 10px"
            >套餐类型： {{ platformName }}</el-tag
          >
        </template>
        <template>
          <el-tag
            closable
            v-if="search.pay_way.length > 0"
            @close="deleCondition('pay_way')"
            style="margin-right: 10px"
            >支付方式： {{ payWayTypeName }}</el-tag
          >
        </template>
        <template>
          <el-tag
            closable
            v-if="search.invoice_status.length > 0"
            @close="deleCondition('invoice_status')"
            style="margin-right: 10px"
            >支付方式： {{ invoiceStatus }}</el-tag
          >
        </template>
      </searchComponent>
      <div class="batchActBox">
        <div class="seletSumBox">
          <span>
            已经选中<i>{{ constructIds(selectArr).length }}</i
            >项
          </span>
          <el-button
            size="medium"
            :disabled="selectArr.length <= 0"
            @click="createInvoice(selectArr)"
          >
            批量开票
          </el-button>
        </div>
      </div>
      <div class="list-content">
        <tableComponent
          ref="tableChild"
          :column="newColumn"
          :tableData="dataList"
          :page.sync="search.page"
          :page_size.sync="search.page_size"
          :total.sync="pagination.total"
          :loading.sync="loading"
          height="calc(100vh - 422px)"
          :pageAct="getList"
          :selectionShow="true"
          :isSelection="isSelection"
          :tabelSelectOne="getSelectTable"
          :tabelSelectAll="getSelectTableAll"
        />
        <div v-show="pagination.total" class="summarizing">
          <span>支付总金额($)：{{ pay_usd_total }}</span>
          <span>支付总金额(¥)：{{ pay_total }}</span>
        </div>
      </div>
    </div>
    <!--批量搜索 -->
    <batchSearchMenu
      :searchDialogVisible.sync="searchDialogVisible"
      v-if="searchDialogVisible"
      :searchTypeArr="searchTypeArr"
      :search="search"
      :batchSearchObj="batchSearchObj"
      :getBatchSearchData="getBatchSearchData"
      :clerarBatchSearch="clerarBatchSearch"
    />
    <invoiceDialog
      v-if="invoiceVisible"
      :invoiceVisible.sync="invoiceVisible"
      :selectArr="selectArr"
      :isPaypal="isPaypal"
      :order_nos="constructIds(selectArr)"
      :init="init"
      :invoice_source="search.tab_type == 'shop' ? '2' : '3'"
    />
  </div>
</template>

<script>
import { companyTypeList } from "@/api/common";
import batchSearchMenu from "@/components/search/batchSearch";
import invoiceDialog from "../createInvoiceComponent/dialog";
import statusTag from "@/components/status/statusTag";
import enums from "@/utils/enums";
import { platformProductList } from "@/api/leadManagement/shopManagement";
import {
  settlementService,
  listMultiSearch,
} from "@/api/finance/revenue/revenue";
export default {
  name: "revenue",
  components: { batchSearchMenu, invoiceDialog, statusTag },
  data() {
    return {
      activeName: "shop",
      payWayEnums: enums.payWayEnums,
      search: {
        search_id: "1",
        pay_way: "",
        tab_type: "shop",
        search_words: "",
        multi_search_words: [],
        platform_product_id: "",
        company_type_ids: [],
        pay_time_range: [],
        is_export: "N",
        page: 1,
        page_size: 15,
        invoice_status: "",
      },
      btnConfig: [
        { text: "搜索", icon: "search", type: "primary", cb: "init" },
        { text: "清空", icon: "clear", type: "default", cb: "clear" },
      ],
      pagination: {
        total: 0,
      },
      searchTypeArr: [
        {
          value: "1",
          text: "公司名称",
        },
        {
          value: "2",
          text: "店铺名称",
        },
        {
          value: "3",
          text: "店铺订单编号",
        },
        {
          value: "4",
          text: "公司订单编号",
        },
        {
          value: "5",
          text: "第三方交易号",
        },
        {
          value: "6",
          text: "发票号码",
        },
      ],
      invoiceStatusArr: [
        {
          value: "1",
          name: "未开票",
          color: "#FADEDA",
        },
        {
          value: "2",
          name: "已开票",
          color: "#D8F5E8",
        },
      ],
      elpopoverArr: [
        {
          btnText: "公司类型",
          slotName: "companyType",
          key: "company_type_ids",
          width: 150,
          bool: false,
          isShow: function (bool) {
            return bool;
          },
        },
        {
          btnText: "套餐类型",
          slotName: "platform_product_id",
          key: "platform_product_id",
          width: 150,
          bool: false,
          isShow: function (bool) {
            return bool;
          },
        },
        {
          btnText: "支付方式",
          slotName: "payWay",
          key: "pay_way",
          width: 190,
          bool: false,
          isShow: function (bool) {
            return bool;
          },
        },
        {
          btnText: "发票状态",
          slotName: "invoiceStatus",
          key: "invoice_status",
          bool: false,
          isShow: function (bool) {
            return bool;
          },
        },
      ],
      dateConfig: [
        {
          label: "支付时间",
          key: "pay_time_range",
          isTimeShow: false,
        },
      ],
      shopColumn: [
        {
          prop: "shop_order_no",
          label: "店铺订单编号",
          width: 240,
          fixed: "left",
        },
        {
          prop: "shop_name",
          label: "店铺名称",
          width: 150,
        },
      ],
      column: [
        {
          prop: "order_no",
          label: "公司订单编号",
          width: 240,
          fixed: "left",
        },
        {
          prop: "trade_no",
          label: "第三方交易号",
          width: 280,
        },
        {
          prop: "company_name",
          label: "公司名称",
          width: 150,
        },
        {
          prop: "company_type",
          label: "公司类型",
          width: 120,
        },
        {
          prop: "platform_product_name",
          label: "套餐类型",
          width: 120,
        },
        {
          prop: "platform_selling_price",
          label: "套餐单价(¥/月)",
          align: "right",
          width: 120,
        },
        {
          prop: "platform_selling_price_usd",
          label: "套餐单价($/月)",
          align: "right",
          width: 120,
        },
        {
          prop: "num",
          label: "购买时长(月)",
          align: "right",
          width: 100,
        },
        {
          prop: "selling_price",
          label: "支付金额(¥)",
          align: "right",
          width: 120,
        },
        {
          prop: "selling_price_usd",
          label: "支付金额($)",
          align: "right",
          width: 120,
        },
        {
          prop: "pay_way_str",
          label: "支付方式",
          width: 120,
        },
        {
          prop: "pay_time",
          label: "支付时间",
          width: 150,
        },
        {
          prop: "invoice_status_str",
          label: "开票状态",
          render: ({ h, row }) => {
            return h(statusTag, {
              style: {
                backgroundColor:
                  this.invoiceStatusArr[row.invoice_status - 1].color,
              },
              slot: "status-slot",
              domProps: {
                innerHTML: row.invoice_status_str,
              },
            });
          },
        },
        {
          prop: "invoice_no",
          label: "发票号码",
          width: 180,
        },
      ],
      loading: false,
      dataList: [],
      pay_total: "0",
      pay_usd_total: "0",
      typeData: [],
      platformData: [],
      companyName: "",
      platformName: "",
      payWayTypeName: "",
      invoiceStatus: "",
      tooltipVal: "",
      searchDialogVisible: false,
      successList: [],
      batchSearchObj: {
        searchVal: "",
        errorIsShow: true,
        batchSearchLoading: false,
        failList: [],
      },
      exportLoading: false,
      isPaypal: false,
      invoiceVisible: false,
      selectArr: [],
    };
  },
  props: {},
  watch: {
    dataList: {
      immediate: true,
      handler(val) {
        this.iterationTable(val);
      },
    },
    $route: {
      immediate: true,
      deep: true,
      handler(val) {
        if (Object.keys(val.query).length > 0) {
          // let { search_id, search_words, invoice_source } = val.query;
          this.search = { ...this.search, ...val.query };
          this.init();
        }
      },
    },
  },
  computed: {
    newColumn() {
      if (this.search.tab_type == "shop") {
        return [
          this.shopColumn[0],
          ...this.column.slice(0, 3),
          this.shopColumn[1],
          ...this.column.slice(3),
        ];
      } else {
        return this.column;
      }
    },
    constructIds() {
      return (arr) => {
        return arr.map((v) => {
          if (this.search.tab_type == "shop") {
            return v.shop_order_no;
          } else {
            return v.order_no;
          }
        });
      };
    },
    isValidReferCom() {
      return (arr) => {
        if (this.search.tab_type == "shop") {
          return arr.some((v) => v.order_no.trim().length > 0);
        } else {
          return false;
        }
      };
    },
  },
  created() {
    this.initResource();
    this.getDefaultData();
    this.getList();
  },
  methods: {
    // tap切换
    toggleBtn({ name, index }) {
      // if (this.search.tab_type == name) return;
      // this.search.multi_search_words = [];
      // this.search.tab_type = name;
      this.init();
    },
    // 导出
    exportExcel() {
      this.exportLoading = true;
      this.search.is_export = "Y";
      settlementService(this.search)
        .then((res) => {
          if (res.code == 0) {
            this.search.is_export = "N";
            let { oss_url } = res.data;
            // window.open(oss_url);
            window.location.href = oss_url;
            this.exportLoading = false;
          }
        })
        .catch((err) => {
          this.exportLoading = false;
          this.search.is_export = "N";
        });
    },
    // 批量搜索弹窗显示
    batchSearchShow() {
      this.search.search_words = "";
      this.batchSearchObj.searchVal = "";
      this.searchDialogVisible = true;
    },
    // 批量搜索
    getBatchSearchData() {
      if (!this.batchSearchObj.searchVal.trim()) {
        this.$message.error("请输入查询条件");
        return;
      }
      let arr = [];
      this.batchSearchObj.searchVal.split("\n").forEach((v, i) => {
        if (v.trim()) {
          arr.push(v.trim());
        }
      });
      if (arr.length > 500) {
        this.$message.error("最多支持500个查询条件");
        return;
      }
      this.batchSearchObj.batchSearchLoading = true;
      this.tooltipVal = arr.join("<br/>");
      let params = {
        search_id: this.search.search_id,
        multi_search_words: arr,
      };
      listMultiSearch(params).then((res) => {
        let { data } = res;
        if (res.code == 0) {
          this.successList = data.success;
          this.batchSearchObj.failList = data.fail;
        }
        if (this.batchSearchObj.failList.length == 0) {
          this.searchDialogVisible = false;
        } else {
          this.batchSearchObj.errorIsShow = false;
        }
        this.init();
      });
      this.batchSearchObj.batchSearchLoading = false;
    },
    clerarBatchSearch() {
      this.batchSearchObj.errorIsShow = true;
    },
    // 获取数据
    getList() {
      this.loading = true;
      this.search.multi_search_words = this.search.search_words
        ? []
        : this.successList;
      settlementService(this.search)
        .then((res) => {
          if (res.code == 0) {
            let { list, count, pay_total, pay_usd_total } = res.data;
            list.forEach((element) => {
              this.$set(element, "checked", false);
              const row = this.selectArr.find((v) => {
                if (this.search.tab_type == "shop") {
                  return v.shop_order_no == element.shop_order_no;
                } else {
                  return v.order_no == element.order_no;
                }
              });
              if (row) {
                this.$set(element, "checked", true);
              }
            });
            this.dataList = list;
            this.pagination.total = count;
            this.pay_total = pay_total;
            this.pay_usd_total = pay_usd_total;
            this.$nextTick(() => {
              this.loading = false;
            });
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    init() {
      this.selectArr = [];
      // 如果输入框中输入搜索内容后就清空批量搜索的数组参数
      if (this.search.search_words) {
        this.successList = [];
        this.tooltipVal = "";
      }
      this.search.page = 1;
      this.getList();
    },
    clear() {
      this.successList = [];
      this.tooltipVal = "";
      let name = this.search.tab_type;
      this.search = this.$options.data().search;
      this.search.tab_type = name;
      this.init();
    },
    // 获取默认数据
    getDefaultData() {
      platformProductList({}).then((res) => {
        // console.log(res);
        this.platformData = res.data;
      });
    },
    // 获取公司类型
    initResource() {
      return new Promise((resolve, reject) => {
        companyTypeList().then((res) => {
          this.typeData = res.data.list;
          resolve();
        });
      });
    },
    deleCondition(key) {
      if (key == "company_type_ids") {
        this.search[key] = [];
      } else {
        this.search[key] = "";
      }
      this.init();
    },
    checkStatus(value, data, key, label) {
      let arr = [];
      for (let val of data) {
        if (value.indexOf(val[label]) == -1) {
          continue;
        } else {
          arr.push(val.name);
        }
      }
      this[key] = arr.join(",");
    },
    changeStatus(value, data, key, label) {
      let arr = [];
      for (let v of data) {
        if (v[label] == value) {
          arr.push(v.name);
          this[key] = arr.join(",");
          return;
        }
      }
    },
    isSelection(row, index) {
      if (row.invoice_status == 1 && Number(row.selling_price_usd) > 0) {
        return true; // 不禁用
      } else {
        return false; // 禁用
      }
    },
    createInvoice(arr, title) {
      let ids = arr.map((v) => v.company_id);
      let payWays = arr.map((v) => v.pay_way);
      let companyIds = Array.from(new Set(ids));
      if (companyIds.length > 1) {
        this.$message.warning(
          "只能对相同公司的账单进行批量开票，请核对后，重新选择"
        );
        return;
      }
      let way = payWays.find((v) => v == "paypal" || v == "auto_paypal");
      if (way) {
        let bool = payWays.some((v) => {
          return !(v == "paypal" || v == "auto_paypal");
        });
        if (bool) {
          this.$message.warning(
            "贝宝支付/paypal自动扣款和其他支付类型的账单不能混选，请核对后重新勾选"
          );
          return;
        } else {
          this.isPaypal = true;
        }
      } else {
        this.isPaypal = false;
      }
      if (this.isValidReferCom(this.selectArr)) {
        this.$message.warning("开票店铺存在关联公司，请到公司购买列表开票");
        return;
      }
      this.invoiceVisible = true;
    },
    getSelectTable(val) {
      if (val.checked) {
        this.selectArr = [...this.selectArr, val];
      } else {
        const index = this.selectArr.findIndex((v) => {
          if (this.search.tab_type == "shop") {
            return v.shop_order_no == val.shop_order_no;
          } else {
            return v.order_no == val.order_no;
          }
        });
        if (index > -1) {
          this.selectArr.splice(index, 1);
        }
      }
      
    },
    getSelectTableAll() {
      this.dataList.forEach((v) => {
        const index = this.selectArr.findIndex((element) => {
          if (this.search.tab_type == "shop") {
            return v.shop_order_no == element.shop_order_no;
          } else {
            return v.order_no == element.order_no;
          }
        });
        if (index > -1) {
          v.checked = false;
          this.selectArr.splice(index, 1);
        }
      });
    },
    iterationTable(rows = []) {
      this.$nextTick(() => {
        rows.forEach((row) => {
          this.$refs["tableChild"].toggleRowSelect(row, row.checked);
        });
      });
    },
  },
};
</script>

<style scoped lang='scss'>
.revenue-contaniner {
  position: relative;
  .exportbtn {
    position: absolute;
    right: 0;
    top: 0px;
    height: 36px;
    line-height: 36px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .conditions-content {
    .toggleBtns {
      /deep/ .el-tabs .el-tabs__header {
        margin-bottom: 0;
        .el-tabs__nav-wrap {
          &::after {
            height: 1px;
            background-color: #c8d4df;
          }
          .el-tabs__nav-scroll {
            padding-left: 20px;
            .el-tabs__nav {
              .el-tabs__active-bar {
                height: 3px;
              }
              .el-tabs__item {
                height: 47px;
                line-height: 47px;
                color: #637381;
                font-weight: 500;
                &.is-active {
                  color: #212b36;
                  font-weight: 700;
                }
              }
            }
          }
        }
      }
    }
  }
  .list-content {
    position: relative;
    .summarizing {
      position: absolute;
      left: 0;
      bottom: 0px;
      height: 70px;
      line-height: 70px;
      padding: 0 20px;
      span {
        font-size: 14px;
        color: #212b36;
        margin-right: 24px;
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
}
</style>