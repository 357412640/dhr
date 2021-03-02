<template>
  <a-drawer
    :title="title+'班次'"
    :width="720"
    :visible.sync="visible"
    :body-style="{ paddingBottom: '80px' }"
    @close="onClose"
  >
    <a-form :form="form"
      v-bind="formItemLayout"
      layout="horizontal">
      <div class="scope-divider-box">
        <a-divider type="vertical" 
          class="scope-divider"/>
        <span class="scope-divider-title">基础信息</span>
      </div>
      <a-form-item label="班次名称"
        :colon="false">
        <a-input v-decorator="['workName', {rules: [{ required: true, message: '请输入班次名称' }],
          initialValue: info.workName},]" 
          placeholder="请输入班次名称"/>
      </a-form-item>
      <a-form-item
        :colon="false"
        label="工时制度"
      >
        <a-select v-decorator="['workRule', {rules: [{ message: '请选择' }],
          initialValue: info.workRule ? String(info.workRule) : '1'},]" 
          placeholder="请选择">
          <a-select-option value="1">
            标准工时
          </a-select-option>
          <a-select-option value="2">
            综合工时
          </a-select-option>
          <a-select-option value="3">
            不定时工时
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        :colon="true"
        label="适用范围"
      >
        <span style="margin-right: 10px;">
          {{applyRange === 1 ? '全员' : '自定义'}}
        </span>
        <span class="range-edit"
          @click="handleRange">修改</span>
      </a-form-item>
      <a-form-item
        :colon="false"
        label="状态"
        >
        <a-switch
          v-decorator="['status', {initialValue: info.status === 1 ? true : false,
          valuePropName: 'checked'}]"/>
      </a-form-item>
      <div class="scope-divider-box">
        <a-divider type="vertical" 
          class="scope-divider"/>
        <span class="scope-divider-title">打卡时段</span>
      </div>
      <a-form-item style="margin-bottom: 0;"
        class="form-item-clock">
        <a-checkbox
          v-decorator="['elasticSignIn', {initialValue: info.elasticSignIn === 1 ? true : false,
          valuePropName: 'checked'}]" 
          style="margin-left: 15px;">
          弹性打卡
        </a-checkbox>
      </a-form-item>
      <a-form-item style="margin-bottom: 0;"
        class="form-item-clock">
        <a-checkbox
          v-decorator="['multipleCommutingHours', {initialValue: info.multipleCommutingHours === 1 ? true : false,
          valuePropName: 'checked'}]"
          style="margin-left: 15px;">
          多个上下班时间
        </a-checkbox>
      </a-form-item>
      <a-radio checked
        style="margin-left: 15px; line-height: 32px;">一 天打两次卡</a-radio>
      <div style="margin-top: 10px;"
        v-show="form.getFieldsValue().multipleCommutingHours"
        class="scope-divider-box">
        <a-divider type="vertical" 
          class="scope-divider"/>
        <span class="scope-divider-title">上下班时间一</span>
      </div>
      <div class="time-box">
        <a-row type="flex"
          style="height: 50px; background: #f5f5f5;"
          align="middle">
          <a-col :flex="1"
            class="time-col">上下班时间</a-col>
          <a-col :flex="1"
            class="time-col">打卡范围设置</a-col>
        </a-row>
        <a-row type="flex"
          style="height: 65px; border-bottom: 1px solid  #e7e7e7;"
          align="middle">
          <a-col :flex="1"
            class="time-col">
            <span style="margin-right: 10px;">上班</span>
            <a-form-item style="margin-bottom: 0;">
              <a-time-picker
                v-decorator="['workStart', {rules: [{ required: true, message: '请选择时间' }],
                initialValue: useOptionChain(info)['itemsList?.0?.workStart'] || null }]"
                placeholder="请选择时间"
                format="HH:mm"
                valueFormat="HH:mm"/>
            </a-form-item>
            <template v-if="form.getFieldsValue().elasticSignIn">
              <span style="margin-left: 10px; margin-right: 10px;">至</span>
              <a-form-item style="margin-bottom: 0;">
                <a-time-picker
                  v-decorator="['workEnd', {rules: [{ required: true, message: '请选择时间' }],
                  initialValue: useOptionChain(info)['itemsList?.0?.workEnd'] || null }]"
                  placeholder="请选择时间"
                  format="HH:mm"
                  valueFormat="HH:mm"/>
              </a-form-item>
            </template>
          </a-col>
          <a-col :flex="1"
            class="time-col">
            <a-form-item style="margin-bottom: 0;">
              <a-time-picker
                v-decorator="['signInStart', {rules: [{ required: true, message: '请选择时间' }],
                initialValue: useOptionChain(info)['itemsList?.0?.signInStart'] || null }]"
                placeholder="请选择时间" 
                format="HH:mm"
                valueFormat="HH:mm"/>
            </a-form-item>
            <span style="margin-left: 10px; margin-right: 10px;">至</span>
            <a-form-item style="margin-bottom: 0;">
              <a-time-picker
                v-decorator="['signInEnd', {rules: [{ required: true, message: '请选择时间' }],
                initialValue: useOptionChain(info)['itemsList?.0?.signInEnd'] || null }]"
                placeholder="请选择时间"
                format="HH:mm"
                valueFormat="HH:mm"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row type="flex"
          style="height:65px; border-bottom: 1px solid  #e7e7e7;"
          align="middle">
          <a-col :flex="1"
            class="time-col">
            <span style="margin-right: 10px;">下班</span>
            <a-form-item style="margin-bottom: 0;">
              <a-time-picker
                v-decorator="['workOffStart', {rules: [{ required: true, message: '请选择时间' }],
                initialValue: useOptionChain(info)['itemsList?.0?.workOffStart'] || null }]"
                placeholder="请选择时间" 
                format="HH:mm"
                valueFormat="HH:mm"/>
            </a-form-item>
            <template v-if="form.getFieldsValue().elasticSignIn">
              <span style="margin-left: 10px; margin-right: 10px;">至</span>
              <a-form-item style="margin-bottom: 0;">
                <a-time-picker
                  v-decorator="['workOffEnd', {rules: [{ required: true, message: '请选择时间' }],
                  initialValue: useOptionChain(info)['itemsList?.0?.workOffEnd'] || null }]"
                  placeholder="请选择时间"
                  format="HH:mm"
                  valueFormat="HH:mm"/>
              </a-form-item>
            </template>
          </a-col>
          <a-col :flex="1"
            class="time-col">
            <a-form-item style="margin-bottom: 0;">
              <a-time-picker
                v-decorator="['signOffStart', {rules: [{ required: true, message: '请选择时间' }],
                initialValue: useOptionChain(info)['itemsList?.0?.signOffStart'] || null }]"
                placeholder="请选择时间"
                format="HH:mm"
                valueFormat="HH:mm"/>
            </a-form-item>
            <span style="margin-left: 10px; margin-right: 10px;">至</span>
            <a-form-item style="margin-bottom: 0;">
              <a-time-picker
                v-decorator="['signOffEnd', {rules: [{ required: true, message: '请选择时间' }],
                initialValue: useOptionChain(info)['itemsList?.0?.signOffEnd'] || null }]"
                placeholder="请选择时间"
                format="HH:mm"
                valueFormat="HH:mm"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item style="margin-bottom: 0;"
          class="form-rest-item">
          <a-checkbox  v-decorator="['restStatus', {initialValue: useOptionChain(info)['itemsList?.0?.restStatus'] === 1 ? true : false,
            valuePropName: 'checked'}]"
            style="margin-left: 15px; line-height: 50px;">
            休息时间
          </a-checkbox>
          <a-row type="flex"
            class="time-arow-rest"
            v-if="form.getFieldsValue().restStatus">
            <a-col :flex="1"
              class="time-rest"
              v-for="(item, index) in restList"
              :key="index">
              <a-form-item style="margin-bottom: 0;">
                <a-time-picker
                  v-decorator="[`restList[${index}['startTime']]`, {rules: [{ required: true, message: '请选择时间' }],
                  initialValue: item.startTime ? item.startTime : null}]"
                  placeholder="请选择时间"
                  format="HH:mm"
                  valueFormat="HH:mm"/>
              </a-form-item>
              <span style="margin-left: 10px; margin-right: 10px;">至</span>
              <a-form-item style="margin-bottom: 0;">
                <a-time-picker
                  v-decorator="[`restList[${index}['endTime']]`, {rules: [{ required: true, message: '请选择时间' }],
                  initialValue: item.endTime ? item.endTime : null}]"
                  placeholder="请选择时间"
                  format="HH:mm"
                  valueFormat="HH:mm"/>
              </a-form-item>
              <a href="javascript: void(0);"
                style="margin-left: 10px;"
                @click="handleAddRest">添加</a>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item
          :colon="false"
          label="适用时间"
          style="margin-bottom: 0; margin-top: 10px;"
          class="suit-time-item"
          v-if="form.getFieldsValue().multipleCommutingHours"
          >
          <a-checkbox-group
            v-decorator="['applyDayList', {initialValue: useOptionChain(info)['itemsList?.0?.applyDayList'] || []}]" 
            style="width: 100%;">
            <a-row :gutter="[0,10]">
              <a-col :span="6" v-for="(item, index) in applyDayList"
                :key="index">
                <a-checkbox :value="item.value">
                  {{item.name}}
                </a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-form-item>
      </div>
      <div style="margin-top: 10px;"
        v-show="form.getFieldsValue().multipleCommutingHours"
        class="scope-divider-box">
        <a-divider type="vertical" 
          class="scope-divider"/>
        <span class="scope-divider-title">上下班时间二</span>
      </div>
      <div class="time-box"
        v-if="form.getFieldsValue().multipleCommutingHours">
        <a-row type="flex"
          style="height: 50px; background: #f5f5f5;"
          align="middle">
          <a-col :flex="1"
            class="time-col">上下班时间</a-col>
          <a-col :flex="1"
            class="time-col">打卡范围设置</a-col>
        </a-row>
        <a-row type="flex"
          style="height: 65px; border-bottom: 1px solid  #e7e7e7;"
          align="middle">
          <a-col :flex="1"
            class="time-col">
            <span style="margin-right: 10px;">上班</span>
            <a-form-item style="margin-bottom: 0;">
              <a-time-picker
                v-decorator="['workStart1', {rules: [{ required: true, message: '请选择时间' }],
                initialValue: useOptionChain(info)['itemsList?.1?.workStart'] || null }]"
                placeholder="请选择时间"
                format="HH:mm"
                valueFormat="HH:mm"/>
            </a-form-item>
            <template v-if="form.getFieldsValue().elasticSignIn">
              <span style="margin-left: 10px; margin-right: 10px;">至</span>
              <a-form-item style="margin-bottom: 0;">
                <a-time-picker
                  v-decorator="['workEnd1', {rules: [{ required: true, message: '请选择时间' }],
                  initialValue: useOptionChain(info)['itemsList?.1?.workEnd'] || null }]"
                  placeholder="请选择时间"
                  format="HH:mm"
                  valueFormat="HH:mm"/>
              </a-form-item>
            </template>
          </a-col>
          <a-col :flex="1"
            class="time-col">
            <a-form-item style="margin-bottom: 0;">
              <a-time-picker
                v-decorator="['signInStart1', {rules: [{ required: true, message: '请选择时间' }],
                initialValue: useOptionChain(info)['itemsList?.1?.signInStart'] || null }]"
                placeholder="请选择时间" 
                format="HH:mm"
                valueFormat="HH:mm"/>
            </a-form-item>
            <span style="margin-left: 10px; margin-right: 10px;">至</span>
            <a-form-item style="margin-bottom: 0;">
              <a-time-picker
                v-decorator="['signInEnd1', {rules: [{ required: true, message: '请选择时间' }],
                initialValue: useOptionChain(info)['itemsList?.1?.signInEnd'] || null }]"
                placeholder="请选择时间"
                format="HH:mm"
                valueFormat="HH:mm"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row type="flex"
          style="height:65px; border-bottom: 1px solid  #e7e7e7;"
          align="middle">
          <a-col :flex="1"
            class="time-col">
            <span style="margin-right: 10px;">下班</span>
            <a-form-item style="margin-bottom: 0;">
              <a-time-picker
                v-decorator="['workOffStart1', {rules: [{ required: true, message: '请选择时间' }],
                initialValue: useOptionChain(info)['itemsList?.1?.workOffStart'] || null }]"
                placeholder="请选择时间" 
                format="HH:mm"
                valueFormat="HH:mm"/>
            </a-form-item>
            <template v-if="form.getFieldsValue().elasticSignIn">
              <span style="margin-left: 10px; margin-right: 10px;">至</span>
              <a-form-item style="margin-bottom: 0;">
                <a-time-picker
                  v-decorator="['workOffEnd1', {rules: [{ required: true, message: '请选择时间' }],
                  initialValue: useOptionChain(info)['itemsList?.1?.workOffEnd'] || null }]"
                  placeholder="请选择时间"
                  format="HH:mm"
                  valueFormat="HH:mm"/>
              </a-form-item>
            </template>
          </a-col>
          <a-col :flex="1"
            class="time-col">
            <a-form-item style="margin-bottom: 0;">
              <a-time-picker
                v-decorator="['signOffStart1', {rules: [{ required: true, message: '请选择时间' }],
                initialValue: useOptionChain(info)['itemsList?.1?.signOffStart'] || null }]"
                placeholder="请选择时间"
                format="HH:mm"
                valueFormat="HH:mm"/>
            </a-form-item>
            <span style="margin-left: 10px; margin-right: 10px;">至</span>
            <a-form-item style="margin-bottom: 0;">
              <a-time-picker
                v-decorator="['signOffEnd1', {rules: [{ required: true, message: '请选择时间' }],
                initialValue: useOptionChain(info)['itemsList?.1?.signOffEnd'] || null }]"
                placeholder="请选择时间"
                format="HH:mm"
                valueFormat="HH:mm"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item style="margin-bottom: 0;"
          class="form-rest-item">
          <a-checkbox  v-decorator="['restStatus1', {initialValue: useOptionChain(info)['itemsList?.1?.restStatus'] === 1 ? true : false,
            valuePropName: 'checked'}]"
            style="margin-left: 15px; line-height: 50px;">
            休息时间
          </a-checkbox>
          <a-row type="flex"
            class="time-arow-rest"
            v-if="form.getFieldsValue().restStatus1">
            <a-col :flex="1"
              class="time-rest"
              v-for="(item, index) in restList1"
              :key="index">
              <a-form-item style="margin-bottom: 0;">
                <a-time-picker
                  v-decorator="[`restList1[${index}['startTime']]`, {rules: [{ required: true, message: '请选择时间' }],
                  initialValue: item.startTime ? item.startTime : null}]"
                  placeholder="请选择时间"
                  format="HH:mm"
                  valueFormat="HH:mm"/>
              </a-form-item>
              <span style="margin-left: 10px; margin-right: 10px;">至</span>
              <a-form-item style="margin-bottom: 0;">
                <a-time-picker
                  v-decorator="[`restList1[${index}['endTime']]`, {rules: [{ required: true, message: '请选择时间' }],
                  initialValue: item.endTime ? item.endTime : null}]"
                  placeholder="请选择时间"
                  format="HH:mm"
                  valueFormat="HH:mm"/>
              </a-form-item>
              <a href="javascript: void(0);"
                style="margin-left: 10px;"
                @click="handleAddRest1">添加</a>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item
          :colon="false"
          label="适用时间"
          style="margin-bottom: 0; margin-top: 10px;"
          class="suit-time-item"
          v-if="form.getFieldsValue().multipleCommutingHours"
          >
          <a-checkbox-group
            v-decorator="['applyDayList1', {initialValue: useOptionChain(info)['itemsList?.1?.applyDayList'] || []}]" 
            style="width: 100%;">
            <a-row :gutter="[0,10]">
              <a-col :span="6" v-for="(item, index) in applyDayList"
                :key="index">
                <a-checkbox :value="item.value">
                  {{item.name}}
                </a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-form-item>
      </div>
      <div style="margin-top: 10px;"
        class="scope-divider-box">
        <a-divider type="vertical" 
          class="scope-divider"/>
        <span class="scope-divider-title">更多设置</span>
      </div>
      <a-row type="flex"
        align="middle">
        <a-form-item style="margin-bottom: 0; width: 100%;"
          class="form-desc-item">
          <a-checkbox
            v-decorator="['workOffDelay', {initialValue: info.workOffDelay === 1 ? true : false,
            valuePropName: 'checked'}]"
            style="margin-left: 15px;">
            下班晚走，第二天可晚到
          </a-checkbox>
          <div class="desc"
            v-show="form.getFieldsValue().workOffDelay">
            工作日延时至22:00（含）~次日0:00(不含），次工作日可于10:00到岗；<br/>
            工作日延时至00:00（含）~次日2:00(不含），次工作日可于11:00到岗；<br/>
            工作日延时至2:00（含）以后下班的，次工作日可于13:00到岗；
          </div>
        </a-form-item>
      </a-row>
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
    <rangeEdit :rangeVisible.sync="rangeVisible"
      :applyRange.sync="applyRange"
      :applyList="applyList"
      @on-save="handleRangeSave"/>
  </a-drawer>
</template>
<script>
import _ from 'lodash'
import {worktimeInsert, worktimeDetail} from '@/api/worktime.js'
import rangeEdit from './range-edit.vue'
import useOptionChain from '@/libs/util.js'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 }
      },
      title: '新增',
      rangeVisible: false,
      restList: [{
        startTime: null,
        endTime: null
      }],
      restList1: [{
        startTime: null,
        endTime: null
      }],
      info: {
        status: 1
      },
      applyRange: 1,
      applyList: [],
      applyDayList: [{
        value: 1,
        name: '周一'
      }, {
        value: 2,
        name: '周二'
      }, {
        value: 3,
        name: '周三'
      }, {
        value: 4,
        name: '周四'
      }, {
        value: 5,
        name: '周五'
      }, {
        value: 6,
        name: '周六'
      }, {
        value: 7,
        name: '周日'
      }, {
        value: 0,
        name: '法定节假日'
      }]
    }
  },
  components: {
    rangeEdit
  },
  created() {
    
  },
  watch: {
    'id': function(newVal, oldVal) {
      this.$set(this, 'info', {})
      this.form.resetFields()
      if(newVal) {
        this.title = '编辑'
        this.fetchDetail()
      } else {
        this.title = '新增'
        this.$set(this, 'info', {
          status: 1
        })
        this.form.getFieldDecorator('multipleCommutingHours', {
          initialValue: false
        })
        this.form.getFieldDecorator('elasticSignIn', {
          initialValue: false
        })
        this.form.getFieldDecorator('restStatus', {
          initialValue: false
        })
        this.form.getFieldDecorator('restStatus1', {
          initialValue: false
        })
        this.form.getFieldDecorator('workOffDelay', {
          initialValue: false
        })
      }
    },
    visible: function(newVal, oldVal) {
      if(newVal) {
        if(this.id) {
          this.fetchDetail()
        }
      }
    }
  },
  methods: {
    onClose() {
      this.$emit('update:visible', false)
      this.form.resetFields()
    },
    handleSave: _.debounce(function() {
      this.form.validateFields((error, values) => {
        // console.log('this.form.getFieldsValue()', this.form.getFieldsValue())
        if(error) {
          return false
        }
        let url = ''
        if (this.id) {
          url = `update`
        } else {
          url = 'insert'
        }
        const paramData = {
          id: this.id ? this.id : undefined,
          workName: this.form.getFieldsValue().workName,
          workRule: Number(this.form.getFieldsValue().workRule),
          elasticSignIn: this.form.getFieldsValue().elasticSignIn ? 1 : 2,
          multipleCommutingHours: this.form.getFieldsValue().multipleCommutingHours ? 1 : 2,
          workOffDelay: this.form.getFieldsValue().workOffDelay ? 1 : 2,
          applyRange: this.applyRange,
          applyList: this.applyList,
          status: this.form.getFieldsValue().status ? 1 : 2,
          itemList: [{
            workStart: this.form.getFieldsValue().workStart,
            workEnd: this.form.getFieldsValue().workEnd,
            workOffStart: this.form.getFieldsValue().workOffStart,
            workOffEnd: this.form.getFieldsValue().workOffEnd,
            signInStart: this.form.getFieldsValue().signInStart,
            signInEnd: this.form.getFieldsValue().signInEnd,
            signOffStart: this.form.getFieldsValue().signOffStart,
            signOffEnd: this.form.getFieldsValue().signOffEnd,
            restStatus: this.form.getFieldsValue().restStatus ? 1 : 2,
            restList: this.form.getFieldsValue().restList,
            applyDayList: this.form.getFieldsValue().applyDayList
          }]
        }
        if(this.form.getFieldsValue().multipleCommutingHours) {
          paramData['itemList'][1] = {
            workStart: this.form.getFieldsValue().workStart1,
            workEnd: this.form.getFieldsValue().workEnd1,
            workOffStart: this.form.getFieldsValue().workOffStart1,
            workOffEnd: this.form.getFieldsValue().workOffEnd1,
            signInStart: this.form.getFieldsValue().signInStart1,
            signInEnd: this.form.getFieldsValue().signInEnd1,
            signOffStart: this.form.getFieldsValue().signOffStart1,
            signOffEnd: this.form.getFieldsValue().signOffEnd1,
            restStatus: this.form.getFieldsValue().restStatus1 ? 1 : 2,
            restList: this.form.getFieldsValue().restList1,
            applyDayList: this.form.getFieldsValue().applyDayList1
          }
        } else {
          paramData['itemList'].length = 1
        }
        worktimeInsert(url, paramData).then(res => {
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
    handleRange() {
      this.$set(this, 'rangeVisible', true)
    },
    handleAddRest: _.debounce(function() {
      this.restList.push({
        startTime: null,
        endTime: null
      })
    }, 1000, {
      'leading': true,
      'trailing': false
    }),
    handleAddRest1: _.debounce(function() {
      this.restList1.push({
        startTime: null,
        endTime: null
      })
    }, 1000, {
      'leading': true,
      'trailing': false
    }),
    handleRangeSave(e) {
      this.applyList = e
    },
    useOptionChain,
    fetchDetail() {
      worktimeDetail(this.id).then(res => {
        if(res.data.code === 200) {
          this.info = res.data.data
          this.applyRange = this.info.applyRange
          this.applyList = this.info.applyList || []
          this.restList = this.info?.itemsList?.[0]?.restList.length > 0 ? this.info?.itemsList?.[0]?.restList : [{
            startTime: null,
            endTime: null
          }]
          this.restList1 = this.info?.itemsList?.[1]?.restList.length > 0 ? this.info?.itemsList?.[1]?.restList : [{
            startTime: null,
            endTime: null
          }]
          this.form.getFieldDecorator('multipleCommutingHours', {
            initialValue: this.info.multipleCommutingHours === 1 ? true : false
          })
          this.form.getFieldDecorator('elasticSignIn', {
            initialValue: this.info.elasticSignIn === 1 ? true : false
          })
          this.form.getFieldDecorator('restStatus', {
            initialValue: this.info?.itemsList?.[0]?.restStatus === 1 ? true : false
          })
          this.form.getFieldDecorator('restStatus1', {
            initialValue: this.info?.itemsList?.[1]?.restStatus === 1 ? true : false
          })
          this.form.getFieldDecorator('workOffDelay', {
            initialValue: this.info.workOffDelay === 1 ? true : false
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
    }
  },
}
</script>
<style lang="less">
  .form-item-clock .ant-form-item-control {
    line-height: 30px;
  }
  .suit-time-item .ant-form-item-label {
    line-height: 1.5;
  }
  .suit-time-item .ant-form-item-control-wrapper {
    width: 425px;
  }
  .form-rest-item .ant-form-item-control-wrapper {
    width: 100%;
  }
  .form-rest-item .ant-form-item-children{
    display: flex;
  }
  .form-desc-item .ant-form-item-control-wrapper {
    width: 100%;
  }
</style>
<style lang="less" scoped>
  .range-edit {
    color: @primary-color;
    cursor: pointer;
  }
  .time-box {
    margin-top: 10px;
  }
  .time-col {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .time-arow-rest {
    flex-direction: column;
  }
  .time-rest {
    display: flex;
    height: 50px;
    align-items: center;
  }
  .desc {
    padding-left: 42px;
    line-height: 28px;
  }
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