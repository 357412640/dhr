<template>
  <div>
    <div class="search-box">
        <Form :label-width="80" @submit.native.prevent>
          <Row>
            <Col span="6">
              <FormItem label="单据类型" style="margin-right: 20px">
                <Select v-model="search.billType" transfer placeholder='请选择'>
                  <Option value="">全部</Option>
                  <Option v-for='item in billTypes' :value='item.id' :key='item.id'>{{item.name}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem label="生效状态" style="margin-right: 20px">
                <Select v-model="search.applyStatus" transfer placeholder='请选择'>
                  <Option value="">全部</Option>
                  <Option v-for='item in applyStatuss' :value='item.id' :key='item.id'>{{item.name}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem label="申请日期">
                <DatePicker :value="datePicker" type="daterange" transfer placement="bottom-end" format="yyyy-MM-dd" @on-change="getStartEndDate($event)" style="width: 200px"></DatePicker>
              </FormItem>
            </Col>
            <Col span="4">
              <FormItem :label-width="10">
                <Button type="primary" @click="handleSubmit">搜 索</Button>
                <Button style="margin-left:4px" @click="handleReset('search')">重 置</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
    </div>
    <div>
      <Table stripe border :loading="loading" :columns="model_cols" :data="model_data" style="margin-top: 10px" :no-data-text=noData></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :page-size="pageInfo.page_size" :total="pageInfo.total" :current="pageInfo.page" @on-change="changePage"></Page>
        </div>
      </div>
    </div>

    <Drawer title="考勤申请详情" v-model="drawer1" width="460" :mask-closable="false">
      <div class='main-title' style='margin-bottom:10px;'>申请信息</div>
      <div class='sec-title'>单据类型：{{bill_detail_info.billTypeStr}}</div>
      <div class='sec-title'>单据编号：{{bill_detail_info.billNumber}}</div>
      <div class='sec-title'>单据状态：{{bill_detail_info.billStatusStr}}</div>
      <div class='sec-title'>申请信息</div>

      <Table v-if='bill_detail_info.billType == 16' stripe border :loading="loading" :columns="bill_detail_cols_16" :data="bill_detail_data" :no-data-text=noData></Table>
      <Table v-else stripe border :loading="loading" :columns="bill_detail_cols" :data="bill_detail_data" :no-data-text=noData></Table>

      <div class='main-title' style='margin-bottom:10px;margin-top:20px;'>更多信息</div>
      <div v-if="bill_detail_info.applyStatus == 1" class='sec-title'>申请状态：生效 <span @click='changeapplyStatus' style='cursor:pointer;color:#1890ff' v-if="hasPerm(68)">销假</span></div>
      <div v-else class='sec-title'>申请状态：无效</div>

      <div v-if="bill_detail_info.applyStatus == 2" class='sec-title'>
        无效原因：
        <Input v-if='bill_detail_info.remark == ""' v-model="bill_detail_info.remark_once" type="textarea" placeholder="手动操作销假，失败原因必输" />
        <span v-else>{{bill_detail_info.remark}}</span>
      </div>

      <div class='main-title' style='margin-bottom:10px;margin-top:20px;'>操作记录</div>
      <div class='sec-title'>最新操作用户：{{bill_detail_info.updateUser}}</div>
      <div class='sec-title'>最新操作时间：{{bill_detail_info.updateTime}}</div>

      <Spin size="large" fix v-if="spinShow"></Spin>

      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="drawer1 = false">取消</Button>
        <Button type="primary" @click="invalidBill">保存</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
import { getBillList, getBillDetail, invalidBill } from '@/api/file-attendance'
import { setSerialNum, deepClone, noData } from '@/libs/util'
export default {
  name: "tab3-content",
  props: {
    pemplid: {
      type: String
    }
  },
  data() {
    return {
        spinShow: false,
        datePicker: [],
        drawer1: false,
        loading: false,
        noData: noData,
        model_cols: [
          {
            title: '单据类型',
            key: 'billType',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('span',
                  this.billTypes[params.row.billType - 1]['name']
                ),
                h('Tooltip', { props: { content: '单据编号：' + params.row.billNumber, placement: "top-start" } }, [h('Icon', { props: { type: 'md-document', size: 18, color: '#2b85e4'} })]),
              ])
            }
          },
          {
            title: '开始时间',
            key: 'startDate',
            align: 'center',
            render: (h, params) => {
              return h('span', params.row.startDate + ' ' + params.row.startTime)
            }
          },
          {
            title: '结束时间',
            key: 'endDate',
            align: 'center',
            render: (h, params) => {
              if (params.row.billType == 16) {
                return h('span', '')
              } else {
                return h('span', params.row.endDate + ' ' + params.row.endTime)
              }
            }
          },
          {
            title: '申请时长',
            key: 'duration',
            align: 'center',
            render: (h, params) => {
              if (params.row.billType == 16) {
                return h('span', '')
              } else {
                return h('span', params.row.duration)
              }
            }
          },
          {
            title: '生效状态',
            key: 'applyStatus',
            align: 'center',
            render: (h, params) => {
                if (params.row.applyStatus == 1) {
                  return h('div', [
                    h('span',
                      '生效'
                    ),
                  ])
                } else {
                  return h('div', [
                    h('span',
                      '无效'
                    ),
                  ])
                }
            }
          },
          {
            title: '来源',
            key: 'updateUser',
            align: 'center'
          },
          {
            title: '最近操作人',
            key: 'updateUser',
            align: 'center'
          },
          {
            title: '操作',
            key: '',
            align: 'center',
            render: (h, params) => {
                return h('div', [
                  h('a', {
                    props: {
                      type: 'text',
                      size: 'small',
                    },

                    on: {
                      click: () => {
                        this.showDetail(params.row.id)
                      }
                    }
                  }, '详情'),
                ])
            }
          }
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
        applyStatuss: [
          {id: 1, name: '生效'},
          {id: 2, name: '无效'}
        ],
        search: {
          personNumber: this.pemplid,
          billType: '',
          applyStatus: '',
          startDate: '',
          endDate: '',
        },
        bill_detail_cols: [
          {
            title: '开始时间',
            key: 'startDate',
            align: 'center',
            render: (h, params) => {
              return h('span', params.row.startDate + ' ' + params.row.startTime)
            }
          },
          {
            title: '结束时间',
            key: 'endDate',
            align: 'center',
            render: (h, params) => {
              if (params.row.billType == 16) {
                return h('span', '')
              } else {
                return h('span', params.row.endDate + ' ' + params.row.endTime)
              }
            }
          },
          {
            title: '时长',
            key: 'duration',
            align: 'center',
            render: (h, params) => {
              if (params.row.billType == 16) {
                return h('span', '')
              } else {
                return h('span', params.row.duration)
              }
            }
          },
        ],
        bill_detail_cols_16: [
          {
            title: '申请类型',
            align: 'center',
            render: (h, params) => {
              return h('span', this.billTypes[params.row.billType - 1]['name'])
            }
          },
          {
            title: '申请时间',
            key: 'startDate',
            align: 'center',
            render: (h, params) => {
              return h('span', params.row.startDate + ' ' + params.row.startTime)
            }
          },
        ],
        bill_detail_data: [],
        bill_detail_info: {}
    }
  },
  methods: {
    // 搜索按钮
    handleSubmit () {
      this.changePage(1)
    },
    // 搜索重置
    handleReset (name) {
      this.search = {
          personNumber: this.pemplid,
          billType: '',
          applyStatus: '',
          startDate: '',
          endDate: '',
      }
      this.datePicker = []
      this.changePage()
    },
    // 获取考勤申请记录列表
    changePage(page) {
      this.loading = true
      this.pageInfo.current = page

      this.search.pageNum = page || 1
      this.search.pageSize = this.pageInfo.page_size || 20
      let data = {
        personNumber: this.search.personNumber,
        billType: this.search.billType,
        applyStatus: this.search.applyStatus,
        startDate: this.search.startDate,
        endDate: this.search.endDate,
        pageNum: page || 1,
        pageSize: this.pageInfo.page_size || 20
      }
      getBillList(data).then(res => {
          let data = res.data
          this.loading = false
          if (data.code === 200) {
            this.pageInfo.total = data.data.total
            this.pageInfo.current = data.data.pageNum
            this.pageInfo.page_size = data.data.pageSize
            this.model_data = setSerialNum(data.data.list, this.pageInfo)
          } else {
            this.$Message.error('获取详情失败：' + data.message)
          }
      })
    },
    getStartEndDate(e) {
      console.log(e)
      this.search.startDate = e[0]
      this.search.endDate = e[1]
      this.datePicker = e
    },
    // 显示详情
    showDetail(id) {
      this.bill_detail_data = []
      this.bill_detail_info = {}
      this.drawer1 = true
      this.getBillDetail(id)
    },
    // 获取考勤申请记录详情
    getBillDetail(id) {
      this.spinShow = true
      let data = {
        id: id
      }
      getBillDetail(data).then(res => {
          let data = res.data
          if (data.code === 200) {
            this.bill_detail_info = data.data
            this.bill_detail_data = [{
              billType: data.data.billType,
              startDate: data.data.startDate,
              endDate: data.data.endDate,
              startTime: data.data.startTime,
              endTime: data.data.endTime,
              duration: data.data.duration
            }]
            switch (this.bill_detail_info.billStatus) {
              case 1:
                this.bill_detail_info.billStatusStr = '送签'
                break
              case 2:
                this.bill_detail_info.billStatusStr = '驳回撤回到起点'
                break
              case 3:
                this.bill_detail_info.billStatusStr = '审批通过'
                break
              case 4:
                this.bill_detail_info.billStatusStr = '审批失败'
                break
              default:
                break
            }
            this.bill_detail_info.billTypeStr = this.billTypes[this.bill_detail_info.billType - 1]['name']

            this.spinShow = false
          } else {
            this.$Message.error('获取详情失败：' + data.message)
          }
      })
    },
    changeapplyStatus() {
      this.bill_detail_info.applyStatus = 2
    },
    // 销假
    invalidBill(id) {
      if (this.bill_detail_info.applyStatus == 1) {
        this.drawer1 = false
        return
      }

      let data = {
        id: this.bill_detail_info.id,
        remark: this.bill_detail_info.remark_once
      }
      invalidBill(data).then(res => {
          let data = res.data
          if (data.code === 200) {
            this.drawer1 = false
            this.$Message.success('保存成功')
            this.changePage(1)
          } else {
            this.$Message.error('获取详情失败：' + data.message)
          }
      })
    },
  },
  created() {
    this.changePage()
  }
}
</script>

<style>
.main-title {
  border-left: 3px solid gray;
  padding-left: 12px;
  font-size: 13px;
  font-weight: 600;
}
.sec-title {
  font-size: 13px;
  margin-bottom: 4px;
  margin-left: 14px;
}
.demo-drawer-footer{
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    background: #fff;
}
</style>
