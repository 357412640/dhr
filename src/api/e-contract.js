// 电子合同
import axios from 'axios'

axios.defaults.withCredentials = true

// 统计分析
export const getDataAnalysis = (params) => {
	return axios.request({
        url: '/contract/contract/getgroupstatus',
        params,
        method: 'get'
	})
}

// 获取基础信息列表
export const selectType = (params) => {
	return axios.request({
        url: '/contract/advance/selectType',
        params,
        method: 'get'
	})
}

// 基础设置-基础设置-获取天数
export const getSettingDay = (params) => {
	return axios.request({
        url: '/contract/advance/getday',
        params,
        method: 'get'
	})
}

// 基础设置-基础设置-保存天数
export const saveSettingDay = (data) => {
	return axios.request({
		url: '/contract/advance/updateDay',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

// 基础设置-类型管理-获取列表
export const getContractTypeList = (params) => {
	return axios.request({
        url: '/contract/contracttype/getContractTypeList',
        params,
        method: 'get'
	})
}

// 基础设置-类型管理-获取详情
export const getContractType = (params) => {
	return axios.request({
        url: '/contract/contracttype/getContractType',
        params,
        method: 'get'
	})
}

// 基础设置-类型管理-新增类型
export const insertContractType = (data) => {
	return axios.request({
		url: '/contract/contracttype/insertContractType',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

// 基础设置-类型管理-修改类型
export const updateContractType = (data) => {
	return axios.request({
		url: '/contract/contracttype/updateContractType',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

// 基础设置-类型管理-删除类型
export const deleteContractType = (data) => {
	return axios.request({
		url: '/contract/contracttype/deleteContractType',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

// 职级-类型-模板-获取列表
export const getRankList = (data) => {
	return axios.request({
		url: '/contract/contractrank/list',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

// 职级-类型-模板-新增
export const insertRank = (data) => {
	return axios.request({
		url: '/contract/contractrank/insert',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

// 职级-类型-模板-修改
export const updateRank = (data) => {
	return axios.request({
		url: '/contract/contractrank/update',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

// 职级-类型-模板-删除
export const deleteRank = (data) => {
	return axios.request({
		url: '/contract/contractrank/delete',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

// 类型-签订次数-年限-获取列表
export const getYearSelectAll = (params) => {
	return axios.request({
        url: '/contract/yearToContract/selectAll',
        params,
        method: 'get'
	})
}

// 类型-签订次数-年限-新增
export const insertSelective = (data) => {
	return axios.request({
		url: '/contract/yearToContract/insertSelective',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

// 类型-签订次数-年限-修改
export const updateByPrimaryKeySelective = (data) => {
	return axios.request({
		url: '/contract/yearToContract/updateByPrimaryKeySelective',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

// 类型-签订次数-年限-删除
export const deleteByPrimaryKey = (params) => {
	return axios.request({
        url: '/contract/yearToContract/deleteByPrimaryKey',
        params,
        method: 'get'
	})
}

// 基础设置-印章管理-法人单位筛选
export const getSealLegalname = (params) => {
	return axios.request({
        url: '/contract/seal/legalname',
        params,
        method: 'get'
	})
}

// 基础设置-印章管理-获取列表
export const getSealList = (params) => {
	return axios.request({
        url: '/contract/seal/getList',
        params,
        method: 'get'
	})
}

// 基础设置-印章管理-新增印章
export const insertSeal = (data) => {
	return axios.request({
		url: '/contract/qys/createseal',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

// 基础设置-印章管理-印章图片
export const getSealImg = (data) => {
	return axios.request({
		url: '/contract/qys/sealimage',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

// 基础设置-印章管理-删除/停用印章
export const updateSeal = (data) => {
	return axios.request({
		url: '/contract/seal/updateStatus',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

// 合同管理-合同查询-获取列表
export const getContractList = (data) => {
	return axios.request({
		url: '/contract/contract/list',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

// 合同管理-合同查询-获取详情
export const getContractDetail = (params) => {
	return axios.request({
		url: '/contract/contract/selecthrmdetail',
		params,
		method: 'get',
	})
}

// 合同管理-合同查询-导出
export const getContraclExcel = (data) => {
	return axios.request({
		url: '/contract/contract/getexcel',
		data,
		method: 'post',
        // responseType: 'blob',
		headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
		  'Content-Type' : 'application/x-www-form-urlencoded'
		}
	})
}

// 合同管理-员工-待签署-获取列表
export const getContractSignList = (data) => {
	return axios.request({
		url: '/contract/contract/Tobesignedlist',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

// 合同管理-员工-待签署-发起签署
export const sendSign = (data) => {
	return axios.request({
		url: '/contract/qys/send',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

// 合同管理-员工-待签署-续签-发起签署
export const sendSignx = (data) => {
	return axios.request({
		url: '/contract/qys/renewsend',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

// 合同管理-员工-待签署-续签-发起签署（批量）
export const sendSignxs = (data) => {
	return axios.request({
		url: ' /contract/qys/renewsendbatch',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

// 合同管理-员工-待签署-续签
export const getListtobesigned = (data) => {
	return axios.request({
		url: '/contract/contract/Listtobesigned',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

// 合同管理-员工-待签署-分组数量
export const gettobesignedCount = (params) => {
	return axios.request({
		url: '/contract/contract/gettobesignedCount',
		params,
		method: 'get',
	})
}

// 合同管理-员工-待签署-作废
export const invalidContract = (params) => {
	return axios.request({
		url: '/contract/contract/invalidContract',
		params,
		method: 'get',
	})
}

// 合同管理-已作废
export const Toinvalidlist = (data) => {
	return axios.request({
		url: '/contract/contract/Toinvalidlist',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

// 合同管理-用印-待审批-重新发起
export const reSendSign = (data) => {
	return axios.request({
		url: '/contract/qys/sendretry',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

// 合同管理-员工-待签署-发起签署（批量）
export const sendSigns = (data) => {
	return axios.request({
		url: '/contract/qys/sendbatch',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

// 合同管理-用印-待审批-获取列表
export const getContractSealList = (data) => {
	return axios.request({
		url: '/contract/contract/Tobesealedlist',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

// 合同管理-用印-待审批-获取合同主体数量
export const getContractSubjectList = (data) => {
	return axios.request({
		url: '/contract/contract/getsubjectcount',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

// 合同管理-用印-待审批-发起盖章（批量）
export const sendOaSeals = (data) => {
	return axios.request({
		url: '/contract/employment/sendUseOfSealRenewal',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

// 合同管理-用印-待盖章-获取待盖章列表
export const getContractWaitList = (data) => {
	return axios.request({
		url: '/contract/contract/daisealedlist',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

// 合同管理-用印-待盖章-获取已盖章列表
export const getContractSuccessList = (data) => {
	return axios.request({
		url: '/contract/contract/toSuccesslist',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

// 合同管理-用印-待盖章-盖章
export const sendSeal = (data) => {
	return axios.request({
		url: '/contract/qys/signbycompany',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

// 合同管理-用印-待盖章-盖章（批量）
export const sendSeals = (data) => {
	return axios.request({
		url: '/contract/qys/signbycompanybatch',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

// 基础设置-企业信息-获取列表
export const getCompanyList = (data) => {
	return axios.request({
		url: '/contract/qys/companylist',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

// 基础设置-企业信息-刷新列表
export const refreshList = (data) => {
	return axios.request({
		url: '/contract/qys/syscompany',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

// 基础设置-模板参数-获取列表
export const getTemplateList = (data) => {
	return axios.request({
		url: '/contract/template/list',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

// 基础设置-模板参数-获取详情
export const getTemplateInfo = (data) => {
	return axios.request({
		url: '/contract/templateparam/templateparamlist',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

// 基础设置-模板参数-获取契约锁参数列表
export const getQysParams = (data) => {
	return axios.request({
		url: '/contract/template/info',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

// 基础设置-模板参数-获取关键词列表
export const getTemplateKeys = (data) => {
	return axios.request({
		url: '/contract/templateparam/templatesignparamlist',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

// 基础设置-模板参数-保存
export const saveTemplate = (data) => {
	return axios.request({
		url: '/contract/templateparam/insertview',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

// 基础设置-新建模板-获取链接
export const getTempUrl = (data) => {
	return axios.request({
		url: '/contract/qys/getwebssourl',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

// 基础设置-日志查询-日志列表
export const getLogList = (params) => {
	return axios.request({
		url: '/contract/employeejurisdiction/serchInfo',
		params,
		method: 'get',
	})
}

export const getViewUrl = (params) => {
	return axios.request({
		url: '/contract/qys/getViewurl',
		params,
		method: 'get',
	})
}
