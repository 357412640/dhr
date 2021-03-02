<template>
  <div class='contract-all-detail'>
    <div>
      <Row style='padding-bottom:6px'>
        <Col>基本信息</Col>
      </Row>
      <Row class='base-info-row'>
        <Col span='12'>
          <div>
            <span>姓名：</span>
            <span class='base-info-data'>{{userInfo.name}}</span>
          </div>
        </Col>
        <Col span='12'>
          <div>
            <span>岗位：</span>
            <span class='base-info-data'>{{userInfo.posiDescr}}</span>
          </div>
        </Col>
      </Row>
      <Row class='base-info-row'>
        <Col span='12'>
          <div>
            <span>员工ID：</span>
            <span class='base-info-data'>{{userInfo.emplid}}</span>
          </div>
        </Col>
        <Col span='12'>
          <div>
            <span>身份证号：</span>
            <span class='base-info-data'>{{userInfo.nationalId}}</span>
          </div>
        </Col>
      </Row>
      <Row class='base-info-row'>
        <Col span='12'>
          <div>
            <span>入职日期：</span>
            <span class='base-info-data'>{{userInfo.origHireDt}}</span>
          </div>
        </Col>
        <Col span='12'>
          <div>
            <span>组织全路径：</span>
            <span class='base-info-data'>{{userInfo.deptChain}}</span>
          </div>
        </Col>
      </Row>
      <Row class='base-info-row'>
        <Col span='12'>
          <div>
            <span>手机号：</span>
            <span class='base-info-data'>{{userInfo.phone}}</span>
          </div>
        </Col>
      </Row>
    </div>
    <Divider />
    <div>
      <div style='padding-bottom:6px;'>合同信息</div>
      <Table border :columns="dataCols" :data='dataRows'></Table>
    </div>

    <Row style='margin-top:20px'>
      <Col span='2' offset='22'>
        <div>
          <Button style="margin-right:8px" @click='toPage'>取消</Button>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
import { getContractDetail, getViewUrl } from '@/api/e-contract'

export default {
  data() {
    return {
      emplid: this.$route.query.emplid,
      dataRows: [],
      userInfo: {},
      dataCols: [
        {
          title: '序号',
          align: 'center',
          key: 'number',
          type: 'index',
          width: 80
        },
        {
          title: '合同版本',
          align: 'center',
          key: 'contractModeValue',
          width: 100
        },
        {
          title: '合同甲方',
          align: 'center',
          key: 'subject',
          width: 100
        },
        {
          title: '合同签订次数',
          align: 'center',
          key: 'signTime',
          width: 100
        },
        {
          title: '签订年限',
          align: 'center',
          key: 'years',
          width: 100
        },
        {
          title: '合同子类型',
          align: 'center',
          key: 'contractchildtype',
          width: 100
        },
        {
          title: '岗位类型',
          align: 'center',
          key: 'postType',
          width: 100
        },
        {
          title: '工时制度',
          align: 'center',
          key: 'jobTime',
          width: 100
        },
        {
          title: '试用期限',
          align: 'center',
          key: 'testTime',
          width: 100
        },
        {
          title: '合同开始日期',
          align: 'center',
          key: 'starttime',
          width: 120
        },
        {
          title: '合同预计结束日期',
          align: 'center',
          key: 'futuretime',
          width: 140
        },
        {
          title: 'OA单号',
          align: 'center',
          key: 'oaNo',
          width: 100
        },
        {
          title: '操作',
          align: 'center',
          key: '',
          width: 100,
          fixed: 'right',
          render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.getViewUrl(params.row.contractNo)
                  }
                }
              }, '详情')             
          }
        },
      ]
    }
  },
  methods: {
    toPage() {
      let query = {}
      this.$router.push({name: 'contract_all_list', query: query})
    },
    getContractDetail() {
      let data = {
        emplid: this.emplid
      }
      getContractDetail(data).then(res => {
        const data = res.data
        this.loading = false
        if (data.code === 200) {
          this.dataRows = data.data.contracts
          this.userInfo = data.data
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })
    },
    getViewUrl(no) {
      let data = { bizId: no }
      getViewUrl(data).then(res => {
        const data = res.data
        if (data.code === 200) {
          if (data.data) {
            window.open(data.data)
          } else {
            this.$Message.error('查找不到对应详情页！')
          }
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })
    },
  },
  mounted() {
    this.getContractDetail()
  }
}
</script>

<style>
.contract-all-detail {
  padding: 20px;
}
.base-info-data {
  color: #D7D7D7;
}
.base-info-row {
  padding: 10px 0px;
}
</style>
