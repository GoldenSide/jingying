<!---*
* @description 再次确认
* @fileName reconfirm.vue
* @author 叶金龙
* @date 2020/10/29 18:23:36
*--->
<template>
  <el-dialog
    title="提示"
    :visible.sync="reComfirmVisible"
    width="40%"
    :before-close="beforeClose"
  >
    <div class="reconfirmBox">
      <p class="title">以下{{ textObj[form.platform_id].text }}填写错误：</p>
      <p class="errorInfo">
        <span>{{ errInfo.toString() }}</span>
      </p>
      <p class="notice">
        <i class="iconfont icontishi"></i>
        <span>{{ textObj[form.platform_id].notice }}</span>
      </p>
    </div>
    <span slot="footer">
      <el-button @click="simpleClose" size="mini">取 消</el-button>
      <el-button type="primary" @click="submit" size="mini">确认发布</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "reComfirm",
  components: {},
  data() {
    return {
      textObj: {
        1: {
          text: "公司ID",
          notice: "确认后，将发布到正确ID的公司",
        },
        2: {
          text: "店铺名称",
          notice: "确认后，将发布到正确名称的店铺",
        },
      },
    };
  },
  props: {
    reComfirmVisible: {
      type: Boolean,
      default: false,
    },
    form: {
      type: Object,
      default() {
        return {};
      },
    },
    errInfo: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  watch: {
    xxx: {},
  },
  created() {},
  methods: {
    beforeClose() {
      this.$confirm("确认放弃本次操作？")
        .then((_) => {
          this.simpleClose();
        })
        .catch((_) => {
          return false;
        });
    },
    simpleClose() {
      this.$emit("update:reComfirmVisible", false);
    },
    submit() {
      this.simpleClose();
      this.$parent.changeCheck({ key: this.form.platform_id });
    },
  },
};
</script>

<style scoped lang='scss'>
.reconfirmBox {
  min-height: 100px;
  position: relative;
  .title {
    font-weight: 600;
    color: #333;
  }
  .errorInfo {
    padding: 20px 0;
    text-indent: 2em;
    span {
      color: #ff4343;
      font-weight: 500;
    }
  }
  .notice {
    color: #8b9099;
    font-size: 13px;
    margin-top: 20px;
    height: 20px;
    line-height: 20px;
    position: absolute;
    bottom: 0;
    .icontishi {
      margin-right: 2px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
    }
  }
}
</style>