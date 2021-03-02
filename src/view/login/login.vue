<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <img :src="logo" class="logo" />
    <div class="login-con" style='background:#fff'>
      <Card>
        <h2 class="title">
          <span>
            <img :src="DHR" alt="" width="67px" height="24px" style="margin-right: 10px;">
          </span>
          <span style="font-size: 14px;margin-top: 4px;color: #4972F2;">人力资源数字化平台&nbsp;&nbsp;V2.0</span>
        </h2>
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
import logo from '@/assets/images/login-logo.png'
import DHR from '@/assets/images/DHR-logo.png'
export default {
  components: {
    LoginForm
  },
  data() {
    return {
      logo: logo,
      DHR
    }
  },
  methods: {
    ...mapActions([
      'handleLogin'
    ]),
    handleSubmit() {

    }
  }
}
</script>
