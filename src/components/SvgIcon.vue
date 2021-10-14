<!---*
* @description 
* @fileName svgIcon.vue
* @author 叶金龙
* @date 2020/09/30 14:00:16
*--->
<template>
  <svg :class="svgClass" aria-hidden="true" v-on="$listeners" :style="mapStyle">
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script>
export default {
  name: "SvgIcon",
  props: {
    iconClass: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      default: "",
    },
    mapStyle: {
      type: Object,
    },
  },
  watch: {
    mapStyle: {
      immediate: true,
      deep: true,
      handler(val) {},
    },
  },
  computed: {
    iconName() {
      return `#icon-${this.iconClass}`;
    },
    svgClass() {
      if (this.className) {
        return "svg-icon " + this.className;
      } else {
        return "svg-icon";
      }
    },
  },
};
</script>

<style scoped>
.svg-icon {
  width: 20px;
  height: 20px;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
