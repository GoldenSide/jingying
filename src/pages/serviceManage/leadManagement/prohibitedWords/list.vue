<!---*
* @description 
* @fileName list.vue
* @author 龙伟
* @date 2021/01/11 11:10:46
*--->
<template>
  <div class="prohibited-contaniner">
    <contHeader :titleText="$route.meta.title" />
    <div class="exportbtn">
      <el-button type="primary" size="medium" @click="logListShow"
        >日志</el-button
      >
      <el-button
        type="primary"
        size="medium"
        :loading="exportLoading"
        @click="exportProhibited"
        >导出</el-button
      >
    </div>
    <div class="conditions-content">
      <div class="toggleBtns">
        <el-tabs v-model="activeName" @tab-click="toggleBtn">
          <el-tab-pane label="违禁词" name="1"></el-tab-pane>
          <el-tab-pane label="违禁词白名单" name="2"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="search-content">
        <el-input
          v-model="search.raw_words"
          class="search-input"
          placeholder="请输入违禁词"
          @keyup.enter.native="init"
        ></el-input>
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
      <div class="tips">
        <span
          >已选中<em>{{ selectTableData.length }}</em
          >项</span
        >
        <div class="tips-btn">
          <div v-if="search.status == '1'">
            <el-button
              :disabled="!selectTableData.length"
              @click="addTOAllowWords"
            >
              添加为白名单
            </el-button>
            <el-button @click="isAddWordsShow"> 添加违禁词 </el-button>
          </div>
          <div v-else>
            <el-button
              :disabled="!selectTableData.length"
              @click="addTOForbiddenWords"
            >
              添加至违禁词
            </el-button>
          </div>
        </div>
      </div>
      <div class="list-content">
        <tableComponent
          ref="tableChild"
          :column="column"
          :tableData="dataList"
          :page.sync="search.page"
          :page_size.sync="search.page_size"
          :total.sync="pagination.total"
          :sort_field.sync="search.sort_field"
          :sort_direction.sync="search.sort_direction"
          :loading.sync="loading"
          :selectionShow="selectionShow"
          height="calc(100vh - 420px)"
          :pageAct="getList"
          :tabelSelectOne="getSelectTable"
          :tabelSelectAll="getSelectTableAll"
        />
      </div>
    </div>
    <!-- 添加违禁词 -->
    <el-dialog
      title="提示"
      :visible.sync="addWordsVisible"
      width="634px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form :model="addWordsForm" ref="addWordsForm" :rules="rules">
        <el-form-item label="违禁词汇" prop="raw_words">
          <el-tooltip
            class="item"
            effect="dark"
            content="支持多个词通过“与（+）” 或 “非（~）” 逻辑组合成一个关键词，如关键词“apple&phone” 表示只有同时出现以上两个词时才命中，“+”表示与的关系，“~” 表示非（排除）的关系，配置关键词时“+”必须在“~”之前"
            placement="top"
          >
            <i class="el-icon-question"></i>
          </el-tooltip>
          <el-input
            type="textarea"
            resize="none"
            :autosize="{ minRows: 10, maxRows: 10 }"
            placeholder="请输入违禁词，多个以回车分隔(支持excel复制粘贴)，每次最多支持100个"
            v-model="addWordsForm.raw_words"
          >
          </el-input>
        </el-form-item>
        <div class="switch-content">
          <el-form-item class="switch-form" label="区分大小写:" prop="">
            <div class="info">
              <el-switch
                v-model="addWordsForm.is_case_sensitive"
                active-color="#409EFF"
                inactive-color="#DCDFE6"
                active-value="1"
                inactive-value="2"
              >
              </el-switch>
            </div>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="handleClose">取 消</el-button>
        <el-button
          type="primary"
          size="medium"
          :loading="addWordsLoading"
          @click="addWords"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 日志 -->
    <logMenu
      :logVisible.sync="logVisible"
      v-if="logVisible"
      :logData="logData"
      :getLogData="getLogData"
    />
  </div>
</template>

