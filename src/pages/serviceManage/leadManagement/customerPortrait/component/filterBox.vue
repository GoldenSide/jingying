<!---*
* @description 筛选条件
* @fileName filterBox.vue
* @author 叶金龙
* @date 2021/03/05 15:46:34
*--->
<template>
  <div class="filter-container">
    <div class="listBox">
      <div class="title">添加筛选条件</div>
      <div class="filterRideo">
        <label class="radioLabel">满足条件：</label>
        <el-radio
          v-model="obj.filter_type"
          :label="item.label"
          v-for="(item, index) in radioArr"
          :key="index"
          >{{ item.text }}</el-radio
        >
      </div>
      <div class="filterList">
        <slot name="filterList" />
      </div>
    </div>
    <div class="btnBox">
      <slot name="btnBox" />
    </div>
  </div>
</template>

<script>
export default {
  name: "filterList",
  components: {},
  data() {
    return {
      radioArr: [
        {
          label: "1",
          text: "所有条件",
        },
        {
          label: "2",
          text: "任一条件",
        },
      ],
    };
  },
  props: {
    obj: {
      type: Object,
    },
  },
  watch: {
    xxx: {},
  },
  created() {},
  methods: {},
};
</script>

<style scoped lang='scss'>
.filter-container {
  background-color: #fff;
  .listBox {
    padding: 0 16px 16px;
    .title {
      padding-top: 16px;
      font-size: 16px;
      font-weight: 600;
      color: #1c3246;
      margin-bottom: 16px;
      border-top: 1px solid #f5f5f5;
    }
    .filterRideo {
      label {
        width: 70px;
        height: 22px;
        line-height: 22px;
        font-size: 14px;
        display: inline-block;
      }
      .el-radio {
        margin-left: 32px;
        margin-right: 0px;
      }
    }
    .filterList {
      margin-top: 12px;
      .el-button {
        border: none;
        &:hover {
          color: #409eff;
          background: #f7f8fa;
        }
      }
    }
  }

  .btnBox {
    box-sizing: border-box;
    padding: 16px;
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid #e6e6e6;
  }
}
</style>