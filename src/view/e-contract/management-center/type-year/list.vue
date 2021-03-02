<template>
  <div class='type-rank-list'>
    <div v-for='item in types' style='padding:4px 0px'>
      <Select @on-change='updateRow(item)' v-model='item.contractTypeId' style="width:200px">
        <Option v-for="item in sel1" :value="item.id" :key="item.id">{{ item.typeName }}</Option>
      </Select>
      <span> -- </span>
      <Select @on-change='updateRow(item)' v-model='item.baseConfigConf' style="width:200px">
        <Option v-for="item in sel2" :value="item.id" :key="item.id">{{ item.bindValue }}</Option>
      </Select>
      <span> -- </span>
      <Select @on-change='updateRow(item)' v-model='item.baseConfigYears' style="width:200px">
        <Option v-for="item in sel3" :value="item.id" :key="item.id">{{ item.bindValue }}</Option>
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
import { getContractTypeList, selectType, getYearSelectAll, insertSelective, updateByPrimaryKeySelective, deleteByPrimaryKey } from '@/api/e-contract'

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
        contractTypeId: 0,
        baseConfigConf: 0,
        baseConfigYears: 0,
        status: 0
      }
    }
  },
  methods: {
    getList() {
      getYearSelectAll({}).then(res => {
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
          this.sel1 = data.data.list
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })

      selectType({type: 4}).then(res => {
        const data = res.data
        if (data.code === 200) {
          this.sel2 = data.data
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })

      selectType({type: 3}).then(res => {
        const data = res.data
        if (data.code === 200) {
          this.sel3 = data.data
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })
    },
    addRow() {
      let data = {
        contractTypeId: 0,
        baseConfigConf: 0,
        baseConfigYears: 0,
      }
      insertSelective(data).then(res => {
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
      updateByPrimaryKeySelective(data).then(res => {
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
      deleteByPrimaryKey(data).then(res => {
        const data = res.data
        if (data.code === 200) {
          this.getList()
          console.log('删除成功')
        } else {
          this.$Message.error('删除失败：' + data.message)
        }
      })
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
