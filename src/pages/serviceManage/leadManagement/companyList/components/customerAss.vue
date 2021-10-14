<!---*
* @description 
* @fileName customerAss.vue
* @author 龙伟
* @date 2020/11/30 09:57:06
*--->
<template>
  <div class="customerAss-container">
    <el-dialog
      title="客户关联"
      :visible.sync="customerAssVisible"
      :before-close="customerAssDown"
      :close-on-click-modal="false"
      width="768px"
    >
      <div class="customerAss-content">
        <kr-paging
          :dataList="customerAssList"
          filterable
          :boxTitle="['请选择要关联的客户', '已选客户']"
          :filter-placeholder="['请输入搜索内容', '请输入搜索内容']"
          :selectedData="customerAssValue"
          :pageSize="100"
          @onChange="getCustomerAssValue"
        />
      </div>
      <el-dialog
        width="30%"
        title="客户关联-关联标签"
        :visible.sync="innerVisible"
        :close-on-click-modal="false"
        append-to-body
      >
        <div class="internal">
          <div class="internal-top">
            <h4>已选择客户：</h4>
            <ul>
              <li>{{ this.selectedAss.join("、") }}</li>
            </ul>
          </div>
          <div class="radio-internal">
            <el-radio
              @change="getAssType(assObj.type)"
              v-model="assObj.type"
              label="1"
              >关联至新标签</el-radio
            >
            <el-radio
              @change="getAssType(assObj.type)"
              v-model="assObj.type"
              label="2"
              >关联至已有标签</el-radio
            >
          </div>
        </div>
        <el-form
          :model="assObj"
          ref="assObjValidateForm"
          :rules="rules"
          class="demo-ruleForm"
        >
          <el-form-item
            v-if="assObj.type == 1"
            label="关联至新标签"
            prop="name"
            :rules="[
              {
                required: true,
                max: '15',
                message: '标签不能为空',
                trigger: 'blur',
              },
            ]"
          >
            <el-input
              type="name"
              v-model="assObj.name"
              placeholder="请输入标签名，最大15个字符"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item v-else label="选择标签" prop="id">
            <el-select v-model="assObj.id" placeholder="请选择标签">
              <el-option
                v-for="(item, index) in allTagsType"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="medium" @click="innerVisible = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="customerAssSubmit"
            >确定</el-button
          >
        </div>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="customerAssDown">取 消</el-button>
        <el-button size="medium" type="primary" @click="innerVisibleShow"
          >去关联</el-button
        >
      </div>
    </el-dialog>
    <!-- 开始关联 -->
  </div>
</template>

<script>
import {
  getTagCompanyList,
  getAssignTypeData,
  tagConfirm,
} from "@/api/leadManagement/companyList";
export default {
  name: "customerAssMenu",
  components: {},
  data() {
    return {
      search: {
        page: 1,
        page_size: 99999,
      },
      innerVisible: false,
      assObj: {
        type: "1",
        id: "",
        name: "",
        company_ids: "",
      },
      rules: {
        id: [{ required: true, message: "请选择标签", trigger: "change" }],
      },
      allTagsType: [],
      customerAssList: [],
      customerAssValue: [],
      selectedAss: [],
    };
  },
  props: {
    customerAssVisible: {
      type: Boolean,
      default: false,
    },
  },
  watch: {},
  created() {
    this.customerAssData();
  },
  methods: {
    //   提交
    customerAssSubmit() {
      this.$refs.assObjValidateForm.validate((valid) => {
        if (valid) {
          tagConfirm(this.assObj).then((res) => {
            // console.log(res);
            if (res.code == 0) {
              this.$message({
                message: "操作成功",
                type: "success",
              });
              this.innerVisible = false
              this.customerAssDown()
              this.$parent.getList()
              this.$parent.getSearcType()
            }
          });
        } else {
          return false;
        }
      });
    },

    innerVisibleShow() {
      if (!this.selectedAss.length > 0) {
        this.$message.error("请先选择客户");
        return;
      }
      this.innerVisible = true;
    },
    customerAssData() {
      let data = [];
      let companyData = [];
      getTagCompanyList(this.search).then((res) => {
        // console.log(res);
        // companyData = res.data.list;
        this.customerAssList = res.data.list;
        // this.customerAssList = companyData;
      });
      getAssignTypeData().then((res) => {
        this.allTagsType = res.data.list;
      });
    },
    getAssType(val = 1) {
      if (val == 1) {
        this.assObj.id = "";
      } else {
        this.assObj.name = "";
      }
    },
    getCustomerAssValue(val) {
      let arr = [];
      val.forEach((item, index) => {
        this.customerAssList.map((j, index) => {
          if (item == j.id) {
            arr.push(j.label);
            return;
          }
        });
      });
      this.selectedAss = arr;
      this.assObj.company_ids = val;
      // console.log(arr);
    },
    customerAssDown() {
      this.$emit("update:customerAssVisible", false);
    },
  },
};
</script>

<style scoped lang='scss'>
.customerAss-container {
  .customerAss-content {
    /deep/ .krry-main {
      display: flex;
      align-items: center;
      .el-transfer-panel {
        &.district-panel {
          flex: 1;
        }
      }
      .opera {
        width: 50px;
      }
    }
  }
}
.internal {
  .internal-top {
    padding-bottom: 16px;
    border-bottom: 1px solid #dfe3e8;
    h4 {
      color: #909399;
      margin-bottom: 8px;
    }
    ul {
      max-height: 200px;
      overflow: auto;
    }
  }
  .radio-internal {
    padding-top: 20px;
  }
}
.demo-ruleForm {
  margin-top: 27px;
}
</style>