<!---*
* @description 客户跟进列表
* @fileName list.vue
* @author 叶金龙&&龙伟(data:2020/11/23 18:40)
* @date 2020/11/16 10:39:43
*--->
<template>
  <div class="folowUp-container">
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
        <!-- 批量搜索 -->
        <template slot="multipleSearch">
          <el-tooltip placement="bottom" :disabled="!tooltipVal">
            <div slot="content" v-html="tooltipVal"></div>
            <el-button @click.stop="batchSearchShow">批量搜索</el-button>
          </el-tooltip>
        </template>
        <template :slot="elpopoverArr[0].slotName">
          <el-checkbox-group
            v-model="search.company_type"
            @change="(val) => checkStatus(val, selectType, 'companyName', 'id')"
          >
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
        <template :slot="elpopoverArr[1].slotName">
          <el-radio-group
            v-model="search.level_id"
            @change="
              (val) =>
                checkStatus(val, allLevelsType, 'allLevelsTypeName', 'id')
            "
          >
            <el-radio
              style="padding: 5px 0"
              v-for="(item, index) in allLevelsType"
              :key="index"
              :label="item.id"
              >{{ item.name }}</el-radio
            >
          </el-radio-group>
        </template>
        <template :slot="elpopoverArr[2].slotName">
          <el-radio-group
            v-model="search.assign_type"
            @change="
              (val) => checkStatus(val, assignType, 'assignTypeName', 'value')
            "
          >
            <el-radio
              style="padding: 5px 0"
              v-for="(item, index) in assignType"
              :key="index"
              :label="item.value"
              >{{ item.name }}</el-radio
            >
          </el-radio-group>
        </template>
        <template :slot="elpopoverArr[3].slotName">
          <!-- <el-radio-group
            v-model="search.tag_id"
            @change="
              (val) => checkStatus(val, allMark, 'allTagsTypeName', 'id')
            "
          >
            <el-radio
              style="padding: 5px 0"
              v-for="(item, index) in allMark"
              :key="index"
              :label="item.id"
              >{{ item.mark_name }}</el-radio
            >
          </el-radio-group> -->
          <el-checkbox-group
            v-model="search.mark_ids"
            @change="
              (val) => checkStatus(val, allMark, 'allTagsTypeName', 'id')
            "
          >
            <el-checkbox
              v-for="(item, index) in allMark"
              :key="index"
              :label="item.id"
              >{{ item.mark_name }}</el-checkbox
            >
          </el-checkbox-group>
          <span class="clear-checkbox" @click="deleCondition('mark_ids')"
            >清除</span
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
        <template>
          <el-tag
            closable
            v-if="search.level_id.length > 0"
            @close="deleCondition('level_id')"
            style="margin-right: 10px"
            >全部级别： {{ allLevelsTypeName }}</el-tag
          >
        </template>
        <template>
          <el-tag
            closable
            v-if="search.assign_type.length > 0"
            @close="deleCondition('assign_type')"
            style="margin-right: 10px"
            >分配情况 {{ assignTypeName }}</el-tag
          >
        </template>
        <template>
          <el-tag
            closable
            v-if="search.mark_ids.length > 0"
            @close="deleCondition('mark_ids')"
            style="margin-right: 10px"
            >全部标记 {{ allTagsTypeName }}</el-tag
          >
        </template>
      </searchComponent>
      <div class="batchActBox">
        <div class="seletSumBox">
          <span>
            已选<i>{{ constructIds(this.selectArr).length }}</i
            >项
          </span>
          <el-button
            size="medium"
            @click="addAct"
            :disabled="this.selectArr.length <= 0"
            >添加标记</el-button
          >
          <el-button
            size="medium"
            @click="cancelAct"
            :disabled="this.selectArr.length <= 0"
            >取消标记</el-button
          >
        </div>
      </div>
      <div class="list-content folowUp-content">
        <tableComponent
          ref="tableChild"
          :column="column"
          :tableData="dataList"
          :page.sync="search.page"
          :page_size.sync="search.page_size"
          :total.sync="pagination.total"
          :loading.sync="loading"
          height="calc(100vh - 385px)"
          :pageAct="getList"
          :selectionShow="true"
          :tabelSelectOne="getSelectTable"
          :tabelSelectAll="getSelectTableAll"
        />
      </div>
    </div>
    <!-- 跟进记录 -->
    <recordMenu
      :recordVisible.sync="recordVisible"
      v-if="recordVisible"
      :recordID="recordID"
    />
    <!-- 标签详情 -->
    <tagNameMenu
      :tagNameVisible.sync="tagNameVisible"
      v-if="tagNameVisible"
      :tagNameData="tagNameData"
    />
    <servicesSet
      v-if="servicesVisible"
      :servicesVisible.sync="servicesVisible"
      :dataObj="dataObj"
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
    <addMark
      v-if="addMarkVisible"
      :addMarkVisible.sync="addMarkVisible"
      :init="init"
      :getMark="getMark"
      :company_ids="constructIds(this.selectArr)"
    />
  </div>
