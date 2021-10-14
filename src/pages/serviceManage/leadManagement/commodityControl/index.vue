<!---*
* @description 
* @fileName index.vue(商品风控管理列表)
* @author 龙伟
* @date 2021/02/23 14:04:38
*--->
<template>
  <div class="companyCtl-contaniner">
    <contHeader :titleText="$route.meta.title" />
    <div class="conditions-content">
      <searchComponent
        :search="search"
        :btnConfig="btnConfig"
        :searchTypeArr="searchTypeArr"
        :elpopoverArr="elpopoverArr"
        :inputEnter="init"
      >
        <!-- 公司类型 -->
        <template :slot="elpopoverArr[0].slotName">
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
        <!-- 店铺状态 -->
        <template :slot="elpopoverArr[1].slotName">
          <el-radio-group v-model="search.is_del">
            <el-radio
              style="padding: 5px 0"
              v-for="(item, index) in shopStatus"
              :key="index"
              :label="item.id"
              >{{ item.name }}</el-radio
            >
          </el-radio-group>
        </template>
        <template :slot="elpopoverArr[2].slotName">
          <el-radio-group v-model="search.is_cod">
            <el-radio
              style="padding: 5px 0"
              v-for="(item, index) in codStatus"
              :key="index"
              :label="item.id"
              >{{ item.name }}</el-radio
            >
          </el-radio-group>
        </template>
        <template>
          <el-tag
            closable
            v-if="search.company_type.length > 0"
            @close="deleCondition('company_type')"
            style="margin-right: 10px"
            >公司类型： {{ companyName }}</el-tag
          >

          <el-tag
            closable
            v-if="search.is_del != ''"
            @close="deleCondition('is_del')"
            style="margin-right: 10px"
            >店铺状态：
            {{ getCheckValue("is_del", shopStatus, "id", "name") }}</el-tag
          >
          <el-tag
            closable
            v-if="search.is_cod != ''"
            @close="deleCondition('is_cod')"
            style="margin-right: 10px"
            >是否COD：
            {{ getCheckValue("is_cod", codStatus, "id", "name") }}</el-tag
          >
        </template>
      </searchComponent>
      <div class="list-content">
        <tableComponent
          :column="column"
          :tableData="dataList"
          :page.sync="search.page"
          :page_size.sync="search.page_size"
          :sort_field.sync="search.sort_field"
          :sort_direction.sync="search.sort_direction"
          :total.sync="pagination.total"
          :loading.sync="loading"
          height="calc(100vh - 330px)"
          :pageAct="getList"
        />
        <div v-show="pagination.total" class="summarizing">
          <span>待审核商品总数:{{ shopDataObj.unprocessed_num }}</span>
          <span>违规已处理商品总数:{{ shopDataObj.processed_num }}</span>
          <span>合规商品总数:{{ shopDataObj.legitimacy_num }}</span>
          <span>已挂起商品总数:{{ shopDataObj.hang_num }}</span>
        </div>
      </div>
    </div>
    <!-- 操作日志 -->
    <logMenu
      :logVisible.sync="logVisible"
      v-if="logVisible"
      :logData="logData"
      :getLogData="getLogData"
    />
  </div>
</template>

