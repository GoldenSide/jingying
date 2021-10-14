<!---*
* @description  催款工单管理
* @fileName list.vue
* @author 叶金龙
* @date 2021/03/26 15:41:03
*--->
<template>
  <div class="paymentOrder-container">
    <contHeader :titleText="$route.meta.title" />
    <div class="conditions-content">
      <div class="toggleBtns">
        <el-tabs
          v-model="arrKey"
          @tab-click="
            (obj, e) => toggleBtn({ value: obj.name }, Number(obj.index))
          "
        >
          <el-tab-pane
            :label="item.text"
            :name="item.value"
            v-for="(item, index) in statusBtns"
            :key="index"
          ></el-tab-pane>
        </el-tabs>
      </div>
      <searchComponent
        :search="search"
        :btnConfig="btnConfig"
        :searchTypeArr="searchTypeArr"
        :elpopoverArr="elpopoverArr"
        :inputEnter="init"
      >
        <template slot="multipleSearch">
          <el-tooltip placement="bottom" :disabled="!tooltipVal">
            <div slot="content" v-html="tooltipVal"></div>
            <el-button @click.stop="batchSearchShow">批量搜索</el-button>
          </el-tooltip>
        </template>
        <template :slot="item.slotName" v-for="(item, index) in elpopoverArr">
          <el-radio-group v-model="search[item.key]" :key="index">
            <el-radio
              style="padding: 5px 0"
              v-for="(v, mindex) in item.checkArr()"
              :label="v.value"
              :key="mindex"
              v-model="search[item.key]"
              >{{ v.name }}</el-radio
            >
          </el-radio-group>
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
      <div class="list-content">
        <tableComponent
          :column="calcColumn(arrKey)"
          :tableData="dataList"
          :page.sync="search.page"
          :page_size.sync="search.page_size"
          :total.sync="pagination.total"
          :loading.sync="loading"
          height="calc(100vh - 365px)"
          :pageAct="getList"
        />
      </div>
    </div>
    <refuse
      v-if="refuseVisible"
      :refuseVisible.sync="refuseVisible"
      :infoObj="infoObj"
      :init="init"
    />
    <badBillOrder
      v-if="badbillVisible"
      :badbillVisible.sync="badbillVisible"
      topTitle="坏账工单详情"
      :isEdit="false"
      :work_order_id="work_order_id"
      :arr="selectArr"
    />
    <paymentOrder
      v-if="payMentVisible"
      :payMentVisible.sync="payMentVisible"
      topTitle="回款工单详情"
      :isEdit="false"
      :work_order_id="work_order_id"
      :arr="selectArr"
    />
    <passOrder
      v-if="passOrderVisible"
      :passOrderVisible.sync="passOrderVisible"
      :arr="selectArr"
      :work_order_id="work_order_id"
      :init="init"
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
import { listMultiSearch } from "@/api/common";
import { orderList, passBadbillOrder } from "@/api/leadManagement/paymentOrder";
import refuse from "./components/refuse";
import badBillOrder from "../../customerManage/overdueBillFollow/component/badBillOrder";
import paymentOrder from "../../customerManage/overdueBillFollow/component/paymentOrder";
import passOrder from "./components/passOrder";
import batchSearchMenu from "@/components/search/batchSearch";
export default {
  name: "OrderMana",
  components: {
    refuse,
    badBillOrder,
    passOrder,
    paymentOrder,
    batchSearchMenu
  },
  data() {
    return {
      statusBtns: [
        {
          text: "待审核",
          value: "noCheckColumn",
          cb: "awaitCheck"
        },
        {
          text: "已通过",
          value: "pass",
          cb: "passed"
        },
        {
          text: "已驳回",
          value: "refuse",
          cb: "refused"
        }
      ],
      arrKey: "",
      currentIndex: null,
      pagination: {
        total: 0
      },
      loading: false,
      dataList: [{ code: "123131231" }],
      search: {
        page: 1,
        page_size: 15,
        search_words: "",
        search_id: "1",
        type: "",
        status: "",
        multi_search_words: []
      },
      pagination: {
        total: 0
      },
      orderType: [
        {
          value: "1",
          name: "回款工单"
        },
        {
          value: "2",
          name: "坏账工单"
        }
      ],
      searchTypeArr: [
        {
          value: "1",
          text: "公司名称"
        },
        {
          value: "23",
          text: "公司编号"
        },
        {
          value: "24",
          text: "提交人"
        }
      ],
      selectType: [],
      elpopoverArr: [
        {
          btnText: "工单类型",
          slotName: "orderType",
          key: "type",
          width: 150,
          value: "value",
          bool: false,
          isShow: function(bool) {
            return bool;
          },
          checkArr: () => {
            return this.orderType;
          }
        }
      ],
      btnConfig: [
        { text: "搜索", icon: "search", type: "primary", cb: "init" },
        { text: "清空", icon: "clear", type: "default", cb: "clear" }
      ],
      tooltipVal: "",
      column: [
        {
          prop: "id",
          label: "工单编号",
          render: ({ h, row }) => {
            return (
              <div>
                <el-link
                  type="primary"
                  size="default"
                  onClick={() => this.orderDetail(row)}
                  style=""
                >
                  {row.id}
                </el-link>
              </div>
            );
          }
        },
        { prop: "company_name", label: "公司名称", width: 200 },
        { prop: "company_type_name", label: "公司类型" },
        {
          prop: "type",
          label: "工单类型",
          render: ({ h, row }) => {
            return h("div", {}, row.type == "1" ? "回款工单" : "坏账工单");
          }
        },
        { prop: "user_name", label: "提交人" },
        { prop: "create_time", label: "提交时间" },
        { prop: "auditor_name", label: "审核人" },
        { prop: "audit_time", label: "审核时间" },
        { prop: "reason", label: "驳回原因" },
        {
          prop: "",
          label: "操作",
          fixed: "right",
          render: ({ h, row }) => {
            return h("div", [
              h(
                "el-link",
                {
                  attrs: {
                    type: "primary",
                    size: "default"
                  },
                  on: {
                    click: () => {
                      this.orderDetail(row);
                    }
                  }
                },
                "工单详情"
              ),
              this.currentIndex == 0 &&
                h(
                  "el-link",
                  {
                    attrs: {
                      type: "primary",
                      size: "default"
                    },
                    on: {
                      click: () => {
                        this.pass(row);
                      }
                    }
                  },
                  "通过"
                ),
              this.currentIndex == 0 &&
                h(
                  "el-link",
                  {
                    attrs: {
                      type: "primary",
                      size: "default"
                    },
                    on: {
                      click: () => {
                        this.refuseAct(row);
                      }
                    }
                  },
                  "驳回"
                )
            ]);
          }
        }
      ],
      refuseVisible: false,
      infoObj: null,
      badbillVisible: false,
      selectArr: [],
      work_order_id: null,
      passOrderVisible: false,
      payMentVisible: false,
      tooltipVal: "",
      searchDialogVisible: false,
      batchSearchObj: {
        searchVal: "",
        errorIsShow: true,
        batchSearchLoading: false,
        failList: []
      },
      successList: []
    };
  },
  props: {},
  watch: {
    xxx: {}
  },
  created() {
    this.toggleBtn(this.statusBtns[0], 0);
  },
  methods: {
    toggleBtn(item, index) {
      if (this.currentIndex == index) return;
      this.currentIndex = index;
      this.arrKey = item.value;
      this.loading = true;
      this.dataList = [];
      this.pagination.total = 0;
      this.clear();
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
      this.init();
    },
    deleCondition(key) {
      if (
        Object.prototype.toString.call(this.search[key]) == "[object Array]"
      ) {
        this.search[key] = [];
      } else {
        this.search[key] = "";
      }
      this.init();
    },
    getList() {
      this.search.multi_search_words = this.search.search_words
        ? []
        : this.successList;
      orderList(this.search).then(res => {
        let { count, list } = res.data;
        this.dataList = list;
        this.pagination.total = count;
        this.loading = false;
      });
    },
    refuseAct(row) {
      this.infoObj = row;
      this.refuseVisible = true;
    },
    orderDetail(row) {
      let { type, id } = row;
      if (type == "2") {
        this.badbillVisible = true;
      } else if (type == "1") {
        this.payMentVisible = true;
      }
      this.work_order_id = id;
      this.selectArr = [row];
    },
    pass(row) {
      let { type, id } = row;
      this.work_order_id = id;
      if (type == "1") {
        this.passOrderVisible = true;
        this.selectArr = [row];
      } else if (type == "2") {
        this.utils.deleConfig(
          this,
          "是否确定审批通过，通过后，此坏账工单对应的账单的“账单状态”会变成“坏账”状态",
          "坏账工单审批通过",
          ["确认通过", "取 消"],
          this.act(id),
          null
        );
      }
    },
    act(id) {
      return () => {
        passBadbillOrder({ id }).then(res => {
          this.$message.success("操作成功");
          this.clear();
        });
      };
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
    calcColumn() {
      return function(arrKey) {
        let arr = this.utils.deepClone(this.column);
        if (arrKey == "noCheckColumn") {
          arr.splice(6, 3);
        } else if (arrKey == "pass") {
          arr.splice(8, 1);
        }
        return arr;
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

<style scoped lang='scss'>
.paymentOrder-container {
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
      .exportbtn {
        float: right;
      }
    }
  }
}
</style>
