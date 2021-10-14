<!---*
* @description  画像标签
* @fileName tagList.vue
* @author 叶金龙
* @date 2021/03/05 15:16:31
*--->
<template>
  <div class="tagList-container">
    <div class="title">客户画像标签</div>
    <div
      class="tagBox"
      :style="{ minHeight: tags.length == 0 ? '70px' : 'auto' }"
    >
      <el-tag
        v-for="(tag, index) in tags"
        :key="index"
        closable
        :type="currentIndex == index ? 'primary' : tag.type"
        size="medium"
        :effect="currentIndex == index ? 'dark' : 'plain'"
        @close="deleteTag(tag, index)"
        @click.prevent.self="selectTag(index, tag)"
      >
        {{ tag.name }}
      </el-tag>
      <el-button
        type="primary"
        plain
        size="mini"
        :loading="isLoading"
        v-if="!noMore && tags.length > 0"
        @click="addMore"
        >{{ isLoading ? "加载中" : "加载更多" }}
      </el-button>
      <div class="nothing" v-if="tags.length == 0">暂未创建标签~</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "tagList",
  components: {},
  data() {
    return {};
  },
  props: {
    page: {
      type: [Number, String],
      defaut: 1,
    },
    page_size: {
      type: [Number, String],
      defaut: 10,
    },
    tags: {
      type: Array,
      defaut() {
        return [];
      },
    },
    deleteTag: {
      type: Function,
      default() {
        return function () {
          return false;
        };
      },
    },
    selectTag: {
      type: Function,
      default() {
        return function () {
          return false;
        };
      },
    },
    currentIndex: {
      type: [Number, String],
      default: null,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    getTagList: {
      type: Function,
      default() {
        return () => {
          return false;
        };
      },
    },
    noMore: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    xxx: {},
  },
  created() {},
  methods: {
    addMore() {
      this.$emit("update:page", 1 + this.page);
      this.getTagList();
    },
  },
};
</script>

<style scoped lang='scss'>
.tagList-container {
  padding: 16px;
  background-color: #fff;
  box-sizing: border-box;
  .title {
    height: 22px;
    font-size: 16px;
    font-weight: 600;
    color: #1c3246;
    line-height: 22px;
    margin-bottom: 4px;
  }
  .tagBox {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    max-height: 120px;
    overflow-y: scroll;
    box-sizing: border-box;
    .el-tag {
      margin-right: 8px;
      margin-top: 12px;
      cursor: pointer;
      &.el-tag--plain:hover {
        background-color: rgba(37, 48, 138, 0.16);
      }
    }
    .el-button {
      margin-top: 12px;
    }
    .nothing {
      text-align: center;
      align-self: center;
      height: 22px;
      font-size: 14px;
      font-weight: 400;
      color: #8f949e;
      line-height: 22px;
      flex: 1;
    }
  }
}
</style>