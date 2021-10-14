<!--交易佣金账单列表--->
<template>
  <div class="bill-list">
    <div class="bill-list__top">
      <contHeader :titleText="mytitle || $route.meta.title" />
      <div>
        <el-button
          type="primary"
          size="medium"
          :loading="exportLoading"
          @click.stop="exportExcel"
        >
          导出
        </el-button>
      </div>
    </div>
    <div class="conditions-content">
      <div class="search-content" v-if="!mytitle">
        <el-input
          placeholder="请输入关键词"
          v-model="search.search_words"
          class="input-with-select"
          @keyup.enter.native="init"
        >
          <el-select
            v-model="search.search_id"
            slot="prepend"
            placeholder="请选择"
            size="medium"
          >
            <el-option
              :value="item.value"
              v-for="(item, index) in searchTypeArr"
              :key="index"
              :label="item.text"
            ></el-option>
          </el-select>
        </el-input>
        <!-- 批量搜索 -->
        <el-tooltip placement="bottom" :disabled="!tooltipVal">
          <div slot="content" v-html="tooltipVal"></div>
          <el-button @click.stop="batchSearchShow">批量搜索</el-button>
        </el-tooltip>
        <!--公司类型-->
        <el-popover
          placement="bottom"
          width="150"
          trigger="click"
          @show="isShow = true"
          @hide="isShow = false"
        >
          <el-checkbox-group
            v-model="search.company_type_ids"
            @change="(val) => checkStatus(val, typeData, 'companyName', 'id')"
          >
            <el-checkbox
              v-for="(item, index) in typeData"
              :label="item.id"
              :key="index"
            >
              {{ item.name }}</el-checkbox
            >
          </el-checkbox-group>
          <span
            class="clear-checkbox"
            @click="deleCondition('company_type_ids')"
            >清除</span
          >
          <el-button slot="reference" size="medium">
            公司类型
            <i
              class="el-icon-caret-bottom"
              :style="
                isShow === true
                  ? 'transition: transform 0.2s linear 0s;transform: rotate(-180deg);'
                  : 'transition: transform 0.2s linear 0s;'
              "
            ></i>
          </el-button>
        </el-popover>
        <!--账单状态-->
        <el-popover
          placement="bottom"
          width="100"
          trigger="click"
          @show="billStatusShow = true"
          @hide="billStatusShow = false"
        >
          <el-radio-group
            v-model="search.trade_status[0]"
            @change="
              (val) => checkStatus(val, billStatus, 'billStateName', 'value')
            "
          >
            <el-radio
              :label="item.value"
              v-for="(item, index) in billStatus"
              :key="index"
              >{{ item.name }}</el-radio
            >
          </el-radio-group>
          <el-button slot="reference" size="medium">
            账单状态
            <i
              class="el-icon-caret-bottom"
              :style="
                billStatusShow === true
                  ? 'transition: transform 0.2s linear 0s;transform: rotate(-180deg);'
                  : 'transition: transform 0.2s linear 0s;'
              "
            ></i>
          </el-button>
        </el-popover>
        <!--支付状态-->
        <el-popover
          placement="bottom"
          width="120"
          trigger="click"
          @show="payStatusShow = true"
          @hide="payStatusShow = false"
        >
          <el-checkbox-group
            v-model="search.pay_status"
            @change="
              (val) => checkStatus(val, payStatus, 'payStatusName', 'value')
            "
          >
            <el-checkbox
              v-for="(item, index) in payStatus"
              :label="item.value"
              :value="item.value"
              :key="index"
            >
              {{ item.name }}</el-checkbox
            >
          </el-checkbox-group>
          <span class="clear-checkbox" @click="deleCondition('pay_status')"
            >清除</span
          >
          <el-button slot="reference" size="medium">
            支付状态
            <i
              class="el-icon-caret-bottom"
              :style="
                payStatusShow === true
                  ? 'transition: transform 0.2s linear 0s;transform: rotate(-180deg);'
                  : 'transition: transform 0.2s linear 0s;'
              "
            ></i>
          </el-button>
        </el-popover>
        <!-- 是否发送客户 -->
        <el-popover
          placement="bottom"
          width="100"
          trigger="click"
          @show="isSendUserShow = true"
          @hide="isSendUserShow = false"
        >
          <el-radio-group
            v-model="search.is_send_user"
            @change="
              (val) =>
                checkStatus(val, isSendUserType, 'isSendUserName', 'value')
            "
          >
            <el-radio
              :label="item.value"
              style="padding: 5px 0; display: block"
              v-for="(item, index) in isSendUserType"
              :key="index"
              >{{ item.name }}</el-radio
            >
          </el-radio-group>

          <!-- <span class="clear-checkbox" @click="deleCondition('is_send_user')">清除</span> -->
          <el-button slot="reference" size="medium">
            是否发送客户
            <i
              class="el-icon-caret-bottom"
              :style="
                isSendUserShow === true
                  ? 'transition: transform 0.2s linear 0s;transform: rotate(-180deg);'
                  : 'transition: transform 0.2s linear 0s;'
              "
            ></i>
          </el-button>
        </el-popover>
        <!-- 发票状态 -->
        <el-popover
          placement="bottom"
          width="100"
          trigger="click"
          @show="invoiceStatusShow = true"
          @hide="invoiceStatusShow = false"
        >
          <el-radio-group
            v-model="search.invoice_status"
            @change="
              (val) =>
                checkStatus(val, invoiceStatusArr, 'invoiceStatus', 'value')
            "
          >
            <el-radio
              :label="item.value"
              style="padding: 5px 0; display: block"
              v-for="(item, index) in invoiceStatusArr"
              :key="index"
              >{{ item.name }}</el-radio
            >
          </el-radio-group>

          <el-button slot="reference" size="medium">
            发票状态
            <i
              class="el-icon-caret-bottom"
              :style="
                invoiceStatusShow === true
                  ? 'transition: transform 0.2s linear 0s;transform: rotate(-180deg);'
                  : 'transition: transform 0.2s linear 0s;'
              "
            ></i>
          </el-button>
        </el-popover>
        <!-- 支付方式 -->
        <el-popover
          placement="bottom"
          width="180"
          trigger="click"
          @show="payWayShow = true"
          @hide="payWayShow = false"
        >
          <el-radio-group
            v-model="search.pay_way"
            @change="
              (val) => checkStatus(val, payWayEnums, 'pay_wayStr', 'value')
            "
          >
            <el-radio
              :label="item.value"
              style="padding: 5px 0; display: block"
              v-for="(item, index) in payWayEnums"
              :key="index"
              >{{ item.name }}</el-radio
            >
          </el-radio-group>

          <el-button slot="reference" size="medium">
            支付方式
            <i
              class="el-icon-caret-bottom"
              :style="
                payWayShow === true
                  ? 'transition: transform 0.2s linear 0s;transform: rotate(-180deg);'
                  : 'transition: transform 0.2s linear 0s;'
              "
            ></i>
          </el-button>
        </el-popover>
        <div class="time-search">
          <el-button size="medium">
            账单生成时间
            <i
              class="el-icon-caret-bottom"
              :style="
                isTimeShow === true
                  ? 'transition: transform 0.2s linear 0s;transform: rotate(-180deg);'
                  : 'transition: transform 0.2s linear 0s;'
              "
            ></i>
          </el-button>
          <el-date-picker
            v-model="search.pay_time_range"
            type="daterange"
            align="right"
            @blur="isTimeShow = false"
            @focus="isTimeShow = true"
            unlink-panels
            class="search-time-datePicker"
            range-separator="至"
            value-format="yyyy/MM/dd"
            format="yyyy/MM/dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </div>

        <div class="btn-content">
          <el-button
            type="primary"
            class="search-btn"
            size="medium"
            @click="init()"
          >
            <img src="@/../static/img/search.png" class="iconsousuo" />
            搜索
          </el-button>
          <el-button
            class="clear-btn"
            type="default"
            size="medium"
            @click="clear()"
          >
            <img src="@/../static/img/clear.png" class="iconsousuo" />
            清空
          </el-button>
        </div>
      </div>
      <div v-if="!mytitle" class="search-tag">
        <el-tag
          closable
          v-if="search.company_type_ids.length > 0"
          @close="deleCondition('company_type_ids')"
          style="margin-right: 10px"
          >公司类型： {{ companyName }}</el-tag
        >
        <el-tag
          closable
          v-if="search.trade_status.length > 0"
          @close="deleCondition('trade_status')"
          style="margin-right: 10px"
          >账单状态： {{ billStateName }}</el-tag
        >
        <el-tag
          closable
          v-if="search.pay_status.length > 0"
          @close="deleCondition('pay_status')"
          style="margin-right: 10px"
          >支付状态： {{ payStatusName }}</el-tag
        >
        <el-tag
          closable
          v-if="search.pay_time_range.length > 0"
          style="margin-right: 10px"
          @close="deleCondition('pay_time_range')"
          >账单生成时间： {{ search.pay_time_range[0] }} 至
          {{ search.pay_time_range[1] }}</el-tag
        >
        <el-tag
          closable
          v-if="search.is_send_user.length > 0"
          @close="deleCondition('is_send_user')"
          >是否发送客户：{{ isSendUserName }}
        </el-tag>
        <el-tag
          closable
          v-if="search.invoice_status.length > 0"
          @close="deleCondition('invoice_status')"
          >发票状态：{{ invoiceStatus }}
        </el-tag>
        <el-tag
          closable
          v-if="search.pay_way.length > 0"
          @close="deleCondition('pay_way')"
          >支付方式：{{ pay_wayStr }}
        </el-tag>
      </div>
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
          :column="column"
          :tableData="dataList"
          :page.sync="search.page"
          :page_size.sync="search.page_size"
          :total.sync="pagination.total"
          :loading.sync="loading"
          :pageAct="getList"
          height="calc(100vh - 375px)"
          :selectionShow="true"
          :isSelection="isSelection"
          :tabelSelectOne="getSelectTable"
          :tabelSelectAll="getSelectTableAll"
        />
        <div class="bottom">
          <div v-show="pagination.total" class="summarizing">
            <span>交易佣金总金额($)：{{ commission_usd_total }}</span>
            <span>交易佣金总金额(¥)：{{ commission_total }}</span>
          </div>
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
      invoice_source="1"
    />
  </div>
