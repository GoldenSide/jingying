<!---*
* @description 
* @fileName create.vue
* @author 叶金龙
* @date 2020/10/29 16:03:00
*--->
<template>
  <div class="createNotice-container">
    <goBack :act="'quit'" />
    <contHeader :titleText="$route.meta.title" />
    <div class="conditions-content">
      <div class="form-container">
        <el-form
          :model="form"
          ref="form"
          :rules="rules"
          label-width="100px"
          :inline="false"
          size="normal"
        >
          <el-form-item label="推送平台" prop="platform_id">
            <el-select
              v-model="form.platform_id"
              placeholder="请选择推送平台"
              clearable
              :disabled="isEdit"
              @change="clearValue"
            >
              <el-option
                v-for="item in calcPlatForm"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="消息类型" prop="type">
            <el-select
              v-model="form.type"
              placeholder="请选择消息类型"
              clearable
              :disabled="form.platform_id != '2'"
              @change="noticeTypeChange"
            >
              <el-option
                v-for="item in noticeType"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="跳转链接"
            v-if="form.platform_id == '2' && form.type == '2'"
          >
            <el-input
              v-model="form.redict"
              placeholder="请输入跳转链接，如https://www.baidu.com"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="idStatus[form.platform_id].text"
            v-if="form.platform_id !== null && form.platform_id !== ''"
          >
            <div class="selectBox">
              <div class="tagBox companys" v-if="form.platform_id == '1'">
                <div class="container" v-if="companys.length > 0">
                  <el-tag
                    v-for="(item, index) in companys"
                    :key="item.id"
                    closable
                    size="medium"
                    type="info"
                    @close="handleClose(companys, index)"
                  >
                    {{ item.company_name }}
                  </el-tag>
                </div>
                <div class="container text" v-else>不选择企业，默认全部企业</div>
              </div>
              <div class="tagBox shops" v-if="form.platform_id == '2'">
                <div class="container" v-if="shops.length > 0">
                  <el-tag
                    v-for="(item, index) in shops"
                    :key="item.id"
                    closable
                    size="medium"
                    type="info"
                    @close="handleClose(shops, index)"
                  >
                    {{ item.name }}
                  </el-tag>
                </div>
                <div class="container text" v-else>不选择店铺，默认全部店铺</div>
              </div>

              <div class="tagBox applications" v-if="form.platform_id == '3'">
                <div class="container" v-if="supplys.length > 0">
                  <el-tag
                    v-for="(item, index) in supplys"
                    :key="item.id"
                    closable
                    size="medium"
                    type="info"
                    s
                    @close="handleClose(supplys, index)"
                  >
                    {{ item.companyName }}
                  </el-tag>
                </div>
                <div class="container text" v-else>不选择供应商，默认全部供应商</div>
              </div>
              <i class="el-icon-plus" @click="selectObj"></i>
            </div>
          </el-form-item>
          <el-form-item label="标题" prop="title">
            <el-input
              v-model.trim="form.title"
              placeholder="请填写标题"
              maxlength="100"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="正文" prop="content">
            <editor
              :id="'productListEdior'"
              :maxImg="true"
              :haveTemp="$route.meta.title == '编辑公告'"
              v-model="form.content"
            ></editor>
          </el-form-item>
        </el-form>
        <div class="btns">
          <el-button type="default" size="medium" @click="quit()">取 消</el-button>
          <el-button type="primary" :loading="btnLoading" size="medium" @click="submit()"
            >发 布</el-button
          >
        </div>
      </div>
    </div>
    <selectTable
      v-if="selectVisible"
      :selectVisible.sync="selectVisible"
      :currentStatus="form.platform_id"
      :tagList="calcData"
      :topTitle="idStatus[form.platform_id].text"
      @getSelect="getSelect"
    ></selectTable>
  </div>
</template>

