<!---*
* @description 用户管理
* @fileName list.vue
* @author 叶金龙
* @date 2020/09/29 11:22:22
*--->
<template>
  <div class="userMn-container">
    <contHeader :titleText="$route.meta.title" />
    <div class="conditions-content">
      <div class="search-content">
        <el-input
          placeholder="请输入关键词"
          v-model="search.search_key"
          class="input-with-select"
        >
          <el-select
            v-model="search.roles_group_id"
            slot="prepend"
            placeholder="请选择角色"
            size="medium"
            clearable
          >
            <el-option
              :value="item.roles_group_id"
              v-for="(item, index) in rolesArr"
              :key="index"
              :label="item.roles_group_name"
            ></el-option>
          </el-select>
        </el-input>
        <el-button type="primary" size="default" @click="init"> 搜索</el-button>
      </div>
      <el-table
        :data="userList"
        fit
        height="calc(100vh - 302px)"
        v-loading="loading"
      >
        <el-table-column type="index" width="80" label="序号">
          <template slot-scope="scope">
            <span>{{
              (search.page - 1) * search.page_size + scope.$index + 1
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-for="col in columns"
          :prop="col.prop"
          :key="col.prop"
          :label="col.label"
          :width="col.width"
        >
        </el-table-column>

        <el-table-column prop="status" label="停用/启用">
          <template slot-scope="{ row, $index }">
            <el-switch
              @change="switchChange($event, row, $index)"
              v-model="row.status"
              :active-value="1"
              :inactive-value="0"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作">
          <template slot-scope="{ row }">
            <el-button type="primary" size="default" @click="editUser(row)"
              >配置角色</el-button
            >
            <el-button type="danger" size="default" @click="deltUser(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <PaginationCom
        :limit.sync="search.page_size"
        :page.sync="search.page"
        :total="pagination.total"
        @pagination="getList"
      />
    </div>
    <userConfig
      :userConfigVisible.sync="userConfigVisible"
      :topStr="topStr"
      :useObj="useObj"
      :rolesArr="rolesArr"
    />
  </div>
</template>

<script>
import PaginationCom from "@/components/pagination";
import contHeader from "@/components/contentHeader";
import { simpleRoleList } from "@/api/sysSetting/rolesMn";
import { userList, switchUser, deleUser } from "@/api/sysSetting/userMn";
import userConfig from "./components/userConfig";
export default {
  name: "usersMana",
  components: { PaginationCom, contHeader, userConfig },
  data() {
    return {
      pagination: {
        total: 0,
      },
      userList: [],
      search: {
        roles_group_id: null,
        search_key: null,
        page: 1,
        page_size: 15,
      },
      searchTypeArr: [
        {
          value: 1,
          text: "wosjsjs",
        },
      ],
      rolesArr: [],
      columns: [
        { prop: "name", label: "姓名" },
        { prop: "job_number", label: "员工号" },
        { prop: "roles_group_name", label: "角色" },
      ],
      loading: false,
      userConfigVisible: false,
      topStr: "",
      useObj: {},
    };
  },
  props: {},
  watch: {
    xxx: {},
  },
  created() {
    this.initResource();
    this.getList();
  },
  methods: {
    initResource() {
      simpleRoleList().then((res) => {
        this.rolesArr = res.data;
      });
    },
    init() {
      this.search.page = 1;
      this.getList();
    },
    getList() {
      this.loading = true;
      userList(this.search).then((res) => {
        this.userList = res.data.list;
        this.pagination.total = res.data.count;
        setTimeout(() => {
          this.loading = false;
        }, 500);
      });
    },
    switchChange(value, row, index) {
      switchUser({
        user_id: row.user_id,
        status: row.status,
      }).then((res) => {
        this.$nextTick(() => {
          this.getList();
        });
      });
    },
    editUser(row) {
      this.userConfigVisible = true;
      this.topStr = "配置";
      this.useObj = row;
    },
    deltUser({ user_id, name }) {
      this.utils.deleConfig(
        this,
        "此操作将删除此用户(" + name + "), 是否继续?",
        "提示",
        ["确定", "取消"],
        this.deleCb(user_id)
      );
    },
    deleCb(user_id) {
      return () => {
        deleUser({ user_id }).then((res) => {
          this.getList();
        });
      };
    },
  },
};
</script>

<style scoped lang='scss'>
.userMn-container {
  .content-container {
    height: calc(100vh - 164px);
  }
}
</style>