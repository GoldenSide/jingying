<!---*
* @description 服务申请单管理
* @fileName servicesList.vue
* @author 叶金龙
* @date 2020/11/30 09:57:39
*--->
<template>
  <div class="servicesMn-container">
    <contHeader :titleText="$route.meta.title" />
    <el-button
      type="primary"
      size="medium"
      @click="servicesMn"
      class="serviceBtn"
      >服务管理</el-button
    >
    <div class="conditions-content servicesMn-content">
      <div class="content-top">
        <el-input
          v-model="search.company_name"
          placeholder="请输入公司名称"
          size="normal"
          clearable
          class="search-input"
          @keyup.enter.native="init"
        ></el-input>
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
            v-model="search.create_time_range"
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
          v-if="search.create_time_range.length > 0"
          closable
          @close="deleCondition(dateConfig.key)"
          >{{ dateConfig.label }}： {{ search.create_time_range[0] }} 至
          {{ search.create_time_range[1] }}</el-tag
        >
      </div>
      <div class="list-content servicesMn-table">
        <tableComponent
          :column="column"
          :tableData="dataList"
          :page.sync="search.page"
          :page_size.sync="search.page_size"
          :total.sync="pagination.total"
          :loading.sync="loading"
          height="calc(100vh - 370px)"
          :pageAct="getList"
        />
      </div>
    </div>
    <info
      v-if="infoVisible"
      :infoVisible.sync="infoVisible"
      :currentRow="currentRow"
    />
    <servicesSet
      v-if="servicesVisible"
      :servicesVisible.sync="servicesVisible"
      :dataObj="null"
    />
  </div>
</template>

<script>
import enums from "@/utils/enums";
import info from "./components/info";
import servicesSet from "../followUp/components/servicesSet";
import { serviceApplyList } from "@/api/leadManagement/serviceApply";
export default {
  name: "servicesApplyMn",
  components: { info, servicesSet },
  data() {
    return {
      search: {
        page: 1,
        page_size: 15,
        company_name: "",
        create_time_range: [],
      },
      pagination: {
        total: 0,
      },
      dateConfig: {
        label: "申请时间",
        key: "create_time_range",
      },
      btnConfig: [
        { text: "搜索", icon: "search", type: "primary", cb: "init" },
        { text: "清空", icon: "clear", type: "default", cb: "clear" },
      ],
      isTimeShow: false,
      pickerOptions: enums.pickerOptions,
      column: [
        { label: "申请单号", prop: "apply_number", width: 160 },
        { label: "公司名称", prop: "company_name", width: 200 },
        { label: "公司ID", prop: "company_id" },
        { label: "公司负责人", prop: "leading_official", width: 110 },
        { label: "申请人", prop: "apply_person_name" },
        { label: "申请时间", prop: "apply_time", width: 200 },
        { label: "申请原因", prop: "apply_reason", width: 330 },
        { label: "申请单类型", prop: "apply_type_name", width: 100 },
        { label: "服务类型", prop: "server_name", width: 280 },
        {
          label: "申请状态",
          render: ({ h, row }) => {
            return h("div", {
              domProps: {
                innerHTML: row.apply_response_name,
              },
              style: {
                backgroundColor: row.bgc,
                textAlign: "center",
                width: "54px",
                borderRadius: "27px",
                lineHeight: "23px",
              },
            });
          },
        },
        {
          label: "操作",
          fixed: "right",
          render: ({ h, row }) => {
            return (
              <el-link
                type="primary"
                size="default"
                onClick={() => this.seeInfo(row)}
              >
                查看
              </el-link>
            );
          },
        },
      ],
      dataList: [],
      loading: false,
      currentRow: null,
      infoVisible: false,
      servicesVisible: false,
    };
  },
  props: {},
  watch: {
    xxx: {},
  },
  activated() {
    this.getList();
  },
  created() {
    this.search.page = 1;
  },
  // created() {
  //   this.init();
  // },
  methods: {
    init() {
      this.search.page = 1;
      this.getList();
    },
    clear() {
      this.search = this.$options.data().search;
      this.init();
    },
    getList() {
      this.loading = true;
      serviceApplyList(this.search).then((res) => {
        let { list, count } = res.data;
        list.forEach((v) => {
          v.apply_response_status == 1
            ? this.$set(v, "bgc", "#BBE5B3")
            : this.$set(v, "bgc", "#FFC48B");
        });
        this.dataList = list;
        this.pagination.total = count;
        setTimeout(() => {
          this.loading = false;
        }, 500);
      });
    },
    deleCondition(key) {
      this.search[key] = [];
    },
    seeInfo(row) {
      this.currentRow = row;
      this.infoVisible = true;
    },
    servicesMn() {
      this.servicesVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.servicesMn-container {
  position: relative;
  .el-button {
    height: 36px;
    line-height: 36px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .serviceBtn {
    position: absolute;
    right: 0;
    top: 0px;
  }
  .servicesMn-content {
    .content-top {
      display: flex;
      justify-content: space-between;
      padding: 16px;
      align-items: center;

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
        .iconsousuo {
          width: 20px;
          height: 20px;
          vertical-align: middle;
        }
      }
    }
  }
}
.servicesMn-table {
  &.list-content {
    margin-top: 0px;
  }
}
</style>
