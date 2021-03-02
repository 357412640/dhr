<template>
  <div class="user-box common-style">
    <div class="left">
      <div style="overflow-y: auto;height: 100%;">
        <Input style="margin-bottom: 8px" placeholder="请输入管理范围" search @on-search="onChange">
        </Input>
        <a-tree
          :expanded-keys="expandedKeys"
          :auto-expand-parent="autoExpandParent"
          :tree-data="gData"
          @expand="onExpand"
          @select="selectScopeTree"
          :selectedKeys="selectedKeys"
          v-if="gData && gData.length"
          class="fs-12"
        >
          <template slot="title" slot-scope="{ title }">
            <span v-if="title && (title.indexOf(searchValue) > -1)">
              {{ title.substr(0, title.indexOf(searchValue)) }}
              <span class="search-con">{{ searchValue }}</span>
              {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
            </span>
            <span v-else>{{ title }}</span>
          </template>
        </a-tree>
      </div>
    </div>
    <div class="right">
      <div class="clear">
        <Form :model="form" :label-width="80">
          <Col span="7">
            <FormItem label="员工姓名">
              <Input v-model.trim="form.name" placeholder="请输入员工姓名" class="item-style"></Input>
            </FormItem>
          </Col>
          <Col span="7">
            <FormItem label="手机号码">
              <Input v-model.trim="form.phone" placeholder="请输入手机号码" class="item-style"></Input>
            </FormItem>
          </Col>
          <Col span="7">
            <FormItem label="员工编号">
              <Input v-model.trim.number="form.emplid" placeholder="请输入" class="item-style"></Input>
            </FormItem>
          </Col>
          <Col span="7">
            <FormItem label="员工状态">
              <Select v-model="form.scopeStatus" class="item-style">
                <Option :value="-1">全部</Option>
                <Option :value="1">启用</Option>
                <Option :value="2">停用</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="7">
            <FormItem label="员工邮箱">
              <Input v-model.trim="form.email" placeholder="请输入" class="item-style"></Input>
            </FormItem>
          </Col>
          <Col span="7">
            <FormItem label="">
              <Button type="primary" style="margin-right: 20px" @click="searchList">搜索</Button>
              <Button @click="clearSearch">重置</Button>
            </FormItem>
          </Col>
        </Form>

      </div>
      <div>
        <Button type="primary" style="margin-right: 20px" @click="showCreateUser"  v-if="hasPerm(3)">新增</Button>
        <!--          <Button>批量导出</Button>-->
        <div class="table-box">
          <Table :columns="columns" :data="data" stripe :loading="loading" :no-data-text="noData">
            <template slot-scope="{ row, index }" slot="scopeStatus">
              <span v-if="row.scopeStatus === 1">
                <Badge status="success" />
                启用
              </span>
              <span v-else-if="row.scopeStatus === 2">
                <Badge status="error" />
                停用
              </span>
            </template>
            <template slot-scope="{ row, index}" slot="operate">
              <Button type="text" class="common-btn" @click="editRole(row)" v-if="hasPerm(2)">修改</Button>
              <Divider type="vertical" v-if="hasPerm(2)"/>
              <Poptip
                confirm
                title="停用的用户，将无法使用基于本权限应用授权的功能，确认需要停用？"
                @on-ok="userDisable(row.id)"
                @on-cancel="cancelUser"
                v-if="row.scopeStatus === 1 && hasPerm(5)"
                class="poptip-style"
                width="194"
              >
                <Button type="text" class="common-btn">停用</Button>
              </Poptip>
              <Poptip
                confirm
                title="启用的用户，将可以使用已授权功能，确定启用？"
                @on-ok="userEnable(row.id)"
                @on-cancel="cancelUser"
                v-else-if="row.scopeStatus === 2 && hasPerm(1)"
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
            </div>
          </div>
        </div>
      </div>
    </div>
    <Modal v-model="userModal1"
           title="添加用户"
           :width="850"
           ok-text="下一步"
           :mask-closable="false"
           @on-cancel="cancelModal1"
           @on-ok="showModal2"
           :loading="modal1Loading"
    >
      <RadioGroup v-model="modal1Type">
        <Radio label="have">
          <span style="padding-left: 5px;">从已有员工选择</span>
        </Radio>
      </RadioGroup>
      <div class="modal1-box">
        <div class="left">
          <Input type="text" v-model="modal1Val" placeholder="请输入姓名、手机号或邮箱" @on-search="searchUser" search>
            <Select v-model="modal1ValType" slot="prepend" style="width: 80px">
              <Option value="name">姓名</Option>
              <Option value="phone">手机号</Option>
              <Option value="email">邮箱</Option>
              <Option value="emplid">员工ID</Option>
            </Select>
          </Input>
          <div class="left-con">
            <RadioGroup v-model="modal1User"
                        class="radio-group"
                        @on-change="changeSelectUser"
                        v-if="modal1UserList && modal1UserList.length"
            >
              <template v-for="user in modal1UserList">
                <p class="margin-top-12" :key="user.emplid">
                  <Radio :label="user.emplid">
                    <span style="padding-left: 5px;">{{ `${user.name} | ${user.emplid} | ${user.deptDescr}` }}</span>
                  </Radio>
                </p>
              </template>
            </RadioGroup>
            <div v-else v-html="noData" style="text-align: center;padding-top: 60px">
            </div>
          </div>
        </div>
        <div class="right">
          <template>
            <p class="right-p">已选择</p>
            <p class="margin-top-12" v-if="modal1User">
              <span
                style="font-size: 14px;">{{ `${selectUser.name} | ${selectUser.emplid} | ${selectUser.deptDescr}` }}</span>
              <Icon type="md-close-circle" class="del-icon" @click="deleteSelectUser"/>
            </p>
          </template>
        </div>
      </div>
    </Modal>

    <Modal v-model="userModal2"
           :title="modal2Title === 'add' ? '添加用户' : '修改用户'"
           :width="850"
           ok-text="保存"
           :loading="modal2Loading"
           :mask-closable="false"
           @on-cancel="cancelModal2"
           @on-ok="saveModal2"
    >
      <div class="modal2-box">
        <div class="left">
          <h3 style="font-size: 16px;">基本信息</h3>
          <Form v-model="userModal2Form">
            <FormItem label="姓名：" class="modal2-form-item">
              <p class="modal2-left-fl">{{ selectUser.name }}</p>
            </FormItem>
            <FormItem label="员工号：" class="modal2-form-item">
              <p class="modal2-left-fl">{{ selectUser.emplid }}</p>
            </FormItem>
            <FormItem label="部门：" class="modal2-form-item">
              <p class="modal2-left-fl">{{ selectUser.deptChain }}</p>
            </FormItem>
            <FormItem label="职位：" class="modal2-form-item">
              <p class="modal2-left-fl">{{ selectUser.posiDescr }}</p>
            </FormItem>
            <FormItem label="手机号：" class="modal2-form-item">
              <p class="modal2-left-fl">{{ selectUser.phone }}</p>
            </FormItem>
            <FormItem label="邮箱：" class="modal2-form-item">
              <p class="modal2-left-fl">{{ selectUser.emailAddr }}</p>
            </FormItem>
            <FormItem label="用户状态：" class="modal2-form-item">
              <RadioGroup v-model="userModal2Form.scopeStatus"
                          class="radio-group modal2-left-fl"
              >
                <Radio :label="1">
                  <span style="padding-left: 5px;">启用</span>
                </Radio>
                <Radio :label="2">
                  <span style="padding-left: 5px;">停用</span>
                </Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="管理范围：" class="modal2-form-item">
              <Select v-model="userModal2Form.scopeId" filterable>
                <Option v-for="item in scopeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Form>
        </div>
        <div class="right">
          <div style="margin-bottom: 10px;" v-for="app in modal2Role">
            <p style="font-size: 14px;">
              <Icon type="ios-arrow-forward"
                    @click="hideOrShow(app)"
                    :class="[app.isShow ? 't90' : '', 'icon-style']"
              />
              {{ app.title }}
            </p>
            <div v-if="app.children && app.children.length && app.isShow" class="clear">
              <div v-for="(role, index) in app.children" :key="index" style="overflow: hidden;margin-top: 10px;">
                <div class="check-box fl">
                  <Checkbox :label="role.roleId" v-model="role.checked" @on-change="changeCheck(role)">
                    {{ role.roleName }}
                  </Checkbox>
                </div>
                <div class="fr">
                  <label>管理范围：</label>
                  <Select style="width: 200px;" v-model="role.scopeId" filterable>
                    <Option v-for="item in scopeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {
    userList,
    userEnable,
    userDisable,
    getCreateList,
    getScopeTree,
    getScopeList,
    getListRole,
    createUser,
    updateUser
  } from '@/api/DHR/user'
  import {noData} from '@/libs/util'
  import {Input, Tree} from 'ant-design-vue'

  const form = {
    name: '',
    phone: '',
    emplid: '',
    scopeStatus: '',
    email: ''
  }

  const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  }

  export default {
    name: "user-management",
    components: {
      aInputSearch: Input,
      aTree: Tree
    },
    data() {
      return {
        scopeId: '',
        loading: false,
        searchInfo: {},
        form: {
          name: '',
          phone: '',
          emplid: '',
          scopeStatus: '',
          email: ''
        },
        pageInfo: {
          pageSize: 10,
          total: 0,
          pageNum: 1
        },
        columns: [
          {
            align: 'center',
            title: '员工编号',
            key: 'emplid',
            minWidth: 140
          },
          {
            align: 'center',
            title: '用户名称',
            key: 'name',
            minWidth: 160
          },
          {
            align: 'center',
            title: '手机号码',
            key: 'phone',
            minWidth: 180
          },
          {
            align: 'center',
            title: '管理范围',
            key: 'scopeName',
            minWidth: 160
          },
          {
            align: 'center',
            title: '用户状态',
            slot: 'scopeStatus',
            width: 100
          },
          {
            align: 'center',
            title: '创建时间',
            key: 'createTime',
            minWidth: 200
          },
          {
            align: 'center',
            title: '操作',
            slot: 'operate',
            width: 180
          }
        ],
        data: [],
        noData,
        // 添加第一步
        userModal1: false,
        modal1Type: 'have',
        modal1ValType: 'name',
        modal1Val: '',
        modal1User: '',
        modal1UserList: [],
        modal1Loading: true,

        scopeList: [],
        userModal2: false,
        modal2Title: 'add',
        selectUser: {},
        userModal2Form: {
          scopeStatus: 1,
          scopeId: ''
        },
        modal2RoleList: {},
        modal2Role: [],
        modal2Loading: true,

        // 左侧范围树
        expandedKeys: [],
        searchValue: '',
        autoExpandParent: true,
        gData: [],
        dataList: [],
        selectedKeys: []
      }
    },
    methods: {
      // 搜索
      searchList() {
        if (this.scopeId !== '') {
          // 保存当前搜索信息
          this.searchInfo = JSON.parse(JSON.stringify(this.form))
          this.searchInfo.scopeStatus = this.form.scopeStatus === -1 ? '' : this.form.scopeStatus
          this.changePage(1)
        } else {
          this.$Message.warning('请选择管理范围')
        }
      },
      // 翻页
      changePage(p = 1) {
        this.data = []
        this.loading = true
        const data = {
          ...this.searchInfo,
          scopeId: this.scopeId,
          pageSize: this.pageInfo.pageSize,
          pageNum: p
        }
        userList(data).then(res => {
          const data = res.data
          if (data.code === 200) {
            if ( data.data && data.data.list && data.data.list.length) {
              this.data = data.data.list
              // console.log(this.data)
            }
            this.pageInfo.pageNum = data.data.pageNum || 1
            this.pageInfo.pageSize = data.data.pageSize
            this.pageInfo.total = data.data.total
          } else {
            this.$Message.warning(`用户列表获取失败：${data.message}`)
          }
        }).finally(() => {
          this.loading = false
        })
      },
      // 清除 当前搜索条件
      clearSearch() {
        this.form = JSON.parse(JSON.stringify(form))
      },
      // 启用用户
      userEnable(userId) {
        if (userId === undefined) return
        this.loading = true
        userEnable({userId}).then(res => {
          const data = res.data
          if (data.code === 200) {
            this.changePage(this.pageInfo.pageNum)
            this.$Message.success(`操作成功`)
          } else {
            this.$Message.warning(`启用失败：${data.message}`)
          }
        }).finally(() => {
          this.loading = false
        })
      },
      // 停用用户
      userDisable(userId) {
        if (userId === undefined) return
        this.loading = true
        userDisable({userId}).then(res => {
          const data = res.data
          if (data.code === 200) {
            this.changePage(this.pageInfo.pageNum)
            this.$Message.success(`操作成功`)
          } else {
            this.$Message.warning(`停用失败：${data.message}`)
          }
        }).finally(() => {
          this.loading = false
        })
      },
      cancelUser() {
      },
      // 显示modal1
      showCreateUser() {
        if (this.scopeId !== '') {
          this.userModal1 = true
          this.modal2Title = 'add'
        } else {
          this.$Message.warning('请选择管理范围')
        }
      },
      // modal1 搜索用户
      searchUser(val) {
        const type = this.modal1ValType
        const data = {
          emplid: this.emplid,
          [type]: val
        }
        getCreateList(data).then(res => {
          const data = res.data
          if (data.code === 200) {
            if (data.data && data.data.length) {
              this.modal1UserList = data.data
            } else {
              this.modal1UserList = []
            }
          } else {
            this.$Message.warning(`用户列表获取失败：${data.message}`)
          }
        }).finally(() => {

        })
      },
      // modal1 勾选用户按钮
      changeSelectUser(emplid) {
        for (let i = 0; i < this.modal1UserList.length; i++) {
          const user = this.modal1UserList[i]
          if (user.emplid === emplid) {
            this.selectUser = user
          }
        }
      },
      // modal1 已选列表删除按钮
      deleteSelectUser() {
        this.selectUser = {}
        this.modal1User = ''
      },
      // 取消 modal1
      cancelModal1() {
        this.modal1Type = 'have'
        this.modal1ValType = 'name'
        this.selectUser = {}
        this.modal1UserList = []
        this.modal1User = ''
        this.modal1Val = ''
        this.userModal1 = false
      },
      // modal1 下一步 如果选择了成员 显示modal2并请求权限范围
      showModal2() {
        if (this.modal1User) {
          this.userModal1 = false
          this.userModal2 = true
          this.getListRole()
          this.userModal2Form = {
            scopeStatus: 1,
            scopeId: ''
          }
        } else {
          this.$Message.warning('请选择员工')
          this.userModal1 = true
        }
        this.modal1Loading = false
        this.$nextTick(() => {
          this.modal1Loading = true
        })
      },
      // 获取modal2 的管理范围列表
      getScopeList() {
        getScopeList().then(res => {
          const data = res.data
          if (data.code === 200) {
            if (data.data && data.data.length) {
              this.scopeList = data.data
            } else {
              console.log('管理范围列表没有数据')
            }
          } else {
            this.$Message.warning(`管理范围列表获取失败：${data.message}`)
          }
        })
      },
      // 获取modal2 的权限设置
      getListRole(id) {
        const params = {
          userId: id
        }
        getListRole(params).then(res => {
          const data = res.data
          if (data.code === 200) {
            this.modal2RoleList = data.data
          } else {
            this.$Message.warning(`权限设置获取失败：${data.message}`)
          }
        }).finally(() => {

        })
      },
      // 左侧范围树
      getScopeTree() {
        try {
          getScopeTree().then(res => {
            const data = res.data
            if (data.code === 200) {
              if (data.data && data.data.length) {
                this.selectedKeys[0] = data.data[0].key
                this.scopeId = data.data[0].key
                this.gData = data.data
                this.generateList(this.gData)
                this.searchList()
              } else {
                this.gData = []
                console.log('管理范围树没有数据')
              }
            } else {
              this.$Message.warning(`管理范围树获取失败：${data.message}`)
            }
          })
        } catch (e) {
          console.log(e)
        }

      },
      onExpand(expandedKeys) {
        this.expandedKeys = expandedKeys;
        this.autoExpandParent = false
      },

      onChange(e) {
        const value = e
        if (value === '') {
          this.expandedKeys = []
          this.searchValue = ''
        } else {
          const expandedKeys = this.dataList
            .map(item => {
              if (item.title && (item.title.indexOf(value) > -1)) {
                return getParentKey(item.key, this.gData)
              }
              return null;
            })
            .filter((item, i, self) => {
              return item !== undefined && item !== null && self.indexOf(item) === i
            })
          Object.assign(this, {
            expandedKeys,
            searchValue: value,
            autoExpandParent: true
          })
        }

      },
      generateList(data) {
        for (let i = 0; i < data.length; i++) {
          const node = data[i];
          const key = node.key
          node.scopedSlots = { title: 'title' }
          this.dataList.push({ key, title: node.title })
          if (node.children) {
            this.generateList(node.children)
          }
        }
      },
      selectScopeTree(id) {
        this.selectedKeys = id
        this.scopeId = id[0]
        if (this.scopeId === undefined) {
          this.data = []
        } else {
          this.searchList()
        }

      },
      hideOrShow(app) {
        if (app.isShow) {
          app.isShow = false
        } else {
          app.isShow = true
        }
      },
      cancelModal2() {
        // 清空所有modal1 2 的数据
        this.modal1Type = 'have'
        this.modal1ValType = 'name'
        this.modal1Val = ''
        this.modal1User = ''
        this.modal1UserList = []
        this.selectUser = {}
        this.userModal2Form = {
          scopeStatus: 1,
          scopeId: ''
        }
        this.modal2RoleList = {}
        this.modal2Role = []
        this.userModal2 = false
      },
      saveModal2() {
        const addGroup = []
        this.modal2Role.map(app => {
          app.children.map(role => {
            const checkedRole = {}
            if (role.checked) {
              checkedRole.roleId = role.roleId
              checkedRole.scopeId = role.scopeId
              addGroup.push(checkedRole)
            }
          })
        })
        const data = {
          ...this.userModal2Form,
          addGroup,
          userId: this.selectUser.id
        }
        let fetch
        if (this.modal2Title === 'add') {
          fetch = createUser
          data.emplid = this.selectUser.emplid
        } else {
          fetch = updateUser
        }
        fetch(data).then(res => {
          const data = res.data
          if (data.code === 200) {
            this.$Message.success(`保存成功`)
            this.changePage()
            this.modal1Type = 'have'
            this.modal1ValType = 'name'
            this.modal1Val = ''
            this.modal1User = ''
            this.modal1UserList = []
            this.selectUser = {}
            this.userModal2Form = {
              scopeStatus: 1,
              scopeId: ''
            }
            this.modal2RoleList = {}
            this.modal2Role = []
            this.userModal2 = false
          } else {
            this.$Message.warning(`保存失败：${data.message}`)
          }
        }).finally(() => {
          this.modal2Loading = false
          this.$nextTick(() => {
            this.modal2Loading = true
          })
        })
      },
      editRole(row) {
        this.getListRole(row.id)
        this.selectUser = row
        this.userModal2Form.scopeId = row.scopeId
        this.userModal2Form.scopeStatus = row.scopeStatus
        this.userModal2 = true
        this.modal2Title = 'edit'
      },
      changeCheck(role) {
        if (role.checked) {
          role.isCheck = 1
          if (role.scopeId === '' || role.scopeId === undefined || role.scopeId === null) {
            role.scopeId = this.userModal2Form.scopeId
          }
        } else {
          role.isCheck = 2
        }
      }
    },
    mounted() {
      this.getScopeList()
      this.getScopeTree()

    },
    watch: {
      modal2RoleList() {
        // 遍历 ，判断是否勾选,勾选添加true， 添加当前管理的scopeId
        const modal2Role = []
        const keys = Object.keys(this.modal2RoleList)
        keys.forEach(appName => {
          const app = {
            title: appName,
            isShow: false,
          }
          app.children = this.modal2RoleList[appName].map(role => {
            return {
              ...role,
              checked: role.isCheck === 1
            }
          })
          modal2Role.push(app)
        })
        this.modal2Role = modal2Role
      }
    }
  }
