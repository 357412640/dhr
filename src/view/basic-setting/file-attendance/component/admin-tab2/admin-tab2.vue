<template>
  <div class="tab1-box">
    <Table :columns="columns" :data="data" stripe :loading="loading" :no-data-text="noData">
      <template slot-scope="{ row, index}" slot="workTime">
        <div>
          <span>{{ row.workTimeRuleName || '——' }}</span>
        </div>
      </template>
      <template slot-scope="{ row, index}" slot="operate">
        <Button type="text" class="common-btn" @click="editRole(row)">人员详情</Button>
      </template>
    </Table>
    <div style="margin: 16px;overflow: hidden">
      <div style="float: right;">
        <Page :page-size="pageInfo.pageSize"
              :total="pageInfo.total"
              :current="pageInfo.pageNum"
              show-total
              @on-change="changePage"></Page>
        <!--            show-elevator-->
        <!--                  show-sizer-->
      </div>
    </div>
  </div>
</template>

<script>
  import { noData } from '@/libs/util'

  export default {
    props: {
      dataInfo: {
        type: Object,
        default() {
          return {
            list: [],
            pageInfo: {
              pageSize: 10,
              total: 0,
              pageNum: 1
            }
          }
        }
      },
      loading: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        columns: [
          {
            align: 'center',
            title: '员工编号',
            key: 'emplid',
            width: 140
          },
          {
            align: 'center',
            title: '员工姓名',
            key: 'name',
            width: 140
          },
          {
            align: 'center',
            tooltip: true,
            title: '所属部门',
            key: 'deptChain',
            minWidth: 100
          },
          {
            align: 'center',
            title: '班次',
            slot: 'workTime',
            width: 180
          },
          {
            align: 'center',
            title: '入职日期',
            key: 'origHireDt',
            width: 140
          },
          {
            align: 'center',
            title: '离职日期',
            key: 'dimissionDt',
            width: 140
          },
          {
            align: 'center',
            title: '操作',
            slot: 'operate',
            width: 200
          }
        ],
        data: [],
        pageInfo: {
          pageSize: 10,
          total: 0,
          pageNum: 1
        },
        noData,
      }

    },
    watch: {
      dataInfo: {
        handler(newVal) {
          this.data = newVal.leaveList
          this.pageInfo = newVal.pageInfo
        },
        deep: true
      },
      loading(newVal) {
        this.loading = newVal
      }
    },
    mounted() {

    },
    methods: {
      changePage(p = 1) {
        this.data = []
        this.$emit('changePage', p)
      },
      editRole(row) {
        this.$router.push({
          name: 'detail-attendance',
          params: {
            info: JSON.stringify(row)
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
