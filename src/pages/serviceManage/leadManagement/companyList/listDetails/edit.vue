<!---*
* @description 
* @fileName edit.vue
* @author 龙伟
* @date 2020/11/19 16:18:41
*--->
<template>
  <div class="edit-contaniner">
    <goBack />
    <div class="edit-topText">
      <contHeader :titleText="$route.meta.title" />
      <span
        class="edit-status"
        v-show="editData.status_str"
        :class="{
          active: editData.status == 1,
          refuse: editData.status == 2,
        }"
      >
        {{ editData.status_str }}
      </span>
    </div>
    <el-form
      :model="editForm"
      :rules="rules"
      ref="editForm"
      class="demo-ruleForm"
    >
      <div class="conditions-content edit-content">
        <div class="edit-content-item">
          <el-form-item class="itemFrom" label="注册类型" prop="register_type">
            <el-select
              v-model="editForm.register_type"
              placeholder="请选择注册类型"
            >
              <el-option
                v-for="(item, index) in registerType"
                :key="index"
                :label="item.text"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="itemFrom" label="注册来源" prop="source_code">
            <el-select
              v-model="editForm.source_code"
              placeholder="请选择注册来源"
            >
              <el-option
                v-for="(item, index) in sourceCode"
                :key="index"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="itemFrom" label="公司状态" prop="">
            <el-input
              v-model="editForm.status_text"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item class="itemFrom" label="注册邮箱" prop="">
            <el-input v-model="editForm.email" :disabled="true"></el-input>
          </el-form-item>
        </div>
        <div class="edit-content-item">
          <el-form-item class="itemFrom" label="入驻申请提交时间" prop="">
            <el-input
              v-model="editForm.official_create_date"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item class="itemFrom" label="提交人" prop="">
            <el-input
              v-model="editForm.official_user_name"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item class="itemFrom" label="客户关联标签" prop="">
            <el-input v-model="editForm.tag_name" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item class="itemFrom" label="客户级别" prop="">
            <el-input v-model="editForm.level_name" :disabled="true"></el-input>
          </el-form-item>
        </div>
      </div>
      <!-- 基本信息 -->
      <div class="conditions-content edit-content">
        <h3>基本信息</h3>
        <div class="edit-content-item">
          <el-form-item class="itemFrom" label="姓名" prop="leading_official">
            <el-input
              v-model="editForm.leading_official"
              placeholder="请输入姓名"
            ></el-input>
          </el-form-item>
          <el-form-item class="itemFrom" label="手机号" prop="phone">
            <el-input
              placeholder="请输入手机号"
              v-model="editForm.phone"
            ></el-input>
          </el-form-item>
          <el-form-item class="itemFrom" label="联系邮箱" prop="yunz_email">
            <el-input
              v-model="editForm.yunz_email"
              placeholder="请输入联系邮箱"
            ></el-input>
          </el-form-item>
          <el-form-item
            class="itemFrom"
            label="企业/个人名称"
            prop="company_name"
          >
            <el-input
              v-model="editForm.company_name"
              placeholder="请输入企业/个人名称"
            ></el-input>
          </el-form-item>
          <div class="edit-content-item">
            <el-form-item class="itemFrom" label="注册时间" prop="created_at">
              <el-input
                v-model="editForm.created_at"
                :disabled="true"
              ></el-input>
            </el-form-item>
          </div>
        </div>
      </div>
      <!-- 企业信息 -->
      <div class="conditions-content edit-content">
        <h3>企业信息</h3>
        <div class="edit-content-item">
          <el-form-item
            class="itemFrom"
            label="公司负责人"
            prop="company_leader"
          >
            <el-input
              v-model="editForm.company_leader"
              show-word-limit
              maxlength="50"
              placeholder="请输入公司负责人"
            ></el-input>
          </el-form-item>
          <el-form-item class="itemFrom" label="管理员手机" prop="admin_phone">
            <el-input
              v-model="editForm.admin_phone"
              placeholder="请输入管理员手机"
            ></el-input>
          </el-form-item>
          <el-form-item class="itemFrom" label="省" prop="province_name">
            <el-select
              v-model="editForm.province_name"
              @change="proviceChange"
              placeholder="请选择省份"
            >
              <el-option
                v-for="(item, index) in provinceName"
                :key="index"
                :label="item.district"
                :value="item.district"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="itemFrom" label="市" prop="city_name">
            <el-select v-model="editForm.city_name" placeholder="请选择市区">
              <el-option
                v-for="(item, index) in cityName"
                :key="index"
                :label="item.district"
                :value="item.district"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="itemFrom" label="详细地址" prop="address">
            <el-input
              v-model="editForm.address"
              placeholder="请输入详细地址"
            ></el-input>
          </el-form-item>
          <el-form-item class="itemFrom" label="已开店渠道数" prop="canal_sum">
            <el-input
              v-model="editForm.canal_sum"
              placeholder="请输入已开店渠道数"
            ></el-input>
          </el-form-item>
          <el-form-item class="itemFrom" label="团队人数" prop="team_size">
            <el-select
              v-model="editForm.team_size"
              placeholder="请选择团队人数"
            >
              <el-option
                v-for="(item, index) in teamSizeStr"
                :key="index"
                :label="item.text"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="itemFrom" label="资金规模" prop="fund_size">
            <el-input
              v-model="editForm.fund_size"
              show-word-limit
              maxlength="20"
              placeholder="请输入资金规模"
            ></el-input>
          </el-form-item>
          <el-form-item
            class="itemFrom"
            label="是否有电商经验"
            prop="is_use_commerce"
          >
            <el-select
              v-model="editForm.is_use_commerce"
              placeholder="请选择是否有电商经验"
            >
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="editForm.is_use_commerce == '1'"
            class="itemFrom"
            label="国内电商平台"
            prop="internal_commerce_platform"
          >
            <el-input
              v-model="editForm.internal_commerce_platform"
              placeholder="请输入国内电商平台"
            ></el-input>
          </el-form-item>
          <el-form-item
            class="itemFrom"
            label="是否有跨境电商经验"
            prop="is_use_cross_border"
          >
            <el-select
              v-model="editForm.is_use_cross_border"
              placeholder="请选择"
            >
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            class="itemFrom"
            v-if="editForm.is_use_cross_border == '1'"
            label="电商平台"
            prop="commerce_platform"
          >
            <el-input
              v-model="editForm.commerce_platform"
              placeholder="请输入电商平台"
            ></el-input>
          </el-form-item>
          <el-form-item
            class="itemFrom"
            label="是否有独立站经验"
            prop="is_use_independent_site"
          >
            <el-select
              v-model="editForm.is_use_independent_site"
              placeholder="请选择"
            >
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            class="itemFrom"
            v-if="editForm.is_use_independent_site == '1'"
            label="曾经使用过的独立站"
            prop="use_independent_sites"
          >
            <el-input
              v-model="editForm.use_independent_sites"
              placeholder="请输入曾经使用过的独立站"
            ></el-input>
          </el-form-item>
          <el-form-item
            class="itemFrom"
            label="是否注册过XShoppy"
            prop="is_register_xshoppy"
          >
            <el-select
              v-model="editForm.is_register_xshoppy"
              placeholder="请选择"
            >
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="itemFrom" label="月订单量" prop="">
            <el-input
              v-model="editForm.order_sum_per_month"
              show-word-limit
              maxlength="20"
              placeholder="请输入月订单量"
            ></el-input>
          </el-form-item>
          <el-form-item class="itemFrom" label="月流水" prop="">
            <el-input
              v-model="editForm.gmv_per_month"
              show-word-limit
              maxlength="20"
              placeholder="请输入月流水"
            ></el-input>
          </el-form-item>
          <el-form-item
            class="itemFrom"
            label="销售产品类型"
            prop="sale_product_type"
          >
            <el-input
              v-model="editForm.sale_product_type"
              placeholder="请输入销售产品类型"
            ></el-input>
          </el-form-item>
        </div>
      </div>
      <!-- 附件资料 -->
      <div class="conditions-content edit-content user-card">
        <h3>附件资料</h3>
        <el-form-item class="itemFrom" label="纳税人识别号" prop="">
          <el-input
            v-model="editForm.taxpayer_identity"
            show-word-limit
            maxlength="20"
            placeholder="请输入纳税人识别号"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="editForm.register_type == '1'"
          class="itemFrom user-tip"
          label="营业执照"
          prop="bussiness_license"
        >
          <div class="card-img">
            <uploadMenu
              :editForm="editForm"
              userImgType="bussiness_license"
              content="上传营业执照"
              tip="只能上传jpg/png文件，且不超过8M"
              :handleFileSuccess="handleFileSuccess"
              :beforeFileUpload="beforeFileUpload"
            />
          </div>
        </el-form-item>
        <el-form-item
          class="itemFrom user-cardImg user-tip"
          :label="
            editForm.register_type == '1' ? '法人身份证人像页' : '身份证人像页'
          "
          prop="id_card_front"
        >
          <div class="card-img">
            <uploadMenu
              :editForm="editForm"
              userImgType="id_card_front"
              content="上传人像页"
              tip="只能上传jpg/png文件，且不超过8M"
              :handleFileSuccess="handleFileSuccessFront"
              :beforeFileUpload="beforeFileUpload"
            />
          </div>
        </el-form-item>
        <el-form-item
          class="itemFrom user-cardImg user-tip"
          :label="
            editForm.register_type == '1' ? '法人身份证国徽页' : '身份证国徽页'
          "
          prop="id_card_back"
        >
          <div class="card-img">
            <uploadMenu
              :editForm="editForm"
              userImgType="id_card_back"
              content="上传国徽页"
              tip="只能上传jpg/png文件，且不超过8M"
              :handleFileSuccess="handleFileSuccessBack"
              :beforeFileUpload="beforeFileUpload"
            />
          </div>
        </el-form-item>
      </div>
      <!-- 服务及授权 -->
      <div class="conditions-content edit-content">
        <h3>服务及授权</h3>
        <div class="edit-content-item">
          <el-form-item class="itemFrom" label="授权店铺数" prop="shop_num">
            <el-input
              v-model="editForm.shop_num"
              show-word-limit
              placeholder="请输入授权店铺数"
            ></el-input>
          </el-form-item>
        </div>
        <div class="serve">
          <span class="serve-top">开通的服务：</span>
          <span class="serve-text" v-if="serverShow">未开通任何服务</span>
          <ul v-else>
            <li class="serve-title">
              <label>服务</label>
              <span>供应商</span>
            </li>
            <li v-for="(item, index) in serverData" :key="index">
              <label>{{ item.key }}</label>
              <span>{{ item.value }}</span>
            </li>
          </ul>
        </div>
      </div>
      <!-- 备注 -->
      <div class="conditions-content edit-content edit-distribution">
        <h3>客户跟进情况</h3>
        <p>
          <label>是否分配售前：</label>
          <span>{{
            editData.assign_pre_sale_text
              ? editData.assign_pre_sale_text
              : "未分配"
          }}</span>
        </p>
        <p>
          <label>是否分配售后：</label>
          <span>{{
            editData.assign_after_sale_text
              ? editData.assign_after_sale_text
              : "未分配"
          }}</span>
        </p>
      </div>
      <el-form-item>
        <el-button
          type="primary"
          size="medium"
          :loading="editLoading"
          @click="submitFrom"
          >提交</el-button
        >
        <el-button size="medium" @click="cancelData">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { editModify, companyInfo } from "@/api/leadManagement/companyList";