</template>
<script>
import { companyTypeList, listMultiSearch } from "@/api/common";
import { financeList } from "@/api/finance/list";
import batchSearchMenu from "@/components/search/batchSearch";
import statusTag from "@/components/status/statusTag";
import invoiceDialog from "./createInvoiceComponent/dialog";
import enums from "@/utils/enums";
import dayjs from "dayjs";
export default {
  name: "billList",
  data() {
    return {
      searchTypeArr: [
        {
          value: "1",
          text: "公司名称"
        },
        {
          value: "21",
          text: "账单编号"
        },
        {
          value: "25",
          text: "第三方交易号"
        },
        {
          value: "26",
          text: "发票号码"
        }
      ],
      payStatus: enums.payStatusArr,
      billStatus: enums.billStatusArr,
      isSendArr: enums.isSendArr,
      payWayEnums: enums.payWayEnums,
      isSendUserType: [
        {
          value: "Y",
          name: "是"
        },
        {
          value: "N",
          name: "否"
        }
      ],
      payStatusArr: {
        w: {
          text: "待支付",
          class: "orange-status"
        },
        s: {
          text: "已支付",
          class: "green-status"
        },
        f: {
          text: "支付失败",
          class: "red-status"
        }
      },
      tradeStatusArr: {
        1: {
          text: "正常",
          class: "green-status"
        },
        2: {
          text: "逾期",
          class: "yellow-status"
        },
        3: {
          text: "坏账",
          class: "orange-status"
        }
      },
      invoiceStatusArr: [
        {
          value: "1",
          name: "未开票",
          color: "#FADEDA"
        },
        {
          value: "2",
          name: "已开票",
          color: "#D8F5E8"
        }
      ],
      mytitle: null,
      pickerOptions: enums.pickerOptions,
      isShow: false,
      isTimeShow: false,
      payStatusShow: false,
      billStatusShow: false,
      isSendUserShow: false,
      invoiceStatusShow: false,
      payWayShow: false,
      payStatusName: "",
      billStateName: "",
      isSendUserName: "",
      companyName: "",
      invoiceStatus: "",
      pay_wayStr: "",
      search: {
        pay_time_range: [
          dayjs()
            .startOf("month")
            .format("YYYY/MM/DD"),
          dayjs()
            .endOf("month")
            .format("YYYY/MM/DD")
        ],
        page: 1,
        page_size: 20,
        search_id: "1", //公司名称或者公司类型
        search_words: null, //搜索关键字
        multi_search_words: [], //批量搜索字段
        company_type_ids: [],
        pay_status: [], //支付状态
        trade_status: [], // 账单状态
        is_export: "N",
        is_send_user: "",
        invoice_status: "",
        pay_way: ""
      },
      pagination: {
        total: 0
      },
      typeData: [],
      dataList: [],
      loading: false,
      column: [
        {
          prop: "order_no",
          label: "账单编号",
          width: 190,
          render: ({ h, row }) => {
            return (
              <div>
                <el-link
                  type="primary"
                  size="default"
                  onClick={() => this.toDetail(row, this.search)}
                  style=""
                >
                  {row.order_no}
                </el-link>
              </div>
            );
          }
        },
        {
          prop: "shop_name",
          label: "店铺",
          width: 200,
          align: "left"
        },
        {
          prop: "company_name",
          label: "公司",
          width: 200,
          align: "left"
        },
        {
          prop: "company_type_name",
          label: "公司类型",
          width: 150,
          align: "left"
        },
        {
          prop: "create_time",
          label: "账单生成时间",
          width: 150,
          align: "left"
        },
        {
          prop: "trade_status",
          label: "账单状态",
          render: ({ h, row }) => {
            return h(statusTag, {
              class: [this.tradeStatusArr[row.trade_status].class],
              slot: "status-slot",
              domProps: {
                innerHTML: this.tradeStatusArr[row.trade_status].text
              }
            });
          }
        },
        {
          prop: "trade_age",
          label: "账龄(天)",
          align: "right"
        },
        {
          prop: "gmv_amount",
          label: "GMV($)",
          align: "right",
          width: 130
        },
        {
          // prop: "commission_amount",
          prop: "discount_after_commission_amount",
          label: "交易佣金($)",
          align: "right",
          width: 130
        },
        {
          // prop: "commission_amount_rmb",
          prop: "discount_after_commission_amount_rmb",
          label: "交易佣金(¥)",
          align: "right",
          width: 130
        },
        {
          prop: "is_send_user_str",
          label: "是否已发送客户",
          width: 120
        },
        {
          prop: "send_user_time",
          label: "发送客户时间",
          width: 150
        },
        {
          prop: "pay_status",
          label: "支付状态",
          width: 100,
          render: ({ h, row }) => {
            return h(statusTag, {
              class: [this.payStatusArr[row.pay_status].class],
              slot: "status-slot",
              domProps: {
                innerHTML: this.payStatusArr[row.pay_status].text
              }
            });
          }
        },
        {
          prop: "pay_way_str",
          label: "支付方式",
          width: 150
        },
        {
          prop: "third_part_order_no",
          label: "第三方交易号",
          width: 220
        },
        {
          prop: "pay_time",
          label: "支付时间",
          width: 150
        },
        {
          prop: "invoice_status_str",
          label: "开票状态",
          render: ({ h, row }) => {
            return h(statusTag, {
              style: {
                backgroundColor: this.invoiceStatusArr[row.invoice_status - 1]
                  .color
              },
              slot: "status-slot",
              domProps: {
                innerHTML: row.invoice_status_str
              }
            });
          }
        },
        {
          prop: "invoice_no",
          label: "发票号码",
          width: 180
        }
      ],

      tooltipVal: "",
      searchDialogVisible: false,
      batchSearchObj: {
        searchVal: "",
        errorIsShow: true,
        batchSearchLoading: false,
        failList: []
      },
      successList: [],
      exportLoading: false,
      commission_total: 0,
      commission_usd_total: 0,
      selectArr: [],
      invoiceVisible: false,
      isPaypal: false
    };
  },
  components: {
    batchSearchMenu,
    statusTag,
    invoiceDialog
  },
  watch: {
    dataList: {
      immediate: true,
      handler(val) {
        this.iterationTable(val);
      }
    }
  },

  activated() {
    this.initResource();
    this.search = { ...this.search, ...this.$route.query };
    this.getList();
  },
  created() {
    this.initCondition();
  },
  // mounted() {
  //   this.initResource();
  //     this.init();
  // },
  methods: {
    // -------------------------new
    // 批量搜索
    batchSearchShow() {
      this.search.search_words = "";
      this.batchSearchObj.searchVal = "";
      this.searchDialogVisible = true;
    },
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
        multi_search_words: arr
      };

      listMultiSearch(params).then(res => {
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
    // 关闭不合法参数的弹窗
    clerarBatchSearch() {
      this.batchSearchObj.errorIsShow = true;
    },
    initResource() {
      // return new Promise((resolve, reject) => {
      companyTypeList().then(res => {
        this.typeData = res.data.list;
        // resolve();
      });
      // });
    },
    getList() {
      this.loading = true;
      this.search.multi_search_words = this.search.search_words
        ? []
        : this.successList;
      financeList(this.search).then(res => {
        let { count, list, commission_usd_total, commission_total } = res.data;
        list.forEach(element => {
          this.$set(element, "checked", false);
          const row = this.selectArr.find(v => {
            return v.order_no == element.order_no;
          });
          if (row) {
            this.$set(element, "checked", true);
          }
        });
        this.pagination.total = count;
        this.dataList = list;
        this.commission_usd_total = commission_usd_total;
        this.commission_total = commission_total;
        this.$nextTick(() => {
          this.loading = false;
        });
      });
    },
    checkStatus(value, data, key, label) {
      let arr = [];
      for (let val of data) {
        if (Object.prototype.toString.call(value) == "[object Array]") {
          if (value.indexOf(val[label]) == -1) {
            continue;
          } else {
            arr.push(val.name);
          }
        } else {
          if (value !== val[label]) {
            continue;
          } else {
            arr.push(val.name);
          }
        }
      }
      this[key] = arr.join(",");
    },
    initCondition() {
      this.selectArr = [];
      // 如果输入框中输入搜索内容后就清空批量搜索的数组参数
      if (this.search.search_words) {
        this.successList = [];
        this.tooltipVal = "";
      }
      this.search.page = 1;
    },
    init() {
      this.initCondition();
      this.getList();
    },
    clear() {
      this.successList = [];
      this.tooltipVal = "";
      this.search = this.$options.data().search;
      this.init();
    },
    toDetail(
      { id, order_no, shop_id },
      {
        pay_time_range,
        search_words,
        company_type_ids,
        pay_status,
        trade_status
      }
    ) {
      this.$router.push({
        path: `/financeMana/settlement/detail?id=${id}&order_no=${order_no}&shop_id=${shop_id}`
      });
    },

    //  &pay_time_range=${pay_time_range}&search_words=${search_words}&company_type_ids=${company_type_ids}&pay_status=${pay_status}&trade_status=${trade_status}

    deleCondition(key) {
      this.search[key] =
        key == "is_send_user" || key == "pay_way" || key == "invoice_status"
          ? ""
          : [];
      this.init();
    },
    // 导出
    exportExcel() {
      this.exportLoading = true;
      this.search.is_export = "Y";
      financeList(this.search)
        .then(res => {
          if (res.code == 0) {
            this.search.is_export = "N";
            let { oss_url } = res.data;
            window.location.href = oss_url;
            this.exportLoading = false;
          }
        })
        .catch(err => {
          this.exportLoading = false;
          this.search.is_export = "N";
        });
    },
    isSelection(row, index) {
      if (
        row.pay_status == "s" &&
        row.invoice_status == 1 &&
        Number(row.discount_after_commission_amount_rmb) > 0
      ) {
        return true; // 不禁用
      } else {
        return false; // 禁用
      }
    },
    createInvoice(arr, title) {
      let ids = arr.map(v => v.company_id);
      let payWays = arr.map(v => v.pay_way);
      let companyIds = Array.from(new Set(ids));
      if (companyIds.length > 1) {
        this.$message.warning(
          "只能对相同公司的账单进行批量开票，请核对后，重新选择"
        );
        return;
      }
      let way = payWays.find(v => v == "paypal" || v == "auto_paypal");
      if (way) {
        let bool = payWays.some(v => {
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
      this.invoiceVisible = true;
    },
    getSelectTable(val) {
      if (val.checked) {
        this.selectArr = [...this.selectArr, val];
      } else {
        const index = this.selectArr.findIndex(v => {
          return v.order_no == val.order_no;
        });
        if (index > -1) {
          this.selectArr.splice(index, 1);
        }
      }
    },
    getSelectTableAll() {
      this.dataList.forEach(v => {
        const index = this.selectArr.findIndex(element => {
          return v.order_no == element.order_no;
        });
        if (index > -1) {
          v.checked = false;
          this.selectArr.splice(index, 1);
        }
      });
    },
    iterationTable(rows = []) {
      this.$nextTick(() => {
        rows.forEach(row => {
          this.$refs["tableChild"].toggleRowSelect(row, row.checked);
        });
      });
    }
  },
  computed: {
    constructIds() {
      return arr => {
        return arr.map(v => v.order_no);
      };
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .orange-status {
  background: #ffc48b;
}
/deep/ .green-status {
  background: #bbe5b3;
}
/deep/ .yellow-status {
  background: #ffea8a;
}
/deep/ .red-status {
  background: #ff4343;
}
.bill-list {
  .padding-16 {
    padding: 16px;
  }
  .row-card-content {
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #dfe3e8;
    height: 98px;
    margin-top: 16px;
    width: 100%;
    .border-right {
      border-right: 1px solid rgba(223, 227, 232, 1);
    }
    .label-margin {
      display: block;
      margin: 16px 0px 0px 16px;
    }
    .h2-margin {
      margin-left: 16px;
    }
    label {
      font-size: 16px;
      font-family: PingFangSC-Light, PingFang SC;
      font-weight: 300;
      color: #1c3246;
      line-height: 22px;
    }
    h2 {
      margin-top: 16px;
      font-size: 20px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #1c3246;
      line-height: 28px;
    }
  }

  .link-a {
    color: #409eff;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
  .list-content {
    .bottom {
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
}
/deep/.bill-list {
  .bill-list__top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 14px;
    .el-button {
      padding-top: 0;
      padding-bottom: 0;
      line-height: 34px;
    }
    .el-link {
      margin: 0;
    }
  }
}
</style>
