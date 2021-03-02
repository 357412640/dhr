<template>
  <div class="organ-box">
    <a-row>
      <a-button type="primary" @click="visible = true"
        v-if="hasPerm(52)">管理</a-button>
    </a-row>
    <a-table :columns="columns" :data-source="data"
      rowKey="id"
      :loading="loading"
      :scroll="scroll"
      :locale="{}"
      :pagination="pagination"
      @change="onTableChange"
      class="manage-scope-table"
      style="margin-top: 20px;">
      <!-- <template slot="action" slot-scope="text, record">
        <span class="action-btn" @click="1">修改</span>
      </template> -->
    </a-table>
    <a-modal v-model="visible" title="管理组织机构范围"
      @ok="handleOk"
      @cancel="handelCancel"
      ok-text="保存"
      cancel-text="取消"
      width="700px">
      <a-row type="flex"
        align="middle">
        <span style="margin-right: 10px;">所属公司</span>
        <a-select 
          @change="handleSelectChange"
          showSearch
          style="width: 268px;"
          :value="companyId"
          :filter-option="filterOption"
          placeholder="请选择公司">
          <a-select-option v-for="item in companyList"
            :value="item.company"
            :key="item.id">
            {{item.descr}}
          </a-select-option>
        </a-select>
      </a-row>
      <div class="search-box">
        <div class="search-left">
          <a-input-search style="margin-bottom: 8px" placeholder="请输入名称" @change="onChange" />
          <a-tree
            :expanded-keys="expandedKeys"
            :auto-expand-parent="autoExpandParent"
            :tree-data="treeData"
            :checkedKeys="checkedKeys"
            checkStrictly
            @expand="onExpand"
            :replaceFields="replaceFields"
            checkable
            @check="onCheck"
            style="height: 300px; overflow: auto;"
            v-if="treeData.length"
          >
            <template slot="name" slot-scope="{ name }">
              <span v-if="name.includes(searchValue)">
                {{ name.substr(0, name.indexOf(searchValue)) }}
                <span style="color: #f50">{{ searchValue }}</span>
                {{ name.substr(name.indexOf(searchValue) + searchValue.length) }}
              </span>
              <span v-else>{{ name }}</span>
            </template>
          </a-tree>
          <div style="text-align: center;position: relative;top: 50%;transform: translate(0, -50%)"
            v-else>
            <img src="@/assets/images/no-data-default.png" alt="" width="101" height="72">
            <span>暂无数据</span>
          </div>
        </div>
        <div class="search-right">
          <a-input-search style="margin-bottom: 8px" placeholder="请输入名称" 
            v-model="query"/>
          <transition-group
            name="staggered-fade"
            tag="ul"
            v-bind:css="false"
            v-on:before-enter="beforeEnter"
            v-on:enter="enter"
            v-on:leave="leave"
            style="margin-top: 11px; height: 300px; overflow: auto;"
            v-if="computedList.length"
          >
            <li
              v-for="(item, index) in computedList"
              v-bind:key="item.deptId"
              v-bind:data-index="index"
              class="search-rig-li"
            >
              <span>{{ item.deptName }}</span>
              <a-icon type="close-circle" 
                theme="filled"
                class="sea-close-circle"
                @click="handleCircle(item.deptId, index)"/>
            </li>
          </transition-group>
          <div style="text-align: center;position: relative;top: 50%;transform: translate(0, -50%)"
            v-else>
            <img src="@/assets/images/no-data-default.png" alt="" width="101" height="72">
            <span>暂无数据</span>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import {managementDeptList, managementDepListCompany, managementDepTree, managementDepStashList, 
  managementDepStash, managementDepSave, managementDepStashClean} from '@/api/auth-management.js'
