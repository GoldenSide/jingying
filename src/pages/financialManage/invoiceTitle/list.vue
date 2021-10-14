<!---*
* @description 客户发票抬头信息
* @fileName list.vue
* @author 叶金龙
* @date 2021/06/07 15:44:04
*--->
<template>
  <div class="invoiceTitle-contianer">
    <contHeader :titleText="$route.meta.title" />
    <div class="conditions-content">
      <searchComponent
        :search="search"
        :btnConfig="btnConfig"
        :searchTypeArr="searchTypeArr"
        :elpopoverArr="elpopoverArr"
        :inputEnter="init"
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
      <div class="list-content">
        <tableComponent
          ref="tableChild"
          :column="column"
          :tableData="dataList"
          :page.sync="search.page"
          :page_size.sync="search.page_size"
          :total.sync="pagination.total"
          :loading.sync="loading"
          height="calc(100vh - 324px)"
          :pageAct="getList"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { companyTypeList } from "@/api/common";
import { invoiceTitleList } from "@/api/finance/invoiceTitle";
export default {
  name: "",
  components: {},
  data() {
    return {
      search: {
        page: 1,
        page_size: 20,
        search_id: "1",
        search_words: "",
        company_type: [],
      },
      pagination: {
        total: 0,
      },
      btnConfig: [
        { text: "搜索", icon: "search", type: "primary", cb: "init" },
        { text: "清空", icon: "clear", type: "default", cb: "clear" },
      ],
      searchTypeArr: [
        {
          value: "1",
          text: "公司名称",
        },
        {
          value: "2",
          text: "抬头名称",
        },
        {
          value: "3",
          text: "税号",
        },
      ],
      selectType: [],
      elpopoverArr: [
        {
          btnText: "公司类型",
          slotName: "companyType",
          key: "company_type",
          width: 150,
          value: "id",
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
      column: [
        {
          prop: "company_name",
          label: "公司名称",
          width: 200,
        },
        {
          prop: "company_type_name",
          label: "公司类型",
          width: 150,
        },
        {
          prop: "invoice_company_name",
          label: "抬头名称",
        },
        {
          prop: "invoice_company_tax_number",
          label: "税号",
          width: 280,
        },
        {
          prop: "address",
          label: "地址",
          width: 280,
        },
        {
          prop: "mobile",
          label: "电话",
          width: 150,
        },
        {
          prop: "bank_name",
          label: "开户行",
          width: 280,
        },
        {
          prop: "bank_no",
          label: "银行账号",
          width: 200,
        },
        {
          prop: "invoice_receive_email",
          label: "收票邮箱",
          width: 200,
        },
      ],
    };
  },
  props: {},
  watch: {
    xxx: {},
  },
  created() {
    this.initResources();
    this.init();
  },
  methods: {
    initResources() {
      companyTypeList().then((res) => {
        this.selectType = res.data.list;
      });
    },
    init() {
      this.search.page = 1;
      this.getList();
    },
    clear() {
      this.search = this.$options.data().search;
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
    },
    getList() {
      this.loading = true;
      invoiceTitleList(this.search)
        .then((res) => {
          this.loading = false;
          let { list, count } = res.data;
          this.dataList = list;
          this.pagination.total = count;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
  },
  computed: {
    checkCalc() {
      return function (key, checkArr, value) {
        let arr = [];
        arr = checkArr.filter((ele) => {
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
    },
  },
};
</script>

<style scoped lang="scss"></style>
