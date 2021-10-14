<!---*
* @description 公告
* @fileName list.vue
* @author 叶金龙
* @date 2020/10/22 15:37:41
*--->
<template>
  <div class="notice-container">
    <contHeader :titleText="$route.meta.title" />
    <el-button
      class="createBtn"
      type="primary"
      size="medium"
      @click="creatMenu"
      v-if="noHistory"
      >创建公告</el-button
    >
    <div class="conditions-content">
      <searchComponent
        :search="search"
        :btnConfig="btnConfig"
        :searchTypeArr="newSearchTypeArr"
        :elpopoverArr="elpopoverArr"
        :dateConfig="dateConfig"
        :inputEnter="init"
      >
        <template :slot="elpopoverArr[0].slotName">
          <el-checkbox-group v-model="search.status">
            <el-checkbox
              v-for="(item, index) in noticeStatus"
              :label="item.value"
              :key="index"
              >{{ item.text }}</el-checkbox
            >
          </el-checkbox-group>
          <span class="clear-checkbox" @click="deleCondition('status')"
            >清除</span
          >
        </template>
        <template>
          <el-tag
            v-for="(item, index) in elpopoverArr"
            :key="index"
            closable
            v-show="checkStatus.length > 0"
            @close="deleCondition(item.key)"
            style="margin-right: 10px"
            >{{ item.btnText }}： {{ checkStatus }}</el-tag
          >
        </template>
      </searchComponent>
      <div class="list-content notice-table">
        <tableComponent
          :column="column"
          :tableData="dataList"
          :page.sync="search.page"
          :page_size.sync="search.page_size"
          :total.sync="pagination.total"
          :loading.sync="loading"
          height="calc(100vh - 367px)"
          :pageAct="getList"
        />
      </div>
    </div>
  </div>
