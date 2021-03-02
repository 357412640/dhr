<template>
  <div class="common-style administrator-box">
    <common-header title="管理人员" :back="true"></common-header>
    <div style="padding: 20px">
      <Row>
        <Form :model="form" :label-width="80">
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
          <Col span="4" style="min-width: 180px;">
            <FormItem label="" :label-width="0" class="margin-left-0">
              <Button type="primary" style="margin-right: 20px" @click="searchList">搜索</Button>
              <Button @click="clearSearch">重置</Button>
            </FormItem>
          </Col>
        </Form>
      </Row>
      <div class="content-box">
        <div class="tab-des">
          <p v-show="tabVal === 'tab1'">
            本页展示人员符合条件：1.在考勤组数据权限内；2.尚未系统计算考勤；3.登录日所属自然月入职人员
          </p>
          <p v-show="tabVal === 'tab2'">
            本页展示人员符合条件：1.仍在考勤组数据权限内；2.仍在系统计算考勤；3.登录日所属自然月离职人员
          </p>
          <p v-show="tabVal === 'tab3'">
            本页展示人员符合条件：1.仍在考勤组数据权限内；2.从考勤档案移除；3.未在本系统进行组考勤管理；4.在职人员
          </p>
        </div>
        <Tabs v-model="tabVal" class="tab-box" style="height: 100%;" :animated="false" type="card" @on-click="changeTab">
          <TabPane label="本月入职" name="tab1">
            <tab1-content v-if="tabVal === 'tab1'" :dataInfo="dataInfo" :loading="loadingEntry" :wtrList="wtrList" @changePage="changePage" ></tab1-content>
          </TabPane>
          <TabPane label="本月离职" name="tab2">
            <tab2-content v-if="tabVal === 'tab2'" :dataInfo="dataInfo" :loading="loadingLeave" @changePage="changePage"></tab2-content>
          </TabPane>
          <TabPane label="全部未添加" name="tab3">
            <tab3-content v-if="tabVal === 'tab3'" :dataInfo="dataInfo" :loading="loadingNot" :wtrList="wtrList" @changePage="changePage"></tab3-content>
          </TabPane>
        </Tabs>
      </div>
    </div>
  </div>


</template>

<script>
  import CommonHeader from '@/components/header'
  import Tab1Content from './component/admin-tab1'
  import Tab2Content from './component/admin-tab2'
  import Tab3Content from './component/admin-tab3'
  import {getWorkTimeList, getEmployeeEntry, getEmployeeLeave, getEmployeeNot} from '@/api/file-attendance'

  const form = {
    emplid: '',
    name: '',
    workTimeRuleId: ''
  }

  const dataInfo = {
    entryList: [],
    leaveList: [],
    notList: [],
    pageInfo: {
      pageSize: 10,
      total: 0,
      pageNum: 1
    }
  }
  let tabVal = 'tab1'

  export default {
    components: {
      CommonHeader,
      Tab1Content,
      Tab2Content,
      Tab3Content
    },
    data() {
      return {
        loadingEntry: true,
        loadingLeave: true,
        loadingNot: true,
        searchInfo: {
          pageSize: 10,
          pageNum: 1 // 页码
        },
        form: JSON.parse(JSON.stringify(form)),
        pageInfo: {
          pageSize: 10,
          total: 0,
          pageNum: 1
        },
        wtrList: [],
        tabVal: 'tab1',
        dataInfo: JSON.parse(JSON.stringify(dataInfo))
      }
    },
    mounted() {
      this.workTimeList()
      this.searchList()
    },
    methods: {
      searchList() {
        // 保存当前搜索信息
        this.searchInfo = JSON.parse(JSON.stringify(this.form))
        this.changePage(1)
      },
      changePage(p) {
        this.dataInfo.entryList = []
        this.dataInfo.leaveList = []
        this.dataInfo.notList = []
        this.loadingEntry = true
        this.loadingLeave = true
        this.loadingNot = true
        // 根据保存的搜索信息搜索
        const data = {
          ...this.searchInfo,
          pageSize: this.pageInfo.pageSize,
          pageNum: p || 1
        }
        const tabVal = this.tabVal
        if (tabVal === 'tab1') {
          this.getEmployeeEntryList(data)
        } else if (tabVal === 'tab2') {
          this.getEmployeeLeaveList(data)
        } else if (tabVal === 'tab3') {
          this.getEmployeeNotList(data)
        }
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
      getEmployeeEntryList(data) {
        getEmployeeEntry(data).then(res => {
          const data = res.data
          if (data.code === 200) {
            let dataInfo = {}
            let pageInfo = {}
            pageInfo.pageNum = data.data.pageNum || 1
            pageInfo.pageSize = data.data.pageSize
            pageInfo.total = data.data.total
            dataInfo.pageInfo = pageInfo
            this.pageInfo = JSON.parse(JSON.stringify(pageInfo))
            dataInfo.entryList = data.data.list
            this.dataInfo = dataInfo
          } else {
            this.$Message.warning(`列表获取失败：${data.message}`)
          }
        }).finally(() => {
          this.loadingEntry = false
        })
      },
      getEmployeeLeaveList(data) {
        getEmployeeLeave(data).then(res => {
          const data = res.data
          if (data.code === 200) {
            let dataInfo = {}
            let pageInfo = {}
            pageInfo.pageNum = data.data.pageNum || 1
            pageInfo.pageSize = data.data.pageSize
            pageInfo.total = data.data.total
            dataInfo.pageInfo = pageInfo
            this.pageInfo = JSON.parse(JSON.stringify(pageInfo))
            dataInfo.leaveList = data.data.list
            this.dataInfo = dataInfo
          } else {
            this.$Message.warning(`列表获取失败：${data.message}`)
          }
        }).finally(() => {
          this.loadingLeave = false
        })
      },
      getEmployeeNotList(data) {
        getEmployeeNot(data).then(res => {
          const data = res.data
          if (data.code === 200) {
            let dataInfo = {}
            let pageInfo = {}
            pageInfo.pageNum = data.data.pageNum || 1
            pageInfo.pageSize = data.data.pageSize
            pageInfo.total = data.data.total
            dataInfo.pageInfo = pageInfo
            this.pageInfo = JSON.parse(JSON.stringify(pageInfo))
            dataInfo.notList = data.data.list
            this.dataInfo = dataInfo
          } else {
            this.$Message.warning(`列表获取失败：${data.message}`)
          }
        }).finally(() => {
          this.loadingNot = false
        })
      },
      changeTab() {
        if (tabVal !== this.tabVal) {
          tabVal = this.tabVal
          this.searchList()
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .administrator-box {
    .tab-des {
      display: inline-block;
      position: relative;
      left: 280px;
      top: 24px;
    }
  }
</style>
<style lang="less">
  .administrator-box {
    .ivu-tabs-bar {
      border-bottom: none;
      margin-bottom: 0;
    }
    .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab{
      background: #fff;
    }
    .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active{
      border: 1px solid #3399ff;
      border-bottom: none;
    }
    .ivu-tabs {
      overflow: inherit;
    }
    .ivu-tabs:after {
      display: block;
      content: '';
      height: 0;
      clear: both;
    }
  }
</style>
