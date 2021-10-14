<!---*
* @description  搜索
* @fileName searchComponent.vue
* @author 叶金龙
* @date 2020/10/27 11:16:33
*--->
<template>
  <div>
    <div class="search-content">
      <el-input
        placeholder="请输入关键词"
        v-model="search.search_words"
        class="input-with-select"
        @keyup.enter.native="getSearchData"
      >
        <el-select
          v-model="search.search_id"
          slot="prepend"
          placeholder="请选择搜索类型"
          size="medium"
        >
          <el-option
            :value="item.value"
            v-for="(item, index) in searchTypeArr"
            :key="index"
            :label="item.text"
          ></el-option>
        </el-select>
      </el-input>
      <slot name="multipleSearch"></slot>
      <elpopover
        v-for="(item, index) in elpopoverArr"
        :key="index"
        :slotName="item.slotName"
        :btnText="item.btnText"
        :width="item.width"
        :isShow="(bool) => changeBool(bool, item)"
        :bool="item.bool"
      >
        <slot :name="item.slotName" :slot="item.slotName" />
      </elpopover>
      <div v-if="dateConfig.length > 0" style="display: flex">
        <div class="time-search" v-for="(item, index) in dateConfig" :key="index">
          <el-button size="medium">
            {{ item.label }}
            <i
              class="el-icon-caret-bottom"
              :style="
                item.isTimeShow === true
                  ? 'transition: transform 0.2s linear 0s;transform: rotate(-180deg);'
                  : 'transition: transform 0.2s linear 0s;'
              "
            ></i>
          </el-button>
          <el-date-picker
            v-model="search[item.key]"
            type="daterange"
            align="right"
            @blur="item.isTimeShow = false"
            @focus="item.isTimeShow = true"
            class="search-time-datePicker"
            range-separator="至"
            value-format="yyyy/MM/dd"
            format="yyyy/MM/dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </div>
      </div>
      <div class="otherSearch">
        <slot name="otherSearch" />
      </div>
      <btns :btnConfig="btnConfig" :btn-click="(btn) => btnCb(btn)" />
    </div>
    <div class="search-tag margin-16">
      <slot />
      <!-- 防止key相同报错 -->
      <span
        v-for="(item, index) in dateConfig"
        :key="index + '-only'"
        style="margin-right: 10px"
      >
        <el-tag
          v-if="dateConfig.length > 0 && search[item.key].length > 0"
          closable
          @close="$parent.deleCondition(item.key)"
          >{{ item.label }}:{{ search[item.key][0] }} 至 {{ search[item.key][1] }}</el-tag
        >
      </span>
    </div>
  </div>
</template>

<script>
import enums from "@/utils/enums";
import btns from "./btn";
import elpopover from "./elpopover";
export default {
  name: "searchComponent",
  components: { btns, elpopover },
  data: () => ({
    pickerOptions: enums.pickerOptions,
    isTimeShow: false,
    isTimeShowTwo: false,
  }),
  props: {
    search: Object,
    btnConfig: Array,
    elpopoverArr: {
      type: Array,
      default() {
        return [];
      },
    },
    searchTypeArr: Array,
    dateConfig: {
      type: Array,
      default() {
        return [];
      },
    },
    dateConfigTwo: {
      type: Object,
      default() {
        return {};
      },
    },
    inputEnter: {
      type: Function,
    },
  },
  watch: {
    xxx: {},
  },
  created() {},
  methods: {
    btnCb({ cb }) {
      this.$parent[cb]();
    },
    changeBool(bool, item) {
      item.bool = bool;
    },
    getSearchData() {
      this.inputEnter();
    },
  },
};
</script>

<style scoped lang="scss"></style>
