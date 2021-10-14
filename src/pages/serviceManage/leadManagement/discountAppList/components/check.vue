<!---*
* @description 
* @fileName check.vue
* @author 龙伟
* @date 2020/12/11 16:44:36
*--->
<template>
  <div>
    <el-dialog
      title="客户优惠申请单审核"
      :visible.sync="checkVisible"
      width="634px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <ul>
        <li v-for="(item, index) in checkList" :key="index">
          <label>{{ item.label }}</label>
          <span>{{ checkData[item.prop] }}</span>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="submit">确定</el-button>
        <el-button size="medium" type="danger" @click="refuseVisible = true"
          >驳回</el-button
        >
      </span>
    </el-dialog>
    <!-- 拒绝原因 -->
    <el-dialog
      title="驳回原因"
      :visible="refuseVisible"
      width="30%"
      :before-close="refuseClose"
      :close-on-click-modal="false"
    >
      <div>
        <el-input
          type="textarea"
          placeholder="请输入驳回原因"
          v-model="refuseVal"
          maxlength="200"
          show-word-limit
        >
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="refuseClose">取消</el-button>
        <el-button size="medium" type="primary" @click="refuse">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  discountPass,
  discountReject
} from "@/api/leadManagement/discountAppList";
export default {
  name: "",
  components: {},
  data() {
    return {
      checkList: [
        {
          label: "工单编号：",
          prop: "apply_id"
        },
        {
          label: "公司名称：",
          prop: "company_name"
        },
        {
          label: "优惠项：",
          prop: "discount_type_name"
        },
        {
          label: "折扣率：",
          prop: "discount_rate"
        },
        {
          label: "生效时间：",
          prop: "begin_time"
        },
        {
          label: "失效时间：",
          prop: "end_time"
        },
        {
          label: "申请时间：",
          prop: "created_at"
        },
        {
          label: "申请人：",
          prop: "apply_user_name"
        }
      ],
      addItemConfig: {
        trading_comm: [
          { label: "原价(%)：", prop: "original_price" },
          { label: "优惠价(%)：", prop: "discount_price" }
        ],
        shop_rent: [
          { label: "原价(￥)：", prop: "original_price" },
          { label: "原价($)：", prop: "original_price_dollar" },
          { label: "优惠价(￥)：", prop: "discount_price" },
          { label: "优惠价($)：", prop: "discount_price_dollar" }
        ]
      },
      refuseVisible: false,
      refuseVal: ""
    };
  },
  props: {
    checkVisible: {
      type: Boolean,
      default: false
    },
    checkData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  watch: {
    checkData: {
      immediate: true,
      deep: true,
      handler(val) {
        if (Object.keys(val).length > 0) {
          let { discount_type } = val;
          if (discount_type == 1) {
            // console.log('店租');
            this.checkList.splice(-5, 0, ...this.addItemConfig.shop_rent);
            // console.log(this.checkList);
          } else {
            // console.log('交易佣金');
            this.checkList.splice(-5, 0, ...this.addItemConfig.trading_comm);
            // console.log(this.checkList);
          }
        }
      }
    }
  },
  created() {},
  methods: {
    submit() {
      // console.log("111");
      discountPass({
        id: this.checkData.id
      }).then(res => {
        // console.log(res);
        if (res.code == 0) {
          this.handleClose();
          this.$message.success("操作成功,已通过");
          this.$parent.getList();
        }
      });
    },
    refuse() {
      if (!this.refuseVal) {
        this.$message.error("请输入驳回原因");
        return;
      }
      discountReject({
        id: this.checkData.id,
        reject_reason: this.refuseVal
      }).then(res => {
        // console.log(res);
        if (res.code == 0) {
          this.refuseClose();
          this.handleClose();
          this.$message.success("操作成功,已驳回申请");
          this.$parent.getList();
        }
      });
    },
    handleClose() {
      this.$emit("update:checkVisible", false);
    },
    refuseClose() {
      this.refuseVal = "";
      this.refuseVisible = false;
    }
  }
};
</script>

<style scoped lang="scss">
ul {
  li {
    padding-bottom: 16px;
    &:last-child {
      padding-bottom: 0;
    }
  }
}
</style>
