<template functional>
  <el-popover
    placement="bottom"
    :width="props.width || 100"
    trigger="click"
    style=""
    @show="props.isShow(true)"
    @hide="props.isShow(false)"
  >
    <slot :name="props.slotName" />
    <el-button slot="reference" size="medium">
      {{ props.btnText }}
      <i
        :class="['el-icon-caret-bottom']"
        :style="
          props.bool == true
            ? 'transition: transform 0.2s linear 0s;transform: rotate(-180deg);'
            : 'transition: transform 0.2s linear 0s;'
        "
      ></i>
    </el-button>
  </el-popover>
</template>