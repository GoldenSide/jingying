<template>
  <div class="bill-overview">
    <contHeader :titleText="$route.meta.title" />
    <div class="conditions-content">
      <div class="search-content">
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
        <el-popover
          placement="bottom"
          width="130"
          trigger="click"
          style="margin-left: 8px"
          @show="isShow = true"
          @hide="isShow = false"
        >
          <el-checkbox-group
            v-model="search.company_type_ids"
            @change="checkCompany"
          >
            <el-checkbox
              v-for="(item, index) in typeData"
              :label="item.id"
              :value="item.id"
              :key="index"
              >{{ item.name }}</el-checkbox
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
        <div class="time-search" style="margin-left: 8px">
          <el-button size="medium">
            订单支付时间
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
      <div class="search-tag margin-16">
        <el-tag
          closable
          v-if="search.company_type_ids.length > 0"
          @close="deleCondition('company_type_ids')"
          style="margin-right: 10px"
          >公司类型： {{ companyName }}</el-tag
        >
        <el-tag
          closable
          v-if="search.pay_time_range.length > 0"
          @close="deleCondition('pay_time_range')"
          >支付时间： {{ search.pay_time_range[0] }} 至
          {{ search.pay_time_range[1] }}</el-tag
        >
      </div>
      <div class="content-box">
        <div
          class="panle-item"
          v-for="(item, index) in panelCofig"
          :key="index"
          v-loading="panleLoading"
        >
          <label>{{ item.label }}</label>
          <h2>{{ totalObj[item.prop] || "0.00" }}</h2>
        </div>
      </div>
      <!-- <div class="list-content">
        <el-table :data="dataList" fit>
          <el-table-column
            prop="date"
            label="公司名称"
            width="180"
            fixed
            :align="'left'"
          >
            <template slot-scope="scope">
              <span @click="toList(scope.row)" class="link-a">{{
                scope.row.company_name
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :align="item.align || 'right'"
            v-for="(item, index) in column"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
          ></el-table-column>
        </el-table>
        <PaginationCom
          :limit.sync="search.page_size"
          :page.sync="search.page"
          :total="pagination.total"
          @pagination="getList"
        />
      </div> -->
    </div>
  </div>
</template>

<script>
import { financeOverview } from "@/api/finance/overview";
import enums from "@/utils/enums";
import { companyTypeList } from "@/api/common";
import contHeader from "@/components/contentHeader";
import dayjs from "dayjs";
export default {
  name: "billOverview",
  data() {
    return {
      companyName: "",
      searchTypeArr: enums.searchTypeArr,
      pickerOptions: enums.pickerOptions,
      pagination: {
        page: 1,
        page_size: 10,
        total: 0,
      },

      isShow: false,
      isTimeShow: false,
      search: {
        pay_time_range: [
          dayjs().startOf("month").format("YYYY/MM/DD"),
          dayjs().endOf("month").format("YYYY/MM/DD"),
        ],
        page: 1,
        page_size: 10,
        search_id: 1, //公司名称或者公司类型
        search_words: null, //搜索关键字
        company_type_ids: [],
      },
      typeData: [],
      totalObj: {},
      column: [
        { prop: "company_type_name", label: "公司类型", align: "left" },
        { prop: "shop_num", label: "店铺数" },
        { prop: "order_num", label: "订单数" },
        { prop: "gmv", label: "GMV(万)" },
        { prop: "commission_amount", label: "交易佣金(万)", width: 130 },
        {
          prop: "discount_commission_amount",
          label: "佣金优惠(万)",
          width: 130,
        },
        {
          prop: "discount_after_commission_amount",
          label: "惠后佣金(万)",
          width: 130,
        },
        { prop: "receive_commission", label: "已收佣金(万)", width: 130 },
        { prop: "un_receive_commission", label: "未收佣金(万)", width: 130 },
        { prop: "delay_commission", label: "逾期未收佣金(万)", width: 150 },
        { prop: "max_delay_day", label: "最大逾期(天)" },
      ],
      dataList: [],
      loading: true,
      panleLoading: false,
      panelCofig: [
        { prop: "order_num_total", label: "订单数" },
        { prop: "gmv_total", label: "有效GMV($)" },
        { prop: "commission_amount_total", label: "交易佣金($)" },
        { prop: "discount_commission_amount_total", label: "佣金优惠金额($)" },
        {
          prop: "discount_after_commission_amount_total",
          label: "惠后佣金金额($)",
        },
        { prop: "receive_commission_total", label: "已收佣金($)" },
        { prop: "not_receive_commission_total", label: "未收佣金($)" },
        { prop: "delay_commission_total", label: "逾期未收佣金($)" },
      ],
    };
  },
  components: { contHeader },
  mounted() {
    this.initResource();
    this.init();
  },
  methods: {
    // -----------------------new
    initResource() {
      companyTypeList().then((res) => {
        this.typeData = res.data.list;
      });
    },
    init() {
      this.search.page = 1;
      this.getList();
    },
    clear() {
      this.search = this.$options.data().search;
      this.pagination = this.$options.data().pagination;
      this.init();
    },
    getList() {
      this.loading = true;
      this.panleLoading = true;
      financeOverview(this.search)
        .then((res) => {
          this.totalObj = this.utils.deepClone(res.data.total);
          this.dataList = this.utils.deepClone(res.data.list);
          this.pagination.total = res.data.count;
          this.loading = false;
          this.panleLoading = false;
        })
        .catch((err) => {
          this.panleLoading = false;
        });
    },
    checkCompany(value) {
      let arr = [];
      for (let val of this.typeData) {
        if (value.indexOf(val.id) == -1) {
          continue;
        } else {
          arr.push(val.name);
        }
      }
      this.companyName = arr.join(",");
    },

    toList({ id, company_name }) {
      this.$router.push({
        path: "/financeManaItem/commissionBillDetail",
        query: {
          search_id: 1, //公司名称或者公司类型
          search_words: company_name,
          pay_time_range: this.search.pay_time_range,
          company_type_ids: this.search.company_type_ids,
        },
      });
    },
    deleCondition(key) {
      this.search[key] = [];
      this.init();
    },

    // -----------------------new
  },
};
</script>

<style lang="scss" scoped>
.bill-overview {
  .list-content {
    margin-top: 16px;
  }

  .padding-16 {
    padding: 16px;
  }

  .link-a {
    color: #409eff;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
  .content-box {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 0 16px 16px;
    .panle-item {
      flex-basis: 33.33%;
      border: 1px solid #dfe3e8;
      border-right: none;
      margin-top: 16px;
      padding: 16px;
      &:nth-of-type(1),
      &:nth-of-type(2) {
        flex-basis: 50%;
        margin-top: 0;
      }
      &:nth-of-type(2),
      &:nth-of-type(5),
      &:nth-of-type(8) {
        border-right: 1px solid #dfe3e8;
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
  }
}
</style>
