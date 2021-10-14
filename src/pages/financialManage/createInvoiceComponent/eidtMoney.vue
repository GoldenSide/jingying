<!---*
* @description  开票金额操作
* @fileName eidtMoney.vue
* @author 叶金龙
* @date 2021/06/09 11:14:40
*--->
<template>
  <div class="moneyEdit-container">
    <el-form
      :model="dataObj"
      ref="form"
      :rules="rules"
      label-position="top"
      size="medium"
    >
      <el-form-item
        prop="invoice_amount"
        :label="isPaypal == true ? '开票金额($)' : '开票金额(￥)'"
      >
        <span class="editText" @click="editMoney">{{
          noEdit ? "编辑" : "置灰"
        }}</span>
        <el-input
          v-model="dataObj.invoice_amount"
          placeholder="请输入开票金额"
          :disabled="noEdit"
          clearable
          type="number"
        ></el-input>
      </el-form-item>
      <el-form-item label="开票类型" prop="invoice_type">
        <el-select
          v-model="dataObj.invoice_type"
          placeholder="请输入选择开票类型"
          size="medium"
          :disabled="isPaypal"
          @change="invoiceTypeChange"
        >
          <el-option
            v-for="(item, index) in invoiceType"
            :key="index"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目名称" prop="invoice_title">
        <el-input
          v-model="dataObj.invoice_title"
          placeholder="请输入项目名称"
          size="medium"
          disabled
          clearable
        >
        </el-input>
      </el-form-item>
      <el-form-item
        label="发票号码"
        prop="invoice_no"
        v-if="dataObj.invoice_type != '1'"
      >
        <el-input
          v-model="dataObj.invoice_no"
          placeholder="请输入发票号码"
          size="medium"
          maxlength="15"
          show-word-limit
          type="text"
          clearable
        >
        </el-input>
      </el-form-item>
      <el-form-item
        label="开票日期"
        prop="invoice_date"
        v-if="dataObj.invoice_type != '1'"
      >
        <el-date-picker
          v-model="dataObj.invoice_date"
          type="date"
          value-format="yyyy/MM/dd"
          format="yyyy/MM/dd"
          clearable
          placeholder="选择开票日期"
        >
        </el-date-picker>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import enums from "@/utils/enums";
export default {
  name: "eidtMoney",
  components: {},
  data() {
    return {
      rules: {
        invoice_amount: {
          required: true,
          message: "开票金额不能为空",
        },
        invoice_no: {
          required: true,
          message: "请输入发票号码",
        },
        invoice_date: {
          required: true,
          message: "请选择开票日期",
        },
      },
      invoiceType: enums.invoiceType,
      noEdit: true,
    };
  },
  props: {
    dataObj: {
      type: Object,
      default() {
        return {};
      },
    },
    isPaypal: {
      type: Boolean,
      default: false,
    },
    totalMoney: {
      type: String,
    },
  },
  watch: {
    totalMoney: {
      immediate: true,
      handler(val) {
        this.dataObj.invoice_amount = val;
      },
    },
  },
  created() {},
  methods: {
    editMoney() {
      this.noEdit = !this.noEdit;
    },
    invoiceTypeChange(val) {
      if (val == "1") {
        this.dataObj.invoice_no = "";
      }
      if (val !== "2") {
        this.$parent.$parent.$refs.two.clearValid();
      }
    },
    validateForm() {
      return this.$refs["form"].validate();
    },
  },
};
</script>

<style scoped lang="scss">
.moneyEdit-container {
  padding-top: 16px;
  border-bottom: 1px solid #e6e6e6;
}
.el-form /deep/ .el-form-item__label {
  padding-bottom: 4px;
  width: 100%;
}
.el-form-item {
  margin-bottom: 16px;
  .el-date-editor {
    width: 100%;
  }
  .el-form-item__content {
    position: relative;
    .editText {
      position: absolute;
      right: 0;
      top: -36px;
      cursor: pointer;
      color: #409eff;
    }
  }
}
</style>