import { checkEmail, checkPhone } from "@/utils/validate";
import { getDistrict, sourceSelectList } from "@/api/common";
import uploadMenu from "@/components/upload/uploadPic";
export default {
  name: "editMenu",
  components: { uploadMenu },
  data() {
    return {
      editData: {},
      editForm: {
        id: null,
        register_type: "1",
        source_code: "",
        status_text: "",
        created_at: "",
        official_user_name: "",
        tag_name: "",
        level_name: "",
        leading_official: "",
        phone: "",
        email: "",
        yunz_email: "",
        company_name: "",
        official_create_date: "",
        company_leader: "",
        admin_phone: "",
        province_name: "广东省",
        city_name: "",
        address: "",
        canal_sum: "",
        team_size: "",
        fund_size: "",
        is_use_commerce: "0",
        internal_commerce_platform: "",
        is_use_cross_border: "0",
        commerce_platform: "",
        is_use_independent_site: "0",
        use_independent_sites: "",
        is_register_xshoppy: "0",
        order_sum_per_month: "",
        gmv_per_month: "",
        sale_product_type: "",
        taxpayer_identity: "",
        bussiness_license: "",
        id_card_front: "",
        id_card_back: "",
        shop_num: "",
        company_type: "",
      },
      rules: {
        register_type: [
          { required: true, message: "请选择注册类型", trigger: "change" },
        ],
        source_code: [
          { required: true, message: "请选择注册来源", trigger: "change" },
        ],
        leading_official: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { max: 32, message: "长度最大32个字符", trigger: "blur" },
        ],
        phone: [{ required: true, validator: checkPhone, trigger: "blur" }],
        yunz_email: [
          { required: true, validator: checkEmail, trigger: "blur" },
        ],
        company_name: [
          { required: true, message: "请输入企业/个人名称", trigger: "blur" },
          { max: 50, message: "长度最大50个字符", trigger: "blur" },
        ],
        created_at: [
          { required: true, message: "请输入注册时间", trigger: "blur" },
        ],
        company_leader: [
          { max: 50, message: "最大为50个字符", trigger: "blur" },
        ],
        admin_phone: [
          { trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback();
              } else {
                let _reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
                if (_reg.test(value)) {
                  callback();
                } else {
                  callback(new Error("请输入正确的手机号"));
                }
              }
            },
          },
        ],
        province_name: [
          { required: true, message: "请选择省份", trigger: "change" },
        ],
        city_name: [
          { required: true, message: "请选择市区", trigger: "change" },
        ],
        address: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
          { max: 100, message: "最大为100个字符", trigger: "blur" },
        ],
        canal_sum: [{ max: 5, message: "最大数值为99999", trigger: "blur" }],
        team_size: [
          { required: true, message: "请选择团队人数", trigger: "change" },
        ],
        fund_size: [{ max: 20, message: "最大长度为20", trigger: "blur" }],
        is_use_commerce: [
          {
            required: true,
            message: "请选择是否有电商经验",
            trigger: "change",
          },
        ],
        internal_commerce_platform: [
          { required: true, message: "请输入国内电商平台", trigger: "blur" },
          { max: 20, message: "最大长度为20个字符", trigger: "blur" },
        ],
        is_use_cross_border: [
          {
            required: true,
            message: "请选择是否有跨境电商经验",
            trigger: "change",
          },
        ],
        commerce_platform: [
          { required: true, message: "请输入电商平台", trigger: "blur" },
          { max: 20, message: "最大长度为20个字符", trigger: "blur" },
        ],
        is_use_independent_site: [
          {
            required: true,
            message: "请选择是否有独立站经验",
            trigger: "change",
          },
        ],
        use_independent_sites: [
          { required: true, message: "请输入使用过的独立站", trigger: "blur" },
          { max: 20, message: "最大长度为20个字符", trigger: "blur" },
        ],
        is_register_xshoppy: [
          {
            required: true,
            message: "请选择是否注册XShoppy",
            trigger: "change",
          },
        ],
        order_sum_per_month: [
          { max: 20, message: "最大长度为20个字符", trigger: "blur" },
        ],
        gmv_per_month: [
          { max: 20, message: "最大长度为20个字符", trigger: "blur" },
        ],
        sale_product_type: [
          { required: true, message: "请选择销售产品类型", trigger: "blur" },
          { max: 200, message: "最大长度为200个字符", trigger: "blur" },
        ],
        bussiness_license: [
          { required: true, message: "请上传营业执照", trigger: "change" },
        ],
        id_card_front: [
          { required: true, message: "请上传身份证正面", trigger: "change" },
        ],
        id_card_back: [
          { required: true, message: "请上传身份证反面", trigger: "change" },
        ],
        shop_num: [
          { required: true, message: "请输入授权店铺数", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("请输入授权店铺数"));
              } else {
                let _reg = /^\d+$/;
                if (_reg.test(value)) {
                  if (value > 0 && value <= 99999) {
                    callback();
                  } else {
                    callback(new Error("店铺数值为1-99999"));
                  }
                } else {
                  callback(new Error("请输入正确的数值"));
                }
              }
            },
          },
        ],
      },
      registerType: [
        {
          value: "1",
          text: "企业注册",
        },
        {
          value: "2",
          text: "个人注册",
        },
      ],
      teamSizeStr: [
        {
          value: "1",
          text: "1-5人",
        },
        {
          value: "2",
          text: "6-10人",
        },
        {
          value: "3",
          text: "11-20人",
        },
        {
          value: "4",
          text: "21-50人",
        },
        {
          value: "5",
          text: "51-100人",
        },
        {
          value: "6",
          text: "100人以上",
        },
      ],
      sourceCode: [],
      provinceName: [],
      cityName: [],
      bigImgVisible: false,
      frontImgVisible: false,
      backImgVisible: false,
      editLoading: false,
      serverShow: false,
      serverData: [],
      tipTextOne: {
        tip: "只能上传jpg/png文件，且不超过8M",
        content: "上传营业执照",
      },
      tipTextTwo: {
        tip: "只能上传jpg/png文件，且不超过8M",
        content: "上传人像页",
      },
      tipTextThree: {
        tip: "只能上传jpg/png文件，且不超过8M",
        content: "上传国徽页",
      },
    };
  },
  props: {},
  watch: {},
  created() {
    this.getCurstmerData(this.$route.query.id);
    this.getSelectType();
  },
  methods: {
    //   获取编辑数据详情
    getCurstmerData(id) {
      companyInfo({ id }).then((res) => {
        this.editData = res.data;
        // console.log(res);
        this.editForm.id = res.data.company_id;
        this.editForm = { ...this.editForm, ...res.data };
        this.getCityArr();
        if (res.data.server instanceof Array) {
          this.serverShow = true;
        } else {
          this.dealSearverType(res.data.server);
        }
      });
    },
    // 获取注册来源or省份
    getSelectType() {
      sourceSelectList({}).then((res) => {
        // console.log(res);
        this.sourceCode = res.data;
      });
      // 获取省份
      getDistrict({}).then((res) => {
        this.provinceName = res.data;
      });
    },
    proviceChange() {
      this.editForm.city_name = "";
      this.getCityArr();
    },
    getCityArr() {
      getDistrict({
        district: this.editForm.province_name,
      }).then((res) => {
        this.cityName = res.data;
      });
    },
    submitFrom() {
      this.editLoading = true;
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          editModify(this.editForm)
            .then((res) => {
              if (res.code == 0) {
                this.getCurstmerData(this.$route.query.id);
                this.$message({
                  message: "操作成功",
                  type: "success",
                });
                this.$router.go(-1);
              }
              this.editLoading = false;
            })
            .catch((err) => {
              this.editLoading = false;
            });
        } else {
          this.editLoading = false;
          this.$message.error("部分内容格式有误，请根据页面提示进行修改");
          return false;
        }
      });
    },
    // 取消修改
    cancelData() {
      this.$confirm("此操作将不会保存修改, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$router.go(-1);
        this.$message({
          type: "info",
          message: "已取消本次修改",
        });
      });
    },
    // 图片上传成功
    handleFileSuccess(res, file) {
      this.editForm.bussiness_license = res.file_preview;
    },
    handleFileSuccessFront(res, file) {
      this.editForm.id_card_front = res.file_preview;
    },
    handleFileSuccessBack(res, file) {
      this.editForm.id_card_back = res.file_preview;
    },
    beforeFileUpload(file) {
      let isJPG = file.type === "image/jpeg";
      let isPNG = file.type === "image/png";
      let isLt8M = file.size / 1024 / 1024 < 8;
      if (!isJPG && !isPNG) {
        this.$message.error("上传图片只能是PNG或者JPG格式！");
      }
      if (!isLt8M) {
        this.$message.error("上传图片大小不能超过8M");
      }
      return (isJPG || isPNG) && isLt8M;
    },
    // 处理开店的店铺数
    dealSearverType(obj) {
      let arr = [];
      for (let key in obj) {
        let o = {};
        let str = obj[key].join(",");
        o.key = key;
        o.value = str;
        arr.push(o);
      }
      this.serverData = arr;
    },
  },
};
</script>

