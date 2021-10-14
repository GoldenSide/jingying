<!---*
* @description 
* @fileName shopManagement.vue(企业店铺管理)
* @author 龙伟
* @date 2020/12/11 14:21:38
*--->
<template>
  <div class="shopManagement-contaniner">
    <contHeader :titleText="$route.meta.title" />
    <el-button
      type="primary"
      size="medium"
      @click="addShop"
      class="actBtn"
      v-if="platform == 'Emysale'"
      >新增店铺</el-button
    >
    <div class="conditions-content">
      <searchComponent
        :search="search"
        :btnConfig="btnConfig"
        :searchTypeArr="searchTypeArr"
        :elpopoverArr="elpopoverArr"
        :inputEnter="init"
      >
        <template slot="multipleSearch">
          <el-tooltip placement="bottom" :disabled="!tooltipVal">
            <div slot="content" v-html="tooltipVal"></div>
            <el-button @click.stop="batchSearchShow">批量搜索</el-button>
          </el-tooltip>
        </template>
        <template :slot="elpopoverArr[0].slotName">
          <el-checkbox-group
            v-model="search.company_type"
            @change="(val) => changeStatus(val, typeData, 'companyName', 'id')"
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
        <template :slot="elpopoverArr[1].slotName">
          <el-radio-group
            v-model="search.source"
            @change="(val) => changeStatus(val, sourceData, 'sourceName', 'id')"
          >
            <el-radio
              style="padding: 5px 0"
              v-for="(item, index) in sourceData"
              :key="index"
              :label="item.id"
              >{{ item.name }}</el-radio
            >
          </el-radio-group>
        </template>
        <template :slot="elpopoverArr[2].slotName">
          <el-radio-group
            v-model="search.platform_product_id"
            @change="
              (val) => changeStatus(val, platformData, 'platformName', 'id')
            "
          >
            <el-radio
              style="padding: 5px 0"
              v-for="(item, index) in platformData"
              :key="index"
              :label="item.id"
              >{{ item.name }}</el-radio
            >
          </el-radio-group>
        </template>
        <template :slot="elpopoverArr[3].slotName">
          <el-radio-group
            v-model="search.product_status"
            @change="
              (val) => changeStatus(val, productType, 'productName', 'id')
            "
          >
            <el-radio
              style="padding: 5px 0"
              v-for="(item, index) in productType"
              :key="index"
              :label="item.id"
              >{{ item.name }}</el-radio
            >
          </el-radio-group>
        </template>
        <template :slot="elpopoverArr[4].slotName">
          <el-radio-group
            v-model="search.is_del"
            @change="(val) => changeStatus(val, shopType, 'shopName', 'id')"
          >
            <el-radio
              style="padding: 5px 0"
              v-for="(item, index) in shopType"
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
        </template>
        <template>
          <el-tag
            closable
            v-if="search.source != ''"
            @close="deleCondition('source')"
            style="margin-right: 10px"
            >来源渠道： {{ sourceName }}</el-tag
          >
        </template>
        <template>
          <el-tag
            closable
            v-if="search.platform_product_id != ''"
            @close="deleCondition('platform_product_id')"
            style="margin-right: 10px"
            >套餐类型： {{ platformName }}</el-tag
          >
        </template>
        <template>
          <el-tag
            closable
            v-if="search.product_status != ''"
            @close="deleCondition('product_status')"
            style="margin-right: 10px"
            >套餐状态 {{ productName }}</el-tag
          >
        </template>
        <template>
          <el-tag
            closable
            v-if="search.is_del != ''"
            @close="deleCondition('is_del')"
            style="margin-right: 10px"
            >店铺状态 {{ shopName }}</el-tag
          >
        </template>
      </searchComponent>
      <div class="tips" v-if="platform == 'XShoppy'">
        <span
          >已选中<em>{{ shopNameList.length }}</em
          >项</span
        >
        <el-button
          slot="reference"
          @click="changeCompany"
          :disabled="!shopNameList.length"
        >
          换绑公司
        </el-button>
      </div>
      <div class="list-content">
        <tableComponent
          ref="tableChild"
          :column="column"
          :tableData="dataList"
          :page.sync="search.page"
          :page_size.sync="search.page_size"
          :total.sync="pagination.total"
          :loading.sync="loading"
          :selectionShow="platform == 'XShoppy'"
          height="calc(100vh - 370px)"
          :pageAct="getList"
          :tabelSelectOne="getSelectTable"
          :tabelSelectAll="getSelectTableAll"
          :isSelection="isSelection"
        />
      </div>
    </div>
    <!-- 换绑公司 -->
    <el-dialog
      title="换绑公司"
      width="634px"
      :close-on-click-modal="false"
      :visible.sync="shopFormVisible"
      :before-close="shopFormHiddlen"
    >
      <el-form :model="shopForm" ref="shopForm" :rules="rules">
        <el-form-item prop="company_id">
          <template slot="label">
            <span>公司名称</span
            ><span style="font-size: 12px; margin-left: 16px"
              ><i
                class="el-icon-warning"
                style="color: #e6a23c; font-size: 12px"
              ></i>
              换绑后，所选店铺所属公司将更换为本次换绑公司</span
            >
          </template>
          <el-select
            v-model="shopForm.company_id"
            filterable
            placeholder="请输入公司名称"
            clearable
            remote
            :remote-method="remoteMethod"
            :loading="searchLoading"
          >
            <el-option
              v-for="item in restaurantsOptions"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="shopFormHiddlen">取 消</el-button>
        <el-button type="primary" :loading="shopFormLoading" @click="submit"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 日志 -->
    <logMenu
      :logVisible.sync="logVisible"
      v-if="logVisible"
      :logData="logData"
      :getLogData="getLogData"
    />
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

    <freeze
      v-if="freezeShopVisible"
      :freezeShopVisible.sync="freezeShopVisible"
      :freezeShopId="freezeShopId"
      :refresh="getList"
    />

    <shopDia
      v-if="shopActVisible"
      :shopActVisible.sync="shopActVisible"
      :topTitle="topTitle"
      :init="init"
    />
    <resetPwd
      v-if="resetPwdVisible"
      :resetPwdVisible.sync="resetPwdVisible"
      :shop_name="shop_name"
      :init="init"
    />
  </div>
