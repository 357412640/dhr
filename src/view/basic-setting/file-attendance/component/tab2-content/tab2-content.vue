<template>
  <div>
    <div>
      <div class='main-left'>
        <div class='main-title'>余额看板</div>
        <div class='card-box-top'>
          <div class='card-title'>年假余额</div>
          <div>
            <div class='card-left'>
              <span style='font-size:20px;font-weight:600;'>{{baseInfo.yearVacation.amount}}</span>小时
            </div>
            <div class='card-right'>
              <div v-for='item in baseInfo.yearVacation.detailList' class='card-right-line'>{{item.year}}年假余额：<span class='card-num'>{{item.amount}}</span>小时 {{item.invalidDate}}过期</div>
            </div>
          </div>
        </div>

        <div v-if='baseInfo.compensatoryVacation != null' class='card-box-bottom'>
          <div class='card-title'>调休假余额</div>
          <div>
            <div class='card-left'>
              <span style='font-size:20px;font-weight:600;'>{{baseInfo.compensatoryVacation.amount}}</span>小时
            </div>
            <div class='card-right'>
              <div v-for='item in baseInfo.compensatoryVacation.detailList' class='card-right-box'><span class='card-num'>{{item.amount}}</span>小时<br>{{item.invalidDate}}过期</div>
            </div>
          </div>
        </div>
      </div>
      <div class='main-right'>
        <div class='main-title'>人员基本信息</div>
        <div class='base-info-box'>
          <span class='base-info-attr'>性别：{{baseInfo.employee.sex}}</span>
          <span class='base-info-attr'>参加工作日期：{{baseInfo.employee.startDt}}</span>
          <span class='base-info-attr'>入职日期：{{baseInfo.employee.origHireDt}}</span>
          <span v-if='baseInfo.employee.dimissionDt != null' class='base-info-attr'>离职日期：{{baseInfo.employee.dimissionDt}}</span>
          <span v-else class='base-info-attr'>离职日期：--</span>
        </div>
        <div class='base-info-box'>
          <span class='base-info-attr'>员工类别：{{baseInfo.employee.emplClassDescr}}</span>
        </div>

        <div class='main-title' style='margin-top:40px;'>余额明细</div>
        <div class='base-info-box'>
          <span class='detail-attr' v-for='(val, key) in baseInfo.vacationDetail'>
            {{key}}：{{val}}小时
            <Icon type="ios-browsers-outline" size='18' color='#2b85e4' style='cursor:pointer;' @click='showDetail(key)' />
          </span>
        </div>
      </div>
    </div>

    <Drawer title="年假" v-model="drawer1" width="660" :mask-closable="false">
      <div class='main-title' style='margin-bottom:10px;'>基础信息</div>
      <div style='font-size:13px;margin-bottom:4px;'>当前可用总额：{{year_base_amount}}小时</div>
      <Table stripe border :loading="loading" :columns="year_base_cols" :data="year_base_data" :no-data-text=noData></Table>

      <div class='main-title' style='margin-bottom:10px;margin-top:20px;'>历史信息</div>
      <Table stripe border :loading="loading" :columns="year_base_cols" :data="year_history_data" :no-data-text=noData></Table>
    </Drawer>

    <Drawer title="调休假" v-model="drawer2" width="660" :mask-closable="false">
      <div class='main-title' style='margin-bottom:10px;'>基础信息</div>
      <div style='font-size:13px;margin-bottom:4px;'>当前可用总额：{{ca_base_amount}}小时</div>
      <Table stripe border :loading="loading" :columns="ca_base_cols" :data="ca_base_data" :no-data-text=noData></Table>

      <div class='main-title' style='margin-bottom:10px;margin-top:20px;'>历史信息</div>
      <Table stripe border :loading="loading" :columns="ca_base_cols" :data="ca_history_data" :no-data-text=noData></Table>
      <div style='display:none' class='load-more'><Icon type="ios-arrow-down" size='18' />&nbsp;加载更多</div>
    </Drawer>

    <Drawer title="事假" v-model="drawer3" width="660" :mask-closable="false">
      <div class='main-title' style='margin-bottom:10px;'>基础信息</div>
      <div style='font-size:13px;margin-bottom:8px;'>当年可用总额：{{matter_info.amount}}小时</div>
      <div style='font-size:13px;margin-bottom:8px;'>当年已用额度：{{matter_info.used}}小时</div>
      <div style='font-size:13px;margin-bottom:8px;'>当年剩余额度：{{matter_info.amount - matter_info.used}}小时</div>
      <div style='font-size:13px;margin-bottom:4px;'>备注：
        <Input v-model="matter_info.remark" type="textarea" :rows='4' style='width:50%;' placeholder="请输入"></Input>
      </div>

      <div class='main-title' style='margin-bottom:10px;margin-top:20px;'>历史信息</div>
      <Table stripe border :loading="loading" :columns="matter_history_cols" :data="matter_history_data" :no-data-text=noData></Table>
      <!-- <div class='load-more'><Icon type="ios-arrow-down" size='18' />&nbsp;加载更多</div> -->

      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="drawer3 = false">取消</Button>
        <Button type="primary" @click="saveMatterRemark">保存</Button>
      </div>
    </Drawer>

    <Drawer title="病假" v-model="drawer4" width="660" :mask-closable="false">
      <div class='main-title' style='margin-bottom:10px;'>基础信息</div>
      <div style='font-size:13px;margin-bottom:8px;'>当年可用总额：{{sick_info.amount}}小时</div>
      <div style='font-size:13px;margin-bottom:8px;'>当年已用额度：{{sick_info.used}}小时</div>
      <div style='font-size:13px;margin-bottom:8px;'>当年剩余额度：{{sick_info.amount - sick_info.used}}小时</div>
      <div style='font-size:13px;margin-bottom:4px;'>备注：
        <Input v-model="sick_info.remark" type="textarea" :rows='4' style='width:50%;' placeholder="请输入"></Input>
      </div>

      <div class='main-title' style='margin-bottom:10px;margin-top:20px;'>历史信息</div>
      <Table stripe border :loading="loading" :columns="matter_history_cols" :data="sick_history_data" :no-data-text=noData></Table>
      <!-- <div class='load-more'><Icon type="ios-arrow-down" size='18' />&nbsp;加载更多</div> -->

      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="drawer4 = false">取消</Button>
        <Button type="primary" @click="saveSickRemark">保存</Button>
      </div>
    </Drawer>

    <Drawer title="公假" v-model="drawer5" width="660" :mask-closable="false">
      <div class='main-title' style='margin-bottom:10px;'>基础信息</div>
      <div style='font-size:13px;margin-bottom:8px;'>当年可用总额：{{public_info.amount}}小时</div>
      <div style='font-size:13px;margin-bottom:8px;'>当年已用额度：{{public_info.used}}小时</div>
      <div style='font-size:13px;margin-bottom:8px;'>当年剩余额度：{{public_info.amount - public_info.used}}小时</div>

      <div class='main-title' style='margin-bottom:10px;margin-top:20px;'>历史信息</div>
      <Table stripe border :loading="loading" :columns="matter_history_cols" :data="public_history_data" :no-data-text=noData></Table>
      <!-- <div class='load-more'><Icon type="ios-arrow-down" size='18' />&nbsp;加载更多</div> -->
    </Drawer>

    <Drawer title="探亲假" v-model="drawer6" width="660" :mask-closable="false">
      <div class='main-title' style='margin-bottom:10px;'>基础信息<span style='padding-left:4px;color:gray;font-size:11px;'>探亲假基础数据同步自PS-职务数据，若有数据缺失请联系人事同事协同进行数据维护</span></div>
      <div style='font-size:13px;margin-bottom:8px;'>具有探亲假资格：{{home_info.have || '--'}}</div>
      <div style='font-size:13px;margin-bottom:8px;'>具有探亲假资格时间：{{home_info.date}}</div>

      <div class='main-title' style='margin-bottom:10px;margin-top:20px;'>历史信息</div>
      <Table stripe border :loading="loading" :columns="home_cols" :data="home_info.details" :no-data-text=noData></Table>
    </Drawer>

    <Drawer title="哺乳假" v-model="drawer7" width="660" :mask-closable="false">
      <div class='main-title' style='margin-bottom:10px;'>基础信息</div>
      <div style='border-bottom: 1px solid #eee;margin-bottom:10px'>
        <div style='width:100%;background:#eee;height:40px;line-height:40px;'>
          <div class='cus-col'>孕胎数</div>
          <div class='cus-col'>子女出生日期</div>
          <div class='cus-col'>哺乳假到期日期</div>
        </div>
        <div v-for='(item, index) in lac_base_data' style='padding: 4px 0px 4px 0px;'>
          <div class='cus-col'>
            <Input type='text' v-model='item.babyNum' style='width:40%' />
          </div>
          <div class='cus-col'>
            <DatePicker type="date" format="yyyy/MM/dd" @on-change="getBirthday($event, index)" :value='item.startTime' style="width:90%"></DatePicker>
          </div>
          <div class='cus-col'>
            <span>{{item.endTime}}</span>
          </div>
          <div class='cus-col'>
            <span style='color:#2b85e4;cursor:pointer;' @click='delLac(index)'>删除记录</span>
          </div>
        </div>
      </div>
      <div style='width:100%;text-align:center;color:#2b85e4;cursor:pointer;' @click='addLac'>+ 添加记录</div>

      <div v-if='lac_base_data.length > 0'>
      <div class='main-title' style='margin-bottom:10px;'>操作记录</div>
      <div style='font-size:13px;margin-bottom:8px;'>创建用户：{{lac_base_data[0]['createUser']}}</div>
      <div style='font-size:13px;margin-bottom:8px;'>创建时间：{{lac_base_data[0]['createTime']}}</div>
      <div style='font-size:13px;margin-bottom:8px;'>上次操作用户：{{lac_base_data[0]['updateUser']}}</div>
      <div style='font-size:13px;margin-bottom:8px;'>上次操作时间：{{lac_base_data[0]['updateTime']}}</div>
      </div>

      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="drawer7 = false">取消</Button>
        <Button type="primary" @click="saveLac">保存</Button>
      </div>
    </Drawer>

    <Drawer title="产假" v-model="drawer8" width="660" :mask-closable="false">
      <div class='main-title' style='margin-bottom:10px;'>基础信息</div>
      <div style='border-bottom: 1px solid #eee;margin-bottom:10px'>
        <div style='width:100%;background:#eee;height:40px;line-height:40px;'>
          <div class='cus-col'>开始日期</div>
          <div class='cus-col'>结束日期</div>
          <div class='cus-col'>备注</div>
        </div>
        <div v-for='(item, index) in mat_base_data' style='padding: 4px 0px 4px 0px;'>
          <div class='cus-col'>
            <DatePicker type="date" format="yyyy/MM/dd" @on-change="getMatStart($event, index)" :value='item.startTime' style="width:90%"></DatePicker>
          </div>
          <div class='cus-col'>
            <DatePicker type="date" format="yyyy/MM/dd" @on-change="getMatEnd($event, index)" :value='item.endTime' style="width:90%"></DatePicker>
          </div>
          <div class='cus-col'>
            <Input type='text' v-model='item.remark' style='width:90%' />
          </div>
          <div class='cus-col'>
            <span style='color:#2b85e4;cursor:pointer;' @click='delMat(index)'>删除记录</span>
          </div>
        </div>
      </div>
      <div style='width:100%;text-align:center;color:#2b85e4;cursor:pointer;' @click='addMat'>+ 添加记录</div>

      <div v-if='mat_base_data.length > 0'>
      <div class='main-title' style='margin-bottom:10px;'>操作记录</div>
      <div style='font-size:13px;margin-bottom:8px;'>创建用户：{{mat_base_data[0]['createUser']}}</div>
      <div style='font-size:13px;margin-bottom:8px;'>创建时间：{{mat_base_data[0]['createTime']}}</div>
      <div style='font-size:13px;margin-bottom:8px;'>上次操作用户：{{mat_base_data[0]['updateUser']}}</div>
      <div style='font-size:13px;margin-bottom:8px;'>上次操作时间：{{mat_base_data[0]['updateTime']}}</div>
      </div>

      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="drawer8 = false">取消</Button>
        <Button type="primary" @click="saveMat">保存</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