</script>

<style lang="less" scoped>
  @primary-color: #2d8cf0;
  .user-box {
    position: relative;
    padding: 20px 0;
    display: flex;
    min-width: 1100px;
    align-items: stretch;
    .left {
      position: relative;
      width: 25%;
      min-width: 250px;
      border-right: 1px solid #dcdee2;
      padding: 0 20px;
    }

    .right {
      width: 75%;
      min-width: 780px;
      position: relative;
      padding: 0 20px;
    }

    .table-box {
      margin-top: 20px;
    }

    .status1 {
      color: #52C41A;
    }

    .status2 {
      color: #FE4037;
    }

    .clear:after {
      display: block;
      clear: both;
      height: 0;
      content: '';
    }
  }

  .modal1-box {
    margin-top: 20px;
    width: 810px;
    height: 316px;
    border: 1px solid #dcdee2;
    border-radius: 5px;

    .left {
      width: 50%;
      height: 100%;
      border-right: 1px solid #dcdee2;
      float: left;
      overflow-y: auto;
      padding: 20px;

      .left-con {
        height: 242px;
        overflow-y: auto;
      }

      .radio-group {
        display: block;
      }
    }

    .right {
      width: 50%;
      height: 100%;
      float: left;
      padding: 20px;

      .right-p {
        line-height: 32px;
      }

      .del-icon {
        float: right;
        font-size: 16px;
        cursor: pointer;
      }
    }

    .margin-top-12 {
      margin-top: 12px;
    }
  }

  .modal2-box {
    margin-top: 20px;
    width: 810px;
    height: 600px;

    .left {
      width: 40%;
      height: 100%;
      border-right: 1px solid #dcdee2;
      float: left;
      overflow-y: auto;
      padding: 0 20px;

      .modal2-form-item {
        margin-bottom: 4px;
        font-weight: 700;
      }

      .modal2-left-fl {
        float: left;
        width: 100%;
        line-height: 28px;
        font-weight: 400;
      }
    }

    .right {
      width: 60%;
      height: 100%;
      float: left;
      padding: 0 20px;
      overflow-y: auto;
      .check-box {
        line-height: 32px;
      }
    }
    .fl {
      float: left;
    }
    .fr {
      float: right;
    }
    .clear:after {
      clear: both;
      display: block;
      height: 0;
      content: '';
    }
  }
  .poptip-style {
    text-align: initial;
  }
  .t90 {
    transform: rotate(90deg);
  }
  .icon-style {
    font-size: 14px;
    transition: transform 0.1s;
    -moz-transition: transform 0.1s;	/* Firefox 4 */
    -webkit-transition: transform 0.1s;	/* Safari 和 Chrome */
    -o-transition: transform 0.1s;
    cursor: pointer;
  }
  .search-con {
    color: @primary-color;
  }
  .fs-12 {
    font-size: 12px;
  }
</style>
