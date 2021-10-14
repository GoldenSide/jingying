<!---*
* @description 
* @fileName level.vue
* @author 龙伟
* @date 2020/11/13 11:51:36
*--->
<template>
  <div class="level-contaniner">
    <div class="level-top">
      <contHeader :titleText="$route.meta.title" />
      <el-button type="primary" @click="addGrade">新增级别</el-button>
    </div>
    <div class="conditions-content level-content">
      <div class="content-top">
        <el-input
          v-model="search.name"
          class="search-input"
          placeholder="请输入客户级别"
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
      <div class="content-table">
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
    <!-- 新增or修改级别 -->
    <gradeMenu
      v-if="gradeFormVisible"
      :gradeFormVisible.sync="gradeFormVisible"
      :topStr="topStr"
      :gradeObj="gradeObj"
    />
    <!-- 日志 -->
    <logMenu
      :logData="logData"
      v-if="logVisible"
      :logVisible.sync="logVisible"
      :getLogData="getLogData"
    />
  </div>
</template>

<script>
import { levelListAll, operatingLog } from "@/api/leadManagement/level";
import gradeMenu from "./components/gradeMenu";
export default {
  name: "levelManagement",
  components: { gradeMenu },
  data() {
    return {
      search: {
        page: 1,
        page_size: 15,
        name: "",
      },
      dataList: [],
      pagination: {
        total: 0,
      },
      column: [
        {
          prop: "id",
          label: "ID",
          width: 200,
        },
        {
          prop: "name",
          label: "客户级别",
          width: 200,
        },
        {
          prop: "note",
          label: "级别描述",
        },
        {
          prop: "",
          label: "操作",
          width: 200,
          render: ({ h, row }) => {
            return (
              <div>
                <el-button
                  type="text"
                  size="default"
                  onClick={() => this.reviseLevel(row)}
                  style=""
                >
                  修改
                </el-button>
                <el-button
                  type="text"
                  size="default"
                  onClick={() => this.dialog(row)}
                >
                  日志
                </el-button>
              </div>
            );
          },
        },
      ],
      loading: false,
      gradeFormVisible: false,
      topStr: "",
      gradeObj: {},
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
    };
  },
  props: {},
  watch: {
    xxx: {},
  },
  //不缓存界面
  created() {
    this.getList();
  },
  // activated(){
  //     this.getList();
  // },
  methods: {
    //   获取列表数据
    getList() {
      this.loading = true;
      levelListAll(this.search).then((res) => {
        // console.log(res);
        let { list, count } = res.data;
        this.dataList = list;
        this.pagination.total = count;
      });
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
    init() {
      this.search.page = 1;
      this.getList();
    },
    clear() {
      this.search = this.$options.data().search;
      this.getList();
    },
    addGrade() {
      this.topStr = "新增";
      this.gradeObj = {};
      this.gradeFormVisible = true;
    },
    reviseLevel(row) {
      this.topStr = "修改";
      this.gradeFormVisible = true;
      this.gradeObj = row;
    },
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
  },
};
</script>

<style scoped lang='scss'>
.level-contaniner {
  position: relative;
  .level-top {
    display: flex;
    justify-content: space-between;
    .el-button {
      position: absolute;
      right: 0;
      top: 0px;
    }
  }
  .el-button {
    height: 36px;
    line-height: 36px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .content-top {
    display: flex;
    justify-content: space-between;
    padding: 16px;
    align-items: center;
    .search-input {
      flex: 1;
      margin-right: 12px;
    }
    .btn-content {
      width: 200px;
      .iconsousuo {
        width: 20px;
        height: 20px;
        vertical-align: middle;
      }
    }
  }
}
</style>