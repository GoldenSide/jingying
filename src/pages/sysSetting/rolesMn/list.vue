<!---*
* @description  角色管理
* @fileName list.vue
* @author 叶金龙
* @date 2020/09/29 16:14:22
*--->
<template>
  <div class="rolesMn-container">
    <contHeader :titleText="$route.meta.title" />
    <div class="layout-box">
      <div class="box leftbox">
        <div class="topLine">
          角色
          <el-button
            v-for="(item, index) in btnConfig"
            :key="index"
            :type="item.type"
            :icon="item.icon"
            circle
            :title="item.title"
            @click="btnAct(item.cb)"
            :disabled="checkDis(item.isCheck)"
          ></el-button>
        </div>
        <el-divider></el-divider>
        <div class="rolesBox">
          <ul class="list">
            <li
              :class="['item', { active: currentIndex == index }]"
              v-for="(item, index) in roles"
              :key="index"
              @click="roleClick(item, index)"
            >
              {{ item.roles_group_name }}
            </li>
          </ul>
        </div>
      </div>
      <div class="box rightbox" ref="rightBox">
        <div class="featureBox">
          <div class="roleName">{{ currentRole.roles_group_name }}</div>
          <div class="feature-container">
            <div class="topHeader">
              <div class="item" v-for="(item, index) in header" :key="index">
                {{ item.text }}
              </div>
            </div>
            <div class="featurePanel" ref="panelParent">
              <feature-module
                v-for="(featureline, index) in featureList"
                :key="index"
                :featureline="featureline"
                :level="featureline.level"
                :panelWidth="panelWidth"
              />
              <!-- :selectObject.sync="selectObject" -->
            </div>
          </div>
        </div>

        <div class="btnBox">
          <el-button
            type="primary"
            size="medium"
            @click="saveFeature"
            :loading="btnLoading"
            >保 存</el-button
          >
        </div>
      </div>
    </div>
    <roleHandler
      :roleHandlerVisible.sync="roleHandlerVisible"
      :topStr="topStr"
      :currentRole="calcRole"
      v-if="roleHandlerVisible"
    />
    <div></div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import PaginationCom from "@/components/pagination";
import contHeader from "@/components/contentHeader";
import roleHandler from "./components/roleHandler";
import featureModule from "./components/featureModule";
import {
  rolesList,
  addRole,
  editRole,
  deleRole,
  featureTable,
} from "@/api/sysSetting/rolesMn";
export default {
  name: "rolesMana",
  components: { PaginationCom, contHeader, roleHandler, featureModule },
  data() {
    return {
      btnConfig: [
        {
          icon: "el-icon-plus",
          cb: "addRoleAct",
          title: "新增",
          type: "success",
          isCheck: false,
        },
        {
          icon: "el-icon-edit",
          cb: "editRoleAct",
          title: "编辑",
          type: "primary",
          isCheck: true,
        },
        {
          icon: "el-icon-delete",
          cb: "deleteRoleAct",
          title: "删除",
          type: "danger",
          isCheck: true,
        },
      ],
      roles: [],
      currentIndex: null,
      featureList: [],
      currentRole: {},
      header: [
        { text: "一级菜单" },
        { text: "二级菜单" },
        { text: "三级菜单" },
        { text: "功能" },
      ],
      roleHandlerVisible: false,
      topStr: "",
      actName: "",
      loading: null,
      btnLoading: false,
    };
  },

  props: {},
  watch: {
    currentTarget: {
      immediate: true,
      deep: true,
      handler(obj) {
        if (obj.arr.length > 0) {
          this.handleCheck(obj);
        }
      },
    },
  },
  created() {
    this.initData();
  },
  methods: {
    handleCheck(obj) {
      let index = this.featureList.findIndex((v) => {
        return obj.arr.includes(v.menu_id);
      });
      if (obj.level == 1) {
        this.recursiveCheck(this.featureList[index], obj);
      } else if (obj.level == 2 || obj.level == 3 || obj.level == 4) {
        let secondLine = this.featureList[index].children.find((v) => {
          return obj.arr.includes(v.menu_id);
        });
        let thridLine = secondLine.children.find((v) => {
          return obj.arr.includes(v.menu_id);
        });
        if (obj.level == 2) {
          this.featureList[index].is_select = this.judgeCheck(this.featureList[index]);
          this.recursiveCheck(secondLine, obj);
        } else if (obj.level == 3) {
          this.recursiveCheck(thridLine, obj);
          secondLine.is_select = this.judgeCheck(secondLine);
          this.featureList[index].is_select = this.judgeCheck(this.featureList[index]);
        } else if (obj.level == 4) {
          if (obj.bool) {
            thridLine.is_select = obj.bool;
            secondLine.is_select = obj.bool;
            this.featureList[index].is_select = obj.bool;
          }
        }
      }
    },
    recursiveCheck(menu_line, obj) {
      let list = [];
      if (menu_line.level == 3) {
        list = menu_line.event_list;
      } else {
        list = menu_line.children;
      }
      list.forEach((element) => {
        this.$set(element, "is_select", obj.bool);
        if (element.level) {
          this.recursiveCheck(element, obj);
        }
      });
    },
    judgeCheck(oneLine) {
      return oneLine.children.some((v) => {
        return v.is_select == true;
      });
    },
    initData() {
      rolesList().then(({ data }) => {
        this.roles = data;
        this.roleClick(data[0], 0);
      });
    },
    roleClick(item, index) {
      if (this.currentIndex == index) return;
      this.currentIndex = index;
      this.currentRole = item;
      this.featureData({ id: item.roles_group_id });
    },

    featureData(model) {
      if (this.loading != null) {
        this.loading.close();
      }
      this.loading = this.$loading({
        target: this.$refs.rightBox,
      });
      featureTable(model).then((res) => {
        let { list } = res.data;
        this.featureList = this.recursiveArr(list);
        setTimeout(() => {
          this.loading.close();
        }, 500);
      });
    },
    recursiveArr(list = [], firstArr = [], secondArr = [], thridArr = []) {
      list.forEach((element) => {
        if (element.level == 1) {
          firstArr = [element.menu_id];
          this.$set(element, "parentsIds", firstArr);
        } else if (element.level == 2) {
          secondArr = [...firstArr, element.menu_id];
          this.$set(element, "parentsIds", secondArr);
        } else if (element.level == 3) {
          thridArr = [...secondArr, element.menu_id];
          this.$set(element, "parentsIds", thridArr);
        } else {
          this.$set(element, "parentsIds", thridArr);
        }
        this.recursiveArr(
          element.level == 3 ? element.event_list : element.children,
          firstArr,
          secondArr,
          thridArr
        );
      });
      return list;
    },

    btnAct(cb) {
      this[cb]();
    },
    checkDis(bool) {
      if (!bool) {
        return bool;
      } else {
        if (this.roles.length <= 0) {
          return true;
        }
      }
    },
    addRoleAct() {
      this.roleHandlerVisible = true;
      this.topStr = "创建";
      this.actName = "addAct";
    },
    addAct(model) {
      return new Promise((resolve, reject) => {
        addRole(model).then((res) => {
          resolve(res);
        });
      });
    },
    editRoleAct() {
      this.roleHandlerVisible = true;
      this.topStr = "编辑";
      this.actName = "editAct";
    },
    editAct(model) {
      return new Promise((resolve, reject) => {
        editRole(model)
          .then((res) => {
            this.btnLoading = false;
            resolve(res);
          })
          .catch((error) => {
            this.btnLoading = false;
            reject();
          });
      });
    },

    deleteRoleAct() {
      this.utils.deleConfig(
        this,
        "此操作将删除此角色(" + this.currentRole.roles_group_name + "), 是否继续?",
        "提示",
        ["确 定", "取 消"],
        this.deleCb()
      );
    },
    deleCb() {
      return () => {
        deleRole({ id: this.currentRole.roles_group_id }).then((res) => {
          this.initData();
        });
      };
    },
    saveFeature() {
      let model = {
        menu_tree: this.featureList,
        id: this.currentRole.roles_group_id,
      };
      this.btnLoading = true;
      this.editAct(model).then((res) => {
        this.featureData({ id: this.currentRole.roles_group_id });
      });
    },
    ...mapMutations("permission", ["SET_CURRENT_TARGET"]),
  },
  computed: {
    calcRole() {
      return this.actName == "addAct" ? {} : this.currentRole;
    },
    panelWidth() {
      return this.$refs.panelParent.clientWidth;
    },
    ...mapGetters(["currentTarget"]),
  },
  beforeRouteLeave(to, from, next) {
    this.SET_CURRENT_TARGET({
      bool: false,
      arr: [],
      level: null,
      menu_id: null,
    });
    next();
  },
};
</script>

