<!---*
* @description   回款工单
* @fileName paymentOrder.vue
* @author 叶金龙
* @date 2021/03/27 20:49:46
*--->
<template>
  <el-dialog
    :title="topTitle"
    :visible.sync="payMentVisible"
    width="634px"
    :before-close="simpleClose"
    :close-on-click-modal="false"
  >
    <companyBasicInfo v-if="arr.length > 0" :arr="arr" />
    <totalSti :ids="isEdit ? ids : []" :work_order_id="work_order_id" />
    <div class="remarkLine" v-if="!isEdit">
      本次回款金额({{ arr[0].amount_type == "1" ? "￥" : "$" }})：{{
        arr[0].amount || "--"
      }}
    </div>
    <div class="remarkLine" v-if="!isEdit">
      备注：{{ arr[0].remark || "--" }}
    </div>
    <div class="remarkBox" v-if="isEdit">
      <el-form
        :model="form"
        ref="form"
        :rules="rules"
        :inline="false"
        size="normal"
      >
        <p class="title"><i style="color: #ff4343">*</i>&nbsp;本次回款金额</p>
        <el-form-item prop="amount">
          <el-input
            placeholder="请输入内容"
            v-model="form.amount"
            clearable
            class="input-with-select"
            type="text"
            @input="(val) => inputAct(val, form)"
          >
            <el-select
              v-model="form.amount_type"
              slot="prepend"
              placeholder="请选择"
            >
              <el-option label="人民币" value="1"></el-option>
              <el-option label="美元" value="2"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <p class="title" style="margin-top: 12px">备注</p>

        <el-form-item prop="remark">
          <el-input
            v-model="form.remark"
            maxlength="100"
            row="25"
            show-word-limit
            type="textarea"
            placeholder="最多输入100字"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <p class="title" style="margin: 12px 0 4px">附件:</p>
    <upload
      v-if="isEdit"
      :tips="'上传文件大小不能超过5M,数量不大于5个,支持word/excel/pdf/jpg/png格式文件'"
      :beforeUpload="beforeUpload"
      :obj="form"
      :fileKey="'accessory'"
      :handleFileSuccessBack="onSuccessBack"
      :handlerFileRemoveBack="onRemoveBack"
      :accept="acceptType"
    />
    <fileList v-else :fileList="arr[0].accessory" />
    <div style="margin-top: 12px">
      <orderTable :ids="isEdit ? ids : []" :work_order_id="work_order_id" />
    </div>
    <!-- <p class="payattention" v-if="isEdit">
      系统暂不支持账单部分回款,请核对金额谨慎操作!
    </p> -->
    <span slot="footer" v-if="isEdit">
      <el-button @click="simpleClose" size="medium">取消</el-button>
      <el-button type="primary" @click="submit" size="medium">提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import orderTable from "./orderTable";
import totalSti from "./totalSti";
import companyBasicInfo from "./basicInfo";
import upload from "@/components/upload/upload";
import fileList from "@/components/fileList/list";
import { createBillOrder } from "@/api/serviceMn/customerMn/overdueBillFollow";
export default {
  name: "createpayMentOrder",
  components: { orderTable, totalSti, companyBasicInfo, upload, fileList },
  data() {
    return {
      form: {
        company_id: null,
        amount_type: "1",
        amount: null,
        type: 1,
        remark: "",
        ids: [],
        accessory: [],
      },
      rules: {
        amount: [
          {
            required: true,
            trigger: "change",
            message: "请输入回款金额",
          },
        ],
      },
      acceptType:
        ".jpg,.png,.pdf,.docx,.doc,.dot,.rtf,.txt,.xltx,.xls,.xlsm,.xlsb,.csv,.xml",
    };
  },
  props: {
    payMentVisible: {
      type: Boolean,
      default: false,
    },
    arr: {
      type: Array,
      default() {
        return [];
      },
    },
    isEdit: {
      type: Boolean,
      default: true,
    },
    init: {
      type: Function,
      default() {
        return () => {
          return false;
        };
      },
    },
    topTitle: {
      type: String,
    },
    work_order_id: {
      type: [Number, String],
    },
    ids: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  watch: {},
  created() {},
  methods: {
    simpleClose() {
      this.$emit("update:payMentVisible", false);
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.form.company_id = this.arr[0].company_id;
          this.form.ids = this.ids;
          this.utils.deleConfig(
            this,
            "<div style='border: 1px solid #E1B878;background: #FFF5EA;height: 54px;line-height:54px;border-radius: 2px;color: #202223;margin-bottom:16px; '><i class='iconfont icontishimianxing' style='color: #B98900;margin:0 16px;font-size:20px;vertical-align:middle'></i>注意：系统暂不支持账单部分回款,请核对金额谨慎操作!</div>是否确认提交工单，确认则进入工单审批环节；可在【查看历史工单】中查看提交的工单进度",
            "提交工单",
            ["确 定", "取 消"],
            this.act(),
            null
          );
        }
      });
    },
    act() {
      return () => {
        createBillOrder(this.form).then((res) => {
          this.simpleClose();
          this.init();
        });
      };
    },
    beforeUpload(file) {
      const fileSuffix = file.name.substring(file.name.lastIndexOf("."));
      const isTrue = this.acceptType.includes(fileSuffix);
      if (!isTrue) {
        this.$message.error(`上传文件仅支持${this.acceptType}格式`);
      }
      let isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        this.$message.error("上传文件大小不能超过5M");
      }
      let islengLt5 = this.form.accessory.length < 5;
      if (!islengLt5) {
        this.$message.error("上传文件个数不能超过5个");
      }
      return isLt5M && islengLt5 && isTrue;
    },
    onSuccessBack(res, { uid, name, response, status }) {
      if (status !== "success") return;
      this.form.accessory.push({
        uid,
        name,
        url: response.file_preview,
      });
    },
    onRemoveBack({ status }, obj) {
      if (status !== "success") return;
      this.form.accessory = obj;
    },
    inputAct(val, obj) {
      obj.amount = obj.amount.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
      obj.amount = obj.amount.replace(/^\./g, ""); //验证第一个字符是数字
      obj.amount = obj.amount.replace(/\.{2,}/g, ""); //只保留第一个, 清除多余的
      obj.amount = obj.amount
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".");
      obj.amount = obj.amount.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
    },
  },
  computed: {},
};
</script>

<style scoped lang='scss'>
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
  box-shadow: 0px -1px 0px #dfe3e8;
  padding-top: 8px;
}
</style>