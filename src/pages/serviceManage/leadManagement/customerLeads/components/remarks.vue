<!---*
* @description 
* @fileName remarks.vue
* @author 龙伟
* @date 2020/11/18 17:11:10
*--->
<template>
  <div class="remarks-content">
    <el-dialog
      :title="strTop + '备注'"
      :visible.sync="remarksVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
      width="634px"
    >
      <div class="content">
        <p>备注</p>
        <el-input
          type="textarea"
          placeholder="请输入备注内容，最多可输入200字，超出不可输入"
          v-model="remarksVal.remarks"
          maxlength="200"
          show-word-limit
          :autosize="true"
          resize="none"
        >
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="remarksClose" size="medium">取 消</el-button>
        <el-button type="primary" size="medium" @click="submit" :loading="loading"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { editRemarks } from "@/api/leadManagement/customerLeads";
export default {
  name: "remarksMenus",
  components: {},
  data() {
    return {
      strTop: "添加",
      loading: false,
      remarksVal: {
        id: null,
        remarks: "",
      },
    };
  },
  props: {
    remarksVisible: {
      type: Boolean,
      default: false,
    },
    remarksData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  watch: {
    remarksData: {
      immediate: true,
      deep: true,
      handler(val) {
        if (Object.keys(val).length > 0) {
          let { id, remarks } = val;
          if (remarks) {
            this.strTop = "修改";
          }else {
             this.strTop = "添加";
          }
          this.remarksVal.remarks = remarks;
          this.remarksVal.id = id;
        }
      },
    },
  },
  created() {},
  methods: {
    remarksClose() {
      this.$emit("update:remarksVisible", false);
    },
    submit() {
        this.loading=true
      editRemarks(this.remarksVal).then((res) => {
        if(res.code == 0) {
            this.remarksClose()
            this.$parent.getList()
            this.loading = false
        }
      });
    },
    handleClose() {
      this.remarksClose();
    },
  },
};
</script>

<style scoped lang='scss'>
.remarks-content {
  .content {
    padding: 30px 0;
    & > p {
      color: #212b36;
      margin-bottom: 4px;
    }
  }
}
</style>