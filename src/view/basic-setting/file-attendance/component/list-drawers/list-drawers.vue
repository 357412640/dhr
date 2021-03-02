<template>
  <div>
    <Drawer :mask-closable="false" title="选择人员" width="640" v-model="drawer1" @on-close="hideDrawer1" class="drawer-box common-style">
      <Form :model="form" :label-width="80">
        <Collapse simple v-model="showPanel">
          <Panel name="1">
            基础搜索
            <div slot="content">
              <FormItem label="人员班次">
                <Select v-model="form.wtrId" style="max-width:200px;font-size: 14px;">
                  <Option :value="item.id" v-for="item in wtrList" :key="item.id">{{item.name}}</Option>
                </Select>
              </FormItem>
              <FormItem label="入职日期">
                <DatePicker split-panels v-model="origHireDt" type="daterange" format="yyyy-MM-dd"  :editable="false" placeholder="请选择" style="width: 200px" @on-change="getOrigHireDt"></DatePicker>
              </FormItem>
              <FormItem label="离职日期">
                <DatePicker split-panels v-model="dimissionDt" type="daterange" format="yyyy-MM-dd"  :editable="false" placeholder="请选择" style="width: 200px" @on-change="getDimissionDt"></DatePicker>
              </FormItem>
            </div>
          </Panel>
          <Panel name="2">
            更多搜索
            <div slot="content">
              <FormItem label="部门编码">
                <Input v-model.trim="form.deptId" placeholder="请输入" class="item-style" style="max-width:200px;"></Input>
              </FormItem>
              <Row>
                <Col span="12">
                  <FormItem label="姓名">
                    <Input v-model.trim="form.name" placeholder="请输入" class="item-style" style="max-width:200px;"></Input>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="人员编码">
                    <Input v-model.trim="form.emplid" placeholder="请输入" class="item-style" style="max-width:200px;"></Input>
                  </FormItem>
                </Col>
              </Row>
            </div>
          </Panel>
        </Collapse>
      </Form>
      <div class="bottom-btn fixed w640">
        <Button type="text" style="margin-right: 20px" @click="clearDrawer1">清空筛选条件</Button>
        <Button style="margin-right: 20px" @click="searchDrawer2">查看明细</Button>
      </div>

    </Drawer>


    <Drawer :mask-closable="false" width="360" title="明细" v-model="drawer2" class="drawer-box common-style" @on-close="hideAllDrawer">
      <Card class="card">
        <div>
          <span style="padding-right: 5px;">
             <Icon type="ios-information-circle" class="icon" />
          </span>
          <span style="line-height: 1.5">您好，符合您筛选条件员工共计{{getDataTotal}}人，人员清单如下</span>
        </div>
      </Card>
      <Table :columns="columns"
             :data="data"
             stripe
             :loading="loading"
             :no-data-text="noData"
             style="margin-top: 20px"
      >
        <template slot-scope="{ row, index}" slot="operate">
          <Button type="text" style="margin-right: 10px" @click="deleteId(index)">移除</Button>
        </template>
      </Table>
      <div class="bottom-btn fixed">
        <Button style="margin-right: 20px" @click="hideDrawer2">上一步</Button>
        <Button type="primary" style="margin-right: 20px" @click="saveSelectUserList">确定</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
  import { noData } from '@/libs/util'
  import {getWorkTimeList, getPlanUserList} from '@/api/file-attendance'
  const form = {
    wtrId: '',
    origHireDtStartTime: '',
    origHireDtEndTime: '',
    dimissionDtStartTime: '',
    dimissionDtEndTime: '',
    deptId: '',
    name: '',
    emplid: ''
  }
  export default {
    props: {
      showDrawer: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        drawer1: false,
        drawer2: false,
        showPanel: '1',
        form: JSON.parse(JSON.stringify(form)),
        origHireDt: [],
        dimissionDt: [],
        noData,
        loading: false,
        columns: [
          {
            align: 'center',
            title: '员工编号',
            key: 'emplid',
            minWidth: 100
          },
          {
            align: 'center',
            title: '名称',
            key: 'name',
            minWidth: 100
          },
          {
            align: 'center',
            title: '操作',
            slot: 'operate',
            width: 100
          }
        ],
        data: [],
        dataTotal: 0,
        wtrList: [],
        saveInfo: {}
      }
    },
    watch: {
      showDrawer(newVal) {
        if (newVal) {
          this.drawer1 = true
          this.form = JSON.parse(JSON.stringify(this.saveInfo))
          this.origHireDt = [this.form.origHireDtStartTime, this.form.origHireDtEndTime]
          this.dimissionDt = [this.form.dimissionDtStartTime, this.form.dimissionDtEndTime]
        }
      }
    },
    computed: {
      getDataTotal() {
        return this.data.length
      }
    },
    methods: {
      hideDrawer1() {
        this.showPanel = '1'
        this.drawer1 = false
        this.$emit('hide')
      },
      clearDrawer1() {
        this.form = JSON.parse(JSON.stringify(form))
        this.origHireDt = []
        this.dimissionDt = []
      },
      searchDrawer2() {
        this.drawer2 = true
        this.loading = true
        this.data = []
        getPlanUserList(this.form).then(res => {
          const data = res. data
          if (data.code === 200) {
            this.data = data.data || []
          } else {
            this.$Message.warning(`人员明细列表获取失败：${data.message}`)
          }
        }).finally(() => {
          this.loading = false
        })
      },
      hideDrawer2() {
        this.drawer2 = false
        this.data = []
      },
      hideAllDrawer() {
        this.hideDrawer1()
        this.hideDrawer2()
      },
      deleteId(index) {
        this.data.splice(index, 1)
      },
      // 班次
      workTimeList() {
        this.wtrList = []
        getWorkTimeList({
          pageSize: 10000
        }).then(res => {
          const data = res.data
          if (data.code === 200) {
            this.wtrList = data.data
          } else {
            this.$Message.warning(`班次获取失败：${data.message}`)
          }
        })
      },
      getOrigHireDt(val) {
        this.form.origHireDtStartTime = val[0]
        this.form.origHireDtEndTime = val[1]
      },
      getDimissionDt(val) {
        this.form.dimissionDtStartTime = val[0]
        this.form.dimissionDtEndTime = val[1]
      },
      // 保存当前所选人数及id
      saveSelectUserList() {
        // 保存当前确认后的搜索条件
        this.saveInfo = JSON.parse(JSON.stringify(this.form))

        const userIdList = []
        this.data.forEach(user => {
          userIdList.push(user.emplid)
        })
        this.$emit('save', userIdList)
        this.drawer1 = false
        this.drawer2 = false
      }
    },
    mounted() {
      this.workTimeList()
    }
  }
