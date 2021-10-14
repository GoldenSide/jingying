<!---*
* @description  违规类型
* @fileName illegal.vue
* @author 叶金龙
* @date 2021/06/24 11:46:46
*--->
<template>
  <el-dialog
    title="违规操作"
    :visible.sync="illegalVisible"
    width="634px"
    :before-close="simpleClose"
    :close-on-click-modal="false"
  >
    <el-radio-group v-model="illegalType">
      <el-radio
        v-for="(item, index) in radioArr"
        :key="index"
        :label="item.value"
      >
        {{ item.text }}
      </el-radio>
    </el-radio-group>
    <span slot="footer">
      <el-button @click="simpleClose" size="medium">取消</el-button>
      <el-button type="primary" @click="submit" size="medium">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "illegal",
  components: {},
  data() {
    return {
      radioArr: [
        {
          value: 2,
          text: "12h后下架",
        },
        {
          value: 5,
          text: "仅通知",
        },
      ],
      illegalType: 2,
    };
  },
  props: {
    illegalVisible: {
      type: Boolean,
    },
    postCheck: {
      type: Function,
      default() {
        return () => false;
      },
    },
  },
  watch: {
    xxx: {},
  },
  created() {},
  methods: {
    simpleClose() {
      this.$emit("update:illegalVisible", false);
    },
    submit() {
      this.postCheck(this.illegalType);
      this.$nextTick(() => {
        this.simpleClose();
      });
    },
  },
};
</script>

<style scoped lang='scss'>
</style>