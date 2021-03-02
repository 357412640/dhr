<template>
  <div>
    <h3>antd 引入方式</h3>
    <div>
      <p>1、全局注册，相关引入在main.js中</p>
      <a-button type="primary">全局按钮</a-button>
    </div>

    <div>
      <span>2、当前页面注册 </span>
      <p>
        import { DatePicker } from 'ant-design-vue'
      </p>
      <p>
        components: {
          ADatePicker: DatePicker
        }
      </p>
      <a-date-picker placeholder="局部按钮" />
    </div>

  </div>
</template>

<script>
  import { DatePicker } from 'ant-design-vue'
  export default {
    name: "iframe2",
    components: {
      ADatePicker: DatePicker
    }
  }
</script>
