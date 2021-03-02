<template>
  <div class="management-scope">
    <div class="search-left">
      <a-input-search style="margin-bottom: 8px" placeholder="请输入管理范围" @change="onChange" />
      <a-tree
        :expanded-keys="expandedKeys"
        :auto-expand-parent="autoExpandParent"
        :tree-data="treeData"
        :selectedKeys="selectedKeys"
        @expand="onExpand"
        @select="onSelect"
      >
        <template slot="title" slot-scope="{ title }">
          <span v-if="title.includes(searchValue)">
            {{ title.substr(0, title.indexOf(searchValue)) }}
            <span style="color: #f50">{{ searchValue }}</span>
            {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
          </span>
          <span v-else>{{ title }}</span>
        </template>
      </a-tree>
    </div>
    <div class="search-right">
      <a-form layout="inline"
        :form="form"
        @submit="handleSearch"
        class="search-form">
        <a-form-item
          :colon="false"
          label="管理范围"
        >
          <a-input v-decorator="['scopeName']" placeholder="请输入名称"
            style="width: 140px;"/>
        </a-form-item>
        <a-form-item
          :colon="false"
          label="包含机构"
        >
          <a-input v-decorator="['deptName']" placeholder="请输入" 
            style="width: 140px;"/>
        </a-form-item>
        <a-form-item
          :colon="false"
          label="请选择状态"
        >
          <a-select
            v-decorator="['status']"
            placeholder="请选择"
            style="width: 120px;"
          >
            <a-select-option :value="0">
              停用
            </a-select-option>
            <a-select-option :value="1">
              启用
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit">
            搜索
          </a-button>
          <a-button @click="handleReset"
            :style="{ marginLeft: '10px' }">
            重置
          </a-button>
        </a-form-item>
      </a-form>
      <a-row style="padding: 15px 0;">
        <a-button type="primary" @click="handleAdd"
          v-if="hasPerm(7)">新增</a-button>
      </a-row>
      <a-table :columns="columns" :data-source="data"
        rowKey="id"
        :loading="loading"
        :scroll="scroll"
        :pagination="pagination"
        @change="onTableChange"
        class="manage-scope-table">
        <template slot="desc" slot-scope="text">
          <a-tooltip v-if="text && text.length > 13">
            <template slot="title">
              {{text}}
            </template>
            <div class="desc">{{text}}</div>
          </a-tooltip>
          <div v-else>{{text}}</div>
        </template>
        <div slot="status" slot-scope="text"
          class="status-box">
          <span class="icon-circular"
            :style="text ? 'background: #00d211;' : 'background: #e99882;'"></span>
          {{text ? '启用' : '停用'}}
        </div>
        <template slot="action" slot-scope="text, record">
          <a class="action-btn" @click="handleDetail(record)"
            v-if="hasPerm(8)">查看</a>
          <span class="action-btn" @click="add(record)"
            v-if="hasPerm(7)">新增下级</span>
          <a-popconfirm
            :title="'是否'+(record.status ? '停用' : '启用')+'?'"
            ok-text="确定"
            cancel-text="取消"
            @confirm="confirm(record)"
          >
            <span class="action-btn"
              style="border-right: 0;"
              v-if="hasPerm(9)">{{record.status ? '停用' : '启用'}}</span>
          </a-popconfirm>
        </template>
      </a-table>
    </div>
    <manage-scope-drawer :visible.sync="visible"
      :info="info"
      @on-save="managementScopeTree"/>
  </div>
</template>
<script>

import {managementScopeTree, managementChildList, managementUpdate} from '@/api/auth-management'
import _ from 'lodash'
import manageScopeDrawer from '@/components/manage-scope-drawer'
const generateData = (data, newData) => {
  for (const [index, item] of data.entries()) {
    newData.push(Object.assign(
      {},
      item,
      { scopedSlots: {
        title: 'title'
      }}))
    if (item.children) {
      generateData(item.children, newData[index]['children'] = [])
    }
  }
}
const dataList = []
const generateList = (data) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i]
    const key = node.key
    const title = node.title
    dataList.push({ key, title: title })
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
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children)
      }
    }
  }
  return parentKey
}
let temporaryName = ''
export default {
  name: 'management-scope',
  data () {
    return {
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      treeData: [],
      form: this.$form.createForm(this, {}),
      columns: [{
        dataIndex: 'code',
        title: '编码',
        align: 'center',
        width: 120
      }, {
        dataIndex: 'name',
        title: '名称',
        align: 'center',
        width: 150,
      }, {
        dataIndex: 'desc',
        title: '说明',
        scopedSlots: { customRender: 'desc' },
        align: 'center',
        width: 230
      }, {
        dataIndex: 'status',
        title: '状态',
        scopedSlots: { customRender: 'status' },
        align: 'center',
        width: 100,
      }, {
        dataIndex: 'gmtCreate',
        title: '创建时间',
        align: 'center',
        width: 180,
      }, {
        title: '操作',
        dataIndex: 'action',
        scopedSlots: { customRender: 'action' },
        align: 'center',
        width: 200
      }],
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
        x: 980
      },
      visible: false,
      selectedKeys: [],
      info: {}
    }
  },
  components: {
    manageScopeDrawer
  },
  created() {
    this.managementScopeTree()
  },
  methods: {
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onSelect(selectedKeys, e) {
      if( selectedKeys[0] === undefined) {
        return false
      }
      this.selectedKeys = selectedKeys
      temporaryName = e.selectedNodes[0].data.props.dataRef.title
      this.fetchData()
    },
    onChange(e) {
      const value = e.target.value
      const expandedKeys = dataList
        .map((item) => {
          if (item.title.includes(value)) {
            return getParentKey(item.key, this.treeData)
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
    managementScopeTree() {
      managementScopeTree().then((res) => {
        if (res.data.code === 200) {
          this.treeData = []
          generateData(res.data.data, this.treeData)
          generateList(res.data.data)
          this.selectedKeys[0] = res.data.data[0].key
          temporaryName = res.data.data[0].title
          this.fetchData()
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    handleSearch(e) {
      e.preventDefault();
      this.form.validateFields((error, values) => {
        this.fetchData(1)
      })
    },
    handleReset() {
      this.form.resetFields()
    },
    fetchData: _.debounce(function(origin) {
      if (origin === 1) {
        this.pagination.current = 1
      }
      const paramData = {
        pid: this.selectedKeys[0],
        scopeName: this.form.getFieldsValue().scopeName,
        deptName: this.form.getFieldsValue().deptName,
        status: this.form.getFieldsValue().status,
        pageSize: this.pagination.pageSize,
        pageNum: this.pagination.current
      }
      this.loading = true
      managementChildList(paramData).then(res => {
        this.loading = false
        if (res.data.code === 200) {
          this.data = res.data.data.list
          this.pagination.total = res.data.data.total
          this.pagination.showTotal = () => `共 ${res.data.data.total}条`
        }
      })
      .catch(err => {
        this.loading = false
        console.log(err)
      })
    }, 1000, {
      'leading': true,
      'trailing': false
    }),
    onTableChange (pagination, filters, sorter) {
      this.pagination = pagination
      this.fetchData()
    },
    confirm(record) {
      let url = ''
      if(record.status === 1) {
        url = 'disable'
      } else if(record.status === 0) {
        url = 'enable'
      }
      const paramData = {
        url,
        id: record.id
      }
      managementUpdate(paramData).then(res => {
        if(res.data.code === 200) {
          this.$message.success(res.data.message, 1, function() {
            this.fetchData()
          }.bind(this))
        }
      })
      .catch(err => {
        console.log(err)
      })
    },
    add(record) {
      this.visible = true
      this.$set(this.info, 'pname', record.name )
      this.$set(this.info, 'id', record.id)
      this.$set(this.info, 'status', 1)
    },
    handleAdd() {
      this.visible = true
      this.$set(this.info, 'pname', temporaryName )
      this.$set(this.info, 'id', this.selectedKeys[0])
      this.$set(this.info, 'status', 1)
    },
    handleDetail(record) {
      this.$router.push({
        name: 'management-scope-detail',
        params: {
          id: record.id
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .management-scope {
    background: #fff;
    padding: 15px;
    display: flex;
    .search-left {
      width: 225px;
      margin-right: 15px;
    }
    .search-right {
      padding-left: 15px;
      border-left: 1px solid #e7e7e7;
      // flex: 1;
      width: calc(~'100% - 225px');
      .search-form {
        border-bottom: 1px solid #f3f3f3;
        padding-bottom: 15px;
      }
      .status-box {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .icon-circular {
        border-radius: 50%;
        width: 7px;
        height: 7px;
        background: #00d211;
        display: inline-block;
        margin-right: 10px;
      }
      .action-btn {
        color: @primary-color;
        padding: 0 7.5px;
        border-right: 1px solid #ecf5f3;
        cursor: pointer;
      }
      .desc {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
</style>