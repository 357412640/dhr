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
        <Col span='4' offset="20">
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
      <Upload ref='uploadBox' type="drag" action="/contract/contract/ImportExcel" :on-success='respSuccess'>
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

    <Modal v-model="cancelModal" @on-ok="reSendSign" :closable="false">
      <div style='text-align:center;padding:20px'>
        <p><Icon type="md-alert" size=24 color='#ff9900' />是否作废？</p>
      </div>
    </Modal>
  </div>
</template>

<script>
import { Toinvalidlist, selectType, getContractTypeList, getTemplateList, sendSign, sendSigns } from '@/api/e-contract'
import { setSerialNum, deepClone, noDataLong } from '@/libs/util'

export default {
  data() {
    return {
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
          width: 100
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
          width: 100
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
          width: 80,
          render: (h, params) => {
            return h('span', this.statuss[params.row.status]['name'])
          }
        },
      ],
      statuss: [
        {id: 0, name: '待签署'},
        {id: 1, name: '待签署-签署中'},
        {id: 2, name: '待盖章'},
        {id: 3, name: '待盖章-进行中'},
        {id: 4, name: '合同完成'},
        {id: 5, name: '待用印'},
        {id: 6, name: '已作废'},
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
    respSuccess(res, file, fileList) {
      this.uploadMsgs = []
      console.log(res)
      if (res.code == 200) {
          if (res.data.length > 0) {
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
        this.dataRows = {}
      this.loading = true
      this.pageInfo.current = page
      let data = {
        pageNum: page || 1,
        pageSize: this.pageInfo.page_size || 20
      }
      
      if (!this.more) {
        data.condition = this.search.condition
      } else {
        Object.assign(data, this.search)
        data.condition = ''
      }

      Toinvalidlist(data).then(res => {
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
    sendSign(no) {
      let data = {contractNo: no}
      sendSign(data).then(res => {
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
      sendSigns(data).then(res => {
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
    }
  },
  mounted() {
    this.customTitle([])
    this.getSelectAll()
    this.changePage()

    this.tableHeight = window.innerHeight - this.$refs.selection.$el.offsetTop - 90
  }
}
</script>

<style>
.contract-sign-list {
  padding: 20px;
}
</style>
