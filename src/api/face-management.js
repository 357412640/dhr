// 人脸管理
import axios from 'axios'

axios.defaults.withCredentials = true

// 人脸查询
export const getFace = (params) => {
	return axios.request({
        url: '/kq/face/query',
        params,
        method: 'get'
	})
}

// 人脸删除
export const delFace = (data) => {
  return axios.request({
    url: '/kq/face/delete',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 操作记录
export const getLog = (params) => {
	return axios.request({
        url: '/kq/face/logList',
        params,
        method: 'get'
	})
}
