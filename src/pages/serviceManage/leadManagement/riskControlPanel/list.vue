<!---*
* @description 风控审核关键数据
* @fileName list.vue
* @author 叶金龙
* @date 2021/04/16 14:59:20
*--->
<template>
  <div class="riskControlPanel-conatainer">
    <contHeader :titleText="$route.meta.title" />
    <div class="conditions-content echartSection">
      <p class="title">近7天总览</p>
      <sevenDayLineChart
        :id="'line_chart_riskControl'"
        :option="option"
        :ownStyle="ownStyle"
      />
    </div>
    <div class="conditions-content panelSection">
      <p class="title">日关键数据</p>
      <div class="content-top">
        <el-select
          v-model="dateForm.user_id"
          filterable
          placeholder="审核人"
          clearable
          remote
          :remote-method="querySearch"
          :loading="searchLoading"
          @change="visibleChange"
        >
          <el-option
            v-for="item in checkOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <div class="time-search">
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
            v-model="dateForm.date"
            align="right"
            @blur="isTimeShow = false"
            @focus="isTimeShow = true"
            class="search-time-datePicker"
            value-format="yyyy/MM/dd"
            format="yyyy/MM/dd"
            :picker-options="pickeroptions"
          ></el-date-picker>
        </div>
        <div class="btn-content">
          <el-button type="primary" class="search-btn" size="medium" @click="init()">
            <img src="@/../static/img/search.png" class="iconsousuo" />
            搜索
          </el-button>
          <el-button class="clear-btn" type="default" size="medium" @click="clear()">
            <img src="@/../static/img/clear.png" class="iconsousuo" />
            清空
          </el-button>
        </div>
      </div>
      <div class="search-tag margin-16">
        <el-tag v-if="dateForm.date.length > 0"
          >{{ dateConfig.label }}： {{ dateForm.date }}
        </el-tag>
      </div>
      <ul class="panelLists" ref="panelCombine">
        <li class="item" v-for="(item, index) in dataConfig" :key="index">
          <label>{{ item.label }}</label>
          <label>{{ dataInfo[item.prop] || 0 }}</label>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import sevenDayLineChart from "@/components/lineChart/index";
import dayjs from "dayjs";
import { nearSevenDay, checkMan, dataPanel } from "@/api/leadManagement/riskControlPanel";
export default {
  name: "riskControlPanel",
  components: {
    sevenDayLineChart,
  },
  data() {
    return {
      pickeroptions: {
        disabledDate: (time) => {
          return time.getTime() > Date.now() - 24 * 3600 * 1000;
        },
      },
      dateConfig: {
        label: "时间查询",
        key: "date",
      },
      isTimeShow: false,
      dataConfig: [
        {
          label: "处理总量",
          prop: "total_processed_num",
        },
        {
          label: "违规处理量",
          prop: "illegal_num",
        },
        {
          label: "合规处理量",
          prop: "legitimacy_num",
        },
        {
          label: "冻结店铺数",
          prop: "freeze_shop_num",
        },
        {
          label: "抽检量",
          prop: "spot_check_num",
        },
        {
          label: "挂起量",
          prop: "hang_num",
        },
      ],
      dataInfo: {},
      option: {
        xAxis: {
          type: "category",
          data: [],
          name: "日期/天",
        },
        yAxis: {
          type: "value",
          axisLine: {
            show: false,
          },
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: [{ name: "审核数量" }],
          right: "3.5%",
        },
        grid: {
          top: "10%",
          left: "2%",
          right: "4%",
          bottom: "6%",
          containLabel: true,
        },
        series: [
          {
            name: "审核数量",
            data: [],
            type: "line",
            color: "#2E37A4",
          },
        ],
      },
      ownStyle: {
        width: "100%",
        height: "300px",
      },
      dateForm: {
        date: dayjs().add(-1, "day").format("YYYY/MM/DD"),
        user_id: null,
      },
      search: {
        page: 1,
        page_size: 15,
        name: "",
      },
      loading: null,
      searchLoading: false,
      checkOptions: [],
    };
  },
  props: {},
  watch: {
    xxx: {},
  },
  created() {
    this.resources();
  },
  methods: {
    resources() {
      nearSevenDay().then((res) => {
        this.option.xAxis.data = [];
        this.option.series[0].data = [];
        for (const [key, value] of Object.entries(res.data).sort()) {
          this.option.xAxis.data.push(key);
          this.option.series[0].data.push(value);
        }
      });
    },
    init() {
      if (this.loading != null) {
        this.loading.close();
      }
      this.loading = this.$loading({
        target: this.$refs.panelCombine,
      });
      dataPanel(this.dateForm).then((res) => {
        this.dataInfo = res.data;
        setTimeout(() => {
          this.loading.close();
        }, 500);
      });
    },
    visibleChange(val) {
      if (val == null || val.trim().length <= 0) {
        this.checkOptions = [];
      }
      this.init();
    },
    querySearch(str) {
      if (str && str.trim().length > 0) {
        this.search.name = str;
        this.searchLoading = true;
        checkMan(this.search).then((res) => {
          let { list } = res.data;
          this.checkOptions = list;
          this.searchLoading = false;
        });
      } else {
        this.checkOptions = [];
      }
    },
    clear() {
      this.dateForm.date = dayjs().add(-1, "day").format("YYYY/MM/DD");
      this.dateForm.user_id = null;
      this.search.name = "";
      this.init();
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style scoped lang="scss">
.riskControlPanel-conatainer {
  .conditions-content {
    .title {
      font-size: 16px;
      font-weight: 600;
      color: #1c3246;
      line-height: 22px;
      padding: 16px;
    }
    .content-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 16px 16px;
      .el-select {
        flex: 1;
        height: 36px;
        margin-right: 12px;
        /deep/ .el-input {
          height: 36px;
          input {
            height: 100%;
          }
        }
      }
      .time-search {
        display: flex;
        position: relative;
        cursor: pointer;
        flex-basis: 108px;
        .search-time-datePicker {
          position: absolute;
          left: 0;
          opacity: 0;
          top: 0px;
          flex-basis: 108px;
          z-index: 0;
        }
      }

      .search-input {
        flex: 1;
        margin-right: 12px;
        height: 36px;
        /deep/ .el-input__inner {
          height: 100%;
        }
      }
      .btn-content {
        width: 200px;
        margin-left: 12px;
        z-index: 999;
        .el-button {
          height: 36px;
          line-height: 36px;
          padding-top: 0;
          padding-bottom: 0;
        }
        .iconsousuo {
          width: 20px;
          height: 20px;
          vertical-align: middle;
        }
      }
    }
    .panelLists {
      overflow: hidden;
      padding: 0 16px;
      position: relative;
      .item {
        float: left;
        width: 32.5%;
        background: #f9fafc;
        margin-bottom: 16px;
        padding: 48px 16px 48px 32px;
        display: flex;
        justify-content: space-between;
        &:nth-child(3n + 2) {
          margin: 0 1.25%;
        }
        label {
          font-weight: 600;
          font-size: 16px;
          display: inline-block;
          height: 22px;
          line-height: 22px;
          color: #303133;
        }
      }
    }
  }
}
</style>
