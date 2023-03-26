<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<style lang="stylus">
@import '~@/assets/style/reset.css';
 :root {
    /* 主题色 */
    --main-1: #fff3f0;
    --main-2: #ffd4cc;
    --main-3: #ffafa3;
    --main-4: #ff887a;
    /* 网站颜色搭配 */
    --main-5: #f56c6c;
    --main-6: #8EC5FC;
    --main-7: #E0C3FC;
    --main-8: #e4e7ed;
    --main-9: #c0c4cc;
    --main-10: #606266;
}
@media(max-width: 768px ){
  .el-dialog{
    width: 95%!important;
  }
}
</style>

<script>

export default {
  components: {}
}
</script>