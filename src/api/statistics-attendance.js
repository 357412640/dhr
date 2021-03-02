import axios from '@/libs/api.request'
// 考勤汇总
// 月度考勤

// 姓名查询列表
export const getSearchInfo = (params) => {
  return axios.request({
    url: '/kq/employee/serchInfo',
    method: 'GET',
    params
  })
}

// 查询下级树列表
// /managementscope/child/tree
export const getChildrenTree = (params) => {
  return axios.request({
    url: '/platform/managementscope/child/tree',
    method: 'GET',
    params
  })
}

// 月度考勤列表
export const getMonthStatisticsList = (params) => {
  return axios.request({
    url: '/kq/employee/pageserchMonthTotalInfo',
    method: 'GET',
    params
  })
}

// 下载月度考勤汇总
export const downloadMonthStatistics = (params) => {
  let url = '/kq/employee/download'
  const keys = Object.keys(params)
  if (keys.length) {
    url += '?'
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (params[key] !== '') {
        url += `${key}=${params[key]}&`
      }
    }
    url = url.slice(0, url.length - 1)
  }

  window.open(url)
}