</template>
<script>
import enums from "@/utils/enums";
import dayjs from "dayjs";
import {
  noticeList,
  recallNotice,
  msgHistory,
} from "@/api/serviceMn/customerMn/notice";
import { getPlatForm } from "@/utils/cookie";
export default {
  name: "sysNotice",
  components: {},
  data() {
    return {
      searchTypeArr: [
        {
          value: "3",
          text: "标题",
        },
        {
          value: "4",
          text: "内容",
        },
      ],
      companyTypeArr: [
        {
          value: "1",
          text: "公司",
        },
        {
          value: "2",
          text: "店铺",
        },
        {
          value: "10",
          text: "供应商",
        },
      ],
      pagination: {
        total: 0,
      },
      search: {
        page: 1,
        page_size: 15,
        status: [],
        search_id: "3",
        search_words: null,
        create_time_range: [
          dayjs().startOf("month").format("YYYY/MM/DD"),
          dayjs().endOf("month").format("YYYY/MM/DD"),
        ],
      },
      btnConfig: [
        { text: "搜索", icon: "search", type: "primary", cb: "init" },
        { text: "清空", icon: "clear", type: "default", cb: "clear" },
      ],
      dateConfig: [
        {
          label: "发布时间",
          key: "create_time_range",
          isTimeShow: false,
        },
      ],
      elpopoverArr: [
        {
          btnText: "当前状态",
          slotName: "currrentStatus",
          key: "status",
          bool: false,
          isShow: function (bool) {
            return bool;
          },
        },
      ],
      dataList: [],
      loading: false,
      colorArr: {
        1: "#B4E0FA",
        2: "#BBE5B3",
        3: "#FFC48B",
        4: "#DFE3E8",
      },
      column: [
        {
          prop: "title",
          label: "标题",
        },
        {
          prop: "is_send_all_target_str",
          label: "推送对象",
        },
        {
          prop: "platform_id_str",
          label: "推送平台",
        },
        {
          prop: "type_str",
          label: "消息类型",
        },
        {
          prop: "status",
          label: "当前状态",
          render: ({ h, row }) => {
            return h("div", {
              style: {
                backgroundColor: this.colorArr[row.status],
                width: "66px",
                textAlign: "center",
                borderRadius: "15px",
                lineHeight: "23px",
              },
              domProps: {
                innerHTML: row.status_str,
              },
            });
          },
        },
        {
          prop: "create_time",
          label: "发布时间",
        },
        {
          prop: "",
          label: "操作",
          render: ({ h, row }) => {
            return h("div", [
              this.noHistory &&
                row.status == "3" &&
                row.platform_id == "1" &&
                h(
                  "el-link",
                  {
                    props: { type: "primary" },
                    on: {
                      click: () => {
                        this.editAct(row);
                      },
                    },
                  },
                  "编辑"
                ),
              this.noHistory &&
                row.status == "2" &&
                !row.is_pass_recall_max_time &&
                h(
                  "el-link",
                  {
                    props: { type: "primary" },
                    on: {
                      click: () => {
                        this.quitAct(row);
                      },
                    },
                  },
                  "撤回"
                ),
              h(
                "el-link",
                {
                  props: { type: "primary" },
                  on: {
                    click: () => {
                      this.iteminfo(row);
                    },
                  },
                },
                "详情"
              ),
            ]);
          },
        },
      ],
      statusStr: "",
    };
  },
  props: {},
  watch: {
    $route(to, from) {
      // if((to.name == 'sysNotice' && from.name == 'msgList') || (to.name == 'msgList' && from.name == 'sysNotice')){
      //    window.location.reload()
      // }
    },
  },
  //缓存页面
  activated() {
    this.getList();
  },
  created() {
    this.search.page = 1;
  },
  methods: {
    init() {
      this.search.page = 1;
      this.getList();
    },
    clear() {
      this.search = this.$options.data().search;
      this.init();
    },
    getList() {
      this.loading = true;
      let pathLastName = this.$route.path.split("/");
      pathLastName = pathLastName[pathLastName.length - 1];
      if (pathLastName == "sysNotice") {
        noticeList(this.search).then((res) => {
          let { list, count } = res.data;
          this.dataList = list;
          this.pagination.total = count;
          this.loading = false;
        });
      } else {
        msgHistory(this.search).then((res) => {
          let { list, count } = res.data;
          this.dataList = list;
          this.pagination.total = count;
          this.loading = false;
        });
      }
    },
    deleCondition(key) {
      this.search[key] = [];
      this.init();
    },
    quitAct(row) {
      this.utils.deleConfig(
        this,
        "此操作将撤回(" + row.title + ")公告",
        "提示",
        ["确定", "取消"],
        this.reCallCb(row)
      );
    },
    reCallCb(row) {
      return () => {
        recallNotice({ id: row.id }).then((res) => {
          this.init();
        });
      };
    },
    editAct({ id }) {
      this.$router.push({
        path: "/index/serviceMana/noticeEdit",
        query: { id },
      });
    },
    creatMenu() {
      this.$router.push({ path: "/index/serviceMana/noticeCreate" });
    },
    iteminfo({ id }) {
      if (this.noHistory) {
        this.$router.push({
          path: "/index/serviceMana/noticeInfo",
          query: { id },
        });
      } else {
        this.$router.push({
          path: "/index/leadManagement/msgInfo",
          query: { id },
        });
      }
    },
  },
  computed: {
    checkStatus() {
      let arr = [];
      for (let val of this.noticeStatus) {
        if (this.search.status.indexOf(val.value) == -1) {
          continue;
        } else {
          arr.push(val.text);
        }
      }
      if (arr.length > 0) {
        return arr.join(",");
      } else {
        return "";
      }
    },
    noHistory() {
      let pathLastName = this.$route.path.split("/");
      pathLastName = pathLastName[pathLastName.length - 1];
      return pathLastName == "sysNotice" ? true : false;
    },
    newSearchTypeArr() {
      if (this.noHistory) {
        if (getPlatForm() == "XShoppy") {
          return [...this.searchTypeArr, ...this.companyTypeArr];
        } else if (getPlatForm() == "Emysale") {
          return [
            {
              value: "3",
              text: "标题",
            },
            {
              value: "4",
              text: "内容",
            },
            {
              value: "2",
              text: "店铺",
            },
          ];
        }
      } else {
        return this.searchTypeArr;
      }
    },
    noticeStatus() {
      if (this.noHistory) {
        return enums.noticeStatus;
      } else {
        return enums.noticeStatus.filter((v, i) => {
          return i == 1 || i == 2;
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.notice-container {
  position: relative;
  .createBtn {
    position: absolute;
    right: 0;
    top: 0px;
  }
}
.notice-table {
  &.list-content {
    margin-top: 0;
  }
}
</style>
