<!---*
* @description 挂起
* @fileName putUp.vue
* @author 叶金龙
* @date 2021/05/27 14:20:40
*--->
<template>
  <el-dialog
    :title="reasonObj.title"
    :visible.sync="putUpVisible"
    width="634px"
    :before-close="simpleClose"
    :close-on-click-modal="false"
  >
    <el-form
      :model="reasonObj"
      ref="form"
      :rules="rules"
      label-position="top"
      label-width="80px"
      size="normal"
    >
      <el-form-item class="itemFrom" label="挂起标记" prop="hang_type">
        <el-select
          v-model="reasonObj.hang_type"
          placeholder="请选择挂起标记"
          clearable
          filterable
          @change="(val) => selectChange(val)"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="其他标记"
        prop="hang_remark"
        v-if="reasonObj.hang_type == 3"
      >
        <el-input
          v-model="reasonObj.hang_remark"
          show-word-limit
          type="textarea"
          maxlength="50"
          placeholder="请输入其他标记,最多可输入50字，超出不可输入"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="simpleClose" size="medium">取 消</el-button>
      <el-button type="primary" @click="submit(4)" size="medium"
        >挂 起</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "putUp",
  components: {},
  data() {
    return {
      rules: {
        hang_type: [
          {
            required: true,
            trigger: "change",
            message: "请选择挂起标记",
          },
        ],
        hang_remark: [
          {
            required: true,
            trigger: "change",
            message: "请输入其他标记",
          },
        ],
      },
      options: [
        {
          value: 1,
          label: "侵权",
        },
        {
          value: 2,
          label: "低价欺诈",
        },
        {
          value: 3,
          label: "其他",
        },
      ],
    };
  },
  props: {
    putUpVisible: {
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
        return {};
      },
    },
  },
  watch: {
    xxx: {},
  },
  created() {},
  methods: {
    simpleClose() {
      this.$emit("update:putUpVisible", false);
    },
    submit(type) {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.reasonObj.audit_type = type;
          // if (this.model.tag == 2) {
          //   this.$set(this.reasonObj, "hang_remark", this.model.hang_remark);
          // } else {
          //   this.$set(this.reasonObj, "hang_remark", this.options[this.model.tag].label);
          // }
          this.submitHandler(this.reasonObj);
          this.simpleClose();
        } else {
          return false;
        }
      });
    },
    selectChange(val) {
      if (val !== 3) {
        this.reasonObj.hang_remark = "";
      }
    },
  },
};
</script>

<style scoped lang="scss"></style>
