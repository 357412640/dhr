// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import installPlugin from '@/plugin'
import 'iview/dist/styles/iview.css'
import './index.less'
import '@/assets/icons/iconfont.css'
import '@/assets/common-style/common-style.less'
import { Table, Modal, message, Icon, Switch, Drawer, Input, Button, Timeline, Pagination, Affix, Popconfirm, Collapse, Tooltip, Empty, Spin, Radio, DatePicker, Popover, Tabs, Select,
  TreeSelect, Tree, Form, Row, Divider, Col, PageHeader, Descriptions, Checkbox, ConfigProvider, TimePicker } from 'ant-design-vue' //引入组件，但不用引入样式
Vue.use(Table)
Vue.use(Modal)
Vue.use(Icon)
Vue.use(Switch)
Vue.use(Drawer)
Vue.use(Input)
Vue.use(Button)
Vue.use(Timeline)
Vue.use(Pagination)
Vue.use(Affix)
Vue.use(Popconfirm)
Vue.use(Collapse)
Vue.use(Tooltip)
Vue.use(Empty)
Vue.use(Spin)
Vue.use(Radio)
Vue.use(DatePicker)
Vue.use(Popover)
Vue.use(Tabs)
Vue.use(Select)
Vue.use(TreeSelect)
Vue.use(Tree) //全局注册
Vue.use(Form)
Vue.use(Row)
Vue.use(Divider)
Vue.use(Col)
Vue.use(PageHeader)
Vue.use(Descriptions)
Vue.use(Checkbox)
Vue.use(ConfigProvider)
Vue.use(TimePicker)
import { hasBtnPermission } from '@/libs/button-permission'

Vue.prototype.$info = Modal.info
Vue.prototype.$success = Modal.success
Vue.prototype.$error = Modal.error
Vue.prototype.$warning = Modal.warning
Vue.prototype.$confirm = Modal.confirm
Vue.prototype.$message = message
// Vue.prototype.$_ = _
// 或在页面中局部引用，详见@src/view/test/iframe/iframe2.vue
// 实际打包时应该不引入mock
/* eslint-disable */
if (process.env.NODE_ENV === 'development') {
  require('@/mock')
}

// console.log(process.env)

// 按钮鉴权
Vue.prototype.hasPerm = hasBtnPermission

Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
})
/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
/**
 * 注册指令
 */
importDirective(Vue)

// @description 全局引入echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
})
