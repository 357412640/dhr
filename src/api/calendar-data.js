// 假期日历接口
import axios from '@/libs/api.request'

// 获取树形结构
export const getScopeTree = (params) => {
  return axios.request({
    url: '/platform/management/scope/tree',
    params,
    method: 'get'
  })
}

// 获取假期日历列表
export const getCalendarList = (params) => {
  return axios.request({
    url: '/kq/calendar/list',
    params,
    method: 'get'
  })
}

// 获取假期日历详情
export const getCalendarDetail = (params) => {
  return axios.request({
    url: '/kq/calendar/detail',
    params,
    method: 'get'
  })
}

// 保存假期日历
export const saveCal = (data) => {
  return axios.request({
    url: '/kq/calendar/insert',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 更新假期日历
export const updateCal = (data) => {
  return axios.request({
    url: '/kq/calendar/update',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 复制假期日历
export const copyCal = (data) => {
  return axios.request({
    url: '/kq/calendar/copy',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 启用/停用
export const updateStatus = (data) => {
  return axios.request({
    url: '/kq/calendar/status',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 获取假期定义列表
export const getVacationList = (params) => {
  return axios.request({
    url: '/kq/vacation/list',
    params,
    method: 'get'
  })
}

// 获取假期定义详情
export const getVacationDetail = (params) => {
  return axios.request({
    url: '/kq/vacation/detail',
    params,
    method: 'get'
  })
}

// 保存假期定义
export const saveVac = (data) => {
  return axios.request({
    url: '/kq/vacation/insert',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 更新假期定义
export const updateVac = (data) => {
  return axios.request({
    url: '/kq/vacation/update',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
