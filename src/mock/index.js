import Mock from 'mockjs'
import { login, logout, getUserInfo } from './login'
import { getTableData, getDragList } from './data'

import role from './DHR/role'
import user from './DHR/user'

import * as calendar from './calendar'
import arrange from './file-attendance'
import attendance from './statistics-attendance'

// 登录相关和获取用户信息
// Mock.mock(/\/employee\/menu\/list/, getUserInfo)
// Mock.mock(/\/platform\/showTree/, getUserInfo)
// Mock.mock(/\/platform\/logout/, logout)
// Mock.mock(/\/platform\/get_table_data/, getTableData)
// Mock.mock(/\/platform\/get_drag_list/, getDragList)
// Mock.mock(/\/platform\/save_error_logger/, 'success')

// 角色管理
// 1.2
// Mock.mock(/\/sys\/role\/create/, role.roleCreate)
// Mock.mock(/\/sys\/role\/update/, role.roleUpdate)
// Mock.mock(/\/sys\/role\/enable/, role.roleEnable)
// Mock.mock(/\/sys\/role\/disAble/, role.roleDisable)
// Mock.mock(/\/sys\/role\/detail/, role.roleInfo)
// Mock.mock(/\/sys\/role\/page/, role.roleList)
// //1.3
// Mock.mock(/\/sys\/role\/menu\/app\/list/, role.appList)
// Mock.mock(/\/sys\/role\/menu\/appMenuList/, role.appMenuList)
// Mock.mock(/\/sys\/role\/menu\/saveAppMenuList/, role.saveAppMenuList)
// Mock.mock(/\/sys\/role\/menu\/list/, role.getAppMenuList)
// Mock.mock(/\/sys\/role\/menu\/saveMenuList/, role.saveMenuList)
// Mock.mock(/\/sys\/role\/menu\/cancelMenuList/, role.cancelMenuList)
// Mock.mock(/\/sys\/role\/user\/page/, role.userList)
// Mock.mock(/\/sys\/role\/auth\/page/, role.authList)
// Mock.mock(/\/sys\/role\/auth\/list/, role.authTree)
// Mock.mock(/\/sys\/role\/auth\/save/, role.saveAuth)
// Mock.mock(/\/sys\/role\/log\/list/, role.roleLogList)

// 假期日历
// Mock.mock(/\/test\/calendar\/list/, calendar.getCalendarList)
// Mock.mock(/\/management\/scope\/tree/, calendar.getScopeTree)

// 排班

// Mock.mock(/\/kq\/archive\/workTime\/rules/, arrange.getWorkTimeList)
// Mock.mock(/\/kq\/archive\/page/, arrange.getArchiveList)
// Mock.mock(/\/kq\/archive\/ignore/, arrange.deleteUser)
// Mock.mock(/\/kq\/plan\/list/, arrange.getPlanList)
// Mock.mock(/\/kq\/plan\/save/, arrange.savePlan)
// Mock.mock(/\/kq\/plan\/statuslist/, arrange.getPlanStatusList)
// Mock.mock(/\/kq\/plan\/userlist/, arrange.getPlanUserList)
// Mock.mock(/\/kq\/plan\/userstatuslist/, arrange.getPlanUserStatusList)

// 管理人员
// Mock.mock(/\/kq\/archive\/employee\/currentOfferMonth/, arrange.getEmployeeEntry)
// Mock.mock(/\/kq\/archive\/employee\/currentRemoveMonth/, arrange.getEmployeeLeave)
// Mock.mock(/\/kq\/archive\/employee\/allNoAdd/, arrange.getEmployeeNot)

// 考勤汇总
Mock.mock(/\/kq\/employee\/serchInof/, attendance.getSearchInfo)
Mock.mock(/\/kq\/managementscope\/child\/tree/, attendance.getChildrenTree)

export default Mock
