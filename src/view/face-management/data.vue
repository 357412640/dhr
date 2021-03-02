<template>
  <div class='com-info-list'>
    <Form label-position='left' :label-width="80">
      <Row :gutter='40' type="flex" justify="center">
        <Col span='6'>
          <FormItem label='按PS号：'>
            <Input clearable v-model='search.psId' placeholder=''></Input>
          </FormItem>
        </Col>
        <Col span='2'>
          <FormItem>
            <Button style='margin-left:-80px' icon="md-search" type="primary" @click='changePage(1)'>搜索</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>

    <Table :loading='loading' border ref="selection" no-data-text='暂无数据<br>请使用用户的PSID进行查询' :columns="dataCols" :data='dataRows'></Table>

    <Modal v-model="delModal" @on-ok="delRow" :closable="false">
      <div style='text-align:center;padding:20px'>
        <p><Icon type="md-alert" size=24 color='#ff9900' />确定删除人脸记录信息吗？</p>
        <p>删除后用户需要重新录入人脸。</p>
      </div>
    </Modal>

    <Modal v-model="imgModal">
      <div style='text-align:center'>
        <img :src="faceCode" style='width:400px' />
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
import { getFace, delFace } from '@/api/face-management'

export default {
  data() {
    return {
      loading: false,
      imgModal: false,
      delModal: false,
      search: {},
      faceCode: '',
      dataRows: [],
      dataCols: [
        {
          title: '域账号',
          align: 'center',
          key: 'emailAddr'
        },
        {
          title: '姓名',
          align: 'center',
          key: 'name',
        },
        {
          title: 'PS号',
          align: 'center',
          key: 'psId',
        },
        {
          title: '部门',
          align: 'center',
          key: 'deptChain',
          width: '300'
        },
        {
          title: 'SAP号',
          align: 'center',
          key: 'sapId',
        },
        {
          title: '人脸照片',
          align: 'center',
          key: 'faceCode',
          render: (h, params) => {
            if (params.row.faceCode) {
              return h('img', {
                attrs: {
                  src: 'data:image/png;base64,' + params.row.faceCode,
                  style: 'width:80px'
                },
                on: {
                  click: () => {
                    this.faceCode = 'data:image/png;base64,' + params.row.faceCode
                    this.imgModal = true
                  }
                }
              })
            } else {
              return h('span', '无')
            }
          }
        },
        {
          title: '操作',
          align: 'center',
          render: (h, params) => {
            return h('a', {
              on: {
                click: () => {
                  this.delInfo = {
                    psId: params.row.psId,
                    faceCode: params.row.faceCode
                  }
                  this.delModal = true
                }
              }
            }, '删除记录')
          }
        },
      ]
    }
  },
  methods: {
    delRow() {
      let data = this.delInfo
      delFace(data).then(res => {
        const data = res.data
        if (data.code === 200) {
          this.delModal = false
          this.$Message.success('删除操作成功！')
        } else {
          this.$Message.error('删除失败：' + data.message)
        }
      })
    }, 
    changePage() {
      this.loading = true
      let data = this.search
      getFace(data).then(res => {
        const data = res.data
        this.loading = false
        if (data.code === 200) {
          this.dataRows = [data.data]
          if (!data.data) {
            this.$Message.warning('搜索的用户不存在人脸数据')
          }
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })
    },
  },
  mounted() {
    // this.changePage()
  }
}
</script>

<style>
.com-info-list {
  padding: 20px;
}
</style>
