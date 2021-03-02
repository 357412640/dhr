// 排班
export default {
  // 班次列表
  getWorkTimeList:
    {
      "code": 200,
      "message": "success",
      "data": [
        {
          "id": 23,
          "name": "1"
        },
        {
          "id": 25,
          "name": "1"
        },
        {
          "id": 35,
          "name": "总部1"
        },
        {
          "id": 36,
          "name": "总部1"
        },
        {
          "id": 37,
          "name": "总部1"
        },
        {
          "id": 45,
          "name": "总部1"
        },
        {
          "id": 46,
          "name": "总部1"
        },
        {
          "id": 48,
          "name": "鞍海1"
        },
        {
          "id": 49,
          "name": "鞍海2"
        },
        {
          "id": 54,
          "name": "鞍海6"
        },
        {
          "id": 56,
          "name": "鞍海7"
        },
        {
          "id": 58,
          "name": "1"
        }
      ]
    },
  // 考勤档案列表
  getArchiveList: {
    "code": 200,
    "message": "success",
    "data": {
      "total": 0,
      "list": [
        {
          "emplid": "123", // 员工id
          "name": "张三",  // 员工姓名
          "deptChain": "", //部门链
          "workRule": 1,  //工时制度 1=标准工时 2=综合工时 3=不定时工时 可能存在为空
          "workTimeName": "123", // 班次名称
          "origHireDt": "2020/12/12", // 入职日期
          "dimissionDt": "2028/12/12" // 离职日期
        }
      ],
      "pageNum": 0,
      "pageSize": 0,
      "size": 0,
      "startRow": 0,
      "endRow": 0,
      "pages": 0,
      "prePage": 0,
      "nextPage": 0,
      "isFirstPage": false,
      "isLastPage": false,
      "hasPreviousPage": false,
      "hasNextPage": false,
      "navigatePages": 0,
      "navigatepageNums": null,
      "navigateFirstPage": 0,
      "navigateLastPage": 0
    }
  },
  // 档案列表移除
  deleteUser: {
    "code": 200,
    "message": "success",
    "data": null
  },
  // 8.1排班列表
  getPlanList: {
    "code": 200,
    "message": "success",
    "data": [
      {
        "name": "张三Test",
        "emplid": "10000111",
        "list": [
          {
            "id": 2,
            "emplid": "10000111",
            "day": "2020-11-24T16:00:00.000+00:00",
            "type": 0,
            "wtrId": null,
            "name": "张三Test"
          },
          {
            "id": 3,
            "emplid": "10000111",
            "day": "2020-11-25T16:00:00.000+00:00",
            "type": 0,
            "wtrId": null,
            "name": "张三Test"
          },
          {
            "id": 4,
            "emplid": "10000111",
            "day": "2020-11-26T16:00:00.000+00:00",
            "type": 1,
            "wtrId": null,
            "name": "张三Test"
          },
          {
            "id": 5,
            "emplid": "10000111",
            "day": "2020-11-27T16:00:00.000+00:00",
            "type": 2,
            "wtrId": null,
            "name": "张三Test"
          },
          {
            "id": 6,
            "emplid": "10000111",
            "day": "2020-11-28T16:00:00.000+00:00",
            "type": 2,
            "wtrId": null,
            "name": "张三Test"
          },
          {
            "id": 7,
            "emplid": "10000111",
            "day": "2020-11-29T16:00:00.000+00:00",
            "type": 3,
            "wtrId": null,
            "name": "张三Test"
          }
        ]
      },
      {
        "name": "张三Test",
        "emplid": "10000111",
        "list": [
          {
            "id": 2,
            "emplid": "10000111",
            "day": "2020-11-24T16:00:00.000+00:00",
            "type": 0,
            "wtrId": null,
            "name": "张三Test"
          },
          {
            "id": 3,
            "emplid": "10000111",
            "day": "2020-11-25T16:00:00.000+00:00",
            "type": 0,
            "wtrId": null,
            "name": "张三Test"
          },
          {
            "id": 4,
            "emplid": "10000111",
            "day": "2020-11-26T16:00:00.000+00:00",
            "type": 1,
            "wtrId": null,
            "name": "张三Test"
          },
          {
            "id": 5,
            "emplid": "10000111",
            "day": "2020-11-27T16:00:00.000+00:00",
            "type": 4,
            "wtrId": null,
            "name": "张三Test"
          },
          {
            "id": 6,
            "emplid": "10000111",
            "day": "2020-11-28T16:00:00.000+00:00",
            "type": 3,
            "wtrId": null,
            "name": "张三Test"
          },
          {
            "id": 7,
            "emplid": "10000111",
            "day": "2020-11-29T16:00:00.000+00:00",
            "type": 3,
            "wtrId": null,
            "name": "张三Test"
          }
        ]
      }
    ]
  },
  // 8.2提交当前人员进行排班
  savePlan: {
    "code": 200,
    "message": "success",
    "data": {}
  },
  // 8.3排班状态列表
  getPlanStatusList: {
    "code": 200,
    "message": "success",
    "data": [
      {
        "id": 2,
        "count": 1,
        "status": 1,
        "remark": "1",
        "updateTime": '202033030',
        "updateUser": 'null',
        "updateUserId": null
      },
      {
        "id": 3,
        "count": 1,
        "status": 1,
        "remark": "2",
        "updateTime": null,
        "updateUser": null,
        "updateUserId": null
      }
    ]
  },
  // 8.4需要排班员工列表
  getPlanUserList: {
    "code": 200,
    "message": "success",
    "data":  [
      {
        "id": 17845369,
        "name": "张三Test",
        "emplid": "10000003"
      },
      {
        "id": 17960030,
        "name": "张三Test",
        "emplid": "10000002"
      }
    ]
  },
  // 8.5员工排班状态列表
  getPlanUserStatusList: {
    "code": 200,
    "message": "success",
    "data": [
      {
        "id": 3,
        "name": "yanzhuang",
        "emplid": "1",
        "status": 1
      },
      {
        "id": 4,
        "name": "yanzhuang2",
        "emplid": "2",
        "status": 2
      }
    ]
  },
  // 9.3 当月入职员工
  getEmployeeEntry: {
    "code": 200,
    "message": "success",
    "data": {
      "total": 1,
      "list": [
        {
          "emplid": 111, // 员工id
          "name": 'test', // 员工名称
          "deptChain": 'tr', // 部门链
          "workTimeRuleId": 23, // 班次id
          "workTimeRuleName": 1, // 班次名称
          "origHireDt": null, // 入职日期
          "dimissionDt": null // 离职日期
        }
      ],
      "pageNum": 1,
      "pageSize": 1,
      "size": 1,
      "startRow": 0,
      "endRow": 0,
      "pages": 1,
      "prePage": 0,
      "nextPage": 0,
      "isFirstPage": true,
      "isLastPage": true,
      "hasPreviousPage": false,
      "hasNextPage": false,
      "navigatePages": 8,
      "navigatepageNums": [
        1
      ],
      "navigateFirstPage": 1,
      "navigateLastPage": 1
    }
  },
  // 9.4 当月离职员工
  getEmployeeLeave:  {
    "code": 200,
    "message": "success",
    "data": {
      "total": 1,
      "list": [
        {
          "emplid": 111, // 员工id
          "name": 'test', // 员工名称
          "deptChain": 'tr', // 部门链
          "workTimeRuleId": 23, // 班次id
          "workTimeRuleName": 1, // 班次名称
          "origHireDt": null, // 入职日期
          "dimissionDt": null // 离职日期
        }
      ],
      "pageNum": 1,
      "pageSize": 1,
      "size": 1,
      "startRow": 0,
      "endRow": 0,
      "pages": 1,
      "prePage": 0,
      "nextPage": 0,
      "isFirstPage": true,
      "isLastPage": true,
      "hasPreviousPage": false,
      "hasNextPage": false,
      "navigatePages": 8,
      "navigatepageNums": [
        1
      ],
      "navigateFirstPage": 1,
      "navigateLastPage": 1
    }
  },
  // 9.5 未添加员工
  getEmployeeNot:  {
    "code": 200,
    "message": "success",
    "data": {
      "total": 1,
      "list": [
        {
          "emplid": 111, // 员工id
          "name": 'test', // 员工名称
          "deptChain": 'tr', // 部门链
          "workTimeRuleId": 23, // 班次id
          "workTimeRuleName": 1, // 班次名称
          "origHireDt": null, // 入职日期
          "dimissionDt": null // 离职日期
        }
      ],
      "pageNum": 1,
      "pageSize": 1,
      "size": 1,
      "startRow": 0,
      "endRow": 0,
      "pages": 1,
      "prePage": 0,
      "nextPage": 0,
      "isFirstPage": true,
      "isLastPage": true,
      "hasPreviousPage": false,
      "hasNextPage": false,
      "navigatePages": 8,
      "navigatepageNums": [
        1
      ],
      "navigateFirstPage": 1,
      "navigateLastPage": 1
    }
  }

}
