<template>
  <div class="tab2-content-box">
    <Row>
      <Form :model="form" class="form-box" :label-width="80">
        <Col span="6" class="minW-250">
          <FormItem label="姓名" :label-width="80">
            <Input v-model.trim="form.staffName" placeholder="请输入" class="item-style"></Input>
          </FormItem>
        </Col>
        <Col span="6" class="minW-250">
          <FormItem label="员工号">
            <Input v-model.trim.number="form.emplid" placeholder="请输入" class="item-style"></Input>
          </FormItem>
        </Col>
        <Col span="6" class="minW-250">
          <FormItem label="用户状态">
            <Select v-model="form.userStatus" class="item-style">
              <Option :value="-1">全部</Option>
              <Option :value="1">启用</Option>
              <Option :value="2">停用</Option>
            </Select>
          </FormItem>
        </Col>
      </Form>
      <Col span="5">
        <Button type="primary" style="margin-right: 20px" @click="searchList">搜索</Button>
        <Button @click="clearSearch">重置</Button>
      </Col>
    </Row>

    <div class="table-box">
      <Table :columns="columns" :data="data" stripe :loading="loading" :no-data-text="noData">
        <template slot-scope="{ row, index }" slot="userStatus">
          <p v-if="row.userStatus === 1">
            <Badge status="success" />
            启用
          </p>
          <p v-else-if="row.userStatus === 2">
            <Badge status="error" />
            禁用
          </p>
        </template>
      </Table>
      <div style="margin: 16px;overflow: hidden">
        <div style="float: right;">
          <Page :page-size="pageInfo.page_size"
                :total="pageInfo.total"
                :current="pageInfo.current"
                show-total
                @on-change="changePage"></Page>
<!--          show-elevator-->
<!--          show-sizer-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { userList } from '@/api/DHR/role'
  import { noData } from '@/libs/util'
  const form = {
    staffName: '',
    emplid: '',
    userStatus: ''
  }
  export default {
    name: "tab2-content",
    props: {
      role: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        searchInfo: {},
        form: {
          staffName: '',
          emplid: '',
          userStatus: ''
        },
        columns: [
          {
            align: 'center',
            tooltip: true,
            title: '员工号',
            key: 'emplid',
            width: 180
          },
          {
            align: 'center',
            tooltip: true,
            title: '姓名',
            key: 'staffName',
            minWidth: 140
          },
          {
            align: 'center',
            tooltip: true,
            title: '员工状态',
            key: 'staffStatus',
            minWidth: 160
          },
          {
            align: 'center',
            tooltip: true,
            title: '用户状态',
            slot: 'userStatus',
            minWidth: 160
          },
          {
            align: 'center',
            tooltip: true,
            title: '邮箱',
            key: 'staffEmail',
            minWidth: 240
          },
          {
            align: 'center',
            tooltip: true,
            title: '管理范围',
            key: 'scopeName',
            minWidth: 160
          }
        ],
        data: [],
        pageInfo: {
          pageSize: 10,
          total: 0,
          pageNum: 1
        },
        loading: false,
        noData
      }
    },
    methods: {
      searchList() {
        // 保存当前搜索信息
        this.searchInfo = JSON.parse(JSON.stringify(this.form))
        this.searchInfo.userStatus = this.form.userStatus === -1 ? '' : this.form.userStatus
        this.changePage(1)
      },
      clearSearch() {
        this.form = JSON.parse(JSON.stringify(form))
      },
      changePage(p = 1) {
        this.loading = true
        // 根据保存的搜索信息搜索
        const data = {
          ...this.searchInfo,
          roleId: this.role.roleId,
          pageSize: this.pageInfo.pageSize,
          pageNum: p
        }
        userList(data).then(res => {
          const data = res.data
          if (data.code === 200) {
            if ( data.data && data.data.list && data.data.list.length) {
              this.data = data.data.list
            } else {
              this.data = []
            }
            this.pageInfo.pageNum = data.data.pageNum
            this.pageInfo.pageSize = data.data.pageSize
            this.pageInfo.total = data.data.total
          } else {
            this.$Message.warning(`成员列表获取失败：${data.message}`)
          }
        }).finally(() => {
          this.loading = false
        })
      }
    },
    mounted() {
      this.searchList()
    },
    activated() {
      this.searchList()
    }
  }
</script>

<style lang="less" scoped>
  .tab2-content-box {
    padding: 0 16px 20px 23px;
    .item-style {
      width: 150px;
    }
    .form-box {
      padding-left: 15px;
    }
    /*.state1:before {*/
    /*  content: '•';*/
    /*  color: #52C41A;*/
    /*  font-size: 20px;*/
    /*}*/
    .status1 {
      color: #52C41A;
    }
    .status2 {
      color: #FE4037;
    }
    .minW-250 {
      min-width: 250px;
    }
  }

</style>
