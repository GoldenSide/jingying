<!---*
* @description 
* @fileName addCheck.vue
* @author 龙伟
* @date 2020/12/14 14:38:04
*--->
<template>
  <el-dialog
    title="新增客户优惠申请单"
    :visible.sync="addCheckVisible"
    width="634px"
    :before-close="addCheckHidden"
    :close-on-click-modal="false"
  >
    <el-form :model="ruleForm" :rules="rules" ref="checkForm" class="ruleForm">
      <el-form-item label="公司名称" prop="company_id">
        <el-select
          v-model="ruleForm.company_id"
          filterable
          placeholder="请输入公司关键字/ID查询"
          clearable
          remote
          :remote-method="remoteMethod"
          :loading="loading"
        >
          <el-option
            v-for="item in restaurantsOptions"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="优惠项" prop="discount_type">
        <el-select
          @change="getDiscountType"
          v-model="ruleForm.discount_type"
          placeholder="请选择优惠项"
        >
          <el-option label="店租" value="1"></el-option>
          <el-option label="交易佣金" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :label="ruleForm.discount_type == 1 ? '原价(￥)' : '原价(%)'"
        prop=""
      >
        <el-input v-model="isOriginalPrice" disabled></el-input>
      </el-form-item>
      <el-form-item v-if="ruleForm.discount_type == 1" label="原价($)" prop="">
        <el-input v-model="ruleForm.original_price_dollar" disabled></el-input>
      </el-form-item>
      <div></div>
      <el-form-item
        key="discount_type"
        :label="ruleForm.discount_type == 1 ? '优惠价(￥)' : '优惠价(%)'"
        prop="discount_price"
      >
        <el-input
          v-model="ruleForm.discount_price"
          @input="getDiscountPrice"
          placeholder="请输入优惠价"
        ></el-input>
      </el-form-item>
      <el-form-item
        v-if="ruleForm.discount_type == 1"
        label="优惠价($)"
        prop="discount_price_dollar"
      >
        <el-input
          v-model="ruleForm.discount_price_dollar"
          :placeholder="getPriceDollar"
        ></el-input>
      </el-form-item>
      <el-form-item label="折扣率(%)" prop="discount_rate">
        <el-input
          v-model="ruleForm.discount_rate"
          placeholder="根据优惠价自动生成，输入改动优惠价随着改动"
          @input="getDiscountRate"
        ></el-input>
      </el-form-item>
      <el-form-item label="生效时间" required>
        <el-form-item prop="begin_time">
          <el-date-picker
            placeholder="请选择生效时间"
            v-model="ruleForm.begin_time"
            :picker-options="pickerOptionsOne"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
      </el-form-item>
      <el-form-item prop="end_time">
        <template slot="label">
          <span>截止时间</span
          ><span style="font-size: 12px; margin-left: 16px"
            ><i
              class="el-icon-warning"
              style="color: #e6a23c; font-size: 12px"
            ></i>
            未选择截止时间则默认选择永久有效</span
          >
        </template>
        <el-date-picker
          placeholder="请选择截止时间"
          v-model="ruleForm.end_time"
          :picker-options="pickerOptionsTwo"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          style="width: 100%"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="medium" @click="addCheckHidden">取 消</el-button>
      <el-button
        size="medium"
        type="primary"
        :loading="btnLoading"
        @click="submit"
        >提交</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import {
  companySearchByWords,
  applyDiscountAdd
} from "@/api/leadManagement/discountAppList";
export default {
  name: "addCheckMenu",
  components: {},
  data() {
    return {
      ruleForm: {
        company_id: "",
        discount_type: "1",
        begin_time: "",
        end_time: "",
        original_price: "",
        original_price_dollar: "",
        discount_price: "",
        discount_price_dollar: "",
        discount_rate: ""
      },
      restaurants: [],
      restaurantsOptions: [],
      loading: false,
      rules: {
        company_id: [
          { required: true, message: "请输入公司名称", trigger: "blur" }
        ],
        discount_type: [
          { required: true, message: "请选择优惠项", trigger: "change" }
        ],
        discount_price: [
          {
            type: "string",
            required: true,
            trigger: ["blur", "change"],
            validator: (rule, value, callback) => {
              if (!value) {
                return callback("请输入优惠价");
              }
              if (Number(this.ruleForm.discount_type) === 1) {
                if (
                  !isNaN(value) &&
                  value > 0 &&
                  value <= this.ruleForm.original_price
                ) {
                  if (
                    value.indexOf(".") != "-1" &&
                    value.split(".")[1].length > 2
                  ) {
                    callback(new Error("最多支持两位小数"));
                  } else {
                    callback();
                  }
                } else {
                  callback(new Error("请输入大于0且小于等于原价的数字"));
                }
              } else {
                if (
                  !isNaN(value) &&
                  value > 0 &&
                  value <= this.ruleForm.original_price
                ) {
                  if (
                    value.indexOf(".") != -1 &&
                    value.split(".")[1].length > 2
                  ) {
                    callback(new Error("最多支持两位小数"));
                  } else {
                    callback();
                  }
                } else {
                  callback(new Error("请输入大于0且小于等于原价的数字"));
                }
              }
            }
          }
        ],
        discount_price_dollar: [
          {
            type: "string",
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (!value) {
                return callback();
              }
              if (
                !isNaN(value) &&
                value > 0 &&
                value <= this.ruleForm.original_price_dollar
              ) {
                if (
                  value.indexOf(".") != -1 &&
                  value.split(".")[1].length > 2
                ) {
                  callback(new Error("最多支持两位小数"));
                } else {
                  callback();
                }
              } else {
                callback(new Error("请输入大于0且小于等于原价的数字"));
              }
            }
          }
        ],
        discount_rate: [
          {
            type: "string",
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (!value) {
                return callback();
              }
              if (!isNaN(value)) {
                if (
                  value.indexOf(".") != -1 &&
                  value.split(".")[1].length > 2
                ) {
                  callback(new Error("最多支持两位小数"));
                } else {
                  callback();
                }
              } else {
                callback(new Error("请输入正确的数字，例:1、1.1"));
              }
            }
          }
        ],
        begin_time: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        end_time: [
          {
            trigger: "change",
            validator: (rule, value, callback) => {
              if (!value) {
                return callback();
              } else {
                if (this.ruleForm.begin_time > value) {
                  callback(new Error("请确保截止时间大于生效时间"));
                } else {
                  callback();
                }
              }
            }
          }
        ]
      },

      pickerOptionsTwo: {
        disabledDate(time) {
          let date = new Date();
          let isTrue = time.getTime() < date.getTime();
          return isTrue;
        }
      },
      price_dollar_str: "根据优惠价自动计算，支持修改",
      price_dollar: null,
      rate: null,
      btnLoading: false
    };
  },
  props: {
    addCheckVisible: {
      type: Boolean,
      default: false
    },
    addCheckData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  watch: {
    addCheckData: {
      immediate: true,
      deep: true,
      handler(val) {
        if (Object.keys(val).length > 0) {
          this.ruleForm.original_price_dollar = val.rent_original_price_dollar;
        }
      }
    }
  },
  computed: {
    isOriginalPrice() {
      this.rate = (
        this.addCheckData.rent_original_price /
        this.addCheckData.rent_original_price_dollar
      ).toFixed(2);
      this.ruleForm.original_price =
        this.ruleForm.discount_type == 1
          ? this.addCheckData.rent_original_price
          : this.addCheckData.rate_original_price;
      return this.ruleForm.original_price;
    },
    getPriceDollar() {
      if (Number(this.ruleForm.discount_price) >= 0) {
        this.price_dollar_str = `默认值为${(
          Number(this.ruleForm.discount_price) / this.rate
        ).toFixed(2)}，支持输入修改`;
        this.price_dollar = `${(
          Number(this.ruleForm.discount_price) / this.rate
        ).toFixed(2)}`;
        return this.price_dollar_str;
      } else {
        this.price_dollar = null;
        return (this.price_dollar_str = "根据优惠价自动计算，支持修改");
      }
    },
    pickerOptionsOne() {
      let type = this.ruleForm.discount_type;
      return {
        disabledDate(time) {
          let date = new Date();
          let isTrue;
          if (type == "1") {
            isTrue = time.getTime() < date.getTime() - 60 * 60 * 24 * 1000;
          } else if (type == "2") {
            isTrue = time.getTime() < date.getTime();
          }
          return isTrue;
        }
      };
    }
  },
  created() {},
  methods: {
    submit() {
      this.btnLoading = true;
      this.$refs.checkForm.validate(valid => {
        if (valid) {
          if (!this.ruleForm.discount_price_dollar) {
            this.ruleForm.discount_price_dollar = this.price_dollar;
          }
          applyDiscountAdd(this.ruleForm)
            .then(res => {
              if (res.code == 0) {
                this.$message.success("操作成功");
                this.addCheckHidden();
                this.$parent.getList();
              }
            })
            .catch(err => {
              this.btnLoading = false;
            });
        } else {
          this.$message.error("请根据页面提示进行修改");
          this.btnLoading = false;
          return false;
        }
      });
    },
    // 根据优惠价算出折扣
    getDiscountPrice() {
      if (
        !isNaN(this.ruleForm.discount_price) &&
        this.ruleForm.discount_price != ""
      ) {
        let price =
          this.ruleForm.discount_type == 1
            ? this.addCheckData.rent_original_price
            : this.addCheckData.rate_original_price;
        this.ruleForm.discount_rate =
          ((price - Number(this.ruleForm.discount_price)) / price) * 100;

        this.ruleForm.discount_rate = this.ruleForm.discount_rate.toFixed(2);
      } else {
        this.ruleForm.discount_rate = "";
      }
    },
    // 根据折扣算出优惠价
    getDiscountRate() {
      if (
        !isNaN(this.ruleForm.discount_rate) &&
        this.ruleForm.discount_rate != ""
      ) {
        let price =
          this.ruleForm.discount_type == 1
            ? this.addCheckData.rent_original_price
            : this.addCheckData.rate_original_price;
        this.ruleForm.discount_price = `${(
          price - (price * (this.ruleForm.discount_rate / 100)).toFixed(4)
        ).toFixed(2)}`;
      } else {
        this.ruleForm.discount_price = "";
      }
    },

    addCheckHidden() {
      this.$emit("update:addCheckVisible", false);
    },
    // 获取筛选公司
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          companySearchByWords({
            page: 1,
            page_size: 500,
            search_words: query
          }).then(res => {
            this.restaurantsOptions = res.data.list;
            this.loading = false;
          });
        }, 200);
      } else {
        this.restaurantsOptions = [];
      }
    },
    getDiscountType() {
      // this.$refs["checkForm"].clearValidate();

      let _field = this.$refs["checkForm"]
        .fields; /*当然，你可以打印一下fields*/
      _field.map(i => {
        if (i.prop === "discount_price") {
          console.log(i.prop);
          //通过prop属性值相同来判断是哪个输入框，比如：要移除prop为'user'
          i.resetField();
          return false;
        }
      });

      // this.ruleForm.discount_price = "";
      this.ruleForm.discount_price_dollar = "";
      this.ruleForm.discount_rate = "";
      this.ruleForm.begin_time = "";
      this.ruleForm.end_time = "";
    }
    // 获取所有公司
    // getAllCompany() {
    //   companySearchByWords({}).then((res) => {
    //     //   console.log(res);
    //     this.restaurants = res.data.list;
    //   });
    // },
  }
};
</script>

<style scoped lang="scss">
.el-autocomplete {
  display: block;
}
</style>
