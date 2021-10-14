<!---*
* @description  开票基础信息
* @fileName basicInfo.vue
* @author 叶金龙
* @date 2021/06/09 11:14:24
*--->
<template>
  <div class="invoiceBasic-container">
    <ul class="lists">
      <li class="item" v-for="(item, index) in lineConfig" :key="index">
        {{ item.label }}：{{ obj[item.key] || obj[item.keyAlias] }}
      </li>
      <li class="item">
        所选{{ invoice_source == "1" ? "账单佣金" : "流水" }}金额({{
          isPaypal ? "$)" : "￥)"
        }}：{{ totalMoney }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "invoiceBasicInfo",
  components: {},
  data() {
    return {
      lineConfig: [
        {
          label: "公司名称",
          key: "company_name",
        },
        {
          label: "公司类型",
          key: "company_type_name",
          keyAlias: "company_type",
        },
      ],
    };
  },
  props: {
    isPaypal: {
      type: Boolean,
      default: false,
    },
    obj: {
      type: Object,
      default() {
        return {};
      },
    },
    totalMoney: {
      type: String,
      default: "0.00",
    },
    invoice_source: {
      type: String,
      default: "1",
    },
  },
  watch: {
    xxx: {},
  },
  created() {},
  methods: {},
};
</script>

<style scoped lang='scss'>
.invoiceBasic-container {
  border-bottom: 1px solid #e6e6e6;
  .lists {
    .item {
      margin-bottom: 16px;
    }
  }
}
</style>