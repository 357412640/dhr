<template>
  <div class='contract-all-list'>
    <Form v-if='more' label-position='top'>
      <Row :gutter='40'>
        <Col span='8'>
          <FormItem label='姓名'>
            <Input key='1' v-model='search.name' placeholder='请输入姓名'></Input>
          </FormItem>
        </Col>
        <Col span='8'>
          <FormItem label='员工ID'>
            <Input v-model='search.emplid' placeholder='请输入员工ID'></Input>
          </FormItem>
        </Col>
        <Col span='8'>
          <FormItem label='OA单号'>
            <Input v-model='search.oano' placeholder='请输入OA单号'></Input>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter='40'>
        <Col span='8'>
          <FormItem label='合同甲方'>
            <Select v-model='search.subject'>
              <Option value='' key=''>全部</Option>
              <Option v-for='item in sel1' :value='item.name' :key='item.id'>{{item.name}}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span='8'>
          <FormItem label='组织全路径'>
            <Input v-model='search.deptchain' placeholder='请输入组织名称'></Input>
          </FormItem>
        </Col>
        <Col span='8'>
          <FormItem label='岗位层级'>
            <Select v-model='search.ranklvl'>
              <Option value='' key=''>全部</Option>
              <Option v-for='item in sel2' :value='item.bindValue' :key='item.id'>{{item.bindValue}}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter='40'>
        <Col span='8'>
          <FormItem label='入职时间'>
            <DatePicker v-model='search.dimissiondt' type="date" placeholder="请选择开始时间" style='width:100%'></DatePicker>
          </FormItem>
        </Col>
        <Col span='8'>
          <FormItem label='合同版本'>
            <Select v-model='search.mode'>
              <Option value='' key=''>全部</Option>
              <Option v-for='item in sel3' :value='item.title' :key='item.id'>{{item.title}}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span='8'>
          <FormItem label='签订次数'>
            <Select v-model='search.sgintime'>
              <Option value='' key=''>全部</Option>
              <Option v-for='item in sel4' :value='item.bindValue' :key='item.id'>{{item.bindValue}}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter='40'>
        <Col span='8'>
          <FormItem label='工时制度'>
            <Select v-model='search.worktime'>
              <Option value='' key=''>全部</Option>
              <Option v-for='item in sel5' :value='item.bindValue' :key='item.id'>{{item.bindValue}}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span='8'>
          <FormItem label='签订年限'>
            <Select v-model='search.years'>
              <Option value='' key=''>全部</Option>
              <Option v-for='item in sel6' :value='item.bindValue' :key='item.id'>{{item.bindValue}}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span='8'>
          <FormItem label='合同子类型'>
            <Select v-model='search.contactchildtype'>
              <Option value='' key=''>全部</Option>
              <Option v-for='item in sel7' :value='item.bindValue' :key='item.id'>{{item.bindValue}}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter='40'>
        <Col span='8'>
          <FormItem label='合同开始/结束日期'>
            <DatePicker v-model='search.contractstarttime' type="date" placeholder="请选择开始时间" style="width: 160px"></DatePicker>
            <span> - </span>
            <DatePicker v-model='search.contractendtime' type="date" placeholder="请选择结束时间" style="width: 160px"></DatePicker>
          </FormItem>
        </Col>
        <Col span='8'>
          <FormItem label='状态'>
            <Select v-model='search.status'>
              <Option value='' key=''>全部</Option>
              <Option v-for='item in sel8' :value='item.id' :key='item.id'>{{item.bindValue}}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>

      <FormItem style='text-align:center;'>
        <Button type="primary" @click='changePage(1)'>查询</Button>
        <Button @click='clear' style="margin-left: 8px">重置</Button>
        <Icon type="ios-arrow-up" size='30' style='margin-left:8px;cursor:pointer' @click='changeMore' />
      </FormItem>
    </Form>

    <Form v-else>
      <Row type="flex" justify="center" align="middle" :gutter='16'>
        <Col span='12'>
          <FormItem>
            <Input v-model='search.condition' prefix="md-search" placeholder="请输入员工姓名/员工ID/OA单号/主体编码/合同主体/状态/组织名称/岗位/职级" />
          </FormItem>
        </Col>
        <!-- <Col span='3'>
          <FormItem>
            <Select placeholder='更多筛选' style='width:100%'>
              <Option>更多筛选</Option>
            </Select>
          </FormItem>
        </Col> -->
        <Col span='5'>
          <FormItem style='text-align:center;'>
            <Button type="primary" @click='changePage(1)'>查询</Button>
            <Button @click='clear' style="margin-left: 8px">重置</Button>
            <Icon type="ios-arrow-down" size='30' style='margin-left:8px;cursor:pointer' @click='changeMore' />
          </FormItem>
        </Col>
      </Row>
    </Form>

    <div style='margin-bottom:8px'>
      <Row>
        <Col span='6'>
          <div>
            <Button @click='downFile'>导出</Button>
            <!-- <Button style='margin-left:10px'>导入</Button> -->
          </div>
        </Col>
        <Col span='4' offset="14">
          <Select v-model="customSel" multiple placeholder='自定义' max-tag-count=1 @on-change='customTitle'>
            <Option v-for="(item, key) in cols" :value="key" :key="key">{{ item.title }}</Option>
          </Select>
        </Col>
      </Row>
    </div>
    <Table @on-selection-change='setIds' :max-height="tableHeight" :loading='loading' border ref="selection" :columns="dataCols" :data='dataRows' :no-data-text=noData></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :page-size="pageInfo.page_size" :total="pageInfo.total" :current="pageInfo.page" @on-change="changePage"></Page>
      </div>
    </div>
  </div>
