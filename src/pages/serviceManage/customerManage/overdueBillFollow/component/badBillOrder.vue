<!---*
* @description  坏账申请单
* @fileName badBillOrder.vue
* @author 叶金龙
* @date 2021/03/27 20:48:22
*--->
<template>
  <el-dialog
    :title="topTitle"
    :visible.sync="badbillVisible"
    width="634px"
    :before-close="simpleClose"
    :close-on-click-modal="false"
  >
    <companyBasicInfo v-if="arr.length > 0" :arr="arr" />
    <totalSti :ids="isEdit ? ids : []" :work_order_id="work_order_id" />
    <div class="remarkBox" v-if="isEdit">
      <p class="title">备注</p>
      <el-form :model="form" ref="form" :inline="false" size="normal">
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
    <div class="remarkLine" v-else>备注：{{ arr[0].remark || "--" }}</div>
    <orderTable :ids="isEdit ? ids : []" :work_order_id="work_order_id" />
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
import { createBillOrder } from "@/api/serviceMn/customerMn/overdueBillFollow";
export default {
  name: "createBadBillOrder",
  components: { orderTable, totalSti, companyBasicInfo },
  data() {
    return {
      form: {
        company_id: null,
        type: 2,
        remark: "",
        ids: [],
      },
    };
  },
  props: {
    badbillVisible: {
      type: Boolean,
      default: false,
    },
    arr: {
      type: Array,
      default() {
        return [];
      },
    },
    topTitle: {
      type: String,
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
  watch: {
    xxx: {},
  },
  created() {},
  methods: {
    simpleClose() {
      this.$emit("update:badbillVisible", false);
    },
    submit() {
      this.form.company_id = this.arr[0].company_id;
      this.form.ids = this.ids;
      this.utils.deleConfig(
        this,
        "是否确认提交工单，确认则进入工单审批环节；可在【查看历史工单】中查看提交的工单进度",
        "提交工单",
        ["确 定", "取 消"],
        this.act(),
        null
      );
    },
    act() {
      return () => {
        createBillOrder(this.form).then((res) => {
          this.simpleClose();
          this.init();
        });
      };
    },
  },
  computed: {},
};
</script>
<style scoped lang='scss'>
.remarkBox {
  .title {
    line-height: 22px;
    margin-bottom: 4px;
  }
}
.remarkLine {
  margin-bottom: 16px;
}
</style>