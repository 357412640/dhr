<template>
<div class="user-management">
  <div class="search-box">
    <Form ref="formCustom" :model="formCustom" :label-width="80" @submit.native.prevent>
      <Row>
         <Col span="4">
           <Button type="primary" ghost style="float:left;margin-right:10px;" @click="editRule(0)" v-if="hasPerm(35)">新增</Button>
         </Col>
         <Col span="5">
          <FormItem label="假期类型">
            <Select v-model="search.holidayType" transfer placeholder='请选择'>
              <Option value="">全部</Option>
              <Option v-for="item in holidayTypes" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
         </Col>
         <Col span="5">
          <FormItem label="假期名称">
            <Input type="text" v-model="search.holidayName" placeholder='请输入'></Input>
          </FormItem>
         </Col>
        <Col span="6">
          <FormItem label="适用范围" style="margin-right: 20px">
            <Select v-model="search.applyRange" transfer placeholder='请选择'>
              <Option value="">全部</Option>
              <Option value="1" key="1">全员</Option>
              <Option value="2" key="2">自定义</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="4">
          <FormItem :label-width="10">
            <Button type="primary" @click="handleSubmit">搜 索</Button>
            <Button style="margin-left:4px" @click="handleReset('search')">重 置</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
  </div>
  <div>
    <Table stripe border :loading="loading" :columns="model_columns" :data="model_data" style="margin-top: 10px" :no-data-text=noData></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :page-size="pageInfo.page_size" :total="pageInfo.total" :current="pageInfo.page" @on-change="changePage"></Page>
      </div>
    </div>
  </div>

  <Drawer :title="editTitle" v-model="value3" width="460" :mask-closable="false" :styles="styles">
    <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="110" style="margin-bottom:30px">
        <Row :gutter="32">
          <Col span="16">
            <FormItem label="假期类型">
              <Select v-model="formData.holidayType" transfer placeholder='请选择'>
                <Option v-for="item in holidayTypes" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">
          <Col span="16">
            <FormItem label="假期名称">
              <Input v-model="formData.holidayName" placeholder="请输入" />
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">
          <Col span="24">
            <FormItem label="适用范围">
                <span v-if="formData.applyRange == '1'" style="color:rgba(0, 0, 0, 0.65);padding-left:6px">全员</span>
                <span v-else style="color:rgba(0, 0, 0, 0.65);padding-left:6px">自定义</span>
                <span style="padding-left:10px;color:#2d8cf0;cursor:pointer;" @click="showRange">修改</span>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">
          <Col span="16">
            <FormItem label="是否带薪">
              <Select v-model="formData.isPaid" transfer placeholder='请选择'>
                <Option v-for="item in isPaids" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
              <div style="width:360px;color:gray">若选择为带薪假期，假期将会在考勤统计中算做出勤</div>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">
          <Col span="16">
            <FormItem label="最小请假单位">
              <Select v-model="formData.minHolidayUnit" transfer placeholder='请选择'>
                <Option v-for="item in minHolidayUnits" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">
          <Col span="16">
            <FormItem label="请假时长核算">
              <Select v-model="formData.durationRule" transfer placeholder='请选择'>
                <Option v-for="item in durationRules" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">
          <Col span="24">
            <FormItem label="假期余额规则">
              <i-Switch v-model="balSwitch" />
              <span style="padding-left:8px;color:gray">周期内假期有余额限制时启用，如：调休假</span>
            </FormItem>
          </Col>
        </Row>
        <div v-if="balSwitch">
          <Row :gutter="32">
            <Col span="24">
              <FormItem label="余额发放方式">
                <Select v-model="formData.provideWay" transfer placeholder='请选择' style='width:100px'>
                  <Option v-for="item in provideWays" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
                <span v-if='formData.provideWay == 2'>
                  ，<Input v-model="formData.fixedLimit" placeholder="请输入" style='width:60px' />小时
                </span>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="24">
              <FormItem label="发放规则">
                <Select v-model="formData.provideRule" transfer placeholder='请选择' style='width:200px'>
                  <Option v-for="item in provideRules" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
                <Tooltip placement="top" max-width="400" :content="provideRuleTips[formData.provideRule]"><Icon type="md-information-circle" size='14' color='#1890ff' /></Tooltip>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="16">
              <FormItem label="默认有效期">
                <Select v-model="formData.defaultDuration" transfer placeholder='请选择'>
                  <Option v-for="item in defaultDurations" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <div v-if='formData.holidayType == "1"'>
          <Row>
            <Col span='24'>
              <Checkbox v-model="formData.checkCustomDelay">自定义有效期延期</Checkbox>
              <span style='color:#46a6ff;cursor:pointer;margin-left:4px' @click='addCustomDelay'>添加</span>
            </Col>
          </Row>
          <Row :gutter="32" v-for='(item, key) in customDelays' style='margin-bottom:10px;margin-top:10px'>
            <Col span="24">
              <div>
                <Select v-model="item.year" transfer placeholder='请选择' style='width:100px'>
                  <Option v-for="val in years" :value="val" :key="val">{{ val }}</Option>
                </Select>
                <span style='margin:0px 4px'>到期日，延长至</span>
                <DatePicker @on-change='getDelayDate($event, key)' format="yyyy/MM/dd" type="date" placeholder="" style="width: 120px" :value='item.date'></DatePicker>
                <span style='color:#46a6ff;cursor:pointer;margin-left:4px;' @click='delCustomDelay(key)'>删除</span>
              </div>
            </Col>
          </Row>
          </div>
        </div>

        <Row :gutter="32">
          <Col span="24">
            <FormItem label="单次申请限额规则">
              <i-Switch v-model="singleSwitch" @on-change='closeSAT' />
              <span style="padding-left:8px;color:gray">单次申请限制申请时长上限时启用，如：婚假</span>
            </FormItem>
          </Col>
        </Row>
        <Row v-if="singleSwitch" :gutter="32">
          <Col span="24">
            <FormItem label="">
              <RadioGroup v-model="formData.singleApplyType" vertical>
                <Radio label="1">
                  <span>固定额度</span>
                  <Input v-model="formData.singleApplyLimit" placeholder="请输入" style="padding: 0px 10px 0px 10px;width:90px" />
                  <span v-if='formData.minHolidayUnit == 1'>小时</span>
                  <span v-else>天</span>
                </Radio>
                <Radio label="2" >
                  <span>规则判断</span>
                </Radio>
                <Select v-model="formData.singleApplyRule" transfer placeholder='请选择' style='width:200px'>
                  <Option v-for="item in singleApplyRules" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
                <Tooltip max-width="600" :content="singleApplyRuleTips[formData.singleApplyRule]"><Icon type="md-information-circle" size='14' color='#1890ff' /></Tooltip>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
    </Form>
    <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="value3 = false">取消</Button>
        <Button type="primary" @click="saveRule">确定</Button>
    </div>
  </Drawer>

