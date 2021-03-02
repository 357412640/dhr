import { login, logout, getUserInfo } from '@/api/user'
import { setToken, getToken } from '@/libs/util'

export default {
  state: {
    userName: '',
    userId: '',
    userEmplId: '',
    menu: [],
    token: getToken(),
    hasGetInfo: false,
    loginTime: '',
    photoUrl: '',
    buttons: []
  },
  getters: {
    getButtons: state => state.buttons,
    getMenu: state => state.menu
  },
  mutations: {
    setUserId (state, id) {
      state.userId = id
    },
    setUserEmplId (state, userEmplId) {
      state.userEmplId = userEmplId
    },
    setUserName (state, name) {
      state.userName = name
    },
    setUserMenu (state, menu) {
      state.menu = menu
    },
    setPhotoUrl (state, photoUrl) {
      state.photoUrl = photoUrl
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    },
    setLoginTime (state, loginTime) {
      state.loginTime = loginTime
    },
    setButtons (state, buttons) {
      state.buttons = buttons
}
  },
  actions: {
    // 登录
    // handleLogin ({ commit }, {username, password}) {
    //   username = username.trim()
    //   return new Promise((resolve, reject) => {
    //     login({
    //       username,
    //       password
    //     }).then(res => {
    //       const data = res.data
    //       // let date = new Date().getTime()/1000
    //       // commit('setLoginTime', resetTime(date))
    //       resolve(data)
    //     }).catch(err => {
    //       reject(err)
    //     })
    //   })
    // },
    // 退出登录
    // handleLogOut ({ state, commit }) {
    //   return new Promise((resolve, reject) => {
    //     logout().then(() => {
    //       commit('setUserName', '')
    //       commit('setUserId', '')
    //       commit('setUserMenu', [])
    //       commit('setHasGetInfo', false)
    //       commit('setLoginTime', '')
    //       resolve()
    //     }).catch(err => {
    //       reject(err)
    //     })
    //     // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
    //     // commit('setToken', '')
    //     // commit('setAccess', [])
    //     // resolve()
    //   })
    // },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          getUserInfo().then(res => {
            const data = res.data
            if (data.code === 200) {
              // 存入登录用户信息
              commit('setUserName', data.data.userInfo.name)
              commit('setUserId', data.data.userInfo.userId)
              commit('setUserEmplId', data.data.userInfo.userEmplId)
              commit('setPhotoUrl', data.data.userInfo.photoUrl)
              commit('setUserMenu', data.data.menuGroup)
              commit('setHasGetInfo', true)

              // 存入当前用户按钮权限
              const menuGroup = data.data.menuGroup
              const buttons = []
              const menuIds = []
              // 合并所有菜单
              const menus = menuGroup.reduce((pro, menu) => {
                return pro.concat(menu.menuGroup || [])
              }, [])
              // 遍历获取 菜单 及 按钮的 menuId
              menus.forEach(menu => {
                menuIds.push(menu.menuId)
                menu.buttonGroup.forEach(button => {
                  buttons.push(button.menuId)
                })
              })
              // console.log(menuIds, buttons)
              commit('setUserMenu', menuIds)
              commit('setButtons', buttons.concat(menuIds))
            }
            resolve(data)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
