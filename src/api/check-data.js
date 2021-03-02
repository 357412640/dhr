// 考勤期间
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
export const getAttList = (params) => {
	return axios.request({
		url: '/kq/attendance/list',
		params,
		method: 'get'
	})
}

// 保存
export const saveAtt = (data) => {
	return axios.request({
		url: '/kq/attendance/insert',
		data,
		method: 'post',
		headers: {
		  'Content-Type': 'application/json'
		}
	})
}

// 更新
export const updateAtt = (data) => {
	return axios.request({
		url: '/kq/attendance/update',
		data,
		method: 'post',
		headers: {
		  'Content-Type': 'application/json'
		}
	})
}

// 获取详情
export const getAttDetail = (params) => {
	return axios.request({
		url: '/kq/attendance/detail',
		params,
		method: 'get'
	})
}

// 启用/停用
export const updateStatus = (data) => {
	return axios.request({
		url: '/kq/attendance/status',
		data,
		method: 'post',
		headers: {
	    	'Content-Type': 'application/json'
		}
	})
}
