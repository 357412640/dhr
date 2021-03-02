<template>
  <div class="shift-management">
    <a-row style="padding: 15px 0;">
      <a-button type="primary" @click="handleAdd"
        v-if="hasPerm(46)">新增</a-button>
    </a-row>
    <a-table :columns="columns" :data-source="data"
      rowKey="id"
      :loading="loading"
      :scroll="scroll"
      :locale="{}"
      :pagination="pagination"
      @change="onTableChange"
      class="manage-scope-table">
      <template slot="applyRange" slot-scope="text, record">
        <a-tooltip v-if="text === 2 && record.applyName.length > 15">
          <template slot="title">
            {{record.applyName}}
          </template>
          <div class="desc">{{record.applyName}}</div>
        </a-tooltip>
        <div v-else-if="text === 1">全员</div>
        <div v-else>{{record.applyName}}</div>
      </template>
      <div slot="status" slot-scope="text"
        class="status-box">
        <span class="icon-circular"
          :style="text === 1 ? 'background: #00d211;' : 'background: #e99882;'"></span>
        {{text === 1 ? '启用' : '停用'}}
      </div>
      <template slot="action" slot-scope="text, record">
        <span class="action-btn" @click="add(record.id)"
          v-if="hasPerm(49)">修改</span>
        <a-popconfirm
          :title="record.status === 2 ? `启用后，将可选择本班次对\u000A员工进行排班，确定启用？`
            : `停用后，将不能选择本班次对\u000A员工进行排班，确定停用？`"
          ok-text="确定"
          cancel-text="取消"
          @confirm="confirm(record)"
        >
          <span class="action-btn"
            style="border-right: 0;"
            v-if="hasPerm(48)">{{record.status === 2 ? '启用' : '停用'}}</span>
        </a-popconfirm>
      </template>
    </a-table>
    <add :visible.sync="visible"
      :id="id"
      @on-save="fetchData" />
  </div>
</template>
<script>
import {worktimeList, worktimeStatus} from '@/api/worktime.js'
import add from './add.vue'
export default {
  name: 'shift-management',
  data() {
    return {
      visible: false,
      columns: [{
        dataIndex: 'workName',
        title: '班次名称',
        align: 'center',
        width: 150
      }, {
        dataIndex: 'workRule',
        title: '工时制度',
        align: 'center',
        width: 100,
        customRender: (text) => {
          let str = ''
          switch(text) {
            case 1:
              str = '标准工时'
              break;
            case 2:
              str = '综合工时'
              break;
            case 3:
              str = '不定时工时'
              break;
          }
          return str
        },
      }, {
        dataIndex: 'elasticSignIn',
        title: '是否弹性打卡',
        align: 'center',
        width: 120,
        customRender: (text) => {
          let str = ''
          switch(text) {
            case 1:
              str = '是'
              break;
            case 2:
              str = '否'
              break;
          }
          return str
        },
      }, {
        dataIndex: 'itemsList',
        title: '上下班时间',
        align: 'center',
        width: 400,
        customRender: (text, record) => {
          let str = ''
          if(record.elasticSignIn === 2) {
            for (let item of text) {
              str += `${item.workStart} - ${item.workOffStart} , `
            }
          } else {
            for (let item of text) {
              str += `(${item.workStart},${item.workEnd}) - (${item.workOffStart},${item.workOffEnd}) , `
            }
          }
          str = str.substring(0, str.length - 3)
          return str
        }
      },  {
        dataIndex: 'applyRange',
        title: '使用范围',
        align: 'center',
        width: 200,
        scopedSlots: { customRender: 'applyRange' },
        // customRender: (text, record) => {
        //   if(text === 1) {
        //     return '全员'
        //   } else if(text === 2) {
        //     return record.applyName
        //   }
        // },
      }, {
        dataIndex: 'status',
        title: '状态',
        scopedSlots: { customRender: 'status' },
        align: 'center',
        width: 80,
      }, {
        title: '操作',
        dataIndex: 'action',
        scopedSlots: { customRender: 'action' },
        align: 'center',
        width: 120
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
        x: 1070
      },
      id: null
    }
  },
  components: {
    add
  },
  created() {
    this.fetchData()
  },
  methods: {
    handleAdd() {
      this.visible = true
      this.$set(this, 'id', null )
    },
    onTableChange (pagination, filters, sorter) {
      this.pagination = pagination
      this.fetchData()
    },
    fetchData() {
      const paramData = {
        pageSize: this.pagination.pageSize,
        pageNum: this.pagination.current
      }
      this.loading = true
      worktimeList(paramData).then(res => {
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
    },
    add(id) {
      this.visible = true
      this.id = id
    },
    confirm(record) {
      const paramData = {
        status: record.status === 1 ? 2 : 1,
        id: record.id
      }
      worktimeStatus(paramData).then(res => {
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
  }
}
</script>
<style lang="less">
  .ant-popover-message-title {
    white-space: pre;
  }
</style>
<style lang="less" scoped>
  .shift-management {
    padding: 15px;
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
</style>
