<template>
  <a-config-provider :locale="zh_CN">
    <div id="app">
      <router-view/>
    </div>
  </a-config-provider>
</template>
<script>
// 123
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN'
export default {
  name: 'App',
  data() {
    return {
      zh_CN
    }
  }
}
</script>

<style lang="less">
.size{
  width: 100%;
  height: 100%;
}
html,body{
  .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  .size;
}
</style>
