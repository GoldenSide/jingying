<!---*
* @description  逾期账单跟进
* @fileName list.vue
* @author 叶金龙
* @date 2021/03/09 10:39:17
*--->
<template>
  <div class="overdueBillFollow-container">
    <contHeader :titleText="$route.meta.title" />
    <div class="btnBox">
      <el-button
        class="exportbtn"
        size="medium"
        @click="pullBillData"
        :loading="pullBillLoading"
        >拉取逾期账单</el-button
      >
      <el-button
        class="exportbtn"
        size="medium"
        @click="exportList"
        :loading="exportLoading"
        >导出</el-button
      >
      <el-button
        class="exportbtn"
        type="primary"
        size="medium"
        @click="historyOrder"
        >查看历史工单</el-button
      >
    </div>

    <div class="conditions-content">
      <searchComponent
        :search="search"
        :btnConfig="btnConfig"
        :searchTypeArr="searchTypeArr"
        :elpopoverArr="elpopoverArr"
        :dateConfig="dateConfig"
        :inputEnter="init"
      >
        <template slot="multipleSearch">
          <el-tooltip placement="bottom" :disabled="!tooltipVal">
            <div slot="content" v-html="tooltipVal"></div>
            <el-button @click.stop="batchSearchShow">批量搜索</el-button>
          </el-tooltip>
        </template>
        <template :slot="elpopoverArr[0].slotName">
          <el-radio-group v-model="search.pay_status">
            <el-radio
              style="padding: 5px 0"
              v-for="(item, index) in payStatus"
              :key="index"
              :label="item.value"
              >{{ item.name }}</el-radio
            >
          </el-radio-group>
        </template>
        <template :slot="elpopoverArr[1].slotName">
          <el-checkbox-group v-model="search.company_type">
            <el-checkbox
              v-for="(item, index) in selectType"
              :key="index"
              :label="item.id"
              >{{ item.name }}</el-checkbox
            >
          </el-checkbox-group>
          <span class="clear-checkbox" @click="deleCondition('company_type')"
            >清除</span
          >
        </template>
        <template>
          <el-tag
            v-for="(item, index) in elpopoverArr"
            :key="index"
            closable
            v-show="checkCalc(item.key, item.checkArr(), item.value).length > 0"
            @close="deleCondition(item.key)"
            style="margin-right: 10px"
            >{{ item.btnText }}：
            {{ checkCalc(item.key, item.checkArr(), item.value) }}
          </el-tag>
        </template>
      </searchComponent>
      <div class="batchActBox">
        <div class="seletSumBox">
          <span>
            已选<i>{{ constructIds(this.selectArr).length }}</i
            >项
          </span>
          <el-button
            size="medium"
            @click="payBackOrder"
            :disabled="this.selectArr.length <= 0"
            >创建回款工单</el-button
          >
          <el-button
            size="medium"
            @click="badBillOrder"
            :disabled="this.selectArr.length <= 0"
            >创建坏账工单</el-button
          >
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
          :isSelection="isSelection"
          :selectionShow="true"
          height="calc(100vh - 375px)"
          :pageAct="getList"
          :tabelSelectOne="getSelectTable"
          :tabelSelectAll="getSelectTableAll"
        />
        <div v-show="pagination.total" class="summarizing">
          <span
            >逾期账单总金额($):{{
              totalModel.total_overdue_amount_usd || "--"
            }}</span
          >
          <span
            >逾期账单总金额(￥):{{
              totalModel.total_overdue_amount || "--"
            }}</span
          >
        </div>
      </div>
    </div>
    <logMenu
      :logVisible.sync="logVisible"
      v-if="logVisible"
      :logData="logData"
      :getLogData="getLogData"
    />
    <addNotice
      v-if="noticeVisible"
      :noticeVisible.sync="noticeVisible"
      :overdue_bill_id="overdue_bill_id"
    />
    <badBillOrder
      v-if="badbillVisible"
      :badbillVisible.sync="badbillVisible"
      :ids="constructIds(selectArr)"
      :arr="selectArr"
      :topTitle="topTitle"
      :isEdit="true"
      :init="clear"
    />
    <paymentOrder
      v-if="payMentVisible"
      :payMentVisible.sync="payMentVisible"
      :ids="constructIds(selectArr)"
      :arr="selectArr"
      :topTitle="topTitle"
      :isEdit="true"
      :init="clear"
    />

    <batchSearchMenu
      :searchDialogVisible.sync="searchDialogVisible"
      v-if="searchDialogVisible"
      :searchTypeArr="searchTypeArr"
      :search="search"
      :batchSearchObj="batchSearchObj"
      :getBatchSearchData="getBatchSearchData"
      :clerarBatchSearch="clerarBatchSearch"
    />
  </div>
