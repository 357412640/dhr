<template>
  <div class="role-box common-style">
<!--    <common-header title="角色管理"></common-header>-->
    <div class="content">
      <Row>
        <Form :model="form" :label-width="80">
          <Col span="5">
            <FormItem label="角色名称">
              <Input type="text" v-model.trim="form.roleName" placeholder="请输入" class="item-style"></Input>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem label="角色编码">
              <Input v-model.trim="form.roleCode" placeholder="请输入" class="item-style"></Input>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem label="状态">
              <Select v-model="form.status" class="item-style">
                <Option :value="-1">全部</Option>
                <Option :value="1">启用</Option>
                <Option :value="2">停用</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem label="" :label-width="40">
              <Button type="primary" style="margin-right: 20px" @click="searchList">搜索</Button>
              <Button @click="clearSearch">重置</Button>
            </FormItem>
          </Col>
        </Form>
      </Row>
      <Row>
        <Col span="5">
          <Button type="primary" style="margin-right: 20px;" @click="showCreateRule" v-if="hasPerm(13)">新增</Button>
<!--          <Button>批量导出</Button>-->
        </Col>
      </Row>
      <div class="table-box">
        <Table :columns="columns"
               :data="data"
               stripe
               :loading="loading"
               :no-data-text="noData"
        >
          <template slot-scope="{ row, index }" slot="status">
            <p v-if="row.status === 1">
              <Badge status="success" />
              启用
            </p>
            <p v-else-if="row.status === 2">
              <Badge status="error" />
              停用
            </p>
          </template>
          <template slot-scope="{ row, index}" slot="operate">
            <Button type="text" class="common-btn" @click="editRole(row)" v-if="hasPerm(16)">修改</Button>
            <Divider type="vertical" v-if="hasPerm(16)"/>
            <Poptip
              confirm
              title="一旦停用，用户将无法被授权本角色，确认需要停用？"
              @on-ok="roleDisable(row.roleId)"
              @on-cancel="cancelRole"
              v-if="row.status === 1 && hasPerm(17) "
              class="poptip-style"
              width="194"
            >

              <Button type="text" class="common-btn">停用</Button>
            </Poptip>
            <Poptip
              confirm
              title="角色启用，用户将可被授权本角色，确定启用？"
              @on-ok="roleEnable(row.roleId)"
              @on-cancel="cancelRole"
              v-else-if="row.status === 2 && hasPerm(15)"
              class="poptip-style"
              width="194"
            >
              <Button type="text" class="common-btn">启用</Button>
            </Poptip>
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
    </div>
    <Drawer title="新建角色" :mask-closable="false" :width="577" v-model="roleDrawer" @on-close="cancelNewRule">
      <drawer-box :roleDrawer="roleDrawer"
                  @hide="hideCreateRule"
                  @on-save="saveRule"
                  :saveLoading="saveLoading"
                  :appList="listApp"
      ></drawer-box>
    </Drawer>
  </div>
</template>

