<template>
  <div class="common-header-box">
    <h6 class="header-title">
      <Icon type="ios-arrow-back" class="back-icon" @click="goBack" v-if="back"/>
      <span :class="[back ? 'title-con' : '']">{{ title }}</span>
    </h6>
  </div>
</template>

<script>
  export default {
    name: "common-header",
    props: {
      title: {
        type: String,
        default: '--'
      },
      // 是否显示返回按钮
      back: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      goBack() {
        this.$router.back()
      }
    }
  }
</script>

<style lang="less" scoped>
  .common-header-box {
    line-height: 65px;
    border-bottom: 1px solid #E6E6E6;
    .header-title {
      font-size: 16px;
      color: #353535;
      padding-left: 26px;
      .title-con {
        margin-left: 16px;
        float: left;
      }
    }
    .back-icon {
      width: 9px;
      height: 16px;
      font-size: 24px;
      line-height: 67px;
      display: inline-block;
      float: left;
      cursor: pointer;
      margin-left: -8px;
    }
  }
  .common-header-box:after {
    clear: both;
    content: '';
    display: block;
  }
</style>
