<template>
  <div class='type-rank-list'>
    <div v-for='item in types' style='padding:4px 0px'>
      <Select @on-change='updateRow(item)' v-model='item.rankId' style="width:200px">
        <Option v-for="item in sel1" :value="item.code" :key="item.code">{{ item.bindValue }}</Option>
      </Select>
      <span> -- </span>
      <Select @on-change='updateRow(item)' v-model='item.contractTypeId' style="width:200px">
        <Option v-for="item in sel2" :value="item.id" :key="item.id">{{ item.typeName }}</Option>
      </Select>
      <span> -- </span>
      <Select @on-change='updateRow(item)' v-model='item.templateId' style="width:200px">
        <Option v-for="item in sel3" :value="item.id" :key="item.id">{{ item.title }}</Option>
      </Select>
      <i-Switch class='switch-row' :true-value=1 :false-value=2 v-model="item.status" @on-change='updateRow(item)' />
      <Icon @click='delRow(item.id)' type="ios-trash" size=26 style='cursor:pointer' />
    </div>

    <div style='width:40%;margin-top:10px;'>
      <Button type="dashed" long style='color:#169BD5;border-color:#169BD5' @click='addRow'>+添加</Button>
    </div>

    <Row style='margin-top:20px;display:none'>
      <Col span='6'>
        <div>
          <Button :loading="loading" type="primary" style="margin-right:8px" @click=''>保存</Button>
          <Button @click="">取消</Button>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
import { getContractTypeList, getTemplateList, selectType, getRankList, insertRank, updateRank, deleteRank } from '@/api/e-contract'

export default {
  data() {
    return {
      switch1: false,
      sel1: [],
      sel2: [],
      sel3: [],
      types: [],
      typeRow: {
        id: 0,
        rankId: 0,
        contractTypeId: 1,
        templateId: 0,
        status: 1
      }
    }
  },
  methods: {
    getList() {
      getRankList({}).then(res => {
        const data = res.data
        if (data.code === 200) {
          this.types = data.data.list
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })
    },
    getSelectAll() {
      getContractTypeList({}).then(res => {
        const data = res.data
        if (data.code === 200) {
          this.sel2 = data.data.list
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })

      selectType({type: 2}).then(res => {
        const data = res.data
        if (data.code === 200) {
          this.sel1 = data.data
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })

      getTemplateList({}).then(res => {
        const data = res.data
        if (data.code === 200) {
          this.sel3 = data.data.result
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })
    },
    addRow() {
      let data = {
        rankId: 0,
        rankName: '',
        contractTypeId: 1,
        contractTypeName: '',
        templateId: 0,
        templateName: '',
        status: 1
      }
      insertRank(data).then(res => {
        const data = res.data
        if (data.code === 200) {
          this.getList()
          console.log('添加成功')
        } else {
          this.$Message.error('添加失败：' + data.message)
        }
      })   
    },
    updateRow(row) {
      console.log(row)
      let data = row

      data['rankName'] = this.getRankNameById(data.rankId)
      data['contractTypeName'] = this.getContractTypeNameById(data.contractTypeId)
      data['templateName'] = this.getTemplateNameById(data.templateId)

      updateRank(data).then(res => {
        const data = res.data
        if (data.code === 200) {
          console.log('更新成功')
        } else {
          this.$Message.error('更新失败：' + data.message)
        }
      })
    },
    delRow(id) {
      let data = {
        id: id
      }
      deleteRank(data).then(res => {
        const data = res.data
        if (data.code === 200) {
          this.getList()
          console.log('删除成功')
        } else {
          this.$Message.error('删除失败：' + data.message)
        }
      })
    },
    getRankNameById(id) {
      let name = ''
      let sel1 = this.sel1

      for (let i = 0; i < sel1.length; i++) {
        if (id == sel1[i]['code']) {
          name = sel1[i]['bindValue']
        }
      }

      return name
    },
    getContractTypeNameById(id) {
      let name = ''
      let sel2 = this.sel2

      for (let i = 0; i < sel2.length; i++) {
        if (id == sel2[i]['id']) {
          name = sel2[i]['typeName']
        }
      }

      return name
    },
    getTemplateNameById(id) {
      let name = ''
      let sel3 = this.sel3

      for (let i = 0; i < sel3.length; i++) {
        if (id == sel3[i]['id']) {
          name = sel3[i]['title']
        }
      }

      return name
    }
  },
  mounted() {
    this.getSelectAll()
    this.getList()
  }
}
</script>

<style>
.type-rank-list {
  padding: 20px;
}
.switch-row {
  margin-left: 10px;
  margin-right: 10px;
}
</style>
