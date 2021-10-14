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
      status-icon
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
        </div>
        <div class="edit-content-item">
          <el-form-item class="itemFrom" label="入驻申请提交时间" prop="updated_at">
            <el-input v-model="editForm.updated_at" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item class="itemFrom" label="提交人" prop="user_name">
            <el-input v-model="editForm.user_name" :disabled="true"></el-input>
          </el-form-item>
        </div>
      </div>
      <!-- 基本信息 -->
      <div class="conditions-content edit-content">
        <h3>企业信息</h3>
        <div class="edit-content-item">
          <el-form-item class="itemFrom" label="姓名" prop="concat_name">
            <el-input
              v-model="editForm.concat_name"
              placeholder="请输入公司负责人"
            ></el-input>
          </el-form-item>
          <el-form-item class="itemFrom" label="手机号" prop="phone">
            <el-input
              placeholder="请输入手机号"
              v-model="editForm.phone"
            ></el-input>
          </el-form-item>
          <el-form-item class="itemFrom" label="注册邮箱" prop="email">
            <el-input
              v-model="editForm.email"
              placeholder="请输入注册邮箱"
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
              maxlength="21"
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
            <el-upload
              class="avatar-uploader"
              action="#"
              :http-request="uploadToOssImageOne"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :show-file-list="false"
            >
              <div
                v-if="editForm.bussiness_license"
                style="width: 120px; height: 120px"
              >
                <img :src="editForm.bussiness_license" alt="" srcset="" />
                <span class="customize-action">
                  <span
                    class="el-upload-list_item-preview"
                    @click.stop="bigImgVisible = true"
                  >
                    <i class="el-icon-zoom-in" style="font-size: 16px"></i>
                  </span>
                  <span
                    class="el-upload-list_item-delete"
                    @click.stop="editForm.bussiness_license = ''"
                  >
                    <i class="el-icon-delete" style="font-size: 16px"></i>
                  </span>
                </span>
              </div>
              <i v-else class="el-icon-upload avatar-uploader-icon"
                ><span>上传营业执照</span></i
              >
            </el-upload>
            <div class="tip">只能上传jpg/png文件，且不超过8M</div>
            <el-dialog :visible.sync="bigImgVisible">
              <img width="100%" :src="editForm.bussiness_license" alt="" />
            </el-dialog>
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
            <el-upload
              class="avatar-uploader"
              action="#"
              :http-request="uploadToOssImageTwo"
              :on-success="handleAvatarSuccessFront"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
            >
              <div
                v-if="editForm.id_card_front"
                style="width: 120px; height: 120px"
              >
                <img :src="editForm.id_card_front" alt="" srcset="" />
                <span class="customize-action">
                  <span
                    class="el-upload-list_item-preview"
                    @click.stop="frontImgVisible = true"
                  >
                    <i class="el-icon-zoom-in" style="font-size: 16px"></i>
                  </span>
                  <span
                    class="el-upload-list_item-delete"
                    @click.stop="editForm.id_card_front = ''"
                  >
                    <i class="el-icon-delete" style="font-size: 16px"></i>
                  </span>
                </span>
              </div>
              <i v-else class="el-icon-upload avatar-uploader-icon"
                ><span>上传人像页</span></i
              >
            </el-upload>
            <div class="tip">只能上传jpg/png文件，且不超过8M</div>
            <el-dialog :visible.sync="frontImgVisible">
              <img width="100%" :src="editForm.id_card_front" alt="" />
            </el-dialog>
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
            <el-upload
              class="avatar-uploader"
              action="#"
              :http-request="uploadToOssImageThree"
              :on-success="handleAvatarSuccessBack"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
            >
              <div
                v-if="editForm.id_card_back"
                style="width: 120px; height: 120px"
              >
                <img :src="editForm.id_card_back" alt="" srcset="" />
                <span class="customize-action">
                  <span
                    class="el-upload-list_item-preview"
                    @click.stop="backImgVisible = true"
                  >
                    <i class="el-icon-zoom-in" style="font-size: 16px"></i>
                  </span>
                  <span
                    class="el-upload-list_item-delete"
                    @click.stop="editForm.id_card_back = ''"
                  >
                    <i class="el-icon-delete" style="font-size: 16px"></i>
                  </span>
                </span>
              </div>
              <i v-else class="el-icon-upload avatar-uploader-icon"
                ><span>上传国徽页</span></i
              >
            </el-upload>
            <div class="tip">只能上传jpg/png文件，且不超过8M</div>
            <el-dialog :visible.sync="backImgVisible">
              <img width="100%" :src="editForm.id_card_back" alt="" />
            </el-dialog>
          </div>
        </el-form-item>
      </div>
      <!-- 备注 -->
      <div class="conditions-content edit-content edit-remarks">
        <h3>备注</h3>
        <el-form-item class="itemFrom" label="" prop="">
          <el-input
            type="textarea"
            placeholder="请输入拒绝原因，最多输入200字，超出不可输入"
            v-model="editForm.remarks"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </div>
      <el-form-item>
        <el-button
          type="primary"
          size="medium"
          :loading="editLoading"
          @click="submitFrom"
          >提交</el-button
        >
        <el-button size="medium">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { editCustomer, auditDetail } from "@/api/leadManagement/customerLeads";
