<!---*
* @description  店铺新增
* @fileName shopDialog.vue
* @author 叶金龙
* @date 2021/04/25 11:12:13
*--->
<template>
  <el-dialog
    :title="topTitle"
    :visible.sync="shopActVisible"
    width="634px"
    :before-close="simpleClose"
    :close-on-click-modal="false"
  >
    <el-form
      :model="form"
      ref="form"
      :rules="rules"
      :inline="false"
      size="normal"
    >
      <p><i style="color: #ff4343">*</i>店铺名称</p>
      <el-form-item label="" prop="name">
        <el-input
          v-model="form.name"
          placeholder="店铺名称仅支持英文、数字、横线、下划线，且不能以横线或下划线开头的"
          clearable
        ></el-input>
      </el-form-item>
      <p><i style="color: #ff4343">*</i>注册邮箱</p>
      <el-form-item label="" prop="email">
        <el-input
          v-model="form.email"
          placeholder="请输入注册邮箱"
          clearable
        ></el-input>
      </el-form-item>
      <p><i style="color: #ff4343">*</i>登录密码</p>
      <el-form-item label="" prop="password">
        <el-input
          v-model="form.password"
          placeholder="请输入登录密码"
          clearable
        ></el-input>
      </el-form-item>
      <p>负责人</p>
      <el-form-item label="" prop="leading_official">
        <el-input
          v-model="form.leading_official"
          placeholder="请输入企业负责人"
          clearable
        ></el-input>
      </el-form-item>
      <p><i style="color: #ff4343">*</i>客户公司</p>
      <el-form-item label="" prop="company_id">
        <el-select
          v-model="form.company_id"
          filterable
          placeholder="请选择客户公司"
          clearable
          remote
          :remote-method="querySearch"
          :loading="searchLoading"
        >
          <el-option
            v-for="item in checkOptions"
            :key="item.id"
            :label="item.company_name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <p>手机号码</p>
      <el-form-item label="">
        <el-input v-model="form.phone" clearable></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="simpleClose" size="medium">取消</el-button>
      <el-button type="primary" @click="submit" size="medium">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addShop } from "@/api/leadManagement/shopManagement";
import { companyListSelect } from "@/api/common";
export default {
  name: "shopDialog",
  components: {},
  data() {
    return {
      rules: {
        name: [
          {
            required: true,
            trigger: "change",
            validator: (rule, value, callback) => {
              let reg = /^(?![_-])[a-zA-Z0-9_-]+$/;
              if (!value) {
                callback(new Error("输入的店铺名不能为空"));
              } else if (!reg.test(value)) {
                callback(
                  new Error(
                    "店铺名称仅支持英文、数字、横线、下划线，且不能以横线或下划线开头的"
                  )
                );
              } else {
                callback();
              }
            },
          },
        ],
        email: [
          {
            required: true,
            trigger: "change",
            message: "请输入注册邮箱",
          },
        ],
        company_id: [
          {
            required: true,
            trigger: "change",
            message: "请选择公司",
          },
        ],
      },
      form: {
        password: "",
        phone: "",
        leading_official: "",
        company_id: null,
        email: "",
        name: "",
      },
      search: {
        company_name: "",
        page: 1,
        page_size: 20,
      },
      searchLoading: false,
      checkOptions: [],
      loading: false,
    };
  },
  props: {
    topTitle: {
      type: String,
    },
    shopActVisible: {
      type: Boolean,
      default: false,
    },
    init: {
      type: Function,
      default() {
        return () => {
          return false;
        };
      },
    },
  },
  watch: {
    xxx: {},
  },
  created() {},
  methods: {
    simpleClose() {
      this.$emit("update:shopActVisible", false);
    },
    submit() {
      this.loading = true;
      this.$refs.form.validate((valid) => {
        if (valid) {
          addShop(this.form).then((res) => {
            this.simpleClose();
            this.$message.success("新增店铺成功");
            this.init();
            this.loading = false;
          });
        }
      });
    },
    querySearch(str) {
      if (str && str.toString().trim().length > 0) {
        this.search.company_name = str;
        this.searchLoading = true;
        companyListSelect(this.search).then((res) => {
          this.checkOptions = res.data.list;
          this.searchLoading = false;
        });
      } else {
        return;
      }
    },
  },
};
</script>

<style scoped lang='scss'>
.el-form-item {
  margin-bottom: 16px;
}
</style>