<script>
import Editor from "@/components/editor";
import selectTable from "./selectTable";
import {
  publishNotice,
  noticeItemInfo,
  editNotice,
} from "@/api/serviceMn/customerMn/notice";
import { getPlatForm } from "@/utils/cookie";
export default {
  name: "noticeCreate",
  components: { Editor, selectTable },
  data() {
    return {
      rules: {
        type: {
          required: true,
          message: "请选择消息类型",
          trigger: "change",
        },
        platform_id: {
          required: true,
          message: "请选择推送平台",
          trigger: "change",
        },
        title: {
          required: true,
          trigger: "change",
          message: "请填写标题",
        },
        content: {
          required: true,
          trigger: "change",
          message: "请填写正文内容",
        },
      },
      form: {
        type: null,
        platform_id: "",
        content: null,
        title: null,
        shop_ids: [],
        company_ids: [],
        company_codes: [],
        redict: "",
      },
      noticeType: [
        {
          value: "1",
          text: "公告",
        },
        {
          value: "2",
          text: "通知",
        },
      ],
      platFormType: [
        {
          value: "1",
          text: "云栈",
        },
        {
          value: "2",
          text: " Xshoppy",
        },
        {
          value: "3",
          text: "SCM",
        },
      ],
      idStatus: {
        1: {
          text: "推送企业",
          key: "companys",
          outKey: "company_ids",
          handleKey: "id",
        },
        2: {
          text: "推送店铺",
          key: "shops",
          outKey: "shop_ids",
          handleKey: "id",
        },
        3: {
          text: "推送供应商",
          key: "supplys",
          outKey: "company_codes",
          handleKey: "companyCode",
        },
      },
      canBack: false,
      reComfirmVisible: false,
      isEdit: false,
      shops: [],
      companys: [],
      supplys: [],
      selectVisible: false,
      btnLoading: false,
    };
  },
  props: {},
  watch: {
    xxx: {},
  },
  activated(){},
  created() {},
  beforeRouteLeave(to, from, next) {
    next(false);
    if (this.canBack) {
      next();
    } else {
      this.quit();
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (Object.keys(to.query).length > 0) {
        vm.isEdit = true;
        noticeItemInfo(to.query).then((res) => {
          vm.form = {
            ...res.data.message,
          };
          vm.companys = res.data.message.company_ids_names;
          vm.getSelect(vm.companys);
        });
      }
    });
  },
  methods: {
    selectObj() {
      this.selectVisible = true;
    },
    quit() {
      this.utils.deleConfig(
        this,
        "您所填写的内容，将不会保存，并返回上一页",
        "提示",
        ["确定", "取消"],
        this.quitCb()
      );
    },
    quitCb() {
      return () => {
        this.canBack = true;
        this.$router.go(-1);
      };
    },
    submit() {
      this.btnLoading = true;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            editNotice(this.form).then((res) => {
              this.btnLoading = false;
              this.$message.success("操作成功");
              this.quitCb()();
            });
          } else {
            publishNotice(this.form).then((res) => {
              this.btnLoading = false;
              this.$message.success("操作成功");
              this.quitCb()();
            });
          }
        } else {
          this.btnLoading = false;
        }
      });
    },

    clearValue(val) {
      if (val != "2") {
        this.form.type = "1";
      }
      this.form.redict = "";
    },
    noticeTypeChange() {
      this.form.redict = "";
    },
    getSelect(arr) {
      this[this.calcKey("key")] = arr;
      this.form[this.calcKey("outKey")] = arr.map((v) => {
        return v[this.calcKey("handleKey")];
      });
    },
    handleClose(arr, index) {
      arr.splice(index, 1);
      this.getSelect(arr);
    },
  },
  computed: {
    calcData() {
      return this[this.idStatus[this.form.platform_id].key];
    },
    calcKey() {
      return function (k) {
        return this.idStatus[this.form.platform_id][k];
      };
    },
    calcPlatForm() {
      if (getPlatForm() == "XShoppy") {
        return this.platFormType;
      } else if (getPlatForm() == "Emysale") {
        this.form.platform_id = "2";
        return [
          {
            value: "2",
            text: " Emysale",
          },
        ];
      }
    },
  },
};
</script>

<style scoped lang="scss">
.createNotice-container {
  .form-container {
    padding: 20px 20px 100px;
    min-height: calc(100vh - 194px);
    position: relative;
    /deep/ .el-form-item {
      &:last-child {
        margin-bottom: 0;
      }
    }
    .btns {
      position: absolute;
      bottom: 20px;
      right: 20px;
    }
  }
  /deep/ .el-form {
    .el-form-item {
      .el-form-item__content {
        .selectBox {
          display: flex;
          justify-content: space-between;
          flex-wrap: nowrap;
          position: relative;

          .tagBox {
            flex: 1;
            min-height: 36px;
            border-radius: 4px;
            border: 1px solid #dcdfe6;
            padding-right: 30px;
            .container {
              display: flex;
              justify-content: flex-start;
              flex-wrap: wrap;
              &.text {
                height: 36px;
                line-height: 36px;
                color: #c0c4cc;
                padding-left: 16px;
                font-size: 13px;
              }
              .el-tag {
                margin: 6px;
              }
            }
          }
          .el-icon-plus {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translate(0, -50%);
            font-size: 16px;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
