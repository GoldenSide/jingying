<!---*
* @description  发票查询管理
* @fileName list.vue
* @author 叶金龙
* @date 2021/06/07 16:47:22
*--->
<template>
  <div class="invoiceList-container">
    <contHeader :titleText="$route.meta.title" />
    <div class="conditions-content">
      <searchComponent
        :search="search"
        :btnConfig="btnConfig"
        :searchTypeArr="searchTypeArr"
        :elpopoverArr="elpopoverArr"
        :inputEnter="init"
        :dateConfig="dateConfig"
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
        <template
          :slot="item.slotName"
          v-for="(item, index) in calcElpopoverArr"
        >
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
import { invoiceList } from "@/api/finance/invoiceList";
import enums from "@/utils/enums";
export default {
  name: "",
  components: {},
  data() {
    return {
      search: {
        page: 1,
        page_size: 20,
        search_id: "2",
        search_words: "",
        company_type: [],
        invoice_red_flag: "",
        invoice_source: "",
        invoice_type: "",
        invoice_date_range: []
      },
      pagination: {
        total: 0
      },
      btnConfig: [
        { text: "搜索", icon: "search", type: "primary", cb: "init" },
        { text: "清空", icon: "clear", type: "default", cb: "clear" }
      ],
      searchTypeArr: [
        {
          value: "1",
          text: "发票号码"
        },
        {
          value: "2",
          text: "公司名称"
        }
      ],
      invoiceType: enums.invoiceType,
      selectType: [],
      elpopoverArr: [
        {
          btnText: "公司类型",
          slotName: "companyType",
          key: "company_type",
          width: 150,
          value: "id",
          bool: false,
          isShow: function(bool) {
            return bool;
          },
          checkArr: () => {
            return this.selectType;
          }
        },
        {
          btnText: "开票类型",
          slotName: "invoiceType",
          key: "invoice_type",
          width: 150,
          value: "value",
          bool: false,
          isShow: function(bool) {
            return bool;
          },
          checkArr: () => {
            return this.invoiceType;
          }
        },
        {
          btnText: "开票来源",
          slotName: "invoiceSource",
          key: "invoice_source",
          width: 150,
          value: "value",
          bool: false,
          isShow: function(bool) {
            return bool;
          },
          checkArr: () => {
            return this.invoiceSource;
          }
        },
        {
          btnText: "是否红冲",
          slotName: "redFlag",
          key: "invoice_red_flag",
          width: 150,
          value: "value",
          bool: false,
          isShow: function(bool) {
            return bool;
          },
          checkArr: () => {
            return this.isredFlag;
          }
        }
      ],
      dateConfig: [
        {
          label: "开票时间",
          key: "invoice_date_range",
          isTimeShow: false
        }
      ],

      invoiceSource: [
        {
          value: "1",
          name: "佣金账单"
        },
        {
          value: "2",
          name: "店铺套餐收入"
        },
        {
          value: "3",
          name: "企业套餐收入"
        }
      ],
      isredFlag: [
        {
          value: "1",
          name: "是"
        },
        {
          value: "2",
          name: "否"
        }
      ],
      dataList: [],
      loading: false,
      column: [
        {
          prop: "invoice_no",
          label: "发票号码",
          width: 200,
          render: ({ h, row }) => {
            return (
              <div>
                <el-link
                  type="primary"
                  size="default"
                  onClick={() => this.invoiceDetail(row)}
                  style=""
                >
                  {row.invoice_no}
                </el-link>
              </div>
            );
          }
        },
        {
          prop: "invoice_code",
          label: "发票代码",
          width: 150
        },
        {
          prop: "invoice_type_name",
          label: "开票类型",
          width: 100
        },
        {
          prop: "invoice_date",
          label: "开票日期",
          width: 160
        },
        {
          prop: "invoice_amount",
          label: "开票金额（￥/$）",
          width: 130,
          align: "right"
        },
        {
          prop: "invoice_title",
          label: "项目名称",
          width: 200
        },
        {
          prop: "invoice_source_name",
          label: "开票来源",
          width: 130
        },
        {
          prop: "company_name",
          label: "公司名称",
          width: 180
        },
        {
          prop: "company_type_name",
          label: "公司类型",
          width: 150
        },
        {
          prop: "invoice_title_type_name",
          label: "抬头类型",
          width: 100
        },
        {
          prop: "invoice_company_name",
          label: "抬头名称",
          width: 180
        },
        {
          prop: "invoice_company_tax_number",
          label: "税号",
          width: 150
        },
        {
          prop: "invoice_receive_email",
          label: "收票邮箱",
          width: 200
        },
        {
          prop: "invoice_url",
          label: "发票链接",
          width: 250,
          render: ({ h, row }) => {
            return (
              <div>
                <el-link
                  type="primary"
                  size="default"
                  onClick={() => this.invoiceOpen(row.invoice_url)}
                  style=""
                >
                  {row.invoice_url}
                </el-link>
              </div>
            );
          }
        },
        {
          prop: "invoice_red_flag_name",
          label: "是否红冲",
          width: 150
        }
        // {
        //   prop: "invoice_red_no",
        //   label: "红冲票号",
        //   width: 150,
        // },
      ]
    };
  },
  props: {},
  watch: {
    xxx: {}
  },
  created() {
    this.initResources();
    this.init();
  },
  methods: {
    initResources() {
      companyTypeList().then(res => {
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
    getList() {
      this.loading = true;
      invoiceList(this.search)
        .then(res => {
          let { count, list } = res.data;
          this.dataList = list;
          this.pagination.total = count;
          this.loading = false;
        })
        .catch(err => {
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
    },
    invoiceDetail(row) {
      let { invoice_source, invoice_no } = row;
      if (invoice_source == "1") {
        this.$router.push({
          path: "/financeMana/settlement/billList",
          query: {
            search_id: "26",
            search_words: invoice_no,
            pay_time_range: []
          }
        });
      } else if (invoice_source == "2" || invoice_source == "3") {
        this.$router.push({
          path: "/financeMana/settlement/revenue",
          query: {
            search_id: "6",
            search_words: invoice_no,
            tab_type: invoice_source == "2" ? "shop" : "company"
          }
        });
      }
    },
    invoiceOpen(url) {
      window.open(url, "_blank");
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
    },
    calcElpopoverArr() {
      return this.elpopoverArr.slice(1);
    }
  }
};
</script>

<style scoped lang="scss">
.el-popover {
  .el-radio-group {
    .el-radio {
      display: block;
    }
  }
}
</style>
