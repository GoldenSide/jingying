<!---*
* @description 
* @fileName discountAppList.vue (客户优惠申请单)
* @author 龙伟
* @date 2020/12/09 11:14:07
*--->
<template>
  <div class="discountAppList-contaniner">
    <div class="titleTop">
      <contHeader :titleText="$route.meta.title" />
      <el-button type="primary" @click="addCheck">新增</el-button>
    </div>
    <div class="conditions-content">
      <searchComponent
        :search="search"
        :btnConfig="btnConfig"
        :searchTypeArr="searchTypeArr"
        :elpopoverArr="elpopoverArr"
        :inputEnter="init"
      >
        <template :slot="elpopoverArr[0].slotName">
          <el-radio-group
            v-model="search.discount_type"
            @change="
              (val) => changeStatus(val, discountType, 'discountName', 'id')
            "
          >
            <el-radio
              style="padding: 5px 0"
              v-for="(item, index) in discountType"
              :key="index"
              :label="item.id"
              >{{ item.name }}</el-radio
            >
          </el-radio-group>
        </template>
        <template :slot="elpopoverArr[1].slotName">
          <el-radio-group
            v-model="search.status"
            @change="(val) => changeStatus(val, statusType, 'statusName', 'id')"
          >
            <el-radio
              style="padding: 5px 0"
              v-for="(item, index) in statusType"
              :key="index"
              :label="item.id"
              >{{ item.name }}</el-radio
            >
          </el-radio-group>
        </template>
        <template>
          <el-tag
            closable
            v-if="search.discount_type != ''"
            @close="deleCondition('discount_type')"
            style="margin-right: 10px"
            >优惠项 {{ discountName }}</el-tag
          >
        </template>
        <template>
          <el-tag
            closable
            v-if="search.status != ''"
            @close="deleCondition('status')"
            style="margin-right: 10px"
            >工单状态 {{ statusName }}</el-tag
          >
        </template>
      </searchComponent>
      <div class="list-content discountAppList-table">
        <tableComponent
          :column="column"
          :tableData="dataList"
          :page.sync="search.page"
          :page_size.sync="search.page_size"
          :total.sync="pagination.total"
          :loading.sync="loading"
          height="calc(100vh - 385px)"
          :pageAct="getList"
        />
      </div>
    </div>
    <!-- 优惠单审核 -->
    <checkMenu
      v-if="checkVisible"
      :checkData="checkData"
      :checkVisible.sync="checkVisible"
    />
    <!-- 新增优惠申请单 -->
    <addCheckMenu
      v-if="addCheckVisible"
      :addCheckVisible.sync="addCheckVisible"
      :addCheckData="addCheckData"
    />
  </div>
</template>

