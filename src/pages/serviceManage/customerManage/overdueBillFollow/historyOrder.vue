<!---*
* @description 历史工单列表
* @fileName historyOrder.vue
* @author 叶金龙
* @date 2021/03/30 10:24:13
*--->
<template>
  <div class="historyOrder-container">
    <div class="topComponent">
      <goBackIcon />
      <contHeader :titleText="$route.meta.title" />
    </div>
    <div class="conditions-content">
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
          :column="column"
          :tableData="dataList"
          :page.sync="search.page"
          :page_size.sync="search.page_size"
          :total.sync="pagination.total"
          :loading.sync="loading"
          height="calc(100vh - 317px)"
          :pageAct="getList"
        />
      </div>
    </div>
    <checkInfoDia
      :infoObj="infoObj"
      v-if="checkInfoVisible"
      :checkInfoVisible.sync="checkInfoVisible"
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
import { orderHistory } from "@/api/serviceMn/customerMn/orderHistory";
import checkInfoDia from "./component/checkInfoDia";
import statusTag from "@/components/status/statusTag";
import badBillOrder from "../../customerManage/overdueBillFollow/component/badBillOrder";
import paymentOrder from "../../customerManage/overdueBillFollow/component/paymentOrder";
import batchSearchMenu from "@/components/search/batchSearch";
export default {
  name: "historyOrder",
  components: {
    checkInfoDia,
    statusTag,
    badBillOrder,
    paymentOrder,
    batchSearchMenu
  },
  data() {
    return {
      search: {
        search_words: "",
        search_id: "1",
        status: "",
        type: "",
        page: 1,
        page_size: 15,
        multi_search_words: []
      },
      pagination: {
        total: 0
      },
      searchTypeArr: [
        {
          value: "1",
          text: "公司名称"
        },
        {
          value: "23",
          text: "工单编号"
        }
      ],
      btnConfig: [
        { text: "搜索", icon: "search", type: "primary", cb: "init" },
        { text: "清空", icon: "clear", type: "default", cb: "clear" }
      ],
      elpopoverArr: [
        {
          btnText: "工单状态",
          slotName: "orderStatus",
          key: "status",
          value: "value",
          width: 150,
          bool: false,
          isShow: function(bool) {
            return bool;
          },
          checkArr: () => {
            return this.orderStatus;
          }
        },
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
      orderStatus: [
        {
          value: "1",
          name: "待审核"
        },
        {
          value: "2",
          name: "已通过"
        },
        {
          value: "3",
          name: "已驳回"
        }
      ],
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
        {
          prop: "company_name",
          label: "公司名称"
        },
        {
          prop: "company_type_name",
          label: "公司类型"
        },
        {
          prop: "type",
          label: "工单类型",
          render: ({ h, row }) => {
            return h("span", {}, row.type == "1" ? "回款工单" : "坏账工单");
          }
        },
        {
          prop: "create_time",
          label: "提交时间"
        },
        {
          prop: "status_text",
          label: "工单状态",
          render: ({ h, row }) => {
            return h(statusTag, {
              style: {
                backgroundColor: row.bgc
              },
              slot: "status-slot",
              domProps: {
                innerHTML: row.status_text
              }
            });
          }
        },
        {
          prop: "",
          label: "操作",
          render: ({ h, row }) => {
            return h("div", [
              row.status !== "1" &&
                h(
                  "el-link",
                  {
                    props: { type: "primary" },
                    on: {
                      click: () => {
                        this.itemInfo(row);
                      }
                    }
                  },
                  "审核详情"
                )
            ]);
          }
        }
      ],
      dataList: [],
      loading: false,
      infoObj: null,
      checkInfoVisible: false,
      tooltipVal: "",
      badbillVisible: false,
      selectArr: [],
      work_order_id: null,
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
    this.init();
  },
  activated() {},
  methods: {
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
      this.init();
    },
    getList() {
      this.loading = true;
      this.search.multi_search_words = this.search.search_words
        ? []
        : this.successList;
      orderHistory(this.search).then(res => {
        let { list, count } = res.data;
        list.forEach(element => {
          element.bgc =
            element.status == "1"
              ? "#FCF0D8"
              : element.status == "2"
                ? "#D8F5E8"
                : "#FADEDA";
        });
        this.dataList = list;
        this.pagination.total = count;
        this.loading = false;
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
    itemInfo(row) {
      this.checkInfoVisible = true;
      this.infoObj = row;
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
.historyOrder-container {
  .topComponent {
    display: flex;
  }
  .conditions-content {
    margin-top: 8px;
  }
}
</style>
