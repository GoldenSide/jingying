<!---*
* @description 
* @fileName details.vue
* @author 龙伟
* @date 2020/11/03 18:02:10
*--->
<template>
  <div class="companyInfo-contaniner">
    <!-- <goBack /> -->
    <div class="company-top">
      <contHeader :titleText="$route.meta.title" />
      <!-- <span
        class="company-status"
        v-show="companyTypeInfo['status_text']"
        :class="{ active: isActive }"
        >{{ companyTypeInfo["status_text"] }}</span
      > -->
    </div>

    <div class="conditions-content conditions-block">
      <div class="lists">
        <ul>
          <li
            class="company-item"
            v-for="(item, index) in itemConfig.company_type"
            :key="index"
          >
            <label>{{ item.label }}</label>
            <div>{{ companyTypeInfo[item.prop] }}</div>
          </li>
        </ul>
      </div>
    </div>
    <div class="conditions-content conditions-block">
      <div class="lists">
        <h3 class="company-item company-item-title">基本信息</h3>
        <ul>
          <li
            class="company-item"
            v-for="(item, index) in itemConfig.userInfo"
            :key="index"
          >
            <label>{{ item.label }}</label>
            <div>{{ companyTypeInfo[item.prop] }}</div>
          </li>
        </ul>
      </div>
    </div>
    <div class="conditions-content conditions-block">
      <div class="lists">
        <h3 class="company-item company-item-title">企业信息</h3>
        <ul>
          <li
            class="company-item"
            v-for="(item, index) in itemConfig.corporateInformation"
            :key="index"
          >
            <label>{{ item.label }}：</label>
            <div v-if="item.label === '地址'">
              {{
                companyTypeInfo.province_name +
                  companyTypeInfo.city_name +
                  companyTypeInfo[item.prop]
              }}
            </div>
            <div v-else-if="item.label === '团队人数'">
              {{ enterpriseSize[companyTypeInfo[item.prop] - 1] }}
            </div>
            <div
              v-else-if="
                item.label === '是否有电商经验' ||
                  item.label === '是否有跨境电商经验' ||
                  item.label === '是否有独立站经验'
              "
            >
              {{ companyTypeInfo[item.prop] == 0 ? "没有" : "有" }}
            </div>
            <div v-else-if="item.label === '是否注册过XShoppy'">
              {{ companyTypeInfo[item.prop] == 0 ? "否" : "是" }}
            </div>
            <div v-else>{{ companyTypeInfo[item.prop] }}</div>
          </li>
        </ul>
      </div>
    </div>
    <div class="conditions-content conditions-block material">
      <div class="lists">
        <h3 class="company-item company-item-title">附件资料</h3>
        <p class="company-item">
          <span>纳税人识别号：</span>
          <span>{{ companyTypeInfo.taxpayer_identity }}</span>
        </p>
        <ul>
          <li
            class="company-item company-item-title"
            v-for="(item, index) in itemConfig.attachedInformation"
            :key="index"
            :class="{ active: index > 0 ? true : false }"
          >
            <label>{{ item.label }}</label>
            <div class="user-img">
              <el-image
                fit="contain"
                :src="getSmallImage[index]"
                :preview-src-list="[companyTypeInfo[item.prop]]"
              >
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="conditions-content conditions-block">
      <div class="lists">
        <h3 class="company-item company-item-title">服务及授权</h3>
        <ul>
          <li class="company-item">
            <label>授权店铺数：</label>
            <div>{{ companyTypeInfo.shop_num }}</div>
          </li>
          <li class="company-item">
            <label>开通的服务：</label>
            <div v-if="isShow">未开通任何服务</div>
            <div v-else class="company-server">
              <ul>
                <li class="company-server-list th">
                  <label>服务</label>
                  <span>供应商</span>
                </li>
                <li
                  class="company-server-list"
                  v-for="(item, index) in server"
                  :key="index"
                >
                  <label>{{ item.key }}</label>
                  <span>{{ item.value }}</span>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="conditions-content conditions-block">
      <div class="lists">
        <h3 class="company-item company-item-title">客户跟进情况</h3>
        <ul>
          <li class="company-item">
            <label>是否分配售前：</label>
            <span>
              {{
                companyTypeInfo.assign_pre_sale_text
                  ? companyTypeInfo.assign_pre_sale_text
                  : "未分配"
              }}
            </span>
          </li>
          <li class="company-item">
            <label>是否分配售后：</label>
            <span>{{
              companyTypeInfo.assign_after_sale_text
                ? companyTypeInfo.assign_after_sale_text
                : "未分配"
            }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { companyInfo } from "@/api/leadManagement/companyList";
export default {
  name: "companyList",
  components: {},
  data() {
    return {
      itemConfig: {
        company_type: [
          { label: "注册类型：", prop: "register_type_text" },
          { label: "注册来源：", prop: "source_code_str" },
          { label: "公司状态：", prop: "status_text" },
          { label: "注册邮箱：", prop: "email" },
          { label: "入驻申请提交时间：", prop: "official_create_date" },
          { label: "提交人：", prop: "official_user_name" },
          { label: "客户关联标签：", prop: "tag_name" },
          { label: "客户级别：", prop: "level_name" }
        ],
        userInfo: [
          { label: "姓名：", prop: "leading_official" },
          { label: "手机号：", prop: "phone" },
          { label: "联系邮箱：", prop: "yunz_email" },
          { label: "企业/个人名称：", prop: "company_name" },
          { label: "注册时间：", prop: "created_at" }
        ],
        corporateInformation: [
          { label: "公司负责人", prop: "company_leader" },
          { label: "管理员手机", prop: "admin_phone" },
          { label: "地址", prop: "address" },
          { label: "团队人数", prop: "team_size" },
          { label: "资金规模", prop: "fund_size" },
          { label: "是否有电商经验", prop: "is_use_commerce" },
          { label: "国内电商平台", prop: "internal_commerce_platform" },
          { label: "是否有跨境电商经验", prop: "is_use_cross_border" },
          { label: "电商平台", prop: "commerce_platform" },
          { label: "是否有独立站经验", prop: "is_use_independent_site" },
          { label: "曾经使用过的独立站", prop: "use_independent_sites" },
          { label: "是否注册过XShoppy", prop: "is_register_xshoppy" },
          { label: "月订单量", prop: "order_sum_per_month" },
          { label: "月流水", prop: "gmv_per_month" },
          { label: "销售产品类型", prop: "sale_product_type" },
          { label: "已开通渠道数", prop: "canal_sum" }
        ],
        attachedInformation: [
          { label: "营业执照", prop: "bussiness_license" },
          { label: "法人身份证人像页", prop: "id_card_front" },
          { label: "法人身份证国徽页", prop: "id_card_back" }
        ]
      },
      enterpriseSize: [
        "1-5人",
        "6-10人",
        "11-20人",
        "21-50人",
        "51-100人",
        "100人以上"
      ],
      companyTypeInfo: {},
      isActive: false,
      isShow: null,
      server: []
      // scrList: [],
    };
  },
  props: {},
  watch: {
    xxx: {}
  },
  created() {},
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (Object.keys(to.query).length > 0) {
        companyInfo(to.query).then(res => {
          //   console.log(res);
          vm.companyTypeInfo = res.data;
          // vm.scrList = [
          //   vm.companyTypeInfo.bussiness_license,
          //   vm.companyTypeInfo.id_card_front,
          //   vm.companyTypeInfo.id_card_back,
          // ];
          if (res.data.status_text == "启用") {
            vm.isActive = true;
          }
          //   当没有开通服务时该字段为数组，有开通则为对象
          if (res.data.server instanceof Array) {
            vm.isShow = true;
          } else {
            vm.isShow = false;
            vm.dealSearverType(res.data.server);
          }
          //   console.log(vm.companyTypeInfo);
        });
      }
    });
  },
  methods: {
    //   处理开通的店铺参数
    dealSearverType(obj) {
      let arr = [];
      for (let key in obj) {
        let o = {};
        let str = obj[key].join(",");
        o.key = key;
        o.value = str;
        arr.push(o);
        // console.log(key, str);
      }
      this.server = arr;
    }
  },
  computed: {
    getSmallImage() {
      let value = [];
      this.itemConfig.attachedInformation.map(item => {
        // if (this.companyTypeInfo[item.prop]) {
        value.push(
          this.companyTypeInfo[item.prop] +
            "?x-oss-process=image/resize,w_120,m_lfit"
        );
        // }
      });
      return value;
    }
  }
};
</script>

