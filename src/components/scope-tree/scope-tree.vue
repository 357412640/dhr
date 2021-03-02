<template>
  <div>
    <Row>
      <Col>
        <RadioGroup v-model="formData.applyRange" @on-change="changeRangeSel">
          <Radio label="1">全员</Radio>
          <Radio label="2">自定义适用范围</Radio>
        </RadioGroup>
      </Col>
    </Row>
    <Row v-if="allSel">
      <Col>
        <div style="height: 240px;border-radius: 4px;border: 1px solid #D9D9D9;background: #F5F5F5;padding:12px;margin-top:10px">
          <span>选择全员则默认所有员工可使用当前假期日历</span><br>
          <span>若假期日历包含地方性法规约定的地方性法定节假日，如：古尔邦节，可通过自定义适用范围，选择对应管理范围进行设置</span>
        </div>
      </Col>
    </Row>
    <Row v-if="partSel">
        <div style="height: 240px;border-radius: 4px;border: 1px solid #D9D9D9;background: #F5F5F5;padding:12px;margin-top:10px">
            <Col span="12" style="border-right:1px solid #E6E6E6FF">
              <Input prefix="ios-search" placeholder="请输入名称" style="width: auto" v-model="treeSearch" @on-change="getScopeTree()" />
              <Tree :data="data2" ref="tree" @on-check-change="selNode" show-checkbox style="height:180px;overflow-y:auto;margin-right:10px"></Tree>
            </Col>
            <Col span="12">
              <Input v-model="seledTree" prefix="ios-search" placeholder="请输入名称" style="width: auto;margin-left:20px;" />
              <div style="margin-left:20px;padding-top:6px;height:180px;overflow-y:auto;">
                <div v-for="item in formData.applyList" v-if="item.applyName.indexOf(seledTree) !== -1">
                  <span style="float:left">{{item.applyName}}</span>
                  <!-- <Icon type="md-close-circle" size=16 color="#FE4037" style="float:right" @click="delNode(item.applyId)" /> -->
                  <br>
                </div>
              </div>
            </Col>
        </div>
    </Row>
    <Row style='margin-top:10px;margin-bottom:-10px'>
      <Col span='3' offset='21'>
        <Button type="primary" @click="confTree">确定</Button>
      </Col>
    </Row>
  </div>
</template>

<script>
  import { getScopeTree } from '@/api/calendar-data'
  export default {
    name: "scope-tree",
    data() {
      return {
        treeSearch: '',
        seledTree: '',
        changeRange: false,
        allSel: true,
        partSel: false,
        selStr: this.selStrp,
        data2: [],
        formData: {
          applyRange: this.applyRange,
          applyList: this.applyList
        }
      }
    },
    props: {
      applyRange: {
        type: String,
        default: '1'
      },
      applyList: {
        type: Array,
        default: []
      },
      selStrp: {
        type: String,
        default: ''
      },
    },
    methods: {
      getScopeTree () {
        console.log(this.applyRange)
        console.log(this.applyList)
        console.log(this.selStr)
        let data = {}

        getScopeTree(data).then(res => {
          let data = res.data
          if (data.code === 200) {
            let treeData = this.setTreeData(data.data)
            this.data2 = treeData['nodes']
          } else {
            this.$Message.error('更新失败：' + data.message)
          }
        })
      },
      setTreeData(list) {
        let nodes = []
        let flag = true

        if (this.treeSearch) {
          flag = false
        }

        for (let i = 0; i < list.length; i++) {
          let flagc = false
          let node = {}

          node['title'] = list[i]['title']
          node['id'] = list[i]['key']
          node['expand'] = true

          // 判断是否选中
          node['checked'] = false
          if (this.selStr.indexOf(',' + list[i]['key'] + ',') != -1) {
            node['checked'] = true
          }

          if (list[i]['children'].length > 0) {
            let res = this.setTreeData(list[i]['children'])
            node['children'] = res['nodes']

            flagc = res['flag']
          }

          let flagp = false
          if (this.treeSearch && node['title'].indexOf(this.treeSearch) != -1) {
            flagp = true
          }

          if (flagp || flagc) {
            flag = true
          }

          if (flag) {
            nodes.push(node)
          }
        }

        let back = {}
        back['flag'] = flag
        back['nodes'] = nodes

        return back
      },
      selNode() {
        let nodes = this.$refs.tree.getCheckedNodes()

        let applyList = []
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i]['id']) {
            applyList.push({
              applyId: nodes[i]['id'],
              applyName: nodes[i]['title']
            })
          }
        }
        this.formData.applyList  = applyList

        if (applyList) {
          let strTmp = ','
          for (let i = 0; i < applyList.length; i++) {
            strTmp += applyList[i]['applyId'] + ','
          }
          this.selStr = strTmp
        }
      },
      delNode(id) {
        let strTmp = ','
        let list = this.formData.applyList

        for (let i = 0; i < list.length; i++) {
          if (id == list[i]['applyId']) {
            list.splice(i, 1)
          } else {
            strTmp += list[i]['applyId'] + ','
          }
        }

        this.selStr = strTmp

        this.getScopeTree()
      },
      changeRangeSel (val) {
        console.log(this.applyRange)
        console.log(this.applyList)
        if (val == '1') {
          this.allSel = true
          this.partSel = false
        } else {
          this.allSel = false
          this.partSel = true
          this.getScopeTree()
        }
      },
      confTree() {
        this.$emit("confTree", this.formData)
      }
    },
    mounted() {
      console.log(8)
      // this.getScopeTree()
      this.changeRangeSel(this.formData.applyRange)
    }
  }
</script>
