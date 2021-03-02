<template>
  <div class="uploadAndDown-box common-style">
    <common-header title="数据导入" back></common-header>
    <div class="upload-box">
      <div class="left">
        <p class="p1">排班导入</p>
        <p class="p2">批量新增/更新未来排班数据</p>
      </div>
      <div class="center">
        <Steps :current="-1">
          <Step title="下载模板" style="width: auto"></Step>
          <Step title="上传数据" style="width: auto"></Step>
          <Step title="查看上传进度" style="width: auto"></Step>
        </Steps>
      </div>
      <div class="right">
        <Button type="text" class="common-btn" @click="downloadDefaultFile(3)">下载模板</Button>
        <Divider type="vertical" />
        <Upload :action="importPlan" :before-upload="beforePlan" :on-error="errPlan" :on-success="sucPlan" style="display: inline-block;" v-show="!planUp">
          <Button type="text" class="common-btn">上传数据</Button>
        </Upload>
        <span v-show="planUp">上传中...</span>
        <Divider type="vertical" />
        <Button type="text" class="common-btn" @click="clickDrawer(3)">查看上传进度</Button>
      </div>
    </div>
    <div class="upload-box">
      <div class="left">
        <p class="p1">班次导入</p>
        <p class="p2">批量新增/更新人员考勤班次信息</p>
      </div>
      <div class="center">
        <Steps :current="-1">
          <Step title="下载模板" style="width: auto"></Step>
          <Step title="上传数据" style="width: auto"></Step>
          <Step title="查看上传进度" style="width: auto"></Step>
        </Steps>
      </div>
      <div class="right">
        <Button type="text" class="common-btn" @click="downloadDefaultFile(2)">下载模板</Button>
        <Divider type="vertical" />
        <Upload :action="importWtr" :before-upload="beforeWtr" :on-error="errWtr" :on-success="sucWtr" style="display: inline-block;" v-show="!wtrUp">
          <Button type="text" class="common-btn">上传数据</Button>
        </Upload>
        <span v-show="wtrUp">上传中...</span>
        <Divider type="vertical" />
        <Button type="text" class="common-btn" @click="clickDrawer(2)">查看上传进度</Button>
      </div>
    </div>

    <Drawer v-model="showDrawer" :width="640" :mask-closable="false" title="查看上传进度" class="common-style upload-drawer-box">
      <h3 class="title-h">基本信息</h3>
      <p class="pl-12" style="font-size: 14px;">导入类型：{{ drawerType }}</p>
      <h3 class="title-h">上传进度</h3>
      <div class="pl-12">
        <Table :columns="columns1"
               :data="data1"
               stripe
               :loading="loading1"
               :no-data-text="noData"
               style="margin-top: 20px;"
        >
          <template slot-scope="{ row, index}" slot="status">
            <Badge status="default" text="未开始" v-if="row.status === 1" />
            <Badge status="processing" text="进行中" v-else-if="row.status === 2" />
            <Badge status="error" text="失败" v-else-if="row.status === 3" />
            <Badge status="success" text="成功" v-else-if="row.status === 4" />
          </template>
          <template slot-scope="{ row, index}" slot="uploadFile">
            <Tooltip :content="row.sourceFileName" placement="bottom" max-width="240" >
              <Button type="text" @click="downloadFile(row)" class="common-btn download-btn">{{ row.sourceFileName }}</Button>
            </Tooltip>
          </template>
          <template slot-scope="{ row, index}" slot="operate">
            <Button type="text" class="common-btn" v-if="row.status === 3" @click="downloadErrorFile(row)">下载失败信息</Button>
          </template>
        </Table>
        <div style="margin-top: 10px;text-align:center;" v-show="defaultData1.length > 0">
          <Button icon="ios-arrow-down" class="icon-more" @click="loadMore">加载更多</Button>
        </div>
        <p style="height: 40px"></p>
      </div>
    </Drawer>
  </div>
</template>

