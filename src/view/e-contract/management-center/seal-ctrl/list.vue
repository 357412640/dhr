<template>
  <div class='seal-ctrl-list'>
    <Row style='padding-bottom:20px'>
      <Col span='6'>
        <div>
          <Button icon="md-add" type="primary" @click="toPage('seal_ctrl_edit', 0)">添加</Button>
        </div>
      </Col>
      <Col span='6' offset='12'>
        <Input @on-change='changePage(1)' v-model='condition' prefix="ios-search" placeholder="输入关键字搜索" style="width: auto" />
      </Col>
    </Row>

    <Table :loading='loading' :max-height="tableHeight" border ref="selection" :columns="dataCols" :data='dataRows'></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :page-size="pageInfo.page_size" :total="pageInfo.total" :current="pageInfo.page" @on-change="changePage"></Page>
      </div>
    </div>
  </div>
</template>

<script>
import { getSealList, updateSeal, getSealImg } from '@/api/e-contract'
import { setSerialNum, deepClone, noData } from '@/libs/util'

export default {
  data() {
    return {
      loading: false,
      tableHeight: 420,
      pageInfo: {},
      dataRows: [],
      condition: '',
      img: '',
      dataCols: [
        {
          title: '序号',
          align: 'center',
          width: 100,
          key: 'number'
        },
        {
          title: '印章',
          align: 'center',
          render: (h, params) => {
            console.log(params.row)
            return h('img', {
              attrs: {
                src: 'data:image/png;base64,' + params.row.sealImg,
                style: 'width:80px'
              }
            })
          }
        },
        {
          title: '印章名称',
          align: 'center',
          key: 'name',
        },
        {
          title: '法人单位',
          align: 'center',
          key: 'legalEntity',
        },
        {
          title: '印章类型',  
          align: 'center',
          key: 'sealType',
        },
        {
          title: '状态',  
          align: 'center',
          key: 'status',
          render: (h, params) => {
            if (params.row.status == 1) {
              return h('span', '启用')
            } else if (params.row.status == 0) {
              return h('span', '不启用')
            } else {
              return h('span', '删除')
            }
          }
        },
        {
          title: '操作',
          align: 'center',
          key: '',
          render: (h, params) => {
            let btnStr = ''
            if (params.row.status == 1) {
              btnStr = '停用'
            } else if (params.row.status == 0) {
              btnStr = '启用'
            }
            return h('div', [
              h('a',
                {
                  on: {
                    click: () => {
                      this.updateSeal(params.row.id, params.row.status)
                    }
                  }
                },
                btnStr),
              h('a',
                {
                  style: 'padding-left:10px',
                  on: {
                    click: () => {
                      this.updateSeal(params.row.id, 2)
                    }
                  }
                },
                '删除'),
            ])
          }
        },
      ]
    }
  },
  methods: {
    changePage(page) {
      this.loading = true
      this.pageInfo.current = page
      let data = {
        condition: this.condition,
        pageNum: page || 1,
        pageSize: this.pageInfo.page_size || 20
      }
      getSealList(data).then(res => {

        const data = res.data
        if (data.code === 200) {
          this.pageInfo.total = data.data.total
          this.pageInfo.current = data.data.pageNum
          this.pageInfo.page_size = data.data.pageSize

          let list = setSerialNum(data.data.list, this.pageInfo)
          this.getImgs(list).then(res => {
            this.dataRows = res
            this.loading = false
          })
        } else {
          this.loading = false
          this.$Message.error('获取失败：' + data.message)
        }
      })
    },
    updateSeal(id, status) {
      if (status < 2) {
        status = 1 - status
      }
      let data = {
        id: id,
        status: status
      }
      updateSeal(data).then(res => {
        const data = res.data
        if (data.code === 200) {
          this.changePage()
          this.$Message.success('修改成功！')
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })     
    },
    async getImgs(list) {
      for (let i = 0; i < list.length; i++) {
        let img = ''
        
        await this.getSealImgs(list[i]['qyssealid'], list[i]['legalEntity'], list, i).then(res => {
          img = res
        })
        list[i]['sealImg'] = img
      }

      return list
    },
    async getSealImgs(sealId, sealName, list, index) {
      let img = ''
      let data = {
        sealId: sealId,
        sealName: sealName
      }
      await getSealImg(data).then(res => {
        const data = res.data
        if (data.code === 200) {
          img = data.data
        }
      })

      return img
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

    this.tableHeight = window.innerHeight - this.$refs.selection.$el.offsetTop - 90
  }
}
</script>

<style>
.seal-ctrl-list {
  padding: 20px;
}
</style>
