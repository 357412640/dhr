<template>
  <div class="month-statistics-box common-style">
    <div>
      <span>展示列：</span>
      <Checkbox
        :indeterminate="indeterminate"
        :value="checkAll"
        @click.prevent.native="handleCheckAll">全选
      </Checkbox>
    </div>
    <Row>
      <CheckboxGroup v-model="checkAllGroup" class="mt-20" @on-change="checkAllGroupChange">
        <Checkbox v-for="item in allGroupColumns" :key="item.key" :label="item.key">{{ item.title }}</Checkbox>
      </CheckboxGroup>
    </Row>
    <Row>
      <Form :model="form" :label-width="75" label-position="left" style="margin-top: 20px">
        <Col span="8" style="width: 340px">
          <FormItem label="选择日期：">
            <DatePicker :value="datePick"
                        format="yyyy/MM"
                        type="month"
                        placeholder="选择日期"
                        style="width: 240px"
                        :options="dateOption"
                        :editable="false"
                        @on-change="changeDate"
            ></DatePicker>
          </FormItem>
        </Col>
        <Col span="6" style="min-width: 370px">
          <FormItem label="人员范围：">
            <!--      选择内容长度大于20显示tooltip      -->
            <Tooltip theme="light" :content="selectCon" placement="top-start"
                     v-if="selectCon !== '' && selectCon.length >= 20" :max-width="260">
              <Button class="btn-con" @click="showModal">{{ selectCon || '管理范围' }}</Button>
            </Tooltip>
            <Button class="btn-con" @click="showModal" v-else>{{ selectCon || '管理范围' }}</Button>
          </FormItem>
        </Col>
        <Col span="4">
          <Button type="primary" style="margin-right: 20px" @click="searchList">搜索</Button>
          <Button @click="clearSearch">重置</Button>
        </Col>
      </Form>
    </Row>
    <div style="padding-bottom: 20px;">
      <Button type="primary" @click="downloadFile">导出报表</Button>
    </div>
    <div>
      <Table :columns="columns"
             :data="data"
             stripe
             :loading="loading"
             :no-data-text="noData"
             :max-height="350"
      >
      </Table>
      <div style="margin: 16px;overflow: hidden">
        <div style="float: right;">
          <Page :page-size="pageInfo.pageSize"
                :total="pageInfo.total"
                :current="pageInfo.pageNum"
                show-total
                show-sizer
                :page-size-opts="pageInfo.pageSizeOpts"
                @on-page-size-change="changePageSize"
                @on-change="changePage"></Page>
          <!--            show-elevator-->
          <!--                            show-sizer-->
        </div>
      </div>
    </div>


    <Modal v-model="modalFlag" width="720" class="common-style" @on-ok="handleRight" @on-cancel="cancelRight">
      <p slot="header">
        <span>选择管理范围</span>
      </p>
      <div class="modal-box">
        <div class="left">
          <div class="left-p">
            <p class="p">选择：</p>
            <Breadcrumb style="line-height: 24px;" class="bread" v-if="leftTreeArr.length || selectType === 'name'">
              <BreadcrumbItem v-for="(row, index) in leftTreeArr">
                <Button type="text" class="common-btn" style="padding-bottom: 2px;" @click="getChildren(row, index)"
                        v-if="index !== (leftTreeArr.length - 1) || selectType === 'name'">{{ row.name }}
                </Button>
                <p v-else style="display:inline-block;margin-top: 1px;">{{ row.name }}</p>
              </BreadcrumbItem>
            </Breadcrumb>
          </div>
          <div class="con">
            <div class="search-input">
              <Input search placeholder="请输入员工姓名" @on-search="searchNameList" v-model="name"/>
            </div>
            <div style="width: 100%;height: 280px;overflow: auto;">
              <Table :columns="columnsLeft"
                     :data="dataLeft"
                     :loading="loadingLeft"
                     :no-data-text="noData"
                     :border="false"
                     style="width: 303px;"
                     @on-select="selectLeft"
                     @on-select-cancel="cancelLeft"
                     @on-select-all="selectLeftAll"
                     @on-select-all-cancel="cancelLeftAll"
              >
                <template slot-scope="{ row, index}" slot="slot">
                  <Button :disabled="row._checked" type="text" class="common-btn" @click="getChildren(row)"
                          v-if="selectType === 'tree'">{{ row.name }}
                  </Button>
                  <p v-else-if="selectType === 'name'" style="display: flex">
                    <span>{{ row.name }}</span>
                    <span class="w-165 ellipsis">（{{ row.dept }}</span>
                    <span>）</span>
                  </p>
                </template>
              </Table>
            </div>
          </div>
        </div>
        <div class="right">
          <p class="p">已选：</p>
          <div class="con">
            <p v-for="(item, index) in dataRight.tree" :key="item.id" class="select-p">
              <span>{{ item.name }}</span>
              <Icon type="md-close-circle" class="icon" @click="deleteItem(index, 'tree', item)"/>
            </p>
            <div v-for="(item, index) in dataRight.name" :key="item.emplid" class="select-p">
              <p style="display: flex">
                <span>{{ item.name }}</span>
                <span class="w-200 ellipsis">（{{ item.dept }}</span>
                <span>）</span>
              </p>
              <Icon type="md-close-circle" class="icon" @click="deleteItem(index, 'name', item)"/>
            </div>
          </div>
        </div>
      </div>
    </Modal>

  </div>
