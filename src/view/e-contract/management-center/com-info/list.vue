<template>
  <div class='com-info-list'>
    <Form label-position='top'>
      <Row :gutter='40'>
        <Col span='8'>
          <FormItem label='法人单位名称'>
            <Input v-model='search.companyName' placeholder='请输入'></Input>
          </FormItem>
        </Col>
        <Col span='8'>
          <FormItem label='法定代表人'>
            <Input v-model='search.legalPerson' placeholder='请输入'></Input>
          </FormItem>
        </Col>
        <Col span='8'>
          <FormItem label='创建时间'>
            <DatePicker v-model='search.createtime' format='yyyy-MM-dd' type="date" placeholder="请选择开始时间" style="width: 160px"></DatePicker>
            <span> - </span>
            <DatePicker v-model='search.endtime' format='yyyy-MM-dd' type="date" placeholder="请选择结束时间" style="width: 160px"></DatePicker>
          </FormItem>
        </Col>
      </Row>
      <FormItem style='text-align:center;'>
        <Button type="primary" @click='loadData()'>查询</Button>
        <Button style="margin-left: 8px" @click='clear'>重置</Button>
      </FormItem>
    </Form>

    <div style='margin-bottom:8px'>
      <Row>
        <Col span='6'>
          <div>
            <Button icon="md-add" type="primary" @click='toPage'>添加认证</Button>
          </div>
        </Col>
        <Col span='2' offset='16'>
          <div style='float:right;'>
            <Button type="primary" @click='refreshList'>刷新</Button>
          </div>
        </Col>
      </Row>
    </div>
    <Table :loading='loading' border ref="selection" :columns="dataCols" :data='dataRows'></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :page-size="pageInfo.page_size" :total="pageInfo.total" :current="pageInfo.page" @on-change="changePage"></Page>
      </div>
    </div>
  </div>
</template>

<script>
import { getCompanyList, refreshList } from '@/api/e-contract'
import { setSerialNum, deepClone, noData } from '@/libs/util'

export default {
  data() {
    return {
      loading: false,
      search: {},
      pageInfo: {},
      dataRows: [],
      dataCols: [
        {
          title: '序号',
          align: 'center',
          width: 80,
          key: 'number',
        },
        {
          title: '法人单位名称',
          align: 'center',
          key: 'companyName',
        },
        {
          title: '认证类型',
          align: 'center',
          key: 'tenantType',
          render: (h, params) => {
            return h('span', '企业法人')
          }
        },
        {
          title: '认证状态',
          align: 'center',
          key: 'status',
        },
        {
          title: '审核状态',
          align: 'center',
          key: 'status',
        },
        {
          title: '法人代表',
          align: 'center',
          key: 'legalPerson',
        },
        {
          title: '创建时间',
          align: 'center',
          key: 'createtime',
        },
      ]
    }
  },
  methods: {
    toPage() {
      window.open('http://sign.gome.inc/companyuser')
    },
    loadData() {
      this.loading= true
      let data = this.search
      getCompanyList(data).then(res => {
        const data = res.data
        this.loading = false
        if (data.code === 200) {
          this.pageInfo.total = data.data.length
          this.pageInfo.current = 1
          this.pageInfo.page_size = 20
          this.pageInfo.data = data.data
          this.changePage(this.pageInfo.current)     
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })
    },
    changePage(page) {
      this.pageInfo.current = page

      let list = []
      let data = this.pageInfo.data
      let size = this.pageInfo.page_size
      let start = (page - 1) * size
      let end = start + size < this.pageInfo.total ? start + size : this.pageInfo.total
      for (let i = start; i < end; i++) {
          list.push(data[i])
      }
      console.log(this.pageInfo)
      console.log(data)
      console.log(list)
      this.dataRows = setSerialNum(list, this.pageInfo)
    },
    refreshList() {
      let data = {}
      refreshList(data).then(res => {
        this.$Message.success('刷新成功！')
        this.loadData()
      })
    },
    clear() {
      this.search = {}
      this.loadData()
    }
  },
  mounted() {
    this.loadData()
  }
}
</script>

<style>
.com-info-list {
  padding: 20px;
}
</style>
