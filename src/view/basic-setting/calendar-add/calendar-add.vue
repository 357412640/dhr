<template>
<div class="calendar-add">
  <common-header :title="this.$route.query.calendarName" :back="true"></common-header>
  <!-- <div class="title-box">
    <Button type="text" class="left" @click="toPage('/view/basic_setting/calendar/')"><Icon type="ios-arrow-back" size="20" /> {{this.$route.query.calendarName}}</Button>
  </div> -->
  <div style="margin:20px 0px 10px 18px">
      <Row>
        <Col span="4">
          状态： <Badge v-if="this.$route.query.status == 1" status="success" text="启用" />
                <Badge v-else status="warning" text="停用" />
        </Col>
        <Col span="6">
          创建时间：{{this.$route.query.createTime}}
        </Col>
        <Col span="6">
          适用范围： <span v-if="this.$route.query.applyRange == 1">全员</span> <span v-else>自定义</span>
        </Col>
      </Row>
  </div>

  <Tabs value="name1">
      <TabPane label="假期定义" name="name1"></TabPane>
  </Tabs>

  <div>
    <Table :loading="loading" :columns="model_columns" :data="model_data" style="margin-top: 10px" :no-data-text=noData></Table>
  </div>
  <Button type="dashed" long icon="md-add" style="margin-top:10px;color:#fff;border-color:#2b85e4;background:#5cadff;margin-bottom:40px" @click="editVac(0)">新增假期</Button>
<!-- :styles="styles" -->
  <Drawer title="编辑假期" v-model="value3" width=420 :mask-closable="false" style="margin-bottom:30px">
    <Form :model="formData" :label-width="60">
        <Row :gutter=32>
            <Col span="16">
                <FormItem label="假期名称">
                    <Input v-model="formData.vacationName" placeholder="请输入假期名称" />
                </FormItem>
            </Col>
        </Row>
        <Row :gutter=32>
            <Col span="24">
                <FormItem label="假期类型">
                  <RadioGroup v-model="formData.vacationType">
                      <Radio label="1">法定节假日</Radio>
                      <Radio label="2">福利假</Radio>
                  </RadioGroup>
                </FormItem>
            </Col>
        </Row>
        <Row :gutter=32>
            <Col span="24">
                <FormItem label="假期时间">
                  <Row>
                    <Col span="11">
                      <DatePicker @on-change="getStartTime" :value="formData.startTime" format="yyyy-MM-dd HH:mm:ss" type="date" show-week-numbers placeholder="开始时间" style="width: 130px"></DatePicker>
                    </Col>
                    <Col span="2">-</Col>
                    <Col span="11">
                      <DatePicker @on-change="getEndTime" :value="formData.endTime" format="yyyy-MM-dd HH:mm:ss" type="date" show-week-numbers placement="bottom-end" placeholder="结束时间" style="width: 130px"></DatePicker>
                    </Col>
                  </Row>  
                </FormItem>
            </Col>
        </Row>
        <FormItem label="调休上班">
          <Row>
          <Col span="11" v-for="(item, key) in workTimes">
            <DatePicker @on-change="getWorkTime($event, key)" :value="item.value" format="yyyy-MM-dd HH:mm:ss" type="date" show-week-numbers placeholder="请选择调休日期" style="width: 130px"></DatePicker>
          </Col>
          <Col span="6">
            <u style="margin-left: 10px;color:#2d8cf0;cursor:pointer" @click="addWorkTime">添加</u>
            <u style="margin-left: 10px;color:#2d8cf0;cursor:pointer" @click="delWorkTime">删除</u>
          </Col>
          </Row>
        </FormItem>

        <div style="padding-bottom:20px;">
          <Row>
            <Col span="24" style="font-weight: 600;font-size: 16px;padding-bottom:10px">
              <span style="width:90px;display:inline-block">{{ymd.year}}年{{ymd.month}}月</span>
              <Icon type="ios-arrow-back" @click="preMonth" style="cursor:pointer;padding-right:6px;padding-left:10px;font-size:18px" />
              <Icon type="ios-arrow-forward" @click="nextMonth" style="cursor:pointer;font-size:18px" />
            </Col>
          </Row>
          <Row type="flex" justify="center" gutter=3 style="background: rgba(255, 55, 55, 0.06);font-size:16px;text-align:center;height:34px;line-height:34px;font-weight:600">
            <Col span="3">一</Col>
            <Col span="3">二</Col>
            <Col span="3">三</Col>
            <Col span="3">四</Col>
            <Col span="3">五</Col>
            <Col span="3">六</Col>
            <Col span="3">日</Col>
          </Row>
          <Row type="flex" justify="center" v-for="(row, i) in calDate" gutter=3 class="cal-row">
            <Col v-for="(col, j) in row" span="3"><span :class="col.class">{{col.num}}</span></Col>
          </Row>
          <Row style="margin-top:6px">
            <Col span="6">
              <i style="width:14px;height:14px;border-radius:50%;background: rgba(255, 55, 55, 0.2);display: inline-block;"></i>
              <span style="padding-left:10px;position:relative;bottom:2px">法定假日</span>
            </Col>
            <Col span="6">
              <i style="width:14px;height:14px;border-radius:50%;background: rgba(74, 144, 226, 0.3);;display: inline-block;"></i>
              <span style="padding-left:10px;position:relative;bottom:2px">法定调班</span>
            </Col>
            <Col span="6">
              <i style="width:14px;height:14px;border-radius:50%;background: rgba(245, 166, 35, 0.47);display: inline-block;"></i>
              <span style="padding-left:10px;position:relative;bottom:2px">福利假日</span>
            </Col>
          </Row>
        </div>

        <Row :gutter=32>
          <Col span="24">
            <FormItem label="三薪日期">
              <Row>
                <Col span="11">
                  <DatePicker @on-change="getMoneyStartTime" :value="formData.moneyStartTime" format="yyyy-MM-dd HH:mm:ss" type="date" show-week-numbers placeholder="请选择日期" style="width: 130px"></DatePicker>
                </Col>
                <Col span="2">-</Col>
                <Col span="11">
                  <DatePicker @on-change="getMoneyEndTime" :value="formData.moneyEndTime" format="yyyy-MM-dd HH:mm:ss" type="date" show-week-numbers placement="bottom-end" placeholder="请选择日期" style="width: 130px"></DatePicker>
                </Col>
              </Row>  
            </FormItem>
          </Col>
        </Row>
    </Form>
    <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="value3 = false">取消</Button>
        <Button type="primary" @click="saveVac" :loading="saveLoading">确定</Button>
    </div>
  </Drawer>
