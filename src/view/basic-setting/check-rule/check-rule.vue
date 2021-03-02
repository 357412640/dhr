<template>
<div class="user-management">
  <div class="search-box">
    <Form ref="formCustom" :model="formCustom" :label-width="80" @submit.native.prevent>
      <Row>
        <Col span="3">
          <Button type="primary" ghost style="float:left;margin-right:10px;" @click="editCal(0)" v-if="hasPerm(40)">新增</Button>
        </Col>
        <Col span="6">
          <FormItem label="出勤类型">
            <Select v-model="search.kqType" transfer placeholder='请选择'>
              <Option value="" key="">全部</Option>
              <Option v-for="item in kqTypes" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="5">
          <FormItem label="规则名称">
            <Input type="text" v-model="search.kqName" placeholder='请输入'></Input>
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
          <FormItem :label-width="10" style="padding-left:20px">
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

  <Drawer title="编辑考勤规则" v-model="value3" width="420" :mask-closable="false" :styles="styles">
    <Form :model="formData" :label-width="100" style="margin-bottom:30px">
        <Row :gutter="32">
            <Col span="16">
              <FormItem label="考勤类型">
                <Select v-model="formData.kqType">
                  <Option v-for="item in kqTypes" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
              </FormItem>
            </Col>
        </Row>
        <Row :gutter="32">
          <Col span="16">
            <FormItem label="规则名称">
              <Input v-model="formData.kqName" placeholder="请输入" />
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">
          <Col span="16">
            <FormItem label="计算单位">
              <Select v-model="formData.unit">
                <Option v-for="item in units" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
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
          <Col span="24">
            <FormItem label="状态">
              <i-Switch v-model="formData.status" true-value="1" false-value="2" />
            </FormItem>
          </Col>
        </Row>
        <FormItem label="说明">
          <Input type="textarea" v-model="formData.remark" :rows="4" placeholder="请输入" />
        </FormItem>

        <div v-if="formData.kqType == 1">
          <Row :gutter="32">
            <Col span="24">
              <FormItem label="合规预警">
                <span>每月加班累计上限</span>
                <Input v-model="formData.complianceWarning" placeholder="请输入" style='width:60px' />
                <span>小时</span>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="16">
              <FormItem label="计算方式">
                <RadioGroup v-model="formData.computeMode" vertical>
                  <Radio label="1">
                    <span>按审批时长</span>
                  </Radio>
                  <Radio label="2">
                    <span>审批时段内，按打卡时长</span>
                  </Radio>
                  <Radio label="3">
                    <span>无需审批，按打卡时长</span>
                  </Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="24">
              <FormItem label="扣除休息时长">
                <i-Switch v-model="formData.deductionRestTime" true-value="1" false-value="2" />

                <br>
                <RadioGroup v-model="formData.deductionType">
                  <Radio label="1">按连续工作时长扣除</Radio>
                  <Radio label="2">扣除用餐时间</Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
          <Row v-if="formData.deductionType == '1'">
            <Col span='18' style='margin-left:100px;margin-top:-20px;margin-bottom:10px'>
              <span @click='addDT' style='cursor:pointer;color:#2d8cf0'>添加</span>
              <div v-for='item in formData.deductionDsc'>
                <span>连续工作满</span>
                <Input style="width:35px;margin: 0px 6px 0px 6px" v-model="item.fullHour" />
                <span>小时，扣除</span>
                <Input style="width:35px;margin: 0px 6px 0px 6px" v-model="item.deductionHour" />
                <span>小时</span>
                <span @click='delDT' style='cursor:pointer;color:#2d8cf0;padding-left:4px'>删除</span>
              </div>
            </Col>
          </Row>
          <Row v-if="formData.deductionType == '2'">
            <Col span='16' style='margin-left:100px;margin-top:-20px;margin-bottom:10px'>到下班时间后，继续实际工作时间超出 1 小时的，开始计算加班时间。加班时间以考勤系统自动记录为准。如工作日 18 点下班的，给予 1 小时用餐时间(不计加班)，从 19 点开始计算加班时间上限</Col>
          </Row>

          <Row :gutter="32">
            <Col span="24">
              <FormItem label="取整规则">
                <span>最小单位</span>
                <Input style="width:55px;margin: 0px 6px 0px 6px" v-model="formData.integerRulesMinUint" placeholder="请输入" />
                <span>小时</span>

                <div>
                  <span>取整规则</span>
                  <Select v-model="formData.integerRulesForensicsRule" style="width:90px;margin: 0px 0px 0px 6px">
                    <Option v-for="item in integerRulesForensicsRules" :value="item.id" :key="item.id">{{ item.name }}</Option>
                  </Select>
                </div>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="16">
              <FormItem label="兑换方式">
                <RadioGroup v-model="formData.exchangeMethod" vertical>
                  <Radio label="1">
                    <span>记为调休</span>
                  </Radio>
                  <Radio label="2">
                    <span>记为加班费</span>
                  </Radio>
                  <Radio label="3">
                    <span>默认记调休，可申请记为加班费</span>
                  </Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
        </div>

        <div v-if="formData.kqType == 2 || formData.kqType == 3">
          <Row :gutter="32">
            <Col span="24">
              <FormItem label="启用豁免">
                <i-Switch v-model="formData.isExempt" true-value="1" false-value="2" />

                <br>
                <RadioGroup v-model="formData.isExempt">
                  <Radio label="1">减免次数，每月减免<Input style="width:55px;margin: 0px 6px 0px 6px" v-model="formData.exemptCountLate" placeholder="请输入" />次</Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="16">
              <FormItem label="最小单位">
                <Input style="width:100px" v-model="formData.unitMin" placeholder="请输入" /> <span>分钟</span>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="16">
              <FormItem label="最大单位">
                <Input style="width:100px" v-model="formData.unitMax" placeholder="请输入" /> <span>分钟</span>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="16">
              <FormItem label="取整规则">
                <Select v-model="formData.integerRules">
                  <Option v-for="item in integerRuless" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
        </div>

        <div v-if="formData.kqType == 6 || formData.kqType == 7">
          <Row :gutter="32">
            <Col span="24">
              <FormItem label="" style="margin-left:-90px">
                <Checkbox v-model="formData.isCheckedInRule" true-value="1" false-value="2">非全天公出/出差，到岗或离岗未打卡，按未打卡规则执行</Checkbox>
              </FormItem>
            </Col>
          </Row>
        </div>

        <div v-if="formData.kqType == 4">
          <Row :gutter="32">
            <Col span="24">
              <FormItem label="" style="margin-left:-90px">
                <Checkbox v-model="formData.exemptTypeNotclockin" true-value="1" false-value="2">
                  <span>减免次数，每月豁免</span>
                  <Input style="width:40px;margin: 0px 6px 0px 6px" v-model="formData.exemptCountNotclockin" placeholder="" />
                  <span>次</span>
                </Checkbox>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="24">
              <FormItem label="" style="margin-left:-90px">
                <Checkbox v-model="formData.applicationType" true-value="1" false-value="2">
                  <span>考勤期间超出</span>
                  <Input style="width:40px;margin: 0px 6px 0px 6px" v-model="formData.applicationNumber" placeholder="" />
                  <span>次申请，每次申请同时记录为</span>
                  <Input style="width:40px;margin: 0px 6px 0px 6px" v-model="formData.absenteeismHours" placeholder="" />
                  <span>小时旷工</span>
                </Checkbox>
              </FormItem>
            </Col>
          </Row>
        </div>

        <div v-if="formData.kqType == 5">
          <Row :gutter="32">
            <Col span="24">
              <FormItem label="" style="margin-left:-90px">
                <Checkbox v-model="formData.lateOutType" true-value="1" false-value="2">
                  <span>迟到超</span>
                  <Input style="width:40px;margin: 0px 6px 0px 6px" v-model="formData.lateOutTime" placeholder="" />
                  <span>分钟，上取整小时数记为旷工</span>
                </Checkbox>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="24">
              <FormItem label="" style="margin-left:-90px">
                <Checkbox v-model="formData.leaveEarlyOutType" true-value="1" false-value="2">
                  <span>早退超</span>
                  <Input style="width:40px;margin: 0px 6px 0px 6px" v-model="formData.leaveEarlyOutTime" placeholder="" />
                  <span>分钟，上取整小时数记为旷工</span>
                </Checkbox>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="24">
              <FormItem label="" style="margin-left:-90px">
                <Checkbox v-model="formData.isNotApprove" true-value="1" false-value="2">
                  <span>未经批准的未打卡，记为旷工</span>
                </Checkbox>
              </FormItem>
            </Col>
          </Row>
        </div>

        <div v-if="formData.id">
          <Row :gutter="32">
              <Col span="16">
                  <FormItem label="创建用户">
                    <span style="color:gray">{{formData.createUser}}（{{formData.createUserId}}）</span>
                  </FormItem>
              </Col>
          </Row>
          <Row :gutter="32">
              <Col span="16">
                  <FormItem label="创建时间">
                    <span style="color:gray"> {{formData.createTime}} </span>
                  </FormItem>
              </Col>
          </Row>
          <Row :gutter="32">
              <Col span="16">
                  <FormItem label="更新用户">
                    <span v-if="formData.updateUser" style="color:gray"> {{formData.updateUser}} </span>
                    <span v-else style="color:gray"> -- </span>
                  </FormItem>
              </Col>
          </Row>
          <Row :gutter="32">
              <Col span="16">
                  <FormItem label="更新时间">
                    <span v-if="formData.updateTime" style="color:gray"> {{formData.updateUser}} </span>
                    <span v-else style="color:gray;"> -- </span>
                  </FormItem>
              </Col>
          </Row>
        </div>
    </Form>
    <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="value3 = false">取消</Button>
        <Button type="primary" @click="saveCal">确定</Button>
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
import { getRuleList, getScopeTree, getRuleDetail, saveRule, updateRule, updateStatus } from '@/api/check-rule'
import { setSerialNum, deepClone, noData } from '@/libs/util'
import ScopeTree from '@/components/scope-tree'
export default {
  name: 'model-management',
  components: {
    ScopeTree
  },
  data () {
    return {
      treeSearch: '',
      seledTree: '',
      split1: 0.5,
      changeRange: false,
      formCustom: {
        model_name: ''
      },
      item_model_sel: [],
      loading: false,
      model_columns: [
        {
          title: '考勤类型',
          key: 'kqType',
          align: 'center',
          tooltip: true,
          minWidth: 100,
          render: (h, params) => {
            let kqTypeStr = ''
            switch (params.row.kqType) {
              case 1:
                kqTypeStr = '加班'
                break
              case 2:
                kqTypeStr = '迟到'
                break
              case 3:
                kqTypeStr = '早退'
                break
              case 4:
                kqTypeStr = '未打卡'
                break
              case 5:
                kqTypeStr = '旷工'
                break
              case 6:
                kqTypeStr = '公出'
                break
              case 7:
                kqTypeStr = '出差'
                break
              default:
                break
            }
            return h('div', [
              h('span',
                kqTypeStr
              ),
            ])
          }
        },
        {
          title: '规则名称',
          key: 'kqName',
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
          render: (h, params) => {
            if (params.row.applyRange == 1) {
              return h('div', [
                h('span',
                  '通用'
                ),
              ])
            } else {
              return h('div', [
                h('span',
                  '自定义'
                ),
              ])
            }
          }
        },
        {
          title: '状态',
          key: 'status',
          align: 'center',
          tooltip: true,
          minWidth: 10,
          render: (h, params) => {
            if (params.row.status == 1) {
              return h('div', [
                h('Badge', {
                  props: {
                    status: 'success',
                    text: '启用'
                  }
                }),
              ])
            } else {
              return h('div', [
                h('Badge', {
                  props: {
                    status: 'warning',
                    text: '停用'
                  }
                }),
              ])
            }
          }
        },
        {
          title: '说明',
          key: 'remark',
          align: 'center',
          tooltip: true,
          width: 160
        },
        {
          title: '操作',
          key: 'operate',
          align: 'center',
          width: 140,
          render: (h, params) => {
            let statusText = '启用'
            if (params.row.status == 1) {
              statusText = '停用'
            }

            let style41 = {}
            let style42 = {}
            let style44 = {}
            if (!this.hasPerm(41)) {
              style41.display = 'none'
            }
            if (!this.hasPerm(42)) {
              style42.display = 'none'
            }
            if (!this.hasPerm(44)) {
              style44.display = 'none'
            }

            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                style: style41,
                on: {
                  click: () => {
                    this.editCal(params.row.id)
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                style: (params.row.status == 1) ? style44 : style42,
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
      model_data: [],
      pageInfo: {},
      search: {
        name: '',
        applyRange: 0,
        status: ''
      },
      value3: false,
      styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
      },
      formData: {
      },
      noData: noData,
      allSel: true,
      partSel: false,
      data2: [],
      selStr: '',
      kqTypes: [
        {id: 1, name: '加班'},
        {id: 2, name: '迟到'},
        {id: 3, name: '早退'},
        {id: 4, name: '未打卡'},
        {id: 5, name: '旷工'},
        {id: 6, name: '公出'},
        {id: 7, name: '出差'}
      ],
      units: [
        {id: 1, name: '小时'},
        {id: 2, name: '分钟'},
        {id: 3, name: '次'}
      ],
      integerRuless: [
        {id: 1, name: '下取整'},
        {id: 2, name: '上取整'}
      ],
      integerRulesForensicsRules: [
        {id: 1, name: '下取整'},
        {id: 2, name: '上取整'}
      ],
    }
  },
  methods: {
    // 搜索按钮
    handleSubmit () {
      this.changePage(1)
    },
    addDT() {
      this.formData.deductionDsc.push({'fullHour': '', deductionHour: ''})
    },
    delDT(index) {
      this.formData.deductionDsc.splice(index, 1)
    },
    updateTree(e) {
      this.formData.applyRange = e.applyRange
      this.formData.applyList = e.applyList
      this.changeRange = false
    },
    changePage (page) {
      this.loading = true
      this.pageInfo.current = page
      let data = {
        kqName: this.search.kqName,
        kqType: this.search.kqType,
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
    toPage (path, row) {
      let query = {
        id: row.id,
        calendarName: row.calendarName,
        applyRange: row.applyRange,
        status: row.status,
        createTime: row.createTime
      }
      this.$router.push({path: path, query: query})
    },
    showRange () {
      this.changeRange = true
    },
    saveCal () {
      let data = JSON.parse(JSON.stringify(this.formData))

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
    editCal (id) {
      this.formData = {
        kqName: '',
        kqType: 1,
        applyRange: '1',
        applyList: [],
        status: '1',
        unit: 1,
        remark: '',
        complianceWarning: '',
        computeMode: '1',
        deductionRestTime: '1',
        integerRulesMinUint: '',
        integerRulesForensicsRule: '1',
        exchangeMethod: '1',
        integerRules: '1',
        unitMax: '',
        unitMin: '',
        isExempt: '1',
        exemptCountLate: '',
        isCheckedInRule: '1',
        exemptTypeNotclockin: '1',
        exemptCountNotclockin: '',
        applicationType: '1',
        applicationNumber: '',
        absenteeismHours: '',
        lateOutType: '1',
        lateOutTime: '',
        leaveEarlyOutType: '1',
        leaveEarlyOutTime: '',
        isNotApprove: '1',
        deductionType: '1',
        deductionDsc: []
      }
      this.selStr = ''

      if (id) {
        let data = {
          id: id
        }
        getRuleDetail(data).then(res => {
          let data = res.data
          if (data.code === 200) {
            this.formData = data.data
            this.formData.status = this.formData.status + ""
            this.formData.deductionRestTime = this.formData.deductionRestTime + ""
            this.formData.exchangeMethod = this.formData.exchangeMethod + ""
            this.formData.applyRange = this.formData.applyRange + ""
            this.formData.computeMode = this.formData.computeMode + ""
            this.formData.isExempt = this.formData.isExempt + ""
            this.formData.exemptTypeNotclockin = this.formData.exemptTypeNotclockin + ""
            this.formData.applicationType = this.formData.applicationType + ""
            this.formData.lateOutType = this.formData.lateOutType + ""
            this.formData.leaveEarlyOutType = this.formData.leaveEarlyOutType + ""
            this.formData.isNotApprove = this.formData.isNotApprove + ""
            this.formData.isCheckedInRule = this.formData.isCheckedInRule + ""
            this.formData.deductionType = this.formData.deductionType + ""

            let applyList = this.formData.applyList
            if (applyList) {
              let strTmp = ''
              for (let i = 0; i < applyList.length; i++) {
                strTmp += applyList[i]['applyId'] + ','
              }
              this.selStr = strTmp
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
        kqType: '',
        kqName: '',
        applyRange: 0
      }
      this.changePage()
    }
  },
  created () {
    // 请求列表数据
    this.changePage()
  }
}
</script>
