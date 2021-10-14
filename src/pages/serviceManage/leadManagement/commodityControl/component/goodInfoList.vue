<!---*
* @description  商品详情
* @fileName goodInfo.vue
* @author 叶金龙
* @date 2021/01/20 17:09:53
*--->
<template>
  <el-dialog
    title="搜索商品详情"
    :visible.sync="goodInfoVisible"
    width="634px"
    append-to-body
    :before-close="simpleClose"
  >
    <div class="list-content">
      <tableComponent
        :column="column"
        :tableData="currentDetail"
        height="calc(100vh - 385px)"
        total.sync="0"
      />
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "goodsListInfo",
  components: {},
  data() {
    return {
      column: [
        {
          label: "商品名称",
          prop: "title",
        },
        {
          label: "商品售价(￥)",
          prop: "price",
          align: "right",
        },
        {
          label: "图片",
          prop: "image",
          render: ({ h, row }) => {
            return h("div", [
              h("el-image", {
                attrs: {
                  src: row.image,
                  previewSrcList: [row.image],
                },
                style: {
                  width: "50px",
                  height: "50px",
                },
              }),
            ]);
          },
        },
      ],
    };
  },
  props: {
    goodInfoVisible: {
      type: Boolean,
      default: false,
    },
    currentDetail: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  watch: {
    currentDetail: {
      immediate: true,
      deep: true,
      handler(val) {},
    },
  },
  created() {},
  methods: {
    simpleClose() {
      this.$emit("update:goodInfoVisible", false);
    },
  },
};
</script>

<style scoped lang='scss'>
.list-content {
  /deep/ .el-table {
    .el-image-viewer__close {
      .el-icon-circle-close:before {
        font-size: 40px;
        color: #606266;
      }
    }
  }
}
</style>