</template>

<script>
  import {noData} from '@/libs/util'
  import {getSearchInfo, getChildrenTree, getMonthStatisticsList, downloadMonthStatistics} from '@/api/statistics-attendance'

  // 所有勾选项
  const allGroupColumns = [
    {
      align: 'center',
      title: '姓名',
      key: 'name',
      fixed: 'left',
      minWidth: 140
    }, {
      align: 'center',
      title: '工号',
      key: 'emplid',
      minWidth: 140
    }, {
      align: 'center',
      title: '部门',
      tooltip: true,
      key: 'deptDescr',
      minWidth: 160
    }, {
      align: 'center',
      title: '工时制度',
      key: 'workRule',
      minWidth: 140
    }, {
      align: 'center',
      title: '应出勤天数',
      key: 'dueAttendance',
      minWidth: 140
    }, {
      align: 'center',
      title: '实际出勤天数',
      key: 'actualAttendance',
      minWidth: 140
    }, {
      align: 'center',
      title: '节日加班支付数量',
      key: 'vocation',
      minWidth: 140
    }, {
      align: 'center',
      title: '迟到次数',
      key: 'late',
      minWidth: 140
    }, {
      align: 'center',
      title: '早退次数',
      key: 'leaveEarly',
      minWidth: 140
    }, {
      align: 'center',
      title: '已批准未打卡次数',
      key: 'approvedNotClocked',
      minWidth: 140
    }, {
      align: 'center',
      title: '未批准未打卡次数',
      key: 'noApprovedNotClocked',
      minWidth: 140
    }, {
      align: 'center',
      title: '病假时数（范围内）',
      key: 'sickIn',
      minWidth: 160
    }, {
      align: 'center',
      title: '病假时数（范围外）',
      key: 'sickOut',
      minWidth: 160
    }, {
      align: 'center',
      title: '事假时数',
      key: 'compassionate',
      minWidth: 140
    }, {
      align: 'center',
      title: '产假天数',
      key: 'maternity',
      minWidth: 140
    }, {
      align: 'center',
      title: '陪产假天数',
      key: 'nursing',
      minWidth: 140
    }, {
      align: 'center',
      title: '探亲假天数',
      key: 'offSite',
      minWidth: 140
    }, {
      align: 'center',
      title: '旷工时数',
      key: 'absenteeism',
      minWidth: 140
    }, {
      align: 'center',
      title: '婚假天数',
      key: 'married',
      minWidth: 140
    }, {
      align: 'center',
      title: '公假时数',
      key: 'pulicHoliday',
      minWidth: 140
    }, {
      align: 'center',
      title: '丧假天数',
      key: 'bereavement',
      minWidth: 140
    }, {
      align: 'center',
      title: '工伤假时数',
      key: 'workInjury',
      minWidth: 140
    }, {
      align: 'center',
      title: '远程办公时数',
      key: 'farWork',
      minWidth: 140
    }, {
      align: 'center',
      title: '入职日期',
      key: 'origHireDt',
      minWidth: 140
    }, {
      align: 'center',
      title: '离职日期',
      key: 'dimissionDt',
      minWidth: 140
    }
    // , {
    //   align: 'center',
    //   title: '考勤员',
    //   key: 'attendanceClerk',
    //   minWidth: 140
    // }
    ]

  // 获取所有CheckBox的key 用作全选
  const getAllGroup = () => {
    return allGroupColumns.map(item => {
      return item.key
    })
  }

  const allGroup = getAllGroup()

  const defaultDataLeft = [{
    "id": -1,
    "code": 'GOME',
    "name": 'GOME',
    '_checked': false
  }]
  const leftTreeArr = [{
    id: -10000,
    name: '管理范围'
  }]

  // 获取当前默认日期，不是1号，返回从1号倒今天前一天的汇总；是1号，返回上月汇总
  const getDefaultDate = () => {
    const date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    month = month < 10 ? '0' + month.toString() : month
    let day = date.getDate()
    if (day === 1) {
      if (month === 1) {
        month = 12
        year = year - 1
      } else {
        month -= 1
        month = month < 10 ? '0' + month.toString() : month
      }
      return `${year}/${month}`
    } else {
      return `${year}/${month}`
    }
  }

  const form = {
    monthOfYear: getDefaultDate(),
    emplids: '',
    deptIds: '',
  }

  export default {
    data() {
      return {
        datePick: getDefaultDate(),
        dateOption: {
          disabledDate(date) {
            return date && date.valueOf() >= Date.now() - 86400000;
          }
        },
        indeterminate: false,
        checkAll: true,
        checkAllGroup: JSON.parse(JSON.stringify(allGroup)),
        searchInfo: {},
        form: JSON.parse(JSON.stringify(form)),
        selectCon: '',
        allGroupColumns: JSON.parse(JSON.stringify(allGroupColumns)),
        columns: JSON.parse(JSON.stringify(allGroupColumns)),
        data: [],
        loading: false,
        noData,
        pageInfo: {
          pageSize: 50,
          total: 0,
          pageNum: 1,
          pageSizeOpts: [20, 50, 100, 200]
        },
        modalFlag: false,
        columnsLeft: [
          {
            type: 'selection',
            align: 'center',
            width: 50
          },
          {
            title: '全选',
            slot: 'slot',
            width: 250
          }
        ],
        dataLeft: JSON.parse(JSON.stringify(defaultDataLeft)),
        loadingLeft: false,
        dataRight: {
          tree: [],
          name: []
        },
        saveRight: {
          tree: [],
          name: []
        },
        name: '',
        selectType: 'tree', // 搜索类型 tree：范围树列表 name：人名列表
        leftTreeArr: JSON.parse(JSON.stringify(leftTreeArr)) // 所有选中的下级树
      }
    },
    methods: {
      handleCheckAll() {
        if (this.indeterminate) {
          this.checkAll = false
        } else {
          this.checkAll = !this.checkAll
        }
        this.indeterminate = false

        if (this.checkAll) {
          this.checkAllGroup = JSON.parse(JSON.stringify(allGroup))
        } else {
          this.checkAllGroup = []
        }

        this.setColumns()
      },
      checkAllGroupChange(data) {
        if (data.length === allGroup.length) {
          this.indeterminate = false
          this.checkAll = true
        } else if (data.length > 0) {
          this.indeterminate = true
          this.checkAll = false
        } else {
          this.indeterminate = false
          this.checkAll = false
        }
        this.setColumns()
      },
      saveSearchInfo() {
        // 保存当前搜索信息
        this.searchInfo.monthOfYear = this.datePick
        let emplids = []
        let deptIds = []
        for (let i = 0; i < this.saveRight.name.length; i++) {
          const item = this.saveRight.name[i]
          emplids.push(item.emplid)
        }
        for (let i = 0; i < this.saveRight.tree.length; i++) {
          const item = this.saveRight.tree[i]
          deptIds.push(item.id)
        }
        this.searchInfo.emplids = emplids.join(',')
        this.searchInfo.deptIds = deptIds.join(',')
      },
      // 根据当前搜索条件下载汇总列表
      downloadFile() {
        if (this.datePick) {
          this.saveSearchInfo()
          // 跳转下载
          downloadMonthStatistics(this.searchInfo)
        } else {
          this.$Message.warning('请选择日期')
        }

      },
      searchList() {
        if (this.datePick) {
          this.data = []
          this.pageInfo.pageNum = 1
          this.pageInfo.total = 0
          this.saveSearchInfo()
          this.changePage(1)
        } else {
          this.$Message.warning('请选择日期')
        }
      },
      changePage(p) {
        this.loading = true
        const params = {
          ...this.searchInfo,
          pageSize: this.pageInfo.pageSize,
          pageNum: p || 1
        }
        getMonthStatisticsList(params).then(res => {
          const data = res.data
          if (data.code === 200) {
            if (data.data && data.data.list && data.data.list.length) {
              this.data = data.data.list
              // console.log(this.data)
            }
            this.pageInfo.pageNum = data.data.pageNum || 1
            this.pageInfo.total = data.data.total
          } else {
            this.$Message.warning(`汇总列表获取失败：${data.message}`)
          }
          this.loading = false
        })
      },
      changePageSize(pageSize) {
        this.pageInfo.pageSize = pageSize
        this.changePage(this.pageInfo.pageNum)
      },
      clearSearch() {
        this.form = JSON.parse(JSON.stringify(form))
        this.selectCon = ''
        this.saveRight = {
          tree: [],
          name: []
        }
        this.datePick = getDefaultDate()
      },
      showModal() {
        this.modalFlag = true

        // 点击后已选为空，取消还是上次的选择范围，否则重新选择范围， 防止上次选中已选内容，重新打开后上级可选的问题
        this.dataRight = JSON.parse(JSON.stringify(this.saveRight))
        this.showSelect()
      },
      // 弹窗选中项变化
      selectLeft(selection, item) {
        // 判断左侧类型，是否存在 不存在添加
        const type = this.selectType
        const id = type === 'tree' ? 'id' : 'emplid'
        // 遍历获取当前左侧选中项 禁止搜索下级
        let index = -1
        for (let i = 0; i < this.dataLeft.length; i++) {
          const row = this.dataLeft[i]
          if (row[id] === item[id]) {
            index = i
            item._checked = true
            break
          }
        }
        if (~index) {
          this.dataLeft.splice(index, 1, item)
        }

        let flag = false
        for (let i = 0; i < this.dataRight[type].length; i++) {
          const row = this.dataRight[type][i]
          if (row[id] === item[id]) {
            flag = true
            break
          }
        }
        // 如果不存在 push
        if (!flag) {
          this.dataRight[type].push(item)
        }
      },
      // 弹窗取消项变化
      cancelLeft(selection, item) {
        // 判断左侧类型，是否存在 存在删除
        const type = this.selectType
        const id = type === 'tree' ? 'id' : 'emplid'
        // 遍历获取当前左侧取消项 可以搜索下级
        let index = -1
        for (let i = 0; i < this.dataLeft.length; i++) {
          const row = this.dataLeft[i]
          if (row[id] === item[id]) {
            index = i
            item._checked = false
            break
          }
        }
        if (~index) {
          this.dataLeft.splice(index, 1, item)
        }

        let flag = false
        index = -1
        for (let i = 0; i < this.dataRight[type].length; i++) {
          const row = this.dataRight[type][i]
          if (row[id] === item[id]) {
            flag = true
            index = i
            break
          }
        }
        // 如果存在 splice
        if (flag) {
          this.dataRight[type].splice(index, 1)
        }
      },
      // 全选
      selectLeftAll(selection) {
        // 判断左侧类型，遍历左侧是否存在 不存在添加
        const type = this.selectType
        const id = type === 'tree' ? 'id' : 'emplid'

        for (let i = 0; i < this.dataLeft.length; i++) {
          const row = this.dataLeft[i]
          row._checked = true
        }

        for (let j = 0; j < selection.length; j++) {
          const item = selection[j]
          let flag = false
          for (let i = 0; i < this.dataRight[type].length; i++) {
            const row = this.dataRight[type][i]
            if (row[id] === item[id]) {
              flag = true
              break
            }
          }
          // 如果不存在 push
          if (!flag) {
            this.dataRight[type].push(item)
          }
        }
      },
      // 全取消
      cancelLeftAll() {
        // 判断左侧类型，遍历当前搜索结果列表dataLeft是否存在 存在删除
        const type = this.selectType
        const id = type === 'tree' ? 'id' : 'emplid'

        for (let i = 0; i < this.dataLeft.length; i++) {
          const row = this.dataLeft[i]
          row._checked = false
        }

        for (let j = 0; j < this.dataLeft.length; j++) {
          const item = this.dataLeft[j]
          let flag = false
          let index = -1
          for (let i = 0; i < this.dataRight[type].length; i++) {
            const row = this.dataRight[type][i]
            if (row[id] === item[id]) {
              flag = true
              index = i
              break
            }
          }
          // 如果存在 splice
          if (flag) {
            this.dataRight[type].splice(index, 1)
          }
        }
      },
      // 获取范围下级树列表
      getChildren(row, index) {
        // 根据index 判断点击的是left 还是面包屑
        if (index === undefined) {
          this.leftTreeArr.push(row)
        } else {
          this.leftTreeArr = this.leftTreeArr.slice(0, index + 1)
        }
        this.selectType = 'tree'
        // 如果点击第一级，则返回到顶层
        if (row.id === -10000) {
          this.dataLeft = JSON.parse(JSON.stringify(defaultDataLeft))
          this.name = ''
          return
        }

        this.dataLeft = []
        this.loadingLeft = true
        const data = {
          pid: row.id
        }
        getChildrenTree(data).then(res => {
          const data = res.data
          if (data.code === 200) {
            for (let i = 0; i < data.data.length; i++) {
              const item = data.data[i]
              item._checked = false
            }
            this.dataLeft = data.data || []
            this.showSelect()
          } else {
            this.$message.warning(`下级获取失败，原因：${data.message}`)
          }
        }).finally(() => {
          this.loadingLeft = false
        })
      },
      searchNameList() {
        this.leftTreeArr = JSON.parse(JSON.stringify(leftTreeArr)) // 所有选中的下级树
        this.selectType = 'name'
        this.dataLeft = []
        this.loadingLeft = true
        const params = {
          name: this.name
        }
        getSearchInfo(params).then(res => {
          const data = res.data
          if (data.code === 200) {
            for (let i = 0; i < data.data.length; i++) {
              const item = data.data[i]
              item._checked = false
              let deptChainArr = item.deptChain.split('_')
              let len = deptChainArr.length
              item.dept = deptChainArr[len - 2] + '_' + deptChainArr[len - 1]
            }
            this.dataLeft = data.data || []
            this.showSelect()
          } else {
            this.$message.warning(`列表获取失败，原因：${data.message}`)
          }
        }).finally(() => {
          this.loadingLeft = false
        })
      },
      // 根据右侧选中的数据回显当前选中
      showSelect() {
        const type = this.selectType
        const id = type === 'tree' ? 'id' : 'emplid'
        const data = this.dataRight[type]

        const idList = data.map(item => {
          return item[id]
        })
        for (let i = 0; i < this.dataLeft.length; i++) {
          const item = this.dataLeft[i]
          if (idList.includes(item[id])) {
            item._checked = true
          } else {
            item._checked = false
          }
        }
      },
      //右侧删除
      deleteItem(index, type, item) {
        const dataRight = this.dataRight
        dataRight[type].splice(index, 1)

        // 如果当前是tree， 删除人员不回显，是name，删除部门不回显
        if ((type === 'tree' && item.id !== undefined) || (type === 'name' && item.emplid !== undefined)) {
          // 回显
          this.showSelect()
        }
      },
      // 保存右侧选中
      handleRight() {
        // 保存当前选中的状态 saveRight 中，恢复默认状态
        const dataRight = this.dataRight
        this.saveRight = JSON.parse(JSON.stringify(dataRight))
        this.resetModal()
        // 编辑 选择部门和人员的按钮显示内容
        let selectCon = ''
        for (let i = 0; i < dataRight.tree.length; i++) {
          const item = dataRight.tree[i]
          selectCon += item.name + '/'
        }

        for (let i = 0; i < dataRight.name.length; i++) {
          const item = dataRight.name[i]
          selectCon += item.name + '/'
        }
        if (selectCon !== '') {
          selectCon = selectCon.substring(0, selectCon.length - 1)
        }

        this.selectCon = selectCon
      },
      // 取消右侧选中
      cancelRight() {
        // 恢复默认状态
        this.resetModal()
      },
      resetModal() {
        this.selectType = 'tree'
        this.name = ''
        this.dataRight = {
          tree: [],
          name: []
        }
        this.dataLeft = JSON.parse(JSON.stringify(defaultDataLeft))
        this.leftTreeArr = JSON.parse(JSON.stringify(leftTreeArr))
      },
      changeDate(date) {
        this.datePick = date
        this.form.monthOfYear = date
      },
      // 设置显示表头
      setColumns() {
        // 遍历 allGroupColumns ，如果在checkAllGroup中，则push
        const checkGroupColumns = []
        for (let i = 0; i < allGroupColumns.length; i++) {
          const column = allGroupColumns[i]
          if (this.checkAllGroup.includes(column.key)) {
            checkGroupColumns.push(column)
          }
        }
        this.columns = checkGroupColumns
      }
    },
    mounted() {
      this.searchList()
    }
  }
