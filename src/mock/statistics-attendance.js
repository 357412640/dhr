// 考勤统计
export default {
  // 姓名查询列表
  // /employee/serchInof
  getSearchInfo: {
    "code": 200,
    "message": "success",
    "data": [
      {
        "deptChain": "国美通讯_国美通讯总部_总裁办_研发品质系统_项目中心_项目部",
        "emplid": "10002153",
        "name": "张三Test1",
      },
      {
        "deptChain": "国美通讯_国美通讯总部_总裁办_研发品质系统_项目中心_项目部",
        "emplid": "10002187",
        "name": "张三Test2",
      },
      {
        "deptChain": "国美通讯_国美通讯总部_总裁办_研发品质系统_项目中心_项目部",
        "emplid": "10002188",
        "name": "张三Test3",
      }]
  },
  // 查询下级树列表
  // /managementscope/child/tree
  getChildrenTree: {
    "code": 200,
    "message": "success",
    "data": [
      {
        "id": "9",
        "code": "04",
        "name": "G-04",
        "desc": "我是G-04",

      },
      {
        "id": "20",
        "code": "789948949",
        "name": "东北大区",
        "desc": "",
      },
      {
        "id": "15",
        "code": "1234567",
        "name": "安迅物流",
        "desc": "123456",
      }]
  },
  // 月度考勤汇总列表
  getMonthStatisticsList: {
    "code": 200,
    "message": "success",
    "data": {
      "list": [{
        "name": "张三Test",
        "emplid": "10000003",
        "deptDescr": "国美控股集团总部",
        "workRule": "",
        "dueAttendance": "",
        "actualAttendance": "",
        "vocation": "",
        "late": "",
        "leaveEarly": "",
        "approvedNotClocked": "",
        "noApprovedNotClocked": "",
        "sickIn": "",
        "sickOut": "",
        "compassionate": "",
        "maternity": "",
        "nursing": "",
        "offSite": "",
        "absenteeism": "",
        "married": "",
        "pulicHoliday": "",
        "bereavement": "",
        "workIinjury": "",
        "farWork": 0,
        "origHireDt": "",
        "dimissionDt": "",
      }],
      "pageNum": 1,
      "pageSize": 10,
      "size": 1,
      "startRow": 1,
      "endRow": 1,
      "pages": 1,
      "prePage": 0,
      "nextPage": 0,
      "isFirstPage": true,
      "isLastPage": true,
      "hasPreviousPage": false,
      "hasNextPage": false,
      "navigatePages": 8,
      "navigatepageNums": [1],
      "navigateFirstPage": 1,
      "navigateLastPage": 1
    }
  }
}
