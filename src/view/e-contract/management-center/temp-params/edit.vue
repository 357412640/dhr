<template>
  <div class='temp-params-edit'>
    <Tabs value="1">
      <TabPane label="企业" name="1">
        <div>
          <div style='padding-bottom:10px'>序号</div>
            <Row class='sel-row'>
              <Col span='8' v-for='item in templateParam1' style='padding: 10px'>
                <Checkbox v-model='item.status' :true-value=1 :false-value=0 style='width:160px'>{{item.oaNameZh}}</Checkbox>
                <Select transfer v-model='item.qysName' size='small' style="width:100px">
                  <Option v-for='opt in sel' :value='opt.name' :key='opt.name'>{{opt.name}}</Option>
                </Select>
              </Col>
            </Row>
        </div>

        <div>
          <div style='padding-top:10px'>指定签章位置</div>
          <div style='padding:10px 0px'>
            <div v-for='(item, index) in templateSignParam1' style='border:1px dashed gray;padding:0px 40px 20px 40px;width:350px;margin-top:10px;margin-right:10px;display:inline-block'>
              <Icon @click='delKey1(index)' type="ios-close-circle" size=20 style='position:relative;bottom:10px;left:298px;z-index:999;cursor:pointer' />
              <div>
                <div style='width:60px;display:inline-block'>关键词</div>
                <Input v-model='item.keyword' :key='index' placeholder="请输入关键词" style="width: 150px" />
              </div>
              <div style='padding-top:10px'>
                <div style='width:60px;display:inline-block'>水平偏移</div>
                <Input v-model='item.x' placeholder="0" style="width: 120px;padding-right:10px;" />毫米
              </div>
              <div style='padding-top:10px'>
                <div style='width:60px;display:inline-block'>垂直偏移</div>
                <Input v-model='item.y' placeholder="0" style="width: 120px;padding-right:10px;" />毫米
              </div>
            </div>
          </div>
          <div @click='addKey1' style='color:#3C8CFF;cursor:pointer'><Icon type="md-add-circle" size=22 style='padding-right:8px' />添加关键词</div>
        </div>
      </TabPane>
      <TabPane label="个人" name="2">
        <div>
          <div style='padding-bottom:10px'>序号</div>
            <Row class='sel-row'>
              <Col span='8' v-for='item in templateParam2' style='padding: 10px'>
                <Checkbox v-model='item.status' :true-value=1 :false-value=0 style='width:200px'>{{item.oaNameZh}}</Checkbox>
                <Select transfer v-model='item.qysName' size='small' style="width:100px">
                  <Option v-for='opt in sel' :value='opt.name' :key='opt.name'>{{opt.name}}</Option>
                </Select>
              </Col>
            </Row>
        </div>

        <div>
          <div style='padding-top:10px'>指定签章位置</div>
          <div style='padding:10px 0px'>
            <div v-for='(item, index) in templateSignParam2' style='border:1px dashed gray;padding:0px 40px 20px 40px;width:350px;margin-top:10px;margin-right:10px;display:inline-block'>
              <Icon @click='delKey2(index)' type="ios-close-circle" size=20 style='position:relative;bottom:10px;left:298px;z-index:999;cursor:pointer' />
              <div>
                <div style='width:60px;display:inline-block'>关键词</div>
                <Input v-model='item.keyword' :key='index' placeholder="请输入关键词" style="width: 150px" />
              </div>
              <div style='padding-top:10px'>
                <div style='width:60px;display:inline-block'>水平偏移</div>
                <Input v-model='item.x' placeholder="0" style="width: 120px;padding-right:10px;" />毫米
              </div>
              <div style='padding-top:10px'>
                <div style='width:60px;display:inline-block'>垂直偏移</div>
                <Input v-model='item.y' placeholder="0" style="width: 120px;padding-right:10px;" />毫米
              </div>
            </div>
          </div>
          <div @click='addKey2' style='color:#3C8CFF;cursor:pointer'><Icon type="md-add-circle" size=22 style='padding-right:8px' />添加关键词</div>
        </div>
      </TabPane>
    </Tabs>
    <Row style='margin-top:20px'>
      <Col span='4' offset='20'>
        <div>
          <Button type='primary' style="margin-right:8px" @click='saveTemplate'>确定</Button>
          <Button style="margin-right:8px" @click='toPage'>取消</Button>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
import { getQysParams, saveTemplate } from '@/api/e-contract'