<style scoped lang="scss">
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
        &.active {
          display: inline-block;
          margin-right: 82px;
        }
        .user-img {
          width: 120px;
          height: 120px;
          // padding: 24px 10px;
          box-sizing: border-box;
          display: block;
          margin-top: 10px;
          cursor: pointer;
          background-color: #f2f3f5;
          /deep/ .el-image {
            width: 100%;
            height: 100%;
            background: #f2f3f5;
            border-radius: 2px;
            border: 1px solid #dadde3;
            .image-slot {
              width: 100%;
              height: 100%;
              font-size: 30px;
              display: flex;
              justify-content: center;
              align-items: center;
              background: #f5f7fa;
              color: #909399;
            }
          }
        }
      }
      .company-item {
        line-height: 20px;
        padding-bottom: 16px;

        & > div {
          display: inline-block;
        }
        .company-server {
          display: block;
          margin-top: 16px;
          .company-server-list {
            border-top: 1px solid #dfe3e8;
            padding: 11px 16px;
            box-sizing: border-box;
            &:last-child {
              border-bottom: 1px solid #dfe3e8;
            }
            &.th {
              label,
              span {
                font-weight: 500;
                color: #212b36;
              }
            }
            label {
              width: 250px;
              display: inline-block;
            }
          }
        }
      }
    }
  }
}
.btn {
  margin-top: 34px;
}
.company-top {
  display: flex;
  .company-status {
    &.active {
      background-color: #bbe5b3;
    }
    margin-top: 3px;
    margin-left: 8px;
    font-size: 12px;
    padding: 2px 8px;
    height: max-content;
    background-color: #ffc48b;
    border-radius: 100px;
  }
}
</style>
