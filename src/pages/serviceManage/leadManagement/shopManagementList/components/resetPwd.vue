<!---*
* @description 重置密码
* @fileName resetPwd.vue
* @author 叶金龙
* @date 2021/04/25 11:38:13
*--->
<template>
  <el-dialog
    title="重置密码"
    :visible.sync="resetPwdVisible"
    width="634px"
    :before-close="simpleClose"
    :close-on-click-modal="false"
  >
    <el-form
      :model="form"
      ref="form"
      :rules="rules"
      :inline="false"
      size="normal"
    >
      <p><i style="color: #ff4343">*</i>密码</p>
      <el-form-item label="" prop="password">
        <el-input
          v-model.trim="form.password"
          placeholder="请输入新密码"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="simpleClose" size="medium">取消</el-button>
      <el-button type="primary" @click="submit" size="medium" :loading="loading"
        >确定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { updatePwd } from "@/api/leadManagement/shopManagement";
export default {
  name: "resetPwd",
  components: {},
  data() {
    return {
      form: {
        password: "",
      },
      rules: {
        password: [
          {
            required: true,
            trigger: "change",
            validator: (rule, value, callback) => {
              let reg = /^[^\u4e00-\u9fa5]+$/;
              if (!value) {
                callback(new Error("密码不能为空"));
              } else if (!reg.test(value)) {
                callback(new Error("密码中不可包含中文字符"));
              } else if (value.length < 6) {
                callback(new Error("密码长度不能小于6位"));
              } else {
                callback();
              }
            },
          },
        ],
      },
      loading: false,
      form: {
        name: "",
        password: "",
      },
    };
  },
  props: {
    resetPwdVisible: {
      type: Boolean,
      default: false,
    },
    init: {
      type: Function,
      default() {
        return () => {
          return false;
        };
      },
    },
    shop_name: {
      type: String,
    },
  },
  watch: {
    xxx: {},
  },
  created() {},
  methods: {
    simpleClose() {
      this.$emit("update:resetPwdVisible", false);
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.form.name = this.shop_name;
          updatePwd(this.form)
            .then((res) => {
              this.simpleClose();
              this.$message.success("重置密码成功");
              this.init();
              this.loading = false;
            })
            .catch((err) => {
              this.loading = false;
            });
        }
      });
    },
  },
};
</script>

<style scoped lang='scss'>
</style>