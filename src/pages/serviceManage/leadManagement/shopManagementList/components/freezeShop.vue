<!---*
* @description  冻结店铺
* @fileName freezeShop.vue
* @author 叶金龙
* @date 2021/06/04 16:13:45
*--->
<template>
  <el-dialog
    title="冻结店铺"
    :visible.sync="freezeShopVisible"
    :close-on-click-modal="false"
    :before-close="simpleClose"
    width="634px"
  >
    <div class="deactivate-content">
      <div style="display: flex; align-items: center">
        <i
          class="el-icon-warning"
          style="color: #e6a23c; margin-right: 10px; font-size: 24px"
        ></i>
        <p style="line-height: 1.5">
          确认冻结此店铺吗？冻结后此店铺将无法再登陆店铺后台，也无法再解冻店铺
        </p>
      </div>
      <div style="margin-top: 16px; display: flex">
        <span style="width: 48px">原因：</span>
        <el-input
          type="textarea"
          placeholder="最多支持输入100字，超出不可输入"
          v-model="freezeShopReason"
          maxlength="100"
          show-word-limit
          :autosize="true"
          resize="none"
        >
        </el-input>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button
        @click="simpleClose"
        :disabled="freezeShopLoading"
        size="medium"
        >取 消</el-button
      >
      <el-button
        type="primary"
        size="medium"
        :loading="freezeShopLoading"
        @click="changeFreezeShop"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { shopFreeze } from "@/api/leadManagement/shopManagement";
export default {
  name: "freezeShop",
  components: {},
  data() {
    return {
      freezeShopLoading: false,
      freezeShopReason: "",
    };
  },
  props: {
    freezeShopVisible: {
      type: Boolean,
      default: false,
    },

    freezeShopId: {
      type: [Number, String],
    },
    refresh: {
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
      this.$emit("update:freezeShopVisible", false);
    },
    changeFreezeShop() {
      this.freezeShopLoading = true;
      shopFreeze({
        shop_id: this.freezeShopId,
        is_del: 1,
        freeze_reason: this.freezeShopReason,
      })
        .then((res) => {
          if (res.code == 0) {
            this.$message.success("操作成功");
            this.freezeShopLoading = false;
            this.simpleClose();
            this.refresh();
          }
        })
        .catch((err) => {
          this.freezeShopLoading = false;
        });
    },
  },
};
</script>

<style scoped lang="scss"></style>
