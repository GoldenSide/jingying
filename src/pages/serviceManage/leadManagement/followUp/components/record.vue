<!---*
* @description 
* @fileName record.vue
* @author 龙伟
* @date 2020/11/26 16:22:02
*--->
<template>
  <div class="record-contaniner">
    <el-dialog
      title="跟进记录"
      :visible.sync="recordVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
      width="634px"
    >
      <div
        class="record-scroll"
        v-show="recordData.length"
        style="height: 300px"
      >
        <ul
          class="infinite-list"
          v-infinite-scroll="load"
          :infinite-scroll-disabled="disabled"
          infinite-scroll-distance="10"
          style="overflow: auto; height: 100%"
        >
          <li
            v-for="(item, index) in recordData"
            :key="index"
            class="infinite-list-item"
          >
            <p>
              <label>跟进人：</label>
              <span>{{ item.user_name }}</span>
            </p>
            <p>
              <label>跟进时间：</label>
              <span>{{ item.create_time }}</span>
            </p>
            <p>
              <label>跟进内容：</label>
              <span>{{ item.content }}</span>
            </p>
          </li>
        </ul>
        <p v-if="loading" style="text-align: center">加载中...</p>
        <p v-if="noMore" style="text-align: center">没有更多了</p>
      </div>
      <div class="record-content">
        <p class="record-content-title">跟进内容：</p>
        <el-input
          type="textarea"
          placeholder="请输入内容"
          v-model="recordVal"
          maxlength="500"
          show-word-limit
        >
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="recordMenuVisible">取 消</el-button>
        <el-button size="medium" type="primary" @click="sumbit">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { followLogList, followLogAdd } from "@/api/leadManagement/followUp";
export default {
  name: "recordMenu",
  components: {},
  data() {
    return {
      search: {
        company_follow_id: "",
        page: 1,
        page_size: 3,
      },
      recordVal: "",
      recordData: [],
      loading: false,
      recordCount: 0,
    };
  },
  props: {
    recordVisible: {
      type: Boolean,
      default: false,
    },
    recordID: {},
  },
  watch: {
    recordID: {
      immediate: true,
      deep: true,
      handler(val) {
        this.recordData = [];
        if (val) {
          let { id } = val;
          this.search.company_follow_id = val;
          if (this.search.company_follow_id > 0) {
            this.getList();
          }
        }
      },
    },
  },
  computed: {
    disabled() {
      return this.loading || this.noMore;
      //   return this.noMore;
    },
    noMore() {
      return this.recordData.length >= this.recordCount;
      //   return this.recordData.length >= 20;
    },
  },
  created() {},
  methods: {
    load() {
      this.loading = true;
      setTimeout(() => {
        this.search.page++;
        this.getList();
        this.loading = false;
      }, 1000);
    },
    getList() {
      followLogList(this.search).then((res) => {
        this.recordData = [...this.recordData, ...res.data.list];
        // this.recordData = [
        //   ...this.recordData,
        //   ...[{ user_name: "jk" }, { user_name: "hj" }, { user_name: "ss" }],
        // ];
        this.recordCount = res.data.count;
      });
    },
    recordMenuVisible() {
      this.$emit("update:recordVisible", false);
    },
    sumbit() {
      if (!this.recordVal.trim()) {
        this.$message.error("请输入跟进内容");
        return;
      }
      followLogAdd({
        company_follow_id: this.recordID,
        content: this.recordVal,
      }).then((res) => {
        // console.log(res);
        if (res.code == 0) {
          this.recordData = [];
          this.search.page = 1;
          this.recordVal = "";
          this.getList();
          this.$message.success("操作成功");
        }
      });
    },
    handleClose() {
      this.recordMenuVisible();
    },
  },
};
</script>

<style scoped lang='scss'>
.record-content-title {
  margin: 16px 0 10px;
}
.record-scroll {
  padding-bottom: 20px;
  & > p {
    margin-top: 15px;
  }
  .infinite-list {
    // padding-bottom: 16px;
    li {
      padding: 16px 0;
      border-bottom: 1px dashed #dfe3e8;
      &:first-child {
        padding-top: 0;
      }
      // &:last-child {
      //     padding-bottom: 0;
      // }
      p {
        margin-bottom: 16px;
        label {
          color: #8996a3;
        }
        span {
          color: #212b36;
        }
      }
    }
  }
}
</style>