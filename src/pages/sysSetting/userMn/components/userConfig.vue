<!---*
* @description  
* @fileName userConfig.vue
* @author 叶金龙
* @date 2020/10/09 15:46:57
*--->
<template>
  <el-dialog
    :title="topStr + '角色'"
    :visible.sync="userConfigVisible"
    width="40%"
    :close-on-click-modal="false"
    :before-close="beforeClose"
  >
    <p class="titleLine">
      员工:<span>{{ user }}</span>
    </p>
    <p class="title">角色选择</p>
    <el-form
      :model="form"
      ref="form"
      label-width="80px"
      :inline="false"
      size="normal"
    >
      <el-radio-group v-model="form.roles_group_id">
        <el-radio
          :label="item.roles_group_id"
          v-for="(item, index) in rolesArr"
          :key="index"
          >{{ item.roles_group_name }}</el-radio
        >
      </el-radio-group>
    </el-form>
    <span slot="footer">
      <el-button @click="simpleClose" size="medium">取 消</el-button>
      <el-button
        type="primary"
        @click="submit"
        size="medium"
        :disabled="!form.roles_group_id"
        :loading="loading"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { searchUser, setRole } from "@/api/sysSetting/userMn";
import { simpleRoleList } from "@/api/sysSetting/rolesMn";
export default {
  name: "",
  components: {},
  data() {
    return {
      form: {
        roles_group_id: null,
      },
      loading: false,
    };
  },
  props: {
    userConfigVisible: {
      type: Boolean,
      default: false,
    },
    topStr: {
      type: String,
      default: "",
    },
    useObj: {
      type: Object,
      default() {
        return {};
      },
    },
    rolesArr: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  watch: {
    useObj: {
      immediate: true,
      deep: true,
      handler(val) {
        if (Object.keys(val).length > 0) {
          this.form = {
            ...this.form,
            ...val,
          };
        }
      },
    },
  },
  created() {},
  methods: {
    beforeClose() {
      this.$emit("update:userConfigVisible", false);
    },
    simpleClose() {
      this.$emit("update:userConfigVisible", false);
    },
    submit() {
      this.loading = true;
      setRole(this.form).then((res) => {
        this.loading = false;
        this.simpleClose();
        this.$parent.getList();
      });
    },
  },
  computed: {
    user() {
      return `${this.form.name}(${this.form.job_number})`;
    },
  },
};
</script>

<style scoped lang='scss'>
.titleLine {
  line-height: 30px;
  height: 30px;
  span {
    font-weight: 800;
  }
}
.title {
  font-weight: 800;
  margin-top: 20px;
}
.el-form {
  .el-radio-group {
    margin-top: 10px;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    box-sizing: border-box;
    .el-radio {
      flex-basis: 33.3%;
      flex-shrink: 0;
      margin: 10px 0;
    }
  }
}
</style>