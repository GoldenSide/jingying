<!---*
* @description  添加备注
* @fileName noticeAdd.vue
* @author 叶金龙
* @date 2021/03/27 20:49:32
*--->
<template>
  <el-dialog
    title="备注"
    :visible.sync="noticeVisible"
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
      <p class="title">
        <i style="color: #ff4343">*</i>
        备注
      </p>
      <el-form-item label="" prop="content">
        <el-input
          type="textarea"
          v-model="form.content"
          maxlength="500"
          row="25"
          show-word-limit
          placeholder="最多输入500字"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="btnBox">
      <el-button
        type="primary"
        @click="submit"
        size="medium"
        :loading="btnLoading"
        >添 加</el-button
      >
    </div>
    <p class="title">历史备注</p>
    <div class="list-content">
      <tableComponent
        :column="column"
        :tableData="dataList"
        :page.sync="search.page"
        :page_size.sync="search.page_size"
        :total.sync="pagination.total"
        :loading.sync="loading"
        height="calc(100vh - 647px)"
        :pageAct="getList"
      />
    </div>
  </el-dialog>
</template>

<script>
import {
  remarkList,
  addRemark,
} from "@/api/serviceMn/customerMn/overdueBillFollow";
export default {
  name: "addNotice",
  components: {},
  data() {
    return {
      search: {
        page: 1,
        page_size: 10,
        overdue_bill_id: null,
      },
      pagination: {
        total: 0,
      },
      rules: {
        content: [
          {
            required: true,
            trigger: "change",
            message: "请输入备注内容",
          },
        ],
      },
      dataList: [],
      column: [
        { label: "时间", prop: "update_time" },
        { label: "内容", prop: "content" },
        { label: "记录人", prop: "operator_name" },
      ],
      form: {
        content: "",
        overdue_bill_id: null,
      },
      loading: false,
      btnLoading: false,
    };
  },
  props: {
    noticeVisible: {
      type: Boolean,
      default: false,
    },
    overdue_bill_id: {
      type: [Number, String],
    },
  },
  watch: {
    overdue_bill_id: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val !== null && val !== "") {
          this.search.overdue_bill_id = val;
          this.form.overdue_bill_id = val;
          this.getList();
        }
      },
    },
  },
  created() {},
  methods: {
    simpleClose() {
      this.$emit("update:noticeVisible", false);
    },
    getList() {
      remarkList(this.search).then((res) => {
        let { list, count } = res.data;
        this.dataList = list;
        this.pagination.total = count;
      });
    },
    submit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.btnLoading = true;
          addRemark(this.form)
            .then((res) => {
              this.btnLoading = false;
              this.simpleClose();
            })
            .catch((err) => {
              this.btnLoading = false;
            });
        }
      });
    },
  },
};
</script>

<style scoped lang='scss'>
.title {
  margin-bottom: 4px;
  height: 20px;
  line-height: 20px;
  i {
    line-height: 20px;
  }
}
.btnBox {
  overflow: hidden;
  .el-button {
    float: right;
  }
}
</style>