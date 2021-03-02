import store from '@/store'

/**
 * 菜单按钮鉴权
 * @param permission  按钮menuIdd ,详见文档
 * @returns {boolean}
 */

export function hasBtnPermission(permission) {
  if (!permission) return true
  const myBtns = store.getters.getButtons
  return myBtns.includes(permission)
}
