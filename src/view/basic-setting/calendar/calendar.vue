<template>
<div class="calendar">
  <div class="search-box">
    <Form ref="formCustom" :model="formCustom" :label-width="80" @submit.native.prevent>
      <Row>
         <Col span="8">
           <Button type="primary" ghost style="float:left;margin-right:10px;" @click="editCal(0)" v-if="hasPerm(22)">新增</Button>
         </Col>
         <Col span="6">
          <FormItem label="日历名称">
            <Input type="text" v-model="search.calendarName" placeholder='请输入日历名称'></Input>
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

  <Drawer title="编辑假期日历" v-model="value3" width="360" :mask-closable="false" :styles="styles">
    <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="80">
        <Row :gutter="32">
          <Col span="18">
            <FormItem label="日历名称" prop="calendarName">
                <Input v-model="formData.calendarName" placeholder="请输入" />
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
        <FormItem label="日历说明">
            <Input type="textarea" v-model="formData.calendarDesc" :rows="4" placeholder="输入日历适用场景，后续会更便捷的回顾日历应用范围" />
        </FormItem>
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
        <Button type="primary" @click="saveCal" :loading="saveLoading">确定</Button>
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
import { getCalendarList, saveCal, updateCal, copyCal, updateStatus, getCalendarDetail, getScopeTree } from '@/api/calendar-data'
import { setSerialNum, deepClone, noData } from '@/libs/util'
import ScopeTree from '@/components/scope-tree'
export default {
  name: 'model-management',
  components: {
    ScopeTree
  },
  data () {
    return {
      saveLoading: false,
      noData: noData,
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
          title: '日历名称',
          key: 'calendarName',
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
          width: 240,
          render: (h, params) => {
            let statusText = '启用'
            if (params.row.status == 1) {
              statusText = '停用'
            }
            let style23 = {}
            let style24 = {}
            let style25 = {}
            let style26 = {}
            let style27 = {}
            if (!this.hasPerm(23)) {
              style23.display = 'none'
            }
            if (!this.hasPerm(24)) {
              style24.display = 'none'
            }
            if (!this.hasPerm(25)) {
              style25.display = 'none'
            }
            if (!this.hasPerm(26)) {
              style26.display = 'none'
            }
            if (!this.hasPerm(27)) {
              style27.display = 'none'
            }

            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                style: style25,
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
                style: style23,
                on: {
                  click: () => {
                    this.toPage('add_calendar', params.row)
                  }
                }
              }, '假期定义'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                style: (params.row.status == 1) ? style26 : style24,
                on: {
                  click: () => {
                    this.updateStatus(params.row)
                  }
                }
              }, statusText),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                style: style27,
                on: {
                  click: () => {
                    this.editCal(params.row.id, 3)
                  }
                }
              }, '复制')
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
        calendarName: '',
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
          calendarName: '',
          applyRange: '1',
          applyList: [],
          status: "1",
          calendarDesc: ''
      },
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
        calendarName: this.search.calendarName,
        applyRange: this.search.applyRange,
        pageNum: page || 1,
        pageSize: this.pageInfo.page_size || 20
      }
      getCalendarList(data).then(res => {
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
      this.$router.push({name: path, query: query})
    },
    showRange () {
      this.changeRange = true
      // this.changeRangeSel(this.formData.applyRange)

      // this.getScopeTree(0)
    },

    saveCal () {
      let flag = false
      this.$refs['formData'].validate((valid) => {
        if (!valid) {
          flag = true
        }
      })

      if (flag) {
        return false
      }

      if (this.saveLoading) {
        return
      }
      this.saveLoading = true

      let data = JSON.parse(JSON.stringify(this.formData))

      if (data.id) {
        if (this.copy == 1) { // 复制
          copyCal(data).then(res => {
            let data = res.data
            if (data.code === 200) {
              this.value3 = false
              this.$Message.success('复制成功')
              this.changePage()
            } else {
              this.$Message.error('复制失败：' + data.message)
            }
          })
        } else { // 修改
          updateCal(data).then(res => {
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
      } else { // 新增
        saveCal(data).then(res => {
          let data = res.data
          if (data.code === 200) {
            this.value3 = false
            this.$Message.success('保存成功')
            this.changePage()
          } else {
            this.$Message.error('保存失败：' + data.message)
          }
          this.saveLoading = false
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
    // 编辑假期页面
    editCal (id, col) {
      this.formData = {
        calendarName: '',
        applyRange: '1',
        applyList: [],
        status: '1',
        calendarDesc: '',
      }
      this.selStr = ''
      this.copy = 0

      if (id) {
        let data = {
          id: id
        }
        getCalendarDetail(data).then(res => {
          let data = res.data
          if (data.code === 200) {
            this.formData = data.data
            this.formData.status = this.formData.status + ""
            this.formData.applyRange = this.formData.applyRange + ""

            let applyList = this.formData.applyList
            if (applyList) {
              let strTmp = ','
              for (let i = 0; i < applyList.length; i++) {
                strTmp += applyList[i]['applyId'] + ','
              }
              this.selStr = strTmp
            }

            if (col == 3) {
              this.copy = 1
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
        calendarName: '',
        applyId: 0
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
