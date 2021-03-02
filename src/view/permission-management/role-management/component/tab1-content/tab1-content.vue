<template>
  <div class="tab1-content-box">
    <Button type="primary" style="margin-bottom: 10px" @click="showModal">菜单管理</Button>
    <Table :columns="columns" :data="data" stripe :loading="loading" :no-data-text="noData">
      <template slot-scope="{ row, index}" slot="operate">
        <div class="operate-box">
          <template v-for="item in row.menuList">
            <Checkbox v-model="item.isCheck" class="operate-item" :key="item.menuId"
                      @on-change="checkChange(item.isCheck, item)">
              <span>{{ item.menuName }}</span>
            </Checkbox>
          </template>
        </div>
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
    <Modal
      title="菜单管理"
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
  import {getAppMenuList, saveMenuList, cancelMenuList, appMenuList, saveAppMenuList} from '@/api/DHR/role'
  import { noData } from '@/libs/util'
  import noDataDefault from '@/assets/images/no-data-default.png'
  export default {
    name: "tab1-content",
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
            title: '所属应用',
            key: 'appName',
            width: 140
          },
          {
            align: 'center',
            title: '菜单名称',
            key: 'menuName',
            width: 140
          },
          {
            align: 'center',
            tooltip: true,
            title: '菜单描述',
            key: 'remark',
            minWidth: 200
          },
          {
            align: 'center',
            tooltip: true,
            title: '菜单路径',
            key: 'url',
            minWidth: 160
          },
          {
            align: 'center',
            title: '功能权限',
            slot: 'operate',
            width: 440
          }
        ],
        data: [],
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
        pageInfo: {
          pageSize: 10,
          total: 0,
          pageNum: 1
        },
        // 初始被选中的菜单 id
        checkedMenuIdArr: [],
        modalLoading: false,
        spinShow: false,
        noData,
        noDataDefault,
        flag: false
      }
    },
    methods: {
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
        this.treeRight = this.initRightTree(this.treeLeft)
      },
      // 右侧树删除
      remove(root, node, data) {
        this.flag = false
        let menuId = data.menuId
        if (!menuId) {
          this.clear(root, node, data)
        } else {
          let leftTree = this.treeLeft
          for (let i = 0; i < leftTree.length; i++) {
            let app = leftTree[i]
            app.checked = false
            delete app.indeterminate
            if (app.children && app.children.length) {
              const result = this.removeLeftChild(app, menuId)
              leftTree[i] = result
              if (this.flag) {
                leftTree[i].checked = false
                leftTree[i].expand = true
                delete leftTree[i].indeterminate
              }
            }
          }
          this.treeLeft = JSON.parse(JSON.stringify(leftTree))
          this.$nextTick(() => {
            this.treeRight = this.initRightTree(this.treeLeft)
          })
        }
      },
      clear(root, node, data) {
        // 根据对应 的title 删除这个对象
        for (let i = 0; i < this.treeRight.length; i++) {
          const app = this.treeRight[i]
          if (data.title === app.title || (app.children.length === 0)) {
            this.treeRight.splice(i, 1)
          }
        }
        for (let i = 0; i < this.treeLeft.length; i++) {
          const app = this.treeLeft[i]
          if (data.title === app.title || (app.children.length === 0)) {
            let clearApp = JSON.parse(JSON.stringify(this.treeLeft[i]))
            clearApp.indeterminate = false
            clearApp.checked = false
            if (clearApp.children && clearApp.children.length) {
              clearApp = this.removeChild(clearApp)
            }
            this.treeLeft.splice(i, 1, clearApp)
          }
        }
      },
      removeLeftChild(data, menuId) {
        let tree = data
        for (let i = 0; i < tree.children.length; i++) {
          let item = tree.children[i]
          if (item.menuId === menuId) {
            tree.children[i].checked = false
            delete tree.children[i].indeterminate
            this.flag = true
            if (item.children && item.children.length) {
              item = this.removeChild(item)
            }
          } else if (item.children && item.children.length) {
            const result = this.removeLeftChild(item, menuId)
            tree.children[i] = result
            if (this.flag) {
              item.checked = false
              item.expand = true
              delete item.indeterminate
            }
          }
        }
        return tree
      },
      removeChild(tree) {
        for (let i = 0; i < tree.children.length; i++) {
          let children = tree.children[i]
          children.checked = false
          delete children.indeterminate
          if (children.children && children.children.length) {
            children = this.removeChild(children)
          }
        }
        return tree
      },
      showModal() {
        this.modal = true
        this.spinShow = true
        this.appMenuList()
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
        // 保存的 删除的 新增的 menuId
        // 右侧树 保存的 根据 初始的数据 比较 删除和新增
        const delMenu = JSON.parse(JSON.stringify(this.checkedMenuIdArr))
        let addMenu = this.treeRight.reduce((pro, cur) => {
          return pro.concat(cur.children)
        }, [])
        let subAddMenu = addMenu.reduce((pro, cur) => {
          if (cur.children && cur.children.length) {
            return pro.concat(cur.children)
          } else {
            return pro
          }
        }, [])
        addMenu = addMenu.concat(subAddMenu).map(menu => {
          if (menu.menuId || menu.menuId === 0) {
            return menu.menuId
          }
        })
        const saveMenu = JSON.parse(JSON.stringify(addMenu))
        // 遍历 初始 数据， 如果保存数据有，则都删除， 默认剩下的就是删除的， 保存剩下的就是新增的
        let index = 0
        while(delMenu.length && delMenu[index]){
          let menuId = delMenu[index]
          if (addMenu.includes(menuId)) {
            delMenu.splice(index, 1)
            index--
            addMenu.splice(addMenu.indexOf(menuId), 1)
          }
          index++
        }
        const data = {
          roleId: this.role.roleId,
          delMenu,
          addMenu,
          saveMenu
        }
        saveAppMenuList(data).then(res => {
          const data = res.data
          if (data.code === 200) {
            this.modal = false
            this.$Message.success('菜单保存成功')
            this.changePage()
          } else {
            this.$Message.warning(`菜单保存失败：${data.message}`)
          }
        }).finally(() => {
          this.modalLoading = false
        })
      },
      changePage(p = 1) {
        this.data = []
        this.loading = true
        const data = {
          roleId: this.role.roleId,
          pageSize: this.pageInfo.pageSize,
          pageNum: p
        }
        getAppMenuList(data).then(res => {
          const data = res.data
          if (data.code === 200) {
            const list = JSON.parse(JSON.stringify(data.data.list))
            if (list && list.length) {
              list.map(item => {
                const menuList = item.menuList || []
                menuList.map(menu => {
                  menu.isCheck = menu.isCheck === 1
                })
              })
              this.data = list
            }
            this.pageInfo.pageNum = data.data.pageNum || 1
            this.pageInfo.pageSize = data.data.pageSize
            this.pageInfo.total = data.data.total
          } else {
            this.$Message.warning(`菜单列表获取失败：${data.message}`)
          }
        }).finally(() => {
          this.loading = false
        })
      },
      // 菜单列表中某菜单的功能添加或删除
      checkChange(isCheck, menu) {
        let fetch
        if (isCheck) {
          fetch = saveMenuList
        } else {
          fetch = cancelMenuList
        }
        const data = {
          roleId: this.role.roleId,
          menuId: menu.menuId
        }
        this.loading = true
        fetch(data).then(res => {
          const data = res.data
          if (data.code === 200) {
            this.changePage(this.pageInfo.pageNum)
            this.$Message.success('操作成功')
          } else {
            menu.isCheck = !isCheck
            this.$Message.warning(`操作失败：${data.message}`)
          }
        }).finally(() => {
          this.loading = false
        })
      },
      appMenuList() {
        this.treeLeft = []
        this.treeRight = []
        this.defaultTreeLeft = []
        this.defaultTreeRight = []
        this.checkedMenuIdArr = []
        // 获取菜单树， 初始化树结构， 并保存 被勾选的menuId
        appMenuList(this.role.roleId).then(res => {
          const data = res.data
          if (data.code === 200) {
            const tree = JSON.parse(JSON.stringify(data.data))

            // 左侧菜单树 数据初始化
            const menuList = this.initLeftTree(tree)
            // 右侧被选中 数据初始化
            this.$nextTick(() => {
              const checkMenuList = this.initRightTree(menuList)
              this.treeLeft = menuList
              this.treeRight = checkMenuList
              // 保存当前原始数据 取消使用
              this.defaultTreeLeft = JSON.parse(JSON.stringify(menuList))
              this.defaultTreeRight = JSON.parse(JSON.stringify(checkMenuList))
            })


          } else {
            this.$Message.warning(`菜单管理数据获取失败：${data.message}`)
          }
        }).finally(() => {
          this.spinShow = false
        })
      },
      initLeftTree(tree) {
        const menuList = []
        const appNameArr = Object.keys(tree)
        appNameArr.forEach(appName => {
          const item = {
            expand: true
          }
          const app = this.initLeftChild(tree[appName])

          item.title = appName
          item.children = app
          menuList.push(item)
        })
        return menuList
      },
      initLeftChild(data) {
        const app = JSON.parse(JSON.stringify(data))
        app.forEach(item => {
          item.title = item.menuName
          if (item.isCheck === 1) {
            if (item.menuId || item.menuId === 0) {
              this.checkedMenuIdArr.push(item.menuId)
            }
          }
          if (item.children && item.children.length) {
            item.children = this.initLeftChild(item.children)
          } else {
            if (item.isCheck === 1) {
              item.checked = true
            } else {
              item.checked = false
            }
          }
        })
        return app
      },
      initRightTree(tree) {
        // 右侧被选中 数据初始化
        const checkMenuList = []
        const app = JSON.parse(JSON.stringify(tree))
        app.forEach(item => {
          const checkItem = {
            title: undefined,
            expand: true,
            children: []
          }
          if (item.children || item.children.length) {
            checkItem.title || (checkItem.title = item.title)
            checkItem.children = this.initRightChild(item.children)
          }
          if (checkItem.title && checkItem.children && checkItem.children.length) {
            checkMenuList.push(checkItem)
          }
        })
        return checkMenuList
      },
      initRightChild(data) {
        if (!data || !data.length) return []
        const checkMenuList = []
        const app = JSON.parse(JSON.stringify(data))
        app.forEach(item => {
          item.children = this.initRightChild(item.children)
          if (item.checked || item.indeterminate) {
            checkMenuList.push(item)
          } else if (item.children.length) {
            checkMenuList.push(item)
          }
        })
        return checkMenuList
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
    },
    activated() {
      this.changePage()
    }
  }
</script>

<style lang="less" scoped>
  .tab1-content-box {
    padding: 0 16px 20px 23px;
    height: 100%;

    .operate-box {
      display: flex;
      flex-wrap: wrap;
      .operate-item {
        margin: 10px 10px;
      }
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
      overflow: auto;
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
  .tab1-content-box-modal {
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
