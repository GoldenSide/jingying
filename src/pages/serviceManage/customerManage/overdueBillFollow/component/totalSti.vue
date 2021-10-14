<!---*
* @description 
* @fileName totalSti.vue
* @author 叶金龙
* @date 2021/04/02 14:23:12
*--->
<template>
  <div class="totalSti-container">
    <ul class="lists">
      <li class="item">
        逾期账单总金额($)：{{ totalModel.total_overdue_amount_usd || "--" }}
      </li>
      <li class="item">
        逾期账单总金额(￥)：{{ totalModel.total_overdue_amount || "--" }}
      </li>
    </ul>
  </div>
</template>

<script>
import { overdueTotal } from "@/api/serviceMn/customerMn/overdueBillFollow";
export default {
  name: "totalSti",
  components: {},
  data() {
    return {
      search: {
        search_words: "",
        search_id: null,
        page: 1,
        page_size: 10,
        ids: [],
      },
      totalModel: {},
    };
  },
  props: {
    ids: {
      type: Array,
      default() {
        return [];
      },
    },
    work_order_id: {
      type: [Number, String],
      default: null,
    },
  },
  watch: {
    ids: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val.length > 0) {
          this.search = { ...this.search, ...{ ids: val } };
          this.getTotal();
        }
      },
    },
    work_order_id: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val != null && val != "") {
          this.search = { ...this.search, ...{ work_order_id: val } };
          this.getTotal();
        }
      },
    },
  },
  created() {},
  methods: {
    getTotal() {
      overdueTotal(this.search).then((res) => {
        this.totalModel = res.data;
      });
    },
  },
};
</script>

<style scoped lang='scss'>
.totalSti-container {
  .lists {
    .item {
      margin-bottom: 12px;
      line-height: 22px;
    }
  }
}
</style>