<!-- @on-ok="ok" @on-cancel="cancel" -->
  <Modal v-model="changeRange" title="修改适用范围" >
    <scope-tree @confTree='updateTree' :selStrp='selStr' :applyRange='formData.applyRange' :applyList='formData.applyList' :key='formData.id'></scope-tree'>
    <div slot="footer"></div>
  </Modal>
</div>
</template>

<script>
import './index.less'
import { getRuleList, saveRule, updateRule, getRuleDetail, updateStatus, getScopeTree } from '@/api/holiday-rule-data'
import { setSerialNum, deepClone, noData } from '@/libs/util'
import ScopeTree from '@/components/scope-tree'
export default {
  name: 'model-management',
  components: {
    ScopeTree
  },
  data () {
    return {
      editTitle: '新增休假规则',
      treeSearch: '',
      seledTree: '',
      split1: 0.5,
      changeRange: false,
      formCustom: {
        model_name: ''
      },
      item_model_sel: [],
      loading: false,
      years: [],
      customDelays: [
        {year: '', date: ''}
      ],
      model_columns: [
        {
          title: '假期类型',
          key: 'holidayType',
          align: 'center',
          tooltip: true,
          minWidth: 100
        },
        {
          title: '假期名称',
          key: 'holidayName',
          align: 'center',
          tooltip: true,
          minWidth: 100
        },
        {
          title: '请假单位',
          key: 'minHolidayUnit',
          align: 'center',
          tooltip: true,
          minWidth: 100
        },
        {
          title: '请假时长核算',
          key: 'durationRule',
          align: 'center',
          tooltip: true,
          minWidth: 100
        },
        {
          title: '是否带薪',
          key: 'isPaid',
          align: 'center',
          tooltip: true,
          minWidth: 100
        },
        {
          title: '余额发放方式',
          key: 'provideWay',
          align: 'center',
          tooltip: true,
          minWidth: 100
        },
        {
          title: '适用范围',
          key: 'applyRange',
          align: 'center',
          tooltip: true,
          minWidth: 100,
        },
        {
          title: '操作',
          key: 'operate',
          align: 'center',
          width: 240,
          render: (h, params) => {
            let statusText = '启用'
            if (params.row.status == 1) {
              statusText = '停用'
            }

            let style36 = {}
            let style37 = {}
            if (!this.hasPerm(36)) {
              style36.display = 'none'
            }
            if (!this.hasPerm(37)) {
              style37.display = 'none'
            }

            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                style: style36,
                on: {
                  click: () => {
                    this.editRule(params.row.id)
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                style: style37,
                on: {
                  click: () => {
                    this.updateStatus(params.row)
                  }
                }
              }, statusText)
            ])
          }
        }
      ],
      ruleValidate: {
        calendarName: [
          { required: true, message: '日历名称不能为空', trigger: 'blur' }
        ]
      },
      model_data: [],
      pageInfo: {},
      search: {
        holidayType: '',
        holidayName: '',
        applyRange: ''
      },
      value3: false,
      styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
      },
      formData: {
          holidayType: 0,
          holidayName: '',
          applyRange: '1',
          applyList: null,
          isPaid: 0,
          minHolidayUnit: 0,
          durationRule: 0,
          provideWay: 0,
          provideRule: 0,
          defaultDuration: 0,
          singleApplyType: '0',
          singleApplyLimit: '',
          singleApplyRule: 0,
          balSwitch: false,
          singleSwitch: false,
          fixedLimit: 0
      },
      balSwitch: false,
      singleSwitch: false,
      noData: noData,
      allSel: true,
      partSel: false,
      data2: [],
      selStr: '',
      holidayTypes: [
        {id: 1, name: '年假'},
        {id: 2, name: '调休假'},
        {id: 3, name: '事假'},
        {id: 4, name: '病假'},
        {id: 5, name: '婚假'},
        {id: 6, name: '产假'},
        {id: 7, name: '陪产假'},
        {id: 8, name: '产检假'},
        {id: 9, name: '丧假'},
        {id: 10, name: '哺乳假'},
        {id: 11, name: '公假'},
        {id: 12, name: '探亲假'}
      ],
      isPaids: [
        {id: 1, name: '带薪假'},
        {id: 2, name: '部分带薪'},
        {id: 3, name: '非带薪假'}
      ],
      minHolidayUnits: [
        {id: 1, name: '按小时'},
        {id: 2, name: '按天'}
      ],
      durationRules: [
        {id: 1, name: '按工作日'},
        {id: 2, name: '按自然日'}
      ],
      provideWays: [
        {id: 1, name: '自动发放'},
        {id: 2, name: '固定余额'},
        {id: 3, name: '加班时长计入余额'}
      ],
      provideRules: [
        {id: 1, name: '审批通过即时发放'},
        {id: 2, name: '年初自动发放'},
        {id: 3, name: 'GOME总部年假定制规则|按天释放'},
        {id: 4, name: 'GOME总部哺乳假定制规则'},
        {id: 5, name: 'GOME公假定制规则'},
        {id: 6, name: 'GOME探亲假定制规则'}
      ],
      defaultDurations: [
        {id: 1, name: '一年(自然年)'},
        {id: 2, name: '一年半(自然年)'},
        {id: 3, name: '一年(365天)'},
        {id: 4, name: '三个月后月底作废'}
      ],
      singleApplyRules: [
        {id: 1, name: '国美总部陪产假限额规则'}
      ],
      provideRuleTips: [
        '选中规则后，本处显示规则说明',
        '通用规则：审批通过后即时发放',
        '通用规则：自然年年初自动发放',
        `定制规则：
        5.7 年假
        5.7.1 新入职或公司间异动的员工，自到岗之日起倒推，连续工作满 12 个月可享受法定
        带薪年假，且签订劳务协议的员工不享受年假。
        5.7.2 员工当年应享受年假天数
        5.7.2.1 累计工龄满 1 年不满 10 年，年假 5 天;
        5.7.2.2 累计工龄满 10 年不满 20 年，年假 10 天; 5.7.2.3 累计工龄满 20 年，年假 15 天。
        5.7.3 入职满一年以上，年假以当年已过日历天数进行核定，即: 员工当前可享受年假天数=当前已过日历天数/365×员工当年应享受年假天数
        5.7.4 当年入职或调入且有工作连续满 12 个月证明的，年假为: 员工当前可享受年假天数=员工入职或调入至当前的日历天数/365×员工当年全年应享受年假天数
        5.7.5 当年入职或调入的员工，工作未连续满 12 个月或无证明的，则从入职之月起满 12
             个月后可以开始享受年假，无法提供累计工龄证明的，按员工缴纳社会保险累计年限计算: 员工当前可享受年假天数=可以开始享受年假之日至当前的日历天数/365×员工 当年全年应享受年假天数
        5.7.6 员工有下列情形之一的，不享受当年度的年假，或员工已享受当年的年假，又出 现下列情形之一的，不享受下一年度的年假:
        5.7.6.1 累计工龄满 1 年不满 10 年，自然年度内请病假累计 2 个月以上的;
        5.7.6.2 累计工龄满 10 年不满 20 年，自然年度内请病假累计 3 个月以上的;
        5.7.6.3 累计工龄满 20 年以上，自然年度内请病假累计 4 个月以上的。`,
        '定制规则：员工自生产日期起至满 12 个月期间，每个工作日可享有 1 小时哺乳假',
        '定制规则：签订劳务协议的员工不享受公假',
        '定制规则： 异地调动人员每连续工作满 6 个月可享受一次 3 个工作日的探亲假，自然年度内 有效'
      ],
      singleApplyRuleTips: [
        '选中规则后，本处显示规则说明',
        '定制规则：配偶生育且符合国家计划生育要求的公司男员工，签订劳动合同的员工享受陪产假 15 天，签订劳务协议的员工享受陪产假 3 天'
      ]
    }
  },
  methods: {
    // 搜索按钮
    handleSubmit () {
      this.changePage(1)
    },
    closeSAT() {
      this.formData.singleApplyType = 0
    },
    updateTree(e) {
      this.formData.applyRange = e.applyRange
      this.formData.applyList = e.applyList
      this.changeRange = false
    },
    addCustomDelay() {
      this.customDelays.push({year: '', date: ''})
    },
    delCustomDelay(key) {
      this.customDelays.splice(key, 1)
    },
    getDelayDate(e, index) {
      this.customDelays[index]['date'] = e
    },
    changePage (page) {
      this.loading = true
      this.pageInfo.current = page

      let data = {
        holidayType: this.search.holidayType,
        holidayName: this.search.holidayName,
        applyRange: this.search.applyRange,
        pageNum: page || 1,
        pageSize: this.pageInfo.page_size || 20
      }
      getRuleList(data).then(res => {
        const data = res.data
        this.loading = false
        if (data.code === 200) {
          this.pageInfo.total = data.data.total
          this.pageInfo.current = data.data.pageNum
          this.pageInfo.page_size = data.data.pageSize
          this.model_data = setSerialNum(data.data.list, this.pageInfo)
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })
    },
    showRange () {
      this.changeRange = true
    },
    saveRule () {
      let flag = false
      this.$refs['formData'].validate((valid) => {
        if (!valid) {
          flag = true
        }
      })

      if (flag) {
        return false
      }

      let data = JSON.parse(JSON.stringify(this.formData))

      if (data.checkCustomDelay) {
        let list = this.customDelays
        let customDuration = ''

        for (let i = 0; i < list.length; i++) {
          customDuration += list[i]['year'] + '-' + list[i]['date'] + ','
        }

        data.customDuration = customDuration
      }

      if (data.singleApplyLimit) {
        if (data.minHolidayUnit == 1) {
          data.singleApplyLimit = data.singleApplyLimit + 'h'
        } else {
          data.singleApplyLimit = data.singleApplyLimit + 'd'
        }
      }


      if (data.id) { // 修改
        updateRule(data).then(res => {
          let data = res.data
          if (data.code === 200) {
            this.value3 = false
            this.$Message.success('保存成功')
            this.changePage()
          } else {
            this.$Message.error('保存失败：' + data.message)
          }
        })
      } else { // 新增
        saveRule(data).then(res => {
          let data = res.data
          if (data.code === 200) {
            this.value3 = false
            this.$Message.success('保存成功')
            this.changePage()
          } else {
            this.$Message.error('保存失败：' + data.message)
          }
        })
      }
    },
    // 更新状态
    updateStatus (row) {
      let data = {
        id: row.id,
        status: 3 - row.status
      }

      updateStatus(data).then(res => {
        let data = res.data
        if (data.code === 200) {
          this.value3 = false
          this.$Message.success('更新成功')
          this.changePage()
        } else {
          this.$Message.error('更新失败：' + data.message)
        }
      })
    },
    // 编辑页面
    editRule (id) {
      this.formData = {
          holidayType: 0,
          holidayName: '',
          applyRange: '1',
          applyList: null,
          isPaid: 0,
          minHolidayUnit: 0,
          durationRule: 0,
          provideWay: 0,
          provideRule: 0,
          defaultDuration: 0,
          singleApplyType: '0',
          singleApplyLimit: '',
          singleApplyRule: 0,
          balSwitch: false,
          singleSwitch: false,
          fixedLimit: 0
      }
      this.selStr = ''
      this.singleSwitch = false
      this.balSwitch = false
      this.editTitle = '新增休假规则'

      if (id) {
        this.editTitle = '修改休假规则'
        let data = {
          id: id
        }
        getRuleDetail(data).then(res => {
          let data = res.data
          if (data.code === 200) {
            this.formData = JSON.parse(JSON.stringify(data.data))
            this.formData.applyRange = this.formData.applyRange + ''
            this.formData.singleApplyType = this.formData.singleApplyType + ''

            if (this.formData.provideWay != 0) {
              this.formData.balSwitch = true
              this.balSwitch = true
            }
            if (this.formData.singleApplyType != 0) {
              this.formData.singleSwitch = true
              this.singleSwitch = true
            }

            let applyList = this.formData.applyList
            if (applyList) {
              let strTmp = ','
              for (let i = 0; i < applyList.length; i++) {
                strTmp += applyList[i]['applyId'] + ','
              }
              this.selStr = strTmp
            }

            this.customDelays = []
            if (this.formData.customDuration) {
              this.formData.checkCustomDelay = true
              let cdList = this.formData.customDuration.split(',')

              for (let i = 0; i < cdList.length; i++) {
                let row = cdList[i]
                if (row) {
                  let rowArr = row.split('-')
                  this.customDelays.push({year: rowArr[0], date: rowArr[1]})
                }
              }
            }

            if (this.formData.singleApplyLimit) {
              this.formData.singleApplyLimit = this.formData.singleApplyLimit.substr(0, this.formData.singleApplyLimit.length - 1)
            }
          } else {
            this.$Message.error('获取详情失败：' + data.message)
          }
        })
      }
      this.value3 = true
    },
    // 列表搜索重置
    handleReset (name) {
      this.search = {
        holidayType: '',
        holidayName: '',
        applyRange: ''
      }
      this.changePage()
    },
    setYears() {
      let date = new Date()
      let year = date.getFullYear()

      let years = []
      for (let i = year - 3; i <= year + 3; i++) {
        years.push(i+'')
      }

      this.years = years
    }
  },
  created () {
    // 请求列表数据
    this.changePage()
    this.setYears()
  }
}
</script>