</div>
</template>

<script>
import './index.less'
import { getVacationList, getVacationDetail, saveVac, updateVac } from '@/api/calendar-data'
import { resetTime5, deepClone, noData } from '@/libs/util'
import CommonHeader from '@/components/header'
export default {
  name: 'model-management',
  components: {
    CommonHeader,
  },
  data () {
    return {
      saveLoading: false,
      workTimes: [
        {}
      ],
      calDate: [],
      loading: false,
      model_columns: [
        {
          title: '假期名称',
          key: 'vacationName',
          align: 'center',
          tooltip: true,
          width: 140
        },
        {
          title: '假期时间',
          key: 'vacationRange',
          align: 'center',
          tooltip: true,
          minWidth: 100,
          render: (h, params) => {
            return h('div', [
              h('span', params.row.startTime + '-' + params.row.endTime),
            ])
          }
        },
        {
          title: '调休上班时间',
          key: 'workTime',
          align: 'center',
          tooltip: true,
          width: 240
        },
        {
          title: '放假天数',
          key: 'countDay',
          align: 'center',
          tooltip: true,
          width: 100
        },
        {
          title: '假期类型',
          key: 'vacationType',
          align: 'center',
          tooltip: true,
          width: 120,
          render: (h, params) => {
            let vacationTypeText = '法定假'
            if (params.row.vacationType == 2) {
              vacationTypeText = '福利假'
            }
            return h('div', [
              h('span', vacationTypeText),
            ])
          }
        },
        {
          title: '假期说明',
          key: 'vacationDesc',
          align: 'center',
          tooltip: true,
          width: 120
        },
        {
          title: '操作',
          key: 'operate',
          align: 'center',
          width: 140,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.editVac(Number(params.row.id))
                  }
                }
              }, '编辑'),
            ])
          }
        }
      ],
      model_data: [],
      pageInfo: {
      },
      popModal: {
        popShow: false,
        popLoading: true,
        popErr: ''
      },
      deletePop: {
        popShow: false,
        popLoading: true,
        model_name: ''
      },
      deleteModelData: {},
      modelCustom: {
      },
      areaList: {},
      branchList: [],
      storefrontList: [],
      itemModelList: {},
      search: {
        area_id: 0,
        branch_id: 0,
        storefront_id: 0,
        order_no: ''
      },
      value3: false,
      styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
      },
      formData: {
        calendarId: Number(this.$route.query.id),
        vacationType: '1'
      },
      ymd: {
        year: 0,
        month: 0,
        day: 0
      },
      noData: noData
    }
  },
  methods: {
    // 搜索按钮
    handleSubmit () {
      this.changePage(1)
    },

    changePage (page) {
      this.loading = true
      this.pageInfo.current = page
      let data = {
        calendarId: Number(this.$route.query.id)
      }
      getVacationList(data).then(res => {
        const data = res.data
        // console.log(data)
        this.loading = false
        if (data.code === 200) {
          this.model_data = data.data
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })
    },
    toPage (path) {
      this.$router.push(path)
    },

    saveVac () {
      if (this.saveLoading) {
        return
      }
      this.saveLoading = true

      let data = this.formData

      let workTimes = this.workTimes
      if (workTimes.length > 0) {
        let workTime = ''
        for (let i = 0; i < workTimes.length; i++) {
          if (workTime == '') {
            workTime = workTimes[i]['value']
          } else {
            workTime += ',' + workTimes[i]['value']
          }
        }
        data.workTime = workTime
      } 

      if (data.id) { // 修改
        updateVac(data).then(res => {
          let data = res.data
          console.log(res)
          if (data.code === 200) {
            this.$Message.success('保存成功')
            this.value3 = false
            this.changePage()
          } else {
            this.$Message.error('保存失败：' + data.message)
          }
          this.saveLoading = false
        })
      } else { // 新增
        saveVac(data).then(res => {
          let data = res.data
          console.log(res)
          if (data.code === 200) {
            this.$Message.success('创建成功！')
            this.value3 = false
            this.changePage()
          } else {
            this.$Message.error('保存失败：' + data.message)
          }
          this.saveLoading = false
        })
      }
    },
    editVac (id) {
      this.formData = {
        calendarId: Number(this.$route.query.id),
        vacationName: '',
        vacationType: '1',
        startTime: '',
        endTime: '',
        workTime: '',
        moneyStartTime: '',
        moneyEndTime: ''
      }

      if (id) {
        this.workTimes = []
        let data = {
          id: id
        }
        getVacationDetail(data).then(res => {
          let data = res.data
          if (data.code === 200) {
            this.formData = data.data
            this.formData.vacationType =  this.formData.vacationType + ""

            if (this.formData.workTime) {
              let workTimeArr = data.data.workTime.split(",")
              for (let i = 0; i < workTimeArr.length; i++) {
                this.workTimes.push({value: workTimeArr[i]})
              }
            }

            let date = new Date(this.formData.startTime)
            this.ymd.year = date.getFullYear()
            this.ymd.month = date.getMonth() + 1
            this.setCalDate()
          } else {
            this.$Message.error('获取假期定义详情失败：' + data.message)
          }
        })
      } else {
        this.workTimes = [{}]

        let date = new Date()
        this.ymd.year = date.getFullYear()
        this.ymd.month = date.getMonth() + 1
        this.setCalDate()
      }

      this.value3 = true
    },
    addWorkTime () {
      this.workTimes.push({})
    },
    delWorkTime () {
      this.workTimes.pop()
    },
    getStartTime (e) {
      this.formData.startTime = e

      let date = new Date(e)
      this.ymd.year = date.getFullYear()
      this.ymd.month = date.getMonth() + 1
      this.setCalDate()
    },
    getEndTime (e) {
      this.formData.endTime = e
      this.setCalDate()
    },
    getMoneyStartTime (e) {
      this.formData.moneyStartTime = e
    },
    getMoneyEndTime (e) {
      this.formData.moneyEndTime = e
    },
    getWorkTime (e, key) {
      this.workTimes[key]['value'] = e
      this.setCalDate()
    },
    // 上个月
    preMonth () {
      if (this.ymd.month > 1) {
        this.ymd.month--
      } else {
        this.ymd.year--
        this.ymd.month = 12
      }
      this.setCalDate()
    },
    // 下个月
    nextMonth () {
      if (this.ymd.month < 12) {
        this.ymd.month++
      } else {
        this.ymd.year++
        this.ymd.month = 1
      }
      this.setCalDate()
    },
    // 组织日历数据
    setCalDate () {
      let year = this.ymd.year
      let month = this.ymd.month
      let days = this.getMonthDays(year, month)

      // 获得月第一天星期
      let date = new Date(year + "-" + month + "-" + 1)
      let week = date.getDay()
      if (week == 0) {
        week = 7
      }

      let newCalDate = []
      let row = []
      for (let i = 1; i <= days + week - 1; i++) {
        let day = i - (week - 1)
        let col = {num: day, class: 'calw'}

        if (i <= week - 1) {
          col = {num: '', class: 'calwb'}
        } else {
          let curDate = year + '-' + month + '-' + day + ' 00:00:00'
          if (Date.parse(curDate) >= Date.parse(this.formData.startTime) && Date.parse(curDate) <= Date.parse(this.formData.endTime)) {
            col = {num: day, class: 'calr'}
          }

          if (this.workTimes.length > 0) {
            for (let m = 0; m < this.workTimes.length; m++) {
              if (Date.parse(curDate) == Date.parse(this.workTimes[m]['value'])) {
                col = {num: day, class: 'calb'}
              }
            }
          }
        }
        row.push(col)

        if (i % 7 == 0) {
          newCalDate.push(row)
          row = []
        }
      }
      
      console.log(row)
      if (row.length > 0) {
        if (row.length < 7) {
          let rowTmp = []
          for (let i = 0; i < 7 - row.length; i++) {
            rowTmp.push({num: '', class: 'calwb'})
          }
          row = row.concat(rowTmp)
        }
        newCalDate.push(row)
      }

      this.calDate = newCalDate
    },
    getMonthDays (year, month) {
      let days = 31
      switch (month) {
        case 2:
          if (year % 4 == 0 && year %100 != 0 || year %400 == 0) {
            days = 29
          } else {
            days = 28
          }
          break
        case 4: case 6: case 9: case 11:
          days = 30
          break
        default:
          days = 31
      }

      return days
    }
  },
  created () {
    // 请求列表数据
    this.changePage()
  }
}
</script>
