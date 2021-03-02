<template>
  <Form ref="loginForm" :model="form" @keydown.enter.native="handleSubmit" class="login-form-box">
    <FormItem>
      <Select v-model="form.loginType">
        <Option value="gomedq" :key="1">国美电器</Option>
        <Option value="gomekg" :key="2">国美控股</Option>
      </Select>
      <p class="error-p">{{ typeError }}</p>
    </FormItem>
    <FormItem>
      <Input ref="userName" v-model.trim="form.userName" placeholder="域账号" :class="['name-input', {'error': nameFlag}]" @on-blur="validName">
        <Icon class="cursor" slot="suffix" :size="18" type="ios-close-circle-outline" @click="clearName" v-show="form.userName.length"></Icon>
        <span slot="suffix">
          <Tooltip content="请使用域账号，不需要@及其后缀。例如：zhangsan01、wangwu01" max-width="260" theme="light" placement="top-end">
            <Icon :size="18" class="cursor mr-15" type="ios-help-circle-outline"></Icon>
          </Tooltip>
        </span>
      </Input>
      <p class="error-p">{{ nameError }}</p>
    </FormItem>
    <FormItem>
      <Input ref="passWord1" type="password" v-model.trim="form.passWord" placeholder="密码" v-show="pwdType" :class="[{'error': passWordFlag}]" @on-blur="validPwd">
        <Icon class="cursor" :size="18" type="ios-close-circle-outline" slot="suffix" @click="clearPwd1" v-show="form.passWord.length"></Icon>
        <Icon class="cursor mr-15" :size="18" type="ios-eye-off-outline" slot="suffix" @click="pwdType = false"></Icon>
      </Input>
      <Input ref="passWord2" v-model.trim="form.passWord" placeholder="密码" v-show="!pwdType" :class="[{'error': passWordFlag}]" @on-blur="validPwd">
        <Icon class="cursor" :size="18" type="ios-close-circle-outline" slot="suffix" @click="clearPwd2" v-show="form.passWord.length"></Icon>
        <Icon class="cursor mr-15" :size="18" type="ios-eye-outline" slot="suffix" @click="pwdType = true"></Icon>
      </Input>
      <p class="error-p">{{ pwdError }}</p>
    </FormItem>
    <Button @click="handleSubmit" type="primary" long style="margin-top: 20px">登录</Button>
  </Form>
</template>
<script>
  import {login} from '@/api/user'
  import down from '@/assets/images/down-icon.png'
  import help from '@/assets/images/help-icon.png'
  import show from '@/assets/images/show-icon.png'
  import hide from '@/assets/images/hide-icon.png'
  import { mapMutations } from 'vuex'
  export default {
    name: 'LoginForm',
    data() {
      return {
        form: {
          loginType: 'gomedq',
          userName: '',
          passWord: ''
        },
        pwdType: true,
        typeError: '',
        nameError: '',
        pwdError: '',
        nameFlag: false,
        passWordFlag: false,
        down,
        help,
        show,
        hide
      }
    },
    methods: {
      ...mapMutations([
        'setHasGetInfo'
      ]),
      setUser() {
        this.setHasGetInfo(false)
      },
      handleSubmit() {
        let flag = true
        const userName = this.form.userName
        const passWord = this.form.passWord
        const loginType = this.form.loginType
        if (!userName) {
          this.nameError = '请输入域账号'
          this.nameFlag = true
          flag = false
        } else {
          this.nameFlag = false
        }
        if (!passWord) {
          this.pwdError = '请输入域密码'
          this.passWordFlag = true
          flag = false
        } else {
          this.passWordFlag = false
        }
        if (flag) {
          login({userName, passWord, loginType}).then(res => {
            const data = res.data
            if (data.code === 200) {
              this.setUser()
              this.$router.push({ name: 'home' })
            } else {
              // 10002 报错
              this.pwdError = data.message
            }
          })
        }

      },
      clearName() {
        this.form.userName = ''
        this.nameError = ''
        this.nameFlag = false
        this.$refs.userName.focus()
      },
      clearPwd1() {
        this.form.passWord = ''
        this.pwdError = ''
        this.passWordFlag = false
        this.$refs.passWord1.focus()
      },
      clearPwd2() {
        this.form.passWord = ''
        this.pwdError = ''
        this.passWordFlag = false
        this.$refs.passWord2.focus()
      },
      validName() {
        const userName = this.form.userName
        if (!userName) {
          this.nameFlag = true
          this.nameError = '请输入域账号'
        } else {
          this.nameFlag = false
          this.nameError = ''
        }
      },
      validPwd() {
        const passWord = this.form.passWord
        if (!passWord) {
          this.passWordFlag = true
          this.pwdError = '请输入域密码'
        } else {
          this.passWordFlag = false
          this.pwdError = ''
        }
      }
    }
  }
</script>

<style lang="less">
  .login-form-box {
    .error {
      .ivu-input-default {
        border: 1px solid #ed4014;
      }
    }
  }
</style>
