<template>
  <div class='contract-sign-list'>
    <Form v-if='more' label-position='top'>
      <Row :gutter='40'>
        <Col span='6'>
          <FormItem label='姓名'>
            <Input v-model='search.name' placeholder='请输入姓名' key='31415'></Input>
          </FormItem>
        </Col>
        <Col span='6'>
          <FormItem label='员工ID'>
            <Input v-model='search.emplid' placeholder='请输入员工ID'></Input>
          </FormItem>
        </Col>
        <Col span='6'>
          <FormItem label='OA单号'>
            <Input v-model='search.oano' placeholder='请输入OA单号'></Input>
          </FormItem>
        </Col>
        <Col span='6'>
          <FormItem label='合同类型'>
            <Select v-model='search.type'>
              <Option value='' key=''>全部</Option>
              <Option v-for='item in sel3' :value='item.typeName' :key='item.id'>{{item.typeName}}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>

      <FormItem style='text-align:center;'>
        <Button type="primary" @click='changePage(1)'>查询</Button>
        <Button @click='clear' style="margin-left: 8px">重置</Button>
        <Icon type="ios-arrow-up" size='30' style='display:none;margin-left:8px;cursor:pointer' @click='changeMore' />
      </FormItem>
    </Form>

    <Form v-else>
      <Row type="flex" justify="center" align="middle" :gutter='16'>
        <Col span='12'>
          <FormItem>
            <Input v-model='search.condition' prefix="md-search" placeholder="请输入状态/合同类型/岗位类型/签订次数" />
          </FormItem>
        </Col>
        <!-- <Col span='3'>
          <FormItem>
            <Select placeholder='更多筛选' style='width:100%'>
              <Option>更多筛选</Option>
            </Select>
          </FormItem>
        </Col> -->
        <Col span='5'>
          <FormItem style='text-align:center;'>
            <Button type="primary" @click='changePage(1)'>查询</Button>
            <Button @click='clear' style="margin-left: 8px">重置</Button>
            <Icon type="ios-arrow-down" size='30' style='margin-left:8px;cursor:pointer' @click='changeMore' />
          </FormItem>
        </Col>
      </Row>
    </Form>

    <div style='margin-bottom:8px'>
      <Row>
        <Col span='10'>
          <div>
            <Button type="primary" @click='sendSigns'>发起签署</Button>
            <Button @click='showUpload' style='margin-left:10px'>导入</Button>
            <Button :class="{ statusSel: status == 0 }" type="text" style='margin-left:20px;' @click='changeStatus(0)'>待签署（{{statusCount.dqs}}）</Button>
            <Button :class="{ statusSel: status == 1 }" type="text" @click='changeStatus(1)'>发起签署（{{statusCount.ksz}}）</Button>
          </div>
        </Col>
        <Col span='4' offset="10">
          <Select multiple placeholder='自定义' max-tag-count=1 @on-change='customTitle'>
            <Option v-for="(item, key) in cols" :value="key" :key="key">{{ item.title }}</Option>
          </Select>
        </Col>
      </Row>
    </div>
    <Table @on-selection-change='setNos' :max-height="tableHeight" :loading='loading' border ref="selection" :columns="dataCols" :data='dataRows' :no-data-text=noData></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :page-size="pageInfo.page_size" :total="pageInfo.total" :current="pageInfo.page" @on-change="changePage"></Page>
      </div>
    </div>

    <Modal width='400' v-model="modalUpload" title="文件导入">
      <Upload ref='uploadBox' type="drag" action="/contract/contract/importRenewal" :on-success='respSuccess'>
        <div style="padding: 20px 0">
          <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
          <p>点击 或者 拖拽 上传文件</p>
        </div>
      </Upload>
      <div v-if='uploadMsgs.length > 0' style='margin-top:20px'>
        <Card title='导入反馈'>
          <p v-for="(item, key) in uploadMsgs">第{{key + 1}}行 : {{item['错误信息']}}</p>
        </Card>
      </div>
      <div slot="footer">
      </div>
    </Modal>

    <Modal v-model="cancelModal" @on-ok="cancelSign" :closable="false">
      <div style='text-align:center;padding:20px'>
        <p><Icon type="md-alert" size=24 color='#ff9900' />是否作废？</p>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getListtobesigned, gettobesignedCount, selectType, getContractTypeList, getTemplateList, sendSignx, sendSignxs, invalidContract, getSettingDay } from '@/api/e-contract'
