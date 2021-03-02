import Main from '@/components/main'
import subCon from '@/components/subCon'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由(当前项目后台返回key数组展示子路由)
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 *
 *  addMenu (true) 设置为 not 后页面菜单本级不添加到权限分配的可勾选菜单列表中
 *  key (-) 权限分配时 后台保存被勾选节点的对应值
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true,
      addMenu: 'not'
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/view/system_management',
    name: 'system_management',
    component: Main,
    meta: {
      title: '权限管理',
      icon: 'md-home'
    },
    children: [
      {
        path: 'role-management',
        name: 'role-management',
        meta: {
          title: '角色管理',
          // notCache: true,
          key: 'role_management',
          // icon: 'md-albums',
          menuId: 12
        },
        component: () => import('@/view/permission-management/role-management/role-management')
      },
      {
        path: 'role-edit',
        name: 'role-edit',
        meta: {
          title: '角色修改',
          hideInMenu: true,
          notCache: true
        },
        component: () => import('@/view/permission-management/role-management/role-edit')
      },
      {
        path: 'user-management',
        name: 'user-management',
        meta: {
          title: '用户管理',
          key: 'user_management',
          // icon: 'md-person',
          menuId: 4
        },
        component: () => import('@/view/permission-management/user-management/user-management')
      },
      {
        path: "management-scope",
        name: "management-scope",
        component: () =>
          import(
            /* webpackChunkName: "management-scope" */ "@/view/auth-management/management-scope.vue"
            ),
        meta: {
          title: "管理范围",
          key: 'management-scope',
          menuId: 6
        }
      },
      {
        path: "management-scope-detail/:id",
        name: "management-scope-detail",
        component: () =>
          import(
            /* webpackChunkName: "management-scope" */ "@/view/auth-management/management-scope-detail.vue"
            ),
        meta: {
          title: "管理范围",
          hideInMenu: true,
          key: 'management-scope-detail'
        }
      }
    ]
  },
  // {
  //   path: '/view/iframe',
  //   name: 'iframe',
  //   component: Main,
  //   meta: {
  //     title: '测试iframe'
  //   },
  //   children: [
  //     {
  //       path: 'test',
  //       name: 'test',
  //       meta: {
  //         title: '内嵌页面'
  //       },
  //       redirect: '/view/iframe/test2',
  //       component: subCon,
  //       children: [
  //         {
  //           path: 'test1',
  //           name: 'test1',
  //           meta: {
  //             title: 'test1',
  //             key: 'test'
  //           },
  //           component: () => import('@/view/test/iframe/iframe')
  //         },
  //         {
  //           path: 'test3',
  //           name: 'test3',
  //           meta: {
  //             title: 'test3',
  //             key: 'test3'
  //           },
  //           component: () => import('@/view/test/iframe/iframe2')
  //         }
  //       ]
  //     }
  //   ]
  // },
  // {
  //   path: '/view/test2',
  //   name: 'test2',
  //   meta: {
  //     title: 'test2',
  //     hideInMenu: true,
  //     addMenu: 'not'
  //   },
  //   component: () => import('@/view/test/iframe/test')
  // },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/view/management-attendance',
    name:'management-attendance',
    component: Main,
    meta: {
      title: '考勤管理',
      icon: 'md-settings'
    },
    children: [
      {
        path: 'basic_setting',
        name: 'basic_setting',
        meta: {
          title: '基础设置'
        },
        component: parentView,
        children: [
          {
            path: 'list_calendar',
            name: 'list_calendar',
            meta: {
              title: '假期日历',
              // notCache: true,
              key: 'calendar',
              // icon: 'md-home'
              menuId: 21
            },
            component: () => import('@/view/basic-setting/calendar/calendar.vue')
          },
          {
            path: 'add_calendar',
            name: 'add_calendar',
            meta: {
              title: '假期日历',
              // notCache: true,
              key: 'calendar_add',
              hideInMenu: true
              // icon: 'md-home'
            },
            component: () => import('@/view/basic-setting/calendar-add/calendar-add.vue')
          },
          {
            path: 'check_time',
            name: 'check_time',
            meta: {
              title: '考勤期间',
              // notCache: true,
              key: 'check_time',
              menuId: 28
              // icon: 'md-home'
            },
            component: () => import('@/view/basic-setting/check-time/check-time.vue')
          },
          {
            path: 'holiday_rule',
            name: 'holiday_rule',
            meta: {
              title: '休假规则',
              // notCache: true,
              key: 'holiday_rule',
              menuId: 34
              // icon: 'md-home'
            },
            component: () => import('@/view/basic-setting/holiday-rule/holiday-rule.vue')
          },
          {
            path: 'shift-management',
            name: 'shift-management',
            meta: {
              title: '班次管理',
              key: 'shift-management',
              menuId: 45
            },
            component: () => import('@/view/basic-setting/shift-management/index.vue')
          },
          {
            path: 'check_rule',
            name: 'check_rule',
            meta: {
              title: '考勤规则',
              // notCache: true,
              key: 'check_rule',
              menuId: 39
              // icon: 'md-home'
            },
            component: () => import('@/view/basic-setting/check-rule/check-rule.vue')
          }
        ]
      },
      {
        path: 'sub-attendance',
        name: 'sub-attendance',
        meta: {
          title: '考勤管理'
        },
        component: parentView,
        children: [
          {
            path: 'file-attendance',
            name: 'file-attendance',
            meta: {
              title: '考勤档案',
              key: 'file-attendance',
              menuId: 18
              // icon: 'md-home'
            },
            component: () => import('@/view/basic-setting/file-attendance/index.vue')
          },
          {
            path: 'detail-attendance/:info',
            name: 'detail-attendance',
            meta: {
              title: '档案详情',
              key: 'detail-attendance',
              hideInMenu: true,
              // menuId:
              // icon: 'md-home'
            },
            component: () => import('@/view/basic-setting/file-attendance/detail.vue')
          },
          {
            path: 'uploadAndDown-attendance',
            name: 'uploadAndDown-attendance',
            meta: {
              title: '数据导入',
              key: 'uploadAndDown-attendance',
              hideInMenu: true,
              // menuId:
              // icon: 'md-home'
            },
            component: () => import('@/view/basic-setting/file-attendance/uploadAndDown.vue')
          },
          {
            path: 'list-attendance',
            name: 'list-attendance',
            meta: {
              title: '批量排班',
              key: 'list-attendance',
              hideInMenu: true,
              // menuId:
              // icon: 'md-home'
            },
            component: () => import('@/view/basic-setting/file-attendance/list.vue')
          },
          {
            path: 'administrator',
            name: 'administrator',
            meta: {
              title: '批量排班',
              key: 'administrator',
              hideInMenu: true,
              // menuId:
              // icon: 'md-home'
            },
            component: () => import('@/view/basic-setting/file-attendance/administrator.vue')
          },
	  {
	    path: 'data_list',
	    name: 'data_list',
	    meta: {
	      title: '人脸数据',
	      menuId: 88,
	      key: 'data_list',
	    },
	    component: () => import('@/view/face-management/data.vue')
	  },
	  {
	    path: 'log_list',
	    name: 'log_list',
	    meta: {
	      title: '操作记录',
	      key: 'log_list',
	      menuId: 89,
	    },
	    component: () => import('@/view/face-management/log.vue')
	  },
        ]
      },
      {
        path: 'statistics-attendance',
        name: 'statistics-attendance',
        component: parentView,
        meta: {
          title: '考勤统计',
          // icon: 'md-timer'
        },
        children: [
          {
            path: 'month-statistics',
            name: 'month-statistics',
            meta: {
              title: '月度统计',
              key: 'month-statistics',
              menuId: 92
            },
            component: () => import('@/view/statistics-attendance/month-statistics/month-statistics')
          }
        ]
      },
    ]
  },
  {
    path: '/view/e-contract',
    name:'e-contract',
    component: Main,
    meta: {
      title: '电子合同',
      icon: 'md-filing'
    },
    children: [
      {
        path: 'data_analysis',
        name: 'data_analysis',
        meta: {
          title: '统计分析',
          key: 'data_analysis',
          menuId: 79
        },
        component: () => import('@/view/e-contract/data-analysis/detail.vue')
      },
      {
        path: 'management_contract',
        name: 'management_contract',
        meta: {
          title: '合同管理'
        },
        component: parentView,
        children: [
          {
            path: 'contract_all_list',
            name: 'contract_all_list',
            meta: {
              title: '合同查询',
              key: 'contract_all_list',
              menuId: 74
            },
            component: () => import('@/view/e-contract/contract-management/contract-all-list/list.vue')
          },
          {
            path: 'contract_all_detail',
            name: 'contract_all_detail',
            meta: {
              title: '合同详情',
              key: 'contract_all_detail',
              hideInMenu: true,
              menuId: 75
            },
            component: () => import('@/view/e-contract/contract-management/contract-all-list/detail.vue')
          },
          {
            path: 'contract_sign_list',
            name: 'contract_sign_list',
            meta: {
              title: '员工-待签署',
              key: 'contract_sign_list',
              menuId: 76
            },
            component: () => import('@/view/e-contract/contract-management/contract-sign-list/list.vue')
          },
          {
            path: 'contract_sign_listx',
            name: 'contract_sign_listx',
            meta: {
              title: '员工-待签署-续签',
              key: 'contract_sign_listx',
              menuId: 95
            },
            component: () => import('@/view/e-contract/contract-management/contract-sign-listx/list.vue')
          },
          {
            path: 'contract_sign_listb',
            name: 'contract_sign_listb',
            meta: {
              title: '员工-待签署-变更',
              key: 'contract_sign_listb',
              hideInMenu: true,
            },
            component: () => import('@/view/e-contract/contract-management/contract-sign-list/list.vue')
          },
          {
            path: 'contract_seal_list',
            name: 'contract_seal_list',
            meta: {
              title: '用印-待审批',
              key: 'contract_seal_list',
              menuId: 77
            },
            component: () => import('@/view/e-contract/contract-management/contract-seal-list/list.vue')
          },
          {
            path: 'contract_seal_detail',
            name: 'contract_seal_detail',
            meta: {
              title: '待盖章详情',
              key: 'contract_seal_detail',
              hideInMenu: true
            },
            component: () => import('@/view/e-contract/contract-management/contract-seal-list/detail.vue')
          },
          {
            path: 'contract_seal_edit',
            name: 'contract_seal_edit',
            meta: {
              title: '待盖章编辑',
              key: 'contract_seal_edit',
              hideInMenu: true
            },
            component: () => import('@/view/e-contract/contract-management/contract-seal-list/edit.vue')
          },
          {
            path: 'use_seal_list',
            name: 'use_seal_list',
            meta: {
              title: '用印-待盖章',
              key: 'use_seal_list',
              menuId: 78
            },
            component: () => import('@/view/e-contract/contract-management/use-seal/list.vue')
          },
          {
            path: 'due_soon_list',
            name: 'due_soon_list',
            meta: {
              title: '即将到期',
              key: 'due_soon_list',
              hideInMenu: true,
            },
            component: () => import('@/view/e-contract/contract-management/due-soon/list.vue')
          },
          {
            path: 'contract_cancel_list',
            name: 'contract_cancel_list',
            meta: {
              title: '已作废',
              key: 'contract_cancel_list',
              menuId: 94
            },
            component: () => import('@/view/e-contract/contract-management/contract-cancel/list.vue')
          }
        ]
      },
      {
        path: 'seal_ctrl_list',
        name: 'seal_ctrl_list',
        meta: {
          title: '印章管理',
          key: 'uploadAndDown-attendance',
          menuId: 83
        },
        component: () => import('@/view/e-contract/management-center/seal-ctrl/list.vue')
      },
      {
        path: 'seal_ctrl_edit',
        name: 'seal_ctrl_edit',
        meta: {
          title: '添加印章',
          key: 'seal_ctrl_edit',
          hideInMenu: true,
        },
        component: () => import('@/view/e-contract/management-center/seal-ctrl/edit.vue')
      },
      {
        path: 'management_center',
        name: 'management_center',
        meta: {
          title: '基础设置'
        },
        component: parentView,
        children: [
          {
            path: 'com_info_list',
            name: 'com_info_list',
            meta: {
              title: '企业信息',
              key: 'com_info_list',
              menuId: 80
            },
            component: () => import('@/view/e-contract/management-center/com-info/list.vue')
          },
          {
            path: 'add_temp_list',
            name: 'add_temp_list',
            meta: {
              title: '新建模板',
              key: 'add_temp_list',
              menuId: 81
            },
            component: () => import('@/view/e-contract/management-center/add-temp/list.vue')
          },
          {
            path: 'temp_params_list',
            name: 'temp_params_list',
            meta: {
              title: '模板参数',
              key: 'temp_params_list',
              menuId: 82
            },
            component: () => import('@/view/e-contract/management-center/temp-params/list.vue')
          },
          {
            path: 'temp_params_edit',
            name: 'temp_params_edit',
            meta: {
              title: '模板参数配置',
              key: 'temp_params_edit',
              hideInMenu: true,
            },
            component: () => import('@/view/e-contract/management-center/temp-params/edit.vue')
          },
          {
            path: 'base_setting',
            name: 'base_setting',
            meta: {
              title: '合同到期提醒设置',
              key: 'base_setting',
              menuId: 84
            },
            component: () => import('@/view/e-contract/management-center/base-setting/detail.vue')
          },
          {
            path: 'type_ctrl_list',
            name: 'type_ctrl_list',
            meta: {
              title: '类型管理',
              key: 'type_ctrl_list',
              menuId: 85
            },
            component: () => import('@/view/e-contract/management-center/type-ctrl/list.vue')
          },
          {
            path: 'type_rank_list',
            name: 'type_rank_list',
            meta: {
              title: '职级-类型-模板',
              key: 'type_rank_list',
              menuId: 86
            },
            component: () => import('@/view/e-contract/management-center/type-rank/list.vue')
          },
          {
            path: 'type_year_list',
            name: 'type_year_list',
            meta: {
              title: '类型-签订次数-年限',
              key: 'type_year_list',
              menuId: 87
            },
            component: () => import('@/view/e-contract/management-center/type-year/list.vue')
          },
          {
            path: 'ec_log_list',
            name: 'ec_log_list',
            meta: {
              title: '日志查询',
              key: 'ec_log_list',
              menuId: 93
            },
            component: () => import('@/view/e-contract/management-center/log-list/list.vue')
          },
        ]
      }
    ]
  },
//  {
//    path: '/face_management',
//    name: 'face_management',
//    component: Main,
//    meta: {
//      title: '人脸管理',
//      icon: 'md-happy'
//    },
//    children: [
//      {
//        path: 'data_list',
//        name: 'data_list',
//        meta: {
//          title: '人脸数据',
//          key: 'data_list',
//        },
//        component: () => import('@/view/face-management/data.vue')
//      },
//      {
//        path: 'log_list',
//        name: 'log_list',
//        meta: {
//          title: '操作记录',
//          key: 'log_list',
//        },
//        component: () => import('@/view/face-management/log.vue')
//      },
//    ]
//  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  },
  {
    path: '/forbid',
    name: 'forbid',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/forbid/forbid.vue')
  }
]