<script>
import checkMenu from "./components/check";
import addCheckMenu from "./components/addCheck";
import { discountList } from "@/api/leadManagement/discountAppList";
export default {
  name: "discountAppList",
  components: { checkMenu, addCheckMenu },
  data() {
    return {
      search: {
        search_id: "1",
        search_words: "",
        discount_type: "",
        status: "",
        page: 1,
        page_size: 15,
      },
      dataList: [],
      checkVisible: false,
      checkData: {},
      addCheckVisible: false,
      addCheckData: {},
      column: [
        {
          prop: "apply_id",
          label: "工单编号",
          width: 200,
        },
        {
          prop: "company_id",
          label: "公司id",
        },
        {
          prop: "company_name",
          label: "公司名称",
        },
        {
          prop: "discount_type_name",
          label: "优惠项",
        },
        {
          prop: "original_price",
          label: "原价",
          render: ({ h, row }) => {
            let text = null;
            text =
              row.discount_type == 1
                ? `￥${row.original_price}`
                : `${row.original_price}%`;
            return h("div", {
              domProps: {
                innerHTML: text,
              },
            });
          },
        },
        {
          prop: "discount_price",
          label: "优惠价",
          render: ({ h, row }) => {
            let text = null;
            text =
              row.discount_type == 1
                ? `￥${row.discount_price}`
                : `${row.discount_price}%`;
            return h("div", {
              domProps: {
                innerHTML: text,
              },
            });
          },
        },
        {
          prop: "discount_rate",
          label: "折扣率(%)",
        },
        {
          prop: "created_at",
          label: "申请时间",
          width: 200,
        },
        {
          prop: "",
          label: "状态",
          render: ({ h, row }) => {
            return h("div", {
              style: {
                backgroundColor: this.statusType[row.status - 1].color,
                textAlign: "center",
                width: "56px",
                borderRadius: "27px",
                lineHeight: "23px",
              },
              domProps: {
                innerHTML: row.status_name,
              },
            });
          },
        },
        {
          prop: "",
          label: "操作",
          render: ({ h, row }) => {
            if (row.status == 1) {
              return (
                <div>
                  <el-link
                    type="primary"
                    size="default"
                    onClick={() => this.toDetails(row)}
                  >
                    查看
                  </el-link>
                  <el-link
                    type="primary"
                    size="default"
                    onClick={() => this.showCheckView(row)}
                  >
                    审核
                  </el-link>
                </div>
              );
            } else {
              return (
                <div>
                  <el-link
                    type="primary"
                    size="default"
                    onClick={() => this.toDetails(row)}
                  >
                    查看
                  </el-link>
                </div>
              );
            }
          },
        },
      ],
      loading: false,
      pagination: {
        total: 0,
      },
      btnConfig: [
        { text: "搜索", icon: "search", type: "primary", cb: "init" },
        { text: "清空", icon: "clear", type: "default", cb: "clear" },
      ],
      discountName: "",
      statusName: "",
      elpopoverArr: [
        {
          btnText: "优惠项",
          slotName: "discount_type",
          key: "discount_type",
          width: 150,
          bool: false,
          isShow: function (bool) {
            return bool;
          },
        },
        {
          btnText: "工单状态",
          slotName: "status",
          key: "status",
          width: 150,
          bool: false,
          isShow: function (bool) {
            return bool;
          },
        },
      ],
      searchTypeArr: [
        {
          value: "1",
          text: "工单编号",
        },
        {
          value: "2",
          text: "公司名称",
        },
        {
          value: "3",
          text: "店铺名称",
        },
        {
          value: "4",
          text: "公司id",
        },
      ],
      discountType: [
        {
          id: 1,
          name: "店租",
        },
        {
          id: 2,
          name: "交易佣金",
        },
      ],
      statusType: [
        {
          id: 1,
          name: "待审核",
          color: "#FFEA8A",
        },
        {
          id: 2,
          name: "已通过",
          color: "#BBE5B3",
        },
        {
          id: 3,
          name: "已驳回",
          color: "#FFC48B",
        },
      ],
    };
  },
  props: {},
  watch: {
    xxx: {},
  },
  // created() {
  //   this.getList();
  // },
  activated() {
    this.getList();
  },
  methods: {
    // 跳转详情
    toDetails(row) {
      this.$router.push({
        path: "/index/bankCount/discountReview",
        query: {
          row: JSON.stringify(row),
        },
      });
    },
    // 审核
    showCheckView(row) {
      this.checkData = row;
      this.checkVisible = true;
    },
    // 新增
    addCheck() {
      this.addCheckVisible = true;
    },
    init() {
      if (this.search.search_id != "4") {
        this.$router.push({ query: {} });
      }
      this.search.page = 1;
      this.getList();
    },
    clear() {
      this.search = this.$options.data().search;
      this.init();
    },
    deleCondition(key) {
      if (key == "company_type") {
        this.search[key] = [];
      }
      this.search[key] = "";
      this.init();
    },
    // 获取表格数据
    getList() {
      this.loading = true;
      if (this.$route.query != "") {
        this.search = { ...this.search, ...this.$route.query };
      }
      discountList(this.search).then((res) => {
        // console.log(res);
        let { list, count, discount_maps } = res.data;
        this.dataList = list;
        this.pagination.total = count;
        this.addCheckData = discount_maps;
      });
      setTimeout(() => {
        this.loading = false;
      }, 500);
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
  },
};
</script>

<style scoped lang="scss">
.discountAppList-contaniner {
  position: relative;
  .discountAppList-table {
    &.list-content {
      margin-top: 0;
    }
  }
  .titleTop {
    display: flex;
    justify-content: space-between;
    .el-button {
      position: absolute;
      right: 0;
      top: 0px;
      height: 36px;
      line-height: 36px;
      padding-top: 0;
      padding-bottom: 0;
    }
  }
}
</style>
