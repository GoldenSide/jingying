<!---*
* @description 
* @fileName companyList.vue (客户线索池)
* @author 龙伟
* @date 2020/11/02 14:26:20
*--->
<template>
  <div class="companyList-contaniner">
    <div class="titleTop">
      <contHeader :titleText="$route.meta.title" />
      <el-button type="primary" @click="openAssociation">客户关联</el-button>
    </div>
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
        <template :slot="elpopoverArr[1].slotName">
          <el-radio-group
            v-model="search.level_id"
            @change="
              (val) =>
                changeStatus(val, allLevelsType, 'allLevelsTypeName', 'id')
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
              (val) => changeStatus(val, assignType, 'assignTypeName', 'value')
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
          <el-radio-group
            v-model="search.tag_id"
            @change="
              (val) => checkStatus(val, allTagsType, 'allTagsTypeName', 'id')
            "
          >
            <el-radio
              style="padding: 5px 0"
              v-for="(item, index) in allTagsType"
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
            v-if="search.tag_id"
            @close="deleCondition('tag_id')"
            style="margin-right: 10px"
            >全部标签 {{ allTagsTypeName }}</el-tag
          >
        </template>
      </searchComponent>
      <div class="tips">
        <span
          >已选中<em>{{ selectTableData.length }}</em
          >项</span
        >
        <el-popover
          placement="bottom"
          style="padding: 0"
          width="108"
          v-model="assignment_visible"
          @show="isRotate = true"
          @hide="isRotate = false"
        >
          <el-radio-group v-model="assignment_value">
            <el-radio
              @change="getAssignmentType(item.value)"
              style="padding: 5px 0"
              v-for="(item, index) in assignment_type"
              :key="index"
              :label="item.value"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
          <el-button slot="reference">
            客户分配
            <i
              class="el-icon-caret-bottom"
              :style="
                isRotate == true
                  ? 'transition: transform 0.2s linear 0s;transform: rotate(-180deg);'
                  : 'transition: transform 0.2s linear 0s;'
              "
            ></i>
          </el-button>
        </el-popover>
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
          :selectionShow="selectionShow"
          height="calc(100vh - 420px)"
          :pageAct="getList"
          :tabelSelectOne="getSelectTable"
          :tabelSelectAll="getSelectTableAll"
        />
      </div>
    </div>
    <!-- 客户关联 -->
    <customerAssMenu
      v-if="customerAssVisible"
      :customerAssVisible.sync="customerAssVisible"
    />
    <!-- 客户分配 -->
    <assginMenu
      v-if="assignVisible"
      :assignVisible="assignVisible"
      :assignObj="assignObj"
      @assignmentValue="changeAssignmentValue"
    />
    <!-- 客户已分配后提示 -->
    <el-dialog
      title="提示"
      :visible.sync="assignTableVisible"
      :before-close="cancelPrompt"
      :close-on-click-modal="false"
      width="634px"
    >
      <div class="prompt-content">
        <div class="prompt-title">
          <i class="el-icon-warning"></i>
          <div class="text">
            <p>以下客户已分配{{ assignObj.title }}，是否继续？</p>
            <span>继续分配将视为修改分配员工</span>
          </div>
        </div>
        <div class="prompt-table">
          <tableComponent
            :column="promptColumn"
            :tableData="promptData"
            height="230"
          />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="cancelPrompt">取 消</el-button>
        <el-button size="medium" type="primary" @click="changePrompt"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 标签详情 -->
    <tagNameMenu
      :tagNameVisible.sync="tagNameVisible"
      v-if="tagNameVisible"
      :tagNameData="tagNameData"
    />
    <!-- 操作日志 -->
    <logMenu
      :logVisible.sync="logVisible"
      v-if="logVisible"
      :logData="logData"
      :getLogData="getLogData"
    />
    <!-- 修改公司类型 -->
    <el-dialog
      title="修改公司类型"
      :visible.sync="dialogSelectVisible"
      width="634px"
      :close-on-click-modal="false"
    >
      <el-select
        v-model="companyTypeVal.company_type"
        placeholder="请选择"
        style="width: 100%; margin: 34px 0"
      >
        <el-option
          v-for="item in typeData"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSelectVisible = false" size="medium"
          >取 消</el-button
        >
        <el-button type="primary" size="medium" @click="changeTypeData"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 修改用户级别 -->
    <el-dialog
      :title="levelsType.title"
      :visible.sync="dialogLevelsVisible"
      :close-on-click-modal="false"
      width="634px"
    >
      <el-select
        v-model="levelsType.level_id"
        placeholder="请选择"
        style="width: 100%; margin: 34px 0"
      >
        <el-option
          v-for="item in allLevelsType"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogLevelsVisible = false" size="medium"
          >取 消</el-button
        >
        <el-button type="primary" size="medium" @click="changeAllLevelsType"
          >确 定</el-button
        >
      </div>
    </el-dialog>
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
    <!-- 停用/启用企业中心弹窗 -->
    <el-dialog
      :title="deactivateTxt"
      :visible.sync="deactivateVisible"
      :close-on-click-modal="false"
      :before-close="deactivateInfo"
      width="634px"
    >
      <div class="deactivate-content">
        <div style="display: flex; align-items: center">
          <i
            class="el-icon-warning"
            style="color: #e6a23c; margin-right: 10px; font-size: 24px"
          ></i>
          <p style="line-height: 1.5">{{ deactivateContent }}</p>
        </div>
        <div style="margin-top: 16px; display: flex" v-if="isDeactivateShow">
          <span style="width: 48px">原因：</span>
          <el-input
            type="textarea"
            placeholder="最多支持输入100字，超出不可输入"
            v-model="deactivateReason"
            maxlength="100"
            show-word-limit
            :autosize="true"
            resize="none"
          >
          </el-input>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="deactivateInfo"
          :disabled="deactivateLoading"
          size="medium"
          >取 消</el-button
        >
        <el-button
          type="primary"
          size="medium"
          :loading="deactivateLoading"
          @click="changeDeactivate"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { companyTypeList, listMultiSearch } from "@/api/common";
