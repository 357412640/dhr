// 考勤档案
import axios from '@/libs/api.request'


// 获取考勤数据列表
export const getArchiveResultList = (params) => {
	return axios.request({
      url: '/kq/archive/result/list',
      params,
      method: 'get'
	})
}

// 获取档案详情
export const getArchiveDetail = (params) => {
	return axios.request({
      url: '/kq/archive/detail',
      params,
      method: 'get'
	})
}

// 获取年假详情
export const getYearDetail = (params) => {
	return axios.request({
        url: '/kq/archive/year/detail',
        params,
        method: 'get'
	})
}

// 获取调休假详情
export const getCaDetail = (params) => {
	return axios.request({
        url: '/kq/archive/compensatory/detail',
        params,
        method: 'get'
	})
}

// 获取调休假历史明细
export const getCaHistoryDetail = (params) => {
	return axios.request({
        url: '/kq/archive/page/compensatory/detail',
        params,
        method: 'get'
	})
}

// 获取事假详情
export const getMatterDetail = (params) => {
	return axios.request({
        url: '/kq/archive/compassionate/detail',
        params,
        method: 'get'
	})
}

// 保存事假备注
export const saveMatterRemark = (data) => {
	return axios.request({
		url: '/kq/archive/addOrUpdate/compassionate/remark',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

// 获取病假明细
export const getSickDetail = (params) => {
	return axios.request({
        url: '/kq/archive/sick/detail',
        params,
        method: 'get'
	})
}

// 保存病假备注
export const saveSickRemark = (data) => {
	return axios.request({
		url: '/kq/archive/addOrUpdate/sick/remark',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

// 获取公假明细
export const getPublicDetail = (params) => {
	return axios.request({
        url: '/kq/archive/public/detail',
        params,
        method: 'get'
	})
}

// 获取探亲假明细
export const getHomeDetail = (params) => {
	return axios.request({
        url: '/kq/archive/home/detail',
        params,
        method: 'get'
	})
}

// 保存哺乳假明细
export const saveLac = (data) => {
	return axios.request({
		url: '/kq/archive/lactation/save',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

// 获取哺乳假明细
export const getLacDetail = (params) => {
	return axios.request({
        url: '/kq/archive/lactation/list',
        params,
        method: 'get'
	})
}

// 保存产假明细
export const saveMat = (data) => {
	return axios.request({
		url: '/kq/archive/maternity/save',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

// 获取产假明细
export const getMatDetail = (params) => {
	return axios.request({
        url: '/kq/archive/maternity/list',
        params,
        method: 'get'
	})
}

/**
 * 考勤申请
 */
// 获取考勤申请记录列表
export const getBillList = (params) => {
	return axios.request({
        url: '/kq/bill/list',
        params,
        method: 'get'
	})
}

// 获取考勤申请记录详情
export const getBillDetail = (params) => {
	return axios.request({
        url: '/kq/bill/detail',
        params,
        method: 'get'
	})
}

// 考勤申请记录-销假
export const invalidBill = (data) => {
	return axios.request({
		url: '/kq/bill/invalid',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

// 获取基本信息
export const getStaffInfo = (params) => {
	return axios.request({
        url: '/kq/archive/staff/info',
        params,
        method: 'get'
	})
}

// 获取班次列表
export const getWtList = (params) => {
	return axios.request({
        url: '/kq/worktime/sub/list',
        params,
        method: 'get'
	})
}

// 保存考勤属性
export const saveStaffInfo = (data) => {
	return axios.request({
		url: '/kq/archive/update/staff/info',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

// 排班

// 班次列表
export const getWorkTimeList = (params) => {
  return axios.request({
    url: '/kq/archive/workTime/rules',
    params,
    method: 'get'
  })
}

// 考勤档案列表
export const getArchiveList = (data) => {
  return axios.request({
    url: '/kq/archive/page',
    data,
    method: 'post'
  })
}

// 档案列表移除
export const deleteUser = (params) => {
  return axios.request({
    url: '/kq/archive/ignore',
    params,
    method: 'post'
  })
}

// 8.1排班列表
export const getPlanList = (data) => {
  return axios.request({
    url: '/kq/plan/list',
    data,
    method: 'post'
  })
}

// 8.2提交当前人员进行排班
export const savePlan = (data) => {
  return axios.request({
    url: '/kq/plan/save',
    data,
    method: 'post'
  })
}

// 8.3排班状态列表
export const getPlanStatusList = (params) => {
  return axios.request({
    url: '/kq/plan/statuslist',
    params,
    method: 'get'
  })
}

// 8.4需要排班员工列表
export const getPlanUserList = (params) => {
  return axios.request({
    url: '/kq/plan/userlist',
    params,
    method: 'get'
  })
}

// 8.5员工排班状态列表
export const getPlanUserStatusList = (params) => {
  return axios.request({
    url: '/kq/plan/userstatuslist',
    params,
    method: 'get'
  })
}


// 9.3当月入职员工
export const getEmployeeEntry = (data) => {
  return axios.request({
    url: '/kq/archive/employee/currentOfferMonth',
    data,
    method: 'post'
  })
}

// 9.3当月离职员工
export const getEmployeeLeave = (data) => {
  return axios.request({
    url: '/kq/archive/employee/currentRemoveMonth',
    data,
    method: 'post'
  })
}

// 9.3当月未添加员工
export const getEmployeeNot = (data) => {
  return axios.request({
    url: '/kq/archive/employee/allNoAdd',
    data,
    method: 'post'
  })
}

// 9.4 新增或者更新员工班次
export const updateWorkTime = (data) => {
  return axios.request({
    url: '/kq/archive/update/staff/config',
    data,
    method: 'post'
  })
}


// 10.1 排班导入
export const importPlan = (data) => {
  return axios.request({
    url: '/kq/plan/import',
    data,
    method: 'post'
  })
}

// 10.2 导出状态列表
export const uploadStatusList = (params) => {
  return axios.request({
    url: '/kq/template/list',
    params,
    method: 'get'
  }
  )
}
// 10.2 下载文件
export const uploadFile = (params) => {
  return axios.request({
    url: '/kq/archive/employee/export',
    params,
    method: 'get'
  })
}

// 获取假期日历列表
export const getCalendarList = (params) => {
  return axios.request({
    url: '/kq/calendar/sub/list',
    params,
    method: 'get'
  })
}

// 获取考勤期间列表
export const getAttList = (params) => {
	return axios.request({
		url: '/kq/attendance/sub/list',
		params,
		method: 'get'
	})
}
