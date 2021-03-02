import axios from '@/libs/api.request'

/* 班次管理 */

// 列表查询
export const worktimeList = (params) => {
  return axios.request({
    url: '/kq/worktime/list',
    method: 'get',
    params
  })
}
// 新建班次
export const worktimeInsert = (url, data) => {
  return axios.request({
    url: `/kq/worktime/${url}`,
    method: 'post',
    data,
    headers: {
      'Content-type': 'application/json;charset=UTF-8'
    },
  })
}
// 启用停用
export const worktimeStatus = (data) => {
  return axios.request({
    url: `/kq/worktime/status`,
    method: 'post',
    data,
    headers: {
      'Content-type': 'application/json;charset=UTF-8'
    },
  })
}
// 详情接口
export const worktimeDetail = (id) => {
  return axios.request({
    url: `/kq/worktime/detail?id=${id}`,
    method: 'get',
  })
}