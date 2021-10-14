<!---*
* @description 
* @fileName index.vue (入驻申请单)
* @author 龙伟
* @date 2020/11/02 11:54:06
*--->
<template>
  <div class="customerLeads-contaniner">
    <div class="curstomerLeads-top">
      <contHeader :titleText="$route.meta.title" />
      <div class="btn-top">
        <processMenu ref="process" />
        <el-link :underline="false" :href="downloadLink"
          ><el-button type="default" size="medium">
            下载导入模版
          </el-button></el-link
        >
        <el-upload
          class="upload-demo"
          action="#"
          :show-file-list="false"
          :http-request="uploadToOssFile"
          :on-success="handleFileSuccess"
          :before-upload="beforeFileUpload"
          :disabled="upLoading"
        >
          <el-button size="primary" :loading="upLoading" type="medium"
            >批量导入模版</el-button
          >
        </el-upload>
      </div>
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
        <template :slot="elpopoverArr[0].slotName">
          <el-radio-group v-model="search.source_code">
            <el-radio
              style="margin: 5px 0"
              v-for="(item, index) in selectType"
              :key="index"
              :label="item.code"
              >{{ item.name }}</el-radio
            >
          </el-radio-group>
        </template>
        <template>
          <el-tag
            closable
            v-if="search.source_code != ''"
            @close="deleCondition('source_code')"
            style="margin-right: 10px"
            >注册来源： {{ getCompanyType }}</el-tag
          >
        </template>
      </searchComponent>
      <div class="customerLeads-list">
        <div class="btn">
          <el-button
            :class="{ active: index === indexSel }"
            v-for="(item, index) in statusBtn"
            :key="index"
            @click="getStatusData(item, index)"
          >
            {{ item.text }}
          </el-button>
        </div>
        <div class="customerLeads-table">
          <tableComponent
            :column="fixColumn"
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
    </div>
    <!-- 备注 -->
    <remarksMenu
      :remarksVisible.sync="remarksVisible"
      :remarksData="remarksData"
    />
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
import dayjs from "dayjs";
import OSS from "ali-oss";
import SparkMD5 from "spark-md5";
import ossMixIn from "@/mixins/ossMixin";
import {
  customerLeadsListAll,
  registerTypeList,
  getTemplate,
  postImport,
  operatingLog,
} from "@/api/leadManagement/customerLeads";

