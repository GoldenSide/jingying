<!---*
* @description 
* @fileName upload.vue
* @author 龙伟
* @date 2020/11/21 16:49:24
*--->
<template>
  <div>
    <el-upload
      class="avatar-uploader"
      action="#"
      :http-request="uploadToOssSuccess"
      :on-success="handleFileSuccess"
      :before-upload="beforeFileUpload"
      :show-file-list="false"
    >
      <div v-if="editForm[userImgType]" style="width: 120px; height: 120px">
        <img :src="editForm[userImgType]" alt="" srcset="" />
        <span class="customize-action">
          <span
            class="el-upload-list_item-preview"
            @click.stop="bigImgVisible = true"
          >
            <i class="el-icon-zoom-in" style="font-size: 16px"></i>
          </span>
          <span
            class="el-upload-list_item-delete"
            @click.stop="editForm[userImgType] = ''"
          >
            <i class="el-icon-delete" style="font-size: 16px"></i>
          </span>
        </span>
      </div>
      <i v-else class="el-icon-upload avatar-uploader-icon"
        ><span>{{ content }}</span></i
      >
    </el-upload>
    <div class="tip">{{ tip }}</div>
    <el-dialog title="查看大图" :visible.sync="bigImgVisible">
      <img width="100%" :src="editForm[userImgType]" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import toolMixIn from "./tools";
export default {
  name: "uploadMenu",
  mixins: [toolMixIn],
  components: {},
  data() {
    return {
      bigImgVisible: false,
    };
  },
  props: {
    editForm: {
      type: Object,
      default() {
        return {};
      },
    },
    userImgType: {
      type: String,
    },
     tip: {
      type: String,
    },
     content: {
      type: String,
    },
    tipText: {
      type: Object,
      default() {
        return {};
      },
    },
    handleFileSuccess: {
      type: Function,
    },
    beforeFileUpload: {
      type: Function,
    },
  },
  watch: {
    xxx: {},
  },
  created() {},
  methods: {
  },
};
</script>

<style scoped lang='scss'>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  width: 120px;
  height: 120px;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 32px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
  position: relative;
  span {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 20%;
  }
}
.avatar-uploader {
  width: 120px;
  display: block;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}
.customize-action {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0px;
  top: 0;
  color: #fff;
  opacity: 0;
  font-size: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    opacity: 1;
  }
  span {
    width: 50%;
    height: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
    &.el-upload-list_item-preview {
      justify-content: flex-end;
      padding-right: 10px;
    }
    &.el-upload-list_item-delete {
      padding-left: 10px;
    }
  }

  &::after {
    display: inline-block;
    content: "";
    height: 100%;
    vertical-align: middle;
  }
}
</style>