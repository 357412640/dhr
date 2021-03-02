export const login = req => {
  return {
    'errno': 10000,
    'errmsg': '用户名或密码错误'
  }
}

export const getUserInfo = req => {
  return {
    "code": 200,
    "message": "success",
    "data": {
      "userInfo": {
        "userId": 3,
        "emplid": "10320134",
        "name": "张三Test",
        "photoUrl": "http://gm-ehr-emp-photo.bjgc3-gos.gomecloud.com/103201341563949077800.jpg"
      },
      "menuGroup": [
        {
          "appName": "权限管理", // 应用名称
          "menuGroup": [ // 菜单列表
            {
              "menuId": 4, // 菜单id
              "menuCode": null,
              "menuName": "角色管理", // 菜单名称
              "buttonGroup": [ // 按钮列表
                {
                  "menuId": 5, // 按钮id
                  "menuName": "新建", // 按钮名称
                  "url": "/paltform/management/scope/create", // 按钮url

                  "remark": "创建管理范围功能", // 按钮描述

                },
                {
                  "menuId": 6,
                  "appName": "权限管理",
                  "appCode": "auth",
                  "menuName": "修改",
                  "url": "/paltform/management/scope/update",
                  "menuType": "F",
                  "remark": "修改管理范围功能",
                  "parentId": 4,
                  "isCheck": null
                }
              ]
            },
            {
              "menuId": 10, // 菜单id
              "menuCode": null,
              "menuName": "角色管理", // 菜单名称
              "buttonGroup": [ // 按钮列表
                {
                  "menuId": 5, // 按钮id
                  "menuName": "新建", // 按钮名称
                  "url": "/paltform/management/scope/create", // 按钮url

                  "remark": "创建管理范围功能", // 按钮描述

                },
                {
                  "menuId": 6,
                  "appName": "权限管理",
                  "appCode": "auth",
                  "menuName": "修改",
                  "url": "/paltform/management/scope/update",
                  "menuType": "F",
                  "remark": "修改管理范围功能",
                  "parentId": 4,
                  "isCheck": null
                }
              ]
            }
          ]
        }
      ]
    }
  }
}

export const logout = req => {
  return null
}
