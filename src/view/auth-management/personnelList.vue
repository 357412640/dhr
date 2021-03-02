<template>
  <div class="person-box">
    <a-form layout="inline"
      :form="form"
      @submit="handleSearch"
      class="search-form">
      <a-form-item
        :colon="false"
        label="姓名"
      >
        <a-input v-decorator="['staffName']" placeholder="请输入姓名"
          style="width: 140px;"
          allowClear/>
      </a-form-item>
      <a-form-item
        :colon="false"
        label="员工号"
      >
        <a-input v-decorator="['emplid']" placeholder="请输入员工号"
          style="width: 140px;"
          allowClear/>
      </a-form-item>
      <a-form-item
        :colon="false"
        label="部门"
      >
        <a-input v-decorator="['deptName']" placeholder="请输入部门"
          style="width: 140px;"
          allowClear/>
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
    <a-table :columns="columns" :data-source="data"
      rowKey="emplid"
      :loading="loading"
      :scroll="scroll"
      :locale="{}"
      :pagination="pagination"
      @change="onTableChange"
      class="manage-scope-table"
      style="margin-top: 20px;">

    </a-table>
  </div>
</template>
<script>
import _ from 'lodash'
import {managementEmployeePage} from '@/api/auth-management'
export default {
  props: {
    id: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      form: this.$form.createForm(this, {}),
      columns: [{
        dataIndex: 'emplid',
        title: '员工号',
        align: 'center',
        width: 120
      }, {
        dataIndex: 'staffName',
        title: '姓名',
        align: 'center',
        width: 120,
      }, {
        dataIndex: 'staffStatus',
        title: '员工状态',
        align: 'center',
        width: 120
      }, {
        dataIndex: 'staffEmail',
        title: '邮箱',
        align: 'center',
        width: 250,
      }, {
        dataIndex: 'deptChain',
        title: '部门',
        align: 'center',
        width: 250,
      }, {
        title: '职位',
        dataIndex: 'position',
        align: 'center',
        width: 150
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
        x: 1010
      },
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    handleSearch(e) {
      e.preventDefault();
      this.form.validateFields((error, values) => {
        this.fetchData(1)
      })
    },
    handleReset() {
      this.form.resetFields()
    },
    onTableChange (pagination, filters, sorter) {
      this.pagination = pagination
      this.fetchData()
    },
    fetchData: _.debounce(function(origin) {
      if (origin === 1) {
        this.pagination.current = 1
      }
      const paramData = {
        scopeId: this.id,
        staffName: this.form.getFieldsValue().staffName,
        emplid: this.form.getFieldsValue().emplid,
        deptName: this.form.getFieldsValue().deptName,
        pageSize: this.pagination.pageSize,
        pageNum: this.pagination.current
      }
      this.loading = true
      managementEmployeePage(paramData).then(res => {
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
  }
}
</script>
<style lang="less" scoped>
  .person-box {
    padding: 0 20px;
  }
</style>