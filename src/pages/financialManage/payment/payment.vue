<!---*
* @description 
* @fileName payment.vue(账单线下支付流水)
* @author 龙伟
* @date 2021/03/26 14:58:06
*--->
<template>
  <div class="payment-contaniner">
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
          <el-tooltip placement="bottom" :disabled="!tooltipVal">
            <div slot="content" v-html="tooltipVal"></div>
            <el-button @click.stop="batchSearchShow">批量搜索</el-button>
          </el-tooltip>
        </template>
        <template :slot="elpopoverArr[0].slotName">
          <el-radio-group
            v-model="search.pay_way"
            @change="
              (val) => changeStatus(val, payWayType, 'payWayTypeName', 'value')
            "
          >
            <el-radio
              style="padding: 5px 0"
              v-for="(item, index) in payWayType"
              :key="index"
              :label="item.value"
              >{{ item.name }}</el-radio
            >
          </el-radio-group>
        </template>
        <template :slot="elpopoverArr[1].slotName">
          <el-checkbox-group
            v-model="search.company_type"
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
            v-if="search.company_type.length > 0"
            @close="deleCondition('company_type')"
            style="margin-right: 10px"
            >公司类型： {{ companyName }}</el-tag
          >
        </template>
        <!-- <template>
          <el-tag
            closable
            v-if="search.created_time_range.length > 0"
            @close="deleCondition('created_time_range')"
            style="margin-right: 10px"
            >创建时间 {{ search.created_time_range[0] }} 至
            {{ search.created_time_range[1] }}</el-tag
          >
        </template> -->
      </searchComponent>
      <div class="list-content">
        <tableComponent
          ref="tableChild"
          :column="column"
          :tableData="dataList"
          :page.sync="search.page"
          :page_size.sync="search.page_size"
          :total.sync="pagination.total"
          :loading.sync="loading"
          height="calc(100vh - 364px)"
          :pageAct="getList"
        />
        <div v-show="pagination.total" class="summarizing">
          <span>支付总金额($)：{{ total_amount_dollar }}</span>
          <span>支付总金额(¥)：{{ total_amount_rmb }}</span>
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
    </div>
  </div>
</template>

<script>
import enums from "@/utils/enums";
import batchSearchMenu from "@/components/search/batchSearch";
import { companyTypeList, listMultiSearch } from "@/api/common";
import {
  getPaymentRecordData,
  exportPaymentRecordData,
} from "@/api/finance/payment/payment";
export default {
  name: "payment",
  components: { batchSearchMenu },
  data() {
    return {
      search: {
        search_id: "1",
        search_words: "",
        pay_way: "",
        multi_search_words: [],
        company_type: [],
        created_time_range: [],
        pay_time: [],
        page: 1,
        page_size: 15,
      },
      pagination: {
        total: 0,
      },
      searchTypeArr: [
        {
          value: "1",
          text: "公司名称",
        },
        {
          value: "25",
          text: "第三方交易号",
        },
      ],
      payWayType: [
        {
          value: "alipay",
          name: "支付宝",
        },
        {
          value: "bank",
          name: "银行卡",
        },
      ],
      elpopoverArr: [
        {
          btnText: "支付方式",
          slotName: "payWayType",
          key: "pay_way",
          width: 150,
          bool: false,
          isShow: function (bool) {
            return bool;
          },
        },
        {
          btnText: "公司类型",
          slotName: "companyType",
          key: "company_type",
          width: 150,
          bool: false,
          isShow: function (bool) {
            return bool;
          },
        },
      ],
      btnConfig: [
        { text: "搜索", icon: "search", type: "primary", cb: "init" },
        { text: "清空", icon: "clear", type: "default", cb: "clear" },
      ],
      dateConfig: [
        {
          label: "支付时间",
          key: "pay_time",
          isTimeShow: false,
        },
        {
          label: "创建时间",
          key: "created_time_range",
          isTimeShow: false,
        },
      ],
      dateConfigTwo: {
        label: "创建时间",
        key: "created_time_range",
      },
      column: [
        {
          prop: "third_trade_id",
          label: "第三方交易号",
          width: 280,
        },
        {
          prop: "company_name",
          label: "公司名称",
        },
        {
          prop: "company_type_name",
          label: "公司类型",
        },
        {
          prop: "return_amount_dollar",
          label: "支付金额（$）",
          align: "right",
        },
        {
          prop: "return_amount_rmb",
          label: "支付金额（¥）",
          align: "right",
        },
        {
          prop: "pay_way",
          label: "支付方式",
        },
        {
          prop: "return_time",
          label: "支付时间",
        },
        {
          prop: "operator",
          label: "创建人",
        },
        {
          prop: "created_at",
          label: "创建时间",
        },
        {
          prop: "remark",
          label: "备注",
        },
      ],
      loading: false,
      searchDialogVisible: false,
      batchSearchObj: {
        searchVal: "",
        errorIsShow: true,
        batchSearchLoading: false,
        failList: [],
      },
      successList: [],
      typeData: [],
      pickerOptions: enums.pickerOptions,
      payWayTypeName: "",
      companyName: "",
      dataList: [],
      tooltipVal: "",
      successList: [],
      total_amount_rmb: "0",
      total_amount_dollar: "0",
      exportLoading: false,
    };
  },
  props: {},
  watch: {
    xxx: {},
  },
  created() {
    this.initResource();
    this.getList();
  },
  methods: {
    // 获取数据
    getList() {
      this.loading = true;
      this.search.multi_search_words = this.search.search_words
        ? []
        : this.successList;
      getPaymentRecordData(this.search)
        .then((res) => {
          // console.log(res);
          let { list, count, total_amount_rmb, total_amount_dollar } = res.data;
          this.dataList = list;
          this.pagination.total = count;
          this.total_amount_rmb = total_amount_rmb;
          this.total_amount_dollar = total_amount_dollar;
          this.$nextTick(() => {
            this.loading = false;
          });
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    // 导出
    exportExcel() {
      this.exportLoading = true;
      exportPaymentRecordData(this.search)
        .then((res) => {
          if (res.code == 0) {
            let { url } = res.data;
            window.location.href = url;
            this.exportLoading = false;
          }
        })
        .catch((err) => {
          this.exportLoading = false;
        });
    },
    // 批量搜索框显示
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
    // 关闭不合法参数的弹窗
    clerarBatchSearch() {
      this.batchSearchObj.errorIsShow = true;
    },
    init() {
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
      this.search = this.$options.data().search;
      this.init();
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
    changeStatus(value, data, key, label) {
      let arr = [];
      for (let v of data) {
        if (v[label] == value) {
          arr.push(v.name);
          this[key] = arr.join(",");
          // console.log(this[key]);
          return;
        }
      }
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
    deleCondition(key) {
      if (key == "company_type") {
        this.search[key] = [];
      } else {
        this.search[key] = "";
      }
      this.init();
    },
  },
};
</script>

<style scoped lang="scss">
.payment-contaniner {
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