</script>

<style lang="less" scoped>
  @import "../../../../../index";
  .drawer-box {
    position: relative;
    .ivu-collapse {
      border: none;
      font-size: 14px;
      .ivu-collapse-item {
        border: none;
        .ivu-collapse-header {
          padding-left: 0;
        }
      }
      .ivu-collapse-content-box {
        padding-bottom: 0;
      }
      .ivu-collapse-content {
        .ivu-form-item {
          margin-bottom: 0;
          margin-top: 15px;
        }
      }
    }
    .bottom-btn {
      margin-top: 20px;
      padding-top: 20px;
      padding-bottom: 20px;
      text-align: end;
      border-top: 1px solid #e8eaec;
      background-color: #fff;
    }
    .ivu-btn-text {
      border: none;
      color: @primary-color;
    }
    .ivu-btn-text:hover {
      background-color: inherit;
    }
    .card {
      border: 1px solid @primary-color;
      background-color: @primary-bgc-color;
    }
    .icon {
      color: @primary-color;
      font-size: 16px;
    }
    .fixed {
      width: 320px;
      position: fixed;
      bottom: 0;
      padding-bottom: 20px;
      z-index: 10;
      border-top: none;
    }
    .w640 {
      width: 600px;
    }
  }
</style>
<style lang="less">
  .drawer-box {
    .ivu-collapse>.ivu-collapse-item>.ivu-collapse-header>i {
      margin-right: 2px;
      font-size: 20px;
      margin-bottom: 5px;
    }
    .ivu-form-item-content {
      padding-right: 0;
    }
  }

</style>
