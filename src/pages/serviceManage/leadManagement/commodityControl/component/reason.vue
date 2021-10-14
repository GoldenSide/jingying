<!---*
* @description   审核原因
* @fileName reason.vue
* @author 叶金龙
* @date 2021/01/19 18:32:07
*--->
<template>
  <div class="reason-contaniner">
    <el-dialog
      :title="reasonObj.title"
      :visible.sync="reasonVisible"
      width="634px"
      append-to-body
      :before-close="simpleClose"
      :close-on-click-modal="false"
      class="reason-dialog"
    >
      <el-form
        :model="reasonObj"
        ref="form"
        :rules="rules"
        label-position="top"
        label-width="80px"
        size="normal"
      >
        <el-form-item label="原因" prop="audit_reason">
          <el-input
            v-model="reasonObj.audit_reason"
            show-word-limit
            type="textarea"
            maxlength="200"
            placeholder="请输入判定原因，最多可输入200字，超出不可输入"
          ></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="simpleClose" size="medium">取 消</el-button>
        <el-button type="danger" @click="submit('mutil')" size="medium"
          >违 规</el-button
        >
        <el-button
          type="primary"
          @click="submit(1)"
          size="medium"
          v-if="this.reasonObj.audit_source != 3"
          >合 规</el-button
        >
      </span>
    </el-dialog>
    <illegal :illegalVisible.sync="illegalVisible" :postCheck="postCheck" />
  </div>
</template>

<script>
import illegal from "./illegal.vue";
export default {
  name: "checkReason",
  components: { illegal },
  data() {
    return {
      rules: {
        audit_reason: {
          required: true,
          trigger: "change",
          message: "请输入判定原因",
        },
      },
      illegalVisible: false,
    };
  },
  props: {
    reasonVisible: {
      type: Boolean,
      default: false,
    },
    submitHandler: {
      type: Function,
      default() {
        return function () {
          return false;
        };
      },
    },
    reasonObj: {
      type: Object,
      default() {
        return {
          title: "",
        };
      },
    },
  },
  watch: {
    reasonVisible: {
      immediate: true,
      handler(val) {},
    },
  },
  created() {},
  methods: {
    simpleClose() {
      this.$emit("update:reasonVisible", false);
    },
    submit(type) {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (type == "mutil") {
            this.illegalVisible = true;
          } else {
            this.postCheck(type);
          }
        } else {
          return false;
        }
      });
    },
    postCheck(type) {
      this.reasonObj.audit_type = type;
      this.submitHandler(this.reasonObj);
      this.simpleClose();
    },
  },
};
</script>

<style scoped lang="scss"></style>