<script>
  import CommonHeader from '@/components/header'
  import { noData } from '@/libs/util'
  import {uploadStatusList, uploadFile} from '@/api/file-attendance'
  const downloadUrl = '/kq/archive/employee/export'
  export default {
    components: {
      CommonHeader
    },
    data() {
      return {
        showDrawer: false,
        drawerType: '',
        loading1: false,
        columns1: [
          {
            align: 'center',
            title: '状态',
            slot: 'status',
            width: 100
          },
          {
            align: 'center',
            title: '上传时间',
            key: 'updateTime',
            width: 140,
            tooltip: true
          },
          {
            align: 'center',
            title: '导入文件',
            slot: 'uploadFile',
            width: 180,
            tooltip: true
          },
          {
            align: 'center',
            title: '操作',
            slot: 'operate',
            minWidth: 140
          }
        ],
        defaultData1: [],
        data1: [],
        noData,
        importPlan: '/kq/plan/import',
        importWtr: '/kq/archive/employee/employee/wtr',
        planUp: false,
        wtrUp: false
      }
    },
    mounted() {

    },
    methods: {
      clickDrawer(t) {
        this.defaultData1 =[]
        this.data1 = []
        let type
        switch (t) {
          case 3: {
            this.drawerType =  '排班导入'
            type = 3
            break
          }
          case 2: {
            this.drawerType =  '班次导入'
            type = 2
            break
          }
        }
        this.showDrawer = true
        this.loading1 = true
        if (type) {
          uploadStatusList({ type }).then(res => {
            const data = res.data
            if (data.code === 200) {
              this.defaultData1 = data.data
              this.data1 = this.defaultData1.splice(0, 10)
            } else {
              this.$Message.warning(`${this.drawerType}列表获取失败：${data.message}`)
            }
          }).finally(() => {
            this.loading1 = false
          })
        } else {
          this.$Message.warning(`没有请求类型`)
        }
      },
      loadMore() {
        this.data1.push(...(this.defaultData1.splice(0, 10)))
      },
      downloadFile(row) {
        const url = `${downloadUrl}?type=${row.type}&id=${row.id}&status=4`
        window.open(url)
      },
      downloadErrorFile(row) {
        const url = `${downloadUrl}?type=${row.type}&id=${row.id}&status=3`
        window.open(url)
      },
      downloadDefaultFile(type) {
        const url = downloadUrl + '?type=' + type
        window.open(url)
      },
      beforePlan() {
        // console.log('beforePlan')
        this.planUp = true
      },
      errPlan(err, file) {
        // console.log(err)
        this.$message.warning(`上传失败，原因：${err.message}`)
        this.planUp = false
      },
      sucPlan(res, file) {
        if (res.code === 200) {
          this.$message.success(`上传成功`)
        } else {
          this.$message.warning(`上传失败，原因：${res.message}`)
        }
        // console.log(res)
        this.planUp = false
      },
      beforeWtr() {
        this.wtrUp = true
      },
      errWtr(err, file) {
        // console.log(err)
        this.$message.warning(`上传失败，原因：${err.message}`)
        this.wtrUp = false
      },
      sucWtr(res, file) {
        if (res.code === 200) {
          this.$message.success(`上传成功`)
        } else {
          this.$message.warning(`上传失败，原因：${res.message}`)
        }
        // console.log(res)
        this.wtrUp = false
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "../../../index";
  .uploadAndDown-box {
    padding: 20px;
    .upload-box {
      display: flex;
      padding: 0 20px;
      margin-top: 20px;
      height: 100px;
      border: 1px dashed #e8eaec;
      .ivu-steps {
        display: flex;
        .ivu-steps-item {
          display: inline-block;
          position: relative;
          vertical-align: top;
          -webkit-box-flex: 1;
          -ms-flex: 1;
          flex: 1;
          overflow: hidden;
        }
        .ivu-steps-item:last-child {
          -webkit-box-flex: 0;
          -ms-flex: 0;
          flex: none;
        }
      }
      .left {
        flex: 2;
        align-self: center;
        -webkit-align-self: center;
        padding-right: 15px;
        min-width: 196px;
        .p1 {
          font-size: 18px;
          margin-bottom: 10px;
          color: #000;
        }
        .p2 {
          color: #999;
        }
      }
      .center {
        flex: 6;
        align-self: center;
        -webkit-align-self: center;
        padding-right: 15px;
      }
      .right {
        min-width: 250px;
        flex: 3;
        align-self: center;
        -webkit-align-self: center;
        margin-bottom: 2px;
        text-align: center;
      }
    }

  }
  .title-h {
    padding-left: 10px;
    border-left: 2px solid #333;
    margin: 0 0 14px 0;
  }
  .pl-12 {
    padding-left: 12px;
    margin-bottom: 14px;
  }
  .icon-more {
    font-size: 14px;
    border: none;
  }
  icon-more:focus {
    box-shadow: none;
  }
</style>

<style lang="less">
  .uploadAndDown-box {
    .center {
      .ivu-steps-head-inner {
        border-color: #333;
        span {
          color: #333;
          font-size: 16px;
        }
      }
      .ivu-steps-title {
        color: #555;
        font-size: 16px;
      }
    }
    .ivu-upload-list {
      display: none;
    }
  }
  .upload-drawer-box {
    .ivu-table-cell {
      height: 18px;
    }
    .download-btn {
      max-width: 140px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
  }
</style>
