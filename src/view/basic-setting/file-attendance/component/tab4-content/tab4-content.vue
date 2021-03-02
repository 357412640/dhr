<template>
  <div>
    <div class='main-box'>
      <div class='main-title'>人员基本信息</div>
      <div class='base-info-box'>
        <span class='base-info-attr'>性别：{{base_info.sex}}</span>
        <span class='base-info-attr'>员工类别：{{base_info.emplClassDescr}}</span>
        <span class='base-info-attr'>参加工作日期：{{base_info.startDtChn}}</span>
        <span class='base-info-attr'>入职日期：{{base_info.origHireDt}}</span>
        <span class='base-info-attr'>离职日期：{{base_info.dimissionDt}}</span>
      </div>
    </div>
    <div class='main-box'>
      <div class='main-title'>考勤属性
        <span v-if="hasPerm(70)">
           <Icon class='edit-icon' type="ios-create-outline" size='18' color='#2b85e4' />
          <Button type="text" @click='saveStaffInfo'>保存</Button>
        </span>
      </div>
      <div class='base-info-box'>
        <span class='base-info-attr'>假期日历：
            <Select v-model='base_info.calendarId' transfer placeholder='请选择' style='width:160px'>
              <Option value='0' key='0'>无</Option>
              <Option v-for='item in calList' :value='item.id' :key='item.id'>{{item.calendarName}}</Option>
            </Select>
        </span>
        <span class='base-info-attr'>考勤期间：
            <Select v-model='base_info.apId' transfer placeholder='请选择' style='width:160px'>
              <Option value='0' key='0'>无</Option>
              <Option v-for='item in checkList' :value='item.id' :key='item.id'>{{item.name}}</Option>
            </Select>
        </span>
        <span class='base-info-attr'>班次：
            <Select v-model='base_info.wtrId' transfer placeholder='请选择' style='width:160px'>
              <Option value='0' key='0'>无</Option>
              <Option v-for='item in shiftList' :value='item.id' :key='item.id'>{{item.workName}}</Option>
            </Select>
        </span>
      </div>
    </div>
    <div class='main-box' v-if='wtrId'>
      <div class='main-title'>适用休假规则<Icon style='display:none' class='edit-icon' type="ios-create-outline" size='18' color='#2b85e4' /></div>
      <div class='base-info-box'>
        <span class='detail-attr'>
          年假：{{base_info.holidayNjName}}
          <Icon type="ios-browsers-outline" size='18' color='#2b85e4' style='cursor:pointer;' @click='showRule(base_info.holidayNjId)' />
        </span>
        <span class='detail-attr'>
          调休假：{{base_info.holidayTxjName}}
          <Icon type="ios-browsers-outline" size='18' color='#2b85e4' style='cursor:pointer;' @click='showRule(base_info.holidayTxjId)' />
        </span>
        <span class='detail-attr'>
          事假：{{base_info.holidayShjName}}
          <Icon type="ios-browsers-outline" size='18' color='#2b85e4' style='cursor:pointer;' @click='showRule(base_info.holidayShjId)' />
        </span>
        <span class='detail-attr'>
          病假：{{base_info.holidayBjName}}
          <Icon type="ios-browsers-outline" size='18' color='#2b85e4' style='cursor:pointer;' @click='showRule(base_info.holidayBjId)' />
        </span>
        <span class='detail-attr'>
          婚假：{{base_info.holidayHjName}}
          <Icon type="ios-browsers-outline" size='18' color='#2b85e4' style='cursor:pointer;' @click='showRule(base_info.holidayHjId)' />
        </span>
        <span class='detail-attr'>
          产假：{{base_info.holidayChjName}}
          <Icon type="ios-browsers-outline" size='18' color='#2b85e4' style='cursor:pointer;' @click='showRule(base_info.holidayChjId)' />
        </span>
        <span class='detail-attr'>
          陪产假：{{base_info.holidayPchjName}}
          <Icon type="ios-browsers-outline" size='18' color='#2b85e4' style='cursor:pointer;' @click='showRule(base_info.holidayPchjId)' />
        </span>
        <span class='detail-attr'>
          产检：{{base_info.holidayChjjName}}
          <Icon type="ios-browsers-outline" size='18' color='#2b85e4' style='cursor:pointer;' @click='showRule(base_info.holidayChjjId)' />
        </span>
        <span class='detail-attr'>
          丧假：{{base_info.holidaySjName}}
          <Icon type="ios-browsers-outline" size='18' color='#2b85e4' style='cursor:pointer;' @click='showRule(base_info.holidaySjId)' />
        </span>
        <span class='detail-attr'>
          哺乳假：{{base_info.holidayBrjName}}
          <Icon type="ios-browsers-outline" size='18' color='#2b85e4' style='cursor:pointer;' @click='showRule(base_info.holidayBrjId)' />
        </span>
        <span class='detail-attr'>
          公假：{{base_info.holidayGjName}}
          <Icon type="ios-browsers-outline" size='18' color='#2b85e4' style='cursor:pointer;' @click='showRule(base_info.holidayGjId)' />
        </span>
        <span class='detail-attr'>
          探亲假：{{base_info.holidayTqjName}}
          <Icon type="ios-browsers-outline" size='18' color='#2b85e4' style='cursor:pointer;' @click='showRule(base_info.holidayTqjId)' />
        </span>
      </div>
    </div>
    <div class='main-box' v-if='wtrId' style='margin-top:-10px;'>
      <div class='main-title'>适用考勤规则<Icon style='display:none' class='edit-icon' type="ios-create-outline" size='18' color='#2b85e4' /></div>
      <div class='base-info-box'>
        <span class='detail-attr'>
          加班：{{base_info.kqJbGzrName}}
          <Icon type="ios-browsers-outline" size='18' color='#2b85e4' style='cursor:pointer;' @click='showCal(base_info.kqJbGzrId)' />
        </span>
        <span class='detail-attr'>
          加班：{{base_info.kqJbGxName}}
          <Icon type="ios-browsers-outline" size='18' color='#2b85e4' style='cursor:pointer;' @click='showCal(base_info.kqJbGxId)' />
        </span>
        <span class='detail-attr'>
          加班：{{base_info.kqJbJjrName}}
          <Icon type="ios-browsers-outline" size='18' color='#2b85e4' style='cursor:pointer;' @click='showCal(base_info.kqJbJjrId)' />
        </span>
        <span class='detail-attr'>
          迟到：{{base_info.kqChdName}}
          <Icon type="ios-browsers-outline" size='18' color='#2b85e4' style='cursor:pointer;' @click='showCal(base_info.kqChdId)' />
        </span>
        <span class='detail-attr'>
          早退：{{base_info.kqZtName}}
          <Icon type="ios-browsers-outline" size='18' color='#2b85e4' style='cursor:pointer;' @click='showCal(base_info.kqZtId)' />
        </span>
        <span class='detail-attr'>
          公出：{{base_info.kqGchName}}
          <Icon type="ios-browsers-outline" size='18' color='#2b85e4' style='cursor:pointer;' @click='showCal(base_info.kqGchId)' />
        </span>
        <span class='detail-attr'>
          出差：{{base_info.kqChchName}}
          <Icon type="ios-browsers-outline" size='18' color='#2b85e4' style='cursor:pointer;' @click='showCal(base_info.kqChchId)' />
        </span>
        <span class='detail-attr'>
          旷工：{{base_info.kqKgName}}
          <Icon type="ios-browsers-outline" size='18' color='#2b85e4' style='cursor:pointer;' @click='showCal(base_info.kqKgId)' />
        </span>
        <span class='detail-attr'>
          未打卡：{{base_info.kqWdkName}}
          <Icon type="ios-browsers-outline" size='18' color='#2b85e4' style='cursor:pointer;' @click='showCal(base_info.kqWdkId)' />
        </span>
      </div>
    </div>

      <Drawer title="查看假期规则" v-model="drawer1" width="500" :mask-closable="false">
        <Form ref="formData" :model="formData" :label-width="110" style="margin-bottom:30px">
            <Row :gutter="32">
              <Col span="16">
                <FormItem label="假期类型">
                  <Select v-model="formData.holidayType" transfer placeholder='请选择' disabled>
                    <Option v-for="item in holidayTypes" :value="item.id" :key="item.id">{{ item.name }}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="32">
              <Col span="16">
                <FormItem label="假期名称">
                  <Input v-model="formData.holidayName" placeholder="请输入" disabled />
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
                  <Select v-model="formData.isPaid" transfer placeholder='请选择' disabled>
                    <Option v-for="item in isPaids" :value="item.id" :key="item.id">{{ item.name }}</Option>
                  </Select>
                  <div style="width:360px;color:gray">若选择为带薪假期，假期将会在考勤统计中算做出勤</div>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="32">
              <Col span="16">
                <FormItem label="最小请假单位">
                  <Select v-model="formData.minHolidayUnit" transfer placeholder='请选择' disabled>
                    <Option v-for="item in minHolidayUnits" :value="item.id" :key="item.id">{{ item.name }}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="32">
              <Col span="16">
                <FormItem label="请假时长核算">
                  <Select v-model="formData.durationRule" transfer placeholder='请选择' disabled>
                    <Option v-for="item in durationRules" :value="item.id" :key="item.id">{{ item.name }}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="32">
              <Col span="24">
                <FormItem label="假期余额规则">
                  <i-Switch v-model="formData.balSwitch" disabled />
                  <span style="padding-left:8px;color:gray">周期内假期有余额限制时启用，如：调休假</span>
                </FormItem>
              </Col>
            </Row>
            <div v-if="formData.balSwitch">
              <Row :gutter="32">
                <Col span="16">
                  <FormItem label="余额发放方式">
                    <Select v-model="formData.provideWay" transfer placeholder='请选择' disabled>
                      <Option v-for="item in provideWays" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <span v-if='formData.provideWay == 2'>
                      ，<Input v-model="formData.fixedLimit" style='width:60px' disabled />小时
                    </span>
                  </FormItem>
                </Col>
              </Row>
              <Row :gutter="32">
                <Col span="16">
                  <FormItem label="发放规则">
                    <Select v-model="formData.provideRule" transfer placeholder='请选择' disabled>
                      <Option v-for="item in provideRules" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                  </FormItem>
                </Col>
              </Row>
              <Row :gutter="32">
                <Col span="16">
                  <FormItem label="默认有效期">
                    <Select v-model="formData.defaultDuration" transfer placeholder='请选择' disabled>
                      <Option v-for="item in defaultDurations" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span='24'>
                  <Checkbox v-model="formData.checkCustomDelay" disabled>自定义有效期延期</Checkbox>
                </Col>
              </Row>
              <Row :gutter="32" v-for='(item, key) in customDelays' style='margin-bottom:10px;margin-top:10px'>
                <Col span="24">
                  <div>
                    <Select v-model="item.year" transfer placeholder='请选择' style='width:100px' disabled>
                      <Option v-for="val in years" :value="val" :key="val">{{ val }}</Option>
                    </Select>
                    <span style='margin:0px 4px'>到期日，延长至</span>
                    <DatePicker @on-change='getDelayDate($event, key)' format="yyyy/MM/dd" type="date" disabled style="width: 120px" :value='item.date'></DatePicker>
                  </div>
                </Col>
              </Row>
            </div>

            <Row :gutter="32">
              <Col span="24">
                <FormItem label="单次申请限额规则">
                  <i-Switch v-model="formData.singleSwitch" disabled />
                  <span style="padding-left:8px;color:gray">单次申请限制申请时长上限时启用，如：婚假</span>
                </FormItem>
              </Col>
            </Row>
            <Row v-if="formData.singleSwitch" :gutter="32">
              <Col span="16">
                <FormItem label="">
                  <RadioGroup v-model="formData.singleApplyType" vertical>
                    <Radio label="1" disabled>
                      <span>固定额度</span>
                      <Input v-model="formData.singleApplyLimit" placeholder="" style="padding: 0px 10px 0px 10px;width:90px" disabled />
                      <span v-if='formData.minHolidayUnit == 1'>小时</span>
                      <span v-else>天</span>
                    </Radio>
                    <Radio label="2" disabled>
                      <span>规则判断</span>
                    </Radio>
                    <Select v-model="formData.singleApplyRule" transfer placeholder='请选择' disabled>
                      <Option v-for="item in singleApplyRules" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                  </RadioGroup>
                </FormItem>
              </Col>
            </Row>
        </Form>
      </Drawer>

      <Drawer title="查看考勤期间" v-model="drawer2" width="500" :mask-closable="false">
        <Form :model="formData2" :label-width="100" style="margin-bottom:30px">
            <Row :gutter="32">
                <Col span="16">
                  <FormItem label="考勤类型">
                    <Select v-model="formData2.kqType" disabled>
                      <Option v-for="item in kqTypes" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                  </FormItem>
                </Col>
            </Row>
            <Row :gutter="32">
              <Col span="16">
                <FormItem label="规则名称">
                  <Input v-model="formData2.kqName" placeholder="请输入" disabled />
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="32">
              <Col span="16">
                <FormItem label="计算单位">
                  <Select v-model="formData2.unit" disabled>
                    <Option v-for="item in units" :value="item.id" :key="item.id">{{ item.name }}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="32">
              <Col span="24">
                <FormItem label="适用范围">
                  <span v-if="formData2.applyRange == '1'" style="color:rgba(0, 0, 0, 0.65);padding-left:6px">全员</span>
                  <span v-else style="color:rgba(0, 0, 0, 0.65);padding-left:6px">自定义</span>
                  <span style="padding-left:10px;color:#2d8cf0;cursor:pointer;" @click="showRange2">修改</span>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="32">
              <Col span="24">
                <FormItem label="状态">
                  <i-Switch v-model="formData2.status" true-value="1" false-value="2" disabled />
                </FormItem>
              </Col>
            </Row>
            <FormItem label="说明">
              <Input type="textarea" v-model="formData2.remark" :rows="4" placeholder="请输入" disabled />
            </FormItem>

            <div v-if="formData2.kqType == 1">
              <Row :gutter="32">
                <Col span="16">
                  <FormItem label="合规预警">
                    <Input v-model="formData2.complianceWarning" placeholder="请输入" disabled />
                  </FormItem>
                </Col>
                <Col>
                  <span>小时</span>
                </Col>
              </Row>
              <Row :gutter="32">
                <Col span="16">
                  <FormItem label="计算方式">
                    <RadioGroup v-model="formData2.computeMode" vertical>
                      <Radio label="1" disabled>
                        <span>按审批时长</span>
                      </Radio>
                      <Radio label="2" disabled>
                        <span>审批时段内，按打卡时长</span>
                      </Radio>
                      <Radio label="3" disabled>
                        <span>无需审批，按打卡时长</span>
                      </Radio>
                    </RadioGroup>
                  </FormItem>
                </Col>
              </Row>
              <Row :gutter="32">
                <Col span="24">
                  <FormItem label="扣除休息时长">
                    <i-Switch v-model="formData2.deductionRestTime" true-value="1" false-value="2" disabled />

                    <br>
                    <RadioGroup v-model="formData2.deductionType">
                      <Radio label="1" disabled>按连续工作时长扣除</Radio>
                      <Radio label="2" disabled>扣除用餐时间</Radio>
                    </RadioGroup>
                  </FormItem>
                </Col>
              </Row>
              <Row v-if="formData.deductionType == '1'">
                <Col span='18' style='margin-left:100px;margin-top:-20px;margin-bottom:10px'>
                  <div v-for='item in formData.deductionDsc'>
                    <span>连续工作满</span>
                    <Input style="width:35px;margin: 0px 6px 0px 6px" v-model="item.fullHour" disabled />
                    <span>小时，扣除</span>
                    <Input style="width:35px;margin: 0px 6px 0px 6px" v-model="item.deductionHour" disabled />
                    <span>小时</span>
                  </div>
                </Col>
              </Row>
              <Row :gutter="32">
                <Col span="24">
                  <FormItem label="取整规则">
                    <span>最小单位</span>
                    <Input style="width:55px;margin: 0px 6px 0px 6px" v-model="formData2.integerRulesMinUint" placeholder="请输入" disabled />
                    <span>小时</span>

                    <div>
                      <span>取整规则</span>
                      <Select v-model="formData2.integerRulesForensicsRule" style="width:90px;margin: 0px 0px 0px 6px" disabled>
                        <Option v-for="item in integerRulesForensicsRules" :value="item.id" :key="item.id">{{ item.name }}</Option>
                      </Select>
                    </div>
                  </FormItem>
                </Col>
              </Row>
              <Row :gutter="32">
                <Col span="16">
                  <FormItem label="兑换方式">
                    <RadioGroup v-model="formData2.exchangeMethod" vertical>
                      <Radio label="1" disabled>
                        <span>记为调休</span>
                      </Radio>
                      <Radio label="2" disabled>
                        <span>记为加班费</span>
                      </Radio>
                      <Radio label="3" disabled>
                        <span>默认记调休，可申请记为加班费</span>
                      </Radio>
                    </RadioGroup>
                  </FormItem>
                </Col>
              </Row>
            </div>

            <div v-if="formData2.kqType == 2 || formData2.kqType == 3">
              <Row :gutter="32">
                <Col span="24">
                  <FormItem label="启用豁免">
                    <i-Switch v-model="formData2.isExempt" true-value="1" false-value="2" disabled />

                    <br>
                    <RadioGroup v-model="formData2.isExempt">
                      <Radio label="1" disabled>减免次数，每月减免<Input style="width:55px;margin: 0px 6px 0px 6px" v-model="formData.exemptCountLate" placeholder="请输入" />次</Radio>
                    </RadioGroup>
                  </FormItem>
                </Col>
              </Row>
              <Row :gutter="32">
                <Col span="16">
                  <FormItem label="最小单位">
                    <Input style="width:100px" v-model="formData2.unitMin" placeholder="请输入" disabled /> <span>分钟</span>
                  </FormItem>
                </Col>
              </Row>
              <Row :gutter="32">
                <Col span="16">
                  <FormItem label="最大单位">
                    <Input style="width:100px" v-model="formData2.unitMax" placeholder="请输入" disabled /> <span>分钟</span>
                  </FormItem>
                </Col>
              </Row>
              <Row :gutter="32">
                <Col span="16">
                  <FormItem label="取整规则">
                    <Select v-model="formData2.integerRules" disabled>
                      <Option v-for="item in integerRuless" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                  </FormItem>
                </Col>
              </Row>
            </div>

            <div v-if="formData2.kqType == 6 || formData2.kqType == 7">
              <Row :gutter="32">
                <Col span="24">
                  <FormItem label="" style="margin-left:-90px">
                    <Checkbox v-model="formData2.isCheckedInRule" true-value="1" false-value="2" disabled>非全天公出/出差，到岗或离岗未打卡，按未打卡规则执行</Checkbox>
                  </FormItem>
                </Col>
              </Row>
            </div>

            <div v-if="formData2.kqType == 4">
              <Row :gutter="32">
                <Col span="24">
                  <FormItem label="" style="margin-left:-90px">
                    <Checkbox v-model="formData2.exemptTypeNotclockin" true-value="1" false-value="2" disabled>
                      <span>减免次数，每月豁免</span>
                      <Input style="width:40px;margin: 0px 6px 0px 6px" v-model="formData2.exemptCountNotclockin" placeholder="" disabled/>
                      <span>次</span>
                    </Checkbox>
                  </FormItem>
                </Col>
              </Row>
              <Row :gutter="32">
                <Col span="24">
                  <FormItem label="" style="margin-left:-90px">
                    <Checkbox v-model="formData2.applicationType" true-value="1" false-value="2" disabled>
                      <span>考勤期间超出</span>
                      <Input style="width:40px;margin: 0px 6px 0px 6px" v-model="formData2.applicationNumber" placeholder="" disabled />
                      <span>次申请，每次申请同时记录为</span>
                      <Input style="width:40px;margin: 0px 6px 0px 6px" v-model="formData2.absenteeismHours" placeholder="" disabled />
                      <span>小时旷工</span>
                    </Checkbox>
                  </FormItem>
                </Col>
              </Row>
            </div>

            <div v-if="formData2.kqType == 5">
              <Row :gutter="32">
                <Col span="24">
                  <FormItem label="" style="margin-left:-90px">
                    <Checkbox v-model="formData2.lateOutType" true-value="1" false-value="2" disabled>
                      <span>迟到超</span>
                      <Input style="width:40px;margin: 0px 6px 0px 6px" v-model="formData2.lateOutTime" placeholder="" disabled />
                      <span>分钟，上取整小时数记为旷工</span>
                    </Checkbox>
                  </FormItem>
                </Col>
              </Row>
              <Row :gutter="32">
                <Col span="24">
                  <FormItem label="" style="margin-left:-90px">
                    <Checkbox v-model="formData2.leaveEarlyOutType" true-value="1" false-value="2" disabled>
                      <span>早退超</span>
                      <Input style="width:40px;margin: 0px 6px 0px 6px" v-model="formData2.leaveEarlyOutTime" placeholder="" disabled />
                      <span>分钟，上取整小时数记为旷工</span>
                    </Checkbox>
                  </FormItem>
                </Col>
              </Row>
              <Row :gutter="32">
                <Col span="24">
                  <FormItem label="" style="margin-left:-90px">
                    <Checkbox v-model="formData2.isNotApprove" true-value="1" false-value="2" disabled>
                      <span>未经批准的未打卡，记为旷工</span>
                    </Checkbox>
                  </FormItem>
                </Col>
              </Row>
            </div>
        </Form>
      </Drawer>

      <Modal v-model="changeRange" title="修改适用范围" >
        <Row>
          <Col>
            <RadioGroup v-model="formData.applyRange" @on-change="changeRangeSel" disabled>
              <Radio label="1" disabled>全员</Radio>
              <Radio label="2" disabled>自定义适用范围</Radio>
            </RadioGroup>
          </Col>
        </Row>
        <Row v-if="allSel">
          <Col>
            <div style="height: 240px;border-radius: 4px;border: 1px solid #D9D9D9;background: #F5F5F5;padding:12px;margin-top:10px">
              <span>选怎全员则默认所有员工可使用当前假期日历</span><br>
              <span>若假期日历包含地方性法规约定的地方性法定节假日，如：古尔邦节，可通过自定义适用范围，选择对应管理范围进行设置</span>
            </div>
          </Col>
        </Row>
        <Row v-if="partSel">
            <div style="height: 240px;border-radius: 4px;border: 1px solid #D9D9D9;background: #F5F5F5;padding:12px;margin-top:10px">
                <Col span="12" style="border-right:1px solid #E6E6E6FF;display:none">
                  <Input prefix="ios-search" placeholder="请输入名称" style="width: auto" v-model="treeSearch" @on-change="getScopeTree(0)" />
                  <Tree :data="data2" ref="tree" @on-check-change="selTree" show-checkbox style="height:180px;overflow-y:auto;margin-right:10px"></Tree>
                </Col>
                <Col span="12">
                  <Input v-model="seledTree" prefix="ios-search" placeholder="请输入名称" style="width: auto;margin-left:20px;" />
                  <div style="margin-left:20px;padding-top:6px;height:180px;overflow-y:auto;">
                    <div v-for="item in formData.applyList" v-if="item.applyName.indexOf(seledTree) !== -1">
                      <span style="float:left">{{item.applyName}}</span>
                      <br>
                    </div>
                  </div>
                </Col>
            </div>
        </Row>
        <div slot="footer">
        </div>
      </Modal>

      <Modal v-model="changeRange2" title="修改适用范围" >
        <Row>
          <Col>
            <RadioGroup v-model="formData2.applyRange" @on-change="changeRangeSel">
              <Radio label="1" disabled>全员</Radio>
              <Radio label="2" disabled>自定义适用范围</Radio>
            </RadioGroup>
          </Col>
        </Row>
        <Row v-if="allSel">
          <Col>
            <div style="height: 240px;border-radius: 4px;border: 1px solid #D9D9D9;background: #F5F5F5;padding:12px;margin-top:10px">
              <span>选怎全员则默认所有员工可使用当前假期日历</span><br>
              <span>若假期日历包含地方性法规约定的地方性法定节假日，如：古尔邦节，可通过自定义适用范围，选择对应管理范围进行设置</span>
            </div>
          </Col>
        </Row>
        <Row v-if="partSel">
            <div style="height: 240px;border-radius: 4px;border: 1px solid #D9D9D9;background: #F5F5F5;padding:12px;margin-top:10px">
                <Col span="12" style="border-right:1px solid #E6E6E6FF;display:none">
                  <Input prefix="ios-search" placeholder="请输入名称" style="width: auto" v-model="treeSearch" @on-change="getScopeTree(0)" />
                  <Tree :data="data2" ref="tree" @on-check-change="selTree" show-checkbox style="height:180px;overflow-y:auto;margin-right:10px"></Tree>
                </Col>
                <Col span="12">
                  <Input v-model="seledTree" prefix="ios-search" placeholder="请输入名称" style="width: auto;margin-left:20px;" />
                  <div style="margin-left:20px;padding-top:6px;height:180px;overflow-y:auto;">
                    <div v-for="item in formData2.applyList" v-if="item.applyName.indexOf(seledTree) !== -1">
                      <span style="float:left">{{item.applyName}}</span>
                      <br>
                    </div>
                  </div>
                </Col>
            </div>
        </Row>
        <div slot="footer">
        </div>
      </Modal>
  </div>