import _ from 'lodash'
import Velocity from 'velocity-animate'
const generateData = (data, newData) => {
  for (const [index, item] of data.entries()) {
    newData.push(Object.assign(
      {},
      item,
      { scopedSlots: {
        title: 'name'
      }}))
    if (item.children) {
      generateData(item.children, newData[index]['children'] = [])
    }
  }
}
let dataList = []
let sortArr = []
let checkedKeys = []
const generateList = (data) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i]
    const id = node.id
    const name = node.name
    dataList.push({ id, name })
    sortArr.push(id)
    if(node.checked) {
      checkedKeys.push(node.id)
    }
    if (node.children) {
      generateList(node.children)
    }
  }
}
const getParentKey = (key, tree) => {
  let parentKey
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node.children) {
      if (node.children.some(item => item.id === key)) {
        parentKey = node.id
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children)
      }
    }
  }
  return parentKey
}
const sortFunc = (propName, referArr) => {
  return (prev, next) => {
    return referArr.indexOf(prev[propName]) - referArr.indexOf(next[propName])
  }
}
export default {
  props: {
    id: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      columns: [{
        dataIndex: 'deptName',
        title: '机构名称',
        align: 'center',
        width: 150
      }, {
        dataIndex: 'deptId',
        title: '机构编码',
        align: 'center',
        width: 120,
      }, {
        dataIndex: 'deptType',
        title: '机构类型',
        align: 'center',
        width: 120
      }, {
        dataIndex: 'status',
        title: '状态',
        customRender: (text) => {
          let str = ''
          switch(text) {
            case 0:
              str = '初始化'
              break;
            case 1:
              str = '有效'
              break;
            case 2:
              str = '过期'
              break;
          }
          return str
        },
        align: 'center',
        width: 130,
      }, {
        dataIndex: 'gmCreateTime',
        title: '添加时间',
        align: 'center',
        width: 180,
      }],
      // }, {
      //   title: '操作',
      //   dataIndex: 'action',
      //   scopedSlots: { customRender: 'action' },
      //   align: 'center',
      //   width: 120
      // }],
      data: [],
      pagination: {
        defaultPageSize: 10,
        total: 1,
        showQuickJumper: true,
        showSizeChanger: true,
        current: 1,
        showTotal: () => `共 1条`,
        pageSizeOptions: ['5', '10', '20', '30', '40'],
        pageSize: 10
      },
      loading: false,
      scroll: {
        x: 900
      },
      visible: false,
      companyList: [],
      companyId: null,
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      treeData: [],
      checkedKeys: [],
      replaceFields: {
        title: 'name',
        key: 'id'
      },
      query: '',
      list: []
    }
  },
  watch: {
    id: function() {
      Promise.all([this.managementDepListCompany(), this.fetchData()])
    }
  },
  computed: {
    computedList: function () {
      var vm = this
      return this.list.filter(function (item) {
        return item.deptName.toLowerCase().indexOf(vm.query.toLowerCase()) !== -1
      })
    }
  },
  created() {
    Promise.all([this.managementDepListCompany(), this.fetchData()])
  },
  methods: {
    onTableChange (pagination, filters, sorter) {
      this.pagination = pagination
      this.fetchData()
    },
    fetchData() {
      if(this.id === undefined || this.id === null) {
        return false
      }
       const paramData = {
        scopeId: this.id,
        pageSize: this.pagination.pageSize,
        pageNum: this.pagination.current
      }
      this.loading = true
      managementDeptList(paramData).then(res => {
        this.loading = false
        if(res.data.code === 200) {
          this.data = res.data.data.list
          this.pagination.total = res.data.data.total
          this.pagination.showTotal = () => `共 ${res.data.data.total}条`
        }
      })
      .catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    handleOk: _.debounce(function(e) {
      const paramData = {
        scopeId: this.id,
        companyId: this.companyId,
        deptIdGroup: this.list.map(item => item.deptId)
      }
      managementDepStash(paramData).then(res => {
        if(res.data.code === 200) {
          managementDepSave(this.id).then(response => {
            if(response.data.code === 200) {
              this.visible = false
              this.$message.success(response.data.message, 1, this.fetchData)
              this.managementDepListCompany()
            } else {
              this.$message.error(response.data.message)
            }
          })
          .catch(err => {
            console.log(err)
          })
        } else {
          this.$message.error(res.data.message)
        }
      })
      .catch(err => {
        console.log(err)
      })
    }, 1000, {
      'leading': true,
      'trailing': false
    }),
    handelCancel: _.debounce(function() {
      managementDepStashClean(this.id).then(res => {
      })
      .catch(err => {
        console.log(err)
      })
      this.managementDepListCompany()
    }, 1000, {
      'leading': true,
      'trailing': false
    }),
    managementDepListCompany() {
      if(this.id === undefined || this.id === null) {
        return false
      }
      managementDepListCompany(this.id).then(res => {
        if(res.data.code === 200) {
          this.companyList = res.data.data
          this.companyId = this.companyList[0].company
          Promise.all([this.managementDepTree(), this.managementDepStashList()])
        }
      })
      .catch(err => {
        console.log(err)
      })
    },
    handleSelectChange(value) {
      // console.log(`selected ${value}`)
      // 切换公司时暂存
      const paramData = {
        scopeId: this.id,
        companyId: this.companyId,
        deptIdGroup: this.list.map(item => item.deptId)
      }
      managementDepStash(paramData).then(res => {
        if(res.data.code === 200) {
          
        } else {
          this.$message.error(res.data.message)
        }
      })
      .catch(err => {
        console.log(err)
      })
      this.companyId = value
      Promise.all([this.managementDepTree(), this.managementDepStashList()])
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase())
      );
    },
    onChange(e) {
      const value = e.target.value
      const expandedKeys = dataList
        .map((item) => {
          if (item.name.includes(value)) {
            return getParentKey(item.id, this.treeData)
          }
          return null
        })
        .filter((item, i, self) => item && self.indexOf(item) === i)
      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true,
      })
    },
    managementDepTree() {
      managementDepTree(this.id, this.companyId).then(res => {
        if(res.data.code === 200) {
          this.treeData = []
          dataList = []
          sortArr = []
          checkedKeys = []
          generateData(res.data.data, this.treeData)
          generateList(res.data.data)
          this.checkedKeys = checkedKeys
        }
      })
      .catch(err => {
        console.log(err)
      })
    },
    managementDepStashList() {
      managementDepStashList(this.id, this.companyId).then(res => {
        if(res.data.code === 200) {
          this.list = res.data.data
        }
      })
      .catch(err => {
        console.log(err)
      })
    },
    onCheck(checkedKeys, e) {
      // console.log('onCheck', checkedKeys)
      this.list = []
      this.checkedKeys = checkedKeys.checked
      this.checkedKeys.forEach((item, index) => {
        this.list[index] = {
          deptName: e.checkedNodes[index].data.props.name,
          deptId: e.checkedNodes[index].data.props.id
        }
      })
      // 按顺序排列
      this.list.sort(sortFunc('deptId', sortArr))
    },
    beforeEnter: function (el) {
      el.style.opacity = 0
      el.style.height = 0
    },
    enter: function (el, done) {
      var delay = el.dataset.index * 15
      setTimeout(function () {
        Velocity(
          el,
          { opacity: 1, height: '1.6em' },
          { complete: done }
        )
      }, delay)
    },
    leave: function (el, done) {
      var delay = el.dataset.index * 15
      setTimeout(function () {
        Velocity(
          el,
          { opacity: 0, height: 0 },
          { complete: done }
        )
      }, delay)
    },
    handleCircle(deptId, index) {
      this.list.splice(index, 1)
      this.checkedKeys = this.checkedKeys.filter(item => {
        return Number(item) !== Number(deptId)
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .organ-box {
    padding: 0 20px;
    .action-btn {
      color: #e99882;
      padding: 0 7.5px;
      border-right: 1px solid #ecf5f3;
      cursor: pointer;
    }
  }
  .search-box {
    margin-top: 20px;
    background: #f5f5f5;
    padding: 15px;
    display: flex;
    width: 100%;
    border: 1px solid #e6e6e6;
    .search-left {
      width: 350px;
      margin-right: 15px;
      min-height: 300px;
    }
    .search-right {
      width: 350px;
      padding-left: 15px;
      border-left: 1px solid #e7e7e7;
      .search-rig-li {
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        .sea-close-circle {
          margin-right: 10px;
        }
        .sea-close-circle:hover {
          color: #fe4037;
        }
      }
    }
  }
</style>