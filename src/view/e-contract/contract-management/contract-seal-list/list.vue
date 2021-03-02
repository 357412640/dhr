<template>
  <div class='contract-seal-list'>
    <Form label-position='top'>
      <Row :gutter='40'>
        <Col span='8'>
          <FormItem label='姓名'>
            <Input v-model='search.name' placeholder='请输入姓名'></Input>
          </FormItem>
        </Col>
        <Col span='8'>
          <FormItem label='员工ID'>
            <Input v-model='search.emplid' placeholder='请输入员工ID'></Input>
          </FormItem>
        </Col>
        <Col span='8'>
          <FormItem label='OA单号'>
            <Input v-model='search.oano' placeholder='请输入OA单号'></Input>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter='40'>
        <Col span='8'>
          <FormItem label='合同类型'>
            <Select v-model='search.type'>
              <Option value='' key=''>全部</Option>
              <Option v-for='item in sel3' :value='item.title' :key='item.id'>{{item.title}}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span='8'>
          <FormItem label='状态'>
            <Select v-model='search.status'>
              <Option value='' key=''>全部</Option>
              <Option v-for='item in sel8' :value='item.id' :key='item.id'>{{item.bindValue}}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>

      <FormItem style='text-align:center;'>
        <Button type="primary" @click='changePage(1)'>查询</Button>
        <Button @click='clear' style="margin-left: 8px">重置</Button>
      </FormItem>
    </Form>

    <div >
      <div v-for='item in coms' class='com-ctr'>{{item.subject}}：{{item.count}}份合同</div>
      <div style='text-align:center;cursor:pointer;display:none;'>
        <span style='color:#3C8CFF'>展开</span>
        <!-- <Icon type="ios-arrow-up" size='20' style='margin-left:8px;' /> -->
        <Icon type="ios-arrow-down" size='20' style='margin-left:8px;' />
      </div>
    </div>

    <div style='margin-bottom:8px'>
      <Row>
        <Col span='6'>
          <div>
            <Button @click='sendSeals' type="primary">发起盖章</Button>
          </div>
        </Col>
        <Col span='4' offset="14">
          <Select multiple placeholder='自定义' max-tag-count=1 @on-change='customTitle'>
            <Option v-for="(item, key) in cols" :value="key" :key="key">{{ item.title }}</Option>
          </Select>
        </Col>
      </Row>
    </div>
    <Table :loading='loading' :max-height="tableHeight" @on-selection-change='setSeals' border ref="selection" :columns="dataCols" :data='dataRows' :no-data-text=noData></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :page-size="pageInfo.page_size" :total="pageInfo.total" :current="pageInfo.page" @on-change="changePage"></Page>
      </div>
    </div>

    <Modal v-model="reSendModal" @on-ok="reSendSign" :closable="false">
      <div style='text-align:center;padding:20px'>
        <p><Icon type="md-alert" size=24 color='#ff9900' />确定重新发起吗？</p>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getContractSealList, getContractSubjectList, getTemplateList, selectType, sendOaSeals, reSendSign, getViewUrl } from '@/api/e-contract'
import { setSerialNum, deepClone, noDataLong } from '@/libs/util'

