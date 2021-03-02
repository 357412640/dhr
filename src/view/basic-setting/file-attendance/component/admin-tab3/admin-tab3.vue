<template>
  <div class="tab3-box">
    <Table :columns="columns" :data="data" stripe :loading="loading" :no-data-text="noData">
      <template slot-scope="{ row, index}" slot="workTime">
        <div v-if="!row.showWorkTime">
          <span>{{ row.workTimeRuleName || '——' }}</span>
          <Icon type="ios-create-outline"
                style="font-size: 16px;color:#1890ff;cursor: pointer;margin-left: 5px;"
                @click="showWorkTimeList(row)"/>
        </div>
        <div v-else>
          <Select v-model="row.workTimeRuleId" class="item-style" style="float: left;width: 142px;">
            <Option :value="item.id" v-for="item in wtrList" :key="item.id">{{item.name}}</Option>
          </Select>
          <Button type="text"
                  class="common-btn"
                  style="float: right;width: 30px;line-height: 30px;height: 30px;"
                  @click="saveWorkTime(row)">保存</Button>
        </div>
      </template>
      <template slot-scope="{ row, index}" slot="operate">
        <Button type="text" class="common-btn" @click="showAdministratorDrawers(row)" :disabled="row.hasWorkTime">快速排班</Button>
      </template>
    </Table>
    <div style="margin: 16px;overflow: hidden">
      <div style="float: right;">
        <Page :page-size="pageInfo.pageSize"
              :total="pageInfo.total"
              :current="pageInfo.pageNum"
              show-total
              @on-change="changePage"></Page>
        <!--            show-elevator-->
        <!--                  show-sizer-->
      </div>
    </div>
    <administrator-drawers :showDrawer="administratorDrawers" :date-val="datePicker" :title="administratorTitle" :user-id-list="ids" @hide="hideAdministratorDrawers"></administrator-drawers>
  </div>
</template>

<script>
  import { noData } from '@/libs/util'
  import {updateWorkTime, deleteUser} from '@/api/file-attendance'
  import administratorDrawers from '../administrator-drawers'

  const getFirstAndLastDay = () => {
    const date = new Date()
    const year = date.getFullYear()
    let month = date.getMonth() + 1
    month = month < 10 ? '0' + month.toString() : month
    const firstDay = `${year}-${month}-01`

    const nextMonthFirstDay = new Date(year, month, 1)
    const oneDay = 1000*60*60*24
    const lastTime = new Date(nextMonthFirstDay-oneDay)
    const last = lastTime.getDate()
    const lastDay = `${year}-${month}-${last}`
    return [firstDay, lastDay]
  }

  export default {
    components: {
      administratorDrawers
    },
    props: {
      dataInfo: {
        type: Object,
        default() {
          return {
            list: [],
            pageInfo: {
              pageSize: 10,
              total: 0,
              pageNum: 1
            }
          }
        }
      },
      loading: {
        type: Boolean,
        default: true
      },
      wtrList: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        columns: [
          {
            align: 'center',
            title: '员工编号',
            key: 'emplid',
            width: 140
          },
          {
            align: 'center',
            title: '员工姓名',
            key: 'name',
            width: 140
          },
          {
            align: 'center',
            tooltip: true,
            title: '所属部门',
            key: 'deptChain',
            minWidth: 100
          },
          {
            align: 'center',
            title: '班次',
            slot: 'workTime',
            width: 220
          },
          {
            align: 'center',
            title: '入职日期',
            key: 'origHireDt',
            width: 140
          },
          {
            align: 'center',
            title: '离职日期',
            key: 'dimissionDt',
            width: 140
          },
          {
            align: 'center',
            title: '操作',
            slot: 'operate',
            width: 200
          }
        ],
        data: [],
        pageInfo: {
          pageSize: 10,
          total: 0,
          pageNum: 1
        },
        noData,
        ids: '',
        administratorTitle: '',
        administratorDrawers: false,
        datePicker: getFirstAndLastDay()
      }

    },
    watch: {
      dataInfo: {
        handler(newVal) {
          const list = newVal.notList
          if (list) {
            list.map(item => {
              item.showWorkTime = false
              if (item.workTimeRuleId) {
                item.hasWorkTime = false
              } else {
                item.hasWorkTime = true
              }
            })
            this.data = JSON.parse(JSON.stringify(list))
            this.pageInfo = newVal.pageInfo
          }
        },
        deep: true
      },
      loading(newVal) {
        this.loading = newVal
      }
    },
    mounted() {

    },
    methods: {
      changePage(p = 1) {
        this.data = []
        this.$emit('changePage', p)
      },
      showWorkTimeList(row) {
        row.showWorkTime = true
      },
      saveWorkTime(row) {
        const wtrId = row.workTimeRuleId
        const emplid = row.emplid
        if (wtrId) {
          const data = {
            emplid,
            wtrId
          }
          updateWorkTime(data).then(res => {
            const data = res.data
            if (data.code === 200) {
              this.$Message.success(`班次更新成功`)
              this.changePage(this.pageInfo.pageNum)
            } else {
              this.$Message.warning(`班次更新失败：${data.message}`)
            }
          })
        } else {
          this.$Message.warning(`请选择排班`)
        }
      },
      showAdministratorDrawers(row) {
        this.ids = row.emplid.toString()
        this.administratorTitle = `${row.name}（${row.emplid}）`
        this.administratorDrawers = true
      },
      hideAdministratorDrawers() {
        this.administratorDrawers = false
      },
    }
  }
</script>

<style lang="less" scoped>
  .tab3-box {
    .poptip-style {
      text-align: initial;
    }
  }
</style>