</template>

<script>
import { getStaffInfo, getWtList, saveStaffInfo, getCalendarList, getAttList } from '@/api/file-attendance'
import { getRuleDetail, getScopeTree } from '@/api/holiday-rule-data'
import { getRuleDetail as getCheckRuleDetail } from '@/api/check-rule'
export default {
  name: 'tab4-content',
  props: {
    pemplid: {
      type: String
    }
  },
  data() {
    return {
      wtrId: null,
      selStr: '',
      allSel: true,
      partSel: false,
      treeSearch: '',
      seledTree: '',
      split1: 0.5,
      changeRange: false,
      changeRange2: false,
      formCustom: {
        model_name: ''
      },
      item_model_sel: [],
      base_info: {},
      params: {
        emplid: this.pemplid
      },
      drawer1: false,
      drawer2: false,
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
          singleApplyType: '1',
          singleApplyLimit: '',
          singleApplyRule: 0,
          balSwitch: false,
          singleSwitch: false
      },
      customDelays: [
        {year: '', date: ''}
      ],
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
      formData2: {},
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
      calList: [],
      checkList: [],
      shiftList: []
    }
  },
  methods: {
    getStaffInfo() {
      getStaffInfo(this.params).then(res => {
          let data = res.data
          if (data.code === 200) {
            this.base_info = data.data
            this.wtrId = this.base_info.wtrId
          } else {
            this.$Message.error('获取考勤数据失败：' + data.message)
          }
      })
    },
    showRule(id) {
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
          singleApplyType: '1',
          singleApplyLimit: '',
          singleApplyRule: 0,
          balSwitch: false,
          singleSwitch: false
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
            this.formData.applyRange = this.formData.applyRange + ''
            this.formData.singleApplyType = this.formData.singleApplyType + ''

            if (this.formData.provideWay != 0) {
              this.formData.balSwitch = true
            }
            if (this.formData.singleApplyType != 0) {
              this.formData.singleSwitch = true
            }

            let applyList = this.formData.applyList
            if (applyList) {
              let strTmp = ''
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
      this.drawer1 = true
    },
    showCal (id) {
      this.formData2 = {
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
        getCheckRuleDetail(data).then(res => {
          let data = res.data
          if (data.code === 200) {
            this.formData2 = data.data
            this.formData2.status = this.formData2.status + ""
            this.formData2.deductionRestTime = this.formData2.deductionRestTime + ""
            this.formData2.exchangeMethod = this.formData2.exchangeMethod + ""
            this.formData2.applyRange = this.formData2.applyRange + ""
            this.formData2.computeMode = this.formData2.computeMode + ""
            this.formData2.isExempt = this.formData2.isExempt + ""
            this.formData2.exemptTypeNotclockin = this.formData2.exemptTypeNotclockin + ""
            this.formData2.applicationType = this.formData2.applicationType + ""
            this.formData2.lateOutType = this.formData2.lateOutType + ""
            this.formData2.leaveEarlyOutType = this.formData2.leaveEarlyOutType + ""
            this.formData2.isNotApprove = this.formData2.isNotApprove + ""
            this.formData2.isCheckedInRule = this.formData2.isCheckedInRule + ""
            this.formData2.deductionType = this.formData2.deductionType + ""

            let applyList = this.formData2.applyList
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
      this.drawer2 = true
    },
    showRange () {
      this.changeRange = true
      this.changeRangeSel(this.formData.applyRange)

      this.getScopeTree(0)
    },
    showRange2 () {
      this.changeRange2 = true
      this.changeRangeSel(this.formData2.applyRange)

      this.getScopeTree(0)
    },
    changeRangeSel (val) {
      if (val == '1') {
        this.allSel = true
        this.partSel = false
      } else {
        this.allSel = false
        this.partSel = true
      }
      console.log(val)
    },
    getScopeTree (delNodeId) {
      let data = {}

      getScopeTree(data).then(res => {
        let data = res.data
        if (data.code === 200) {
          let list = data.data

          let nodes = []
          for (let i = 0; i < list.length; i++) {
            let node = {}

            node['title'] = list[i]['title']
            node['expand'] = true

            let c1 = []
            for (let j = 0; j < list[i]['children'].length; j++) {
              let c1d = {}
              c1d['title'] = list[i]['children'][j]['title']
              c1d['expand'] = true

              if (this.treeSearch && c1d['title'].indexOf(this.treeSearch) == -1) {
                break
              }

              let c2 = []
              for (let k = 0; k < list[i]['children'][j]['children'].length; k++) {
                console.log(this.selStr);
                  if (this.selStr.indexOf(list[i]['children'][j]['children'][k]['key'] + ',') !== -1 && list[i]['children'][j]['children'][k]['key'] != delNodeId) {
                    c2.push({
                      title: list[i]['children'][j]['children'][k]['title'],
                      id: list[i]['children'][j]['children'][k]['key'],
                      checked: true
                    })
                  } else {
                    c2.push({
                      title: list[i]['children'][j]['children'][k]['title'],
                      id: list[i]['children'][j]['children'][k]['key'],
                      checked: false
                    })
                  }
              }

              c1d['children'] = c2
              c1.push(c1d)
            }

            node['children'] = c1
            nodes.push(node)
          }

          this.data2 = nodes
          console.log(nodes);

          if (delNodeId) {
            this.$nextTick(() => {
              this.selTree()
            })
          }
        } else {
          this.$Message.error('更新失败：' + data.message)
        }
      })
    },
    in_array (search, array){
      for (let i in array) {
          if (array[i] == search){
              return true
          }
      }
      return false
    },
    selTree () {
      let nodes = this.$refs.tree.getCheckedNodes()

      let applyList = []
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i]['id']) {
          applyList.push({
            applyId: nodes[i]['id'],
            applyName: nodes[i]['title']
          })
        }
      }
      this.formData.applyList  = applyList

      if (applyList) {
        let strTmp = ''
        for (let i = 0; i < applyList.length; i++) {
          strTmp += applyList[i]['applyId'] + ','
        }
        this.selStr = strTmp
      }
    },
    delNode (id) {
      this.getScopeTree(id)
      // this.selTree()
    },
    getAllList() {
      let query = {
        pageNum: 1,
        pageSize: 9999
      }
      getCalendarList(query).then(res => {
        const data = res.data
        if (data.code === 200) {
          this.calList = data.data.list
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })

      getAttList(query).then(res => {
        const data = res.data
        if (data.code === 200) {
          this.checkList = data.data.list
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })

      getWtList(query).then(res => {
        const data = res.data
        if (data.code === 200) {
          this.shiftList = data.data.list
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })
    },
    saveStaffInfo() {
      let data = {
        emplid: this.params.emplid,
        wtrId: this.base_info.wtrId,
        calendarId: this.base_info.calendarId,
        apId: this.base_info.apId
      }
      saveStaffInfo(data).then(res => {
          let data = res.data
          if (data.code === 200) {
            this.$Message.success('保存成功')
            this.getStaffInfo()
          } else {
            this.$Message.error('保存失败：' + data.message)
          }
      })
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
  created() {
    this.setYears()
    this.getAllList()
    this.getScopeTree(0)
    this.getStaffInfo()
  }
}
</script>

<style scoped>
.main-box {
  padding: 10px 0px 10px 0px;
}
.main-title {
  border-left: 3px solid gray;
  padding-left: 12px;
  font-size: 13px;
  font-weight: 600;
}
.base-info-attr {
  margin-right: 40px;
}
.base-info-box {
  margin-top: 20px;
  margin-left: 10px;
  width: 100%;
}
.detail-attr {
  display: inline-block;
  width: 180px;
  margin-right: 40px;
  margin-bottom: 20px;
}
.edit-icon {
  font-weight: 900;
  margin-left: 8px;
  cursor: pointer;
}
</style>
