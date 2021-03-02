<template>
  <div class='due-soon-list'>
    <Form label-position='top'>
      <Row :gutter='40'>
        <Col span='8'>
          <FormItem label='姓名'>
            <Input placeholder='请输入姓名'></Input>
          </FormItem>
        </Col>
        <Col span='8'>
          <FormItem label='员工ID'>
            <Input placeholder='请输入员工ID'></Input>
          </FormItem>
        </Col>
        <Col span='8'>
          <FormItem label='OA单号'>
            <Input placeholder='请输入OA单号'></Input>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter='40'>
        <Col span='8'>
          <FormItem label='合同类型'>
            <Select>
              <Option>全部</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>

      <FormItem style='text-align:center;'>
        <Button type="primary">查询</Button>
        <Button style="margin-left: 8px">重置</Button>
      </FormItem>
    </Form>

    <div style='margin-bottom:8px'>
      <Row>
        <Col span='6'>
          <div>
            <Button type="primary">发送OA</Button>
          </div>
        </Col>
        <Col span='4' offset="14">
          <Select multiple placeholder='自定义' max-tag-count=1 @on-change='customTitle'>
            <Option v-for="(item, key) in cols" :value="key" :key="key">{{ item.title }}</Option>
          </Select>
        </Col>
      </Row>
    </div>
    <Table border ref="selection" :columns="dataCols"></Table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataCols: [],
      cols: [
        {
          title: '序号',
          type: 'selection',
          align: 'center',
          width: 60
        },
        {
          title: '姓名',
          align: 'center',
          key: '',
          width: 80
        },
        {
          title: '身份证号',
          align: 'center',
          key: '',
          width: 100
        },
        {
          title: '员工ID',
          align: 'center',
          key: '',
          width: 100
        },
        {
          title: '组织全路径',
          align: 'center',
          key: '',
          width: 100
        },
        {
          title: '岗位',
          align: 'center',
          key: '',
          width: 100
        },
        {
          title: '岗位层级',
          align: 'center',
          key: '',
          width: 100
        },
        {
          title: '入职时间',
          align: 'center',
          key: '',
          width: 100
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
          width: 100
        },
        {
          title: '合同预计结束日期',
          align: 'center',
          key: '',
          width: 100
        },
        {
          title: '合同结束日期',
          align: 'center',
          key: '',
          width: 100
        },
        {
          title: 'OA单号',
          align: 'center',
          key: '',
          width: 100
        },
        {
          title: '状态',
          align: 'center',
          key: '',
          width: 80,
        },
        {
          title: '操作',
          align: 'center',
          key: '',
          width: 100,
          fixed: 'right',
          render: (h, params) => {
            return h('div', [
              h('button',
                {
                  props: {type: 'text', size: 'small'}
                },
                '详情'),
              h('button',
                {
                  props: {type: 'text', size: 'small'}
                },
                '发送OA'),
            ])
          }
        },
      ]
    }
  },
  methods: {
    changeMore() {
      this.more = !this.more
    },
    customTitle(val) {
      let tmp = []
      let list = val

      if (list.length > 0) {
        list = list.sort(function(a, b){return a - b})

        for (let i = 0; i < list.length; i++) {
          tmp.push(this.cols[list[i]])
        }
      } else {
        tmp = this.cols
      }
      this.dataCols = tmp
    }
  },
  mounted() {
    this.customTitle([])
  }
}
</script>

<style>
.due-soon-list {
  padding: 20px;
}
.com-ctr {
  display: inline-block;
  padding-right: 30px;
  padding-bottom: 20px;
}
</style>
