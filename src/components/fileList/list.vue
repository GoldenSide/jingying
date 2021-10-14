<!---*
* @description 文件列表
* @fileName list.vue
* @author 叶金龙
* @date 2020/12/01 17:44:53
*--->
<template>
  <div class="fileList">
    <ul class="lists">
      <li class="item" v-for="(item, index) in fileList" :key="index">
        <a
          :href="item.url"
          :underline="false"
          :download="item.name"
          target="_blank"
        >
          <i class="el-icon-document"></i> &nbsp;{{ item.name }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "fileList",
  components: {},
  data() {
    return {};
  },
  props: {
    fileList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  watch: {
    xxx: {},
  },
  created() {},
  methods: {
    downFile({ url }) {
      //   window.open(url);
    },
  },
};
</script>

<style scoped lang='scss'>
.fileList {
  .lists {
    .item {
      height: 25px;
      padding: 4px;
      box-sizing: border-box;
      cursor: pointer;
      &:hover {
        background-color: #f5f7fa;
        color: #409eff;
      }
    }
  }
}
</style>