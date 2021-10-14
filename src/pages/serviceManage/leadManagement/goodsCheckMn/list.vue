<!---*
* @description  商品审核管理
* @fileName list.vue
* @author 叶金龙
* @date 2020/12/11 11:42:34
*--->
<template>
  <div class="goodsCheckMn-container">
    <contHeader :titleText="$route.meta.title" />
    <el-tooltip
      class="item"
      effect="light"
      content="单次最多导出10000条"
      placement="left-start"
    >
      <el-button
        type="primary"
        class="exportbtn"
        size="medium"
        v-countDown="5"
        @click="exportList"
        >导 出</el-button
      >
    </el-tooltip>

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
      <div class="search-content">
        <!-- <el-input
          v-model="search.search_key"
          placeholder="请输入公司名/公司负责人/公司邮箱/店铺名/店铺邮箱"
          size="normal"
          clearable
          @keyup.enter.native="init"
        ></el-input> -->
        <el-input
          placeholder="请输入关键词"
          v-model="search.search_words"
          class="input-with-select"
          @keyup.enter.native="init"
          size="normal"
          clearable
        >
          <el-select
            v-model="search.search_id"
            slot="prepend"
            placeholder="请选择搜索类型"
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

        <elpopover
          v-for="(item, index) in elpopoverArr"
          :key="index"
          :slotName="item.slotName"
          :btnText="item.btnText"
          :width="item.width"
          :isShow="(bool) => changeBool(bool, item)"
          :bool="item.bool"
        >
          <template :slot="elpopoverArr[0].slotName">
            <el-checkbox-group v-model="search.company_type">
              <el-checkbox
                v-for="(item, index) in selectType"
                :key="index"
                :label="item.id"
                >{{ item.name }}</el-checkbox
              >
            </el-checkbox-group>
            <span
              class="clear-checkbox"
              @click="deleCondition('company_type', search)"
              >清除</span
            >
          </template>
        </elpopover>
        <div
          class="time-search"
          v-if="arrKey == 'processedColumn' || arrKey == 'complianceColumn'"
        >
          <el-button size="medium">
            {{ dateConfig.label }}
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
            v-model="time_range"
            type="daterange"
            align="right"
            @blur="isTimeShow = false"
            @focus="isTimeShow = true"
            class="search-time-datePicker"
            range-separator="至"
            value-format="yyyy/MM/dd"
            format="yyyy/MM/dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </div>
        <btns :btnConfig="btnConfig" :btn-click="(btn) => btnCb(btn)" />
      </div>
      <div class="search-tag">
        <el-tag
          v-for="(item, index) in elpopoverArr"
          :key="index"
          closable
          v-show="checkCalc(item.key, item.checkArr(), 'id', 'name').length > 0"
          @close="deleCondition(item.key, search)"
          style="margin-right: 10px"
          >{{ item.btnText }}：
          {{ checkCalc(item.key, item.checkArr(), "id", "name") }}
        </el-tag>
        <el-tag
          closable
          @close="deleCondition(dateConfig.key)"
          v-if="timeTagShow"
          >{{ dateConfig.label }}:{{ time_range[0] }}至{{
            time_range[1]
          }}</el-tag
        >
      </div>
      <div class="batchActBox" v-if="statusBtns[currentIndex].render">
        <batchAct :render="statusBtns[currentIndex].render"></batchAct>
      </div>
      <div class="list-content shopList-table">
        <tableComponent
          ref="tableChild"
          :column="currentColumn"
          :tableData="dataList"
          :page.sync="search.page"
          :page_size.sync="search.page_size"
          :total.sync="pagination.total"
          :loading.sync="loading"
          :selectionShow="currentIndex !== 2"
          :height="calcHeight"
          :pageAct="getList"
          :tabelSelectOne="getSelectTable"
          :tabelSelectAll="getSelectTableAll"
        />
      </div>
    </div>
    <logMenu
      :logVisible.sync="logVisible"
      v-if="logVisible"
      :logData="logData"
      :getLogData="getLogData"
    />
  </div>
</template>

