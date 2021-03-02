import axios from '@/libs/api.request'

// 返回树形结构的管理范围
export const managementScopeTree = () => {
  return axios.request({
    url: '/platform/management/scope/tree',
    method: 'get'
  })
}

// 返回pid的二级管理范围
export const managementChildList = (data) => {
  return axios.request({
    url: '/platform/management/scope/child/list',
    method: 'post',
    data,
    headers: {
      'Content-type': 'application/json;charset=UTF-8'
    },
  })
}
// 停用/启用管理范围
export const managementUpdate = (data) => {
  return axios.request({
    url: `/platform/management/scope/${data.url}/${data.id}`,
    method: 'post',
    headers: {
      'Content-type': 'application/json;charset=UTF-8'
    },
  })
}
// 创建管理范围
export const managementCreate = (url, data) => {
  return axios.request({
    url: `/platform/management/scope/${url}`,
    method: 'post',
    headers: {
      'Content-type': 'application/json;charset=UTF-8'
    },
    data
  })
}
// 管理范围详情
export const managementDetail = (data) => {
  return axios.request({
    url: `/platform/management/scope/detail/${data.id}`,
    method: 'get'
  })
}
// 根据scopeId, 查询对应的部门数据
export const managementDeptList = (data) => {
  return axios.request({
    url: `/platform/management/scope/dept/list`,
    method: 'post',
    headers: {
      'Content-type': 'application/json;charset=UTF-8'
    },
    data
  })
}
// 根据范围id，获取人员类型
export const managementListPersonType = (params) => {
  return axios.request({
    url: `/platform/management/scope/list/person/type/${params.id}`,
    method: 'get',
    headers: {
      'Content-type': 'application/json;charset=UTF-8'
    }
  })
}
// 更新管理范围的人员类型
export const managementPersonType = (data) => {
  return axios.request({
    url: `/platform/management/scope/person/type`,
    method: 'post',
    headers: {
      'Content-type': 'application/json;charset=UTF-8'
    },
    data
  })
}
// 启用/禁用管理范围的高管白名单
export const managementBoss = (url) => {
  return axios.request({
    url: `/platform/management/scope/${url}`,
    method: 'post',
    headers: {
      'Content-type': 'application/json;charset=UTF-8'
    }
  })
}
// 获取人员分页
export const managementEmployeePage = (data) => {
  return axios.request({
    url: `/platform/management/scope/employee/page`,
    method: 'post',
    headers: {
      'Content-type': 'application/json;charset=UTF-8'
    },
    data
  })
}
// 获取操作记录
export const managementEmpLogList = (id) => {
  return axios.request({
    url: `/platform/management/scope/log/list/${id}`,
    method: 'get',
    headers: {
      'Content-type': 'application/json;charset=UTF-8'
    }
  })
}
// 批量获取公司
export const managementDepListCompany = (id) => {
  return axios.request({
    url: `/platform/management/scope/dept/list/company?scopeId=${id}`,
    method: 'get',
    headers: {
      'Content-type': 'application/json;charset=UTF-8'
    }
  })
}
// 根据公司id，获取部门Tree
export const managementDepTree = (id, companyId) => {
  return axios.request({
    url: `/platform/management/scope/dept/tree/${companyId}?scopeId=${id}`,
    method: 'get',
    headers: {
      'Content-type': 'application/json;charset=UTF-8'
    }
  })
}
// 根据companyId, 获取暂存的部门
export const managementDepStashList = (id, companyId) => {
  return axios.request({
    url: `/platform/management/scope/dept/stash/list/${companyId}?scopeId=${id}`,
    method: 'get',
    headers: {
      'Content-type': 'application/json;charset=UTF-8'
    }
  })
}
// 暂存部门数据
export const managementDepStash = (data) => {
  return axios.request({
    url: `/platform/management/scope/dept/stash`,
    method: 'post',
    headers: {
      'Content-type': 'application/json;charset=UTF-8'
    },
    data
  })
}
// 根据scopeId, 保存对应的暂存数据
export const managementDepSave = (id) => {
  return axios.request({
    url: `/platform/management/scope/dept/save/${id}`,
    method: 'post',
    headers: {
      'Content-type': 'application/json;charset=UTF-8'
    },
  })
}
// 根据scopeId, 删除对应的暂存数据
export const managementDepStashClean = (id) => {
  return axios.request({
    url: `/platform/management/scope/dept/stash/clean/${id}`,
    method: 'post',
    headers: {
      'Content-type': 'application/json;charset=UTF-8'
    },
  })
}