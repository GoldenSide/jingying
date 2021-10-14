<!---*
* @description  保存为画像标签
* @fileName saveTagDialog.vue
* @author 叶金龙
* @date 2021/03/08 18:23:19
*--->
<template>
  <el-dialog
    title="生成客户画像标签"
    :visible.sync="saveTagVisible"
    width="634px"
    :before-close="simpleClose"
    :close-on-click-modal="false"
  >
    <el-tag type="warning" v-if="msg" size="medium">
      <i class="el-icon-warning"></i>
      <span class="text">
        {{ msg }}
      </span>
    </el-tag>
    <el-form
      :model="tagModel"
      ref="form"
      :rules="rules"
      :inline="false"
      size="normal"
    >
      <el-form-item label="" prop="name">
        <el-input
          v-model="tagModel.name"
          placeholder="请输入客户标签,最多支持30字符，超出不可输入"
          size="normal"
          clearable
          maxlength="30"
          show-word-limit
          @input="tagNameChange"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="simpleClose" size="medium">取消</el-button>
      <el-button type="primary" @click="submit" size="medium">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "saveTagDialog",
  components: {},
  data() {
    return {
      rules: {
        name: [
          {
            required: true,
            type: "string",
            trigger: "change",
            message: "请输入客户画像标签名",
          },
        ],
      },
      msg: "",
    };
  },
  props: {
    saveTagVisible: {
      type: Boolean,
      default: false,
    },
    tagModel: {
      type: Object,
      default() {
        return {
          name: "",
        };
      },
    },
    save: {
      type: Function,
      default() {
        return function () {
          return false;
        };
      },
    },
    currentIndex: {
      type: Number,
      default: null,
    },
  },
  watch: {
    xxx: {},
  },
  created() {},
  methods: {
    tagNameChange() {
      this.tagModel.id = null;
      this.msg = "";
    },
    simpleClose() {
      this.$emit("update:saveTagVisible", false);
      if (this.currentIndex == null) {
        this.tagModel.name = "";
      }
      this.tagModel.id = null;
    },
    submit() {
      if (!this.validField()) {
        this.save()
          .then((res) => {})
          .catch((err) => {
            this.msg = err.message;
          });
      }
    },
    validField() {
      let namebool;
      this.$refs["form"].validateField("name", (valid) => {
        namebool = valid;
      });
      return namebool;
    },
  },
};
</script>

<style scoped lang='scss'>
.el-dialog__body {
  .el-tag {
    display: block;
    width: 100%;
    height: 36px;
    line-height: 36px;
    background: #fdf3e1;
    border: 1px solid #e6cfa1;
    margin-bottom: 16px;
    .el-icon-warning {
      font-size: 16px;
      color: #f2b63c;
    }
    .text {
      color: #303133;
      font-size: 14px;
      margin-left: 8px;
    }
  }
}
</style>