<script>
import elpopover from "@/components/search/elpopover";
import btns from "@/components/search/btn";
import enums from "@/utils/enums";
import { companyTypeList } from "@/api/common";
import {
  notCheck,
  violator,
  afterViolation,
  compliance,
  checkGoods,
  complianceGoods,
  deleteGoods,
  dailyLogs,
} from "@/api/leadManagement/goodsCheckMn";
export default {
  name: "goodsCheckMn",
  components: {
    elpopover,
    btns,
    batchAct: () => import("./components/batchAct"),
  },
  data() {
    return {
      pickerOptions: enums.pickerOptions,
      search: {
        search_words: "",
        search_id: "1",
        company_type: [],
        page: 1,
        page_size: 15,
        is_filter: "1",
      },
      pagination: {
        total: 0,
      },
      btnConfig: [
        { text: "搜索", icon: "search", type: "primary", cb: "init" },
        { text: "清空", icon: "clear", type: "default", cb: "clear" },
      ],
      dateConfig: {
        label: "最近订单时间",
        key: "time_range",
      },
      searchTypeArr: [
        {
          value: "1",
          text: "公司名称",
        },
        {
          value: "2",
          text: "公司负责人",
        },
        {
          value: "3",
          text: "公司邮箱",
        },
        {
          value: "4",
          text: "店铺名",
        },
        {
          value: "5",
          text: "店铺邮箱",
        },
      ],
      elpopoverArr: [
        {
          btnText: "公司类型",
          slotName: "companyType",
          key: "company_type",
          width: 150,
          bool: false,
          isShow: function (bool) {
            return bool;
          },
          checkArr: () => {
            return this.selectType;
          },
        },
      ],
      dataList: [],
      loading: false,
      currentIndex: null,
      statusBtns: [
        {
          text: "待审核",
          value: "noCheckColumn",
          cb: "awaitCheck",
          render: ({ h, btns }) => {
            return (
              <div class="seletSumBox">
                <span>
                  已经选中<i>{this.constructIds(this.selectArr).length}</i>项
                </span>
                <el-button
                  size="medium"
                  onClick={() =>
                    this.check(this.selectArr, "确认选中商品链接是否批量合规？")
                  }
                >
                  批量审核
                </el-button>
                <el-checkbox
                  value={this.search.is_filter}
                  true-label="1"
                  false-label="2"
                  onChange={(val) => this.checkChange(val)}
                >
                  过滤失效商品
                </el-checkbox>
                <el-tooltip
                  content="失效商品包括：下架/删除/店铺冻结/未绑定独立域名导致的商品失效"
                  placement="right-end"
                  effect="light"
                >
                  <i class="el-icon-info"></i>
                </el-tooltip>
              </div>
            );
          },
        },
        {
          text: "违规待处理",
          value: "pendingColumn",
          cb: "beforeCheck",
          render: ({ h, btns }) => {
            return (
              <div class="seletSumBox">
                <span>
                  已经选中<i>{this.constructIds(this.selectArr).length}</i>项
                </span>
                <el-button
                  size="medium"
                  onClick={() =>
                    this.delete(
                      this.selectArr,
                      "确认选中商品链接是否批量删除？"
                    )
                  }
                >
                  批量删除
                </el-button>
                <el-button
                  size="medium"
                  onClick={() =>
                    this.compliance(
                      this.selectArr,
                      "确认选中商品链接是否批量合规？"
                    )
                  }
                >
                  批量合规
                </el-button>
                <el-checkbox
                  value={this.search.is_filter}
                  true-label="1"
                  false-label="2"
                  onChange={(val) => this.checkChange(val)}
                >
                  过滤失效商品
                </el-checkbox>
                <el-tooltip
                  content="失效商品包括：下架/删除/店铺冻结/未绑定独立域名导致的商品失效"
                  placement="right-end"
                  effect="light"
                >
                  <i class="el-icon-info"></i>
                </el-tooltip>
              </div>
            );
          },
        },
        {
          text: "违规已处理",
          value: "processedColumn",
          cb: "afterCheck",
        },
        {
          text: "合规商品",
          value: "complianceColumn",
          cb: "normal",
          render: ({ h, btns }) => {
            return (
              <div class="seletSumBox">
                <span>
                  已经选中<i>{this.constructIds(this.selectArr).length}</i>项
                </span>
                <el-button
                  size="medium"
                  onClick={() =>
                    this.check(this.selectArr, "确认选中商品链接是否批量合规？")
                  }
                >
                  批量审核
                </el-button>
              </div>
            );
          },
        },
      ],
      noCheckColumn: [
        { prop: "company_name", label: "公司名称", width: 200 },
        { prop: "company_type_name", label: "公司类型" },
        { prop: "shop_name", label: "店铺名称" },
        { prop: "email", label: "公司邮箱", width: 220 },
        { prop: "shop_email", label: "店铺邮箱", width: 220 },
        { prop: "leading_official", label: "负责人" },
        {
          prop: "url",
          label: "商品url",
          width: 350,
          render: ({ h, row }) => {
            return h(
              "a",
              {
                attrs: {
                  href: row.url,
                  target: "_blank",
                },
                style: {
                  color: "#409eff",
                  fontWeight: 500,
                },
              },
              row.url
            );
          },
        },
        { prop: "sales_num", label: "销量", align: "right" },
        { prop: "sales", label: "销售金额($)", align: "right" },
        {
          prop: "",
          label: "操作",
          fixed: "right",
          render: ({ h, row }) => {
            return (
              <div>
                <el-link
                  type="primary"
                  size="default"
                  onClick={() => this.check([row], "确认商品链接是否合规？")}
                  style=""
                >
                  审核
                </el-link>
                <el-link
                  type="primary"
                  size="default"
                  onClick={() => this.dailyLog(row)}
                  style=""
                >
                  日志
                </el-link>
              </div>
            );
          },
        },
      ],
      pendingColumn: [
        { prop: "company_name", label: "公司名称", width: 200 },
        { prop: "company_type_name", label: "公司类型" },
        { prop: "shop_name", label: "店铺名称", width: 200 },
        { prop: "email", label: "公司邮箱", width: 220 },
        { prop: "shop_email", label: "店铺邮箱", width: 220 },
        { prop: "leading_official", label: "负责人" },
        { prop: "url", label: "商品url", width: 320 },
        { prop: "sales_num", label: "违规前销量", align: "right", width: 150 },
        {
          prop: "sales",
          label: "违规前销售金额($)",
          align: "right",
          width: 150,
        },
        {
          prop: "foul_sales_num",
          label: "违规后销量",
          align: "right",
          width: 150,
        },
        {
          prop: "foul_sales",
          label: "违规后销售金额($)",
          align: "right",
          width: 150,
        },
        {
          prop: "foul_time_long",
          label: "违规时长(h)",
          align: "right",
          width: 150,
          render: ({ h, row }) => {
            return h("span", {
              domProps: {
                innerHTML: row.foul_time_long,
              },
              style: {
                color: "#ff4343",
                fontWight: 600,
              },
            });
          },
        },
        {
          prop: "",
          label: "操作",
          width: 180,
          fixed: "right",
          render: ({ h, row }) => {
            return (
              <div>
                <el-link
                  type="primary"
                  size="default"
                  onClick={() => this.delete([row], "确认商品链接是否删除？")}
                  style=""
                >
                  删除商品
                </el-link>
                <el-link
                  type="primary"
                  size="default"
                  onClick={() =>
                    this.compliance([row], "确认商品链接是否合规？")
                  }
                  style=""
                >
                  合规
                </el-link>
                <el-link
                  type="primary"
                  size="default"
                  onClick={() => this.dailyLog(row)}
                  style=""
                >
                  日志
                </el-link>
              </div>
            );
          },
        },
      ],
      processedColumn: [
        { prop: "company_name", label: "公司名称", width: 200 },
        { prop: "company_type_name", label: "公司类型" },
        { prop: "shop_name", label: "店铺名称" },
        { prop: "email", label: "公司邮箱", width: 200 },
        { prop: "shop_email", label: "店铺邮箱", width: 220 },
        { prop: "leading_official", label: "负责人", width: 150 },
        {
          prop: "url",
          label: "商品url",
          width: 320,
          render: ({ h, row }) => {
            return h(
              "a",
              {
                attrs: {
                  href: row.url,
                  target: "_blank",
                },
                style: {
                  color: "#409eff",
                  fontWeight: 500,
                },
              },
              row.url
            );
          },
        },
        { prop: "off_shelf_date", label: "下架时间", width: 150 },
        { prop: "offshelf_status_name", label: "下架类型" },
        { prop: "sales_num", label: "违规前销量", align: "right", width: 150 },
        {
          prop: "sales",
          label: "违规前销售金额($)",
          align: "right",
          width: 150,
        },
        {
          prop: "foul_sales_num",
          label: "违规后销量",
          align: "right",
          width: 150,
        },
        {
          prop: "foul_sales",
          label: "违规后销售金额($)",
          align: "right",
          width: 150,
        },
      ],
      complianceColumn: [
        { prop: "company_name", label: "公司名称", width: 200 },
        { prop: "company_type_name", label: "公司类型" },
        { prop: "shop_name", label: "店铺名称" },
        { prop: "email", label: "公司邮箱", width: 220 },
        { prop: "shop_email", label: "店铺邮箱", width: 220 },
        { prop: "leading_official", label: "负责人" },
        {
          prop: "url",
          label: "商品url",
          width: 350,
          render: ({ h, row }) => {
            return h(
              "a",
              {
                attrs: {
                  href: row.url,
                  target: "_blank",
                },
                style: {
                  color: "#409eff",
                  fontWeight: 500,
                },
              },
              row.url
            );
          },
        },
        { prop: "sales_num", label: "销量", align: "right", width: 150 },
        { prop: "sales", label: "销售金额($)", align: "right", width: 150 },
        {
          prop: "",
          label: "操作",
          fixed: "right",
          render: ({ h, row }) => {
            return (
              <div>
                <el-link
                  type="primary"
                  size="default"
                  onClick={() => this.check([row], "确认商品链接是否合规？")}
                  style=""
                >
                  审核
                </el-link>
                <el-link
                  type="primary"
                  size="default"
                  onClick={() => this.dailyLog(row)}
                  style=""
                >
                  日志
                </el-link>
              </div>
            );
          },
        },
      ],
      arrKey: "",
      selectType: [],
      time_range: [],
      isTimeShow: false,
      downLoadUrl: "",
      currentStatus: "",
      selectTotal: 0,
      selectArr: [],
      logVisible: false,
      logData: {
        logSearch: {
          order_product_review_id: "",
          create_time_range: [],
          page: 1,
          page_size: 15,
        },
        pagination: {
          total: 0,
        },
        title: "日志",
        dataList: [],
        width: "634px",
        logColumn: [
          {
            prop: "id",
            width: 70,
            label: "日志ID",
          },
          {
            prop: "operator_name",
            width: 90,
            label: "操作人",
          },
          {
            prop: "create_time",
            width: 150,
            label: "操作时间",
          },
          {
            prop: "content",
            label: "备注",
          },
        ],
      },
    };
  },
  props: {},
  watch: {
    dataList: {
      immediate: true,
      deep: true,
      handler(val) {
        this.iterationTable(val);
      },
    },
    search: {
      immediate: true,
      deep: true,
      handler(val) {},
    },
  },
  //   activated() {
  //   this.toggleBtn(this.statusBtns[0], 0);
  //   this.initResources();
  // },
  created() {
    this.toggleBtn(this.statusBtns[0], 0);
    this.initResources();
  },
  methods: {
    toggleBtn(item, index) {
      if (this.currentIndex == index) return;
      this.currentIndex = index;
      this.arrKey = item.value;
      this.currentStatus = this.statusBtns[index].cb;
      this.clear();
      this.loading = true;
      this.dataList = [];
      this.pagination.total = 0;
    },
    initResources() {
      companyTypeList().then((res) => {
        this.selectType = res.data.list;
      });
    },
    awaitCheck(downconf = {}) {
      this.search = { ...this.search, ...downconf };
      notCheck(this.search).then((res) => {
        let { list, count, url } = res.data;
        this.completeData(list, count, url);
      });
    },
    beforeCheck(downconf = {}) {
      this.search = { ...this.search, ...downconf };
      violator(this.search).then((res) => {
        let { list, count, url } = res.data;
        this.completeData(list, count, url);
      });
    },
    afterCheck(downconf = {}) {
      this.search = {
        ...this.search,
        ...downconf,
        ...{ time_range: this.time_range, is_filter: "2" },
      };
      afterViolation(this.search).then((res) => {
        let { list, count, url } = res.data;
        this.completeData(list, count, url);
      });
    },
    normal(downconf = {}) {
      this.search = {
        ...this.search,
        ...downconf,
        ...{ time_range: this.time_range, is_filter: "2" },
      };
      compliance(this.search).then((res) => {
        let { list, count, url } = res.data;
        this.completeData(list, count, url);
      });
    },
    completeData(arr, count, url) {
      if (url) {
        this.downLoadUrl = url;
        window.open(this.downLoadUrl, "_blank");
      } else {
        arr.forEach((element) => {
          this.$set(element, "checked", false);
          const row = this.selectArr.find((v) => {
            return v.id == element.id;
          });
          if (row) {
            this.$set(element, "checked", true);
          }
        });
        this.dataList = arr;
        this.pagination.total = count;
      }
      setTimeout(() => {
        this.loading = false;
      }, 600);
    },
    exportList() {
      this[this.currentStatus]({ export: "1" });
    },
    changeBool(bool, obj) {
      this.$set(obj, "bool", bool);
    },
    deleCondition(key, that = this) {
      if (that[key].length == 0) {
        return;
      } else {
        that[key] = [];
        this.init();
      }
    },
    btnCb(btn) {
      this[btn.cb]();
    },
    init() {
      this.selectArr = [];
      this.search.page = 1;
      this.getList();
    },
    getList() {
      this.loading = true;
      this[this.currentStatus]({ export: "0" });
    },
    clear() {
      let { search, time_range } = this.$options.data();
      this.time_range = time_range;
      this.search = search;
      this.init();
    },
    getSelectTable(val) {
      if (val.checked) {
        this.selectArr = [...this.selectArr, val];
      } else {
        const index = this.selectArr.findIndex((v) => {
          return v.id == val.id;
        });
        if (index > -1) {
          this.selectArr.splice(index, 1);
        }
      }
    },
    getSelectTableAll() {
      this.dataList.forEach((v) => {
        const index = this.selectArr.findIndex((element) => {
          return v.id == element.id;
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
    valid(arr) {
      if (this.constructIds(arr).length <= 0) {
        this.$message.warning("请选择需要操作的商品");
        return false;
      } else {
        return true;
      }
    },
    check(row = [], text) {
      if (this.valid(row)) {
        this.$confirm(text, "商品审核", {
          cancelButtonText: "违 规",
          confirmButtonText: "合 规",
          cancelButtonClass: "el-button--danger",
          distinguishCancelAndClose: true,
          beforeClose: (action, instance, done) => {
            if (action == "close") {
            } else if (action == "cancel") {
              this.checkPost(row, "2");
            }
            done();
          },
        })
          .then(() => {
            this.checkPost(row, "1");
          })
          .catch(() => {});
      } else {
        return false;
      }
    },
    checkPost(row, status) {
      checkGoods({
        ids: this.constructIds(row),
        foul_status: status,
      }).then((res) => {
        this.refresh();
      });
    },
    delete(row = [], text) {
      if (this.valid(row)) {
        this.$confirm(text, "删除商品", {
          cancelButtonText: "取 消",
          confirmButtonText: "删 除",
          confirmButtonClass: "el-button--danger",
        })
          .then(() => {
            this.deletePost(row);
          })
          .catch(() => {});
      } else {
        return false;
      }
    },
    deletePost(row) {
      deleteGoods({ ids: this.constructIds(row) }).then((res) => {
        this.refresh();
      });
    },
    compliance(row = [], text) {
      if (this.valid(row)) {
        this.$confirm(text, "商品合规", {
          cancelButtonText: "取 消",
          confirmButtonText: "合 规",
        })
          .then(() => {
            this.compliancePost(row);
          })
          .catch(() => {});
      } else {
        return false;
      }
    },
    compliancePost(row) {
      complianceGoods({ ids: this.constructIds(row) }).then((res) => {
        if (res) {
          this.refresh();
        }
      });
    },
    refresh() {
      this.$message.success("操作成功");
      this.init();
    },
    dailyLog({ id }) {
      this.logVisible = true;
      this.logData.logSearch.order_product_review_id = id;
      this.getLogData();
    },
    getLogData() {
      dailyLogs(this.logData.logSearch).then((res) => {
        if (res) {
          let { count, list } = res.data;
          this.logData.dataList = list;
          this.logData.pagination.total = count;
        }
      });
    },
    checkChange(val) {
      this.search.is_filter = val;
      this.init();
    },
  },
  computed: {
    currentColumn() {
      return this[this.arrKey];
    },
    timeTagShow() {
      return (
        (this.arrKey == "processedColumn" ||
          this.arrKey == "complianceColumn") &&
        this.time_range.length > 0
      );
    },
    constructIds() {
      return function (arr) {
        return arr.map((v) => {
          return v.id;
        });
      };
    },
    checkCalc() {
      return function (key, checkArr, value, label) {
        let arr = [];
        for (let val of checkArr) {
          if (this.search[key].indexOf(val[value]) == -1) {
            continue;
          } else {
            arr.push(val[label]);
          }
        }
        if (arr.length > 0) {
          return arr.join(",");
        } else {
          return "";
        }
      };
    },
    calcHeight() {
      if (this.arrKey == "processedColumn") {
        return "calc(100vh - 409px)";
      } else {
        return "calc(100vh - 455px)";
      }
    },
  },
};
</script>

<style scoped lang="scss">
.goodsCheckMn-container {
  position: relative;
  .exportbtn {
    position: absolute;
    right: 0;
    top: 0px;
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
      .exportbtn {
        float: right;
      }
    }
    .batchActBox {
      padding: 0 16px 16px;
      font-size: 14px;
      .seletSumBox {
        span {
          display: inline-block;
          width: 100px;
          i {
            color: #409eff;
          }
        }
        .el-button {
          margin-left: 10px;
          background: #f5f5f5;
        }
      }
      .el-checkbox {
        margin-left: 16px;
      }
      .el-tooltip {
        margin-left: 8px;
        color: #dfe3e8;
      }
    }
  }
}
</style>