import { setSerialNum, deepClone, noDataLong } from '@/libs/util'
import expandRow from '@/components/table-expand/table-expand.vue'

export default {
  components: {
    expandRow
  },
  data() {
    return {
      timer: null,
      curDate: '',
      cancelModal: false,
      uploadMsgs: [],
      tableHeight: 420,
      modalUpload: false,
      loading: false,
      more: true,
      pageInfo: {},
      search: {},
      sel3: [],
      dataRows: [],
      dataCols: [],
      nos: [],
      noData: noDataLong,
      statusCount: {
        ksz: 0,
        dqs: 0,
      },
      cols: [
        {
          title: '选择框',
          type: 'selection',
          align: 'center',
          width: 60,
          key: 'id'
        },
        {
          type: 'expand',
          width: 50,
          render: (h, params) => {
              return h(expandRow, {
                  props: {
                      row: params.row.history,
                      statuss: this.statuss
                  }
              })
          }
        },
        {
          title: '序号',
          align: 'center',
          width: 100,
          key: 'number'
        },
        {
          title: '姓名',
          align: 'center',
          key: 'empname',
          width: 100,
        },
        {
          title: '身份证号',
          align: 'center',
          key: 'persionid',
          width: 120,
        },
        {
          title: '员工ID',
          align: 'center',
          key: 'emplid',
          width: 100,
        },
        {
          title: '组织全路径',
          align: 'center',
          key: 'staff.deptChain',
          width: 240,
          render: (h, params) => {
            return h('span', params.row.staff.deptChain)
          }
        },
        {
          title: '岗位',
          align: 'center',
          key: 'staff.posiDescr',
          width: 120,
          render: (h, params) => {
            return h('span', params.row.staff.posiDescr)
          }
        },
        {
          title: '岗位层级',
          align: 'center',
          key: 'staff.gmPosiLvl',
          width: 140,
          render: (h, params) => {
            return h('span', params.row.staff.gmPosiLvl)
          }
        },
        {
          title: '入职时间',
          align: 'center',
          key: 'staff.origHireDt',
          width: 100,
          render: (h, params) => {
            return h('span', params.row.staff.origHireDt)
          }
        },
        {
          title: '合同版本',
          align: 'center',
          key: 'contractModeValue',
          width: 240
        },
        {
          title: '合同甲方',
          align: 'center',
          key: 'subject',
          width: 240
        },
        {
          title: '合同签订次数',
          align: 'center',
          key: 'signTime',
          width: 110
        },
        {
          title: '签订年限',
          align: 'center',
          key: 'years',
          width: 100
        },
        {
          title: '合同子类型',
          align: 'center',
          key: 'contractchildtype',
          width: 100
        },
        {
          title: '岗位类型',
          align: 'center',
          key: 'postType',
          width: 100
        },
        {
          title: '工时制度',
          align: 'center',
          key: 'jobTime',
          width: 100
        },
        {
          title: '试用期限',
          align: 'center',
          key: 'testTime',
          width: 100
        },
        {
          title: '合同开始日期',
          align: 'center',
          key: 'starttime',
          width: 120
        },
        {
          title: '合同预计结束日期',
          align: 'center',
          key: 'futuretime',
          width: 140
        },
        {
          title: '合同结束日期',
          align: 'center',
          key: 'dimissionDt',
          width: 120
        },
        {
          title: 'OA单号',
          align: 'center',
          key: 'oaNo',
          width: 160
        },
        {
          title: '是否入职',
          align: 'center',
          key: 'emplStatusDescr',
          width: 100
        },
        {
          title: '状态',
          align: 'center',
          key: 'status',
          width: 120,
          render: (h, params) => {
            return h('span', this.statuss[params.row.status]['name'])
          }
        },
        {
          title: '操作',
          align: 'center',
          key: '',
          width: 140,
          fixed: 'right',
          render: (h, params) => {
            if (params.row.status == 0 || params.row.status == 1) {
              if (params.row.countdown) {
                return h('div', [
                  h('div', {
                    attrs: {
                      style: 'color:#c5c8ce',
                    },
                  }, this.curDate + ' ' + params.row.countdown),
                  h('a', {
                    attrs: {
                      style: 'margin-left:10px'
                    },
                    on: {
                      click: () => {
                        this.cancelModal = true
                        this.Contractno = params.row.contractNo
                      }
                    }
                  }, '作废')
                ])
              } else {
                return h('div', [
                  h('a', {
                    on: {
                      click: () => {
                        this.sendSign(params.row.contractNo)
                      }
                    }
                  }, '发起签署'),
                  h('a', {
                    attrs: {
                      style: 'margin-left:10px'
                    },
                    on: {
                      click: () => {
                        this.cancelModal = true
                        this.Contractno = params.row.contractNo
                      }
                    }
                  }, '作废')
                ])
              }
            } else {
	          return h('span', {
                attrs: {
                  style: 'color:#c5c8ce'
                }
              }, '发起签署')
            }
          }
        },
      ],
      statuss: [
        {id: 0, name: '待签署'},
        {id: 1, name: '待签署-签署中'},
        {id: 2, name: '待盖章'},
        {id: 3, name: '待盖章-进行中'},
        {id: 4, name: '合同完成'},
        {id: 5, name: '待用印'}
      ],
      status: 0,
      Contractno: '',
      setDay: 1,
    }
  },
  methods: {
    getSettingDay() {
      getSettingDay({}).then(res => {
        const data = res.data
        if (data.code === 200) {
          this.setDay = data.data.bindValue
        } else {
          this.$Message.error('获取合同到期提醒天数失败：' + data.message)
        }
      })     
    },
    cancelSign() {
      let data = {Contractno: this.Contractno}
      invalidContract(data).then(res => {
        const data = res.data
        if (data.code === 200 && data.data == 1) {
          this.$Message.success('操作成功！')
          this.changePage(1)
        } else {
          this.$Message.error('操作失败：' + data.message)
        }
      })     
    },
    changeStatus(status) {
      this.status = status
      this.changePage(1)
    },
    changeMore() {
      this.more = !this.more
    },
    customTitle(val) {
      let tmp = []
      let list = val

      if (list.length > 0) {
        list = list.sort(function(a, b){return a - b})

        for (let i = 0; i < list.length; i++) {
          tmp.push(this.cols[list[i]])
        }
      } else {
        tmp = this.cols
      }
      this.dataCols = tmp
    },
    clear() {
      this.search = {}
      this.changePage(1)
    },
    respSuccess(res, file, fileList) {
      this.uploadMsgs = []
      console.log(res)
      if (res.code == 200) {
        if (res.data != null && res.data.length > 0) {
          let list = res.data
          this.uploadMsgs = list
        } else {
          this.$Message.success('导入成功！')         
          this.changePage(1)
        }
      } else {
        this.$Message.error('导入失败：' + res.message)
      }

    },
    changePage(page) {
      this.dataRows = []
      this.loading = true
      this.pageInfo.current = page
      let data = {
        status: this.status,
        pageNum: page || 1,
        pageSize: this.pageInfo.page_size || 20
      }
      
      if (!this.more) {
        data.condition = this.search.condition
      } else {
        Object.assign(data, this.search)
        data.condition = ''
      }

      getListtobesigned(data).then(res => {
        const data = res.data
        this.loading = false
        if (data.code === 200) {
          this.pageInfo.total = data.data.total
          this.pageInfo.current = data.data.pageNum
          this.pageInfo.page_size = data.data.pageSize
          if (data.data.list) {
            this.dataRows = setSerialNum(data.data.list, this.pageInfo)

            let dataRows = this.dataRows
            let dataRowsc = new Array()
            for (let i = 0; i < dataRows.length; i++) {
              // dataRows[i]['countdown'] = that.showtime(dataRows[i]['initime'])
              dataRows[i]['countdown'] = this.showtime(dataRows[i]['initime'])
              dataRowsc[i] = dataRows[i]
              console.log(dataRows[i]['countdown'])
            }
            this.dataRows = dataRowsc
          } else {
            this.dataRows = []
          }
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })
    },
    sendSign(no) {
      let data = {contractNo: no}
      sendSignx(data).then(res => {
        const data = res.data
        if (data.code === 200) {
          // data.data
          this.$Message.success('发起成功！')
          this.changePage(1)
        } else {
          this.$Message.error('发起失败：' + data.message)
        }
      })     
    },
    setNos(sels) {
      console.log(sels)
      this.nos = []
      
      if (sels) {
        for (let i = 0; i < sels.length; i++) {
          this.nos.push(sels[i]['contractNo'])
        }
      }
    },
    sendSigns() {
      let nos = this.nos
      if (nos.length == 0) {
        this.$Message.error('发起失败：请选择发起项')
        return
      }

      let data = {contractNoArr: nos}
      sendSignxs(data).then(res => {
        const data = res.data
        if (data.code === 200) {
          // data.data
          this.$Message.success('发起成功！')
          this.changePage(1)
        } else {
          this.$Message.error('发起失败：' + data.message)
        }
      })     
    },
    getSelectAll() {
      // 合同类型 sel3
      getContractTypeList({pageSize: 9999}).then(res => {
        const data = res.data
        if (data.code === 200) {
          this.sel3 = data.data.list
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })
    },
    showUpload() {
      this.modalUpload = true
      this.$refs.uploadBox.clearFiles()
      this.uploadMsgs = []
    },
    gettobesignedCount() {
      gettobesignedCount({}).then(res => {
        const data = res.data
        if (data.code === 200) {
            if (data.data) {
              this.statusCount = data.data
            } else {
              this.statusCount = {
                 ksz: 0,
                 dqs: 0
              }
            }
            console.log(data.data)
        } else {
          this.$Message.error('获取数量失败：' + data.message)
        }
      })     
    },
    showtime(end) {
        if (!end) {
          return null
        }

        let nowtime = new Date()  //获取当前时间
        let endtime = new Date(end)  //定义结束时间
        let lefttime = endtime.getTime() + this.setDay * 24 * 60 * 60 * 1000 - nowtime.getTime()  //距离结束时间的毫秒数

        if (lefttime <= 0) {
          return null
        }

        let leftd = Math.floor(lefttime/(1000*60*60*24))  //计算天数
        let lefth = Math.floor(lefttime/(1000*60*60))  //计算小时数
        let leftm = Math.floor(lefttime/(1000*60)%60)  //计算分钟数
        let lefts = Math.floor(lefttime/1000%60)  //计算秒数
        return lefth + ":" + leftm  //返回倒计时的字符串
    },
    getCurDate() {
      let date = new Date()
      let month = date.getMonth() + 1
      let day = date.getDate()
      this.curDate = month + '月' + day + '日'
    },
    getHeight() {
      this.tableHeight = window.innerHeight - this.$refs.selection.$el.offsetTop - 90
    }
  },
  mounted() {
    this.getSettingDay()
    this.gettobesignedCount()
    this.customTitle([])
    this.getSelectAll()
    this.changePage()

    // 当前日期
    this.getCurDate()

    // 倒计时
    let that = this
    let getCountdown = function() {
      let dataRows = that.dataRows
      let dataRowsc = new Array()
      for (let i = 0; i < dataRows.length; i++) {
        // dataRows[i]['countdown'] = that.showtime(dataRows[i]['initime'])
        dataRows[i]['countdown'] = that.showtime(dataRows[i]['initime'])
        dataRowsc[i] = dataRows[i]
        console.log(dataRows[i]['countdown'])
      }
      that.dataRows = []
      that.dataRows = dataRowsc
      return getCountdown
    }
    this.timer = setInterval(getCountdown(), 60000)
  },
  created() {
    window.addEventListener('resize', this.getHeight)
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  destroyed () {
    window.removeEventListener('resize', this.getHeight)
  }
}
</script>

<style>
.contract-sign-list {
  padding: 20px;
}
.statusSel {
  border-color:#808695;
}
</style>
