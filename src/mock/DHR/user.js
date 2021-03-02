export default {
  userList: {
    // 用户列表
    "code": 200,
    "message": "success",
    "data": {
      "total": 1,
      "pageNum": 1,
      "pageSize": 10,
      "pages": 0,
      "list": [
        {
          "id": 1,
          "emplid": "10000002", // ps code
          "name": "张三Test", // 用户名称
          "phone": "12345678912", // 手机号码
          "emailAddr": "peoplesoft@peoplesoft.com", // 邮箱
          "scopeName": "G-01", // 管理范围
          "scopeId": "6", // 管理范围id
          "scopeStatus": 2, // 管理范围员工状态 1-启用 2-禁用
          "createTime": "2020/10/28 20:12:12", // 创建时间
          "deptChain": "国美控股集团_国美控股集团总部", // 部门链
          "posiDescr": "CEO" // 职位
        }
      ],
      "nextPageEnable": 0
    }
  },
  userEnable: {
    "code": 200,
    "message": "success",
    "data": null
  },
  userDisable: {
    "code": 200,
    "message": "success",
    "data": null
  },
  getCreateList: {
    "code": 200,
    "message": "success",
    "data": [
      {
        "name": "张三Test", // 用户名
        "emplid": "10000007", // PS code
        "deptDescr": "国美控股集团总部", // 部门
        "deptChain": "国美控股集团_国美控股集团总部", // 部门链
        "posiDescr": "常务副总裁",  // 职位
        "phone": "18512345678", // 手机号码
        "emailAddr": "peoplesoft@peoplesoft.com", // 邮箱
      },
      {
        "name": "张三Test", // 用户名
        "emplid": "10000005", // PS code
        "deptDescr": "国美控股集团总部", // 部门
        "deptChain": "国美控股集团_国美控股集团总部", // 部门链
        "posiDescr": "常务副总裁",  // 职位
        "phone": "18512345678", // 手机号码
        "emailAddr": "peoplesoft@peoplesoft.com", // 邮箱
      }
    ]
  },
  getScopeList: {
    "code": 200,
    "message": "success",
    "data": [{
      "id": 6, // 范围id
      "code": "01", // 范围编码
      "name": "G-01", // 范围名称
      "desc": null, // 描述
      "pid": 0, // 父id
      "status": 1, // 状态: 0禁用 1启用
      "personType": "1,2,3", // 人员类型
      "haveBoss": 1, // 高管
      "gmtCreate": "2020/10/09 11:37:15", // 创建时间
      "gmtModified": "2020/10/09 14:34:16", // 修改时间
      "gmtCreateEmplid": "张1123三 (10369996)", // 创建人
      "gmtModifiedEmplid": "张1123三 (10369996)" // 修改人
    }]
  },
  getScopeTree: {
    "code": 200,
    "message": "success",
    "data": [
      {
        "id": 0, // 范围id
        "pid": -1, // 父级别id
        "code": "01", //编码
        "name": "GOME", // 名称
        "children": [ // 子节点
          {
            "id": 6,
            "pid": 0,
            "code": "01",
            "name": "G-01",
            "children": []
          }
        ]
      },
      {
        "id": 2, // 范围id
        "pid": -1, // 父级别id
        "code": "01", //编码
        "name": "GOME", // 名称
        "children": [ // 子节点
          {
            "id": 5,
            "pid": 2,
            "code": "01",
            "name": "G-02",
            "children": []
          }
        ]
      }
    ]
  },
  getListRole: {
    "code": 200,
    "message": "success",
    "data": {
      "应用A": [{
        "roleId": 1, // 角色id
        "roleName": "A1",  // 角色名称
        "roleCode": "", // 角色code
        "scopeId": '', // 范围id
        "scopeName": "", // 范围名称
        "isCheck": 1 // 0: 未选择, 1:已选择
      }],
      "应用B": [{
        "roleId": 2, // 角色id
        "roleName": "B1",  // 角色名称
        "roleCode": "", // 角色code
        "scopeId": '', // 范围id
        "scopeName": "", // 范围名称
        "isCheck": 1 // 0: 未选择, 1:已选择
      }]
    }
  },
  createUser: {
    "code": 200,
    "message": "success",
    "data": null
  },
  updateUser: {
    "code": 200,
    "message": "success",
    "data": null
  }
}

