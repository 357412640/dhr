<template>
  <div class='contract-seal-edit'>
    <div>
      <Row style='padding-bottom:6px'>
        <Col>基本信息</Col>
      </Row>
      <Form label-position='top'>
      <Row :gutter='40' class='base-info-row'>
        <Col span='10'>
          <FormItem label='姓名'>
            <Input disabled></Input>
          </FormItem>
        </Col>
        <Col span='10'>
          <FormItem label='岗位'>
            <Input disabled></Input>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter='40' class='base-info-row'>
        <Col span='10'>
          <FormItem label='员工ID'>
            <Input disabled></Input>
          </FormItem>
        </Col>
        <Col span='10'>
          <FormItem label='身份证号'>
            <Input disabled></Input>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter='40' class='base-info-row'>
        <Col span='10'>
          <FormItem label='入职日期'>
            <Input disabled></Input>
          </FormItem>
        </Col>
        <Col span='10'>
          <FormItem label='组织全路径'>
            <Input disabled></Input>
          </FormItem>       
        </Col>
      </Row>
      <Row :gutter='40' class='base-info-row'>
        <Col span='10'>
          <FormItem label='手机号'>
            <Input disabled></Input>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter='40' class='base-info-row'>
        <Col span='10'>
          <FormItem label='户籍'>
            <Input></Input>
          </FormItem>
        </Col>
        <Col span='10'>
          <FormItem label='类型'>
            <Input></Input>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter='40' class='base-info-row'>
        <Col span='10'>
          <FormItem label='紧急联系人'>
            <Input></Input>
          </FormItem>
        </Col>
        <Col span='10'>
          <FormItem label='家庭地址'>
            <Input></Input>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter='40' class='base-info-row'>
        <Col span='10'>
          <FormItem label='邮政编码'>
            <Input></Input>
          </FormItem>
        </Col>
        <Col span='10'>
          <FormItem label='在京居住地'>
            <Input></Input>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter='40' class='base-info-row'>
        <Col span='10'>
          <FormItem label='邮政编码'>
            <Input></Input>
          </FormItem>
        </Col>
        <Col span='10'>
          <FormItem label='户口所在地'>
            <Input></Input>
          </FormItem>
        </Col>
      </Row>
      </Form>
    </div>
    <Divider />
    <div>
      <div style='padding-bottom:6px;'>合同信息</div>
      <Form label-position='top'>
      <Row :gutter='40' class='base-info-row'>
        <Col span='10'>
          <FormItem label='合同版本'>
            <Input disabled></Input>
          </FormItem>
        </Col>
        <Col span='10'>
          <FormItem label='合同甲方'>
            <Input disabled></Input>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter='40' class='base-info-row'>
        <Col span='10'>
          <FormItem label='合同签订次数'>
            <Input disabled></Input>
          </FormItem>
        </Col>
        <Col span='10'>
          <FormItem label='合同子类型'>
            <Input disabled></Input>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter='40' class='base-info-row'>
        <Col span='10'>
          <FormItem label='签订年限'>
            <Input disabled></Input>
          </FormItem>
        </Col>
        <Col span='10'>
          <FormItem label='岗位类型'>
            <Input disabled></Input>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter='40' class='base-info-row'>
        <Col span='10'>
          <FormItem label='工时制度'>
            <Input disabled></Input>
          </FormItem>
        </Col>
        <Col span='10'>
          <FormItem label='试用期限'>
            <Input disabled></Input>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter='40' class='base-info-row'>
        <Col span='10'>
          <FormItem label='合同开始日期'>
            <Input disabled></Input>
          </FormItem>
        </Col>
        <Col span='10'>
          <FormItem label='合同预计结束日期'>
            <Input disabled></Input>
          </FormItem>
        </Col>
      </Row>
      </Form>
    </div>

    <Row>
      <Col span='6' offset='18'>
        <div>
          <Button style="margin-right:8px">取消</Button>
          <Button type="primary">保存</Button>
        </div>
      </Col>
    </Row>

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
.contract-seal-edit {
  padding: 20px;
}
.base-info-data {
  color: #D7D7D7;
}
.base-info-row {
  padding: 10px 0px;
}
</style>
