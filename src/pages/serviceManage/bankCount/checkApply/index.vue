<!---*
* @description 银行账户开通
* @fileName index.vue
* @author 叶金龙
* @date 2020/11/03 15:50:41
*--->
<template>
  <div class="checkApply">
    <contHeader :titleText="$route.meta.title" />
    <div class="conditions-content">
      <searchComponent
        :search="search"
        :btnConfig="btnConfig"
        :searchTypeArr="searchTypeArr"
        :elpopoverArr="elpopoverArr"
        :dateConfig="dateConfig"
        :inputEnter="init"
      >
        <template :slot="elpopoverArr[0].slotName">
          <el-checkbox-group v-model="search.status">
            <el-checkbox
              v-for="(item, index) in statusArr"
              :label="item.value"
              :key="index"
              >{{ item.text }}</el-checkbox
            >
          </el-checkbox-group>
          <span
            class="clear-checkbox"
            @click="deleCondition(elpopoverArr[0].key)"
            >清除</span
          >
        </template>
        <template>
          <el-tag
            v-for="(item, index) in elpopoverArr"
            :key="index"
            closable
            v-show="checkCalc(item.key, item.checkArr()).length > 0"
            @close="deleCondition(item.key)"
            style="margin-right: 10px"
            >{{ item.btnText }}：
            {{ checkCalc(item.key, item.checkArr()) }}
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
          height="calc(100vh - 367px)"
          :pageAct="getList"
        />
      </div>
    </div>
  </div>
</template>

<script>
import enums from "@/utils/enums";
import dayjs from "dayjs";
import { countApplyList } from "@/api/bankCount/checkApply";
import { companyTypeList } from "@/api/common";
export default {
  name: "checkApply",
  components: {},
  data() {
    return {
      searchTypeArr: [
        {
          value: "1",
          text: "公司名称",
        },
        {
          value: "2",
          text: "公司编码",
        },
      ],
      statusArr: [
        {
          value: "-2",
          text: "已驳回",
          color: "#FFC48B",
        },
        {
          value: "-1",
          text: "待审核",
          color: "#FFEA8A",
        },
        {
          value: "1",
          text: "审核通过, 待银行开通",
          color: "#FFEA8A",
        },
        {
          value: "2",
          text: "银行账户已开通",
          color: "#BBE5B3",
        },
      ],

      dateConfig: [
        {
          label: "创建时间",
          key: "create_time_range",
          isTimeShow: false,
        },
      ],
      search: {
        page: 1,
        page_size: 20,
        status: [],
        search_id: "1",
        search_words: null,
        create_time_range: [
          dayjs().startOf("month").format("YYYY/MM/DD"),
          dayjs().endOf("month").format("YYYY/MM/DD"),
        ],
      },
      pagination: {
        total: 0,
      },
      btnConfig: [
        { text: "搜索", icon: "search", type: "primary", cb: "init" },
        { text: "清空", icon: "clear", type: "default", cb: "clear" },
      ],
      elpopoverArr: [
        {
          btnText: "审核状态",
          slotName: "currrentStatus",
          key: "status",
          width: 185,
          bool: false,
          isShow: function (bool) {
            return bool;
          },
          checkArr: () => {
            return this.statusArr;
          },
        },
      ],
      loading: false,
      column: [
        { prop: "company_code", label: "公司编码" },
        { prop: "company_name", label: "公司名称" },
        { prop: "leading_official", label: "法人" },
        {
          prop: "company_type",
          label: "客户类型",
          render: ({ h, row }) => {
            for (let val of this.companyArr) {
              if (val.id == row.company_type) {
                return val.name;
                break;
              }
            }
          },
        },
        { prop: "contact_person", label: "联系人" },
        {
          prop: "status",
          label: "状态",
          render: ({ h, row }) => {
            return h("span", {
              style: {
                backgroundColor: row.color,
                textAlign: "left",
                borderRadius: "15px",
                lineHeight: "23px",
                height: "23px",
                padding: "0 10px",
                display: "inline-block",
              },
              domProps: {
                innerHTML: row.status_text,
              },
            });
          },
        },
        { prop: "created_at", label: "创建时间" },
        {
          prop: "",
          label: "操作",
          render: ({ h, row }) => {
            return (
              <span class="link-a" onClick={() => this.btnAct(row)}>
                {row.status == "-1" ? "审核" : "详情"}
              </span>
            );
          },
        },
      ],
      dataList: [],
      companyArr: [],
    };
  },
  props: {},
  watch: {
    xxx: {},
  },
  activated() {
    this.initReserous();
    this.getList();
  },
  created() {
    this.search.page = 1;
  },
  methods: {
    initReserous() {
      companyTypeList().then((res) => {
        this.companyArr = res.data.list;
      });
    },
    init() {
      this.search.page = 1;
      this.getList();
    },
    deleCondition(key) {
      this.search[key] = [];
      this.init();
    },
    clear() {
      this.search = this.$options.data().search;
      this.init();
    },
    getList() {
      this.loading = true;
      countApplyList(this.search).then((res) => {
        let { list, count } = res.data;
        for (let val of list) {
          let tem = this.statusArr.filter((v) => {
            return val.status == v.value;
          });
          if (tem.length > 0) {
            this.$set(val, "color", tem[0].color);
            continue;
          }
        }
        this.dataList = list;
        this.pagination.total = count;
        setTimeout(() => {
          this.loading = false;
        }, 500);
      });
    },
    btnAct({ id }) {
      this.$router.push({ path: "/index/bankCount/countInfo", query: { id } });
    },
  },
  computed: {
    checkCalc() {
      return function (key, checkArr) {
        let arr = [];
        for (let val of checkArr) {
          if (this.search[key].indexOf(val.value) == -1) {
            continue;
          } else {
            arr.push(val.text);
          }
        }
        if (arr.length > 0) {
          return arr.join(",");
        } else {
          return "";
        }
      };
    },
  },
};
</script>

<style scoped lang='scss'>
</style>