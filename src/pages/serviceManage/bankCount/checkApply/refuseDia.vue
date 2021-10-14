<!---*
* @description 
* @fileName refuseDia.vue
* @author 叶金龙
* @date 2020/11/06 18:47:42
*--->
<template>
  <el-dialog
    title="驳回备注"
    :visible.sync="refuseVisible"
    width="40%"
    :before-close="beforeClose"
  >
    <el-form
      :model="form"
      ref="form"
      :rules="rules"
      label-width="80px"
      :inline="false"
      size="normal"
    >
      <el-form-item label="驳回原因" prop="reasons">
        <el-input
          v-model="form.reasons"
          type="textarea"
          maxlength="50"
          row="20"
          show-word-limit
        ></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer">
      <el-button @click="simpleClose" size="mini">取 消</el-button>
      <el-button type="primary" size="mini" @click="submit" :loading="loading"
        >确认驳回</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {
      form: {
        audit: "-2",
        reasons: "",
      },
      rules: {
        reasons: {
          trigger: "change",
          required: true,
          message: "请填写驳回原因",
        },
      },
      loading: false,
    };
  },
  props: {
    refuseVisible: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    xxx: {},
  },
  created() {},
  methods: {
    beforeClose() {
      this.$confirm("确认放弃本次操作？", "提示")
        .then((_) => {
          this.simpleClose();
        })
        .catch((_) => {
          return false;
        });
    },
    simpleClose() {
      this.$emit("update:refuseVisible", false);
    },
    submit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$parent.handlerClick(this.form);
          setTimeout(() => {
            this.loading = false;
            this.simpleClose();
          }, 300);
        }
      });
    },
  },
};
</script>

<style scoped lang='scss'>
/deep/ .el-textarea {
  .el-textarea__inner {
    height: 80px;
  }
}
</style>