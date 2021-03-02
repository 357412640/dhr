<template>
  <div class='use-seal-list'>
    <Row>
      <Col span='6'>
        <Tabs value="1" @on-click='changeTab'>
          <TabPane label="待盖章" name="1"></TabPane>
          <TabPane label="已盖章" name="2"></TabPane>
        </Tabs>
      </Col>
      <Col span='6' offset='12'>
        <Input v-model='searchKey' @on-change='searchList' prefix="ios-search" placeholder="请输入搜索内容" style="width: auto" />
      </Col>
    </Row>

    <div v-if='tabs == 1'>
      <Row style='margin-bottom:8px'>
        <Col span='6'>
          <div>
            <Button type="primary" @click='sendSeals'>盖章</Button>
          </div>
        </Col>
      </Row>
      <Table :loading='loading1' :max-height="tableHeight" @on-selection-change='setSeals' border ref="selection" :columns="dataCols1" :data='dataRows1'></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :page-size="pageInfo1.page_size" :total="pageInfo1.total" :current="pageInfo1.page" @on-change="changePage1"></Page>
        </div>
      </div>
    </div>
    <div v-else>
      <Table :loading='loading2' :max-height="tableHeight" border ref='selection2' :columns="dataCols2" :data='dataRows2'></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :page-size="pageInfo2.page_size" :total="pageInfo2.total" :current="pageInfo2.page" @on-change="changePage2"></Page>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getContractSealList, getContractSuccessList, sendSeal, sendSeals, getContractWaitList } from '@/api/e-contract'
import { setSerialNum, deepClone, noData } from '@/libs/util'

export default {
  data() {
    return {
      loading1: false,
      loading2: false,
      tableHeight: 420,
      tabs: 1,
      seals: [],
      pageInfo1: {},
      pageInfo2: {},
      dataRows1: [],
      dataRows2: [],
      dataCols1: [
        {
          title: '选择框',
          type: 'selection',
          align: 'center',
          width: 60,
        },
        {
          title: '序号',
          align: 'center',
          width: 100,
          key: 'number'
        },
        {
          title: '合同甲方',
          align: 'center',
          key: 'subject',
        },
        {
          title: '法人',
          align: 'center',
          key: 'legalperson',
        },
        {
          title: '合同类型',
          align: 'center',
          key: 'contractchildtype',
        },
        {
          title: '员工姓名',
          align: 'center',
          key: '',
          render: (h, params) => {
            return h('span', params.row.staff.name)
          }
        },
        {
          title: '申请人',
          align: 'center',
          key: 'createUser',
        },
        {
          title: '创建日期',
          align: 'center',
          key: 'createTime',
        },
        {
          title: '状态',
          align: 'center',
          key: 'status',
          render: (h, params) => {
            return h('span', this.statuss[params.row.status]['name'])
          }
        },
        {
          title: '操作',
          align: 'center',
          key: '',
          render: (h, params) => {
            if (params.row.status == 5) {
	      return h('div', [
		h('a',
		  {
		    on: {
		      click: () => {
			this.sendSeal(params.row.contractNo, params.row.subject)
		      }
		    }
		  },
		  '盖章'),
	      ])
            } else {
	      return h('div', [
		h('span', {
                  attrs: {
                    style: 'color:#c5c8ce'
                  }}, '盖章'),
	      ])
            }
          }
        },
      ],
      dataCols2: [
        {
          title: '序号',
          align: 'center',
          width: 100,
          key: 'number'
        },
        {
          title: '合同甲方',
          align: 'center',
          key: 'subject',
        },
        {
          title: '法人',
          align: 'center',
          key: 'legalperson',
        },
        {
          title: '合同类型',
          align: 'center',
          key: 'contractchildtype',
        },
        {
          title: '员工姓名',
          align: 'center',
          key: '',
          render: (h, params) => {
            return h('span', params.row.staff.name)
          }
        },
        {
          title: '申请人',
          align: 'center',
          key: 'createUser',
        },
        {
          title: '创建日期',
          align: 'center',
          key: 'createTime',
        },
        {
          title: '状态',
          align: 'center',
          key: 'status',
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
        {id: 5, name: '待用印'}
      ]
    }
  },
  methods: {
    changeTab(name) {
      this.tabs = name
      this.searchList()
    },
    searchList() {
      if (this.tabs == 1) {
        this.changePage1(1)
      } else {
        this.changePage2(1)
      }
    },
    changePage1(page) {
      this.loading1 = true
      this.pageInfo1.current = page
      let data = {
        name: this.searchKey,
        pageNum: page || 1,
        pageSize: this.pageInfo1.page_size || 20
      }
      getContractWaitList(data).then(res => {
        const data = res.data
        this.loading1 = false
        if (data.code === 200) {
          this.pageInfo1.total = data.data.total
          this.pageInfo1.current = data.data.pageNum
          this.pageInfo1.page_size = data.data.pageSize
          this.dataRows1 = setSerialNum(data.data.list, this.pageInfo1)
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })
    },
    changePage2(page) {
      this.loading2 = true
      this.pageInfo2.current = page
      let data = {
        name: this.searchKey,
        pageNum: page || 1,
        pageSize: this.pageInfo2.page_size || 20
      }
      getContractSuccessList(data).then(res => {
        const data = res.data
        this.loading2 = false
        if (data.code === 200) {
          this.pageInfo2.total = data.data.total
          this.pageInfo2.current = data.data.pageNum
          this.pageInfo2.page_size = data.data.pageSize
          this.dataRows2 = setSerialNum(data.data.list, this.pageInfo2)
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })
    },
    sendSeal(bizId, tenantName) {
      let data = {
        bizId: bizId,
        tenantName: tenantName
      }
      sendSeal(data).then(res => {
        const data = res.data
        if (data.code === 200) {
          this.$Message.success('盖章成功！')
          this.changePage(1)
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
          this.seals.push({
            bizId: sels[i]['contractNo'],
            tenantName: sels[i]['subject']
          })
        }
      }
    },
    sendSeals() {
      if (this.seals.length == 0) {
        this.$Message.error('发起失败：请选择发起项')
        return
      }
      let data = {
        cswList: this.seals
      }
      sendSeals(data).then(res => {
        const data = res.data
        if (data.code === 200) {
          this.$Message.success('盖章成功！')
          this.changePage(1)
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })
    },
  },
  mounted() {
    this.changeTab(1)
    // this.changePage1()
    // this.changePage2()
    this.tableHeight = window.innerHeight - this.$refs.selection.$el.offsetTop - 90
  }
}
</script>

<style>
.use-seal-list {
  padding: 20px;
}
</style>
