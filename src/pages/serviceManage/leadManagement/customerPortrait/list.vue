<!---*
* @description   客户画像管理 
* @fileName list.vue
* @author 叶金龙
* @date 2021/03/04 19:03:50
*--->
<template>
  <div class="customerPortrait-contaniner">
    <contHeader :titleText="$route.meta.title" />
    <el-button class="daliyLog" type="primary" size="medium" @click="dialog">日 志</el-button>
    <div class="combineBox">
      <tagList
        :tags="tags"
        :deleteTag="deleteTag"
        :selectTag="selectTag"
        :getTagList="getTagList"
        :currentIndex="currentIndex"
        :isLoading.sync="isLoading"
        :page.sync="search.page"
        :page_size.sync="search.page_size"
        :noMore="noMore"
      />
      <filterBox :obj="obj">
        <template slot="filterList">
          <ul class="lists">
            <li
              class="item"
              v-for="(item, index) in obj.form_data"
              :key="index"
            >
              <el-select
                v-model="item.attr"
                slot="prepend"
                placeholder=""
                size="medium"
                clearable
                @change="(val) => attributeChange(val, item)"
              >
                <el-option
                  :value="item.value"
                  v-for="(item, index) in config.attribute"
                  :key="index"
                  :label="item.title"
                ></el-option>
              </el-select>
              <el-select
                v-model="item.secondAttr"
                slot="prepend"
                placeholder=""
                size="medium"
                clearable
                @change="(val) => secondAttrChange(val, item)"
              >
                <el-option
                  :value="item.value"
                  v-for="(item, index) in secondSelect(item.attr)"
                  :key="index"
                  :label="item.title"
                ></el-option>
              </el-select>
              <el-select
                v-model="item.thridAttr"
                slot="prepend"
                placeholder=""
                size="medium"
                clearable
              >
                <el-option
                  :value="item.value"
                  v-for="(item, index) in thridSelect(item)"
                  :key="index"
                  :label="item.title"
                ></el-option>
              </el-select>
              <el-select
                v-model="item.forthAttr"
                slot="prepend"
                placeholder=""
                size="medium"
                clearable
              >
                <el-option
                  :value="item.value"
                  v-for="(item, index) in forthSelect(item.attr)"
                  :key="index"
                  :label="item.title"
                ></el-option>
              </el-select>

              <el-select
                v-model="item.num"
                slot="prepend"
                placeholder=""
                size="medium"
                clearable
                v-if="item.attr == 'base_attribute'"
              >
                <el-option
                  :value="item.value"
                  v-for="(item, index) in fivthSelect(item)"
                  :key="index"
                  :label="item.title"
                ></el-option>
              </el-select>
              <el-input
                v-else
                v-model="item.num"
                placeholder=""
                size="medium"
                clearable
                type="text"
                @input="(val) => inputAct(val, item)"
              ></el-input>
              <i
                @click="deleteLine(index)"
                :class="[
                  'el-icon-delete',
                  { invalid: obj.form_data.length <= 1 },
                ]"
              ></i>
            </li>
          </ul>
          <el-button
            size="medium"
            @click="addItem"
            icon="el-icon-circle-plus-outline"
            >增加条件</el-button
          >
        </template>
        <template slot="btnBox">
          <div class="btns">
            <el-button
              v-for="(item, index) in btnArr"
              :key="index"
              :loading="item.loading ? btnLoading : false"
              :type="item.type"
              size="medium"
              :plain="item.plain"
              @click="item.cb()"
              >{{ item.text }}</el-button
            >
          </div>
        </template>
      </filterBox>
    </div>
    <resultBox
      :total="total"
      :exportList="exportList"
      :haveRes="haveRes"
      :loading="loading"
    >
      <template>
        <div
          class="loadingBox"
          v-loading="loading"
          element-loading-text="查询中..."
          element-loading-spinner="el-icon-loading"
        ></div>
      </template>
    </resultBox>
    <saveTagDialog
      :saveTagVisible.sync="saveTagVisible"
      :tagModel="obj"
      :save="save"
      :currentIndex="currentIndex"
      v-if="saveTagVisible"
    />
    <logMenu
      :logVisible.sync="logVisible"
      v-if="logVisible"
      :logData="logData"
      :getLogData="getLogData"
    />
  </div>
