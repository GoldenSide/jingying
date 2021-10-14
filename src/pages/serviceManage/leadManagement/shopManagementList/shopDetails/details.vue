<!---*
* @description 
* @fileName details.vue
* @author 龙伟
* @date 2020/12/10 15:17:16
*--->
<template>
  <div class="companyInfo-contaniner">
    <goBack />
    <div class="companyInfo-top">
      <contHeader :titleText="$route.meta.title" />
      <span
        class="company-status"
        v-show="dataList['is_del_str']"
        :class="{ active: dataList.is_del == 0 }"
        >{{ dataList["is_del_str"] }}</span
      >
    </div>
    <div class="conditions-content conditions-block">
      <div class="lists">
        <h3 class="company-item company-item-title">店铺基本信息</h3>
        <ul>
          <li
            class="company-item"
            v-for="(item, index) in itemConfig"
            :key="index"
          >
            <label>{{ item.label }}</label>
            <div>{{ dataList[item.prop] }}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { shopInfoData } from "@/api/leadManagement/shopManagement";
export default {
  name: "",
  components: {},
  data() {
    return {
      search: {
        page: 1,
        page_size: 15,
      },
      pagination: {
        total: 0,
      },
      dataList: {},
      itemConfig: [
        { label: "店铺ID：", prop: "id" },
        { label: "店铺名称：", prop: "name" },
        { label: "公司名称：", prop: "company_name" },
        { label: "域名：", prop: "domain" },
        { label: "来源渠道：", prop: "source_text" },
        { label: "套餐类型：", prop: "platform_product_name" },
        { label: "套餐状态：", prop: "product_status_str" },
        { label: "套餐到期时间：", prop: "platform_product_expire_time" },
        { label: "注册邮箱：", prop: "email" },
        { label: "负责人：", prop: "leading_official" },
        { label: "手机号码：", prop: "phone" },
        { label: "注册时间：", prop: "created_at" },
      ],
    };
  },
  props: {},
  watch: {
    xxx: {},
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取详情信息
    getList() {
      shopInfoData({
        id: this.$route.query.id,
      }).then((res) => {
        // console.log(res);
        this.dataList = res.data;
      });
    },
  },
};
</script>

<style scoped lang="scss">
.company-item {
  line-height: 20px;
  padding-bottom: 16px;

  & > div {
    display: inline-block;
  }
}
.companyInfo-top {
  display: flex;
  align-items: center;
  .company-status {
    &.active {
      background-color: #bbe5b3;
    }
    margin-left: 8px;
    font-size: 12px;
    padding: 2px 8px;
    height: max-content;
    background-color: #ffc48b;
    border-radius: 100px;
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
