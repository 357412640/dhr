<template>
  <div class="list-attendance-box common-style">
    <common-header title="批量排班" :back="true"></common-header>
    <div style="padding: 20px">
      <Row>
        <Form :model="form" :label-width="90">
          <Col span="2" style="min-width: 150px;">
            <Button @click="showDrawer">选择人员（{{ listTotal ? listTotal + '人' : '全员' }}）</Button>
          </Col>
          <Col span="7" style="min-width: 300px;">
            <FormItem label="选择期间">
              <DatePicker split-panels :value="datePicker" type="daterange" format="yyyy-MM-dd"  :editable="false" placeholder="请选择" style="width: 200px" @on-change="getDatePicker"></DatePicker>
            </FormItem>
          </Col>
          <Col span="2" style="min-width: 150px;">
            <FormItem label="" :label-width="10">
              <Checkbox v-model="form.status " class="item-style">仅看未排班</Checkbox>
            </FormItem>
          </Col>
          <Col span="5" style="min-width: 240px;">
            <FormItem label="" :label-width="0">
              <Button type="primary" style="margin-right: 20px" @click="searchList">搜索</Button>
              <Button type="primary" style="margin-right: 20px" @click="showArrangeDrawers">排班</Button>
<!--              <Button @click="clearSearch">导出</Button>-->
            </FormItem>
          </Col>
        </Form>
      </Row>

      <div class="table-box">
        <div style="margin-bottom: 10px;padding-left: 5px;">
            <Badge status="success" text="入职日" style="margin-right: 20px" />
            <Badge status="error" text="离职日" />
        </div>
        <Table :columns="columns"
               :data="data"
               stripe
               border
               :loading="loading"
               :no-data-text="noData"
        >
          <template slot-scope="{ row, index}" :slot="status" v-for="status in arrangeDate">
            <Badge status="success" v-if="row[status].origHireStatus === 1" />
            <Badge status="error" v-if="row[status].dimissionStatus === 1" />
            <span v-if="row[status].type === 0">{{ row[status].workName || '工作日' }}</span>
            <span v-else-if="row[status].type === 1">{{ row[status].workName || '调休工作日' }}</span>
            <span v-else-if="row[status].type === 2">公休</span>
            <span v-else-if="row[status].type === 3">{{ row[status].vacationName }}</span>
            <span v-else-if="row[status].type === 4">{{ row[status].vacationName }}</span>
            <span v-else-if="row[status].type === 5">未排班</span>
          </template>
        </Table>
        <div style="margin: 16px;overflow: hidden">
          <div style="float: right;">
            <Page :page-size="pageInfo.pageSize"
                  :total="pageInfo.total"
                  :current="pageInfo.pageNum"
                  show-total
                  @on-change="changePage"></Page>

            <!--                  show-elevator-->
            <!--                  show-sizer-->
          </div>
        </div>
      </div>
    </div>

    <list-drawers :showDrawer="drawer" @hide="hideDrawer" @save="saveSelectUserList"></list-drawers>
    <arrange-drawers :showDrawer="arrangeDrawers" :date-val="datePicker" :user-id-list="form.ids" @hide="hideArrangeDrawers"></arrange-drawers>
  </div>
</template>

<script>
  import CommonHeader from '@/components/header'
  import listDrawers from './component/list-drawers'
  import arrangeDrawers from './component/arrange-drawers'
  import { noData } from '@/libs/util'
  import {getPlanList} from '@/api/file-attendance'

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

  const columns = [
    {
      align: 'center',
      title: '员工编号',
      key: 'emplid',
      minWidth: 200
    },
    {
      align: 'center',
      title: '员工名称',
      key: 'name',
      minWidth: 180
    }
  ]

  const form = {
    status: true,
    ids: '',
    startTime: '',
    endTime: ''
  }

  export default {
    components: {
      listDrawers,
      CommonHeader,
      arrangeDrawers
    },
    data() {
      return {
        listTotal: 0,
        form: {
          status: true,
          ids: '',
          startTime: '',
          endTime: ''
        },
        datePicker: getFirstAndLastDay(),
        drawer: false,
        arrangeDrawers: false,
        noData,
        columns: [],
        data: [],
        pageInfo: {
          pageSize: 100,
          total: 0,
          pageNum: 1
        },
        loading: false,
        arrangeDate: []
      }
    },
    methods: {
      searchList() {
        // 保存当前搜索信息
        this.searchInfo = JSON.parse(JSON.stringify(this.form))
        this.searchInfo.status = this.searchInfo.status ? 1 : 2
        this.searchInfo.startTime = this.datePicker[0]
        this.searchInfo.endTime = this.datePicker[1]
        this.changePage(1)
      },
      changePage(p) {
        this.data = []
        this.loading = true
        // 根据保存的搜索信息搜索
        const params = {
          ...this.searchInfo,
          pageSize: this.pageInfo.pageSize,
          pageNum: p
        }
        getPlanList(params).then(res => {
          let data = res.data
          if (data.code === 200) {
            if (data.data && data.data.list && data.data.list.length) {
              data = data.data
              // 初始 表头
              const columns = [
                {
                  align: 'center',
                  title: '员工编号',
                  key: 'emplid',
                  minWidth: 200
                },
                {
                  align: 'center',
                  title: '员工名称',
                  key: 'name',
                  minWidth: 180
                }
              ]
              // 初始数据结构
              const week = ['日', '一', '二', '三', '四', '五', '六']
              const arrangeDate = []

              const table = []
              data.list.forEach((item, index) => {
                const obj = {
                  name: item.name,
                  emplid: item.emplid
                }
                const list = item.list
                list.forEach(li => {
                  const date = new Date(li.day)
                  const month = date.getMonth() + 1
                  const day = date.getDate()
                  // 根据第一个设置表头
                  if (index === 0) {
                    let item = {
                      title: week[date.getDay()],
                      align: 'left',
                      children: [
                        {
                          title: `${month}/${day}`,
                          slot: `${month}/${day}`,
                          align: 'center',
                          width: 100
                        }
                      ]
                    }
                    arrangeDate.push(`${month}/${day}`)
                    columns.push(item)
                  }
                  // 每个人对应天的排班情况
                  obj[`${month}/${day}`] = {}
                  obj[`${month}/${day}`] = li
                })
                table.push(obj)
              })
              this.columns = columns
              this.arrangeDate = arrangeDate
              this.data = table
            }
            this.pageInfo.pageNum = data.pageNum || 1
            this.pageInfo.pageSize = data.pageSize
            this.pageInfo.total = data.total
          } else {
            this.$Message.warning(`人员排班列表获取失败：${data.message}`)
          }
        }).finally(() => {
          this.loading = false
        })
      },
      clearSearch() {
        this.form = JSON.parse(JSON.stringify(form))
      },
      showDrawer() {
        this.drawer = true
      },
      hideDrawer() {
        this.drawer = false
      },
      showArrangeDrawers() {
        this.arrangeDrawers = true
      },
      hideArrangeDrawers() {
        this.arrangeDrawers = false
      },
      saveSelectUserList(userIdList) {
        this.form.ids = userIdList.join(',')
        this.listTotal = userIdList.length
        this.drawer = false
      },
      getDatePicker(val) {
        this.datePicker = val
      }
    },
    mounted() {
      this.searchList()
    }
  }
</script>

<style scoped>
  .list-attendance-box {
  }
</style>