import { getArchiveDetail, getYearDetail, getCaDetail, getCaHistoryDetail, getMatterDetail,
         getSickDetail, getPublicDetail, getHomeDetail, saveMatterRemark, saveSickRemark,
         getLacDetail, saveLac, getMatDetail, saveMat } from '@/api/file-attendance'
import { noData } from '@/libs/util'
export default {
  name: "tab2-content",
  props: {
    pemplid: {
      type: String
    }
  },
  data() {
    return {
      loading: false,
      noData: noData,
      params: {
        emplid: this.pemplid
      },
      baseInfo: {
        yearVacation: {},
        compensatoryVacation: {},
        employee: {},
        vacationDetail: {}
      },
      drawer1: false,
      drawer2: false,
      drawer3: false,
      drawer4: false,
      drawer5: false,
      drawer6: false,
      drawer7: false,
      drawer8: false,
      year_base_cols: [
        {
          title: '所属年度',
          key: 'year',
          align: 'center',
        },
        {
          title: '到期日期',
          key: 'invalidDate',
          align: 'center',
        },
        {
          title: '总额',
          key: 'amount',
          align: 'center',
        },
        {
          title: '已释放',
          key: 'release',
          align: 'center',
        },
        {
          title: '已使用',
          key: 'used',
          align: 'center',
        },
        {
          title: '可用余额',
          key: 'surplus',
          align: 'center',
        },
        {
          title: '状态',
          key: 'status',
          align: 'center',
          render: (h, params) => {
            if (params.row.status == 1) {
              return h('span', '有效')
            } else {
              return h('span', '失效')
            }
          }
        },
      ],
      year_base_amount: 0,
      year_base_data: [],
      year_history_data: [],
      ca_base_cols: [
        {
          title: '到期日期',
          key: 'invalidDate',
          align: 'center',
        },
        {
          title: '总额',
          key: 'amount',
          align: 'center',
        },
        {
          title: '已用额度',
          key: 'used',
          align: 'center',
        },
        {
          title: '占用额度',
          key: 'occupy',
          align: 'center',
          renderHeader: (h, params) => {
              return h('div', [
                h('Tooltip', {
                  props: {
                    content: '已申请，暂未审批通过额度',
                  }
                }, '占用额度'),
                h('Icon', {
                  props: {
                    type: 'md-information-circle',
                    size: 15,
                    color: '#2db7f5',
                  }
                }),
              ])
          }
        },
        {
          title: '剩余额度',
          key: 'surplus',
          align: 'center',
        },
      ],
      ca_base_amount: 0,
      ca_base_data: [],
      ca_history_data: [],
      matter_history_cols: [
        {
          title: '所属年度',
          key: 'year',
          align: 'center',
        },
        {
          title: '可用总额',
          key: 'amount',
          align: 'center',
        },
        {
          title: '已用额度',
          key: 'used',
          align: 'center',
        },
        {
          title: '剩余额度',
          key: 'surplus',
          align: 'center',
        },
        {
          title: '状态',
          key: 'status',
          align: 'center',
          render: (h, params) => {
            if (params.row.status == 1) {
              return h('span', '有效')
            } else {
              return h('span', '无效')
            }
          }
        },
      ],
      matter_history_data: [],
      matter_info: {
        amount: 0,
        used: 0,
        remark: ''
      },
      sick_history_data: [],
      sick_info: {
        amount: 0,
        used: 0,
        remark: ''
      },
      public_history_data: [],
      public_info: {
        amount: 0,
        used: 0,
        remark: ''
      },
      home_info: {
        have: '',
        date: '',
        details: []
      },
      home_cols: [
        {
          title: '添加日期',
          key: 'createDate',
          align: 'center',
        },
        {
          title: '开始日期',
          key: 'startDate',
          align: 'center',
        },
        {
          title: '失效日期',
          key: 'invalidDate',
          align: 'center',
        },
        {
          title: '定额',
          key: 'amount',
          align: 'center',
        },
        {
          title: '已使用',
          key: 'used',
          align: 'center',
        },
        {
          title: '状态',
          key: 'status',
          align: 'center',
          render: (h, params) => {
            if (params.row.status == 1) {
              return h('span', '有效')
            } else {
              return h('span', '无效')
            }
          }
        },
      ],
      lac_base_data: [],
      mat_base_data: []
    }
  },
  methods: {
    // 哺乳假-添加记录
    addLac() {
      this.lac_base_data.push({
        babyNum: 1,
        startTime: '',
        endTime: ''
      })
    },
    // 哺乳假-删除记录
    delLac(index) {
      this.lac_base_data.splice(index, 1)
    },
    // 哺乳假-更新出生日期、到期日期
    getBirthday(e, index) {
      this.lac_base_data[index].startTime = e

      let d1 = new Date(e)
      let d2 = new Date(d1)
      d1.setFullYear(d2.getFullYear() + 1)
      d1.setMonth(d2.getMonth() + 1)
      d1.setDate(d2.getDate() - 1)

      this.lac_base_data[index].endTime = d1.getFullYear() + '/' + d1.getMonth() + '/' + d1.getDate()
    },
    // 产假-添加记录
    addMat() {
      this.mat_base_data.push({
        startTime: '',
        endTime: '',
        remark: ''
      })
    },
    // 产假-删除记录
    delMat(index) {
      this.mat_base_data.splice(index, 1)
    },
    // 产假-开始时间
    getMatStart(e, index) {
      this.mat_base_data[index].startTime = e
    },
    // 产假-结束时间
    getMatEnd(e, index) {
      this.mat_base_data[index].endTime = e
    },
    // 获取档案详情
    getArchiveDetail() {
      getArchiveDetail(this.params).then(res => {
          let data = res.data
          if (data.code === 200) {
            this.baseInfo = data.data
          } else {
            this.$Message.error('获取详情失败：' + data.message)
          }
      })
    },
    // 显示假期详情
    showDetail(key) {
      switch (key) {
        case '年假':
          this.drawer1 = true
          this.getYearDetail()
          break
        case '调休假':
          this.drawer2 = true
          this.getCaDetail()
          this.getCaHistoryDetail()
          break
        case '事假':
          this.drawer3 = true
          this.getMatterDetail()
          break
        case '病假':
          this.drawer4 = true
          this.getSickDetail()
          break
        case '公假':
          this.drawer5 = true
          this.getPublicDetail()
          break
        case '探亲假':
          this.drawer6 = true
          this.getHomeDetail()
          break
        case '哺乳假':
          this.drawer7 = true
          this.getLacDetail()
          break
        case '产假':
          this.drawer8 = true
          this.getMatDetail()
          break
        default:
          break
      }
    },
    // 获取年假详情
    getYearDetail() {
      getYearDetail(this.params).then(res => {
          let data = res.data
          if (data.code === 200 && data.data) {
            this.year_base_amount = data.data.amount
            this.year_base_data = data.data.lastThreeYearVacation
            this.year_history_data = data.data.historyYearVacation
          } else {
            this.$Message.error('获取详情失败：' + data.message)
          }
      })
    },
    // 获取年假详情
    getCaDetail() {
      getCaDetail(this.params).then(res => {
          let data = res.data
          if (data.code === 200 && data.data) {
            this.ca_base_amount = data.data.amount
            this.ca_base_data = data.data.lastThreeCompensatoryVacation
          } else {
            this.$Message.error('获取详情失败：' + data.message)
          }
      })
    },
    // 获取年假历史详情
    getCaHistoryDetail() {
      getCaHistoryDetail(this.params).then(res => {
          let data = res.data
          if (data.code === 200 && data.data) {
            this.ca_history_data = data.data.list
          } else {
            this.$Message.error('获取详情失败：' + data.message)
          }
      })
    },
    // 获取事假详情
    getMatterDetail() {
      getMatterDetail(this.params).then(res => {
          let data = res.data
          if (data.code === 200 && data.data) {
            this.matter_info = data.data
            this.matter_history_data = data.data.historyGroup
          } else {
            this.$Message.error('获取详情失败：' + data.message)
          }
      })
    },
    // 保存事假备注
    saveMatterRemark() {
      let data = {
        emplid: this.params.emplid,
        remark: this.matter_info.remark
      }
      saveMatterRemark(data).then(res => {
          let data = res.data
          if (data.code === 200) {
            this.$Message.success('保存成功')
          } else {
            this.$Message.error('保存失败：' + data.message)
          }
      })
    },
    // 获取病假详情
    getSickDetail() {
      getSickDetail(this.params).then(res => {
          let data = res.data
          if (data.code === 200 && data.data) {
            this.sick_info = data.data
            this.sick_history_data = data.data.historyGroup
          } else {
            this.$Message.error('获取详情失败：' + data.message)
          }
      })
    },
    // 保存病假备注
    saveSickRemark() {
      let data = {
        emplid: this.params.emplid,
        remark: this.sick_info.remark
      }
      saveSickRemark(data).then(res => {
          let data = res.data
          if (data.code === 200) {
            this.$Message.success('保存成功')
          } else {
            this.$Message.error('保存失败：' + data.message)
          }
      })
    },
    // 获取公假详情
    getPublicDetail() {
      getPublicDetail(this.params).then(res => {
          let data = res.data
          if (data.code === 200 && data.data) {
            this.public_info = data.data
            this.public_history_data = data.data.historyGroup
          } else {
            this.$Message.error('获取详情失败：' + data.message)
          }
      })
    },
    // 获取探亲假详情
    getHomeDetail() {
      getHomeDetail(this.params).then(res => {
          let data = res.data
          if (data.code === 200 && data.data) {
            this.home_info = data.data
          } else {
            this.$Message.error('获取详情失败：' + data.message)
          }
      })
    },
    // 获取哺乳假详情
    getLacDetail() {
      getLacDetail(this.params).then(res => {
          let data = res.data
          if (data.code === 200 && data.data) {
            this.lac_base_data = data.data
          } else {
            this.$Message.error('获取详情失败：' + data.message)
          }
      })
    },
    // 保存哺乳假
    saveLac() {
      let data = {
        emplid: this.params.emplid,
        details: this.lac_base_data
      }
      saveLac(data).then(res => {
          let data = res.data
          if (data.code === 200) {
            this.$Message.success('保存成功')
          } else {
            this.$Message.error('保存失败：' + data.message)
          }
      })
    },
    // 获取产假详情
    getMatDetail() {
      getMatDetail(this.params).then(res => {
          let data = res.data
          if (data.code === 200 && data.data) {
            this.mat_base_data = data.data
          } else {
            this.$Message.error('获取详情失败：' + data.message)
          }
      })
    },
    // 保存产假
    saveMat() {
      let data = {
        emplid: this.params.emplid,
        details: this.mat_base_data
      }
      saveMat(data).then(res => {
          let data = res.data
          if (data.code === 200) {
            this.$Message.success('保存成功')
          } else {
            this.$Message.error('保存失败：' + data.message)
          }
      })
    },
  },
  created() {
    this.getArchiveDetail()
  }
}
</script>

