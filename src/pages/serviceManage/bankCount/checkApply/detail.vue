<!---*
* @description 
* @fileName detail.vue
* @author 叶金龙
* @date 2020/11/04 16:56:49
*--->
<template>
  <div class="checkApplyDetail-container">
    <goBack />
    <contHeader :titleText="$route.meta.title" />
    <div class="steps">
      <ul class="lists">
        <li class="item" v-for="(item, index) in statusArr" :key="index">
          <span
            :class="[
              'index',
              {
                active: dataInfo.status == item.value && dataInfo.status !== '-2',
                refuse: item.value == '-2' && dataInfo.status == '-2',
                past:
                  Number(dataInfo.status) > Number(item.value) ||
                  (dataInfo.status == '-2' && item.value == '-1'),
              },
            ]"
          >
            <i
              class="el-icon-check"
              v-if="
                Number(dataInfo.status) > Number(item.value) ||
                (item.value == '-1' && dataInfo.status == '-2')
              "
            ></i>
            <i class="el-icon-close" v-else-if="dataInfo.status == '-2'"></i>
            <i v-else>{{ index + 1 }}</i>
          </span>
          <span class="text">{{ item.text }}</span>
          <span
            :class="[
              'line',
              {
                past:
                  Number(dataInfo.status) > Number(item.value) ||
                  (dataInfo.status == '-2' && item.value == '-1'),
              },
            ]"
            v-if="index < statusArr.length - 1"
          ></span>
        </li>
      </ul>
    </div>
    <div class="detailPanel">
      <ul class="lists" v-for="(item, index) in infoConfig" :key="index">
        <div class="title">{{ item.title }}</div>
        <li class="item" v-for="(v, i) in item.config" :key="i">
          <span class="label">{{ v.label }}:</span>
          <span class="text"> {{ dataInfo[v.prop] }}</span>
        </li>
      </ul>

      <ul class="lists">
        <div class="title">附件资料</div>
        <div class="picBox">
          <div class="top">
            <div class="pic">
              <div class="topTitle">营业执照</div>

              <el-image
                :src="dataInfo.bussiness_license"
                :preview-src-list="srcList(0)"
                :lazy="true"
                fit="contain"
                alt="营业执照"
              >
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </div>
          </div>
          <div class="bottom">
            <div class="pic">
              <div class="topTitle">法人身份证人像页</div>

              <el-image
                :src="dataInfo.id_card_front"
                :preview-src-list="srcList(1)"
                :lazy="true"
                fit="contain"
                alt="法人身份证人像页"
              >
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </div>
            <div class="pic">
              <div class="topTitle">法人身份证国徽页</div>

              <el-image
                :src="dataInfo.id_card_back"
                :preview-src-list="srcList(2)"
                :lazy="true"
                fit="contain"
                alt="法人身份证国徽页"
              >
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </div>
          </div>
        </div>
      </ul>
      <ul class="lists" v-if="dataInfo.status == '-2'">
        <div class="title">驳回备注</div>
        <li class="item">
          驳回原因：<span style="color: #f56c6c">{{ dataInfo.reject_reason }}</span>
        </li>
      </ul>
    </div>

    <div class="elb" v-if="dataInfo.status == -1">
      <el-button
        type="primary"
        size="mini"
        :loading="loading"
        @click="handlerClick({ audit: '1' })"
        >通 过</el-button
      >
      <el-button type="danger" size="mini" @click="refuse">驳 回</el-button>
    </div>
    <refuseDia :refuseVisible.sync="refuseVisible" v-if="refuseVisible" />
  </div>
</template>

