<!---*
* @description 
* @fileName pagination.vue
* @author 叶金龙
* @date 2020/09/24 17:09:04
*--->
<template>
  <div class="page-contentainer" v-if="total != 0">
    <el-pagination
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :page-sizes="pageSizes"
      :layout="layout"
      :total="total"
      @current-change="handleCurrentChange"
    ></el-pagination>
    <div class="sizes">
      <div class="pagination-sizes-dropdown el-dropdown">
        <el-dropdown @command="handleSizeChange" trigger="click">
          <span class="page-sizes el-dropdown-selfdefine">
            <i class="el-icon-s-tools page-icon"></i>
          </span>
          <el-dropdown-menu slot="dropdown" class="pagination-sizes-menu">
            <el-dropdown-item
              :class="{ active: index == currentIndex }"
              :command="item"
              v-for="(item, index) in pageSizes"
              :key="index"
              >{{ item }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "pagination",
  data() {
    return {
      currentIndex: null,
    };
  },
  props: {
    total: {
      required: true,
      type: Number,
      default: 0,
    },
    page: {
      type: Number,
      default: 1,
    },
    limit: {
      type: Number,
      default: 20,
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 15, 20, 30, 50];
      },
    },
    layout: {
      type: String,
      default: "total,pager,prev,next",
    },
    background: {
      type: Boolean,
      default: true,
    },
    autoScroll: {
      type: Boolean,
      default: true,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    limit: {
      immediate: true,
      deep: true,
      handler(val) {
        // this.handleSizeChange(val);
      },
    },
  },
  methods: {
    handleSizeChange(val) {
      this.currentIndex = this.pageSizes.findIndex((v) => v === val);
      this.pageSize = val;
      this.$nextTick(() => {
        this.$emit("pagination", { page: this.currentPage, limit: val });
      });
    },
    handleCurrentChange(val) {
      this.$emit("pagination", { page: val, limit: this.pageSize });
    },
  },
  computed: {
    currentPage: {
      get() {
        return this.page;
      },
      set(val) {
        this.$emit("update:page", val);
      },
    },
    pageSize: {
      get() {
        return this.limit;
      },
      set(val) {
        this.$emit("update:limit", val);
      },
    },
  },
  mounted() {
    this.currentIndex = this.pageSizes.findIndex((v) => v === this.limit);
  },
};
</script>

<style  lang='scss' >
// 分页器的主体样式
.page-contentainer {
  padding: 16px 20px;
  color: #1a1d2d;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .el-pagination {
    display: flex;
    align-items: center;
    font-weight: normal;
    overflow: hidden;
    justify-content: flex-end;
    align-items: center;
    /deep/ .el-pager {
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      list-style: none;
      display: inline-block;
      vertical-align: top;
      font-size: 0;
      padding: 0;
      margin: 0;
      li.active + li {
        border: 1px solid #dfe3e8;
      }
    }
    li,
    .btn-prev,
    .btn-next {
      border: 1px solid #dfe3e8;
      color: #212b36;
      background: #fff;
      font-weight: 400;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      min-width: 34px;
      line-height: 32px;
      height: 34px;
      margin: 0 -1px 0 0;
      border-radius: 0;
      &:not(.disabled).active {
        border-color: #dfe3e8;
        background: #fff;
        color: #c4cdd5;
      }
      &:first-child {
        border-top-left-radius: 2px;
        border-bottom-left-radius: 2px;
      }
      &:last-child {
        border-top-right-radius: 2px;
        border-bottom-right-radius: 2px;
      }
    }
    .btn-prev {
      margin-left: 8px;
    }
    .btn-next {
      margin-right: 8px;
    }
    li:hover,
    button:hover {
      background-color: #f2f9ff;
      color: #919eab;
    }
    button:disabled {
      color: #e0e6ec;
    }
  }
  .sizes {
    .pagination-sizes-dropdown {
      outline: none;
      &:focus,
      &:hover {
        outline: none;
      }
      .el-dropdown {
        outline: none;
        &:focus,
        &:hover {
          outline: none;
        }
        .page-sizes {
          display: inline-block;
          height: 32px;
          width: 32px;
          border: 1px solid #dfe3e8;
          border-radius: 2px;
          cursor: pointer;
          text-align: center;
          &:hover {
            background-color: #f2f9ff;
          }
          .page-icon {
            line-height: 32px;
            font-size: 20px;
            color: #212b36;
          }
        }
      }
    }
  }
}
// 分页下拉的样式
.pagination-sizes-menu .el-dropdown-menu__item {
  &.active,
  &:hover {
    background-color: #ebebee;
    color: #5c6174;
  }
}
</style>