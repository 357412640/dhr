<template>
  <div>
    <div style='padding:6px'>
        <Row :gutter="16">
          <Col span='2'>
            <Button type="text" @click='preRange'>上一考勤周期</Button>
          </Col>
          <Col span='3'>
            <Button type="text" @click='curRange'>当前考勤周期</Button>
          </Col>
          <Col span='3'>
            <Select v-model='sel_range' transfer placeholder='请选择' @on-change='changeRange'>
              <Option v-for='val in ranges' :value='val' :key='val'>{{val}}</Option>
            </Select>
          </Col>
          <Col span='16'>
            <Button icon="md-checkmark-circle" type='text'>正常</Button>
            <Button icon="md-cafe" type='text'>休假</Button>
            <Button icon="md-hand" type='text'>未打卡</Button>
            <Button icon="md-stopwatch" type='text'>迟到</Button>
            <Button icon="md-walk" type='text'>早退</Button>
            <Button icon="md-close-circle" type='text'>旷工</Button>
            <Button icon="md-briefcase" type='text'>公出</Button>
            <Button icon="md-train" type='text'>出差</Button>
            <Button icon="md-person-add" type='text'>加班</Button>
          </Col>
        </Row>
    </div>
    <div>
      <Table stripe border :loading="loading" :columns="model_cols" :data="model_data" style="margin-top: 10px;overflow: inherit;" :no-data-text=noData></Table>
      <!-- <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :page-size="pageInfo.page_size" :total="pageInfo.total" :current="pageInfo.page" @on-change="changePage"></Page>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import { getArchiveResultList } from '@/api/file-attendance'