</script>

<style lang="less" scoped>
  .month-statistics-box {
    padding: 20px;

    .mt-20 {
      .ivu-checkbox-default {
        margin-top: 20px;
      }
    }

    .ivu-checkbox-default {
      margin-right: 20px;
    }

    .btn-con {
      width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .ivu-table-wrapper {
      overflow: hidden;
    }
    .ivu-table-wrapper:after {
      height: 0;
      content: '';
      display: block;
      clear: both;
      visibility: hidden;
    }
  }

  .modal-box {
    display: flex;
    justify-content: space-between;

    .left {
      width: 340px;
      height: 360px;

      .left-p {
        display: flex;
      }

      .search-input {
        width: 303px;
        margin-bottom: 10px;
      }

      .bread {
        width: 300px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .right {
      width: 340px;
      height: 360px;

      .con {
        overflow-y: auto;
      }

      .select-p {
        line-height: 48px;
        padding: 0 10px;
        position: relative;
        border-bottom: 1px solid #e8eaec;
      }

      .icon {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 16px;
        cursor: pointer;
      }
    }

    .p {
      width: 40px;
      line-height: 24px;
      font-weight: 700;
      margin-top: 1px;
    }

    .con {
      width: 100%;
      height: 336px;
      border: 1px solid #cccccc;
      border-radius: 8px;
      padding: 10px;
    }
    .ellipsis {
      white-space:nowrap;/* 规定文本是否折行 */
      overflow: hidden;/* 规定超出内容宽度的元素隐藏 */
      text-overflow: ellipsis;
    }
    .w-165 {
      display: inline-block;
      max-width: 165px;
    }
    .w-200 {
      display: inline-block;
      max-width: 200px;
    }
  }
</style>
<style lang="less">
  .month-statistics-box {
    .ivu-table-cell {
      height: 18px;
    }
    .ivu-table-cell-tooltip {
      height: 18px;
    }
  }
</style>