</template>

<script>
import { companyTypeList, listMultiSearch } from "@/api/common";
import {
  getAssignTypeData,
  levelListAll
} from "@/api/leadManagement/companyList";
import {
  followListAll,
  getmarkList,
  unbindMark,
  followListCount
} from "@/api/leadManagement/followUp";
import recordMenu from "./components/record";
import tagNameMenu from "../components/tagName";
import servicesSet from "./components/servicesSet";
import batchSearchMenu from "@/components/search/batchSearch";
import addMark from "./components/addmark";
export default {
  name: "followUp",
  components: {
    recordMenu,
    tagNameMenu,
    servicesSet,
    batchSearchMenu,
    addMark
  },
  data() {
    return {
      search: {
        page: 1,
        page_size: 15,
        search_id: "1",
        search_words: "",
        multi_search_words: [],
        company_type: [],
        level_id: "",
        assign_type: "",
        // tag_id: "",
        mark_ids: [],
        // is_test:1,
        create_time_range: []
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
          text: "公司名称"
        },
        {
          value: "2",
          text: "公司邮箱"
        }
      ],
      dateConfig: [
        {
          label: "注册时间",
          key: "create_time_range",
          isTimeShow: false
        }
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
          btnText: "全部级别",
          slotName: "all_levels",
          key: "level_id",
          width: 150,
          bool: false,
          isShow: function(bool) {
            return bool;
          }
        },
        {
          btnText: "分配情况",
          slotName: "distribution",
          key: "distribution_type",
          width: 150,
          bool: false,
          isShow: function(bool) {
            return bool;
          }
        },
        {
          btnText: "客户标记",
          slotName: "all_marks",
          key: "mark_id",
          width: 180,
          bool: false,
          isShow: function(bool) {
            return bool;
          }
        }
      ],
      assignType: [
        {
          value: "0",
          name: "全部"
        },
        {
          value: "-1",
          name: "售前-未分配"
        },
        {
          value: "-2",
          name: "售后-未分配"
        },
        {
          value: "1",
          name: "售前-已分配"
        },
        {
          value: "2",
          name: "售后-已分配"
        }
      ],
      companyName: "",
      allLevelsTypeName: "",
      assignTypeName: "",
      allTagsTypeName: "",
      selectType: [],
      allMark: [],
      allLevelsType: [],
      loading: false,
      recordVisible: false,
      tagNameVisible: false,
      dataList: [],
      column: [
        {
          prop: "mark_name",
          label: "客户标记",
          fixed: "left",
          width: 200
        },
        {
          prop: "tag_name",
          label: "客户关联标签",
          fixed: "left",
          width: 130,
          render: ({ h, row }) => {
            return (
              <span
                style="color:#4993fa;cursor:pointer"
                onClick={() => this.getTagNameList(row)}
              >
                {row.tag_name}
              </span>
            );
          }
        },
        {
          prop: "company_id",
          label: "公司ID"
        },
        {
          prop: "company_name",
          label: "公司名称",
          width: 150
        },
        {
          prop: "email",
          label: "注册邮箱",
          width: 200
        },
        {
          prop: "company_type_text",
          label: "公司类型",
          width: 100
        },
        {
          prop: "contact_person",
          label: "联系人"
        },
        {
          prop: "phone",
          label: "手机号",
          width: 150
        },
        {
          prop: "shop_num",
          label: "授权店铺数"
        },
        {
          prop: "server_text",
          label: "开通服务",
          width: 200,
          render: ({ h, row }) => {
            let strArr = [];
            for (let key in row.server_text) {
              if (row.server_text[key].length > 0) {
                strArr.push(key + "(" + row.server_text[key].toString() + ")");
              } else {
                strArr.push(key);
              }
            }
            return <span>{strArr.join("|") || "未开通任何服务"}</span>;
          }
        },
        {
          prop: "level_name",
          label: "客户级别",
          render: ({ h, row }) => {
            return <span>{row.level_name ? row.level_name : "设置级别"}</span>;
          }
        },
        {
          prop: "status_text",
          label: "公司状态",
          render: ({ h, row }) => {
            let backgroundColor = "#FFC48B";
            if (row.status_text == "启用") {
              backgroundColor = "#BBE5B3";
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
                innerHTML: row.status_text
              }
            });
          }
        },
        {
          prop: "assign_pre_sale_name",
          label: "售前",
          render: ({ h, row }) => {
            let text = "未分配";
            if (row.assign_pre_sale_name) {
              text = row.assign_pre_sale_name;
            }
            return h("div", {
              domProps: {
                innerHTML: text
              }
            });
          }
        },
        {
          prop: "assign_after_sale_name",
          label: "售后",
          render: ({ h, row }) => {
            let text = "未分配";
            if (row.assign_after_sale_name) {
              text = row.assign_after_sale_name;
            }
            return h("div", {
              domProps: {
                innerHTML: text
              }
            });
          }
        },
        {
          prop: "",
          label: "操作",
          fixed: "right",
          width: 250,
          render: ({ h, row }) => {
            return (
              <div>
                <el-link
                  type="primary"
                  size="default"
                  onClick={() => this.iteminfo(row)}
                  style=""
                >
                  查看
                </el-link>
                <el-link
                  type="primary"
                  size="default"
                  onClick={() => this.goRecord(row)}
                  style=""
                >
                  跟进记录
                </el-link>
                <el-link
                  type="primary"
                  size="default"
                  onClick={() => this.servicesMn(row)}
                  style=""
                >
                  服务管理
                </el-link>
                <el-link
                  type="primary"
                  size="default"
                  onClick={() => this.toDiscount(row)}
                  style=""
                >
                  优惠信息
                </el-link>
              </div>
            );
          }
        }
      ],
      recordID: null,
      tagNameData: {
        tag_id: null,
        disconnect: false,
        tagColumn: [
          {
            prop: "company_id",
            label: "公司ID"
          },
          {
            prop: "company_name",
            label: "公司名称"
          },
          {
            prop: "level_name",
            label: "客户级别"
          }
        ]
      },
      servicesVisible: false,
      dataObj: null,
      tooltipVal: "",
      searchDialogVisible: false,
      batchSearchObj: {
        searchVal: "",
        errorIsShow: true,
        batchSearchLoading: false,
        failList: []
      },
      successList: [],
      addMarkVisible: false,
      selectArr: []
    };
  },
  props: {},
  watch: {
    dataList: {
      immediate: true,
      handler(val) {
        this.iterationTable(val);
      }
    }
  },
  // created() {
  //   this.initresource();
  // },
  activated() {
    this.initresource();
  },
  methods: {
    initresource() {
      companyTypeList().then(res => {
        this.selectType = res.data.list;
      });
      // 获取标签类型
      // getAssignTypeData({
      //   page: 1,
      //   page_size: 1000,
      // }).then((res) => {
      //   this.allTagsType = res.data.list;
      // });
      // 级别
      levelListAll({
        page: 1,
        page_size: 1000
      }).then(res => {
        this.allLevelsType = res.data.list;
      });

      // 获取数据
      this.getList();
    },
    getMark() {
      getmarkList().then(res => {
        let { data } = res;
        data.forEach(v => this.$set(v, "name", v.mark_name));
        this.allMark = data;
      });
    },
    // 获取表格数据
    getList() {
      this.getMark();
      this.loading = true;
      this.search.multi_search_words = this.search.search_words
        ? []
        : this.successList;
      let listPro = new Promise((resolve, reject) => {
        followListAll(this.search)
          .then(res => {
            let { list } = res.data;
            list.forEach(element => {
              this.$set(element, "checked", false);
              const row = this.selectArr.find(v => {
                return v.company_id == element.company_id;
              });
              if (row) {
                this.$set(element, "checked", true);
              }
            });
            resolve(list);
          })
          .catch(err => {
            reject(err);
          });
      });
      let countPro = new Promise((resolve, reject) => {
        followListCount(this.search).then(res => {
          let { count } = res.data;
          resolve(count);
        });
      });

      Promise.all([listPro, countPro])
        .then(result => {
          if (result) {
            let [list, count] = result;
            this.dataList = list;
            this.pagination.total = count;
            this.loading = false;
          }
        })
        .catch(err => {
          this.loading = false;
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
    // 关闭不合法参数的弹窗
    clerarBatchSearch() {
      this.batchSearchObj.errorIsShow = true;
    },
    // 跳转公司详情
    iteminfo({ company_id }) {
      let routeUrl = this.$router.resolve({
        path: "/index/leadManagement/companyInfo",
        query: { id: company_id }
      });
      window.open(routeUrl.href, "_blank");
    },
    // 打开跟进记录
    goRecord({ company_follow_id }) {
      this.recordVisible = true;
      this.recordID = company_follow_id;
    },
    // 进入优惠信息
    toDiscount({ company_id }) {
      let search = {};
      search.search_id = "4";
      search.search_words = company_id;
      this.$router.push({
        path: "/index/bankCount/discountAppList",
        query: { search }
      });
    },
    // 查看标签详情
    getTagNameList({ tag_id }) {
      this.tagNameVisible = true;
      this.tagNameData.tag_id = tag_id;
    },
    deleCondition(key) {
      if (key == "company_type" || key == "mark_ids") {
        this.search[key] = [];
      } else {
        this.search[key] = "";
      }
      this.init();
    },
    checkStatus(value, data, key, label) {
      let arr = [];
      for (let val of data) {
        if (Object.prototype.toString.call(value) == "[object Array]") {
          if (value.indexOf(val[label]) == -1) {
            continue;
          } else {
            arr.push(val.name);
          }
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

    init() {
      // 如果输入框中输入搜索内容后就清空批量搜索的数组参数
      if (this.search.search_words) {
        this.successList = [];
        this.tooltipVal = "";
      }
      this.selectArr = [];
      this.search.page = 1;
      this.getList();
    },
    clear() {
      this.successList = [];
      this.tooltipVal = "";
      this.search = this.$options.data().search;
      this.init();
    },

    servicesMn({ server, company_id }) {
      this.servicesVisible = true;
      this.dataObj = { server, company_id };
    },
    iterationTable(rows = []) {
      this.$nextTick(() => {
        rows.forEach(row => {
          this.$refs["tableChild"].toggleRowSelect(row, row.checked);
        });
      });
    },
    getSelectTable(val) {
      if (val.checked) {
        this.selectArr = [...this.selectArr, val];
      } else {
        const index = this.selectArr.findIndex(v => {
          return v.company_id == val.company_id;
        });
        if (index > -1) {
          this.selectArr.splice(index, 1);
        }
      }
    },
    getSelectTableAll() {
      this.dataList.forEach(v => {
        const index = this.selectArr.findIndex(element => {
          return v.company_id == element.company_id;
        });
        if (index > -1) {
          v.checked = false;
          this.selectArr.splice(index, 1);
        }
      });
    },
    addAct() {
      this.addMarkVisible = true;
    },
    cancelAct() {
      let bool = this.selectArr.some(v => v.mark_name == "");
      if (bool) {
        this.$message.warning("已选项中有未添加标记的客户,不可进行取消操作");
        return;
      } else {
        this.utils.deleConfig(
          this,
          `是否取消绑定已选客户的标记`,
          "取消标记",
          ["确定", "取消"],
          this.unbind()
        );
      }
    },
    unbind() {
      return () => {
        unbindMark({ company_ids: this.constructIds(this.selectArr) }).then(
          res => {
            this.$message.success("操作成功");
            this.init();
          }
        );
      };
    }
  },
  computed: {
    constructIds() {
      return function(arr) {
        return arr.map(v => {
          return v.company_id;
        });
      };
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
.folowUp-content {
  &.list-content {
    margin-top: 0;
  }
}
</style>
