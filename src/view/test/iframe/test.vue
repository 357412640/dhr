<template>
  <div class="app-list">
    <p>
      <span>考情管理 ></span>
      <span> 基础设置 ></span>
      <span style="color: #FE4037"> 假期日历</span>
    </p>
    <div class="box">
      <div class="title-box">
        <span class="left">测试</span>
        <Button type="primary" style="float: right;" @click="createApp">新建应用</Button>
      </div>
      <div class="search-box">
        <Form ref="formCustom" :model="formCustom" :label-width="100">
          <Row>
            <Col span="5">
              <FormItem label="应用名称" :label-width="60">
                <Input v-model="formCustom.name" type="text"></Input>
              </FormItem>
            </Col>
            <Col span="5">
              <FormItem label="应用包名">
                <Input v-model="formCustom.package_name" type="text"></Input>
              </FormItem>
            </Col>
            <Col span="5">
              <FormItem label="状态">
                <Select v-model="formCustom.status">
                  <Option :value="-1">全部</Option>
                  <Option :value="1">已上架</Option>
                  <Option :value="2">待上架</Option>
                  <Option :value="3">已下架</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="3">
              <FormItem :label-width="0" style="text-align: center;">
                <Button type="primary" @click="handleSubmit">搜索</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <Button type="primary" @click="appSort">应用排序</Button>
      <div class="app-list">
        <Table stripe border :loading="loading" :columns="table_columns" :data="table_data" style="margin-top: 10px">
          <template slot-scope="{ row, index }" slot="icon">
            <img :src="row.icon" alt="icon" width="60px" height="60px" style="margin: 10px;">
          </template>
          <template slot-scope="{ row, index }" slot="operate">
            <Button type="text" @click="editApp(row.id)" style="margin-right: 10px">编辑</Button>
            <Button type="text" @click="appUpOrDown(row, 3)" v-if="row.status === 1">下架</Button>
            <Button type="text" @click="appUpOrDown(row, 1)" v-else>上架</Button>
          </template>
          <template slot-scope="{ row, index }" slot="status">
            <p class="c-19be6b" v-if="row.status === 1">已上架</p>
            <p class="c-ff9900" v-else-if="row.status === 2">待上架</p>
            <p v-else>已下架</p>
          </template>
          <template slot-scope="{ row, index }" slot="updated_time">
            <span>{{ setTime(row.updated_time) }}</span>
          </template>
        </Table>
        <div style="margin: 10px;overflow: hidden">
          <div style="float: right;">
            <Page :page-size="pageInfo.page_size" :total="pageInfo.total" :current="pageInfo.current"
                  @on-change="changePage"></Page>
          </div>
        </div>
      </div>
    </div>
    <Drawer :closable="false" width="640" v-model="value4">
      <div class="demo-drawer-profile">
        <Row>
          <Col span="12">
            Full Name: Aresn
          </Col>
          <Col span="12">
            Account: aresn@aresn.com
          </Col>
        </Row>
        <Row>
          <Col span="12">
            City: BeiJing
          </Col>
          <Col span="12">
            Country: China
          </Col>
        </Row>
        <Row>
          <Col span="12">
            Birthday: May 14, 1991
          </Col>
          <Col span="12">
            Website: <a href="https://dev.iviewui.com" target="_blank">https://dev.iviewui.com</a>
          </Col>
        </Row>
        Message: Hello, Developer
      </div>
      <Divider />
      <div class="demo-drawer-profile">
        <Row>
          <Col span="12">
            Position: Programmer
          </Col>
          <Col span="12">
            Responsibilities:Coding
          </Col>
        </Row>
        <Row>
          <Col span="12">
            Department: Map visualization
          </Col>
        </Row>
        Skills:C / C + +, data structures, software engineering, operating systems, computer networks, databases, compiler theory, computer architecture, Microcomputer Principle and Interface Technology, Computer English, Java, ASP, etc.
      </div>
      <Divider />
      <div class="demo-drawer-profile">
        <Row>
          <Col span="12">
            Email: admin@aresn.com
          </Col>
          <Col span="12">
            Phone Number: +86 18888888888
          </Col>
        </Row>
        <Row>
          <Col span="12">
            GitHub: <a href="https://github.com/view-design/ViewUI" target="_blank">https://github.com/view-design/ViewUI</a>
          </Col>
        </Row>
      </div>
    </Drawer>
  </div>
</template>

