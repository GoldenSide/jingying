<!---*
* @description 
* @fileName process.vue
* @author 龙伟
* @date 2020/12/02 17:10:14
*--->
<template>
  <el-popover
    placement="bottom"
    width="560"
    trigger="click"
    @show="processShow"
    @hide="processHide"
  >
    <div class="btn">
      <span
        :class="{ active: active == index }"
        v-for="(item, index) in btnList"
        :key="index"
        @click="getBtnStatus(index, item)"
        >{{ item.name }}</span
      >
    </div>
    <div class="process-content">
      <tableComponent
        :column="fixColumn"
        :tableData="dataList"
        :page.sync="search.page"
        :page_size.sync="search.page_size"
        :total.sync="pagination.total"
        :loading.sync="loading"
        height="202"
        :pageAct="getList"
      />
    </div>
    <span slot="reference" class="process"
      ><i class="icondaorujincheng iconfont"></i><em>导入进程</em></span
    >
  </el-popover>
</template>

<script>
import { importSqsTaskList } from "@/api/leadManagement/customerLeads";
export default {
  name: "processMenu",
  components: {},
  data() {
    return {
      search: {
        status: [1, 2],
        page: 1,
        page_size: 15,
      },
      loading: false,
      pagination: {
        total: 0,
      },
      active: 0,
      dataList: [],
      column: [
        {
          prop: "name",
          label: "任务名称",
          width: 150,
        },
        {
          prop: "create_time",
          label: "操作时间",
          width: 140,
        },
        {
          prop: "percentage",
          label: "进度",
          render: ({ h, row }) => {
            let num = Number(row.percentage);
            return (
              <el-progress
                // text-inside={true}
                stroke-width={4}
                percentage={num}
              ></el-progress>
            );
          },
        },
      ],
      addColumnOne: [
        {
          prop: "percentage",
          label: "进度",
          render: ({ h, row }) => {
            let num = Number(row.percentage);
            return (
              <el-progress
                // text-inside={true}
                stroke-width={4}
                percentage={num}
              ></el-progress>
            );
          },
        },
      ],
      addColumnTwo: [
        {
          prop: "result",
          label: "结果",
          width: 85,
          render: ({ h, row }) => {
            return h("div", {
              style: {
                backgroundColor: this.statusData[row.result].color,
                textAlign: "center",
                width: "73px",
                borderRadius: "100px",
                lineHeight: "20px",
              },
              domProps: {
                innerHTML: this.statusData[row.result].text,
              },
            });
          },
        },
        {
          prop: "",
          label: "操作",
          render: ({ h, row }) => {
            if (row.result != 1) {
              if (
                (row.status == 4 && row.result == 3) ||
                (row.status == 3 && row.result == 0)
              ) {
                return <span>{row.fail_reason}</span>;
              } else {
                return (
                  <el-link
                    type="primary"
                    size="default"
                    href={row.import_feedback_oss_url}
                  >
                    下载导入反馈表
                  </el-link>
                );
              }
            }
          },
        },
      ],
      btnList: [
        {
          name: "进行中",
          status: [1, 2],
        },
        {
          name: "已结束",
          status: [3, 4],
        },
      ],
      statusData: [
        {
          color: "#E7E7E7",
          text: "系统异常",
        },
        {
          color: "#BBE5B3",
          text: "全部成功",
        },
        {
          color: "#FFEA8A",
          text: "部分成功",
        },
        {
          color: "#FFC48B",
          text: "全部失败",
        },
      ],
      timer: null,
    };
  },
  props: {},
  watch: {
    xxx: {},
  },
  computed: {
    fixColumn() {
      if (this.column.length == 3 && this.active != "0") {
        this.column.splice(-1, 1);
        this.column = [...this.column, ...this.addColumnTwo];
      } else {
        if (this.column.length == 4 && this.active != "1") {
          this.column.splice(-2, 2);
          this.column = [...this.column, ...this.addColumnOne];
        }
      }
      return this.column;
    },
  },
  created() {
    // this.getList();
  },
  methods: {
    processShow() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.search.status = [1, 2];
      this.getList();
      this.timer = setInterval(() => {
        importSqsTaskList(this.search).then((res) => {
          //   console.log(res);
          let { list, count } = res.data;
          this.dataList = list;
          this.pagination.total = count;
          if (!list.length) {
            clearInterval(this.timer);
          }
          // console.log(res);
        });
      }, 3000);
    },
    processHide() {
      if (this.active == 1) {
        this.active = 0;
        this.processShow();
      }
    },
    getBtnStatus(index, item) {
      if (this.active == index) return;
      this.dataList = [];
      this.pagination.total = 0;
      this.active = index;
      this.search.status = item.status;
      if (!index) {
        this.processShow();
      } else {
        this.getList();
        clearInterval(this.timer);
      }
    },
    getList() {
      // this.loading = true;
      importSqsTaskList(this.search).then((res) => {
        // console.log(res);
        let { list, count } = res.data;
        this.dataList = list;
        this.pagination.total = count;
        // console.log(res);
      });
    },
  },
};
</script>

<style scoped lang='scss'>
.btn {
  line-height: 44px;
  border-bottom: 1px solid #d8d8d8;
  span {
    font-size: 14px;
    color: #909399;
    cursor: pointer;
    &:first-child {
      margin-right: 24px;
      margin-left: 8px;
    }
  }
  .active {
    color: #000000;
  }
}
.process {
  margin-right: 19px;
  font-size: 14px;
  color: #000000;
  cursor: pointer;
  i {
    margin-right: 11px;
  }
}
.process-content {
  padding: 16px 0px 0;
  .page-contentainer {
    padding-bottom: 0;
  }
}
/deep/.process-content {
  .page-contentainer {
    padding-bottom: 0;
    padding-right: 0;
  }
}
</style>