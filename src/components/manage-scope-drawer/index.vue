<template>
  <a-drawer
    :title="title+'管理范围'"
    :width="720"
    :visible.sync="visible"
    :body-style="{ paddingBottom: '80px' }"
    @close="onClose"
  >
    <div class="scope-divider-box">
      <a-divider type="vertical" 
        class="scope-divider"/>
      <span class="scope-divider-title">基础信息</span>
    </div>
    <a-form :form="form"
      v-bind="formItemLayout"
      layout="horizontal">
      <a-form-item label="上级管理范围">
        <span>{{info.pname}}</span>
      </a-form-item>
      <a-form-item
        :colon="false"
        label="管理范围编码"
      >
        <a-input v-decorator="['scopeCode', {rules: [{ required: true, message: '请输入管理范围编码' }],
          initialValue: info.code},]" 
          placeholder="请输入管理编码"/>
      </a-form-item>
      <a-form-item
        :colon="false"
        label="管理范围名称"
      >
        <a-input v-decorator="['scopeName', {rules: [{ required: true, message: '请输入管理范围名称' }],
          initialValue: info.name},]" 
          placeholder="请输入管理范围"/>
      </a-form-item>
      <a-form-item
        :colon="false"
        label="状态"
        >
        <a-switch
          v-decorator="['status', {initialValue: info.status === 1 ? true : false,
          valuePropName: 'checked'}]"/>
      </a-form-item>
      <a-form-item 
        :colon="false"
        label="说明">
        <a-textarea
          v-decorator="[
            'desc',
            {initialValue: info.desc}
          ]"
          :rows="4"
          placeholder="请输入"
          :maxLength="255"
          allowClear
        />
      </a-form-item>
      <slot name="gmtCreateEmplid" :info="info"></slot>
      <slot name="gmtCreate" :info="info"></slot>
      <slot name="gmtModifiedEmplid" :info="info"></slot>
      <slot name="gmtModified" :info="info"></slot>
    </a-form>
    <div
      :style="{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
        zIndex: 1,
      }"
    >
      <a-button :style="{ marginRight: '8px' }" @click="onClose">
        取消
      </a-button>
      <a-button type="primary" @click="handleSave">
        保存
      </a-button>
    </div>
  </a-drawer>
</template>
<script>
import _ from 'lodash'
import {managementCreate} from '@/api/auth-management'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 }
      },
      title: '新增'
    };
  },
  watch: {
    'info.pid': function(newVal, oldVal) {
      this.title = '编辑'
    },
    'info.id': function(newVal, oldVal) {
      this.form.resetFields()
    },
  },
  methods: {
    onClose() {
      this.$emit('update:visible', false)
      this.form.resetFields()
    },
    handleSave: _.debounce(function() {
      this.form.validateFields((error, values) => {
        if(error) {
          return false
        }
        let url = ''
        let pid = null
        if (this.info.hasOwnProperty('pid')) {
          url = `update/${this.info.id}`
          pid = this.info.pid
        } else {
          url = 'create'
          pid = this.info.id
        }
        const paramData = {
          code: this.form.getFieldsValue().scopeCode,
          name: this.form.getFieldsValue().scopeName,
          desc: this.form.getFieldsValue().desc,
          pid: pid,
          status: this.form.getFieldsValue().status ? 1 : 0
        }
        managementCreate(url, paramData).then(res => {
          if(res.data.code === 200) {
            this.$message.success(res.data.message, 1, function() {
              this.$emit('update:visible', false)
              this.$emit('on-save')
              this.form.resetFields()
            }.bind(this))
          } else {
            this.$message.error(res.data.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
      })
    }, 1000, {
      'leading': true,
      'trailing': false
    }),
    onChange(checked) {
      this.checked = checked
    },
  },
};
</script>
<style lang="less" scoped>
  .scope-divider-box {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .scope-divider {
      background: rgba(0, 0, 0, 0.8);
      height: 14px;
      top: 0;
    }
    .scope-divider-title {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.8);
      line-height: 14px;
    }
  }
  
</style>