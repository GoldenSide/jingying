<!---*
* @description  菜单管理
* @fileName list.vue
* @author 叶金龙
* @date 2020/09/29 11:22:29
*--->
<template>
  <div class="menusMn-container">
    <contHeader :titleText="$route.meta.title" />
    <el-button class="createBtn" type="primary" size="medium" @click="creatMenu"
      >创建菜单</el-button
    >
    <div class="layout-box">
      <div class="box leftbox">
        <menustree
          :menuData="menuData"
          @getNodeObj="getNodeObj"
          @parentIdsPath="parentIdsPath"
          :search-node-text="searchNodeText"
        />
      </div>
      <div class="box rightbox">
        <div class="table-box">
          <el-table
            :data="childmenus"
            height="calc(100vh - 231px)"
            v-loading="loading"
            tooltip-effect="light"
          >
            <el-table-column
              v-for="col in columns"
              :prop="col.prop"
              :key="col.prop"
              :label="col.label"
              :width="col.width"
              :fixed="col.fixed || false"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="backend_uri"
              label="后端地址"
              width="350"
              show-overflow-tooltip
            >
              <template slot-scope="{ row }">
                <p>
                  <span v-for="(item, index) in row.backend_uri" :key="index"
                    >{{ item.uri }};</span
                  >
                </p>
              </template>
            </el-table-column>
            <el-table-column
              prop="is_prod"
              label="生产-是否显示"
              width="150"
              show-overflow-tooltip
            >
              <template slot-scope="{ row }">
                <el-switch
                  v-model="row.is_prod"
                  :active-value="1"
                  :inactive-value="0"
                  @change="
                    (checked) =>
                      checkChange(checked, { key: 'is_prod', id: row.menu_id })
                  "
                >
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="is_show" label="停用/启用" width="150">
              <template slot-scope="{ row }">
                <el-switch
                  v-model="row.is_show"
                  :active-value="1"
                  :inactive-value="0"
                  @change="
                    (checked) =>
                      checkChange(checked, { key: 'is_show', id: row.menu_id })
                  "
                >
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="230" fixed="right">
              <template slot-scope="{ row }">
                <el-button
                  :type="item.type"
                  size="default"
                  @click="btnAct(item.cb, row)"
                  v-for="(item, index) in btnConfig"
                  :key="index"
                  :disabled="item.cb == 'setFeature' && row.level != 3"
                  >{{ item.text }}</el-button
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
      </div>
    </div>
    <menuHandler
      v-if="menuDiaVisible"
      :topStr="topStr"
      :menuData="menuData"
      :infoObj="infoObj"
      :menuDiaVisible.sync="menuDiaVisible"
    />
    <featurenList
      v-if="featureVisible"
      :featureVisible.sync="featureVisible"
      :currentRow="currentRow"
    />
  </div>
</template>
<script>
import PaginationCom from "@/components/pagination";
import contHeader from "@/components/contentHeader";
import menustree from "../components/tree";
import menuHandler from "./components/menuHandler";
import featurenList from "./components/featureList";
import {
  menusChildrenList,
  deleteMenuItem,
  menusSelectList,
  menuInfo,
  menuSwitch,
} from "@/api/sysSetting/menusMn";
export default {
  name: "menuMana",
  components: {
    PaginationCom,
    contHeader,
    menustree,
    menuHandler,
    featurenList,
  },

  data() {
    return {
      loading: false,
      search: {
        page: 1,
        page_size: 10,
        menu_id: null,
      },
      pagination: {
        total: 0,
      },
      searchNodeText: null,
      filterValue: null,
      childmenus: [],
      columns: [
        { prop: "meta.title", label: "菜单名称", width: 200, fixed: "left" },
        { prop: "name", label: "name", width: 150 },
        { prop: "meta.icon", label: "icon", width: 150 },
        { prop: "filepath", label: "文件路径", width: 350 },
      ],
      topStr: "",
      menuDiaVisible: false,
      btnConfig: [
        { type: "primary", cb: "editMenuItem", text: "编辑" },
        { type: "primary", cb: "setFeature", text: "配置功能" },
        { type: "danger", cb: "deleMenu", text: "删除" },
      ],
      featureVisible: false,
      menuData: [],
      infoObj: {},
    };
  },
  props: {},
  watch: {
    xxx: {},
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      menusSelectList().then((res) => {
        this.menuData = res.data;
        this.currentKey = res.data[0].menu_id;
      });
    },
    creatMenu() {
      this.menuDiaVisible = true;
      this.topStr = "创建";
      this.infoObj = {};
    },
    getNodeObj({ menu_id }) {
      this.search = { ...this.search, menu_id };
      this.getList();
    },
    getList() {
      this.loading = true;
      menusChildrenList(this.search).then(({ data }) => {
        let { list, count } = data;
        this.childmenus = list;
        this.pagination.total = count;
        setTimeout(() => {
          this.loading = false;
        }, 500);
      });
    },
    parentIdsPath(val) {
      console.log(val);
    },

    btnAct(cb, row) {
      this[cb](row);
      this.currentRow = row;
    },
    editMenuItem(row) {
      this.menuDiaVisible = true;
      this.topStr = "编辑";
      this.getItemInfo(row);
    },
    getItemInfo({ menu_id }) {
      menuInfo({ menu_id }).then((res) => {
        this.infoObj = res.data;
      });
    },
    setFeature(row) {
      this.featureVisible = true;
    },
    deleMenu(row) {
      this.utils.deleConfig(
        this,
        "此操作将删除(" +
          row.meta.title +
          ")菜单,所有用户将不能再使用该菜单， 是否继续?",
        "提示",
        ["确定", "取消"],
        this.deleCb()
      );
    },
    deleCb() {
      return () => {
        deleteMenuItem({ menu_id: this.currentRow.menu_id }).then((res) => {
          this.initData();
        });
      };
    },
    checkChange(val, model) {
      menuSwitch(model).then((res) => {
        this.getList();
      });
    },
  },
  mounted() {},
};
</script>

<style scoped lang='scss'>
.menusMn-container {
  height: calc(100vh - 120px);
  box-sizing: border-box;
  position: relative;
  .createBtn {
    position: absolute;
    right: 0;
    top: 0px;
  }
  .layout-box {
    width: 100%;
    height: calc(100vh - 164px);
    display: flex;
    justify-content: flex-start;
    overflow: hidden;
    .box {
      background-color: #fff;
      box-shadow: 0px 1px 3px 0px rgba(35, 35, 112, 0.12),
        0px 0px 0px 1px rgba(67, 67, 145, 0.05);
      border-radius: 4px;
    }
    .leftbox {
      flex-basis: 300px;
      margin-right: 20px;
      flex-shrink: 0;
      padding: 20px;
      max-height: 100%;
      overflow-y: scroll;
      &::-webkit-scrollbar {
        display: none;
      }
      .searchmenu {
        margin-bottom: 20px;
      }
    }
    .rightbox {
      flex: 1;
      position: relative;
      .table-box {
        position: absolute;
        width: 100%;
        box-sizing: border-box;
      }
    }
  }
}
</style>
