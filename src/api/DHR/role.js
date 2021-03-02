// 角色管理
import axios from '@/libs/api.request'

export const roleCreate = (data) => {
  return axios.request({
    url: ' /platform/sys/role/create',
    method: 'post',
    data
  })
}

export const roleUpdate = (data) => {
  return axios.request({
    url: '/platform/sys/role/update',
    method: 'post',
    data
  })
}

export const roleEnable = (roleId) => {
  return axios.request({
    url: `/platform/sys/role/enable/${roleId}`,
    method: 'post'
  })
}

export const roleDisable = (roleId) => {
  return axios.request({
    url: `/platform/sys/role/disAble/${roleId}`,
    method: 'post'
  })
}

export const roleInfo = (roleId) => {
  return axios.request({
    url: `/platform/sys/role/detail/${roleId}`,
    method: 'get'
  })
}

export const roleList = (data) => {
  return axios.request({
    url: '/platform/sys/role/page',
    method: 'post',
    data
  })
}

// 应用列表
export const appList = (params) => {
  return axios.request({
    url: '/platform/sys/role/menu/app/list',
    method: 'get',
    params
  })
}

// 获取所有应用下的菜单
export const appMenuList = (roleId) => {
  return axios.request({
    url: `/platform/sys/role/menu/appMenuList/${roleId}`,
    method: 'get'
  })
}

// 保存角色下的菜单
export const saveAppMenuList = (data) => {
  return axios.request({
    url: '/platform/sys/role/menu/saveAppMenuList',
    method: 'post',
    data
  })
}

// 获取所有应用下的菜单 列表
export const getAppMenuList = (params) => {
  return axios.request({
    url: `/platform/sys/role/menu/list/${params.roleId}`,
    method: 'get',
    params
  })
}

// 保存, 某个角色下的操作权限
export const saveMenuList = (param) => {
  const params = {
    menuId: param.menuId
  }
  return axios.request({
    url: `/platform/sys/role/menu/saveMenuList/${param.roleId}`,
    method: 'post',
    params
  })
}

// 去除, 某个角色下的操作权限
export const cancelMenuList = (param) => {
  const params = {
    menuId: param.menuId
  }
  return axios.request({
    url: `/platform/sys/role/menu/cancelMenuList/${param.roleId}`,
    method: 'post',
    params
  })
}

export const roleLogList = (roleId) => {
  return axios.request({
    url: `/platform/sys/role/log/list/${roleId}`,
    method: 'get'
  })
}


// 获取成员列表
export const userList = (data) => {
  return axios.request({
    url: '/platform/sys/role/user/page',
    method: 'post',
    data
  })
}

export const authList = (params) => {
  return axios.request({
    url: `/platform/sys/role/auth/page/${params.roleId}`,
    method: 'get',
    params
  })
}

export const authTree = (roleId) => {
  return axios.request({
    url: `/platform/sys/role/auth/list/${roleId}`,
    method: 'get'
  })
}

export const saveAuth = (data) => {
  return axios.request({
    url: '/platform/sys/role/auth/save',
    method: 'post',
    data
  })
}
