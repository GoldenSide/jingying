<template>
  <div class="jh-main">
    <router-view />
  </div>
</template> 
<script type="text/ecmascript-6">  
export default { 
  name:"App",
  data() {
    return {};
  } 
};
</script>
<style>
.jh-main {
  width: 100%;
  height: 100%;
  font-family: "PingFangSC", "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.jh-main .el-loading-mask {
  background-color: rgba(255, 255, 255, 1);
}

.flex-inline-center {
  display: flex;
  align-items: center;
}
.flex-inline-end {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.margin-left-10 {
  margin-left: 10px;
}
</style>
