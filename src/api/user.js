import axios from '@/libs/api.request'

export const login = ({ userName, passWord, loginType }) => {
  const data = {
    userName,
    passWord,
    loginType
  }
  return axios.request({
    url: '/platform/login/in',
    data,
    method: 'post'
  })
}

// 获取用户信息 及权限
export const getUserInfo = () => {
  return axios.request({
    url: '/platform/employee/menu/list',
    method: 'get'
  })
}

// export const logout = () => {
//   return axios.request({
//     url: '/platform/logout',
//     method: 'post'
//   })
// }