<style scoped lang="scss">
.edit-topText {
  display: flex;
  .edit-status {
    &.active {
      background-color: #bbe5b3;
    }
    &.refuse {
      background-color: #ffc48b;
    }
    margin-top: 3px;
    margin-left: 8px;
    font-size: 12px;
    padding: 2px 8px;
    height: max-content;
    background-color: #ffea8a;
    border-radius: 100px;
  }
}
.edit-content {
  padding: 16px;
  padding-bottom: 0;
  margin-bottom: 16px;
  & > h3 {
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 15px;
  }
  .edit-content-item {
    display: flex;
    flex-wrap: wrap;
    max-width: 1200px;
    .el-form-item {
      width: 480px;
      margin-right: 54px;
      margin-bottom: 32px;
    }
  }
}
.user-card {
  padding-bottom: 16px;
  .el-form-item {
    width: 480px;
  }
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  width: 120px;
  height: 120px;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 32px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
  position: relative;
  span {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 20%;
  }
}
.avatar-uploader {
  width: 120px;
  display: block;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}
.user-cardImg {
  &.el-form-item {
    display: inline-block;
    width: 280px;
  }
}
/deep/.itemFrom {
  &.user-tip {
    .el-form-item__label {
      font-size: 12px;
      color: #000;
      font-weight: 500;
    }
  }
}
.customize-action {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0px;
  top: 0;
  color: #fff;
  opacity: 0;
  font-size: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    opacity: 1;
  }
  span {
    width: 50%;
    height: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
    &.el-upload-list_item-preview {
      justify-content: flex-end;
      padding-right: 10px;
    }
    &.el-upload-list_item-delete {
      padding-left: 10px;
    }
  }

  &::after {
    display: inline-block;
    content: "";
    height: 100%;
    vertical-align: middle;
  }
}
.edit-distribution {
  p {
    padding-bottom: 16px;
  }
}
.serve {
  .serve-top {
    display: inline-block;
    padding-bottom: 16px;
  }
  & > ul {
    padding-bottom: 16px;
    li {
      padding: 15px 16px;
      border-bottom: 1px solid #dfe3e8;
      &:first-child {
        border-top: 1px solid #dfe3e8;
      }
    }
    .serve-title {
      label,
      span {
        color: #212b36;
        font-weight: 600;
      }
    }
    label {
      margin-right: 220px;
    }
  }
}
</style>
