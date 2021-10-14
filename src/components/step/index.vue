<!---*
* @description step组件 
* @fileName index.vue
* @author 叶金龙
* @date 2020/10/28 17:53:27
*--->
<template>
  <div class="step-container">
    <ul class="stepList">
      <div class="stepLine" v-for="(item, index) in steps" :key="index">
        <div class="rangeIndex">
          <div class="roundBox"></div>
          <div class="lineBox"></div>
        </div>
        <slot name="item" :row="item" />
      </div>
    </ul>
  </div>
</template>
<script>
export default {
  name: "step",
  components: {},
  data() {
    return {};
  },
  props: {
    steps: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  watch: {
    xxx: {},
  },
  created() {},
  methods: {},
  mounted() {},
};
</script>

<style scoped lang='scss'>
.step-container {
  .stepList {
    display: flex;
    flex-direction: column;
    .stepLine {
      flex-basis: 50px;
      flex-shrink: 1;
      position: relative;
      padding-left: 30px;
      .rangeIndex {
        width: 16px;
        height: 100%;
        left: 0;
        position: absolute;
        .roundBox {
          width: 8px;
          height: 8px;
          position: absolute;
          left: 50%;
          top: 2px;
          transform: translateX(-50%);
          background-color: #e1e1ec;
          border-radius: 50%;
          z-index: 100;
        }
      }
      &:first-child {
        .rangeIndex {
          .roundBox {
            width: 12px;
            height: 12px;
            background-color: #64a894;
          }
        }
      }

      &:not(:last-child) {
        .lineBox {
          width: 1px;
          position: absolute;
          left: 50%;
          background-color: #e1e1ec;
          top: 0;
          bottom: 0;
          transform: translateX(-50%);
          z-index: 10;
        }
      }
    }
  }
}
</style>