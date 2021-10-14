<!---*
* @description  发票抬头
* @fileName invoiceTitle.vue
* @author 叶金龙
* @date 2021/06/09 11:15:55
*--->
<template>
  <div class="invoiceTitle-section">
    <el-form
      :model="dataObj"
      ref="form"
      :rules="rules"
      label-position="top"
      label-width="80px"
      size="medium"
    >
      <el-form-item
        label="抬头类型"
        prop="invoice_title_type"
        label-position="left"
      >
        <el-radio-group
          v-model="dataObj.invoice_title_type"
          @change="invoiceTitleChange"
        >
          <el-radio label="1"> 企业 </el-radio>
          <el-radio label="2"> 个人/其他 </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="抬头名称" prop="invoice_company_name">
        <el-input
          v-model="dataObj.invoice_company_name"
          :placeholder="
            dataObj.invoice_title_type == '1'
              ? '请输入企业名称'
              : '请输入个人名称'
          "
          maxlength="50"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item
        label="税号"
        prop="invoice_company_tax_number"
        v-if="dataObj.invoice_title_type == '1'"
      >
        <el-input
          v-model="dataObj.invoice_company_tax_number"
          placeholder="请输入税号(15~20字符)"
          size="medium"
          maxlength="20"
          show-word-limit
        >
        </el-input>
      </el-form-item>
      <el-form-item
        :label="item.label"
        :prop="item.prop"
        v-for="(item, index) in itemConfig"
        :key="index + 5"
      >
        <el-input
          v-model="dataObj[item.prop]"
          :placeholder="item.placeholder"
          size="medium"
          :maxlength="item.maxlength" 
          show-word-limit
          type="text"
        >
        </el-input>
      </el-form-item> 
    </el-form>
  </div>
</template>

<script>
import { checkEmail, checkPhone } from "@/utils/validate";
export default {
  name: "invoiceTitleSection",
  components: {},
  data() {
    return {
      rules: {
        invoice_company_name: {
          required: true,
          message: "请输入抬头名称"
        },
        invoice_company_tax_number: {
          required: true,
          validator: (rule, value, callback) => {
            let reg = /^[A-Z0-9]{15}$|^[A-Z0-9]{17}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/;
            if (!value) {
              callback(new Error("税号不能为空"));
            } else if (value.trim().length < 15) {
              callback(new Error("税号为15~20个字符"));
            } else if (!reg.test(value)) {
              callback(new Error("税号不合规"));
            } else {
              callback();
            }
          }
        },
        address: {
          required: false,
          message: "请输入地址"
        },
        mobile: {
          required: false,
          validator: checkPhone,
          trigger: "blur"
        },
        bank_name: {
          required: false,
          message: "请输入开户行"
        },
        bank_no: {
          required: false,
          message: "请输入银行账户"
        },
        invoice_receive_email: {
          required: true,
          validator: checkEmail,
          trigger: "blur"
        }
      },
      itemConfig: [
        {
          label: "地址",
          prop: "address",
          maxlength: 100,
          placeholder: "请输入地址"
        },
        {
          label: "电话",
          prop: "mobile",
          maxlength: 20,
          placeholder: "请输入电话"
        },
        {
          label: "开户行",
          prop: "bank_name",
          maxlength: 50,
          placeholder: "请输入开户行"
        },
        {
          label: "银行账号",
          prop: "bank_no",
          maxlength: 50,
          placeholder: "请输入银行账号"
        },
        {
          label: "收票邮箱",
          prop: "invoice_receive_email",
          maxlength: 50,
          placeholder: "请输入收票邮箱"
        }
      ]
    };
  },
  props: {
    dataObj: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  watch: {
    "dataObj.invoice_type": {
      immediate: true,
      handler(val) {
        if (val.length > 0) {
          for (const [key, value] of Object.entries(this.rules)) {
            if (
              key == "invoice_company_name" ||
              key == "invoice_company_tax_number" ||
              key == "invoice_receive_email"
            )
              continue;
            this.rules[key].required = val == "2" ? true : false;
          }
        }
      }
    }
  },
  created() {},
  methods: {
    invoiceTitleChange(val) {
      this.dataObj.invoice_company_tax_number = "";
    },
    validateForm() {
      return this.$refs["form"].validate();
    },
    clearValid() {
      this.$refs["form"].clearValidate([
        "address",
        "mobile",
        "bank_name",
        "bank_no"
      ]);
    }
  },
  computed: {}
};
</script>

<style scoped lang="scss">
.invoiceTitle-section {
  padding-top: 16px;
}
.el-form /deep/ .el-form-item__label {
  padding-bottom: 4px;
}
.el-form-item {
  margin-bottom: 16px;
  &:first-child {
    /deep/ .el-form-item__content {
      display: inline-block;
      margin-left: 16px;
      height: 22px;
      line-height: 22px;
    }
    /deep/ .el-form-item__label {
      height: 22px;
      line-height: 22px;
      padding-bottom: 0;
    }
  }
  .el-date-editor {
    width: 100%;
  }
}
</style>
