<template>
  <div class='type-ctrl-list'>
    <Row style='padding-bottom:20px'>
      <Col span='6'>
        <Tabs value="name1">
          <TabPane label="合同类型" name="name1"></TabPane>
          <!-- <TabPane label="协议类型" name="name2"></TabPane> -->
          <!-- <TabPane label="证明类" name="name3"></TabPane> -->
        </Tabs>
      </Col>
      <Col span='3' offset='15'>
        <div>
          <Button type="primary" @click='editType(0)'>添加合同类型</Button>
        </div>
      </Col>
    </Row>

    <Table :loading='loading' border :columns="dataCols" :data="dataRows"></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :page-size="pageInfo.page_size" :total="pageInfo.total" :current="pageInfo.page" @on-change="changePage"></Page>
      </div>
    </div>

    <Modal v-model="modal1" :title="draTitle" @on-ok="saveContractType" @on-cancel="cancel">
        <Form :label-width="80">
          <FormItem label="名称">
            <Input v-model='formData.typeName' placeholder="请输入合同类型名称"></Input>
          </FormItem>
          <FormItem label="PS合同版本">
            <Input v-if='formData.id' v-model='formData.contractVersion' disabled></Input>
            <Input v-else v-model='formData.contractVersion' placeholder=""></Input>
          </FormItem>
          <FormItem label="状态">
            <RadioGroup v-model='formData.typeStatus'>
                <Radio label=1>启用</Radio>
                <Radio label=2>停用</Radio>
            </RadioGroup>
          </FormItem>
        </Form>
    </Modal>
  </div>
</template>

<script>
import { getContractTypeList, getContractType, insertContractType, updateContractType, deleteContractType } from '@/api/e-contract'
import { setSerialNum, deepClone, noData } from '@/libs/util'

export default {
  data() {
    return {
      loading: false,
      draTitle: '',
      pageInfo: {},
      modal1: false,
      formData: {
        typeName: '',
        typeStatus: '1',
        contractVersion: ''
      },
      dataRows: [],
      dataCols: [
        {
          title: '序号',
          align: 'center',
          type: 'index',
        },
        {
          title: '合同类型',
          align: 'center',
          key: 'typeName',
        },
        {
          title: '创建日期',
          align: 'center',
          key: 'createTime',
        },
        {
          title: '创建人',  
          align: 'center',
          key: 'createUser',
        },
        {
          title: '状态',  
          align: 'center',
          render: (h, params) => {
            if (params.row.typeStatus == 1) {
              return h('span', '启用')
            } else {
              return h('span', '停用')
            }
          }
        },
        {
          title: 'PS合同版本',  
          align: 'center',
          key: 'contractVersion',
        },
        {
          title: '操作',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('a',
                {
                  on: {
                    click: () => {
                      this.editType(params.row.id)
                    }
                  }
                },
                '编辑'),
              h('a',
                {
                  on: {
                    click: () => {
                      this.delType(params.row.id)
                    }
                  },
                  style: 'padding-left:10px;'
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
        pageNum: page || 1,
        pageSize: this.pageInfo.page_size || 20
      }
      getContractTypeList(data).then(res => {
        this.loading = false
        const data = res.data
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
    insertContractType() {
      let data = this.formData
      insertContractType(data).then(res => {
        const data = res.data
        if (data.code === 200) {
          this.$Message.success('保存成功！')
          this.changePage()
        } else {
          this.$Message.error('保存失败：' + data.message)
        }
      })
    },
    updateContractType() {
      let data = {
        id: this.formData.id,
        typeName: this.formData.typeName,
        typeStatus: this.formData.typeStatus
      }
      updateContractType(data).then(res => {
        const data = res.data
        if (data.code === 200) {
          this.$Message.success('保存成功！')
          this.changePage()
        } else {
          this.$Message.error('保存失败：' + data.message)
        }
      })
    },
    editType(id) {
      this.draTitle = '添加合同类型'
      this.formData = {
        typeName: '',
        typeStatus: '1',
        contractVersion: ''
      }
      this.modal1 = true

      if (id) {
        this.draTitle = '修改合同类型'

        let data = {
          id: id
        }
        getContractType(data).then(res => {
          const data = res.data
          if (data.code === 200) {
            this.formData = data.data
            this.formData.typeStatus = this.formData.typeStatus + ''
          } else {
            this.$Message.error('获取失败：' + data.message)
          }
        })
      }
    },
    saveContractType() {
      if (this.formData.id) {
        this.updateContractType()
      } else {
        this.insertContractType()
      }
    },
    delType(id) {
      let data = {
        id: id
      }
      deleteContractType(data).then(res => {
        const data = res.data
        if (data.code === 200) {
          this.$Message.success('删除成功！')
          this.changePage()
        } else {
          this.$Message.error('删除失败：' + data.message)
        }
      })
    }
  },
  mounted() {
    this.changePage()
  }
}
</script>

<style>
.type-ctrl-list {
  padding: 20px;
}
</style>