<script>
import { companyTypeList } from "@/api/common";
import {
  getShopList,
  getShopStatistics,
  getListCount
} from "@/api/leadManagement/commodityControl";
import { operatingLog } from "@/api/leadManagement/shopManagement";
export default {
  name: "commodity",
  components: {},
  data() {
    return {
      search: {
        page: 1,
        page_size: 15,
        search_id: "11",
        search_words: "",
        company_type: [],
        is_del: "0",
        is_cod: "",
        sort_field: "sales_num",
        sort_direction: "descending"
      },
      searchTypeArr: [
        {
          value: "11",
          text: "店铺名称"
        },
        {
          value: "1",
          text: "公司名称"
        }
      ],
      codStatus: [
        {
          id: "0",
          name: "否"
        },
        {
          id: "1",
          name: "是"
        }
      ],
      elpopoverArr: [
        {
          btnText: "公司类型",
          slotName: "companyType",
          key: "status",
          bool: false,
          isShow: function(bool) {
            return bool;
          }
        },
        {
          btnText: "店铺状态",
          slotName: "status",
          key: "companyStatus",
          bool: false,
          isShow: function(bool) {
            return bool;
          }
        },
        {
          btnText: "是否仅COD",
          slotName: "COD",
          key: "is_cod",
          bool: false,
          isShow: function(bool) {
            return bool;
          }
        }
      ],
      btnConfig: [
        { text: "搜索", icon: "search", type: "primary", cb: "init" },
        { text: "清空", icon: "clear", type: "default", cb: "clear" }
      ],
      pagination: {
        total: 0
      },
      loading: false,
      typeData: [],
      companyName: "",
      shopStatusName: "",
      shopStatus: [
        {
          id: "0",
          name: "正常"
        },
        {
          id: "1",
          name: "冻结"
        }
      ],
      dataList: [],
      shopDataObj: {},
      logVisible: false,
      logData: {
        logSearch: {
          search_id: "",
          create_time_range: [],
          page: 1,
          page_size: 15
        },
        pagination: {
          total: 0
        },
        title: "日志",
        dataList: [],
        width: "634px",
        logColumn: [
          {
            prop: "id",
            label: "日志ID"
          },
          {
            prop: "user_name",
            label: "操作人"
          },
          {
            prop: "create_time",
            label: "操作时间"
          },
          {
            prop: "content",
            label: "备注"
          }
        ]
      },
      column: [
        {
          prop: "name",
          label: "店铺名称",
          width: 150,
          fixed: "left",
          render: ({ h, row }) => {
            return (
              <span
                style="color:#4993fa;cursor:pointer"
                onClick={() => this.toDetail(row)}
              >
                {row.name}
              </span>
            );
          }
        },
        { prop: "paypal_account", label: "paypal账号", width: 150 },
        { prop: "company_name", label: "公司名称", width: 150 },
        { prop: "company_type_name", label: "公司类型" },
        { prop: "is_cod_text", label: "是否仅COD", width: 100 },
        {
          prop: "week_sales_num",
          label: "最近一周销量",
          sortable: "custom",
          width: 135,
          align: "right"
        },
        {
          prop: "sales_num",
          label: "总销量",
          sortable: "custom",
          width: 100,
          align: "right"
        },
        {
          prop: "gmv",
          label: "总GMV",
          sortable: "custom",
          width: 100,
          align: "right"
        },
        {
          prop: "unprocessed_num",
          label: "待审核商品数量",
          sortable: "custom",
          width: 150,
          align: "right"
        },
        {
          prop: "processed_num",
          label: "违规已处理商品数量",
          sortable: "custom",
          width: 180,
          align: "right"
        },
        {
          prop: "legitimacy_num",
          label: "合规商品数量",
          sortable: "custom",
          width: 150,
          align: "right"
        },
        {
          prop: "hang_num",
          label: "已挂起商品数量",
          sortable: "custom",
          width: 160,
          align: "right"
        },
        {
          prop: "is_del_text",
          label: "店铺状态",
          render: ({ h, row }) => {
            let backgroundColor = "#BBE5B3";
            if (row.is_del == "1") {
              backgroundColor = "#FFC48B";
            }
            return h("div", {
              style: {
                backgroundColor: backgroundColor,
                textAlign: "center",
                width: "54px",
                borderRadius: "27px",
                lineHeight: "23px"
              },
              domProps: {
                innerHTML: row.is_del_text
              }
            });
          }
        },
        {
          prop: "",
          label: "详情",
          width: 100,
          fixed: "right",
          render: ({ h, row }) => {
            return (
              <div>
                <el-link
                  type="primary"
                  size="default"
                  onClick={() => this.toDetail(row)}
                  style=""
                >
                  查看
                </el-link>
                <el-link
                  type="primary"
                  size="default"
                  onClick={() => this.dialogShow(row)}
                  style=""
                >
                  日志
                </el-link>
              </div>
            );
          }
        }
      ]
    };
  },
  props: {},
  watch: {
    xxx: {}
  },
  computed: {
    getCheckValue() {
      return (key, arr, validKey, name) => {
        let obj = arr.find(v => {
          return this.search[key] == v[validKey];
        });
        return obj[name];
      };
    }
  },
  activated() {
    this.initResource();
    this.getList();
  },
  created() {
    this.search.page = 1;
  },
  // created() {
  //   this.initResource();
  //   this.getList();
  // },
  methods: {
    getList() {
      this.loading = true;
      let listPro = new Promise((resolve, reject) => {
        getShopList(this.search)
          .then(res => {
            let { list } = res.data;
            resolve(list);
          })
          .catch(err => {
            reject(err);
          });
      });
      let countPro = new Promise((resolve, reject) => {
        getListCount(this.search)
          .then(res => {
            let { count } = res.data;
            resolve(count);
          })
          .catch(err => {
            reject(err);
          });
      });
      Promise.all([listPro, countPro])
        .then(result => {
          let [list, count] = result;
          this.dataList = list;
          this.pagination.total = count;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
      getShopStatistics(this.search).then(data => {
        this.shopDataObj = data.data;
      });
    },
    // 跳转店铺详情列表
    toDetail(row) {
      let routeUrl = this.$router.resolve({
        name: "commodityDetail",
        query: { row: JSON.stringify(row) }
      });
      window.open(routeUrl.href, "_blank");
    },
    // 日志
    dialogShow({ id }) {
      this.logData.logSearch.search_id = id;
      this.getLogData();
      this.logVisible = true;
    },
    // 获取日志数据
    getLogData() {
      operatingLog(this.logData.logSearch).then(res => {
        let { list, count } = res.data;
        this.logData.pagination.total = count;
        this.logData.dataList = list;
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
    initResource() {
      return new Promise((resolve, reject) => {
        companyTypeList().then(res => {
          this.typeData = res.data.list;
          resolve();
        });
      });
    },
    deleCondition(key) {
      if (key == "company_type") {
        this.search[key] = [];
      } else {
        this.search[key] = "";
      }
      this.init();
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
    }
  }
};
</script>

<style scoped lang="scss">
.companyCtl-contaniner {
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
.el-popover {
  .el-radio-group {
    .el-radio {
      display: block;
    }
  }
}
</style>
