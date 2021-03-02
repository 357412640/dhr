<template>
  <div class="tab3-content-box">
    <Button type="primary" style="margin-bottom: 10px" @click="showModal" v-if="hasPerm(63)">管理</Button>
    <div class="table-box">
      <Table :columns="columns" :data="data" stripe :loading="loading" :no-data-text="noData">
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

    <Modal
      title="可授权角色"
      v-model="modal"
      width="860"
      :styles="{top: '10%'}"
      :mask-closable="false"
      class-name="tab1-content-box-modal"
      @on-cancel="cancelModal"
      @on-ok="okModal"
      :loading=modalLoading
    >
      <div class="modal-box">
        <div class="left">
<!--          <Input placeholder="请输入名称" style="width: 100%" v-model.trim="treeLeftVal">-->
<!--            <Icon type="md-search" slot="prefix"/>-->
<!--          </Input>-->
          <template v-if="treeLeft && treeLeft.length">
            <Tree :data="treeLeft" show-checkbox @on-check-change="changeCheckbox" multiple
                  @change="leftTreeChange"></Tree>
          </template>
          <template v-else>
            <div style="text-align: center;position: relative;top: 50%;transform: translate(0, -50%)">
              <img :src="noDataDefault" alt="" width="101" height="72">
              <span>暂无数据</span>
            </div>
          </template>
        </div>
        <div class="right">