</template>

<script>
import { companyTypeList, listMultiSearch } from "@/api/common";
import {
  overdueList,
  overdueTotal,
  getExportUrl,
  dailyLogList,
  checkCanUse,
  pullOverdueBill
} from "@/api/serviceMn/customerMn/overdueBillFollow";
import addNotice from "./component/noticeAdd";
import statusTag from "@/components/status/statusTag";
import badBillOrder from "./component/badBillOrder";
import paymentOrder from "./component/paymentOrder";
import batchSearchMenu from "@/components/search/batchSearch";
export default {
  name: "overdueBillFollow",
  components: {
    addNotice,
    statusTag,
    badBillOrder,
    paymentOrder,
    batchSearchMenu
  },
  data() {
    return {
      tooltipVal: "",
      dateConfig: [
        {
          label: "账单生成时间",
          key: "start_date_range",
          isTimeShow: false
        }
      ],
      elpopoverArr: [
        {
          btnText: "支付状态",
          slotName: "payStatus",
          key: "pay_status",
          value: "value",
          width: 150,
          bool: false,
          isShow: function(bool) {
            return bool;
          },
          checkArr: () => {
            return this.payStatus;
          }
        },
        {
          btnText: "公司类型",
          slotName: "companyType",
          key: "company_type",
          width: 150,
          value: "id",
          bool: false,
          isShow: function(bool) {
            return bool;
          },
          checkArr: () => {
            return this.selectType;
          }
        }
      ],
      btnConfig: [
        { text: "搜索", icon: "search", type: "primary", cb: "init" },
        { text: "清空", icon: "clear", type: "default", cb: "clear" }
      ],
      searchTypeArr: [
        {
          value: "1",
          text: "公司名称"
        },
        {
          value: "11",
          text: "店铺名称"
        },
        {
          value: "22",
          text: "账单编号"
        }
      ],
      payStatus: [
        { value: "w", name: "待支付" },
        // { value: "s", name: "已支付" },
        { value: "f", name: "支付失败" }
      ],
      selectType: [],
      search: {
        pay_status: "",
        company_type: [],
        search_words: "",
        search_id: "1",
        page: 1,
        page_size: 15,
        start_date_range: [],
        multi_search_words: []
      },
      pagination: {
        total: 0
      },
      loading: false,
      dataList: [],
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
          }
        },
        { prop: "name", label: "店铺名称", width: 200 },
        { prop: "company_name", label: "公司名称", width: 200 },
        { prop: "company_type_name", label: "公司类型", width: 150 },
        { prop: "trade_age", label: "账龄(天)", width: 100, align: "right" },
        {
          prop: "should_pay_amount_usd",
          label: "逾期账单金额($)",
          width: 200,
          align: "right"
        },
        {
          prop: "should_pay_amount",
          label: "逾期账单金额(￥)",
          width: 200,
          align: "right"
        },
        { prop: "start_date", label: "账单生成时间", width: 200 },
        { prop: "push_time", label: "发送客户时间", width: 200 },
        {
          prop: "pay_status_text",
          label: "支付状态",
          width: 150,
          render: ({ h, row }) => {
            return h(statusTag, {
              style: {
                backgroundColor: row.bgc
              },
              slot: "status-slot",
              domProps: {
                innerHTML: row.pay_status_text
              }
            });
          }
        },
        { prop: "pay_way", label: "支付方式", width: 150 },
        { prop: "pay_time", label: "支付时间", width: 150 },
        { prop: "follow_user_name", label: "跟进人", width: 100 },
        {
          prop: "code",
          label: "操作",
          width: 100,
          fixed: "right",
          render: ({ h, row }) => {
            return (
              <div>
                <el-link
                  type="primary"
                  size="default"
                  onClick={() => this.daliyLog(row)}
                  style=""
                >
                  日志
                </el-link>
                <el-link
                  type="primary"
                  size="default"
                  onClick={() => this.notice(row)}
                  style=""
                >
                  备注
                </el-link>
              </div>
            );
          }
        }
      ],
      selectArr: [],
      totalModel: {},
      logVisible: false,
      logData: {
        logSearch: {
          overdue_bill_id: "",
          page: 1,
          page_size: 15
        },
        pagination: {
          total: 0
        },
        title: "日志",
        dataList: [],
        width: "634px",
        logColumn: [
          {
            prop: "id",
            width: 70,
            label: "日志ID"
          },
          {
            prop: "operator_name",
            width: 90,
            label: "操作人"
          },
          {
            prop: "update_time",
            width: 150,
            label: "操作时间"
          },
          {
            prop: "content",
            label: "备注"
          }
        ]
      },
      noticeVisible: false,
      overdue_bill_id: null,
      badbillVisible: false,
      payMentVisible: false,
      exportLoading: false,
      tooltipVal: "",
      searchDialogVisible: false,
      batchSearchObj: {
        searchVal: "",
        errorIsShow: true,
        batchSearchLoading: false,
        failList: []
      },
      successList: [],
      pullBillLoading: false
    };
  },
  props: {},
  watch: {
    dataList: {
      immediate: true,
      handler(val) {
        this.iterationTable(val);
      }
    }
  },

  created() {},
  activated() {
    this.initResources();
    this.init();
  },
  methods: {
    // 拉取逾期账单
    pullBillData() {
      this.pullBillLoading = true;
      pullOverdueBill()
        .then(res => {
          if (res.code == 0) {
            this.init();
            this.$message.success(`共拉取到${res.data.count}条结果`);
            this.pullBillLoading = false;
          }
        })
        .catch(err => {
          this.pullBillLoading = false;
        });
    },
    initResources() {
      companyTypeList().then(res => {
        this.selectType = res.data.list;
      });
    },

    deleCondition(key) {
      if (
        Object.prototype.toString.call(this.search[key]) == "[object Array]"
      ) {
        this.search[key] = [];
      } else {
        this.search[key] = "";
      }
      // this.init();
    },
    init() {
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
      this.search = this.$options.data().search;
      this.search.status = this.currentIndex + Number(1);
      this.selectArr = [];
      this.init();
    },
    getList() {
      this.loading = true;
      this.search.multi_search_words = this.search.search_words
        ? []
        : this.successList;
      overdueList(this.search).then(res => {
        let { list, count } = res.data;
        list.forEach(element => {
          element.bgc =
            element.pay_status == "w"
              ? "#FCF0D8"
              : element.pay_status == "s"
                ? "#D8F5E8"
                : "#FADEDA";
          this.$set(element, "checked", false);
          const row = this.selectArr.find(v => {
            return v.id == element.id;
          });
          if (row) {
            this.$set(element, "checked", true);
          }
        });
        this.dataList = list;
        this.pagination.total = count;
        this.loading = false;
      });
      overdueTotal(this.search).then(res => {
        this.totalModel = res.data;
      });
    },
    payBackOrder() {
      let msg = "创建回款工单必须选择公司名称相同的公司，请重新选择";
      let bool = this.checkEquelName(this.selectArr, msg);
      if (bool) {
        this.checkStatus()
          .then(res => {
            if (res) {
              this.payMentVisible = res;
              this.topTitle = "创建回款工单";
            }
          })
          .catch(err => {});
      }
    },
    badBillOrder() {
      let msg = "创建坏账工单必须选择公司名称相同的公司，请重新选择";
      let bool = this.checkEquelName(this.selectArr, msg);
      if (bool) {
        this.checkStatus()
          .then(res => {
            this.badbillVisible = res;
            this.topTitle = "创建坏账工单";
          })
          .catch(err => {});
      }
    },
    checkEquelName(arr, msg) {
      let len = arr.reduce((prev, next, index, arr) => {
        if (!prev.includes(next.company_name)) {
          return prev.concat(next.company_name);
        } else {
          return prev;
        }
      }, []).length;
      if (len > 1) {
        this.$message.warning(msg);
        return false;
      } else if (len == 1) {
        return true;
      }
    },
    checkStatus() {
      return new Promise((resolve, reject) => {
        checkCanUse({
          company_id: this.selectArr[0].company_id,
          ids: this.constructIds(this.selectArr)
        })
          .then(res => {
            resolve(true);
          })
          .catch(err => {
            reject(err.msg);
          });
      });
    },
    exportList() {
      this.exportLoading = true;
      getExportUrl(this.search).then(res => {
        setTimeout(() => {
          this.exportLoading = false;
        }, 3000);
        window.open(res.data.url, "_blank");
      });
    },
    historyOrder() {
      this.$router.push("/index/serviceMana/historyOrder");
    },
    daliyLog({ id }) {
      this.logData.logSearch.overdue_bill_id = id;
      this.logVisible = true;
      this.getLogData();
    },
    notice({ id }) {
      this.overdue_bill_id = id;
      this.noticeVisible = true;
    },
    getLogData() {
      dailyLogList(this.logData.logSearch).then(res => {
        let { list, count } = res.data;
        this.logData.pagination.total = count;
        this.logData.dataList = list;
      });
    },
    isSelection(row, index) {
      let { pay_status, work_order_status } = row;
      return (
        (pay_status == "w" || pay_status == "f") &&
        (work_order_status == "3" || work_order_status == "0")
      );
    },
    iterationTable(rows = []) {
      this.$nextTick(() => {
        rows.forEach(row => {
          this.$refs["tableChild"].toggleRowSelect(row, row.checked);
        });
      });
    },
    getSelectTable(val) {
      if (val.checked) {
        this.selectArr = [...this.selectArr, val];
      } else {
        const index = this.selectArr.findIndex(v => {
          return v.id == val.id;
        });
        if (index > -1) {
          this.selectArr.splice(index, 1);
        }
      }
    },
    getSelectTableAll() {
      this.dataList.forEach(v => {
        const index = this.selectArr.findIndex(element => {
          return v.id == element.id;
        });
        if (index > -1) {
          v.checked = false;
          this.selectArr.splice(index, 1);
        }
      });
    },
    toDetail({ trades_id, order_no }) {
      this.$router.push(
        `/financeMana/settlement/detail?id=${trades_id}&order_no=${order_no}`
      );
    },
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
          arr.push(v.replace(/\s/g, ""));
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
    clerarBatchSearch() {
      this.batchSearchObj.errorIsShow = true;
    }
  },
  computed: {
    constructIds() {
      return function(arr) {
        return arr.map(v => {
          return v.id;
        });
      };
    },
    checkCalc() {
      return function(key, checkArr, value) {
        let arr = [];
        arr = checkArr.filter(ele => {
          return (
            ele[value] == this.search[key] ||
            this.search[key].includes(ele[value])
          );
        });
        if (arr.length > 0) {
          return arr
            .reduce((prev, next, index, arr) => {
              return prev.concat(next.name);
            }, [])
            .join(",");
        } else {
          return "";
        }
      };
    }
  }
};
</script>

<style scoped lang="scss">
.overdueBillFollow-container {
  position: relative;
  .btnBox {
    position: absolute;
    right: 0;
    top: 0px;
  }
  .conditions-content {
    .batchActBox {
      padding: 0 16px 16px;
      font-size: 14px;
      .seletSumBox {
        span {
          display: inline-block;
          i {
            color: #409eff;
          }
        }
        .el-button {
          margin-left: 16px;
          background: #f5f5f5;
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