<script>
  import CommonHeader from '@/components/header'
  import DrawerBox from './component/drawer-box'
  import { roleList, roleCreate, appList, roleEnable, roleDisable } from '@/api/DHR/role'
  import { noData } from '@/libs/util'
  const form = {
    roleName: '',
    roleCode: '',
    status: ''
  }
  export default {
    name: "role-namagement",
    components: {
      CommonHeader,
      DrawerBox
    },
    data() {
      return {
        searchInfo: {
          roleName: '',
          roleCode: '',
          status: '',
          pageSize: 10,
          pageNum: 1 // 页码
        },
        form: {
          roleName: '',
          roleCode: '',
          status: ''
        },
        columns: [
          {
            align: 'center',
            title: '角色编号',
            key: 'roleCode',
            minWidth: 140
          },
          {
            align: 'center',
            title: '角色名称',
            key: 'roleName',
            minWidth: 180
          },
          {
            align: 'center',
            title: '所属应用',
            key: 'appName',
            width: 120
          },
          {
            align: 'center',
            tooltip: true,
            title: '角色描述',
            key: 'remark',
            minWidth: 140
          },
          {
            align: 'center',
            title: '状态',
            slot: 'status',
            width: 120
          },
          {
            align: 'center',
            title: '创建时间',
            key: 'gmtCreate' ,
            minWidth: 180
          },
          {
            align: 'center',
            title: '操作',
            slot: 'operate',
            width: 180
          }
        ],
        data: [],
        pageInfo: {
          pageSize: 10,
          total: 0,
          pageNum: 1
        },
        loading: false,
        roleDrawer: false,
        saveLoading: false,
        listApp: [],
        noData: noData

      }
    },
    methods: {
      searchList() {
        // 保存当前搜索信息
        this.searchInfo = JSON.parse(JSON.stringify(this.form))
        this.searchInfo.status = this.form.status === -1 ? '' : this.form.status
        this.changePage(1)
      },
      changePage(p) {
        this.data = []
        this.loading = true
        // 根据保存的搜索信息搜索
        const data = {
          ...this.searchInfo,
          pageSize: this.pageInfo.pageSize,
          pageNum: p
        }
        roleList(data).then(res => {
          const data = res.data
          if (data.code === 200) {
            if ( data.data && data.data.list && data.data.list.length) {
              this.data = data.data.list
            }
            this.pageInfo.pageNum = data.data.pageNum || 1
            this.pageInfo.pageSize = data.data.pageSize
            this.pageInfo.total = data.data.total

          } else {
            this.$Message.warning(`角色列表获取失败：${data.message}`)
          }
        }).finally(() => {
          this.loading = false
        })
      },
      showCreateRule() {
        this.roleDrawer = true
      },
      hideCreateRule() {
        this.saveLoading = false
        this.roleDrawer = false
      },
      cancelNewRule() {
        this.hideCreateRule()
      },
      editRole(row) {
        this.$router.push({
          path: '/view/system_management/role-edit',
          query: {
            param: JSON.stringify(row)
          }
        })
      },
      saveRule(data) {
        this.saveLoading = true
        // console.log('可以保存', data)
        roleCreate(data).then(res => {
          const data = res.data
          if (data.code === 200) {
            this.$Message.success('保存成功')
            this.roleDrawer = false
            this.clearSearch()
            this.searchList()
          } else {
            this.$Message.warning(`新建角色失败：${data.message}`)
          }
        }).finally(() => {
          this.saveLoading = false
        })
      },
      clearSearch() {
        this.form = JSON.parse(JSON.stringify(form))
      },
      getAppList() {
        appList().then(res => {
          const data = res.data
          if (data.code === 200) {
            this.listApp = data.data
          } else {
            this.$Message.warning(`应用列表获取失败：${data.message}`)
          }
        })
      },
      roleEnable(roleId) {
        if (roleId === undefined) return
        this.loading = true
        roleEnable(roleId).then(res => {
          const data = res.data
          if (data.code === 200) {
            this.changePage(this.pageInfo.pageNum)
          } else {
            this.$Message.warning(`启用失败：${data.message}`)
          }
        }).finally(() => {
          this.loading = false
        })
      },
      roleDisable(roleId) {
        if (roleId === undefined) return
        this.loading = true
        roleDisable(roleId).then(res => {
          const data = res.data
          if (data.code === 200) {
            this.changePage(this.pageInfo.pageNum)
          } else {
            this.$Message.warning(`停用失败：${data.message}`)
          }
        }).finally(() => {
          this.loading = false
        })
      },
      cancelRole() {}
    },
    mounted() {
      this.searchList()
      this.getAppList()
    }
  }
</script>

<style lang="less" scoped>
  .role-box {
    min-width: 1129px;
    .content {
      padding: 20px;
    }
    .item-style {
      /*min-width: 150px;*/
      /*width: 200px;*/
    }
    .table-box {
      margin-top: 20px;
    }
    .poptip-style {
      text-align: initial;
    }
    /*.status1:before {*/
    /*  content: '•';*/
    /*  color: #52C41A;*/
    /*  font-size: 20px;*/
    /*}*/
  }
</style>
<style lang="less">
  .role-box {
    .ivu-table-cell {
      height: 18px;
    }
  }

</style>
