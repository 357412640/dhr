<template>
  <div class='contract-seal-detail'>
    <div>
      <Row style='padding-bottom:6px'>
        <Col>基本信息</Col>
      </Row>
      <Row class='base-info-row'>
        <Col span='12'>
          <div>
            <span>姓名：</span>
            <span class='base-info-data'>马国美</span>
          </div>
        </Col>
        <Col span='12'>
          <div>
            <span>岗位：</span>
            <span class='base-info-data'>测试专家</span>
          </div>
        </Col>
      </Row>
      <Row class='base-info-row'>
        <Col span='12'>
          <div>
            <span>员工ID：</span>
            <span class='base-info-data'>10503560</span>
          </div>
        </Col>
        <Col span='12'>
          <div>
            <span>身份证号：</span>
            <span class='base-info-data'>1404311986XXXXXXXX</span>
          </div>
        </Col>
      </Row>
      <Row class='base-info-row'>
        <Col span='12'>
          <div>
            <span>入职日期：</span>
            <span class='base-info-data'>2020-12-08</span>
          </div>
        </Col>
        <Col span='12'>
          <div>
            <span>组织全路径：</span>
            <span class='base-info-data'>电器/国美集团/国美零售控股总部/国美在线公司/智慧办公体系/产品中心/产品部/智慧办公组
            </span>
          </div>
        </Col>
      </Row>
      <Row class='base-info-row'>
        <Col span='12'>
          <div>
            <span>手机号：</span>
            <span class='base-info-data'>13717588669</span>
          </div>
        </Col>
        <Col span='12'>
          <div>
            <span>岗位层级：</span>
            <span class='base-info-data'>测试专家</span>
          </div>
        </Col>
      </Row>
      <Row class='base-info-row'>
        <Col span='12'>
          <div>
            <span>户籍：</span>
            <span class='base-info-data'>山东省济南市</span>
          </div>
        </Col>
        <Col span='12'>
          <div>
            <span>类型：</span>
            <span class='base-info-data'>非农</span>
          </div>
        </Col>
      </Row>
      <Row class='base-info-row'>
        <Col span='12'>
          <div>
            <span>紧急联系人：</span>
            <span class='base-info-data'>马国美</span>
          </div>
        </Col>
        <Col span='12'>
          <div>
            <span>家庭住址：</span>
            <span class='base-info-data'>北京市朝阳区XXX街道</span>
          </div>
        </Col>
      </Row>
      <Row class='base-info-row'>
        <Col span='12'>
          <div>
            <span>邮政编码：</span>
            <span class='base-info-data'>0100002</span>
          </div>
        </Col>
        <Col span='12'>
          <div>
            <span>在京居住地：</span>
            <span class='base-info-data'>北京市朝阳区XXX街道</span>
          </div>
        </Col>
      </Row>
      <Row class='base-info-row'>
        <Col span='12'>
          <div>
            <span>邮政编码：</span>
            <span class='base-info-data'>0100002</span>
          </div>
        </Col>
        <Col span='12'>
          <div>
            <span>户口所在地：</span>
            <span class='base-info-data'>山东省济南市XXX街道</span>
          </div>
        </Col>
      </Row>
    </div>
    <Divider />
    <div>
      <div style='padding-bottom:6px;'>合同信息</div>
      <Row class='base-info-row'>
        <Col span='12'>
          <div>
            <span>合同版本：</span>
            <span class='base-info-data'>GMDQ_08前版</span>
          </div>
        </Col>
        <Col span='12'>
          <div>
            <span>合同甲方：</span>
            <span class='base-info-data'>国美控股有限公司</span>
          </div>
        </Col>
      </Row>
      <Row class='base-info-row'>
        <Col span='12'>
          <div>
            <span>合同签订次数：</span>
            <span class='base-info-data'>新签订</span>
          </div>
        </Col>
        <Col span='12'>
          <div>
            <span>合同子类型：</span>
            <span class='base-info-data'>无固定</span>
          </div>
        </Col>
      </Row>
      <Row class='base-info-row'>
        <Col span='12'>
          <div>
            <span>签订年限：</span>
            <span class='base-info-data'>3年</span>
          </div>
        </Col>
        <Col span='12'>
          <div>
            <span>岗位类型：</span>
            <span class='base-info-data'>管理</span>
          </div>
        </Col>
      </Row>
      <Row class='base-info-row'>
        <Col span='12'>
          <div>
            <span>工时制度：</span>
            <span class='base-info-data'>不定时</span>
          </div>
        </Col>
        <Col span='12'>
          <div>
            <span>试用期限：</span>
            <span class='base-info-data'>2020/4/11</span>
          </div>
        </Col>
      </Row>
      <Row class='base-info-row'>
        <Col span='12'>
          <div>
            <span>合同开始日期：</span>
            <span class='base-info-data'>2023/4/10</span>
          </div>
        </Col>
        <Col span='12'>
          <div>
            <span>合同预计结束日期：</span>
            <span class='base-info-data'>2023/4/10</span>
          </div>
        </Col>
      </Row>
      <Row class='base-info-row'>
        <Col span='12'>
          <div>
            <span>OA单号：</span>
            <span class='base-info-data'>11259005919</span>
          </div>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataCols: [
        {
          title: '序号',
          align: 'center',
          key: '',
          width: 80
        },
        {
          title: '合同版本',
          align: 'center',
          key: '',
          width: 100
        },
        {
          title: '合同甲方',
          align: 'center',
          key: '',
          width: 100
        },
        {
          title: '合同签订次数',
          align: 'center',
          key: '',
          width: 100
        },
        {
          title: '签订年限',
          align: 'center',
          key: '',
          width: 100
        },
        {
          title: '合同子类型',
          align: 'center',
          key: '',
          width: 100
        },
        {
          title: '岗位类型',
          align: 'center',
          key: '',
          width: 100
        },
        {
          title: '工时制度',
          align: 'center',
          key: '',
          width: 100
        },
        {
          title: '试用期限',
          align: 'center',
          key: '',
          width: 100
        },
        {
          title: '合同开始日期',
          align: 'center',
          key: '',
        },
        {
          title: '合同预计结束日期',
          align: 'center',
          key: '',
        },
        {
          title: 'OA单号',
          align: 'center',
          key: '',
          width: 100
        },
      ]
    }
  },
  methods: {
  },
  mounted() {
  }
}
</script>

<style>
.contract-seal-detail {
  padding: 20px;
}
.base-info-data {
  color: #D7D7D7;
}
.base-info-row {
  padding: 10px 0px;
}
</style>
