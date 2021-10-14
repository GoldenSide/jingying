<!---*
* @description 
* @fileName assign.vue
* @author 龙伟
* @date 2020/12/01 14:43:23
*--->
<template>
  <div>
    <el-dialog
      :title="'客户分配-' + userObj.title"
      :visible="assignVisible"
      :before-close="isAssignShow"
      :close-on-click-modal="false"
      width="768px"
    >
      <el-dialog
        width="30%"
        title="确认分配"
        :visible.sync="innerVisible"
        append-to-body
      >
        <div class="user-content">
          <span>{{ userObj.dataName.join() }}</span
          >将分配给<span>{{ selectedName }}</span
          >去跟进，是否确认？
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button size="medium" @click="innerVisible = false">取 消</el-button>
          <el-button size="medium" :loading="submitLoading" type="primary" @click="submitData"
            >确认</el-button
          >
        </div>
      </el-dialog>
      <div class="assgin-container">
        <div class="content-left">
          <h3>组织架构</h3>
          <div class="content-tree">
            <el-tree
              node-key="id"
              ref="treeUser"
              :data="groupStructData"
              :props="defaultProps"
              @node-click="handleNodeClick"
              :highlight-current="true"
              :default-expanded-keys="defaultKeys"
            ></el-tree>
          </div>
        </div>
        <div class="content-right">
          <h3>员工</h3>
          <div class="content-user">
            <el-input
              placeholder="请输入内容"
              @input="getUserName"
              v-model="userName"
            >
              <i
                slot="suffix"
                @click="getUserName"
                class="iconsearch-01 iconfont search"
              ></i>
            </el-input>
            <div class="content-radio">
              <el-radio-group v-if="groupUserData.length" v-model="userRadio">
                <el-radio
                  @change="getUserId(item)"
                  v-for="(item, index) in groupUserData"
                  :key="index"
                  :label="item.id"
                  >{{ item.name + "(" + item.id + ")" }}</el-radio
                >
              </el-radio-group>
              <div style="text-align: center" v-else>暂无人员</div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="isAssignShow">取 消</el-button>
        <el-button size="medium" type="primary" @click="isInnerVisible"
          >分配</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getGroupStruct,
  getGroupUser,
  submitAssign,
} from "@/api/leadManagement/companyList";
export default {
  name: "assginMenu",
  components: {},
  data() {
    return {
      innerVisible: false,
      defaultProps: {
        children: "children",
        label: "name",
        id: "id",
      },
      userName: "",
      userId: "",
      userRadio: "",
      groupStructData: [],
      groupUserData: [],
      defaultKeys: [],
      search: {
        name: "",
        department_id: "",
      },
      selectedName: "",
      userObj: {},
      submitLoading: false,
    };
  },
  props: {
    assignVisible: {
      type: Boolean,
      default: false,
    },
    assignObj: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  watch: {
    assignObj: {
      immediate: true,
      deep: true,
      handler(val) {
        this.userObj = val;
      },
    },
  },
  created() {
    this.getList();
  },
  methods: {
    //   确认分配
    submitData() {
      this.submitLoading = true
      submitAssign({
        company_ids: this.userObj.dataId,
        user_id: this.userId,
        assign_type: this.userObj.type,
      }).then((res) => {
        if (res.code == 0) {
          this.userRadio = "";
          this.selectedName = "";
          this.innerVisible = false;
          this.isAssignShow();
          this.$parent.init();
          this.$message.success("操作成功");
          this.submitLoading = false
        }
      }).catch(err => {
        this.submitLoading = false
      });
    },
    isInnerVisible() {
      if (this.selectedName == "") {
        this.$message.error("请先选择分配人员");
        return;
      }
      this.innerVisible = true;
    },
    handleNodeClick(data) {
      this.search.department_id = data.id;
      this.search.name = "";
      this.getUserNameData();
    },
    getUserName() {
      if (this.userName == "") {
        this.groupUserData = [];
        this.search.name = "";
        this.search.department_id = "";
        this.userRadio = "";
        this.selectedName = "";
        return;
      }
      this.search.name = this.userName;
      this.search.department_id = "";
      this.getUserNameData();
    },
    getUserId(item) {
      for (let i of item.department_id.split(",")) {
        this.defaultKeys.push(i);
        this.$refs["treeUser"].setCurrentKey(
          item.department_id.split(",")[
            item.department_id.split(",").length - 1
          ]
        );
      }
      this.search.department_id = item.department_id;
      this.selectedName = item.name;
      this.userId = item.id;
      this.search.name = "";
      this.getUserNameData();
    },
    getUserNameData() {
      getGroupUser(this.search).then((res) => {
        // console.log(res);
        this.groupUserData = res.data;
      });
    },
    // 获取组织架构数据
    getList() {
      getGroupStruct().then((res) => {
        for (let key in res) {
          if (key == "data") {
            this.groupStructData.push(res[key]);
            return;
          }
        }
      });
    },
    isAssignShow() {
      this.userRadio = "";
      this.selectedName = "";
      this.userObj = {};
      this.assignObj.dataName = [];
      this.assignObj.dataId = [];
      let data = {
        assignVisible: false,
        assignmentValue: "",
      };
      this.$emit("assignmentValue", JSON.stringify(data));
    },
  },
};
</script>

<style scoped lang='scss'>
.assgin-container {
  display: flex;
  border: 1px solid #dcdee0;
  .content-left,
  .content-right {
    flex: 1;
    height: 408px;
    h3 {
      padding: 6px 12px;
      border-bottom: 1px solid #dcdee0;
    }
  }
  .content-left {
    border-right: 1px solid #dcdee0;
  }
  .content-tree {
    overflow: auto;
    height: 376px;
    padding: 12px 0 12px 6px;
  }
  .content-right {
    border-right: 1px solid #dcdee0;
  }
  .content-user {
    padding: 12px;
    .content-radio {
      height: 308px;
      margin: 8px 0 0;
      overflow: auto;
      /deep/ .el-radio-group {
        .el-radio {
          display: block;
          margin: 8px 0 0;
          &:first-child {
            margin-top: 0;
          }
        }
      }
    }
  }
}
.search {
  margin: 12px 10px 0 0;
  display: block;
}
.user-content {
  max-height: 200px;
  overflow: auto;
  span {
    color: #212d98;
  }
}
</style>