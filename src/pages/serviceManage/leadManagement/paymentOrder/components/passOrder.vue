<!---*
* @description  工单通过
* @fileName passOrder.vue
* @author 叶金龙
* @date 2021/04/07 14:16:18
*--->
<template>
  <el-dialog
    title="回款工单审批通过"
    :visible.sync="passOrderVisible"
    width="634px"
    :before-close="simpleClose"
    :close-on-click-modal="false"
  >
    <div class="remarkLine">工单编号：{{ arr[0].id }}</div>
    <companyBasicInfo v-if="arr.length > 0" :arr="arr" />
    <totalSti :work_order_id="work_order_id" />
    <div class="remarkLine">
      本次回款金额({{ arr[0].amount_type == "1" ? "￥" : "$" }})：{{
        arr[0].amount || "--"
      }}
    </div>
    <div class="remarkBox">
      <el-form
        :model="form"
        ref="form"
        :rules="rules"
        :inline="false"
        size="normal"
      >
        <p class="title"><i style="color: #ff4343">*</i>&nbsp;确认回款金额</p>
        <el-form-item prop="receivable_amount">
          <el-input
            placeholder="请输入内容"
            v-model="form.receivable_amount"
            clearable
            class="input-with-select"
            type="text"
            @input="(val) => inputAct(val, form)"
          >
            <el-select
              v-model="form.receivable_amount_type"
              slot="prepend"
              placeholder="请选择"
            >
              <el-option label="人民币" value="1"></el-option>
              <el-option label="美元" value="2"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <p class="title"><i style="color: #ff4343">*</i>&nbsp;确认回款时间</p>
        <el-form-item prop="receivable_time">
          <el-date-picker
            v-model="form.receivable_time"
            type="datetime"
            value-format="yyyy/MM/dd HH:mm:ss"
            format="yyyy/MM/dd HH:mm:ss"
            placeholder="选择回款时间"
            :picker-options="pickeroptions"
          >
          </el-date-picker>
        </el-form-item>
        <p class="title"><i style="color: #ff4343">*</i>&nbsp;第三方交易号</p>
        <el-form-item prop="trade_no">
          <el-input
            v-model="form.trade_no"
            placeholder="请输入第三方交易号"
            size="normal"
            clearable
            show-word-limit
            maxlength="50"
          ></el-input>
        </el-form-item>
        <p class="title"><i style="color: #ff4343">*</i>&nbsp;支付方式</p>
        <el-form-item prop="pay_way">
          <el-select
            v-model="form.pay_way"
            placeholder="请选择支付方式"
            clearable
            filterable
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
        <p class="title" style="margin-top: 12px">备注</p>
        <el-form-item prop="remark">
          <el-input
            v-model="form.audit_remark"
            maxlength="100"
            row="25"
            show-word-limit
            type="textarea"
            placeholder="最多输入100字"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <!-- <p class="payattention">系统暂不支持账单部分回款,请核对金额谨慎操作!</p> -->
    <span slot="footer">
      <el-button @click="simpleClose" size="medium">取消</el-button>
      <el-button type="primary" @click="submit" size="medium">提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import companyBasicInfo from "@/pages/serviceManage/customerManage/overdueBillFollow/component/basicInfo";
import totalSti from "@/pages/serviceManage/customerManage/overdueBillFollow/component/totalSti";
import { passPaymentOrder } from "@/api/leadManagement/paymentOrder";
export default {
  name: "passOrder",
  components: { companyBasicInfo, totalSti },
  data() {
    return {
      pickeroptions: {
        disabledDate: (time) => {
          return time.getTime() > Date.now();
        },
      },
      form: {
        id: null,
        receivable_amount_type: "1",
        receivable_amount: null,
        receivable_time: "",
        trade_no: "",
        pay_way: "",
        audit_remark: "",
      },
      rules: {
        receivable_amount: [
          {
            required: true,
            trigger: "change",
            message: "请输入回款金额",
          },
        ],
        receivable_time: [
          {
            required: true,
            trigger: "change",
            message: "请选择回款时间",
          },
        ],
        trade_no: [
          {
            required: true,
            trigger: "change",
            message: "请输入第三方交易号",
          },
        ],
        pay_way: [
          {
            required: true,
            trigger: "change",
            message: "请选择支付方式",
          },
        ],
      },
      options: [
        {
          label: "支付宝",
          value: "alipay",
        },
        {
          label: "银行卡",
          value: "bank",
        },
      ],
    };
  },
  props: {
    passOrderVisible: {
      type: Boolean,
      default: false,
    },
    arr: {
      type: Array,
      default() {
        return [];
      },
    },
    work_order_id: {
      type: [Number, String],
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
    arr: {
      immediate: true,
      handler(val) {},
    },
  },
  created() {},
  methods: {
    simpleClose() {
      this.$emit("update:passOrderVisible", false);
    },
    inputAct(val, obj) {
      obj.receivable_amount = obj.receivable_amount.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
      obj.receivable_amount = obj.receivable_amount.replace(/^\./g, ""); //验证第一个字符是数字
      obj.receivable_amount = obj.receivable_amount.replace(/\.{2,}/g, ""); //只保留第一个, 清除多余的
      obj.receivable_amount = obj.receivable_amount
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".");
      obj.receivable_amount = obj.receivable_amount.replace(
        /^(\-)*(\d+)\.(\d\d).*$/,
        "$1$2.$3"
      ); //只能输入两个小数
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.form.id = this.arr[0].id;
          this.utils.deleConfig(
            this,
            "<div style='border: 1px solid #E1B878;background: #FFF5EA;border-radius: 2px;color: #202223;margin-bottom:16px;padding:16px;display:flex;justify-content:flex-start;'><i class='iconfont icontishimianxing' style='color: #B98900;margin-right: 16px;font-size:20px;vertical-align:middle'></i><span>注意：系统暂不支持部分回款，请核对账单金额谨慎操作；一旦通过，工单对应账单将变更为“已支付”状态，且无法恢复<span></div>是否确认审批通过？",
            "提示",
            ["确 定", "取 消"],
            this.act(),
            null
          );
        }
      });
    },
    act() {
      return () => {
        passPaymentOrder(this.form)
          .then((res) => {
            this.simpleClose();
            this.init();
          })
          .catch((err) => {});
      };
    },
  },
};
</script>

<style scoped lang="scss">
.remarkBox {
  margin-bottom: 16px;
  /deep/ .input-with-select {
    .el-input-group__prepend {
      padding: 0;
    }
    .el-select {
      margin: 0;
      .el-input__inner {
        width: 96px;
      }
    }
  }
  .el-form {
    .el-form-item {
      margin-bottom: 16px;
      .el-form-item__content {
        .el-date-editor.el-input {
          width: 100%;
        }
      }
    }
  }
  .title {
    line-height: 22px;
    margin-bottom: 4px;
  }
}
.remarkLine {
  margin-bottom: 16px;
}
.payattention {
  color: #f2b63c;
  line-height: 22px;
  padding-top: 8px;
}
</style>