export default {
  data() {
    return {
      loading: false,
      tableHeight: 420,
      seals: [],
      coms: [],
      sel3: [],
      sel8: [],
      pageInfo: {},
      search: {},
      reSendId: 0,
      dataRows: [],
      dataCols: [],
      reSendModal: false,
      noData: noDataLong,
      cols: [
        {
          title: '选择框',
          type: 'selection',
          align: 'center',
          width: 60,
          key: 'id'
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
          key: 'staff.name',
          width: 100,
          render: (h, params) => {
            return h('span', params.row.staff.name)
          }
        },
        {
          title: '身份证号',
          align: 'center',
          key: 'staff.nationalId',
          width: 100,
          render: (h, params) => {
            return h('span', params.row.staff.nationalId)
          }
        },
        {
          title: '员工ID',
          align: 'center',
          key: '',
          width: 100,
          render: (h, params) => {
            return h('span', params.row.staff.emplid)
          }
        },
        {
          title: '组织全路径',
          align: 'center',
          key: 'staff.deptChain',
          width: 200,
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
          width: 100
        },
        {
          title: '合同甲方',
          align: 'center',
          key: 'subject',
          width: 140
        },
        {
          title: '合同签订次数',
          align: 'center',
          key: 'signTime',
          width: 120
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
          width: 180
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
          width: 160,
          fixed: 'right',
          render: (h, params) => {
            if (params.row.status == 2) {
	          return h('div', [
                h('a',
                  {
                    on: {
                      click: () => {
                        // this.toPage(params.row)
                        this.getViewUrl(params.row.contractNo)
                      }
                    }
                  },
                '详情'),
                h('a',
                  {
                    style: 'padding-left:10px',
                    on: {
                      click: () => {
                        this.seals = [params.row.id]
                        this.sendSeals()
                      }
                    }
                  },
                '发起'),
                h('a',
                  {
                    style: 'padding-left:10px',
                    on: {
                      click: () => {
                        this.reSendId = params.row.contractNo
                        this.reSendModal = true
                      }
                    }
                  },
                '重新发起'),
              ])
            } else {
	          return h('div', [
                h('a',
                  {
                    on: {
                      click: () => {
                        // this.toPage(params.row)
                        this.getViewUrl(params.row.contractNo)
                      }
                    }
                  },
                '详情'),
                h('span', {
                  attrs: {
                    style: 'color:#c5c8ce;padding-left:10px'
                  }},
                  '发起'),
                h('a',
                  {
                    style: 'padding-left:10px',
                    on: {
                      click: () => {
                        this.reSendId = params.row.contractNo
                        this.reSendModal = true
                      }
                    }
                  },
                '重新发起'),
              ])
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
      ]
    }
  },
  methods: {
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
    changePage(page) {
      this.dataRows = {}
      this.loading = true
      this.pageInfo.current = page
      let data = {
        pageNum: page || 1,
        pageSize: this.pageInfo.page_size || 20
      }
      Object.assign(data, this.search)
      getContractSealList(data).then(res => {
        const data = res.data
        this.loading = false
        if (data.code === 200) {
          this.pageInfo.total = data.data.total
          this.pageInfo.current = data.data.pageNum
          this.pageInfo.page_size = data.data.pageSize
          this.dataRows = setSerialNum(data.data.list, this.pageInfo)
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })
    },
    getContractSubjectList() {
      getContractSubjectList({}).then(res => {
        const data = res.data
        if (data.code === 200) {
          this.coms = data.data
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })
    },
    getSelectAll() {
      // 合同版本 sel3
      getTemplateList({type: 'ALL'}).then(res => {
        const data = res.data
        if (data.code === 200) {
          this.sel3 = data.data.result
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })

      // 状态 sel8
      selectType({type: 7}).then(res => {
        const data = res.data
        if (data.code === 200) {
          this.sel8 = data.data
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })
    },
    setSeals(sels) {
      console.log(sels)
      this.seals = []
      
      if (sels) {
        for (let i = 0; i < sels.length; i++) {
          this.seals.push(sels[i]['id'])
        }
      }
    },
    sendSeals() {
      if (this.seals.length == 0) {
        this.$Message.error('发起失败：请选择发起项')
        return
      }
      let data = {
        ids: this.seals
      }
      sendOaSeals(data).then(res => {
        const data = res.data
        if (data.code === 200) {
          this.$Message.success('发起成功！')
          this.changePage(1)
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })
    },
    reSendSign() {
      let data = {contractNo: this.reSendId}
      reSendSign(data).then(res => {
        const data = res.data
        if (data.code === 200) {
          this.$Message.success('发起成功！')
          this.changePage(1)
        } else {
          this.$Message.error('发起失败：' + data.message)
        }
      })     
    },
    toPage(row) {
      let query = {
        emplid: row.emplid,
      }
      this.$router.push({name: 'contract_seal_detail', query: query})
    },
    getViewUrl(no) {
      let data = { bizId: no }
      getViewUrl(data).then(res => {
        const data = res.data
        if (data.code === 200) {
          if (data.data) {
            window.open(data.data)
          } else {
            this.$Message.error('查找不到对应详情页！')
          }
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })
    },
  },
  mounted() {
    this.customTitle([])
    this.getSelectAll()
    this.changePage()
    this.getContractSubjectList()

    this.tableHeight = window.innerHeight - this.$refs.selection.$el.offsetTop - 90
  }
}
</script>

<style>
.contract-seal-list {
  padding: 20px;
}
.com-ctr {
  display: inline-block;
  padding-right: 30px;
  padding-bottom: 20px;
}
</style>
