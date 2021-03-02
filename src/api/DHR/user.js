// 角色管理
import axios from '@/libs/api.request'

// 用户管理列表
export const userList = (data) => {
  return axios.request({
    url: '/platform/employee/page',
    method: 'post',
    data
  })
}

export const userEnable = (params) => {
  return axios.request({
    url: '/platform/employee/enable',
    method: 'post',
    params
  })
}

export const userDisable = (params) => {
  return axios.request({
    url: '/platform/employee/disAble',
    method: 'post',
    params
  })
}

export const getCreateList = (data) => {
  return axios.request({
    url: '/platform/employee/create/list',
    method: 'post',
    data
  })
}

export const getScopeList = () => {
  return axios.request({
    url: '/platform/management/scope/list',
    method: 'get'
  })
}

export const getScopeTree = () => {
  return axios.request({
    url: '/platform/management/scope/tree',
    method: 'get'
  })
}

export const getListRole = (params) => {
  return axios.request({
    url: '/platform/employee/listRole',
    method: 'get',
    params
  })
}

export const createUser = (data) => {
  return axios.request({
    url: '/platform/employee/create',
    method: 'post',
    data
  })
}

export const updateUser = (data) => {
  return axios.request({
    url: '/platform/employee/update',
    method: 'post',
    data
  })
}