export default {
  data() {
    return {
      id: this.$route.query.id,
      sel: {},
      templateParam1: [
        {
          templateId: this.$route.query.id,
          paramType: 1,
          oaNameZh: '甲方',
          oaName: 'subject',
          qysName: '',
          status: 0,
        },
        {
          templateId: this.$route.query.id,
          paramType: 1,
          oaNameZh: '甲方法定代表人',
          oaName: 'legalperson',
          qysName: '',
          status: 0,
        },
        {
          templateId: this.$route.query.id,
          paramType: 1,
          oaNameZh: '甲方合同类型',
          oaName: 'contractchildtype',
          qysName: '',
          status: 0,
        },
        {
          templateId: this.$route.query.id,
          paramType: 1,
          oaNameZh: '甲方合同期限开始',
          oaName: 'starttime',
          qysName: '',
          status: 0,
        },
        {
          templateId: this.$route.query.id,
          paramType: 1,
          oaNameZh: '甲方合同期限结束',
          oaName: 'futuretime',
          qysName: '',
          status: 0,
        },
        {
          templateId: this.$route.query.id,
          paramType: 1,
          oaNameZh: '甲方月份',
          oaName: 'test_time_id',
          qysName: '',
          status: 0,
        },
        {
          templateId: this.$route.query.id,
          paramType: 1,
          oaNameZh: '甲方试用期开始',
          oaName: 'starttime',
          qysName: '',
          status: 0,
        },
        {
          templateId: this.$route.query.id,
          paramType: 1,
          oaNameZh: '甲方试用期结束',
          oaName: 'test_time',
          qysName: '',
          status: 0,
        },
        {
          templateId: this.$route.query.id,
          paramType: 1,
          oaNameZh: '甲方岗位',
          oaName: 'post_type',
          qysName: '',
          status: 0,
        },
        {
          templateId: this.$route.query.id,
          paramType: 1,
          oaNameZh: '甲方工时制度',
          oaName: 'job_time',
          qysName: '',
          status: 0,
        },
      ],
      templateSignParam1: [],
      templateParam2: [
        {
          templateId: this.$route.query.id,
          paramType: 2,
          oaNameZh: '乙方',
          oaName: '',
          qysName: '',
          status: 0,
        },
        {
          templateId: this.$route.query.id,
          paramType: 2,
          oaNameZh: '性别',
          oaName: '',
          qysName: '',
          status: 0,
        },
        {
          templateId: this.$route.query.id,
          paramType: 2,
          oaNameZh: '身份证号码',
          oaName: '',
          qysName: '',
          status: 0,
        },

        {
          templateId: this.$route.query.id,
          paramType: 2,
          oaNameZh: '或者其他有效证件名称及号码',
          oaName: '',
          qysName: '',
          status: 0,
        },
        {
          templateId: this.$route.query.id,
          paramType: 2,
          oaNameZh: '户籍类型（非农业/农业）',
          oaName: '',
          qysName: '',
          status: 0,
        },
        {
          templateId: this.$route.query.id,
          paramType: 2,
          oaNameZh: '户口所在地',
          oaName: '',
          qysName: '',
          status: 0,
        },
        {
          templateId: this.$route.query.id,
          paramType: 2,
          oaNameZh: '家庭住址及邮政编码',
          oaName: '',
          qysName: '',
          status: 0,
        },
        {
          templateId: this.$route.query.id,
          paramType: 2,
          oaNameZh: '通讯地址及邮政编码',
          oaName: '',
          qysName: '',
          status: 0,
        },
        {
          templateId: this.$route.query.id,
          paramType: 2,
          oaNameZh: '电子邮箱',
          oaName: '',
          qysName: '',
          status: 0,
        },
        {
          templateId: this.$route.query.id,
          paramType: 2,
          oaNameZh: '联系电话',
          oaName: '',
          qysName: '',
          status: 0,
        },
        {
          templateId: this.$route.query.id,
          paramType: 2,
          oaNameZh: '紧急联系人',
          oaName: '',
          qysName: '',
          status: 0,
        },
        {
          templateId: this.$route.query.id,
          paramType: 2,
          oaNameZh: '联系电话',
          oaName: '',
          qysName: '',
          status: 0,
        },
      ],
      templateSignParam2: [],
    }
  },
  methods: {
    getQysParams() {
      let data = {id: this.id}
      getQysParams(data).then(res => {
        const data = res.data
        if (data.code === 200) {
          this.sel = data.data
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })
    },
    saveTemplate() {
      let templateParam = this.templateParam1.concat(this.templateParam2)
      let templateSignParam = this.templateSignParam1.concat(this.templateSignParam2)

      let data = {
        templateParam: templateParam,
        templateSignParam: templateSignParam
      }
      saveTemplate(data).then(res => {
        const data = res.data
        if (data.code === 200) {
          this.$Message.success('保存成功！')
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })
    },
    addKey1() {
      this.templateSignParam1.push({
        templateId: this.id,
        paramType: 1,
        keyword: '',
        x: 0,
        y: 0,
      })
    },
    delKey1(index) {
      this.templateSignParam1.splice(index, 1)
      console.log(index)
    },
    addKey2() {
      this.templateSignParam2.push({
        templateId: this.id,
        paramType: 2,
        keyword: '',
        x: 0,
        y: 0,
      })
    },
    delKey2(index) {
      this.templateSignParam2.splice(index, 1)
    },
    toPage() {
      let query = {}
      this.$router.push({name: 'temp_params_list', query: query})
    },
  },
  mounted() {
    this.getQysParams()
    this.getTemplateInfo()
    this.getTemplateKeys()
  }
}
</script>

<style>
.temp-params-edit {
  padding: 20px;
}
.sel-row {
  padding: 10px 0px;
}
</style>