<script>
import {
  getForbiddenWords,
  // newAddForbiddenWords,
  addAllowWords,
  addForbiddenWords,
  operatingLog,
  exportForbiddenWords,
  newBatchAddForbiddenWords,
} from "@/api/leadManagement/prohibitedWords";
export default {
  name: "prohibited",
  components: {},
  data() {
    return {
      search: {
        raw_words: "",
        status: "1",
        sort_field: "",
        sort_direction: "",
        page: 1,
        page_size: 15,
      },
      activeName: "1",
      selectionShow: true,
      loading: false,
      dataList: [],
      pagination: {
        total: 0,
      },
      column: [
        {
          prop: "raw_words",
          label: "违禁词汇",
        },
        {
          prop: "total",
          label: "违禁次数",
          sortable: "custom",
        },
      ],
      selectTableData: [],
      addWordsVisible: false,
      addWordsLoading: false,
      addWordsForm: {
        is_case_sensitive: 2,
        raw_words: "",
      },
      rules: {
        raw_words: [
          {
            required: true,
            message: "请输入违禁词",
            trigger: "blur",
          },
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback();
              } else {
                if (!value.trim()) {
                  callback(new Error("内容不能为空"));
                } else {
                  callback();
                }
              }
            },
          },
        ],
      },
      logVisible: false,
      logData: {
        logSearch: {
          page: 1,
          page_size: 15,
        },
        pagination: {
          total: 0,
        },
        title: "日志",
        dataList: [],
        width: "634px",
        logColumn: [
          {
            prop: "id",
            label: "日志ID",
          },
          {
            prop: "operator_name",
            label: "操作人",
          },
          {
            prop: "create_time",
            label: "操作时间",
          },
          {
            prop: "content",
            label: "备注",
          },
        ],
      },
      exportLoading: false,
    };
  },
  props: {},
  watch: {
    dataList: {
      immediate: true,
      handler(val) {
        this.iterationTable(val);
      },
    },
  },
  //   activated(){
  //     this.getList();
  // },
  created() {
    this.getList();
  },
  methods: {
    // tag状态切换
    toggleBtn({ name, index }) {
      if (this.search.status == name) return;
      this.selectTableData = [];
      this.search.raw_words = "";
      this.search.status = name;
      this.init();
      // console.log(name, index);
    },
    // 导出
    exportProhibited() {
      this.exportLoading = true;
      exportForbiddenWords(this.search)
        .then((res) => {
          // console.log(res);
          if (res.code == 0) {
            window.location.href = res.data;
            this.exportLoading = false;
          }
        })
        .catch((err) => {
          this.exportLoading = false;
        });
    },
    // 获取表格数据
    getList() {
      this.loading = true;
      getForbiddenWords(this.search)
        .then((res) => {
          console.log(res);
          this.completeData(res.data);
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    // 跨页多选数据处理
    completeData({ list, count }) {
      list.forEach((element) => {
        this.$set(element, "checked", false);
        const row = this.selectTableData.find((v) => {
          return v.id == element.id;
        });
        if (row) {
          this.$set(element, "checked", true);
        }
      });
      this.dataList = list;
      this.pagination.total = count;
    },
    iterationTable(rows = []) {
      this.$nextTick(() => {
        rows.forEach((row) => {
          this.$refs["tableChild"].toggleRowSelect(row, row.checked);
        });
      });
    },
    // 获取选中的表格中的每一行客户数据
    getSelectTable(val) {
      if (val.checked) {
        this.selectTableData = [...this.selectTableData, val];
      } else {
        const index = this.selectTableData.findIndex((v) => {
          return v.id == val.id;
        });
        if (index > -1) {
          this.selectTableData.splice(index, 1);
        }
      }
    },
    // 全选
    getSelectTableAll() {
      this.dataList.forEach((v) => {
        const index = this.selectTableData.findIndex((element) => {
          return v.id == element.id;
        });
        if (index > -1) {
          v.checked = false;
          this.selectTableData.splice(index, 1);
        }
      });
    },
    // 搜索
    init() {
      this.selectTableData = [];
      this.search.page = 1;
      this.getList();
    },
    // 清除
    clear() {
      this.selectTableData = [];
      this.search = this.$options.data().search;
      this.activeName = this.search.status;
      this.init();
    },
    // 添加违禁词弹窗显示
    isAddWordsShow() {
      this.addWordsVisible = true;
    },
    // 添加违禁词弹窗关闭
    handleClose() {
      this.addWordsVisible = false;
      setTimeout(() => {
        this.addWordsForm.raw_words = "";
        this.$refs.addWordsForm.clearValidate("raw_words");
      }, 200);
    },
    // 添加违禁词
    addWords() {
      this.addWordsLoading = true;
      this.$refs.addWordsForm.validate((valid) => {
        if (valid) {
          // 单个添加违禁词
          // newAddForbiddenWords(this.addWordsForm)
          //   .then((res) => {
          //     // console.log(res);
          //     if (res.code == 0) {
          //       this.$message.success("操作成功");
          //       this.addWordsLoading = false;
          //       this.handleClose();
          //       this.init();
          //     }
          //   })
          //   .catch((err) => {
          //     this.addWordsLoading = false;
          //   });

          // 批量新增违禁词
          let params = [];
          this.addWordsForm.raw_words.split("\n").forEach((v, i) => {
            v.trim() &&
              params.push({
                raw_words: v.trim(),
                is_case_sensitive: this.addWordsForm.is_case_sensitive,
              });
          });
          // console.log(params);
          if (params.length > 100) {
            this.$message.error("每次最多可添加100个违禁词");
            this.addWordsLoading = false;
            return;
          }
          newBatchAddForbiddenWords({
            words: params,
          })
            .then((res) => {
              // console.log(res);
              if (res.code == 0) {
                this.$message.success("操作成功");
                this.addWordsLoading = false;
                this.handleClose();
                this.init();
              }
            })
            .catch((err) => {
              this.addWordsLoading = false;
            });
        } else {
          this.addWordsLoading = false;
          return false;
        }
      });
    },
    // 添加至白名单
    addTOAllowWords() {
      let ids = this.getSelectTableDataIds(this.selectTableData);
      // console.log(ids);
      addAllowWords({ ids }).then((res) => {
        if (res.code == 0) {
          this.selectTableData = [];
          this.init();
          this.$message.success("操作成功");
        }
      });
    },
    // 添加至违禁词
    addTOForbiddenWords() {
      let ids = this.getSelectTableDataIds(this.selectTableData);
      // console.log(ids);
      addForbiddenWords({ ids }).then((res) => {
        if (res.code == 0) {
          this.selectTableData = [];
          this.init();
          this.$message.success("操作成功");
        }
      });
    },
    // 处理所选违禁词的id便于部分操作
    getSelectTableDataIds(val) {
      let ids = [];
      val.forEach((v) => {
        ids.push(v.id);
      });
      return ids;
    },
    // 日志
    logListShow() {
      this.getLogData();
      this.logVisible = true;
    },
    // 获取日志信息
    getLogData() {
      operatingLog(this.logData.logSearch).then((res) => {
        let { list, count } = res.data;
        this.logData.pagination.total = count;
        this.logData.dataList = list;
      });
    },
  },
};
</script>

<style scoped lang="scss">
.prohibited-contaniner {
  position: relative;
  .exportbtn {
    position: absolute;
    right: 0;
    top: 0px;
    height: 36px;
    line-height: 36px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .conditions-content {
    .toggleBtns {
      /deep/ .el-tabs .el-tabs__header {
        margin-bottom: 0;
        .el-tabs__nav-wrap {
          &::after {
            height: 1px;
            background-color: #c8d4df;
          }
          .el-tabs__nav-scroll {
            padding-left: 20px;
            .el-tabs__nav {
              .el-tabs__active-bar {
                height: 3px;
              }
              .el-tabs__item {
                height: 47px;
                line-height: 47px;
                color: #637381;
                font-weight: 500;
                &.is-active {
                  color: #212b36;
                  font-weight: 700;
                }
              }
            }
          }
        }
      }
    }
  }

  .search-content {
    display: flex;
    justify-content: space-between;
    padding: 16px;
    align-items: center;
    .search-input {
      flex: 1;
      .el-input__inner {
        height: 36px;
        line-height: 36px;
      }
    }
    .btn-content {
      width: 200px;
      .iconsousuo {
        width: 20px;
        height: 20px;
        vertical-align: middle;
      }
    }
    .el-button {
      height: 36px;
      line-height: 36px;
      padding-top: 0;
      padding-bottom: 0;
    }
  }
  .tips {
    margin: 0px 0 16px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    span {
      color: #8996a3;
      margin-right: 16px;
      font-size: 14px;
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
}
/deep/.prohibited-contaniner {
  .search-content {
    .search-input {
      .el-input__inner {
        height: 36px;
        line-height: 36px;
      }
    }
  }
  .switch-content {
    .switch-form {
      display: flex;
      align-items: center;
      .el-form-item__content {
        line-height: unset;
      }
      .info {
        float: left;
      }
    }
  }
}
/deep/ .el-dialog__body {
  .el-icon-question {
    color: #dcdfe6;
    font-size: 20px;
    vertical-align: top;
    // line-height: 20px;
    margin-top: 3px;
  }
}
</style>