</template>

<script>
import {
  shopListData,
  platformProductList,
  operatingLog,
  changeShopCompany,
  listCount
} from "@/api/leadManagement/shopManagement";
import { listMultiSearch, companyTypeList } from "@/api/common";
import { companySearchByWords } from "@/api/leadManagement/discountAppList";
import batchSearchMenu from "@/components/search/batchSearch";
import freeze from "./components/freezeShop";
import shopDia from "./components/shopDialog";
import resetPwd from "./components/resetPwd";
import { mapGetters } from "vuex";
export default {
  name: "shopManagementList",
  components: { batchSearchMenu, freeze, shopDia, resetPwd },
  data() {
    return {
      search: {
        search_id: "11",
        search_words: "",
        source: "",
        platform_product_id: "",
        product_status: "",
        is_del: "",
        page: 1,
        page_size: 15,
        company_type: [],
        multi_search_words: []
      },
      selectionShow: true,
      dataList: [],
      restaurants: [],
      restaurantsOptions: [],
      column: [
        {
          prop: "id",
          label: "店铺ID",
          width: 150
        },
        {
          prop: "name",
          label: "店铺名称",
          width: 180
        },
        {
          prop: "company_name",
          label: "公司名称",
          width: 180
        },
        {
          prop: "company_type_text",
          label: "公司类型",
          width: 160
        },

        {
          prop: "domain",
          label: "域名",
          width: 200
        },
        {
          prop: "source_text",
          label: "来源渠道"
        },
        {
          prop: "platform_product_name",
          label: "套餐类型"
        },
        {
          prop: "product_status",
          label: "套餐状态",
          render: ({ h, row }) => {
            if (row.product_status != 1 && row.product_status != 2) return;
            let color = "#BBE5B3";
            let text = "正常";
            if (row.product_status == 2) {
              color = "#FFC48B";
              text = "过期";
            }
            return h("div", {
              style: {
                backgroundColor: color,
                textAlign: "center",
                width: "54px",
                borderRadius: "27px",
                lineHeight: "23px"
              },
              domProps: {
                innerHTML: text
              }
            });
          }
        },
        {
          prop: "is_del_text",
          label: "店铺状态"
        },
        {
          prop: "",
          label: "操作",
          flexd: "right",
          width: 200,
          render: ({ h, row }) => {
            return h("div", [
              h(
                "el-link",
                {
                  props: {
                    type: "primary"
                  },
                  on: {
                    click: () => this.toDetails(row)
                  }
                },
                "查看"
              ),
              row.is_del == 0 &&
                h(
                  "el-link",
                  {
                    props: {
                      type: "primary"
                    },
                    on: {
                      click: () => this.isFreezeShop(row)
                    }
                  },
                  "冻结店铺"
                ),
              h(
                "el-link",
                {
                  props: {
                    type: "primary"
                  },
                  on: {
                    click: () => this.dialogShow(row)
                  }
                },
                "日志"
              ),
              this.platform == "Emysale" &&
                h(
                  "el-dropdown",
                  {
                    on: {
                      command: command => this.handleCommand(command, row)
                    }
                  },
                  [
                    h(
                      "span",
                      {
                        class: {
                          "el-dropdown-link": true
                        }
                      },
                      [
                        "更多",
                        h("i", {
                          class: {
                            "el-icon-arrow-down": true,
                            "el-icon--right": true
                          }
                        })
                      ]
                    ),
                    h(
                      "el-dropdown-menu",
                      {
                        slot: "dropdown"
                      },
                      [
                        h(
                          "el-dropdown-item",
                          {
                            props: {
                              command: "resetPwd"
                            }
                          },
                          "重置密码"
                        )
                      ]
                    )
                  ]
                )
            ]);
          }
        }
      ],
      loading: false,
      pagination: {
        total: 0
      },
      btnConfig: [
        { text: "搜索", icon: "search", type: "primary", cb: "init" },
        { text: "清空", icon: "clear", type: "default", cb: "clear" }
      ],
      elpopoverArr: [
        {
          btnText: "公司类型",
          slotName: "companyType",
          key: "status",
          width: 150,
          bool: false,
          isShow: function(bool) {
            return bool;
          }
        },
        {
          btnText: "来源渠道",
          slotName: "source_code",
          key: "source_code",
          width: 150,
          bool: false,
          isShow: function(bool) {
            return bool;
          }
        },
        {
          btnText: "套餐类型",
          slotName: "platform_product_id",
          key: "platform_product_id",
          width: 150,
          bool: false,
          isShow: function(bool) {
            return bool;
          }
        },
        {
          btnText: "套餐状态",
          slotName: "product_status",
          key: "product_status",
          width: 150,
          bool: false,
          isShow: function(bool) {
            return bool;
          }
        },
        {
          btnText: "店铺状态",
          slotName: "is_del",
          key: "is_del",
          width: 150,
          bool: false,
          isShow: function(bool) {
            return bool;
          }
        }
      ],
      searchTypeArr: [
        {
          value: "11",
          text: "店铺名称"
        },
        {
          value: "1",
          text: "公司名称"
        },
        {
          value: "12",
          text: "域名"
        },
        {
          value: "27",
          text: "第三方域名"
        }
      ],
      sourceData: [{ id: 1, name: "线下" }, { id: 2, name: "官网" }],
      platformData: [],
      productType: [
        {
          id: 1,
          name: "正常"
        },
        {
          id: 2,
          name: "过期"
        }
      ],
      shopType: [
        {
          id: "valid",
          name: "正常"
        },
        {
          id: "invalid",
          name: "冻结"
        }
      ],
      sourceName: "",
      platformName: "",
      productName: "",
      shopName: "",
      shopFormVisible: false,
      searchLoading: false,
      logVisible: false,
      searchDialogVisible: false,
      batchSearchObj: {
        searchVal: "",
        errorIsShow: true,
        batchSearchLoading: false,
        failList: []
      },
      successList: [],
      tooltipVal: "",
      shopForm: {
        company_id: "",
        shop_ids: []
      },
      shopFormLoading: false,
      rules: {
        company_id: [
          {
            required: true,
            message: "请输入公司名称",
            trigger: "blur"
          }
        ]
      },
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
      shopNameList: [],
      freezeShopVisible: false,
      freezeShopId: "",
      shopActVisible: false,
      topTitle: "",
      resetPwdVisible: false,
      shop_name: "",
      typeData: [],
      companyName: ""
    };
  },
  props: {},
  watch: {
    dataList: {
      immediate: true,
      deep: true,
      handler(val) {
        this.iterationTable(val);
      }
    }
  },
  activated() {
    this.getList();
    this.getDefaultData();
  },
  created() {
    this.initCondition();
  },
  // created() {
  //   this.getList();
  //   this.getDefaultData();
  // },
  methods: {
    // 换榜公司
    submit() {
      this.shopFormLoading = true;
      this.$refs.shopForm.validate(valid => {
        if (valid) {
          changeShopCompany(this.shopForm)
            .then(res => {
              if (res.code == 0) {
                this.$message.success("操作成功");
                this.shopFormLoading = false;
                this.shopFormHiddlen();
                this.getList();
                this.shopForm.shop_ids = [];
                this.shopNameList = [];
              }
            })
            .catch(err => {
              this.shopFormLoading = false;
            });
        } else {
          this.shopFormLoading = false;
          return false;
        }
      });
    },
    // 获取选中的表格中的每一行客户数据
    getSelectTable(val) {
      this.shopForm.shop_ids = [];
      if (val.checked) {
        this.shopNameList = [...this.shopNameList, val];
      } else {
        const index = this.shopNameList.findIndex(v => {
          return v.id == val.id;
        });
        if (index > -1) {
          this.shopNameList.splice(index, 1);
        }
      }
      this.shopForm.shop_ids = this.shopNameList.map(item => item.id);
    },
    getSelectTableAll() {
      this.dataList.forEach(v => {
        const index = this.shopNameList.findIndex(element => {
          return v.id == element.id;
        });
        if (index > -1) {
          v.checked = false;
          this.shopNameList.splice(index, 1);
        }
      });
    },
    iterationTable(rows = []) {
      this.$nextTick(() => {
        rows.forEach(row => {
          this.$refs["tableChild"].toggleRowSelect(row, row.checked);
        });
      });
    },
    // 表格复选框可选择
    isSelection(row, index) {
      if (row.is_del == 1) {
        return false; // 禁用
      } else {
        return true; // 不禁用
      }
    },
    changeCompany() {
      this.shopFormVisible = true;
    },
    shopFormHiddlen() {
      this.shopFormVisible = false;
      this.restaurantsOptions = [];
      this.shopForm.company_id = "";
      this.$refs.shopForm.clearValidate("company_id");
    },
    // 详情页
    toDetails({ id }) {
      this.$router.push({
        path: "/index/leadManagement/shopListReview",
        query: { id }
      });
    },
    // 批量搜索
    batchSearchShow() {
      this.search.search_words = "";
      this.batchSearchObj.searchVal = "";
      this.searchDialogVisible = true;
    },
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
        multi_search_words: arr
      };
      listMultiSearch(params).then(res => {
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
    // 清空批量搜索的数据
    clerarBatchSearch() {
      this.batchSearchObj.errorIsShow = true;
    },
    // 唤起冻结店铺操作弹窗
    isFreezeShop({ id }) {
      this.freezeShopId = id;
      this.freezeShopVisible = true;
      // this.$confirm(
      //   " 确认冻结此店铺吗？冻结后此店铺将无法再登陆店铺后台，也无法再解冻店铺",
      //   "提示",
      //   {
      //     confirmButtonText: "确定",
      //     cancelButtonText: "取消",
      //     type: "warning",
      //   }
      // ).then(() => {
      //   shopFreeze({
      //     shop_id: id,
      //     is_del: 1,
      //   }).then((res) => {
      //     if (res.code == 0) {
      //       this.$message({
      //         type: "success",
      //         message: "操作成功!",
      //       });
      //       this.getList();
      //     }
      //   });
      // });
    },
    // 日志
    dialogShow({ id }) {
      this.logData.logSearch.search_id = id;
      this.getLogData();
      this.logVisible = true;
    },
    // 获取日志信息
    getLogData() {
      operatingLog(this.logData.logSearch).then(res => {
        let { list, count } = res.data;
        this.logData.pagination.total = count;
        this.logData.dataList = list;
      });
    },
    initCondition() {
      // 如果输入框中输入搜索内容后就清空批量搜索的数组参数
      if (this.search.search_words) {
        this.successList = [];
        this.tooltipVal = "";
      }
      this.shopNameList = [];
      this.search.page = 1;
    },
    init() {
      this.initCondition();
      this.getList();
    },
    // 获取筛选公司
    remoteMethod(query) {
      if (query !== "") {
        this.searchLoading = true;
        setTimeout(() => {
          companySearchByWords({
            page: 1,
            page_size: 500,
            status: "valid",
            search_words: query
          }).then(res => {
            this.restaurantsOptions = res.data.list;
            this.searchLoading = false;
          });
        }, 200);
      } else {
        this.restaurantsOptions = [];
      }
    },
    clear() {
      this.successList = [];
      this.tooltipVal = "";
      this.search = this.$options.data().search;
      this.init();
    },
    deleCondition(key) {
      if (key == "company_type") {
        this.search[key] = [];
      } else {
        this.search[key] = "";
      }
      this.init();
    },
    // 获取表格数据
    getList() {
      this.loading = true;
      this.search.multi_search_words = this.search.search_words
        ? []
        : this.successList;
      let listPro = new Promise((resolve, reject) => {
        shopListData(this.search)
          .then(res => {
            let { list } = res.data;
            resolve(list);
          })
          .catch(err => {
            reject(err);
          });
      });

      let countPro = new Promise((resolve, reject) => {
        listCount(this.search)
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
          this.completeData(result);
        })
        .catch(err => {
          this.loading = false;
        });
    },
    completeData([list, count]) {
      list.forEach(element => {
        this.$set(element, "checked", false);
        const row = this.shopNameList.find(v => {
          return v.id == element.id;
        });
        if (row) {
          this.$set(element, "checked", true);
        }
      });
      this.loading = false;
      this.dataList = list;
      this.pagination.total = count;
    },
    // 获取默认数据
    getDefaultData() {
      platformProductList({}).then(res => {
        // console.log(res);
        this.platformData = res.data;
      });
      companyTypeList().then(res => {
        this.typeData = res.data.list;
      });
    },
    changeStatus(value, data, key, label) {
      let arr = [];
      for (let val of data) {
        if (Object.prototype.toString.call(value) == "[object Array]") {
          if (value.indexOf(val[label]) == -1) {
            continue;
          } else {
            arr.push(val.name);
          }

          console.log(arr);
        } else {
          if (value !== val[label]) {
            continue;
          } else {
            arr.push(val.name);
          }
        }
      }
      this[key] = arr.join(",");
    },
    addShop() {
      this.shopActVisible = true;
      this.topTitle = "新增店铺";
    },
    handleCommand(command, row) {
      if (command == "resetPwd") {
        this.resetPassword(row);
      }
    },
    resetPassword({ name }) {
      this.shop_name = name;
      this.resetPwdVisible = true;
    }
  },
  computed: {
    ...mapGetters(["platform"])
  }
};
</script>

<style scoped lang="scss">
.shopManagement-contaniner {
  position: relative;
  .actBtn {
    position: absolute;
    right: 0;
    top: 0px;
  }
}
.tips {
  margin: 0px 0 16px;
  padding: 0 16px;
  span {
    color: #8996a3;
    margin-right: 16px;
    em {
      color: rgb(73, 147, 250);
      margin: 0 3px;
    }
  }
  .el-button {
    height: 36px;
    line-height: 36px;
    padding-top: 0;
    padding-bottom: 0;
    background-color: #f5f5f5;
  }
}
.el-select-dropdown {
  max-width: 602px;
}
</style>