import { noData } from '@/libs/util'
export default {
  name: "tab1-content",
  props: {
    pemplid: {
      type: String
    }
  },
  data() {
    return {
        loading: false,
        noData: noData,
        params: {
          emplid: this.pemplid
        },
        model_cols: [
          {
            title: '日期',
            key: '',
            align: 'center',
            width: 140,
            render: (h, params) => {
              return h('span', params.row.date + ' ' + params.row.sourceDate)
            }
          },
          {
            title: '考勤状态',
            key: '',
            align: 'center',
            render: (h, params) => {
              let icons = []
              if (params.row.isNormal) {
                icons.push(
                  h('Icon', {
                    props: { type: 'md-checkmark-circle' }
                  })
                )
              }
              if (params.row.isHoliday) {
                icons.push(
                  h('Icon', {
                    props: { type: 'md-cafe' }
                  })
                )
              }
              if (params.row.isNotclockin) {
                icons.push(
                  h('Icon', {
                    props: { type: 'md-hand' }
                  })
                )
              }
              if (params.row.isLate) {
                icons.push(
                  h('Icon', {
                    props: { type: 'md-stopwatch' }
                  })
                )
              }
              if (params.row.isEarly) {
                icons.push(
                  h('Icon', {
                    props: { type: 'md-walk' }
                  })
                )
              }
              if (params.row.isAbsente) {
                icons.push(
                  h('Icon', {
                    props: { type: 'md-close-circle' }
                  })
                )
              }
              if (params.row.isGoout) {
                icons.push(
                  h('Icon', {
                    props: { type: 'md-briefcase' }
                  })
                )
              }
              if (params.row.isBusinesstrip) {
                icons.push(
                  h('Icon', {
                    props: { type: 'md-train' }
                  })
                )
              }
              if (params.row.isOvertime) {
                icons.push(
                  h('Icon', {
                    props: { type: 'md-person-add' }
                  })
                )
              }

              return h('div', icons)
            }
          },
          {
            title: '排班',
            key: '',
            align: 'center',
            render: (h, params) => {
              return h('span', params.row.workRule)
            }
          },
          {
            title: '上班打卡',
            key: '',
            align: 'center',
            render: (h, params) => {
              if (!params.row.clockinFirstTime) {
                return
              }
              let cType = ''
              switch (params.row.clockinFirstType) {
                case 0:
                  cType = '密码验证'
                  break
                case 1:
                  cType = '指纹验证'
                  break
                case 2:
                  cType = '美办考勤打卡'
                  break
                case 3:
                  cType = '美办人脸手机打卡'
                  break
                case 4:
                  cType = '人脸识别'
                  break
                case 5:
                  cType = '摄像头人脸识别'
                  break
                case 6:
                  cType = '门禁打卡'
                  break
                default:
                  break
              }
              return h('div', [
                h('span', params.row.clockinFirstTime),
                h('Poptip', { props: { trigger: 'hover', title: '打卡信息' }
                }, [
                    h('Icon', { props: { type: 'md-chatbubbles', size: 18, color: '#2b85e4' } }),
                    h('div', { slot: 'content', class: 'api' }, [
                      h('div', [
                        h('span', '打卡日期：' + params.row.firstDate)
                      ]),
                      h('div', [
                        h('span', '打卡时间：' + params.row.clockinFirstTime)
                      ]),
                      h('div', [
                        h('span', '打卡方式：' + cType)
                      ]),
                      h('div', [
                        h('span', '打卡地址：' + params.row.clockinFirstLoction)
                      ])
                    ])
                ]),

              ])
            }
          },
          {
            title: '下班打卡',
            key: '',
            align: 'center',
            render: (h, params) => {
              if (!params.row.clockinLastTime) {
                return
              }
              let cType = ''
              switch (params.row.clockinLastType) {
                case 0:
                  cType = '密码验证'
                  break
                case 1:
                  cType = '指纹验证'
                  break
                case 2:
                  cType = '美办考勤打卡'
                  break
                case 3:
                  cType = '美办人脸手机打卡'
                  break
                case 4:
                  cType = '人脸识别'
                  break
                case 5:
                  cType = '摄像头人脸识别'
                  break
                case 6:
                  cType = '门禁打卡'
                  break
                default:
                  break
              }

              return h('div', [
                h('span', params.row.clockinLastTime),
                h('Poptip', { props: { trigger: 'hover', title: '打卡信息' }
                }, [
                    h('Icon', { props: { type: 'md-chatbubbles', size: 18, color: '#2b85e4' } }),
                    h('div', { slot: 'content', class: 'api' }, [
                      h('div', [
                        h('span', '打卡日期：' + params.row.lastDate)
                      ]),
                      h('div', [
                        h('span', '打卡时间：' + params.row.clockinLastTime)
                      ]),
                      h('div', [
                        h('span', '打卡方式：' + cType)
                      ]),
                      h('div', [
                        h('span', '打卡地址：' + params.row.clockinLastLoction)
                      ])
                    ])
                ]),

              ])
            }
          },
          {
            title: '出勤时长',
            key: 'clockinLong',
            align: 'center',
            render: (h, params) => {
              let hours = parseInt(params.row.clockinLong / 3600)
              let minutes = parseInt(params.row.clockinLong % 3600 / 60)
              return h('span', hours + '小时' + minutes + '分钟')
            }
          },
          {
            title: '周期累计时长',
            key: 'duration',
            align: 'center',
            render: (h, params) => {
              let hours = parseInt(params.row.duration / 3600)
              let minutes = parseInt(params.row.duration % 3600 / 60)
              return h('span', hours + '小时' + minutes + '分钟')
            }
          },
          {
            title: '考勤申请',
            key: '',
            align: 'center',
            render: (h, params) => {
              if (!params.row.oaBills) return
              if (params.row.oaBills.length == 0) {
                  return h('span', '')
              } else {
                  let list = []
                  for (let i = 0; i < params.row.oaBills.length; i++) {
                    list.push(h('div', [
                      h('span', this.billTypes[params.row.oaBills[i]['billType'] - 1]['name']),
                      h('Tooltip', { props: { content: '单据编号：' + params.row.oaBills[i]['billNumber'], placement: "top-start" } }, [h('Icon', { props: { type: 'md-bookmark', size: 18, color: '#2b85e4'} })]),
                    ]))
                  }

                  return h('div', list)
              }
            }
          },
          {
            title: '申请时间',
            key: '',
            align: 'center',
            render: (h, params) => {
              if (!params.row.oaBills) return
              if (params.row.oaBills.length == 0) {
                  return h('span', '')
              } else {
                  let list = []
                  for (let i = 0; i < params.row.oaBills.length; i++) {
                    list.push(h('div', [
                      h('span', params.row.oaBills[i]['startTime'] + ' - ' + params.row.oaBills[i]['endTime'] + '('+ params.row.oaBills[i]['duration'] + ')'),
                    ]))
                  }

                  return h('div', list)
              }
            }
          },
        ],
        model_data: [],
        pageInfo: {},
        billTypes: [
          {id: 1, name: '年假'},
          {id: 2, name: '调休假'},
          {id: 3, name: '事假'},
          {id: 4, name: '病假'},
          {id: 5, name: '婚假'},
          {id: 6, name: '产假'},
          {id: 7, name: '陪产假'},
          {id: 8, name: '产检假'},
          {id: 9, name: '丧假'},
          {id: 10, name: '哺乳假'},
          {id: 11, name: '公假'},
          {id: 12, name: '探亲假'},
          {id: 13, name: '工伤假'},
          {id: 14, name: '小产假'},
          {id: 15, name: '加班'},
          {id: 16, name: '未打卡'},
          {id: 17, name: '出差'},
          {id: 18, name: '调班'},
          {id: 19, name: '公出'}
        ],
        ranges: [],
        cur_range: '',
        pre_range: '',
        sel_range: '',
    }
  },
  methods: {
    changeRange() {
      this.getArchiveResultList()
    },
    getArchiveResultList() {
      let data = {
        emplid: this.params.emplid,
        period: this.sel_range
      }
      getArchiveResultList(data).then(res => {
          let data = res.data
          if (data.code === 200) {
            this.model_data = data.data
          } else {
            this.$Message.error('获取考勤数据失败：' + data.message)
          }
      })
    },

    // 获得考勤周期
    getRanges() {
      let date = new Date()
      let cur_year = date.getFullYear()
      let cur_month = date.getMonth() + 1
      let pre_year = cur_year - 1

      // 组织考勤周期列表
      let years = [cur_year, pre_year]
      let ranges_tmp = []

      let i = 0
      let j = cur_month
      let k = cur_year
      while (i < 12) {
        if (j < 1) {
          k = k - 1
          j = 12
        }
        if (j < 10) {
          j = '0' + j
        }
        let range = k + '/' + j
        ranges_tmp.push(range)
        j--
        i++
      }
      this.ranges = ranges_tmp

      // 获得当前考勤周期
      if (cur_month < 10) {
        cur_month = '0' + cur_month
      }
      this.cur_range = cur_year + '/' + cur_month

      // 获得上一考勤周期
      let pre_month = cur_month - 1
      if (cur_month == 1) {
        pre_month = 12
        cur_year = pre_year
      } else {
        if (pre_month < 10) {
          pre_month = '0' + cur_month
        }
      }
      this.pre_range = cur_year + '/' + pre_month

      this.sel_range = this.cur_range
    },
    // 切换上一考勤周期
    preRange() {
      this.sel_range = this.pre_range
      this.getArchiveResultList()
    },
    // 切换当前考勤周期
    curRange() {
      this.sel_range = this.cur_range
      this.getArchiveResultList()
    },
  },
  created() {
    this.getRanges()
    this.getArchiveResultList()
  }
}
</script>

<style>
</style>
