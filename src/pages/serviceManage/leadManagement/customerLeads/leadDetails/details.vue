<!---*
* @description 
* @fileName details.vue
* @author 龙伟
* @date 2020/11/06 14:33:52
*--->
<template>
  <div class="leadDetails-contaniner">
    <goBack />
    <div class="company-top">
      <contHeader :titleText="$route.meta.title" />
      <span
        class="company-status"
        v-show="statusType[auditDetailInfo.status]"
        :class="{
          active: auditDetailInfo.status == 1,
          refuse: auditDetailInfo.status == 2,
        }"
      >
        {{ statusType[auditDetailInfo.status] }}
      </span>
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
            <div v-if="item.prop == 'source_code_name'">
              {{
                auditDetailInfo[item.prop] ? auditDetailInfo[item.prop] : "官网"
              }}
            </div>
            <div v-else>{{ auditDetailInfo[item.prop] }}</div>
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
            <div>{{ auditDetailInfo[item.prop] }}</div>
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
              {{ auditDetailInfo.province_name }}{{ auditDetailInfo.city_name
              }}{{ auditDetailInfo[item.prop] }}
            </div>
            <div v-else-if="item.label === '团队人数'">
              {{ enterpriseSize[auditDetailInfo[item.prop] - 1] }}
            </div>
            <div v-else-if="auditDetailInfo[item.prop] === '0'">没有</div>
            <div v-else-if="auditDetailInfo[item.prop] === '1'">有</div>
            <div v-else>{{ auditDetailInfo[item.prop] }}</div>
          </li>
        </ul>
      </div>
    </div>
    <div class="conditions-content conditions-block material">
      <div class="lists">
        <h3 class="company-item company-item-title">附件资料</h3>
        <div>
          <label>纳税人识别号：</label>
          <span>{{ auditDetailInfo.taxpayer_identity }}</span>
        </div>
        <ul>
          <li
            class="company-item company-item-title"
            v-for="(item, index) in itemConfig.attachedInformation"
            :key="index"
            :class="{ active: index > 0 ? true : false }"
          >
            <div class="user-img">
              <div class="topTitle">{{ item.label }}</div>
              <el-image
                fit="contain"
                :src="getSmallImage[index]"
                :preview-src-list="[auditDetailInfo[item.prop]]"
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
      <div class="lists company-item-bottom">
        <h3 class="company-item company-item-title">备注</h3>
        <ul>
          <li class="company-item company-server-list">
            <div>{{ auditDetailInfo.remarks }}</div>
          </li>
        </ul>
      </div>
    </div>
    <div class="btn" v-if="auditDetailInfo.status == '0'">
      <el-button type="primary" size="medium" @click="rejectedPass"
        >通过</el-button
      >
      <el-button
        type="danger"
        :disabled="btnDisabled"
        @click="rejectedShow"
        size="medium"
        >驳回</el-button
      >
    </div>
    <!-- 拒绝原因 -->
    <div class="rejected">
      <el-dialog
        title="驳回原因"
        :visible="rejectedVisible"
        :before-close="rejectedClose"
        :close-on-click-modal="false"
        width="634px"
      >
        <div class="content">
          <p>原因</p>
          <el-input
            type="textarea"
            placeholder="请输入驳回原因，最多可输入200字，超出不可输入"
            v-model="rejectedVal"
            maxlength="200"
            show-word-limit
            :autosize="true"
            resize="none"
          >
          </el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="rejectedClose" size="medium">取 消</el-button>
          <el-button
            type="primary"
            size="medium"
            @click="submit"
            :loading="rejectedLoading"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
    <!-- 改变公司类型 -->
    <el-dialog
      title="修改公司类型"
      :visible.sync="dialogSelectVisible"
      :before-close="dialogSelectInfo"
      width="634px"
      :close-on-click-modal="false"
    >
      <el-select
        v-model="company_type"
        placeholder="请选择"
        style="width: 100%; margin: 34px 0"
      >
        <el-option
          v-for="item in typeData"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSelectInfo" :disabled="passLoading" size="medium"
          >取 消</el-button
        >
        <el-button
          type="primary"
          :loading="passLoading"
          size="medium"
          @click="changeTypeData"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  auditDetail,
  reviewRejected,
  approved,
} from "@/api/leadManagement/customerLeads";
import { companyTypeList } from "@/api/common";
export default {
  name: "customerReview",
  components: {},
  data() {
    return {
      itemConfig: {
        company_type: [
          { label: "注册类型：", prop: "register_type_str" },
          { label: "注册来源：", prop: "source_code_str" },
          { label: "入驻申请提交时间：", prop: "created_at" },
          { label: "提交人：", prop: "user_name" },
        ],
        userInfo: [
          { label: "姓名：", prop: "concat_name" },
          { label: "手机号：", prop: "phone" },
          { label: "邮箱：", prop: "email" },
          { label: "企业/个人名称：", prop: "company_name" },
          { label: "注册时间：", prop: "updated_at" },
        ],
        corporateInformation: [
          { label: "公司负责人", prop: "company_leader" },
          { label: "管理员手机", prop: "admin_phone" },
          { label: "地址", prop: "address" },
          { label: "团队人数", prop: "team_size" },
          { label: "资金规模", prop: "fund_size" },
          { label: "是否有电商经验", prop: "is_use_commerce_str" },
          { label: "国内电商平台", prop: "internal_commerce_platform" },
          { label: "是否有跨境电商经验", prop: "is_use_cross_border" },
          { label: "电商平台", prop: "commerce_platform" },
          { label: "是否有独立站经验", prop: "is_use_independent_site" },
          { label: "曾经使用过的独立站", prop: "use_independent_sites" },
          { label: "是否注册过Xshoppy", prop: "is_register_xshoppy_str" },
          { label: "月订单量", prop: "order_sum_per_month" },
          { label: "月流水", prop: "gmv_per_month" },
          { label: "销售产品类型", prop: "sale_product_type" },
          { label: "已开通渠道数", prop: "canal_sum" },
        ],
        attachedInformation: [
          { label: "营业执照", prop: "bussiness_license" },
          { label: "法人身份证人像页", prop: "id_card_front" },
          { label: "法人身份证国徽页", prop: "id_card_back" },
        ],
      },
      auditDetailInfo: {},
      enterpriseSize: [
        "1-5人",
        "6-10人",
        "11-20人",
        "21-50人",
        "51-100人",
        "100人以上",
      ],
      statusType: ["待处理", "已通过", "已拒绝"],
      rejectedLoading: false,
      passLoading: false,
      rejectedVal: "",
      rejectedVisible: false,
      btnDisabled: false,
      dialogSelectVisible: false,
      company_type: "3",
      typeData: [],
    };
  },
  props: {},
  watch: {
    xxx: {},
  },
  created() {
    this.getAuditDetailData(this.$route.query.id);
    this.initResource()
  },
  methods: {
    // 获取公司类型
    initResource() {
      return new Promise((resolve, reject) => {
        companyTypeList().then((res) => {
          this.typeData = res.data.list;
          resolve();
        });
      });
    },
    dialogSelectInfo(){
      this.dialogSelectVisible = false
      this.company_type = "3"
    },
    // 获取详情
    getAuditDetailData(id) {
      auditDetail({ id }).then((res) => {
        this.auditDetailInfo = res.data;
        // console.log(res);
      });
    },
    rejectedClose() {
      this.rejectedVisible = false;
    },
    // 拒绝原因
    rejectedShow() {
      this.rejectedVisible = true;
    },
    // 驳回申请
    submit() {
      let id = this.$route.query.id;
      if (!this.rejectedVal.trim()) {
        this.$message.error("请输入拒绝原因");
        return;
      }
      this.rejectedLoading = true;
      reviewRejected({
        id,
        reject_reason: this.rejectedVal,
      }).then((res) => {
        console.log(res);
        if (res.code == 0) {
          this.getAuditDetailData(id);
          this.$message({
            message: "操作成功，已驳回",
            type: "success",
          });
          this.$router.go(-1);
        } else {
          this.rejectedLoading = false;
        }
      });
      setTimeout(() => {
        // this.rejectedLoading = false;
        this.rejectedVisible = false;
      }, 500);
    },
    // 通过审核
    changeTypeData(){
      this.btnDisabled = true;
      let id = this.$route.query.id;
      this.passLoading = true;
      approved({
        id,
        company_type: this.company_type
      })
        .then(res => {
          // console.log(res);
          if (res.code == 0) {
            this.dialogSelectInfo()
            this.$message({
              message: "操作成功，审核通过",
              type: "success"
            });
            this.passLoading = false
            this.$router.go(-1);
          }
        })
        .catch(err => {
          this.btnDisabled = false;
          this.passLoading = false;
        });
    },
    // 通过审核弹窗
    rejectedPass() {
      this.dialogSelectVisible = true;
    },
  },
  computed: {
    getSmallImage() {
      let value = [];
      this.itemConfig.attachedInformation.map((item) => {
        value.push(
          this.auditDetailInfo[item.prop] +
            "?x-oss-process=image/resize,w_120,m_lfit"
        );
      });
      return value;
    },
  },
};
</script>

<style scoped lang="scss">
.leadDetails-contaniner {
  .conditions-content {
    &.conditions-block {
      margin-bottom: 16px;
    }
    &.material {
      label {
        font-size: 14px;
        color: #1c3246;
      }
    }
    .lists {
      padding: 16px 16px 0;
      box-sizing: border-box;
      color: #303133;
      font-size: 14px;
      &.company-item-bottom {
        padding-bottom: 16px;
      }
      .company-item-title {
        font-size: 16px;
        font-weight: 600;
        color: #1c3246;
        &.active {
          display: inline-block;
          margin-right: 82px;
        }
        .user-img {
          .topTitle {
            font-size: 14px;
            font-weight: 500;
            color: #000000;
            line-height: 20px;
            margin: 20px 0 10px;
          }
          /deep/ .el-image {
            width: 120px;
            height: 120px;
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
        &.company-server-list {
          border-top: 1px solid #dfe3e8;
          padding: 11px 0px;
          box-sizing: border-box;
          & > div {
            width: 100%;
            // min-height: 100px;
          }
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
.rejected {
  .content {
    padding: 30px 0;
    & > p {
      color: #212b36;
      margin-bottom: 4px;
    }
  }
}
</style>
