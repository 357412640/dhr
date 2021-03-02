export default {
  // 创建角色   /sys/role/create POST
  roleCreate: {
    "code": 200,
    "message": "success",
    "data": {}
  },

  //  修改角色 /sys/role/update  POST
  roleUpdate: {
    "code": 200,
    "message": "success",
    "data": {}
  },

  // 启用角色 /sys/role/enable/${roleId} POST
  roleEnable: {
    "code": 200,
    "message": "success",
    "data": {}
  },

  // 禁用角色 /sys/role/disAble/${roleId} POST
  roleDisable: {
    "code": 200,
    "message": "success",
    "data": {}
  },

  // 角色详情  url: /sys/role/detail/${roleId} GET
  roleInfo: {
    "code": 200,
    "message": "success",
    "data": {
      "roleId": 2, // 角色id
      "appName": "管理范围", // 应用名称
      "appCode": "scope", // 应用code
      "roleName": "管理范围员1", // 角色名称
      "roleCode": "scope-user-role", // 角色code
      "status": 0, // 角色状态 0启用 1禁用
      "gmtCreate": "2020/10/27 13:59:08", // 创建时间
      "gmtModified": "2020/10/27 14:02:06", // 修改时间
      "gmtCreateEmplid": "张1123三 (10369996)", // 创建人
      "gmtModifiedEmplid": "张1123三 (10369996)", // 修改人
      "remark": "这是管理范围角色1", // 角色描述
      "isCheck": null
    }
  },

  // 角色列表 /sys/role/page  POST
  roleList: {
    "code": 200,
    "message": "success",
    "data": {
      "total": 1,
      "pageNum": 1,
      "pageSize": 10,
      "pages": 1,
      "list": [
        {
          "roleId": 2, // 角色id
          "appName": "管理范围", // 应用名称
          "appCode": "scope", // 应用code
          "roleName": "管理范围员1", // 角色名称
          "roleCode": "scope-user-role", // 角色code
          "status": 0, // 角色状态 0启用 1禁用
          "gmtCreate": "2020/10/27 13:59:08", // 创建时间
          "gmtModified": "2020/10/27 14:02:06", // 修改时间
          "gmtCreateEmplid": "张1123三 (10369996)", // 创建人
          "gmtModifiedEmplid": "张1123三 (10369996)", // 修改人
          "remark": "这是管理范围角色1", // 角色描述
          "isCheck": null
        }
      ],
      "nextPageEnable": 0
    }
  },

  // 应用列表
  appList: {
    "code": 200,
    "message": "success",
    "data": [
      {
        "appName": "管理范围", // 角色名称
        "appCode": "scope" // 角色编码
      }
    ]
  },


  // 获取所有应用下的菜单
  appMenuList: {
    "code": 200,
    "message": "success",
    "data": {
      "权限管理": [
        {
          "menuId": 1, // 菜单id
          "appName": "权限管理", // 应用名称
          "appCode": "auth", // 应用编码
          "menuName": "管理范围", // 菜单名称
          "url": "#", // 菜单url
          "menuType": "C", // 菜单类型 F：按钮 C：菜单
          "remark": "", // 菜单备注
          "parentId": 1,
          "isCheck": 1 //  上次未被选择
        },
        {
          "menuId": 2, // 菜单id
          "appName": "权限管理", // 应用名称
          "appCode": "auth", // 应用编码
          "menuName": "角色范围", // 菜单名称
          "url": "#1", // 菜单url
          "menuType": "C", // 菜单类型 F：按钮 C：菜单
          "remark": "", // 菜单备注
          "parentId": 1,
          "isCheck": 0 // 上次已被选择
        },
        {
          "menuId": 3, // 菜单id
          "appName": "权限管理", // 应用名称
          "appCode": "auth", // 应用编码
          "menuName": "用户管理", // 菜单名称
          "url": "#1", // 菜单url
          "menuType": "C", // 菜单类型 F：按钮 C：菜单
          "remark": "", // 菜单备注
          "parentId": 1,
          "isCheck": 0 // 上次已被选择
        }
      ]
    }
  },

  // 保存角色下的菜单
  saveAppMenuList: {
    "code": 200,
    "message": "success",
    "data": null
  },

  // 获取所有应用下的菜单 列表
  getAppMenuList: {
    "code": 200,
    "message": "success",
    "data": {
      "total": 1,
      "pageNum": 10,
      "pageSize": 10,
      "pages": 1,
      "list": [
        {
          "menuId": 1, // 菜单id
          "appName": "权限管理", // 应用名称
          "appCode": "auth", // 应用编码
          "menuName": "管理范围", // 菜单名称
          "url": "#", // 菜单url
          "menuType": "C", // 菜单类型 C:菜单 F：按钮
          "remark": "", //菜单备注
          "menuList": [ // 操作按钮列表
            {
              "menuId": 2,
              "appName": "权限管理",
              "appCode": "auth",
              "menuName": "创建管理范围",
              "url": "#",
              "menuType": "F",
              "remark": "",
              "parentId": 1,
              "isCheck": 0
            },
            {
              "menuId": 3,
              "appName": "权限管理",
              "appCode": "auth",
              "menuName": "修改管理范围",
              "url": "#",
              "menuType": "F",
              "remark": "",
              "parentId": 1,
              "isCheck": 0
            }
          ]
        }
      ],
      "nextPageEnable": 0
    }
  },

  // 保存, 某个角色下的操作权限
  saveMenuList: {
    "code": 200,
    "message": "success",
    "data": null
  },

  // 去除, 某个角色下的操作权限
  cancelMenuList: {
    "code": 200,
    "message": "success",
    "data": null
  },

  // 角色管理-操作记录
  roleLogList: {
    "code": 200,
    "message": "success",
    "data": [
      {
        "id": 13, // 操作id
        "roleId": 2, // 角色id
        "log": "管理范围员12", // 日志内容
        "gmtCreate": "2020/10/27 15:59:19", // 创建时间
        "gmtCreateUser": "张1123三 (10369996)" //创建人
      },
      {
        "id": 12,
        "roleId": 2,
        "log": "管理范围员12",
        "gmtCreate": "2020/10/27 15:51:29",
        "gmtCreateUser": "张1123三 (10369996)"
      },
      {
        "id": 11,
        "roleId": 2,
        "log": "管理范围",
        "gmtCreate": "2020/10/27 15:00:06",
        "gmtCreateUser": "张1123三 (10369996)"
      },
      {
        "id": 10,
        "roleId": 2,
        "log": "禁用角色",
        "gmtCreate": "2020/10/27 14:02:06",
        "gmtCreateUser": "张1123三 (10369996)"
      },
      {
        "id": 9,
        "roleId": 2,
        "log": "启用角色",
        "gmtCreate": "2020/10/27 14:01:19",
        "gmtCreateUser": "张1123三 (10369996)"
      },
      {
        "id": 8,
        "roleId": 2,
        "log": "创建角色",
        "gmtCreate": "2020/10/27 13:59:08",
        "gmtCreateUser": "张1123三 (10369996)"
      }
    ]
  },
  // 成员列表
  userList: {
    "code": 200,
    "message": "success",
    "data": {
      "total": 1,
      "pageNum": 0,
      "pageSize": 10,
      "pages": 0,
      "list": [
        {
          "id": 1, // 用户id
          "emplid": "10000002", // Ps code
          "staffName": "张三Test", // 用户名称
          "staffStatus": "在岗", // 员工状态
          "userStatus": 2, // 用户状态 1-启用 2-禁用
          "staffEmail": "peoplesoft@peoplesoft.com", // 邮箱
          "scopeName": "G-01" // 管理范围
        }
      ],
      "nextPageEnable": 0
    }
  },
  // 可授权成员列表
  authList: {
    "code": 200,
    "message": "success",
    "data": {
      "total": 2,
      "pageNum": 10,
      "pageSize": 0,
      "pages": 0,
      "list": [
        {
          "appName": "管理范围", // 应用名称
          "appCode": "scope", // 应用编码
          "roleName": "管理范围员1", // 角色名称
          "roleCode": "scope-user-role", // 角色编码
          "status": 0, // 角色状态（0正常 1停用）
          "remark": "这是管理范围角色1", // 角色备注
          "createTime": "2020-10-27T07:59:19.000+0000" // 创建时间
        },
        {
          "appName": "管理范围",
          "appCode": "scope",
          "roleName": "管理范围员1",
          "roleCode": "scope-user-role",
          "status": 0,
          "remark": "这是管理范围角色1",
          "createTime": "2020-10-27T07:51:30.000+0000"
        }
      ],
      "nextPageEnable": 0
    }
  },

  // 授权 树
  authTree: {
    "code": 200,
    "message": "success",
    "data": {
      "管理范围": [ // 应用
        {
          "roleId": 1, // 角色id
          "appName": "管理范围", // 应用名
          "appCode": "scope", // 应用编码
          "roleName": "管理范围员12", // 角色名称
          "roleCode": "scope-user-role", // 角色编码
          "status": 0, // 角色状态 0启动 1禁用
          "gmtCreate": "2020/10/27 10:52:20", // 创建时间
          "gmtModified": "2020/10/27 10:55:10", // 更新时间
          "gmtCreateEmplid": "10369996",
          "gmtModifiedEmplid": "10369996",
          "remark": "这是管理范围角色12", // 角色描述
          "isCheck": 0 // 上次是否已经被选择
        },
        {
          "roleId": 2,
          "appName": "管理范围",
          "appCode": "scope",
          "roleName": "管理范围员1",
          "roleCode": "scope-user-role",
          "status": 0,
          "gmtCreate": "2020/10/27 13:59:08",
          "gmtModified": "2020/10/27 14:02:06",
          "gmtCreateEmplid": "10369996",
          "gmtModifiedEmplid": "10369996",
          "remark": "这是管理范围角色1",
          "isCheck": 1
        }
      ]
    }
  },

  // 保存授权
  saveAuth: {
    "code": 200,
    "message": "success",
    "data": null
  }

}


