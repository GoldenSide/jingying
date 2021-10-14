<!---*
* @description 角色新增和删除
* @fileName roleHandler.vue
* @author 叶金龙
* @date 2020/10/10 15:01:33
*--->
<template>
  <el-dialog
    :title="topStr + '角色'"
    :visible.sync="roleHandlerVisible"
    width="30%"
    :before-close="beforeClose"
    :close-on-click-modal="false"
  >
    <el-form :model="form" ref="form" label-width="80px" :inline="false" size="normal">
      <el-form-item label="角色名">
        <el-input v-model.trim="form.name" maxlength="10" show-word-limit></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="simpleClose" size="medium">取 消</el-button>
      <el-button
        type="primary"
        @click="submit"
        size="medium"
        :loading="loading"
        :disabled="form.name.length == 0"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: "roleHandler",
  components: {},
  data() {
    return {
      form: {
        name: "",
      },
      loading: false,
    };
  },
  props: {
    roleHandlerVisible: {
      type: Boolean,
      default: false,
    },
    topStr: {
      type: String,
      default: "",
    },
    currentRole: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  watch: {
    currentRole: {
      immediate: true,
      deep: true,
      handler(val) {
        if (Object.keys(val).length > 0) {
          this.form = {
            ...this.form,
            ...{ name: val.roles_group_name, id: val.roles_group_id },
          };
        }
      },
    },
  },
  created() {},
  methods: {
    beforeClose() {
      this.$emit("update:roleHandlerVisible", false);
    },
    simpleClose() {
      this.$emit("update:roleHandlerVisible", false);
    },
    submit() {
      this.loading = true;
      let parent = this.$parent;
      parent[parent.actName](this.form).then((res) => {
        if (res) {
          this.simpleClose();
          this.loading = false;
          parent.initData();
          this.form = this.$options.data().form;
        }
      });
    },
  },
};
</script>

<style scoped lang="scss"></style>