import { checkEmail, checkPhone } from "@/utils/validate";
import { getDistrict, sourceSelectList } from "@/api/common";
import uploadPic from "@/components/upload/uploadPic";
import OSS from "ali-oss";
import SparkMD5 from "spark-md5";
import ossMixIn from "@/mixins/ossMixin";
export default {
  name: "editCustomer",
  mixins: [ossMixIn],
  components: { uploadPic },
  data() {
    return {
      editData: {},
      editForm: {
        id: null,
        register_type: "1",
        source_code: "",
        created_at: "",
        user_name: "",
        concat_name: "",
        phone: "",
        email: "",
        company_name: "",
        updated_at: "",
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
        remarks: "",
      },
      rules: {
        register_type: [
          { required: true, message: "请选择注册类型", trigger: "change" },
        ],
        source_code: [
          { required: true, message: "请选择注册来源", trigger: "change" },
        ],
        updated_at: [
          { required: true, message: "请输入入驻申请提交时间", trigger: "blur" },
        ],
        user_name: [
          { required: true, message: "请输入提交人姓名", trigger: "blur" },
        ],
        concat_name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { max: 50, message: "长度最大50个字符", trigger: "blur" },
        ],
        phone: [{ required: true, validator: checkPhone, trigger: "blur" }],
        email: [{ required: true, validator: checkEmail, trigger: "blur" }],
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
    };
  },
  props: {},
  watch: {
    // editForm: {
    //   immediate: true,
    //   deep: true,
    //   handler(val) {
    //     if(val.province_name) {
    //       getDistrict({
    //         district: val.province_name
    //       }).then(res => {
    //         this.editForm.city_name = ''
    //         this.cityName = res.data
    //       })
    //     }
    //   }
    // },
  },
  created() {
    this.getCurstmerData(this.$route.query.id);
    this.getSelectType();
  },
  methods: {
    //   获取编辑数据详情
    getCurstmerData(id) {
      auditDetail({ id }).then((res) => {
        this.editData = res.data;
        console.log(res);
        this.editForm = { ...this.editForm, ...res.data };
        this.getCityArr();
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
          editCustomer(this.editForm).then((res) => {
            // console.log(res);
            this.getCurstmerData(this.$route.query.id);
            if (res.code == 0) {
              this.$message({
                message: "操作成功",
                type: "success",
              });
            }
            this.editLoading = false;
          });
        } else {
          this.editLoading = false;

          return false;
        }
      });
    },
    // 图片异步上传
    uploadToOssImageOne(param) {
      let file = param.file;
      console.log(param.file);
      let MD5 = null;
      this.get_filemd5sum(file).then((res) => {
        MD5 = res;
        if (MD5) {
          this.uploadToOss(file, MD5).then((res) => {
            param.onSuccess(res);
          });
        }
      });
    },
    uploadToOssImageTwo(param) {
      let file = param.file;
      console.log(param.file);
      let MD5 = null;
      this.get_filemd5sum(file).then((res) => {
        MD5 = res;
        if (MD5) {
          this.uploadToOss(file, MD5).then((res) => {
            param.onSuccess(res);
          });
        }
      });
    },
    uploadToOssImageThree(param) {
      let file = param.file;
      let MD5 = null;
      this.get_filemd5sum(file).then((res) => {
        MD5 = res;
        if (MD5) {
          this.uploadToOss(file, MD5).then((res) => {
            param.onSuccess(res);
          });
        }
      });
    },
    // 图片上传成功
    handleAvatarSuccess(res, file) {
      this.editForm.bussiness_license = res.file_preview;
    },
    handleAvatarSuccessFront(res, file) {
      this.editForm.id_card_front = res.file_preview;
    },
    handleAvatarSuccessBack(res, file) {
      this.editForm.id_card_back = res.file_preview;
    },
    beforeAvatarUpload(file) {
      // console.log("上传前" + file);
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
    // 图片上传配置
    get_filemd5sum(ofile) {
      return new Promise((resolve, reject) => {
        let file = ofile;
        let tmp_md5;
        let blobSlice =
            File.prototype.slice ||
            File.prototype.mozSlice ||
            File.prototype.webkitSlice,
          chunkSize = 8097152, // Read in chunks of 2MB
          chunks = Math.ceil(file.size / chunkSize),
          currentChunk = 0,
          spark = new SparkMD5.ArrayBuffer(),
          fileReader = new FileReader();
        fileReader.onload = async (e) => {
          spark.append(e.target.result); // Append array buffer
          currentChunk++;
          let md5_progress = Math.floor((currentChunk / chunks) * 100);
          if (currentChunk < chunks) {
            loadNext();
          } else {
            tmp_md5 = spark.end();
            resolve(tmp_md5);
          }
        };
        fileReader.onerror = function () {
          reject(false);
        };
        function loadNext() {
          let start = currentChunk * chunkSize,
            end =
              start + chunkSize >= file.size ? file.size : start + chunkSize;
          fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
        }
        loadNext(tmp_md5);
      });
    },
    uploadToOss(file, MD5) {
      return new Promise((resolve, reject) => {
        let str = "",
          url = "",
          client = null,
          fileName = null,
          suffix = null,
          index = 0;
        this.initOssConfig().then((res) => {
          if (res && Object.keys(res).length > 0) {
            client = new OSS(res);
            suffix = file.name.split(".")[file.name.split(".").length - 1];
            fileName =
              SparkMD5.hash(new Date().getTime() + file.name) + "." + suffix;
            client
              .multipartUpload("uploader/" + fileName, file, {}, {})
              .then((data) => {
                if (data.res.requestUrls.length) {
                  str = data.res.requestUrls[0];
                  index = str.indexOf("?");
                  url = index > 0 ? str.substring(0, index) : str;
                  resolve({ file_preview: url });
                }
                reject("上传失败");
              });
          } else {
            this.$message.error("获取oss秘钥失败，请刷新重试");
          }
        });
      });
    },
  },
};
</script>

<style scoped lang='scss'>
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
      margin-bottom: 36px;
      .el-form-item__label {
        line-height: 30px;
      }
    }
  }
}
.user-card {
  // padding-bottom: 16px;
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
.edit-remarks {
  padding-bottom: 16px;
  .itemFrom {
    margin-bottom: 0;
  }
}
</style>