<script>
  import './index.less'
  import {getAppList, getAppSort, saveAppSort, upOrDown} from '@/api/appShop-data'
  import DragList from '_c/drag-list'
  import {resetTime} from '@/libs/util'
  export default {
    data() {
      return {
        value4: false,
        modalShow: false,
        formCustom: {
          title: '',
          name: '',
          status: ''
        },
        loading: false,
        table_columns: [
          {
            title: '应用图表',
            slot: 'icon',
            align: 'center',
            width: 180
          },
          {
            title: '应用名称',
            key: 'name',
            align: 'center',
            minWidth: 180
          },
          {
            title: '应用包名',
            key: 'package_name',
            align: 'center',
            minWidth: 180
          },
          {
            title: '最新版本',
            key: 'version_code',
            align: 'center',
            minWidth: 140
          },
          {
            title: '状态',
            slot: 'status',
            align: 'center',
            width: 120
          },
          {
            title: '更新时间',
            slot: 'updated_time',
            align: 'center',
            minWidth: 200
          },
          {
            title: '操作',
            slot: 'operate',
            align: 'center',
            width: 180
          }
        ],
        table_data: [],
        pageInfo: {},
        searchInfo: {},
        listData: [],
        upOrDownTitle: '',
        upOrDownShow: false,
        upOrDownData: {}
      }

    },
    mounted() {
      this.handleSubmit()
    },
    activated() {
      this.handleSubmit()
    },
    methods: {
      handleSubmit() {
        this.searchInfo.name = this.formCustom.name
        this.searchInfo.package_name = this.formCustom.package_name
        this.searchInfo.status = this.formCustom.status === -1 ? '' : this.formCustom.status
        this.changePage(1)
      },
      changePage(p) {
        this.loading = true
        let params = this.searchInfo
        params.page = p
        getAppList(params).then((res) => {
          let data = res.data
          if (data.errno === 10000) {
            this.loading = false
            this.pageInfo.total = data.data.total
            this.pageInfo.page_size = data.data.page_size
            this.pageInfo.current = data.data.page
            this.table_data = data.data.list

          } else {
            this.$Modal.warning({
              title: '应用列表获取失败',
              content: `原因：${data.errmsg}`
            })
          }
        })
      },
      createApp() {
        this.value4 = true
      },
      editApp(id) {
        this.$router.push({
          path: `/view/app-shop/app-edit#${id}`
        })
      },
      appSort() {
        this.listData = []
        // 获取排序列表，渲染新的排序
        this.modalShow = true
        getAppSort().then(res => {
          let data = res.data
          if (data.errno === 10000) {
            this.listData = data.data
          } else {
            this.$Modal.warning({
              title: '排序列表获取失败',
              content: `原因：${data.errmsg}`
            })
          }
        })
      },
      appUpOrDown(row, action) {
        let data = {
          row,
          action
        }
        this.upOrDownData = data
        this.upOrDownShow = true
        if (action === 1) {
          this.upOrDownTitle = '上架'
        } else {
          this.upOrDownTitle = '下架'
        }

      },
      upOrDownApp() {
        let data = {
          id: this.upOrDownData.row.id,
          action: this.upOrDownData.action
        }
        upOrDown(data).then(res => {
          let data = res.data
          if (data.errno === 10000) {
            this.$Message.success('操作成功')
            this.upOrDownShow = false
            let page = this.pageInfo.page
            this.changePage(page)
          } else {
            this.$Modal.warning({
              title: '操作失败',
              content: `原因：${data.errmsg}`
            })
          }
        }).catch(e => {
          console.log(e)
        })
      },
      handleDrag({src, target, oldIndex, newIndex}) {
        // console.log(src, target, oldIndex, newIndex)
        // console.log(this.listData)
      },
      setSort() {
        // 保存新的排序
        let id = []
        this.listData.forEach(item => {
          id.push(item.app_id)
        })
        id = id.join(',')
        let data = {
          id
        }
        saveAppSort(data).then(res => {
          let data = res.data
          if (data.errno === 10000) {
            this.$Message.success('排序保存成功')
            this.modalShow = false
          } else {
            this.$Modal.warning({
              title: '排序保存失败',
              content: `原因：${data.errmsg}`
            })
          }
        })
      },
      setTime(time) {
        return resetTime(time)
      }
    }
  }
</script>
<style lang="less" scoped>
  .box {
    background-color: #fff;

  }
</style>