import { sourceSelectList } from "@/api/common";
import remarksMenu from "./components/remarks";
import processMenu from "./components/process";
export default {
  name: "customerLeads",
  mixins: [ossMixIn],
  components: { remarksMenu, processMenu },
  data() {
    return {
      search: {
        page: 1,
        page_size: 15,
        search_id: "5",
        search_words: null,
        source_code: "",
        type: "0",
        create_time_range: [],
      },
      btnConfig: [
        { text: "搜索", icon: "search", type: "primary", cb: "init" },
        { text: "清空", icon: "clear", type: "default", cb: "clear" },
      ],
      dateConfig: [
        {
          label: "注册时间",
          key: "create_time_range",
          isTimeShow: false,
        },
      ],
      registerType: [],
      elpopoverArr: [
        {
          btnText: "注册来源",
          slotName: "currrentStatus",
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
          value: "5",
          text: "企业/个人名称",
        },
        {
          value: "6",
          text: "姓名",
        },
        {
          value: "7",
          text: "手机号",
        },
        {
          value: "8",
          text: "邮箱",
        },
      ],
      statusBtn: [
        {
          type: "0",
          text: "待处理",
        },
        {
          type: "1",
          text: "已通过",
        },
        {
          type: "2",
          text: "已拒绝",
        },
      ],
      column: [
        {
          prop: "concat_name",
          label: "姓名",
        },
        {
          prop: "company_name",
          label: "企业/个人名称",
          width: 200,
        },
        {
          prop: "registration_type",
          label: "注册类型",
          render: ({ h, row }) => {
            let text = null;
            this.registerType.map((item, index) => {
              if (item.id == row.register_type) {
                text = item.name;
                return;
              }
            });
            return h("div", {
              domProps: {
                innerHTML: text,
              },
            });
          },
        },
        {
          prop: "registration_source",
          label: "注册来源",
          render: ({ h, row }) => {
            let text = "官网";
            this.selectType.map((item, index) => {
              if (item.code == row.source_code) {
                text = item.name;
                return;
              }
            });
            return h("div", {
              domProps: {
                innerHTML: text,
              },
            });
          },
        },
        {
          prop: "phone",
          label: "手机号",
          width: 150,
        },
        {
          prop: "email",
          label: "注册邮箱",
          width: 200,
        },
        {
          prop: "created_at",
          label: "注册时间",
          width: 200,
        },
        {
          prop: "remarks",
          label: "备注",
        },
        {
          prop: "create_type_str",
          label: "创建方式",
        },
        {
          prop: "",
          label: "操作",
          width: 220,
          render: ({ h, row }) => {
            // console.log(row);
            if (row.status == "0" && row.create_type == "2") {
              // 状态为未处理且为导入
              // 是否有备注
              return (
                <div>
                  <el-link
                    type="primary"
                    size="default"
                    onClick={() => this.goCustomerReview(row)}
                    style=""
                  >
                    审核
                  </el-link>
                  <el-link
                    type="primary"
                    size="default"
                    style="display:none"
                    onClick={() => this.editCustomer(row)}
                  >
                    编辑
                  </el-link>

                  <el-link
                    type="primary"
                    size="default"
                    onClick={() => this.deactivate(row)}
                  >
                    备注
                  </el-link>
                  <el-link
                    type="primary"
                    size="default"
                    onClick={() => this.dialog(row)}
                  >
                    日志
                  </el-link>
                </div>
              );
            } else if (row.status == "0") {
              // 状态为未处理但不是导入的
              return (
                <div>
                  <el-link
                    type="primary"
                    size="default"
                    onClick={() => this.goCustomerReview(row)}
                    style=""
                  >
                    审核
                  </el-link>
                  <el-link
                    type="primary"
                    size="default"
                    onClick={() => this.deactivate(row)}
                  >
                    备注
                  </el-link>
                  <el-link
                    type="primary"
                    size="default"
                    onClick={() => this.dialog(row)}
                  >
                    日志
                  </el-link>
                </div>
              );
            } else {
              return (
                <div>
                  <el-link
                    type="primary"
                    size="default"
                    onClick={() => this.goCustomerReview(row)}
                    style=""
                  >
                    详情
                  </el-link>
                  <el-link
                    type="primary"
                    size="default"
                    onClick={() => this.deactivate(row)}
                  >
                    备注
                  </el-link>
                  <el-link
                    type="primary"
                    size="default"
                    onClick={() => this.dialog(row)}
                  >
                    日志
                  </el-link>
                </div>
              );
            }
          },
        },
      ],
      dataList: [],
      selectType: [],
      pagination: {
        total: 0,
      },
      loading: false,
      upLoading: false,
      addCol: {
        prop: "reject_reason",
        label: "拒绝原因",
      },
      indexSel: 0,
      downloadLink: "",
      remarksData: {},
      remarksVisible: false,
      logVisible: false,
      logData: {
        title: "日志",
        logSearch: {
          search_id: "",
          create_time_range: [],
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
            prop: "user_name",
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
      ossFile: {
        oss_url: "",
        file_name: "",
        is_check_duplicate: "Y",
      },
    };
  },
  props: {},
  watch: {
    xxx: {},
  },
  activated() {
    this.getList();
    this.getSelectType();
    // 获取下载链接
    this.getDownloadLink();
  },
  created() {
    this.search.page = 1;
  },
  // created() {
  //   this.getList();
  //   this.getSelectType();
  //   // 获取下载链接
  //   this.getDownloadLink();
  // },
  methods: {
    // 判断当前公司线索状态获取数据
    getStatusData({ type }, index) {
      this.indexSel = index;
      this.search.type = type;
      this.search.page = 1;
      this.getList();
    },
    // 获取表格数据
    getList() {
      this.loading = true;
      this.dataList = [];
      customerLeadsListAll(this.search).then((res) => {
        let { list, count } = res.data;
        this.dataList = list;
        this.pagination.total = count;
        this.loading = false;
      });
    },
    // 获取注册来源/类型
    getSelectType() {
      sourceSelectList({}).then((res) => {
        this.selectType = res.data;
      });
      registerTypeList({}).then((res) => {
        this.registerType = res.data;
      });
    },
    deleCondition(key) {
      this.search[key] = "";
      this.init();
    },
    init() {
      this.search.page = 1;
      this.getList();
    },
    clear() {
      this.search = this.$options.data().search;
      this.indexSel = 0;
      this.init();
    },
    // 跳转公司详情
    goCustomerReview({ id }) {
      this.$router.push({
        path: "/index/leadManagement/customerReview",
        query: { id },
      });
    },
    // 跳转编辑页面
    editCustomer({ id }) {
      this.$router.push({
        path: "/customerReviewItem/editCustomer",
        query: { id },
      });
    },
    // 文件自定义异步上传
    uploadToOssFile(param) {
      let file = param.file;
      let MD5 = null;
      this.get_filemd5sum(file).then((res) => {
        MD5 = res;
        if (MD5) {
          this.uploadToOss(file, MD5).then((res) => {
            param.onSuccess(res);
          });
        }
      });
    },
    // 文件上传成功
    handleFileSuccess(res, file) {
      this.upLoading = true;
      // console.log(res);
      // console.log(file);
      this.ossFile.file_name = file.name;
      this.ossFile.oss_url = res.file_preview;
      postImport(this.ossFile)
        .then((res) => {
          // console.log(res);
          if (res.data.hasOwnProperty("bool")) {
            this.$confirm(`${res.data.info}`, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                this.upLoading = false;
                this.ossFile.is_check_duplicate = "N";
                postImport(this.ossFile).then((res) => {
                  this.$message.success(
                    "操作成功，正在导入，详情可在导入进程中查看哦~"
                  );
                });
              })
              .catch(() => {
                this.$message.info("已取消本次导入");
                this.upLoading = false;
              });
          } else {
            this.$message.success(
              "操作成功，正在导入，详情可在导入进程中查看哦~"
            );
            this.upLoading = false;
          }
        })
        .catch((err) => {
          this.upLoading = false;
          // console.log('err:' + err);
        });
      this.ossFile.is_check_duplicate = "Y";
    },

    // 文件上传前校验
    beforeFileUpload(file) {
      // console.log(file);
      let isType = file.name.substr(file.name.lastIndexOf(".") + 1);
      let isLt8M = file.size / 1024 / 1024 < 8;
      let isXlsx = isType === "xlsx";
      let isXls = isType === "xls";
      if (!isXlsx && !isXls) {
        this.$message.error("上传文件只能是xlsx或者xls格式！");
      }
      if (!isLt8M) {
        this.$message.error("上传文件大小不能超过8M");
      }
      return isType && isLt8M;
    },
    // 获取下载链接
    getDownloadLink() {
      getTemplate({}).then((res) => {
        this.downloadLink = res.data.oss_url;
      });
    },
    // 备注
    deactivate(row) {
      this.remarksVisible = true;
      this.remarksData = JSON.parse(JSON.stringify(row));
    },
    // 日志
    dialog({ id }) {
      this.logData.logSearch.search_id = id;
      this.getLogData();
      this.logVisible = true;
    },
    // 获取日志数据
    getLogData() {
      operatingLog(this.logData.logSearch).then((res) => {
        let { list, count } = res.data;
        this.logData.pagination.total = count;
        this.logData.dataList = list;
      });
    },
    // 文件上传配置
    get_filemd5sum(ofile) {
      return new Promise((resolve, reject) => {
        let file = ofile;
        let tmp_md5;
        let blobSlice =
            File.prototype.slice ||
            File.prototype.mozSlice ||
            File.prototype.webkitSlice,
          chunkSize = 8097152, // Read in chunks of 2MB
          chunks = Math.ceil(file.size / chunkSize),
          currentChunk = 0,
          spark = new SparkMD5.ArrayBuffer(),
          fileReader = new FileReader();
        fileReader.onload = async (e) => {
          spark.append(e.target.result); // Append array buffer
          currentChunk++;
          let md5_progress = Math.floor((currentChunk / chunks) * 100);
          if (currentChunk < chunks) {
            loadNext();
          } else {
            tmp_md5 = spark.end();
            resolve(tmp_md5);
          }
        };
        fileReader.onerror = function () {
          reject(false);
        };
        function loadNext() {
          let start = currentChunk * chunkSize,
            end =
              start + chunkSize >= file.size ? file.size : start + chunkSize;
          fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
        }
        loadNext(tmp_md5);
      });
    },
    uploadToOss(file, MD5) {
      return new Promise((resolve, reject) => {
        let str = "",
          url = "",
          client = null,
          fileName = null,
          suffix = null,
          index = 0;
        this.initOssConfig().then((res) => {
          if (res && Object.keys(res).length > 0) {
            client = new OSS(res);
            suffix = file.name.split(".")[file.name.split(".").length - 1];
            fileName =
              SparkMD5.hash(new Date().getTime() + file.name) + "." + suffix;
            client
              .multipartUpload("uploader/" + fileName, file, {}, {})
              .then((data) => {
                if (data.res.requestUrls.length) {
                  str = data.res.requestUrls[0];
                  index = str.indexOf("?");
                  url = index > 0 ? str.substring(0, index) : str;
                  resolve({ file_preview: url });
                }
                reject("上传失败");
              });
          } else {
            this.$message.error("获取oss秘钥失败，请刷新重试");
          }
        });
      });
    },
  },
  computed: {
    fixColumn() {
      if (this.column.length == 11 && this.search.type != "2") {
        this.column.splice(-3, 1);
      } else {
        if (this.column.length == 10 && this.search.type == "2") {
          this.column.splice(-2, 0, this.addCol);
        }
      }
      return this.column;
    },
    getCompanyType() {
      let text = null;
      this.selectType.map((item, index) => {
        if (item.code == this.search.source_code) {
          text = item.name;
          return;
        }
      });
      return text;
    },
  },
};
</script>

<style scoped lang="scss">
.customerLeads-contaniner {
  position: relative;
  .customerLeads-list {
    .btn,
    .btn-top {
      padding: 0px 16px;
      box-sizing: border-box;
      .el-button {
        height: 36px;
        line-height: 36px;
        padding-top: 0;
        padding-bottom: 0;
      }
    }

    .btn {
      padding-bottom: 16px;
      .el-button {
        &.active {
          border: 1px solid #0077d9;
          color: #0077d9;
        }
        &:hover {
          background: #fff;
          border: 1px solid #0077d9;
          color: #0077d9;
        }
        &:focus {
          background: #fff;
          border: 1px solid #0077d9;
          color: #0077d9;
        }
      }
    }
  }
  .btn-top {
    display: flex;
    align-items: center;
  }
  .curstomerLeads-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .btn-top {
      position: absolute;
      right: 0;
      top: 0px;
    }
  }
}
</style>
