<template>
<div class="user-management">
  <div class="search-box">
    <Form ref="formCustom" :model="formCustom" :label-width="80" @submit.native.prevent>
      <Row>
         <Col span="3">
           <Button type="primary" ghost style="float:left;margin-right:10px;" @click="editCal(0)" v-if="hasPerm(29)">新增</Button>
         </Col>
         <Col span="5">
          <FormItem label="期间名称">
            <Input type="text" v-model="search.name" placeholder='请输入'></Input>
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
        <Col span="6">
          <FormItem label="状态">
            <Select v-model="search.status" transfer placeholder='请选择'>
              <Option value="" key="0">全部</Option>
              <Option value="1" key="1">启用</Option>
              <Option value="2" key="2">停用</Option>
              <!-- <Option v-for="item in status" :value="item.id" :key="item.id">{{ item.name }}</Option> -->
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

  <Drawer :title="editTitle" v-model="value3" width="360" :mask-closable="false" :styles="styles">
    <Form :model="formData" :label-width="100">
        <Row :gutter="32">
            <Col span="16">
              <FormItem label="起始年度">
                <!-- <Input v-model="formData.startYear" placeholder="请输入" /> -->
                <Select v-model="formData.startYear" filterable>
                  <Option v-for="item in 2999" v-if="item >= 1900" :value="item" :key="item">{{ item }}</Option>
                </Select>
              </FormItem>
            </Col>
        </Row>
        <Row :gutter="32">
          <Col span="16">
            <FormItem label="期间名称">
              <Input v-model="formData.name" placeholder="请输入" />
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
            <!-- <div>期间周期规则</div> -->
              <FormItem label="期间周期规则">
                <RadioGroup v-model="formData.ruleType" vertical>
                  <Radio label="1">
                      <Icon type="social-apple"></Icon>
                      <span>按自然月</span>
                  </Radio>
                  <!-- <Radio label="2">
                      <Icon type="social-android"></Icon>
                      <span>自定义期间</span>
                  </Radio> -->
                </RadioGroup>
                <!-- <FormItem label="期间开始日">
                  <Row>
                    <Col span="8">
                      <Select v-model="search.applyId" transfer placeholder='请选择'>
                        <Option value="0" key="0">全部</Option>
                      </Select>
                    </Col>
                    <Col span="6">
                      <Input v-model="formData.calendarName" placeholder="请输入" />
                    </Col>
                  </Row>
                </FormItem>
                <FormItem label="期间截止日">
                  <Row>
                    <Col span="8">
                      <Select v-model="search.applyId" transfer placeholder='请选择'>
                        <Option value="0" key="0">全部</Option>
                      </Select>
                    </Col>
                    <Col span="6">
                      <Input v-model="formData.calendarName" placeholder="请输入" />
                    </Col>
                  </Row>
                </FormItem> -->
              </FormItem>
            </Col>
        </Row>

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
    <scope-tree @confTree='updateTree' :selStrp='selStr' :applyRange='formData.applyRange' :applyList='formData.applyList' :key='formData.id'></scope-tree>
    <div slot="footer"></div>
  </Modal>
</div>
</template>

<script>
import './index.less'
import { getAttList, getScopeTree, getAttDetail, saveAtt, updateAtt, updateStatus } from '@/api/check-data'
import { setSerialNum, deepClone, noData } from '@/libs/util'
import ScopeTree from '@/components/scope-tree'
export default {
  name: 'model-management',
  components: {
    ScopeTree
  },
  data () {
    return {
      editTitle: '新增考勤期间',
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
          title: '期间名称',
          key: 'name',
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
          title: '适用部门或人员',
          key: 'applyName',
          align: 'center',
          tooltip: true,
          minWidth: 100,
          render: (h, params) => {
            if (params.row.applyName) {
              return h('span', params.row.applyName)
            } else {
              return h('span', '全员')
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
          title: '创建时间',
          key: 'createTime',
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
            let style30 = {}
            let style31 = {}
            let style33 = {}
            if (!this.hasPerm(30)) {
              style30.display = 'none'
            }
            if (!this.hasPerm(31)) {
              style31.display = 'none'
            }
            if (!this.hasPerm(33)) {
              style33.display = 'none'
            }

            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                style: style30,
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
                style: (params.row.status == 1) ? style33 : style31,
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
        startYear: '',
        name: '',
        applyRange: '1',
        applyList: [],
        ruleType: '1'
      },
      noData: noData,
      allSel: true,
      partSel: false,
      data2: [],
      selStr: ''
    }
  },
  methods: {
    // 搜索按钮
    handleSubmit () {
      this.changePage(1)
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
        name: this.search.name,
        status: this.search.status,
        applyRange: this.search.applyRange,
        pageNum: page || 1,
        pageSize: this.pageInfo.page_size || 20
      }
      getAttList(data).then(res => {
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
        updateAtt(data).then(res => {
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
        saveAtt(data).then(res => {
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
        startYear: '',
        name: '',
        applyRange: '1',
        applyList: [],
        ruleType: '1'
      }
      this.selStr = ''
      this.editTitle = '新增考勤期间'

      if (id) {
        this.editTitle = '修改考勤期间'
        let data = {
          id: id
        }
        getAttDetail(data).then(res => {
          let data = res.data
          if (data.code === 200) {
            this.formData = data.data
            // this.formData.status = this.formData.status + ""
            this.formData.applyRange = this.formData.applyRange + ""
            this.formData.ruleType = this.formData.ruleType + ""
            this.formData.startYear = Number(this.formData.startYear)

            let applyList = this.formData.applyList
            if (applyList) {
              let strTmp = ','
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
        name: '',
        applyRange: 0,
        status: ''
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
