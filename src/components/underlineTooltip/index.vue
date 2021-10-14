<template>
  <el-tooltip
    class="item"
    :open-delay="500"
    :popper-class="`underline-tooltip ${className}`"
    effect="dark"
    :placement="$attrs.placement || 'bottom'"
  >
    <div slot="content">
      <slot name="content">
        <div v-html="$attrs.content"></div>
      </slot>
    </div>
    <span class="tooltip-text"><slot></slot></span>
  </el-tooltip>
</template>

<script>
export default {
  name: "",
  props: {
    className: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
.tooltip-text {
  position: relative;
  &:after {
    content: "";
    width: 100%;
    height: 100%;
    border-bottom: 1px dashed #d8d8d8;
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>
<style lang="scss">
$underlineTooltipColor: rgba(86, 86, 86, 1);
.underline-tooltip {
  max-width: 360px;
  line-height: 20px;
}
.underline-tooltip.is-dark {
  background: $underlineTooltipColor;
}

.underline-tooltip[x-placement^="top"] .popper__arrow::after {
  border-top-color: $underlineTooltipColor;
}
.underline-tooltip[x-placement^="bottom"] .popper__arrow::after {
  border-bottom-color: $underlineTooltipColor;
}
.underline-tooltip[x-placement^="left"] .popper__arrow::after {
  border-left-color: $underlineTooltipColor;
}
.underline-tooltip[x-placement^="right"] .popper__arrow::after {
  border-right-color: $underlineTooltipColor;
}
</style>