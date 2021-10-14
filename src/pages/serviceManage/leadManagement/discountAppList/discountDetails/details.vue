<!---*
* @description 
* @fileName details.vue
* @author 龙伟
* @date 2020/12/14 20:41:04
*--->
<template>
  <div class="companyInfo-contaniner">
    <goBack />
    <div class="companyInfo-top">
      <contHeader :titleText="$route.meta.title" />
      <span
        class="company-status"
        :class="{
          active: row.status == 2,
          refuse: row.status == 3,
        }"
      >
        {{ row.status_name }}
      </span>
    </div>
    <div class="conditions-content conditions-block">
      <div class="lists">
        <h3 class="company-item company-item-title">工单信息</h3>
        <ul>
          <li
            class="company-item"
            v-for="(item, index) in newItemConfig"
            :key="index"
          >
            <label>{{ item.label }}</label>
            <div>{{ row[item.prop] }}</div>
          </li>
        </ul>
      </div>
    </div>
    <div class="conditions-content conditions-block" v-if="row.status == 3">
      <div class="lists">
        <h3 class="company-item company-item-title">驳回原因</h3>
        <ul>
          <li
            class="company-item"
            v-for="(item, index) in rejectConfig"
            :key="index"
          >
            <label>{{ item.label }}</label>
            <div>{{ row[item.prop] }}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "discountReview",
  components: {},
  data() {
    return {
      row: {},
      itemConfig: [
        { label: "工单编号：", prop: "apply_id" },
        { label: "公司名称：", prop: "company_name" },
        { label: "优惠项：", prop: "discount_type_name" },
        { label: "折扣率(%)：", prop: "discount_rate" },
        { label: "生效时间：", prop: "begin_time" },
        { label: "失效时间：", prop: "end_time" },
        { label: "申请时间：", prop: "created_at" },
        { label: "申请人：", prop: "apply_user_name" },
      ],
      passConfig: [
        { label: "审批人：", prop: "auditor" },
        { label: "审批时间：", prop: "audited_at" },
      ],
      rejectConfig: [
        { label: "驳回原因：", prop: "reject_reason" },
        { label: "驳回时间：", prop: "audited_at" },
        { label: "审批人：", prop: "auditor" },
      ],
      addItemConfig: {
        trading_comm: [
          { label: "原价(%)：", prop: "original_price" },
          { label: "优惠价(%)：", prop: "discount_price" },
        ],
        shop_rent: [
          { label: "原价(￥)：", prop: "original_price" },
          { label: "原价($)：", prop: "original_price_dollar" },
          { label: "优惠价(￥)：", prop: "discount_price" },
          { label: "优惠价($)：", prop: "discount_price_dollar" },
        ],
      },
    };
  },
  props: {},
  watch: {},
  created() {
    this.getRowData();
  },
  computed: {
    newItemConfig() {
      if (this.row.discount_type == 1) {
        this.itemConfig.splice(-5, 0, ...this.addItemConfig.shop_rent);
      } else {
        this.itemConfig.splice(-5, 0, ...this.addItemConfig.trading_comm);
      }
      if (this.row.status == 2) {
        this.itemConfig = [...this.itemConfig, ...this.passConfig];
      }
      return this.itemConfig;
    },
  },
  methods: {
    getRowData() {
      this.row = JSON.parse(this.$route.query.row);
    },
  },
};
</script>

<style scoped lang="scss">
.companyInfo-top {
  display: flex;
  align-items: center;
  .company-status {
    &.active {
      background-color: #bbe5b3;
    }
    &.refuse {
      background-color: #ffc48b;
    }
    margin-left: 8px;
    font-size: 12px;
    padding: 2px 8px;
    height: max-content;
    background-color: #ffea8a;
    border-radius: 100px;
  }
}
.company-item {
  line-height: 20px;
  padding-bottom: 16px;

  & > div {
    display: inline-block;
  }
}
.companyInfo-contaniner {
  .conditions-content {
    &.conditions-block {
      margin-bottom: 16px;
    }
    &.material {
      label {
        font-size: 14px;
        font-weight: 600;
        color: #1c3246;
      }
    }
    .lists {
      padding: 16px 16px 0;
      box-sizing: border-box;
      color: #303133;
      font-size: 14px;
      .company-item-title {
        font-size: 16px;
        font-weight: 600;
        color: #1c3246;
      }
    }
  }
}
</style>
