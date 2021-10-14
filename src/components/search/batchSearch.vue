<!---*
* @description 
* @fileName batchSearch.vue(批量搜索)
* @author 龙伟
* @date 2021/01/04 16:04:33
*--->
<template>
  <el-dialog
    title="批量搜索"
    :visible.sync="searchDialogVisible"
    width="634px"
    :before-close="cancel"
    :close-on-click-modal="false"
  >
    <div class="batchSearch-content" v-if="batchSearchObj.errorIsShow">
      <div class="top">
        <el-select v-model="search.search_id" placeholder="请选择">
          <el-option
            v-for="item in searchTypeArr"
            :key="item.value"
            :label="item.text"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <div class="text">
          <el-input
            type="textarea"
            placeholder="请输入需要查询的内容，每行输入一个，每次最多输入500个，回车换行(支持Execl复制粘贴)"
            v-model="batchSearchObj.searchVal"
            resize="none"
          >
          </el-input>
        </div>
      </div>
    </div>
    <div class="batchSearch-massage" v-else>
      <div class="title">
        <span>输入值</span>
        <span>结果</span>
      </div>
      <ul>
        <li v-for="(item, index) in batchSearchObj.failList" :key="index">
          <span>{{ item }}</span>
          <i>{{ searchObj[search.search_id] }}不存在</i>
        </li>
      </ul>
    </div>
    <span slot="footer" class="dialog-footer" v-if="batchSearchObj.errorIsShow">
      <el-button @click="cancel" size="medium">取 消</el-button>
      <el-button
        type="primary"
        @click="submit"
        size="medium"
        :loading="batchSearchObj.batchSearchLoading"
        >确 定</el-button
      >
    </span>
    <span slot="footer" class="dialog-footer" v-else>
      <el-button type="primary" @click="clearMassage" size="medium"
        >关闭提示</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "batchSearchMe",
  components: {},
  data() {
    return {
      searchObj: {},
    };
  },
  props: {
    searchDialogVisible: {
      type: Boolean,
      default: false,
    },
    searchTypeArr: {
      type: Array,
      default() {
        return [];
      },
    },
    search: {
      type: Object,
      default() {
        return {};
      },
    },
    batchSearchObj: {
      type: Object,
      default() {
        return {};
      },
    },
    getBatchSearchData: {
      type: Function,
    },
    clerarBatchSearch: {
      type: Function,
      default() {
        return function () {
          return false;
        };
      },
    },
  },
  watch: {
    xxx: {},
  },

  created() {
    this.getSearchType();
  },
  methods: {
    submit() {
      this.getBatchSearchData();
    },
    clearMassage() {
      this.cancel();
    },
    getSearchType() {
      this.searchTypeArr.forEach((v) => {
        this.searchObj[v.value] = v.text;
      });
    },
    cancel() {
      this.$emit("update:searchDialogVisible", false);
      this.clerarBatchSearch();
    },
  },
};
</script>

<style scoped lang='scss'>
/deep/.batchSearch-content {
  .text {
    margin-top: 16px;
  }
  .el-textarea {
    color: red;
    .el-textarea__inner {
      height: 360px;
    }
  }
}
.batchSearch-massage {
  border: 1px solid #dfe3e8;
  .title {
    height: 60px;
    box-sizing: border-box;
    border-bottom: 1px solid #ccc;
    padding: 0 20px 0 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    span {
      font-weight: 500;
    }
  }
  & > ul {
    height: 300px;
    padding: 10px;
    overflow: auto;
    & > li {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
      &:last-child {
        margin-bottom: 0;
      }
      span {
        width: 70%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      i {
        width: 25%;
        text-align: right;
        color: #f56c6c;
      }
    }
  }
}
</style>