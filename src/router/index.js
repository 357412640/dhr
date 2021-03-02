import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import { canTurnTo } from '@/libs/util'
import config from '@/config'
const { homeName } = config

Vue.use(Router)
const router = new Router({
  routes,
  mode: 'history'
})
const LOGIN_PAGE_NAME = 'login'
const FORBID_PAGE_NAME = 'forbid'

const turnTo = (to, menu, next) => {
  if (canTurnTo(to.name, menu, routes)) next() // 有权限，可访问
  else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
}

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  // const token = getToken()

  if (to.name === LOGIN_PAGE_NAME || to.name === FORBID_PAGE_NAME) {
    next()
  // if (!token && to.name !== LOGIN_PAGE_NAME) {
  //   // 未登录且要跳转的页面不是登录页
  //   next({
  //     name: LOGIN_PAGE_NAME // 跳转到登录页
  //   })
  // } else if (!token && to.name === LOGIN_PAGE_NAME) {
  //   // 未登陆且要跳转的页面是登录页
  //   next() // 跳转
  // } else if (token && to.name === LOGIN_PAGE_NAME) {
  //   // 已登录且要跳转的页面是登录页
  //   next({
  //     name: homeName // 跳转到homeName页
  //   })
  } else {
    if (store.state.user.hasGetInfo) {
      turnTo(to, store.state.user.menu, next)
    } else {
      store.dispatch('getUserInfo').then(res => {
        let data, menu
        menu = store.state.user.menu || []
        if (res.code === 401 || !(res.data && res.data.userInfo && res.data.userInfo.userId)) {
          location.replace('/login')
        } else if(!menu || menu.length === 0) {  // 菜单 不存在或为空数组，则跳转无权限页
          location.replace('/forbid')
        }else {
          turnTo(to, menu, next)
        }
      })
    }
  }
})

router.afterEach(to => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
