<!---*
* @description 
* @fileName selectTags.vue
* @author 龙伟
* @date 2020/12/22 11:31:14
*--->
<template>
  <div class="tag-content">
    <el-tag
      v-for="(tag, index) in tagList"
      :key="index"
      closable
      :type="tag.type"
      @close="handleClose(tag, index)"
    >
      {{ tag[showkey] }}
    </el-tag>
  </div>
</template>

<script>
export default {
  name: "tagMenu",
  components: {},
  data() {
    return {};
  },
  props: {
    handlekey: {
      type: String,
      default: "id",
    },
    tagList: {
      type: Array,
      default() {
        return [];
      },
    },
    iterationTable: {
      type: Function,
    },
    showkey: {
      type: String,
    },
  },
  watch: {
    tagList: {
      immediate: true,
      deep: true,
      handler(val) {
        console.log(val);
      },
    },
  },
  created() {},
  methods: {
    handleClose(val, index) {
      this.tagList[index].checked = false;
      this.iterationTable(this.tagList.splice(index, 1));
    },
  },
};
</script>

<style scoped lang='scss'>
.tag-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  .el-tag {
    margin: 0 1% 10px;
    flex-basis: 18%;
    position: relative;
  }
}
/deep/.tag-content {
  .el-tag {
    .el-icon-close {
      position: absolute;
      right: 5px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>