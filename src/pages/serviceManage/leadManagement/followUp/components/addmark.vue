<!---*
* @description 添加标记
* @fileName addmark.vue
* @author 叶金龙
* @date 2021/07/01 16:03:16
*--->
<template>
  <el-dialog
    title="添加标记"
    :visible.sync="addMarkVisible"
    width="634px"
    :before-close="simpleClose"
    :close-on-click-modal="false"
  >
    <p>标记名称</p>
    <div class="markContainer">
      <el-tag type="info" v-for="(item, index) in selectArr" :key="index">{{
        item.mark_name
      }}</el-tag>
    </div>
    <div class="markLists" ref="List">
      <el-input
        class="input-new-tag"
        v-if="inputVisible"
        v-model="inputValue"
        ref="saveTagInput"
        size="mini"
        placeholder="请输入标记名"
        maxlength="20"
        show-word-limit
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputBlur"
      >
      </el-input>
      <el-button
        v-else
        class="button-new-tag"
        size="mini"
        plain
        @click="showInput"
        type="primary"
        >+ 添加标记</el-button
      >
      <el-tag
        :type="item.type"
        size="medium"
        closable
        effect="plain"
        v-for="(item, index) in markList"
        :key="index + 1"
        @click.native="selectMark(index, item)"
        @close="deleMark(index, item)"
        >{{ item.mark_name }}</el-tag
      >
    </div>
    <span slot="footer">
      <el-button @click="(e) => simpleClose(false)" size="medium"
        >取消</el-button
      >
      <el-button
        type="primary"
        @click="submit"
        size="medium"
        :disabled="selectArr.length == 0"
        >确定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import {
  pushMark,
  getmarkList,
  removeMark,
  bindMark,
} from "@/api/leadManagement/followUp";
export default {
  name: "addMark",
  components: {},
  data() {
    return {
      markList: [],
      inputVisible: false,
      inputValue: "",
      loading: null,
      selectArr: [],
    };
  },
  props: {
    addMarkVisible: {
      type: Boolean,
    },
    company_ids: {
      type: Array,
    },
    init: {
      type: Function,
    },
    getMark: {
      type: Function,
    },
  },
  watch: {
    xxx: {},
  },
  created() {
    this.getList();
  },
  methods: {
    selectMark(index, { id }) {
      if (this.markList[index].type == "") {
        this.$set(this.markList[index], "type", "info");
        this.selectArr = this.selectArr.filter((v) => v.id !== id);
      } else {
        if (this.selectArr.length >= 5) {
          this.$message.warning("单次最多添加5个标记");
          return;
        }
        this.$set(this.markList[index], "type", "");
        this.selectArr.unshift(this.markList[index]);
      }
    },
    deleMark(index, { id, mark_name }) {
      this.utils.deleConfig(
        this,
        `是否删除'${mark_name}'客户标记`,
        "删除标记",
        ["确定", "取消"],
        this.remove(index, id)
      );
    },
    remove(index, id) {
      return () => {
        removeMark({ mark_id: id }).then((res) => {
          this.selectArr = this.selectArr.filter((v) => v.id !== id);
          this.markList.splice(index, 1);
        });
      };
    },
    getList() {
      getmarkList().then((res) => {
        let { data } = res;
        data.forEach((v) => {
          this.$set(v, "type", "info");
        });
        this.markList = data;
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        pushMark({ mark_name: inputValue })
          .then((res) => {
            let { id } = res.data;
            this.markList.unshift({ mark_name: inputValue, type: "info" });
            this.$set(this.markList[0], "id", id);
          })
          .catch((_) => {});
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    handleInputBlur() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.handleInputConfirm();
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    simpleClose(bool = false) {
      if (!bool) {
        this.getMark();
      }
      this.$emit("update:addMarkVisible", false);
    },
    submit() {
      bindMark({
        mark_ids: this.calcIds(this.selectArr),
        company_ids: this.company_ids,
      }).then((res) => {
        this.$message.success("添加标记成功");
        this.simpleClose(true);
        this.init();
      });
    },
  },
  computed: {
    calcIds: () => (arr) => arr.map((v) => v.id),
  },
};
</script>

<style scoped lang='scss'>
.markContainer {
  border-radius: 2px;
  border: 1px solid #dcdfe6;
  min-height: 36px;
  display: flex;
  flex-wrap: wrap;
  margin-top: 4px;
  .el-tag {
    margin-right: 6px;
    margin: 4px 6px;
  }
}
.markLists {
  position: relative;
  .input-new-tag {
    width: 300px;
  }
  .el-tag {
    margin-top: 16px;
    margin-right: 8px;
    cursor: pointer;
    user-select: none;
  }
}
</style>