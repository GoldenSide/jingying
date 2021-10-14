<!---*
* @description 普通文件上传
* @fileName upload.vue
* @author 叶金龙
* @date 2020/12/02 20:00:26
*--->
<template>
  <div class="fileListUpload">
    <el-upload
      class="upload"
      action="#"
      :http-request="uploadToOssSuccess"
      :on-success="handleFileSuccessBack"
      :before-upload="beforeUpload"
      :accept="accept"
      :on-remove="handlerFileRemoveBack"
      :file-list="obj[fileKey]"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">{{ tips }}</div>
    </el-upload>
  </div>
</template>

<script>
import toolMixIn from "./tools";
export default {
  name: "uploadList",
  mixins: [toolMixIn],
  components: {},
  data() {
    return {};
  },
  props: {
    tips: {
      type: String,
      default: "只能上传jpg/png文件，且不超过500kb",
    },
    obj: {
      type: Object,
      default() {
        return {};
      },
    },
    fileKey: {
      type: String,
      default: "url",
    },
    beforeUpload: {
      type: Function,
    },
    handleFileSuccessBack: {
      type: Function,
    },
    handlerFileRemoveBack: {
      type: Function,
    },
    accept: {
      type: String,
    },
  },
  watch: {
    xxx: {},
  },
  created() {},
  methods: {},
};
</script>

<style scoped lang='scss'>
</style>