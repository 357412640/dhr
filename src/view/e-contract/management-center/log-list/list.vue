<template>
  <div class='com-info-list'>
    <Form label-position='top'>
      <Row :gutter='40'>
        <Col span='8'>
          <FormItem label='管理PSID'>
            <Input v-model='search.oprid' placeholder='请输入'></Input>
          </FormItem>
        </Col>
        <Col span='8'>
          <FormItem label='权限ID'>
            <Input v-model='search.emplid' placeholder='请输入'></Input>
          </FormItem>
        </Col>
      </Row>
      <FormItem style='text-align:center;'>
        <Button type="primary" @click='changePage(1)'>查询</Button>
        <Button style="margin-left: 8px" @click='clear'>重置</Button>
      </FormItem>
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
import { getLogList } from '@/api/e-contract'
import { setSerialNum } from '@/libs/util'

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
          title: '管理PSID',
          align: 'center',
          key: 'oprid',
        },
        {
          title: '权限ID',
          align: 'center',
          key: 'emplid',
        },
        {
          title: '推送日期',
          align: 'center',
          key: 'gmIntDt',
        },
        {
          title: '接收日期',
          align: 'center',
          key: 'createTime',
        }
      ]
    }
  },
  methods: {
    changePage(page) {
      this.loading= true
      this.pageInfo.current = page
      let data = {
        oprid: this.search.oprid,
        emplid: this.search.emplid,
        pageNum: page || 1,
        pageSize: this.pageInfo.page_size || 20
      }
      getLogList(data).then(res => {
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
    clear() {
      this.search = {}
      this.changePage(1)
    }
  },
  mounted() {
    this.changePage(1)
  }
}
</script>

<style>
.com-info-list {
  padding: 20px;
}
</style>
