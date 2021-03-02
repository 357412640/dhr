<template>
  <div class="arrange-drawers-box">
    <Drawer :mask-closable="false" title="排班" width="640" v-model="drawer1" @on-close="hideDrawer1" class="drawer-box common-style">
      <Card class="card">
        <Icon type="ios-information-circle" class="icon" />
        <p class="card-p">批量排班将按照以下规则执行</p>
        <p class="card-p">1.人员范围：不执行人员查询时，默认针对所选全员进行排班</p>
        <p class="card-p">2.班次规则：以人员考勤档案当前班次属性进行排班</p>
        <p class="card-p">3.工作日规则：除特定设置工作日班次（如：家装）人员，排班将结合双休&假期日历设置，仅针对工作日进行排班</p>
      </Card>
      <h3 class="title-h">排班信息</h3>
      <Form :label-width="80">
        <FormItem label="排班期间">
          <DatePicker split-panels :value="datePicker" type="daterange" format="yyyy-MM-dd"  :editable="false" placeholder="请选择" style="width: 200px" @on-change="getPickerDate"></DatePicker>
        </FormItem>
        <FormItem label="备注">
          <Input type="textarea" v-model="remark" :rows="4" placeholder="填写备注有助于查看历史更便捷了解排班历史操作信息"></Input>
        </FormItem>
      </Form>
      <h3 class="title-h">排班记录</h3>
      <Table :columns="columns1"
             :data="data1"
             stripe
             :loading="loading1"
             :no-data-text="noData"
             style="margin-top: 20px;"
      >
        <template slot-scope="{ row, index}" slot="count">
          <Button type="text" @click="showDrawer2(row.id)">{{row.count}}</Button>
        </template>
        <template slot-scope="{ row, index}" slot="createUser">
          <p>{{row.createUser}}({{ row.createUserId }})</p>
        </template>
        <template slot-scope="{ row, index}" slot="status">
          <Badge status="default" text="未开始" v-if="row.status === 1" />
          <Badge status="processing" text="进行中" v-else-if="row.status === 2" />
          <Badge status="success" text="成功" v-else-if="row.status === 3" />
          <Badge status="error" text="失败" v-else-if="row.status === 4" />
        </template>
      </Table>
      <div style="margin-top: 10px;text-align:center;" v-show="defaultData1.length > 0">
        <Button icon="ios-arrow-down" class="icon-more" @click="loadMore">加载更多</Button>
      </div>
      <p style="height: 80px"></p>
      <div class="bottom-btn fixed w640">
        <Button style="margin-right: 20px" @click="hideDrawer1">取消</Button>
        <Button type="primary" style="margin-right: 20px" @click="save" :loading="saveLoading">保存</Button>
      </div>
    </Drawer>

    <Drawer :mask-closable="false" width="360" title="明细" v-model="drawer2" class="drawer-box common-style" @on-close="hideAllDrawer">
      <Form :label-width="85">
        <FormItem label="排班周期：">
          <p class="fs-p">{{data2Info.startday}}-{{data2Info.endday}}</p>
        </FormItem>
        <FormItem label="操作用户：">
          <p class="fs-p">{{data2Info.updateUser}}</p>
        </FormItem>
        <FormItem label="操作时间：">
          <p class="fs-p">{{data2Info.updateTime}}</p>
        </FormItem>
        <FormItem label="备注：">
          <p class="fs-p">{{data2Info.remark}}</p>
        </FormItem>
        <FormItem label="" :label-width="10">
          <Checkbox v-model="check" @on-change="checkError">
            仅看失败信息
          </Checkbox>
        </FormItem>
      </Form>
      <Table :columns="columns2"
             :data="data2"
             stripe
             :loading="loading2"
             :no-data-text="noData"
             style="margin-top: 20px;margin-bottom: 100px;"
      >
        <template slot-scope="{ row, index}" slot="status">
          <Badge status="default" text="未开始" v-if="row.status === 1" />
          <Badge status="processing" text="进行中" v-else-if="row.status === 2" />
          <Badge status="success" text="成功" v-else-if="row.status === 3" />
          <Badge status="error" text="失败" v-else-if="row.status === 4" />
        </template>
      </Table>
      <div class="bottom-btn fixed">
        <Button style="margin-right: 20px" @click="hideDrawer2">上一步</Button>
        <Button type="primary" style="margin-right: 20px" @click="hideDrawer2">确定</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
  import { noData } from '@/libs/util'
  import {savePlan, getPlanStatusList, getPlanUserStatusList} from '@/api/file-attendance'
  export default {
    props: {
      showDrawer: {
        type: Boolean,
        default: false
      },
      dateVal: {
        type: Array,
        default() {
          return []
        }
      },
      userIdList: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        drawer1: false,
        drawer2: false,
        remark: '',
        check: false,
        datePicker: [],
        noData,
        loading1: false,
        loading2: false,
        columns1: [
          {
            align: 'center',
            title: '状态',
            slot: 'status',
            minWidth: 100
          },
          {
            align: 'center',
            title: '操作时间',
            key: 'createTime',
            minWidth: 100,
            tooltip: true
          },
          {
            align: 'center',
            title: '操作用户',
            slot: 'createUser',
            width: 160
          },
          {
            align: 'center',
            title: '排班人数',
            slot: 'count',
            width: 100
          },
          {
            align: 'center',
            title: '备注',
            key: 'remark',
            width: 120,
            tooltip: true
          }
        ],
        defaultData1: [],
        data1: [],
        columns2: [
          {
            align: 'center',
            title: '员工编号',
            key: 'emplid',
            minWidth: 100
          },
          {
            align: 'center',
            title: '姓名',
            key: 'name',
            minWidth: 100
          },
          {
            align: 'center',
            title: '状态',
            slot: 'status',
            width: 100
          }
        ],
        defaultData2: [],
        errorData2: [],
        data2: [],
        data2Info: {},
        saveLoading: false
      }
    },
    watch: {
      showDrawer(newVal) {
        if (newVal) {
          this.drawer1 = true
          this.planStatusList()
        }
      },
      dateVal: {
        immediate: true,
        handler(newVal) {
          if (newVal) {
            this.datePicker = newVal
          }
        }
      }
    },
    methods: {
      hideDrawer1() {
        this.drawer1 = false
        this.$emit('hide')
      },
      hideDrawer2() {
        this.drawer2 = false
      },
      hideAllDrawer() {
        this.hideDrawer1()
        this.hideDrawer2()
      },
      showDrawer2(id) {
        this.drawer2 = true
        this.planUserStatusList(id)
      },
      // 排班记录列表
      planStatusList() {
        this.defaultData1 =[]
        this.data1 = []
        this.loading1 = true
        getPlanStatusList().then(res => {
          const data = res.data
          if (data.code === 200) {
            this.defaultData1 = data.data
            this.data1 = this.defaultData1.splice(0, 10)
          } else {
            this.$Message.warning(`排班记录列表获取失败：${data.message}`)
          }
        }).finally(() => {
          this.loading1 = false
        })
      },
      // 员工排班状态列表
      planUserStatusList(id) {
        this.defaultData2 = []
        this.data2 = []
        this.loading2 = true
        const params = {
          id
        }
        getPlanUserStatusList(params).then(res => {
          const data = res.data
          if (data.code === 200) {
            this.defaultData2 = data.data.list || []
            this.data2Info = data.data.info
            let updateTime = new Date(this.data2Info.updateTime)
            this.data2Info.updateTime = updateTime.getFullYear() + '-' + (updateTime.getMonth() + 1) + '-' + updateTime.getDate()
            this.errorData2 = this.getErrorData2(this.defaultData2)
            this.checkError(this.check)
          }else {
            this.$Message.warning(`排班员工状态列表获取失败：${data.message}`)
          }
        }).finally(() => {
          this.loading2 = false
        })
      },
      save() {
        if (this.saveLoading) return
        if ((this.datePicker[0] !== '') && (this.datePicker[1] !== '')) {
          const params = {
            ids: this.userIdList,
            startTime: this.datePicker[0],
            endTime: this.datePicker[1],
            remark: this.remark
          }
          this.saveLoading = true
          savePlan(params).then(res => {
            const data = res.data
            if (data.code === 200) {
              this.$Message.success('保存成功')
              this.hideAllDrawer()
            } else {
              this.$Message.warning(`保存失败：${data.message}`)
            }
            this.saveLoading = false
          })
        } else {
          this.$Message.warning(`请选择排期`)
        }

      },
      getPickerDate(val) {
        this.datePicker = val
      },
      loadMore() {
        this.data1.push(...(this.defaultData1.splice(0, 10)))
      },
      checkError(flag) {
        if (flag) {
          this.data2 = JSON.parse(JSON.stringify(this.errorData2))
        } else {
          this.data2 = JSON.parse(JSON.stringify(this.defaultData2))
        }
      },
      getErrorData2(data) {
        const errorData = []
        data.forEach(item => {
          if (item.status === 4) {
            errorData.push(item)
          }
        })
        return errorData
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../../../../index";
  .drawer-box {
    position: relative;
    .ivu-collapse {
      border: none;
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
      background-color: #fff;
      border-top: 1px solid #e8eaec;
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
      position: relative;
      background-color: @primary-bgc-color;
    }
    .icon {
      color: @primary-color;
      font-size: 16px;
      position: absolute;
      top: 20px;
      left: 15px;
    }
    .card-p {
      padding-left: 18px;
      line-height: 25px;
      font-size: 12px;
    }
    .title-h {
      padding-left: 10px;
      border-left: 2px solid #333;
      margin: 20px 0;
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
    .icon-more {
      font-size: 14px;
      border: none;
    }
    icon-more:focus {
      box-shadow: none;
    }
    .fs-p {
      font-size: 12px;
    }
  }
</style>
<style lang="less">
  .drawer-box {
    .ivu-table-cell {
      height: 18px;
    }
    .ivu-table-cell-tooltip {
      height: 18px;
    }
    .ivu-btn-text {
      margin-right: 0;
      padding: 0;
      height: 19px;
    }
  }
</style>
