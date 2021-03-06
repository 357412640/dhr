// 休假规则
import axios from '@/libs/api.request'

// 获取树形结构
export const getScopeTree = (params) => {
  return axios.request({
    url: '/platform/management/scope/tree',
    params,
    method: 'get'
  })
}

// 获取列表
export const getRuleList = (params) => {
	return axios.request({
    url: '/kq/holidayRule/list',
    params,
    method: 'get'
	})
}

// 获取详情
export const getRuleDetail = (params) => {
	return axios.request({
    url: '/kq/holidayRule/detail',
    params,
    method: 'get'
	})
}

// 保存
export const saveRule = (data) => {
	return axios.request({
		url: '/kq/holidayRule/insert',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

// 更新
export const updateRule = (data) => {
	return axios.request({
		url: '/kq/holidayRule/update',
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
    url: '/kq/holidayRule/status',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