</template>

<script>
import { getContractList, getContraclExcel, selectType, getCompanyList, getTemplateList } from '@/api/e-contract'
import { setSerialNum, deepClone, noDataLong } from '@/libs/util'
import expandRow from '@/components/table-expand/table-expand.vue'

export default {
  components: {
    expandRow
  },
  data() {
    return {
      times: {
        row1: '',
        row2: ''
      },
      loading: false,
      tableHeight: 420,
      more: false,
      sel1: [],
      sel2: [],
      sel3: [],
      sel4: [],
      sel5: [],
      sel6: [],
      sel7: [],
      sel8: [],
      search: {},
      customSel: [],
      pageInfo: {},
      dataRows: [],
      dataCols: [],
      loading: false,
      noData: noDataLong,
      cols: [
        {
          title: '选择框',
          type: 'selection',
          align: 'center',
          width: 60,
          key: 'id'
        },
        {
          title: '序号',
          align: 'center',
          width: 80,
          key: 'number'
        },
        {
          title: '合同编号',
          align: 'center',
          width: 150,
          render: (h, params) => {
            return h('span',(params.row.contract && params.row.contract.contractNo) || "")
          }
        },
        {
          title: '姓名',
          align: 'center',
          key: 'name',
          width: 100
        },
        {
          title: '身份证号',
          align: 'center',
          key: 'nationalId',
          width: 100
        },
        {
          title: '员工ID',
          align: 'center',
          key: 'emplid',
          width: 100
        },
        {
          title: '组织全路径',
          align: 'center',
          key: 'deptChain',
          width: 200
        },
        {
          title: '岗位',
          align: 'center',
          key: 'posiDescr',
          width: 120
        },
        {
          title: '岗位层级',
          align: 'center',
          key: 'gmPosiLvl',
          minWidth: 140
        },
        {
          title: '入职时间',
          align: 'center',
          key: 'origHireDt',
          width: 100
        },
        {
          title: '合同版本',
          align: 'center',
          key: 'contractModeValue',
          width: 100,
          render: (h, params) => {
            return h('span', (params.row.contract && params.row.contract.contractModeValue) || "")
          }
        },
        {
          title: '合同甲方',
          align: 'center',
          key: 'subject',
          width: 100,
          render: (h, params) => {
            return h('span', (params.row.contract && params.row.contract.subject) || "")
          }
        },
        {
          title: '合同签订次数',
          align: 'center',
          key: 'signTime',
          width: 110,
          render: (h, params) => {
            return h('span', (params.row.contract && params.row.contract.signTime) || "")
          }
        },
        {
          title: '签订年限',
          align: 'center',
          key: 'years',
          width: 100,
          render: (h, params) => {
            return h('span', (params.row.contract && params.row.contract.years) || "")
          }
        },
        {
          title: '合同子类型',
          align: 'center',
          key: 'contractchildtype',
          width: 100,
          render: (h, params) => {
            return h('span', (params.row.contract && params.row.contract.contractchildtype) || "")
          }
        },
        {
          title: '岗位类型',
          align: 'center',
          key: 'postType',
          width: 100,
          render: (h, params) => {
            return h('span', (params.row.contract && params.row.contract.postType) || "")
          }
        },
        {
          title: '工时制度',
          align: 'center',
          key: 'jobTime',
          width: 100,
          render: (h, params) => {
            return h('span', (params.row.contract && params.row.contract.jobTime) || "")
          }
        },
        {
          title: '试用期限',
          align: 'center',
          key: 'testTime',
          width: 100,
          render: (h, params) => {
            return h('span', (params.row.contract && params.row.contract.testTime) || "")
          }
        },
        {
          title: '合同开始日期',
          align: 'center',
          key: 'starttime',
          width: 110,
          render: (h, params) => {
            return h('span', (params.row.contract && params.row.contract.starttime) || "")
          }
        },
        {
          title: '合同预计结束日期',
          align: 'center',
          key: 'futuretime',
          width: 140,
          render: (h, params) => {
            return h('span', (params.row.contract && params.row.contract.futuretime) || "")
          }
        },
        {
          title: '合同实际结束日期',
          align: 'center',
          key: 'dimissionDt',
          width: 140,
          render: (h, params) => {
            return h('span',  (params.row.contract && params.row.contract.dimissionDt) || "")
          }
        },
        {
          title: '状态',
          align: 'center',
          width: 80,
          render: (h, params) => {
            let status = params.row.contract ? this.statuss[params.row.contract.status]['name'] : ""
            return h('span', status)
          }
        },
        {
          title: '操作',
          align: 'center',
          key: '',
          width: 100,
          fixed: 'right',
          render: (h, params) => {
            return h('a',
              {
                on: {
                  click: () => {
                    this.toPage(params.row)
                  }
                }
              },
              '详情')
          },
        }
      ],
      statuss: [
        {id: 0, name: '待签署'},
        {id: 1, name: '待签署-签署中'},
        {id: 2, name: '待盖章'},
        {id: 3, name: '待盖章-进行中'},
        {id: 4, name: '合同完成'},
        {id: 5, name: '待用印'}
      ],
      ids: []
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
    },
    clear() {
      this.search = {}
      this.changePage(1)
    },
    getSelectType() {
      // 合同甲方 sel1
      getCompanyList({companyName: ''}).then(res => {
        const data = res.data
        if (data.code === 200) {
          this.sel1 = data.data.result
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })

      // 岗位层级 sel2
      selectType({type: 2}).then(res => {
        const data = res.data
        if (data.code === 200) {
          this.sel2 = data.data
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })     

      // 合同版本 sel3
      getTemplateList({type: 'ALL'}).then(res => {
        const data = res.data
        if (data.code === 200) {
          this.sel3 = data.data.result
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })

      // 签订次数 sel4
      selectType({type: 4}).then(res => {
        const data = res.data
        if (data.code === 200) {
          this.sel4 = data.data
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })

      // 工时制度 sel5
      selectType({type: 5}).then(res => {
        const data = res.data
        if (data.code === 200) {
          this.sel5 = data.data
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })
 
      // 签订年限 sel6
      selectType({type: 3}).then(res => {
        const data = res.data
        if (data.code === 200) {
          this.sel6 = data.data
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })

      // 合同子类型 sel7
      selectType({type: 6}).then(res => {
        const data = res.data
        if (data.code === 200) {
          this.sel7 = data.data
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })

      // 状态 sel8
      selectType({type: 7}).then(res => {
        const data = res.data
        if (data.code === 200) {
          this.sel8 = data.data
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })
    },
    changePage(page) {
      this.dataRows = {}
      this.loading = true
      this.pageInfo.current = page
      let data = {
        pageNum: page || 1,
        pageSize: this.pageInfo.page_size || 20
      }

      if (!this.more) {
        data.condition = this.search.condition
      } else {
        Object.assign(data, this.search)
        data.condition = ''
      }

      getContractList(data).then(res => {
        const data = res.data
        this.loading = false
        if (data.code === 200) {
          this.pageInfo.total = data.data.total
          this.pageInfo.current = data.data.pageNum
          this.pageInfo.page_size = data.data.pageSize
          this.dataRows = setSerialNum(data.data.list, this.pageInfo)
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })
    },
    urlEncode(param, key, encode) {
      if(param==null) return '';
      var paramStr = '';
      var t = typeof (param);
      if (t == 'string' || t == 'number' || t == 'boolean') {
        paramStr += '&' + key + '=' + ((encode==null||encode) ? encodeURIComponent(param) : param);
      } else {
        for (var i in param) {
          var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
          paramStr += this.urlEncode(param[i], k, encode);
        }
      }
      return paramStr
    },
    setIds(sels) {
      console.log(sels)
      this.ids = []
      
      if (sels) {
        for (let i = 0; i < sels.length; i++) {
          this.ids.push(sels[i]['emplid'])
        }
      }
    },
    downFile() {
      let data = {
        pageNum: this.pageInfo.current,
        pageSize: this.pageInfo.page_size || 20
      }

      if (!this.more) {
        data.condition = this.search.condition
      } else {
        Object.assign(data, this.search)
        data.condition = ''
      }

      if (this.ids) {
        data.emplids = this.ids.toString()
      }

      let dataStr = this.urlEncode(data)
      console.log(dataStr)
      window.open('/contract/contract/getexcel?' + dataStr)
    },
    toPage (row, index) {
      let query = {
        emplid: row.emplid,
      }
      this.$router.push({name: 'contract_all_detail', query: query})
    },
    showtime(end) {
        let nowtime = new Date()  //获取当前时间
        let endtime = new Date(end)  //定义结束时间
        var lefttime = endtime.getTime() - nowtime.getTime(),  //距离结束时间的毫秒数
            leftd = Math.floor(lefttime/(1000*60*60*24)),  //计算天数
            lefth = Math.floor(lefttime/(1000*60*60)%24),  //计算小时数
            leftm = Math.floor(lefttime/(1000*60)%60),  //计算分钟数
            lefts = Math.floor(lefttime/1000%60);  //计算秒数
        return leftd + "天" + lefth + ":" + leftm + ":" + lefts;  //返回倒计时的字符串
    }
  },
  mounted() {
    this.customTitle([])
    this.getSelectType()
    this.changePage()

    this.tableHeight = window.innerHeight - this.$refs.selection.$el.offsetTop - 90

    let that = this
    setInterval (function () {
      that.times.row1 = that.showtime("2021/2/21")
      that.times.row2 = that.showtime("2021/2/20 10:10")
    }, 1000)
  }
}
</script>

<style>
.contract-all-list {
  padding: 20px;
}
</style>