<script>
import refuseDia from "./refuseDia";
import { countInfo, checkCount } from "@/api/bankCount/checkApply";
export default {
  name: "countInfo",
  components: { refuseDia },
  data() {
    return {
      isCheck: false,
      loading: false,
      dataInfo: {},
      infoConfig: [
        {
          title: "公司信息",
          config: [
            { label: "公司名称", prop: "company_name" },
            { label: "公司编码", prop: "company_code" },
            { label: "法人", prop: "leading_official" },
            { label: "地址", prop: "address" },
            { label: "客户类型", prop: "company_type_name" },
            { label: "店铺数", prop: "shop_num" },
            { label: "注册时间", prop: "created_at" },
          ],
        },
        {
          title: "银行卡信息",
          config: [
            { label: "银行", prop: "bank_name" },
            { label: "卡号", prop: "bank_card_no" },
            { label: "开户行", prop: "bank_open_name" },
            { label: "开户人", prop: "bank_open_person" },
          ],
        },
        {
          title: "申请人信息",
          config: [
            { label: "申请人姓名", prop: "apply_person" },
            { label: "申请人身份证号", prop: "apply_user_id_no" },
            { label: "电话", prop: "apply_mobile" },
            { label: "邮箱", prop: "apply_email" },
            { label: "申请时间", prop: "apply_date" },
          ],
        },
      ],
      statusArr: [
        {
          value: "-1",
          text: "待审核",
        },
        {
          value: "-2",
          text: "已驳回",
        },
        {
          value: "1",
          text: "待银行开通",
        },
        {
          value: "2",
          text: "银行账户已开通",
        },
      ],
      refuseVisible: false,
    };
  },
  props: {},
  watch: {
    xxx: {},
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (Object.keys(to.query).length > 0) {
        vm.isCheck = true;
        countInfo(to.query).then((res) => {
          let { data } = res;

          // for (let key in data) {
          //   if (
          //     key == "id_card_front" ||
          //     key == "id_card_back" ||
          //     key == "bussiness_license"
          //   ) {
          //     if (data[key]) {
          //       vm.$set(
          //         data,
          //         key + "_compress",
          //         data[key] + "?x-oss-process=image/  resize,w_120,m_lfit"
          //       );
          //     }
          //   }
          // }

          vm.dataInfo = data;
          if (data.status == "-2") {
            vm.statusArr.splice(2, 2);
          } else {
            vm.statusArr.splice(1, 1);
          }
        
        });
      }
    });
  },
  created() {},
  methods: {
    handlerClick(model) {
      this.loading = true;
      checkCount({ id: this.dataInfo.id, ...model }).then((res) => {
        this.$router.go(-1);
        this.loading = false;
      });
    },
    refuse() {
      this.refuseVisible = true;
    },
  },
  computed: {
    srcList() {
      return function (index) {
        let arr = [this.dataInfo.id_card_front, this.dataInfo.id_card_back];
        let arrIndex;
        if (
          this.dataInfo.bussiness_license &&
          this.dataInfo.bussiness_license.length > 0
        ) {
          arr.unshift(this.dataInfo.bussiness_license);
          arrIndex = index;
        } else {
          arrIndex = index - 1;
        }
        return [...arr.slice(arrIndex), ...arr.slice(0, arrIndex)];
      };
    },
  },
};
</script>

<style scoped lang="scss">
.checkApplyDetail-container {
  .steps {
    .lists {
      height: 54px;
      display: flex;
      justify-content: center;
      align-items: center;
      .item {
        flex-basis: 200px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin: 0 20px;
        .index {
          display: inline-block;
          width: 32px;
          height: 32px;
          border-radius: 20px;
          text-align: center;
          line-height: 32px;
          border: 1px solid #d2d3d7;
          &.active {
            background-color: #faaa1e;
            color: #fff;
            border: none;
            outline: none;
          }
          &.refuse {
            background-color: #f56c6c;
            color: #fff;
            border: none;
            outline: none;
          }
          &.past {
            color: #faaa1e;
            border: 1px solid #faaa1e;
          }
        }
        .text {
          font-size: 16px;
          color: rgba(0, 0, 0, 0.85);
          line-height: 24px;
          font-weight: 400;
          margin: 0 8px;
        }
        .line {
          flex: 1;
          display: inline-block;
          border-top: 1px solid rgba(0, 0, 0, 0.15);
          &.past {
            border-top: 1px solid #faaa1e;
          }
        }
      }
    }
  }
  .detailPanel {
    .lists {
      background: #ffffff;
      box-shadow: 0px 1px 3px 0px rgba(35, 35, 112, 0.12),
        0px 0px 0px 1px rgba(67, 67, 145, 0.05);
      border-radius: 4px;
      padding: 16px;
      &:not(:first-child) {
        margin-top: 16px;
      }
      .title {
        font-size: 16px;
        font-weight: 600;
        color: #1c3246;
        line-height: 22px;
      }
      .item {
        font-size: 14px;
        font-weight: 400;
        color: #303133;
        line-height: 20px;
        margin-top: 16px;
      }
      .picBox {
        .top,
        .bottom {
          .pic {
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
        .bottom {
          display: flex;
          .pic {
            margin-right: 82px;
          }
        }
      }
    }
  }
  .elb {
    margin-top: 32px;
  }
}
</style>