<style scoped lang="scss">
.rolesMn-container {
  height: calc(100vh - 120px);
  box-sizing: border-box;
  .layout-box {
    width: 100%;
    height: calc(100vh - 164px);
    display: flex;
    justify-content: space-between;
    .box {
      background-color: #fff;
      box-shadow: 0px 1px 3px 0px rgba(35, 35, 112, 0.12),
        0px 0px 0px 1px rgba(67, 67, 145, 0.05);
      border-radius: 4px;
    }
    .leftbox {
      flex-basis: 16%;
      margin-right: 20px;
      flex-shrink: 0;
      position: relative;
      .topLine {
        overflow: hidden;
        font-weight: 600;
        padding: 20px;
        button {
          float: right;
          margin: 0 3px;
        }
      }
      .el-divider--horizontal {
        margin: 0;
      }
      .rolesBox {
        font-size: 14px;
        position: absolute;
        top: 71px;
        bottom: 0;
        left: 0;
        right: 0;
        overflow-y: scroll;
        &::-webkit-scrollbar {
          display: none;
        }
        .list {
          .item {
            cursor: pointer;
            line-height: 36px;
            height: 36px;
            padding-left: 16px;
            box-sizing: border-box;
            border-left: 4px solid transparent;
            &.active {
              color: #4993fa;
              border-left: 4px solid #409eff;
              background: #f5f7fa;
            }
          }
        }
      }
    }
    .rightbox {
      flex: 1;
      position: relative;
      padding: 20px;
      .featureBox {
        width: 100%;
        box-sizing: border-box;
        .roleName {
          margin-bottom: 20px;
          height: 30px;
        }
        .feature-container {
          font-size: 14px;
          .topHeader {
            display: flex;
            justify-content: flex-start;
            flex-wrap: nowrap;
            width: 100%;
            .item {
              font-weight: 600;
              height: 46px;
              line-height: 46px;
              border: 1px solid #f0f0f0;
              border-right: none;
              padding-left: 16px;
              flex-basis: 12vw;
              &:nth-of-type(4) {
                flex: 1;
                border-right: 1px solid #f0f0f0;
              }
            }
          }
        }
        .featurePanel {
          max-height: calc(100vh - 348px);
          overflow-y: scroll;
          width: 100%;
          &::-webkit-scrollbar {
            display: none;
          }
        }
      }
      .btnBox {
        position: absolute;
        bottom: 20px;
        right: 20px;
      }
    }
  }
}
</style>