</template>

<script>
import tagList from "./component/tagList";
import filterBox from "./component/filterBox";
import resultBox from "./component/result";
import saveTagDialog from "./component/saveTagDialog";
import {
  getSelectOpt,
  getTags,
  addTag,
  delTag,
  tagDailyLog,
  searchCompany,
  exportExcel,
} from "@/api/leadManagement/customerPortrait";
export default {
  name: "customerPortrait",
  components: { tagList, filterBox, resultBox, saveTagDialog },
  data() {
    return {
      tags: [],
      btnArr: [
        {
          text: "存为画像标签",
          plain: true,
          cb: () => {
            return this.saveTag();
          },
        },
        {
          text: "重置",
          plain: true,
          cb: () => {
            return this.reset();
          },
        },
        {
          text: "查询",
          plain: false,
          loading: true,
          type: "primary",
          cb: () => {
            return this.searchRes();
          },
        },
      ],
      total: 0,
      currentIndex: null,
      config: {},
      search: {
        page: 1,
        page_size: 10,
      },
      originObj: {
        attr: null,
        secondAttr: null,
        thridAttr: null,
        forthAttr: null,
        num: null,
      },
      obj: {
        filter_type: "1",
        name: "",
        form_data: [
          {
            attr: null,
            secondAttr: null,
            thridAttr: null,
            forthAttr: null,
            num: null,
          },
        ],
      },
      haveRes: false,
      saveTagVisible: false,
      logVisible: false,
      logData: {
        logSearch: {
          page: 1,
          page_size: 15,
        },
        pagination: {
          total: 0,
        },
        title: "日志",
        dataList: [],
        width: "634px",
        logColumn: [
          {
            prop: "tag_id",
            width: 70,
            label: "标签ID",
          },
          {
            prop: "operator_name",
            width: 90,
            label: "操作人",
          },
          {
            prop: "update_time",
            width: 150,
            label: "操作时间",
          },
          {
            prop: "content",
            label: "备注",
          },
        ],
      },
      isLoading: false,
      noMore: false,
      loading: false,
      btnLoading: false,
    };
  },
  props: {},
  watch: {
    xxx: {},
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.getConfig();
      this.search.page = 1;
      this.tags = [];
      this.getTagList();
    },
    getConfig() {
      getSelectOpt().then((res) => {
        this.config = res.data;
      });
    },
    getTagList({ id } = { id: null }) {
      this.haveRes = false;
      this.loading = false;
      let page;
      if (!id) {
        this.isLoading = true;
        page = {};
      } else {
        page = { page: 1 };
      }
      getTags({ ...this.search, ...page, id }).then((res) => {
        let { list } = res.data;
        if (id) {
          let { form_data, filter_type, name } = list[0];
          this.obj = {
            form_data,
            filter_type,
            name,
          };
        } else {
          let arr = list.map((v) => {
            this.$set(v, "type", "info");
            return v;
          });
          this.tags = this.tags.concat(arr);
          this.noMore = list.length < this.search.page_size ? true : false;
          this.isLoading = false;
        }
      });
    },
    addItem() {
      this.obj.form_data.push(this.utils.deepClone(this.originObj));
    },
    deleteTag(tag, index) {
      this.utils.deleConfig(
        this,
        "确认删除标签(" + tag.name + ")吗？",
        "删除标签",
        ["确定", "取消"],
        this.deleteCb(tag)
      );
    },
    deleteCb({ id }) {
      return () => {
        delTag({ id }).then((res) => {
          this.reset();
          this.init();
        });
      };
    },
    selectTag(index, { id }) {
      if (this.currentIndex == index) return;
      this.currentIndex = index;
      this.getTagList({ id });
    },
    exportList() {
      exportExcel(this.obj).then((res) => {
        window.open(res.data.url, "_blank");
      });
    },
    dialog() {
      this.logVisible = true;
      this.getLogData();
    },
    getLogData() {
      tagDailyLog(this.logData.logSearch).then((res) => {
        let { count, list } = res.data;
        this.logData.dataList = list;
        this.logData.pagination.total = count;
      });
    },

    saveTag() {
      this.saveTagVisible = true;
    },
    save() {
      return new Promise((resolve, reject) => {
        addTag(this.obj).then((res) => {
          if (res.data.message) {
            this.obj = { ...this.obj, id: res.data.id };
            reject(res.data);
          } else {
            this.saveTagVisible = false;
            this.reset();
            this.init();
            resolve();
          }
        });
      });
    },

    reset() {
      this.currentIndex = null;
      this.haveRes = false;
      let arr = [].concat([this.utils.deepClone(this.originObj)]);
      this.obj = Object.assign(
        {},
        { filter_type: "1", name: "", id: null, form_data: arr }
      );
    },
    searchRes() {
      this.loading = true;
      this.btnLoading = true;
      this.haveRes = false;
      searchCompany(this.obj)
        .then((res) => {
          let { count } = res.data;
          this.total = count;
          this.haveRes = true;
          this.loading = false;
          this.btnLoading = false;
        })
        .catch((err) => {
          this.haveRes = true;
          this.loading = false;
          this.btnLoading = false;
        });
    },

    attributeChange(val, item) {
      this.$set(item, "secondAttr", null);
      this.$set(item, "thridAttr", null);
      this.$set(item, "forthAttr", null);
      this.$set(item, "num", null);
    },
    secondAttrChange(val, item) {
      this.$set(item, "thridAttr", null);
      this.$set(item, "num", null);
    },
    deleteLine(index) {
      this.obj.form_data.splice(index, 1);
    },
    inputAct(val, obj) {
      obj.num = obj.num.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
      obj.num = obj.num.replace(/^\./g, ""); //验证第一个字符是数字
      obj.num = obj.num.replace(/\.{2,}/g, ""); //只保留第一个, 清除多余的
      obj.num = obj.num
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".");
      obj.num = obj.num.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
    },
  },
  computed: {
    secondSelect() {
      return (attr) => {
        return this.config[attr];
      };
    },
    thridSelect() {
      return (item) => {
        if (item.attr && item.secondAttr) {
          let arr = this.config[item.attr].filter((v) => {
            return v.value === item.secondAttr;
          });
          return arr[0].standard;
        } else {
          return [];
        }
      };
    },
    forthSelect() {
      return (attr) => {
        if (attr) {
          let key = attr + "_range";
          return this.config[key];
        } else {
          return [];
        }
      };
    },
    fivthSelect() {
      return (item) => {
        if (item.attr && item.secondAttr) {
          let arr = this.config[item.attr].filter((v) => {
            return v.value === item.secondAttr;
          });
          return arr[0].option;
        } else {
          return [];
        }
      };
    },
  },
};
</script>

<style scoped lang='scss'>
.customerPortrait-contaniner {
  position: relative;
  .daliyLog {
    position: absolute;
    right: 0;
    top: 0px;
  }
  .combineBox {
    box-shadow: 0px 1px 3px 0px rgba(35, 35, 112, 0.12),
      0px 0px 0px 1px rgba(67, 67, 145, 0.05);
    border-radius: 4px;
    margin-top: 12px;
    .filterList {
      .lists {
        max-height: calc(100vh - 660px);
        overflow-y: scroll;
        .item {
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          .el-icon-delete {
            flex-basis: 20px;
            cursor: pointer;
            &.invalid {
              pointer-events: none;
            }
          }
          .el-input,
          .el-select {
            margin-right: 12px;
            flex: 1;
          }
        }
      }
    }
  }
  /deep/ .loadingBox {
    .el-loading-mask {
      padding-top: 16px;
      position: relative;
      .el-loading-spinner {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .el-loading-text {
          margin-left: 8px;
        }
      }
    }
  }
}
</style>