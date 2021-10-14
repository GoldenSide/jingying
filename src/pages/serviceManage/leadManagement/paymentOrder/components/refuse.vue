<!---*
* @description  工单驳回
* @fileName refuse.vue
* @author 叶金龙
* @date 2021/04/01 15:06:52
*--->
<template>
  <el-dialog
    title="工单审批驳回"
    :visible.sync="refuseVisible"
    width="634px"
    :before-close="simpleClose"
    :close-on-click-modal="false"
  >
    <ul class="lists">
      <li class="item" v-for="(item, index) in textConfig" :key="index">
        {{ item.label }}：{{ infoObj[item.prop] }}
      </li>
    </ul>
    <el-form
      :model="form"
      ref="form"
      :rules="rules"
      :inline="false"
      size="normal"
    >
      <p class="title"><i style="color: #ff4343">*</i>驳回原因</p>
      <el-form-item prop="reason">
        <el-input
          v-model="form.reason"
          type="textarea"
          maxlength="100"
          row="25"
          show-word-limit
          placeholder="最多输入100字"
        ></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer">
      <el-button @click="simpleClose" size="medium">取消</el-button>
      <el-button type="primary" @click="submit" size="medium"
        >确认驳回</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { refuseOrder } from "@/api/leadManagement/paymentOrder";
export default {
  name: "refuseOrder",
  components: {},
  data() {
    return {
      form: {
        reason: "",
      },
      rules: {
        reason: [
          {
            required: true,
            trigger: "change",
            message: "请输入驳回原因",
          },
        ],
      },
      textConfig: [
        {
          label: "工单编号",
          prop: "id",
        },
        {
          label: "公司名称",
          prop: "company_name",
        },
        {
          label: "公司类型",
          prop: "company_type_name",
        },
      ],
    };
  },
  props: {
    refuseVisible: {
      type: Boolean,
      default: false,
    },
    infoObj: {
      type: Object,
    },
    init: {
      type: Function,
      default() {
        return () => {
          return false;
        };
      },
    },
  },
  watch: {
    xxx: {},
  },
  created() {},
  methods: {
    simpleClose() {
      this.$emit("update:refuseVisible", false);
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.form.id = this.infoObj.id;
          refuseOrder(this.form).then((res) => {
            this.$message.success("操作成功");
            this.simpleClose();
            this.init();
          });
        }
      });
    },
  },
};
</script>

<style scoped lang='scss'>
.lists {
  .item {
    line-height: 22px;
    height: 22px;
    margin-bottom: 12px;
  }
}
.title {
  margin-bottom: 4px;
  height: 20px;
  line-height: 20px;
  i {
    line-height: 20px;
  }
}
</style>