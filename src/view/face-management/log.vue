<template>
  <div class='com-info-list'>
    <Form label-position='left' :label-width="100">
      <Row :gutter='40'>
        <Col span='12'>
          <FormItem label='操作时间：'>
            <DatePicker @on-change='getDate' type="datetimerange" placement="bottom-end" format='yyyy-MM-dd HH:mm:ss' placeholder="" style='width:100%'></DatePicker>
          </FormItem>
        </Col>
        <Col span='2'>
          <FormItem style=''>
            <Button icon="md-search" type="primary" @click='changePage(1)'>搜索</Button>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter='40'>
        <Col span='6'>
          <FormItem label='操作人账号：'>
            <Input v-model='search.admin' placeholder=''></Input>
          </FormItem>
        </Col>
        <Col span='6'>
          <FormItem label='操作对象PS：'>
            <Input v-model='search.psId' placeholder=''></Input>
          </FormItem>
        </Col>
      </Row>
    </Form>

    <Table :loading='loading' border ref="selection" :columns="dataCols" :data='dataRows'></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :page-size="pageInfo.page_size" :total="pageInfo.total" :current="pageInfo.page" @on-change="changePage"></Page>
      </div>
    </div>
  </div>
</template>

<script>
import { getLog } from '@/api/face-management'
import { setSerialNum, deepClone, noData } from '@/libs/util'

export default {
  data() {
    return {
      loading: false,
      pageInfo: {},
      search: {},
      dataRows: [],
      dataCols: [
        {
          title: '序号',
          align: 'center',
          width: 80,
          type: 'index'
        },
        {
          title: '操作人账号',
          align: 'center',
          key: 'admin',
        },
        {
          title: '操作时间',
          align: 'center',
          key: 'actionTime',
        },
        {
          title: '动作',
          align: 'center',
          key: 'action',
          render: (h, params) => {
            return h('span', '删除')
          }
        },
        {
          title: '操作对象PS',
          align: 'center',
          key: 'psId',
        },
        {
          title: '操作对象照片',
          align: 'center',
          key: 'faceCode',
          render: (h, params) => {
            if (params.row.faceCode) {
              return h('img', {
                attrs: {
                  src: 'data:image/png;base64,' + params.row.faceCode,
                  style: 'width:80px'
                }
              })
            } else {
              return h('span', '无')
            }
          }
        },
      ]
    }
  },
  methods: {
    getDate(e) {
      console.log(e)
      this.search.startDate = e[0]
      this.search.endDate = e[1]
    },
    changePage(page) {
      this.loading = true
      this.pageInfo.current = page

      let data = {
        admin: this.search.admin,
        psId: this.search.psId,
        startDate: this.search.startDate,
        endDate: this.search.endDate,
        pageNum: page || 1,
        pageSize: this.pageInfo.page_size || 20
      }
      getLog(data).then(res => {
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
  },
  mounted() {
    this.changePage()
  }
}
</script>

<style>
.com-info-list {
  padding: 20px;
}
</style>
