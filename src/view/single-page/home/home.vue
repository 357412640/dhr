<template>
  <div class="count-style">
    <p class="count-p">欢迎使用</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'home',
  data () {
    return {
      platformName: ''
    }
  },
  methods: {
    ...mapGetters([
      'getPlatformName'
    ])
  },
  mounted () {
    //
  },
  created () {
    this.platformName = this.getPlatformName()
  }
}
</script>

<style lang="less" scoped>
.count-style{
  font-size: 40px;
  height: 100%;
  position: relative;
  text-align: center;
  .count-p {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
  }
}
</style>