import customerAssMenu from "./components/customerAss";
import tagNameMenu from "../components/tagName";
import assginMenu from "./components/assign";
import batchSearchMenu from "@/components/search/batchSearch";
import {
  companyListAll,
  getAssignTypeData,
  levelListAll,
  changeType,
  levelRelation,
  levelRelationEdit,
  resetCompanyPassword,
  changeCompanyStatus,
  tagRemoveSomeRelation,
  checkAssignFollow,
  operatingLog,
  listCount,
  quitAssign
} from "@/api/leadManagement/companyList";
import { mapGetters } from "vuex";
export default {
  name: "companyList",
  components: { tagNameMenu, customerAssMenu, assginMenu, batchSearchMenu },
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
        tag_id: "",
        create_time_range: []
      },
      btnConfig: [
        { text: "搜索", icon: "search", type: "primary", cb: "init" },
        { text: "清空", icon: "clear", type: "default", cb: "clear" }
      ],
      dateConfig: [
        {
          label: "时间筛选",
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
          btnText: "全部标签",
          slotName: "all_tags",
          key: "tag_id",
          width: 265,
          bool: false,
          isShow: function(bool) {
            return bool;
          }
        }
      ],
      searchTypeArr: [
        {
          value: "1",
          text: "公司名称"
        },
        {
          value: "2",
          text: "公司邮箱"
        },
        {
          value: "28",
          text: "售后/售前姓名"
        }
      ],
      pagination: {
        total: 0
      },
      dataList: [],
      loading: false,
      selectionShow: true,
      column: [
        {
          prop: "tag_name",
          label: "客户关联标签",
          fixed: "left",
          width: 130,
          render: ({ h, row }) => {
            return (
              <span
                style="color:#4993fa;cursor:pointer"
                onClick={() => this.viewTagNameList(row)}
              >
                {row.tag_name}
              </span>
            );
          }
        },
        {
          prop: "company_id",
          label: "公司ID",
          width: 150
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
          prop: "yunz_email",
          label: "联系邮箱",
          width: 200
        },
        {
          prop: "company_type_text",
          label: "公司类型",
          width: 100,
          render: ({ h, row }) => {
            return (
              <span
                style="color:#4993fa;cursor:pointer"
                onClick={() => this.handlerClick(row)}
              >
                {row.company_type_text}
              </span>
            );
          }
        },
        {
          prop: "contact_person",
          label: "联系人",
          width: 100
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
            return (
              <span
                style="color:#4993fa;cursor:pointer"
                onClick={() => this.setupLevelName(row)}
              >
                {row.level_name ? row.level_name : "设置级别"}
              </span>
            );
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
          prop: "create_type_str",
          label: "创建方式"
        },
        {
          prop: "",
          label: "操作",
          fixed: "right",
          width: 180,
          render: ({ h, row }) => {
            return h("div", [
              h(
                "el-link",
                {
                  props: {
                    type: "primary"
                  },
                  on: {
                    click: () => {
                      this.iteminfo(row);
                    }
                  }
                },
                "查看"
              ),
              h(
                "el-link",
                {
                  props: {
                    type: "primary"
                  },
                  on: {
                    click: () => {
                      this.editCompany(row);
                    }
                  }
                },
                "编辑"
              ),
              h(
                "el-link",
                {
                  props: {
                    type: "primary"
                  },
                  on: {
                    click: () => {
                      this.dialogShow(row);
                    }
                  }
                },
                "日志"
              ),
              this.platform == "XShoppy" &&
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
                              command: "resetPassword"
                            }
                          },
                          "重置密码"
                        ),
                        h(
                          "el-dropdown-item",
                          {
                            props: {
                              command: "deactivate"
                            }
                          },
                          row.status === "1" ? "启用企业中心" : "停用企业中心"
                        ),
                        row.tag_name &&
                          h(
                            "el-dropdown-item",
                            {
                              props: {
                                command: "dismissItem"
                              }
                            },
                            "从关联中解除"
                          ),
                        h(
                          "el-dropdown-item",
                          {
                            props: {
                              command: "toDiscount"
                            }
                          },
                          "优惠信息"
                        )
                      ]
                    )
                  ]
                )
            ]);
          }
        }
      ],
      typeData: [],
      companyName: "",
      allLevelsTypeName: "",
      assignTypeName: "",
      allTagsTypeName: "",
      tableLayout: "center",
      logVisible: false,
      dialogSelectVisible: false,
      companyTypeSel: "",
      companyTypeVal: {
        id: "",
        company_type: ""
      },
      dialogLevelsVisible: false,
      levelsType: {
        title: "",
        level_id: "",
        company_id: "",
        company_level_relationship_id: ""
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
      assignment_visible: false,
      assignment_value: "",
      assignment_type: [
        {
          value: "1",
          label: "售前"
        },
        {
          value: "2",
          label: "售后"
        },
        {
          value: "3",
          label: "取消分配"
        }
      ],
      allTagsType: [],
      allLevelsType: [],
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
      tagNameVisible: false,
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
      customerAssVisible: false,
      selectTableData: [],
      assignVisible: false,
      assignObj: {
        title: "",
        type: "",
        dataId: [],
        dataName: []
      },
      isRotate: false,
      assignTableVisible: false,
      promptData: [],
      promptColumn: [
        {
          prop: "company_name",
          label: "客户名称"
        },
        {
          prop: "operator",
          label: "分配员工"
        }
      ],
      tooltipVal: "",
      searchDialogVisible: false,
      batchSearchObj: {
        searchVal: "",
        errorIsShow: true,
        batchSearchLoading: false,
        failList: []
      },
      successList: [],
      deactivateTxt: "",
      deactivateReason: "",
      deactivateVisible: false,
      deactivateContent: "",
      deactivateId: "",
      deactivateStatus: "",
      deactivateLoading: false,
      isDeactivateShow: true
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
  activated() {
    this.getSearcType();
    this.initResource();
    this.getList();
  },
  created() {
    this.initCondition();
  },
  // created() {
  //   this.getSearcType();
  //   this.initResource();
  //   this.init();
  // },
  mounted() {},
  methods: {
    // 停用/启用企业
    changeDeactivate() {
      this.deactivateLoading = true;
      if (this.deactivateStatus == 0) {
        this.deactivateStatus = 1;
        this.deactivateTxt = "停用企业";
        this.deactivateContent =
          "停用后该企业中心无法登陆，企业下所有店铺无法登陆，前端页面无法访问。企业、店铺数据将会保留，您也可以重新激活使用。";
      } else {
        this.deactivateStatus = 0;
        this.deactivateTxt = "启用企业";
        this.deactivateContent =
          "启用后该企业中心可以正常登陆，企业下所有店铺和前端页面恢复正常。";
      }
      changeCompanyStatus({
        company_id: this.deactivateId,
        status: this.deactivateStatus,
        stop_company_center_reason: this.deactivateReason
      })
        .then(res => {
          // console.log(res);
          if (res.code == 0) {
            this.deactivateInfo();
            this.deactivateLoading = false;
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.getList();
          }
        })
        .catch(err => {
          this.deactivateLoading = false;
        });
    },
    deactivateInfo() {
      this.deactivateVisible = false;
      this.deactivateId = "";
      this.deactivateStatus = "";
      this.deactivateReason = "";
    },
    // 获取选中的表格中的每一行客户数据
    getSelectTable(val) {
      // this.selectTableNum = val.length;
      // this.selectTableData = val;
      // this.assignObj.assignObj = [];
      // this.assignObj.dataName = [];
      if (val.checked) {
        this.selectTableData = [...this.selectTableData, val];
      } else {
        const index = this.selectTableData.findIndex(v => {
          return v.company_id == val.company_id;
        });
        if (index > -1) {
          this.selectTableData.splice(index, 1);
        }
      }
      // console.log(this.selectTableData);
      this.assignObj.assignObj = [];
      this.assignObj.dataName = [];
    },
    getSelectTableAll() {
      this.dataList.forEach(v => {
        const index = this.selectTableData.findIndex(element => {
          return v.company_id == element.company_id;
        });
        if (index > -1) {
          v.checked = false;
          this.selectTableData.splice(index, 1);
        }
      });
    },
    // 当公司状态禁用情况下禁用勾选操作
    // isSelection(row, index) {
    //   if (row.status == 1) {
    //     return false; // 禁用
    //   } else {
    //     return true; // 不禁用
    //   }
    // },
    // 客户分配
    getAssignmentType(assign_type) {
      if (!this.selectTableData.length > 0) {
        this.$message.error("请先选择要操作的客户");
        this.assignment_value = "";
        return;
      }
      if (assign_type !== "3") {
        this.assignObj.title = assign_type == "1" ? "售前" : "售后";
        let company_ids = [];
        this.selectTableData.forEach((item, index) => {
          company_ids.push(item.company_id);
          this.assignObj.dataName.push(item.company_name);
        });
        this.assignObj.dataId = company_ids;
        this.assignObj.type = assign_type;
        // 判断已选中的公司是否被关联
        checkAssignFollow({
          assign_type,
          company_ids
        }).then(res => {
          // console.log(res);
          if (res.data.length) {
            this.promptData = res.data;
            this.assignTableVisible = true;
          } else {
            this.assignVisible = true;
          }
        });
      } else {
        this.utils.deleConfig(
          this,
          "请确认需要取消分配的客户无误后，点击确定",
          "取消分配",
          ["确定", "取消"],
          this.quitAct(),
          "warning",
          this.close()
        );
      }
    },
    quitAct() {
      return () => {
        let company_ids = this.selectTableData.map(v => v.company_id);
        quitAssign({ company_ids })
          .then(res => {
            this.selectTableData = [];
            this.assignment_value = "";
            this.$message.success("取消分配成功");
            this.init();
          })
          .catch(err => {
            this.assignment_value = "";
          });
      };
    },
    close() {
      return () => {
        this.assignment_value = "";
      };
    },
    // 若是已有分配对象是否继续分配
    changePrompt() {
      this.assignTableVisible = false;
      this.assignVisible = true;
      // this.assignObj = {};
    },
    cancelPrompt() {
      this.assignTableVisible = false;
      this.assignment_value = "";
      this.assignObj.dataName = [];
      this.assignObj.dataId = [];
    },
    changeAssignmentValue(data) {
      let vObj = JSON.parse(data);
      this.assignVisible = vObj.assignVisible;
      this.assignment_value = vObj.assignmentValue;
    },
    // 客户关联
    openAssociation() {
      this.customerAssVisible = true;
    },
    // 查看标签详情
    viewTagNameList({ tag_id }) {
      this.tagNameData.tag_id = tag_id;
      this.tagNameData.disconnect = true;
      this.tagNameVisible = true;
    },
    handleCommand(command, row) {
      if (command == "resetPassword") {
        this.resetPassword(row);
      } else if (command == "deactivate") {
        this.deactivate(row);
      } else if (command == "dismissItem") {
        this.dismissItem(row);
      } else if (command == "toDiscount") {
        this.toDiscountInfo(row);
      }
    },
    handlerClick(row) {
      this.companyTypeVal.company_type = row.company_type;
      this.companyTypeVal.id = row.company_id;
      this.dialogSelectVisible = true;
    },
    setupLevelName(row) {
      let { company_level_relationship_id, level_id, company_id } = row;
      this.levelsType.level_id = Number(level_id) ? level_id : "";
      this.levelsType.company_id = company_id;
      if (Number(level_id)) {
        this.levelsType.title = "编辑级别";
        this.levelsType.company_level_relationship_id = company_level_relationship_id;
      } else {
        this.levelsType.title = "设置级别";
      }
      this.dialogLevelsVisible = true;
    },
    // 修改级别or设置级别
    changeAllLevelsType() {
      if (this.levelsType.title == "设置级别") {
        if (this.levelsType.level_id == "") {
          this.$message.error("请选择客户级别");
          return;
        }
        levelRelation(this.levelsType).then(res => {
          if (res.code == 0) {
            this.$message.success("操作成功");
            this.dialogLevelsVisible = false;
            this.getList();
          }
        });
      } else {
        levelRelationEdit(this.levelsType).then(res => {
          if (res.code == 0) {
            this.$message.success("操作成功");
            this.dialogLevelsVisible = false;
            this.getList();
          }
        });
      }
    },
    // 改变公司类型
    changeTypeData() {
      changeType(this.companyTypeVal).then(res => {
        if (res.code == 0) {
          this.dialogSelectVisible = false;
          this.$message({
            message: "修改公司类型成功",
            type: "success"
          });
          this.getList();
        }
      });
    },
    initResource() {
      return new Promise((resolve, reject) => {
        companyTypeList().then(res => {
          this.typeData = res.data.list;
          resolve();
        });
      });
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
    deleCondition(key) {
      if (key == "company_type") {
        this.search[key] = [];
      } else {
        this.search[key] = "";
      }
      this.init();
    },
    initCondition() {
      // 如果输入框中输入搜索内容后就清空批量搜索的数组参数
      if (this.search.search_words) {
        this.successList = [];
        this.tooltipVal = "";
      }
      this.selectTableData = [];
      this.search.page = 1;
    },

    init() {
      this.initCondition();
      this.getList();
    },
    clear() {
      this.successList = [];
      this.tooltipVal = "";
      this.search = this.$options.data().search;
      this.init();
    },
    // 批量搜索
    batchSearchShow() {
      this.search.search_words = "";
      this.batchSearchObj.searchVal = "";
      this.searchDialogVisible = true;
    },
    // 验证批量搜索参数合法
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
    // 获取表格数据
    getList() {
      this.loading = true;
      this.search.multi_search_words = this.search.search_words
        ? []
        : this.successList;
      this.dataList = [];
      let listPro = new Promise((resolve, reject) => {
        companyListAll(this.search)
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
        const row = this.selectTableData.find(v => {
          return v.company_id == element.company_id;
        });
        if (row) {
          this.$set(element, "checked", true);
        }
      });
      this.dataList = list;
      this.pagination.total = count;
      this.loading = false;
    },
    iterationTable(rows = []) {
      this.$nextTick(() => {
        rows.forEach(row => {
          this.$refs["tableChild"].toggleRowSelect(row, row.checked);
        });
      });
    },
    // 获取筛选类型数据
    getSearcType() {
      // 获取标签类型
      getAssignTypeData({
        page: 1,
        page_size: 1000
      }).then(res => {
        this.allTagsType = res.data.list;
      });
      // 级别
      levelListAll({
        page: 1,
        page_size: 1000
      }).then(res => {
        this.allLevelsType = res.data.list;
      });
    },
    // 跳转公司详情
    iteminfo({ company_id }) {
      let routeUrl = this.$router.resolve({
        path: "/index/leadManagement/companyInfo",
        query: { id: company_id }
      });
      window.open(routeUrl.href, "_blank");
      // this.$router.push({
      //   path: "/index/leadManagement/companyInfo",
      //   query: { id: company_id }
      // });
    },
    // 进入优惠信息
    toDiscountInfo({ company_id }) {
      let search = {};
      search.search_id = "4";
      search.search_words = company_id;
      this.$router.push({
        path: "/index/bankCount/discountAppList",
        query: search
      });
    },

    // 重置密码
    resetPassword({ status_text, company_id }) {
      if (!status_text == "启用") {
        this.$alert("无法重置密码，请先启用企业后重试", "提示", {});
        return;
      }
      resetCompanyPassword({ company_id }).then(res => {
        if (res.code == 0) {
          this.$message({
            message: "密码重置成功，重置后的密码已发送至邮箱",
            type: "success"
          });
        }
      });
    },
    // 停用企业中心
    deactivate({ company_id, status }) {
      // this.changeDeactivate(company_id, status)
      this.deactivateId = company_id;
      this.deactivateStatus = status;
      if (status == 0) {
        this.isDeactivateShow = true;
        this.deactivateTxt = "停用企业";
        this.deactivateContent =
          "停用后该企业中心无法登陆，企业下所有店铺无法登陆，前端页面无法访问。企业、店铺数据将会保留，您也可以重新激活使用。";
      } else {
        this.isDeactivateShow = false;
        this.deactivateTxt = "启用企业";
        this.deactivateContent =
          "启用后该企业中心可以正常登陆，企业下所有店铺和前端页面恢复正常。";
      }
      this.deactivateVisible = true;
    },
    // 日志显示
    dialogShow({ company_id }) {
      this.logData.logSearch.search_id = company_id;
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
    // 解除关联
    dismissItem({ tag_id, company_id, company_name, tag_name }) {
      this.$confirm(
        `"${company_name}" 将从 "${tag_name}" 中解除关联，确认吗？`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        tagRemoveSomeRelation({
          id: tag_id,
          company_ids: company_id
        }).then(res => {
          if (res.code == 0) {
            this.getList();
            this.getSearcType();
            setTimeout(() => {
              this.$message.success("解除关联成功");
            }, 500);
          }
        });
      });
    },
    // 进入编辑页
    editCompany({ company_id }) {
      this.$router.push({
        path: "/index/leadManagement/editModify",
        query: {
          id: company_id
        }
      });
    }
  },
  computed: {
    ...mapGetters(["platform"])
  }
};
</script>

<style lang="scss" scoped>
.companyList-contaniner {
  position: relative;
  .titleTop {
    display: flex;
    justify-content: space-between;
    .el-button {
      position: absolute;
      right: 0;
      top: 0px;
    }
  }
  .tips,
  .titleTop {
    .el-button {
      height: 36px;
      line-height: 36px;
      padding-top: 0;
      padding-bottom: 0;
    }
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
    background-color: #f5f5f5;
  }
}
.el-popover {
  .el-radio-group {
    .el-radio {
      display: block;
    }
  }
}
.prompt-content {
  .prompt-title {
    display: flex;
    padding: 0 0 16px;
    border-bottom: 1px solid #dfe3e8;
    & > i {
      font-size: 20px;
      color: #e6a23c;
      margin-right: 16px;
    }
    .text {
      p {
        font-size: 14px;
        color: #212b36;
        margin-bottom: 8px;
      }
      span {
        color: #df992f;
      }
    }
  }
  .prompt-table {
    padding-top: 16px;
  }
}
</style>
