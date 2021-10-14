<!---*
* @description 按钮封装
* @fileName btn.vue
* @author 叶金龙
* @date 2020/10/27 11:18:09
*--->
<template functional>
  <div class="btn-content">
    <el-button
      v-for="(item, index) in props.btnConfig"
      :key="index"
      :type="item.type"
      @click="props.btnClick(item)"
    >
      <img
        :src="require('@/../static/img/' + item.icon + '.png')"
        class="iconsousuo"
      />
      {{ item.text }}</el-button
    >
  </div>
</template>

