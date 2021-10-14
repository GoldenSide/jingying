<!---*
* @description  菜单操作
* @fileName menuHandler.vue
* @author 叶金龙
* @date 2020/10/12 19:42:03
*--->
<template>
  <el-dialog
    :title="topStr + '菜单'"
    :visible.sync="menuDiaVisible"
    width="50%"
    :close-on-click-modal="false"
    :before-close="beforeClose"
  >
    <el-form
      :model="form"
      ref="form"
      :rules="rules"
      label-width="86px"
      :inline="false"
      size="normal"
    >
      <el-form-item label="父级菜单" prop="parent_id">
        <el-cascader
          v-model="form.parent_id"
          placeholder="请选择父级菜单"
          :options="parentmenuArr"
          :props="{
            children: 'child',
            label: 'title',
            value: 'menu_id',
            checkStrictly: true,
          }"
          clearable
        ></el-cascader>
      </el-form-item>
      <!-- <el-form-item label="菜单层级" prop="grade_type">
        <el-select
          v-model="form.grade_type"
          placeholder="请选择菜单层级"
          clearable
          filterable
        >
          <el-option
            v-for="item in menuLevelArr"
            :key="item.value"
            :label="item.text"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item
        :label="item.label"
        v-for="(item, index) in formConfig"
        :key="index"
        :prop="item.prop"
      >
        <el-input
          clearable v-if="item.prop != 'cache'"
          :placeholder="item.placeHolder"
          v-model.trim="form[item.prop]"
        ></el-input> 
         <el-select v-model="form[item.prop]" v-if="item.prop == 'cache'" placeholder="请选择">
    <el-option 
      v-for="item in cacheOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
      <!-- <el-checkbox v-if="item.prop == 'cache'" v-model="form[item.prop]"></el-checkbox> -->
      </el-form-item> 
    </el-form>
    <div class="otherLine">
      <div class="tops">
        <label>后端接口</label>
        <el-button
          type="success"
          size="mini"
          circle
          :disabled="isDisabled"
          icon="el-icon-plus"
          @click="addBackend"
        ></el-button>
      </div>
      <div class="inputBox">
        <div
          class="inputLine"
          v-for="(item, index) in form.backend_uri"
          :key="index"
        >
          <label>{{ index + 1 }}</label>
          <el-input
            v-model.trim="item.uri"
            placeholder="请输入后端接口地址"
            size="normal"
            clearable
          ></el-input>
          &nbsp; &nbsp;
          <el-button
            type="danger"
            size="mini"
            circle
            icon="el-icon-delete"
            @click="deleBackend(index)"
          ></el-button>
          &nbsp; &nbsp;
        </div>
      </div>
    </div>
    <span slot="footer">
      <el-button @click="simpleClose" size="medium">取 消</el-button>
      <el-button type="primary" @click="submit" size="medium" :loading="loading"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
var validateArr = (rule, value, callback) => {
  if (value.length === 0) {
    callback(new Error(rule.message));
  } else {
    callback();
  }
};
import enums from "@/utils/enums";
import {
  parentMenuList,
  handlerMenu,
  menuInfo,
} from "@/api/sysSetting/menusMn";
export default {
  name: "menuHandler",
  components: {},
  data() {
    return {
      form: {
        parent_id: [],
        title: null,
        icon: null,
        project_id: 1,
        front_uri: null,
        front_path: null,
        front_redirect: null,
        backend_uri: [],
        cache:1
      },
      cacheOptions:[
        {label:'是',value:1},
         {label:'否',value:0},
      ],
      formConfig: [
        { label: "菜单名称", prop: "title", placeHolder: "请输入菜单名称" },
        { label: "icon", prop: "icon", placeHolder: "请输入图标名称" },
        { label: "path", prop: "front_uri", placeHolder: "请输入路由path" },
        {
          label: "component",
          prop: "front_path",
          placeHolder: "请输入前端页面地址",
        },
        {
          label: "redirect",
          prop: "front_redirect",
          placeHolder: "请输入前端重定向地址",
        },
        {
          label: "cache",
          prop: "cache", 
        },
      ],
      rules: {
        parent_id: {
          required: true,
          trigger: "change",
          message: "请选择父级菜单",
          validator: validateArr,
        },
        // grade_type: {
        //   required: true,
        //   trigger: "change",
        //   message: "请选择菜单层级",
        // },
        title: {
          required: true,
          trigger: "change",
          message: "请输入菜单名称",
        },
        // front_uri: {
        //   required: true,
        //   trigger: "change",
        //   message: "请输入路由path",
        // },
      },
      menuLevelArr: enums.menuLevelArr,
      parentmenuArr: [],
      loading: false,
    };
  },
  props: {
    menuDiaVisible: {
      type: Boolean,
      default: false,
    },
    topStr: {
      type: String,
      default: "",
    },
    menuData: {
      type: Array,
      default() {
        return [];
      },
    },
    infoObj: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  watch: {
    menuData: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val.length > 0) {
          let handlerArr = this.utils.deleRecursiveNullKey(val, "child");
          this.parentmenuArr = this.utils.deepClone(handlerArr);
        }
      },
    },
    infoObj: {
      immediate: true,
      deep: true,
      handler(val) {
        if (Object.keys(val).length > 0) {
          this.form = { ...this.form, ...val };
        }
      },
    },
  },
  created() {},
  methods: {
    beforeClose() {
      this.simpleClose();
      // this.$confirm("确认放弃本次操作？", "提示")
      //   .then((_) => {
      //     this.simpleClose();
      //   })
      //   .catch((_) => {
      //     return false;
      //   });
    },
    submit() {
      this.$refs["form"].validate((value) => {
        if (value) {
          this.loading = true;
          if (this.isEdit(this.form)) {
            handlerMenu(this.form, "/common/menu/edit").then((res) => {
              this.simpleClose();
              this.loading = false;
              this.$parent.initData();
            });
          } else {
            this.editPost();
          }
        } else {
          return false;
        }
      });
    },
    editPost() {
      handlerMenu(this.form, "/common/menu/add").then((res) => {
        this.simpleClose();
        this.loading = false;
        this.$parent.initData();
      });
    },
    isEdit(model) {
      if (model.hasOwnProperty("menu_id")) {
        return true;
      } else {
        return false;
      }
    },
    simpleClose() {
      this.$emit("update:menuDiaVisible", false);
    },
    addBackend() {
      this.form.backend_uri.push({ uri: "" });
    },
    deleBackend(index) {
      this.utils.deleConfig(
        this,
        "确认删除第" + (index + 1) + "个后端地址？",
        "提示",
        ["确定", "取消"],
        this.deleAct(index)
      );
    },
    deleAct(index) {
      return () => {
        this.form.backend_uri.splice(index, 1);
      };
    },
  },
  computed: {
    isDisabled() {
      return this.form.backend_uri.some((v) => {
        return !Boolean(v.uri);
      });
    },
  },
};
</script>

<style scoped lang='scss'>
.el-form {
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .el-form-item {
    flex-basis: 49%;
    flex-shrink: 0;
  }
}
.otherLine {
  .tops {
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e1e1e1;
    border-top: 1px solid #e1e1e1;
    label {
      font-size: 12px;
    }
  }
  .inputBox {
    max-height: 300px;
    overflow-y: scroll;
    .inputLine {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;

      label {
        flex-basis: 30px;
        text-align: center;
      }
    }
  }
}
</style>