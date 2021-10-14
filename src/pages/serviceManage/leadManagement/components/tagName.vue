<!---*
* @description 
* @fileName tagName.vue
* @author 龙伟
* @date 2020/11/27 15:04:05
*--->
<template>
  <div class="tag_name_contaniner">
    <el-dialog
      title="标签详情"
      :visible.sync="tagNameVisible"
      :before-close="isTagNameVisible"
      :close-on-click-modal="false"
      width="634px"
    >
      <div class="tag_name_content">
        <p>
          <label>客户关联标签：</label>
          <span>{{ tagName }}</span>
        </p>
        <h4>关联客户信息</h4>
        <tableComponent
          :column="column"
          :tableData="dataList"
          :page.sync="search.page"
          :page_size.sync="search.page_size"
          :total.sync="pagination.total"
          :loading.sync="loading"
          height="calc(100vh - 385px)"
          :pageAct="getList"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="isTagNameVisible">取 消</el-button>
        <el-button
          size="medium"
          v-if="tagNameData.disconnect"
          type="primary"
          @click="disconnect"
          >解除关联</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { tagOne, tagRemoveRelation } from "@/api/leadManagement/followUp";
export default {
  name: "tagMenu",
  components: {},
  data() {
    return {
      search: {
        id: null,
        is_return_relation_company: "Y",
        page: 1,
        page_size: 15,
      },
      tagName: "",
      pagination: {
        total: 0,
      },
      loading: false,
      column: [],
      dataList: [],
      tagNameList: {},
    };
  },
  props: {
    tagNameVisible: {
      type: Boolean,
      default: false,
    },
    tagNameData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  watch: {
    tagNameData: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val) {
          this.search.id = val.tag_id;
          this.column = val.tagColumn;
          this.getList();
        }
      },
    },
  },
  created() {},
  methods: {
    //   获取数据
    getList() {
      tagOne(this.search).then((res) => {
        // console.log(res);
        this.dataList = res.data.companies;
        this.tagName = res.data.tag.name;
      });
    },
    isTagNameVisible() {
      this.$emit("update:tagNameVisible", false);
    },
    // 解除关联
    disconnect() {
      this.$confirm(
        "是否确认解除关联，解除关联后，此标签对应的关联客户之间将取消关联",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        tagRemoveRelation({
          id: this.search.id,
        }).then((res) => {
          if (res.code == 0) {
            this.isTagNameVisible();
            this.$parent.getList();
            this.$parent.getSearcType();
            this.$message.success("解除成功!");
          }
          // console.log(res);
        });
      });
    },
  },
};
</script>

<style scoped lang='scss'>
.tag_name_contaniner {
  .tag_name_content {
    & > p {
      padding: 0 0 16px;
      border-bottom: 1px solid #dfe3e8;
      label {
        color: #909399;
      }
      span {
        color: #212b36;
      }
    }
    & > h4 {
      padding: 16px 0 12px;
      color: #212b36;
      font-weight: 500;
    }
  }
}
</style>