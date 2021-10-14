<!---*
* @description 
* @fileName gradeList.vue
* @author 龙伟
* @date 2020/11/16 11:01:13
*--->
<template>
  <div class="grade-contaniner">
    <el-dialog
      :title="topStr + '级别'"
      :visible.sync="gradeFormVisible"
      :before-close="beforeClose"
      :close-on-click-modal="false"
      width="634px"
    >
      <el-form :model="form" :rules="rules" ref="gradeForm">
        <el-form-item label="客户级别" prop="name">
          <el-input
            v-model="form.name"
            maxlength="50"
            show-word-limit
            :disabled="isEdit"
          ></el-input>
        </el-form-item>
        <el-form-item label="级别描述" prop="note">
          <el-input
            type="textarea"
            autosize
            placeholder="请输入内容"
            v-model="form.note"
            maxlength="200"
            show-word-limit
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="gradeClose" size="medium">取 消</el-button>
        <el-button type="primary" @click="submit" size="medium" :loading="loading"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addGrade, editGrade } from "@/api/leadManagement/level";
export default {
  name: "gradeMenu",
  components: {},
  data() {
    return {
      dialogFormVisible: false,
      form: {
        name: "",
        note: "",
      },
      rules: {
        name: [{ required: true, message: "请输入级别", trigger: "blur" }],
        note: [{ required: true, message: "请填写级别描述", trigger: "blur" }],
      },
      loading: false,
      id: null,
      isEdit: false,
    };
  },
  props: {
    gradeFormVisible: {
      type: Boolean,
      default: false,
    },
    topStr: {
      type: String,
      default: "",
    },
    gradeObj: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  watch: {
    gradeObj: {
      immediate: true,
      deep: true,
      handler(val) {
        if (Object.keys(val).length > 0) {
          let { id, name, note } = val;
          this.form.name = name;
          this.form.note = note;
          this.id = id;
          this.isEdit = true;
        }
      },
    },
  },
  created() {},
  methods: {
    submit() {
      this.$refs["gradeForm"].validate((valid) => {
        if (valid) {
          this.loading = true
          if (Object.keys(this.gradeObj).length > 0) {
            editGrade({
              id: this.id,
              note: this.form.note,
            }).then((res) => {
              console.log(res);
              if (res.code == 0) {
                this.$message({
                  message: "修改成功",
                  type: "success",
                });
                this.gradeClose();
                this.$parent.getList();
              } else {
                this.$message.error(res.msg);
              }
            });
          } else {
            addGrade(this.form).then((res) => {
              console.log(res);
              if (res.code == 0) {
                this.$message({
                  message: "新增成功",
                  type: "success",
                });
                this.gradeClose();
                this.$parent.getList();
              } else {
                this.$message.error(res.msg);
              }
            });
          }
        } else {
          return false;
        }
        this.loading = false
      });
    },
    gradeClose() {
      this.$emit("update:gradeFormVisible", false);
      this.isEdit = false;
    },
    beforeClose() {
      this.gradeClose()
    },
  },
};
</script>

<style scoped lang='scss'>
.grade-contaniner {
  .el-form-item__label {
    font-size: 14px;
  }
}
</style>