<style scoped>
.main-left {
  width: 400px;
  height: 420px;
  border-right: 2px solid #eee;
  float: left;
}
.main-right {
  float: left;
  padding-left: 30px;
  width: 50%;
}
.main-title {
  border-left: 3px solid gray;
  padding-left: 12px;
  font-size: 13px;
  font-weight: 600;
}
.card-box-top {
  margin-top: 40px;
  background: #eee;
  width: 350px;
  height: 150px;
  padding: 6px;
  border-radius: 2%;
}
.card-box-bottom {
  background: #eee;
  width: 350px;
  height: 150px;
  padding: 6px;
  border-radius: 2%;
  margin-top: 20px;
}
.card-title {
  font-weight: 900;
  font-size: 13px;
  margin-bottom: 10px;
}
.card-left {
  width: 70px;
  float: left;
  height: 100px;
  line-height: 100px;
  border-right: 2px solid #fff;
  margin-left: 10px;
  margin-right: 16px;
}
.card-right {
  width: 230px;
  float: left;
}
.card-right-line {
  padding: 6px 0px 6px 0px;
}
.card-right-box {
  padding: 6px 0px 6px 0px;
  float: left;
  width: 100px;
}
.card-num {
  font-size: 15px;
  font-weight: 600;
  padding: 0px 4px 0px 4px;
}
.base-info-attr {
  margin-right: 40px;
}
.base-info-box {
  margin-top: 20px;
  margin-left: 10px;
  width: 660px !important;
}
.detail-attr {
  display: inline-block;
  width: 120px;
  margin-right: 40px;
  margin-bottom: 20px;
}
.load-more {
  width: 100%;
  text-align: center;
  margin-top: 20px;
  font-size: 15px;
  cursor: pointer;
}
.cus-col {
  display: inline-block;
  width: 25%;
  text-align: center;
}
.demo-drawer-footer{
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    background: #fff;
}
</style>
