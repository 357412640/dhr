<template>
  <div class="role-edit-box common-style">
    <common-header :title="roleInfo.roleName" :back="true"></common-header>
    <Row class-name="role-info">
      <Col span="4" style="min-width: 180px">
        <span>角色编号：</span>
        <span>{{ roleInfo.roleCode }}</span>
      </Col>
      <Col span="3" style="min-width: 135px">
        <span class="fl">状态：</span>
        <span v-if="roleInfo.status === 1">
          <Badge status="success" />
          启用
        </span>
        <span v-if="roleInfo.status === 2">
          <Badge status="error" />
          停用
        </span>
      </Col>
      <Col span="4" style="min-width: 220px">
        <span>创建时间：</span>
        <span>{{ roleInfo.gmtCreate }}</span>
      </Col>
      <Col span="7" style="min-width: 320px">
        <p class="des">
          <span>角色描述：</span>
          <span>{{ roleInfo.remark }}</span>
        </p>
      </Col>
      <Col span="4" style="min-width: 105px;text-align: end;">
        <Button type="text" class="common-btn" @click="showCreateRule">修改基本信息</Button>
      </Col>
    </Row>
    <div class="content-box">
      <Tabs v-model="tabVal" style="height: 100%;">
        <TabPane label="菜单权限" name="tab1" v-if="hasPerm(59)">
          <tab1-content :role="roleInfo"></tab1-content>
        </TabPane>
        <TabPane label="成员" name="tab2" v-if="hasPerm(61)">
          <tab2-content :role="roleInfo"></tab2-content>
        </TabPane>
        <TabPane label="可授权角色" name="tab3" v-if="hasPerm(62)">
          <tab3-content :role="roleInfo"></tab3-content>
        </TabPane>
        <TabPane label="基本信息" name="tab4" v-if="hasPerm(64)">
          <tab4-content v-if="tabVal === 'tab4'" :role="roleInfo" :log-list="logList"></tab4-content>
        </TabPane>
      </Tabs>
    </div>


    <Drawer title="修改角色" :mask-closable="false" :width="577" v-model="roleDrawer" @on-close="cancelNewRule">
      <drawer-box :roleDrawer="roleDrawer"
                  @hide="hideCreateRule"
                  @on-save="saveRule"
                  :saveLoading="saveLoading"
                  :appList="listApp"
                  :data="roleInfo"
                  type="edit"
      ></drawer-box>
    </Drawer>
  </div>
</template>

<script>
  import CommonHeader from '@/components/header'
  import Tab1Content from './component/tab1-content'
  import Tab2Content from './component/tab2-content'
  import Tab3Content from './component/tab3-content'
  import Tab4Content from './component/tab4-content'
  import DrawerBox from './component/drawer-box'
  import { appList, roleUpdate, roleLogList } from '@/api/DHR/role'
  import {roleInfo} from "../../../api/DHR/role";
  export default {
    name: "role-edit",
    components: {
      CommonHeader,
      Tab1Content,
      Tab2Content,
      Tab3Content,
      Tab4Content,
      DrawerBox
    },
    data() {
      return {
        roleInfo: {},
        tabVal: '',
        roleDrawer: false,
        saveLoading: false,
        listApp: [],
        logList: []
      }
    },
    methods: {
      showCreateRule() {
        this.roleDrawer = true
        this.roleInfo = JSON.parse(this.$route.query.param)
      },
      hideCreateRule() {
        this.saveLoading = false
        this.roleDrawer = false
      },
      cancelNewRule() {
        this.hideCreateRule()
      },
      saveRule(data) {
        this.saveLoading = true
        // console.log('可以保存', data)
        roleUpdate(data).then(res => {
          const data = res.data
          if (data.code === 200) {
            this.$Message.success('保存成功')
            this.roleDrawer = false
            this.getRoleInfo()
          } else {
            this.$Message.warning(`修改角色失败：${data.message}`)
          }
        }).finally(() => {
          this.saveLoading = false
        })
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
      getLogList() {
        const roleId = this.roleInfo.roleId
        roleLogList(roleId).then(res => {
          const data = res.data
          if (data.code === 200) {
            this.logList = data.data
          } else {
            this.$Message.warning(`操作记录获取失败：${data.message}`)
          }
        })
      },
      getRoleInfo() {
        roleInfo(this.roleInfo.roleId).then(res => {
          const data = res.data
          if (data.code === 200) {
            this.roleInfo = data.data
          } else {
            this.$Message.warning(`获取详情失败：${data.message}`)
          }
        })
      }
    },
    created() {
      if (!this.$route.query.param) {
        this.$router.push({
          path: '/view/system_management/role-management'
        })
      } else {
        this.roleInfo = JSON.parse(this.$route.query.param)
      }
      // console.log(this.roleInfo)
    },
    mounted() {
      if (this.hasPerm(59)) {
        this.tabVal = 'tab1'
      } else if (this.hasPerm(61)) {
        this.tabVal = 'tab2'
      } else if (this.hasPerm(62)) {
        this.tabVal = 'tab3'
      } else if (this.hasPerm(64)) {
        this.tabVal = 'tab4'
      }

      this.getAppList()
      this.getLogList()
    }
  }
</script>

<style lang="less" scoped>
  .role-edit-box {
    height: 100%;
    display: flex;
    flex-direction: column;
    .content-box {
      flex: 1;
      /*height: calc(100% - 105px);*/
    }
    .role-info {
      padding: 0 16px 0 36px;
      line-height: 30px;
      margin: 15px 0;
      .des {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
        padding-right: 20px;
      }
    }
    .status1 {
      color: #52C41A;
    }
    .status2 {
      color: #FE4037;
    }
    /*.status1:before {*/
    /*  content: '•';*/
    /*  color: #52C41A;*/
    /*  font-size: 20px;*/
    /*  float: left;*/
    /*}*/
    .fl {
      float: left;
    }
  }
</style>
<style lang="less">
  .role-edit-box {
    min-width: 1129px;
    .ivu-tabs-bar {
      padding: 0 20px;
    }
    .ivu-tabs-content {
      height: 100%;
    }
    .ivu-tabs {
      display: flex;
      flex-direction: column;
    }
  }
</style>
