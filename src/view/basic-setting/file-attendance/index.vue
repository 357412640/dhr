<template>
  <div class="attendance-file-box common-style">
    <Row>
      <Form :model="form" :label-width="80">
        <Col span="5">
          <FormItem label="考勤期间">
            <Select v-model="form.date" class="item-style">
              <Option :value="item" v-for="item in dateList" :key="item">{{item}}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="5">
          <FormItem label="员工姓名">
            <Input type="text" v-model.trim="form.name" placeholder="请输入" class="item-style"></Input>
          </FormItem>
        </Col>
        <Col span="5">
          <FormItem label="员工编号">
            <Input type="text" v-model.trim="form.emplid" placeholder="请输入" class="item-style"></Input>
          </FormItem>
        </Col>
        <Col span="5">
          <FormItem label="班次">
            <Select v-model="form.workTimeId" class="item-style">
              <Option :value="item.id" v-for="item in wtrList" :key="item.id">{{item.name}}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="4" style="min-width: 140px;">
          <FormItem label="" :label-width="0" class="margin-left-0">
            <Button type="primary" style="margin-right: 20px" @click="searchList">搜索</Button>
            <Button @click="clearSearch">重置</Button>
          </FormItem>
        </Col>
      </Form>
    </Row>
    <div>
      <Button type="primary" style="margin-right: 20px" @click="toAdministrator" v-if="hasPerm(71)">管理人员</Button>
      <Button type="primary" style="margin-right: 20px" @click="toList" v-if="hasPerm(72)">批量排班</Button>
      <Button @click="toUploadAndDown" v-if="hasPerm(73)">批量导入/导出</Button>
    </div>

    <div class="table-box">
      <Table :columns="columns"
             :data="data"
             stripe
             :loading="loading"
             :no-data-text="noData"
      >
        <template slot-scope="{ row, index}" slot="operate">
          <Button type="text" class="common-btn" @click="editRole(row)" v-if="hasPerm(20)">详情</Button>
          <Divider type="vertical" v-if="hasPerm(20)"/>
          <Poptip
            confirm
            title="移除后将无法对人员进行考勤管理，确定移除？"
            @on-ok="deleteUser(row.emplid)"
            class="poptip-style"
            placement="top-end"
            width="194"
            v-if="hasPerm(19)"
          >
            <Button type="text" class="common-btn">移除</Button>
          </Poptip>
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
    </div>
  </div>
</template>

<script>
  import { noData } from '@/libs/util'
  import {getWorkTimeList, getArchiveList, deleteUser} from '@/api/file-attendance'

  const getMonth = () => {
    const date = new Date()
    const year = date.getFullYear()
    let month = date.getMonth() + 1
    month = month.toString().length < 2 ? ('0' + month) : month
    return `${year}/${month}`
  }

  const form = {
    date: getMonth(),
    name: '',
    emplid: '',
    workTimeId: ''
  }

  const getMonthList = function () {
    const date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    const monthList = []
    for (let i = 0; i < 4; i++) {
      month = month.toString().length < 2 ? ('0' + month) : month
      monthList.push(`${year}/${month}`)
      month--
      if (month <= 0) {
        month = 12
        year--
      }
    }
    return monthList
  }

  export default {
    data() {
      return {
        searchInfo: {
          pageSize: 10,
          pageNum: 1 // 页码
        },
        form: JSON.parse(JSON.stringify(form)),
        columns: [
          {
            align: 'center',
            title: '员工编号',
            key: 'emplid',
            width: 120
          },
          {
            align: 'center',
            tooltip: true,
            title: '员工姓名',
            key: 'name',
            width: 180
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
            key: 'workTimeName',
            minWidth: 120,
            maxWidth: 180
          },
          {
            align: 'center',
            title: '入职日期',
            key: 'origHireDt',
            minWidth: 120,
            maxWidth: 160
          },
          {
            align: 'center',
            title: '离职日期',
            key: 'dimissionDt',
            minWidth: 120,
            maxWidth: 160
          },
          {
            align: 'center',
            title: '操作',
            slot: 'operate',
            width: 170
          }
        ],
        data: [],
        pageInfo: {
          pageSize: 10,
          total: 0,
          pageNum: 1
        },
        loading: false,
        noData: noData,
        dateList: getMonthList(),
        wtrList: []
      }
    },
    mounted() {
      this.workTimeList()
      this.searchList()
    },
    methods: {
      toAdministrator() {
        this.$router.push({
          name: 'administrator'
        })
      },
      toUploadAndDown() {
        this.$router.push({
          name: 'uploadAndDown-attendance'
        })
      },
      toList() {
        this.$router.push({
          name: 'list-attendance'
        })
      },
      searchList() {
        // 保存当前搜索信息
        this.searchInfo = JSON.parse(JSON.stringify(this.form))
        this.changePage(1)
      },
      changePage(p) {
        this.data = []
        this.loading = true
        // 根据保存的搜索信息搜索
        const data = {
          ...this.searchInfo,
          pageSize: this.pageInfo.pageSize,
          pageNum: p
        }
        getArchiveList(data).then(res => {
          const data = res.data
          if (data.code === 200) {
            if ( data.data && data.data.list && data.data.list.length) {
              this.data = data.data.list
            }
            this.pageInfo.pageNum = data.data.pageNum || 1
            this.pageInfo.pageSize = data.data.pageSize
            this.pageInfo.total = data.data.total
          } else {
            this.$Message.warning(`档案列表获取失败：${data.message}`)
          }
        }).finally(() => {
          this.loading = false
        })
      },
      clearSearch() {
        this.form = JSON.parse(JSON.stringify(form))
      },
      // 班次
      workTimeList() {
        this.wtrList = []
        getWorkTimeList().then(res => {
          const data = res.data
          if (data.code === 200) {
            this.wtrList = data.data
          } else {
            this.$Message.warning(`班次获取失败：${data.message}`)
          }
        })
      },
      editRole(row) {
        this.$router.push({
          name: 'detail-attendance',
          params: {
            info: JSON.stringify(row)
          }
        })
      },
      deleteUser(emplid) {
        const params = {
          emplid
        }
        deleteUser(params).then(res => {
          const data = res.data
          if (data.code === 200) {
            this.$Message.success('人员删除成功')
            this.changePage(this.pageInfo.pageNum)
          } else {
            this.$Message.warning(`人员删除失败：${data.message}`)
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">
  @import "../../../index";
  .attendance-file-box {
    padding: 20px;
    .table-box {
      margin-top: 20px;
    }
    .ivu-btn-text {
      border: none;
      color: @primary-color;
    }
    .ivu-btn-text:focus {
      border: none;
      -webkit-box-shadow: none;
      box-shadow: none;
    }
    .ivu-btn-text:hover {
      background-color: inherit;
    }
    .poptip-style {
      text-align: initial;
    }
    .ivu-table-wrapper {
      overflow: inherit;
    }
  }

</style>
<style lang="less">
  .attendance-file-box {
    .margin-left-0 {
      .ivu-form-item-content {
        padding-right: 0;
      }
    }
    .ivu-table-cell {
      height: 18px;
    }
  }
</style>