<!--          <Input placeholder="请输入名称" style="width: 100%" v-model.trim="treeRightVal" @change="rightTreeChange">-->
<!--            <Icon type="md-search" slot="suffix"/>-->
<!--          </Input>-->
          <template v-if="treeRight && treeRight.length">
            <Tree :data="treeRight" :render="renderContent" empty-text="" style="width: 99%;"></Tree>
          </template>
          <template v-else>
            <div style="text-align: center;position: relative;top: 50%;transform: translate(0, -50%)">
              <img :src="noDataDefault" alt="" width="101" height="72">
              <span>暂无数据</span>
            </div>
          </template>
        </div>
        <Spin size="large" fix v-if="spinShow"></Spin>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { authList, authTree, saveAuth } from '@/api/DHR/role'
  import { noData } from '@/libs/util'
  import noDataDefault from '@/assets/images/no-data-default.png'
  export default {
    name: "tab3-content",
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
        columns: [
          {
            align: 'center',
            tooltip: true,
            title: '角色编号',
            key: 'roleCode',
            minWidth: 160
          },
          {
            align: 'center',
            tooltip: true,
            title: '角色名称',
            key: 'roleName',
            minWidth: 160
          },
          {
            align: 'center',
            tooltip: true,
            title: '角色描述',
            key: 'remark',
            minWidth: 160
          },
          {
            align: 'center',
            tooltip: true,
            title: '状态',
            slot: 'status',
            minWidth: 160
          },
          {
            align: 'center',
            tooltip: true,
            title: '创建时间',
            key: 'createTime',
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
        modal: false,
        treeLeftVal: '',
        treeRightVal: '',
        treeLeft: [],
        treeRight: [],
        defaultTreeLeft: [],
        defaultTreeRight: [],
        beforeSearchTreeLeft: [],
        beforeSearchTreeLeftFlag: false,
        beforeSearchTreeRight: [],
        beforeSearchTreeRightFlag:  false,
        // 初始被选中的可授权角色 id
        checkedMenuIdArr: [],
        modalLoading: false,
        spinShow: false,
        noData,
        noDataDefault
      }
    },
    methods: {
      changePage(p = 1) {
        this.loading = true
        const data = {
          roleId: this.role.roleId,
          pageSize: this.pageInfo.pageSize,
          pageNum: p
        }
        authList(data).then(res => {
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
            this.$Message.warning(`可授权列表获取失败：${data.message}`)
          }
        }).finally(() => {
          this.loading = false
        })
      },
      renderContent(h, {root, node, data}) {
        return h('span', {
          style: {
            display: 'inline-block',
            width: '100%'
          }
        }, [
          h('span', [
            h('span', data.title)
          ]),
          h('span', {
            style: {
              display: 'inline-block',
              float: 'right',
              marginRight: '32px',
              height: '16px'
            }
          }, [
            h('Button', {
              props: Object.assign({}, this.buttonProps, {
                icon: 'md-close-circle',
                type: 'text'
              }),
              style: {
                padding: 0,
                fontSize: '16px',
                height: '16px'
              },
              on: {
                click: () => {
                  this.remove(root, node, data)
                }
              }
            })
          ])
        ])
      },
      // 左侧树添加
      changeCheckbox(val) {
        const treeRightObj = {}
        const treeRight = []
        const checkItem = {
          title: undefined,
          expand: true,
          children: []
        }
        val.forEach(menu => {
          if (menu.appName !== undefined) {
            // 如果可授权角色 所在应用存在则直接放到children中，没有就创建新的属性
            if (treeRightObj[menu.appName]) {
              treeRightObj[menu.appName].children.push(menu)
            } else {
              treeRightObj[menu.appName] = JSON.parse(JSON.stringify(checkItem))
              treeRightObj[menu.appName].title = menu.appName
              treeRightObj[menu.appName].children.push(menu)
            }
          }
        })
        const roleNameArr = Object.keys(treeRightObj)
        roleNameArr.forEach(app => {
          treeRight.push(treeRightObj[app])
        })
        this.treeRight = JSON.parse(JSON.stringify(treeRight))

        // 并入 搜索前 左右树
      },
      // 右侧树删除
      remove(root, node, data) {
        // 如果没有父节点，删除整个父节点树
        if (node.parent === undefined) {
          this.clear(root, node, data)
        } else {
          const parentKey = root.find(el => el === node).parent;
          const parent = root.find(el => el.nodeKey === parentKey).node;
          const index = parent.children.indexOf(data);
          parent.children.splice(index, 1);
          // 如果children.length === 0 ,则删除这个选中树
          if (parent.children.length === 0) {
            this.clear(root, node, data)
          }
        }
        // 整理左侧树结构对应数据
        // 获取所有被选中的子节点的roleIds
        let count = 0
        let childrenArr = this.treeRight.reduce((pro, cur) => {
          return pro.concat(cur.children)
        }, [])
        childrenArr = childrenArr.map(menu => {
          return menu.roleId
        })
        const treeLeft = []
        for (let i = 0; i < this.treeLeft.length; i++) {
          let app = this.treeLeft[i]
          let children = []
          for (let j = 0; j < app.children.length; j++) {
            const item = app.children[j]
            if (childrenArr.includes(item.roleId)) {
              count++
              item.checked = true
              item.isCheck = 1
            } else {
              app.checked = false
              item.checked = false
              item.isCheck = 2
            }
            children.push(item)
          }
          app.children = children
          treeLeft.push(app)
          if (count === childrenArr.length) break
        }
        this.treeLeft = treeLeft

        // 并入 搜索前 左右树
        if (!this.treeLeftVal) {
          // this.beforeSearchTreeLeft
        }
        if (!this.treeRightVal) {
          // this.beforeSearchTreeRight
        }
      },
      clear(root, node, data) {
        // 根据对应 的title 删除这个对象
        for (let i = 0; i < this.treeRight.length; i++) {
          const app = this.treeRight[i]
          if (data.title === app.title || (app.children.length === 0)) {
            this.treeRight.splice(i, 1)
            const clearApp = JSON.parse(JSON.stringify(this.treeLeft[i]))
            clearApp.indeterminate = false
            this.treeLeft.splice(i, 1, clearApp)
          }
        }
      },
      showModal() {
        this.modal = true
        this.spinShow = true
        this.authTree()
      },
      cancelModal() {
        // 清空搜索框
        this.treeLeftVal = ''
        this.treeRightVal = ''
        // 恢复默认数据
        this.treeLeft = JSON.parse(JSON.stringify(this.defaultTreeLeft))
        this.treeRight = JSON.parse(JSON.stringify(this.defaultTreeRight))
        this.modal = false
      },
      okModal() {
        this.modalLoading = true
        // 保存的 删除的 新增的 roleId
        // 右侧树 保存的 根据 初始的数据 比较 删除和新增
        const delGroup = this.checkedMenuIdArr
        let addGroup = this.treeRight.reduce((pro, cur) => {
          return pro.concat(cur.children)
        }, [])
        addGroup = addGroup.map(menu => {
          return menu.roleId
        })
        const saveGroup = JSON.parse(JSON.stringify(addGroup))
        // 遍历 初始 数据， 如果保存数据有，则都删除， 默认剩下的就是删除的， 保存剩下的就是新增的
        delGroup.forEach((roleId, i) => {
          if (addGroup.includes(roleId)) {
            delGroup.splice(i, 1)
            addGroup.splice(addGroup.indexOf(roleId), 1)
          }
        })
        const data = {
          roleId: this.role.roleId,
          delGroup,
          addGroup,
          saveGroup
        }
        saveAuth(data).then(res => {
          const data = res.data
          if (data.code === 200) {
            this.modal = false
            this.$Message.success(`可授权角色保存成功：${data.message}`)
            this.changePage()
          } else {
            this.$Message.warning(`可授权角色保存失败：${data.message}`)
          }
        }).finally(() => {
          this.modalLoading = false
        })
      },
      authTree() {
        // 获取可授权角色树， 初始化树结构， 并保存 被勾选的roleId
        authTree(this.role.roleId).then(res => {
          const data = res.data
          if (data.code === 200) {
            const tree = JSON.parse(JSON.stringify(data.data))
            const roleNameArr = Object.keys(tree)
            // 左侧可授权角色树 数据初始化
            const menuList = []
            // 右侧被选中 数据初始化
            const checkMenuList = []
            // 被勾选的menu
            const checkedMenuIdArr = []
            roleNameArr.forEach(roleName => {
              const item = {
                expand: true
              }
              const checkItem = {
                title: undefined,
                expand: true,
                children: []
              }
              const app = JSON.parse(JSON.stringify(tree[roleName]))
              app.forEach(item => {
                item.title = item.roleName
                if (item.isCheck === 1) {
                  item.checked = true
                  checkItem.title || (checkItem.title = item.appName)
                  checkItem.children.push(JSON.parse(JSON.stringify(item)))
                  checkedMenuIdArr.push(item.roleId)
                } else {
                  item.checked = false
                }
              })
              item.title = roleName
              item.children = app
              menuList.push(item)
              if (checkItem.title) {
                checkMenuList.push(checkItem)
              }
            })
            this.treeLeft = menuList
            this.treeRight = checkMenuList
            this.checkedMenuIdArr = checkedMenuIdArr
            // 保存当前原始数据 取消使用
            this.defaultTreeLeft = JSON.parse(JSON.stringify(menuList))
            this.defaultTreeRight = JSON.parse(JSON.stringify(checkMenuList))
          } else {
            this.$Message.warning(`可授权角色数据获取失败：${data.message}`)
          }
        }).finally(() => {
          this.spinShow = false
        })
      },
      leftTreeChange(val) {
        if (!this.beforeSearchTreeLeftFlag) {
          this.beforeSearchTreeLeft = JSON.parse(JSON.stringify(this.treeLeft))
          this.beforeSearchTreeLeftFlag = true
        }

      },
      rightTreeChange(val) {
        if (!this.beforeSearchTreeRightFlag) {
          this.beforeSearchTreeRight = JSON.parse(JSON.stringify(this.treeRight))
          this.beforeSearchTreeRightFlag = true
        }
      }
    },
    mounted() {
      this.changePage()
    }
  }
</script>

<style lang="less" scoped>
  .tab3-content-box {
    padding: 0 16px 20px 23px;
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
  }
  .modal-box {
    height: 360px;
    border-radius: 5px;
    border: 1px solid #dcdee2;
    margin: 0 10px;
    display: flex;
    position: relative;

    .left {
      width: 50%;
      height: 100%;
      border-right: 1px solid #dcdee2;
      padding: 15px;
    }

    .right {
      width: 50%;
      height: 100%;
      padding: 15px;
      overflow-x: auto;
    }
  }
</style>
<style lang="less">
  .tab3-content-box-modal {
    .ivu-icon.ivu-icon-md-close-circle {
      vertical-align: initial;
      height: 16px;
      position: relative;
      top: -6px;
    }

    .ivu-btn-text:focus {
      -webkit-box-shadow: none;
      box-shadow: none;
    }
  }
</style>
