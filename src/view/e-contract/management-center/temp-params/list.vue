<template>
  <div class='temp-params-list'>
    <Row style='padding-bottom:20px'>
      <Col span='6' offset='18'>
        <Input prefix="ios-search" placeholder="输入关键字搜索" style="width: auto" />
      </Col>
    </Row>

    <Table :loading='loading' border :columns="dataCols" :data='dataRows'></Table>
  </div>
</template>

<script>
import { getTemplateList } from '@/api/e-contract'

export default {
  data() {
    return {
      loading: false,
      dataRows: [],
      dataCols: [
        {
          title: '序号',
          align: 'center',
          width: 100,
          type: 'index'
        },
        {
          title: '名称',
          align: 'center',
          key: 'title',
        },
        {
          title: '状态',
          align: 'center',
          key: 'status',
          render: (h, params) => {
            if (params.row.status == 1) {
              return h('span', '启用')
            } else {
              return h('span', '其它')
            }
          }
        },
        {
          title: '管理员',
          align: 'center',
          key: 'creator',
        },
        {
          title: '操作',
          align: 'center',
          key: '',
          render: (h, params) => {
            return h('div', [
              h('a',
                {
                  on: {
                    click: () => {
                      this.toPage('temp_params_edit', params.row)
                    }
                  }
                },
                '参数配置'),
            ])
          }
        },
      ]
    }
  },
  methods: {
    changePage(page) {
      this.loading = true
      let data = {
        type: 'ALL'
      }
      getTemplateList(data).then(res => {
        this.loading = false
        const data = res.data
        if (data.code === 200) {
          this.dataRows = data.data.result
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })
    },
    toPage (path, row) {
      let query = {
        id: row.id,
      }
      this.$router.push({name: path, query: query})
    },
  },
  mounted() {
    this.changePage()
  }
}
</script>

<style>
.temp-params-list {
  padding: 20px;
}
</style>
