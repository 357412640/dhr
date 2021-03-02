<template>
  <a-modal :visible.sync="rangeVisible" 
    title="修改适用范围"
    @ok="handleOk"
    @cancel="handelCancel"
    ok-text="保存"
    cancel-text="取消"
    width="700px">
    <a-radio-group v-model="valueRange">
      <a-radio :value="1">
        全员
      </a-radio>
      <a-radio :value="2">
        自定义适用范围
      </a-radio>
    </a-radio-group>
    <div class="search-box">
      <div v-show="valueRange === 1">
        <span>选择全员则默认所有员工可使用当前定义配置规则。</span><br>
        <span>若为地方性或特定部门适用配置，可通过自定义适用范围，选择对应管理范围进行配置</span>
      </div>
      <div v-show="valueRange === 2"
        class="search-box-2">
        <div class="search-left">
          <a-input-search style="margin-bottom: 8px" placeholder="请输入名称" @change="onChange" />
          <a-tree
            :expanded-keys="expandedKeys"
            :auto-expand-parent="autoExpandParent"
            :tree-data="treeData"
            :checkedKeys="checkedKeys"
            @expand="onExpand"
            checkable
            default-expand-all
            @check="onCheck"
            style="height: 300px; overflow: auto;"
            v-if="treeData.length"
          >
          <template slot="title" slot-scope="{ title }">
            <span v-if="title.includes(searchValue)">
              {{ title.substr(0, title.indexOf(searchValue)) }}
              <span style="color: #f50">{{ searchValue }}</span>
              {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
            </span>
            <span v-else>{{ title }}</span>
          </template>
          </a-tree>
          <div style="text-align: center;position: relative;top: 50%;transform: translate(0, -50%)"
            v-else>
            <img src="@/assets/images/no-data-default.png" alt="" width="101" height="72">
            <span>暂无数据</span>
          </div>
        </div>
        <div class="search-right">
          <a-input-search style="margin-bottom: 8px" placeholder="请输入名称" 
            v-model="query"/>
          <transition-group
            name="staggered-fade"
            tag="ul"
            v-bind:css="false"
            v-on:before-enter="beforeEnter"
            v-on:enter="enter"
            v-on:leave="leave"
            style="margin-top: 11px; height: 300px; overflow: auto;"
            v-if="computedList.length"
          >
            <li
              v-for="(item, index) in computedList"
              v-bind:key="item.applyId"
              v-bind:data-index="index"
              class="search-rig-li"
            >
              <span>{{ item.applyName }}</span>
              <a-icon type="close-circle" 
                theme="filled"
                class="sea-close-circle"
                @click="handleCircle(item, index)"/>
            </li>
          </transition-group>
          <div style="text-align: center;position: relative;top: 50%;transform: translate(0, -50%)"
            v-else>
            <img src="@/assets/images/no-data-default.png" alt="" width="101" height="72">
            <span>暂无数据</span>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>
<script>
import {managementScopeTree} from '@/api/auth-management.js'
import _ from 'lodash'
import Velocity from 'velocity-animate'
const generateData = (data, newData) => {
  for (const [index, item] of data.entries()) {
    newData.push(Object.assign(
      {},
      item,
      { scopedSlots: {
        title: 'title'
      }}))
    if (item.children) {
      generateData(item.children, newData[index]['children'] = [])
    }
  }
}
const dataList = []
let sortArr = []
const generateList = (data) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i]
    const key = node.key
    const title = node.title
    dataList.push({ key, title: title })
    sortArr.push(key)
    if (node.children) {
      generateList(node.children)
    }
  }
}
const getParentKey = (key, tree) => {
  let parentKey
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children)
      }
    }
  }
  return parentKey
}
const sortFunc = (propName, referArr) => {
  return (prev, next) => {
    return referArr.indexOf(prev[propName]) - referArr.indexOf(next[propName])
  }
}
export default {
  name: 'range-edit',
  props: {
    rangeVisible: {
      type: Boolean,
      default: false
    },
    applyRange: {
      type: Number,
      default: 1
    },
    applyList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      valueRange: this.applyRange,
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      treeData: [],
      query: '',
      list: [],
      checkedKeys: []
    }
  },
  watch: {
    applyList: {
      handler: function() {
        this.checkedKeys = []
        this.list = this.applyList
        this.list.forEach(item => {
          this.checkedKeys.push(item.applyId)
        })
      },
      deep: true
    },
    applyRange: function(newVal, oldVal) {
      this.valueRange = newVal
    }
  },
  computed: {
    computedList: function () {
      var vm = this
      return this.list.filter(function (item) {
        return item.applyName.toLowerCase().indexOf(vm.query.toLowerCase()) !== -1
      })
    }
  },
  created() {
    this.managementScopeTree()
  },
  methods: {
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onChange(e) {
      const value = e.target.value
      const expandedKeys = dataList
        .map((item) => {
          if (item.title.includes(value)) {
            return getParentKey(item.key, this.treeData)
          }
          return null
        })
        .filter((item, i, self) => item && self.indexOf(item) === i)
      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true,
      })
    },
    beforeEnter: function (el) {
      el.style.opacity = 0
      el.style.height = 0
    },
    enter: function (el, done) {
      var delay = el.dataset.index * 15
      setTimeout(function () {
        Velocity(
          el,
          { opacity: 1, height: '1.6em' },
          { complete: done }
        )
      }, delay)
    },
    leave: function (el, done) {
      var delay = el.dataset.index * 15
      setTimeout(function () {
        Velocity(
          el,
          { opacity: 0, height: 0 },
          { complete: done }
        )
      }, delay)
    },
    handleCircle(litem, index) {
      this.list.splice(index, 1)
      let that = this
      function recParentKey(item) {
        let parentKey = getParentKey(litem.applyId, that.treeData)
        let filterStr = `${Number(item) !== Number(litem.applyId) && Number(item) !== parentKey}`
        while(parentKey !== undefined) {
          parentKey = getParentKey(parentKey, that.treeData)
          if(parentKey !== undefined) {
            filterStr += ` && ${Number(item) !== parentKey}`
          }
        }
        return eval(filterStr)
      }
      this.checkedKeys = this.checkedKeys.filter(item => {
        return recParentKey(item)
      })
    },
    managementScopeTree() {
      managementScopeTree().then((res) => {
        if (res.data.code === 200) {
            this.treeData = []
            generateData(res.data.data, this.treeData)
            generateList(res.data.data)
          }
      }).catch((err) => {
        console.log(err)
      })
    },
    handleOk: _.debounce(function(e) {
      this.$emit('update:rangeVisible', false)
      this.$emit('update:applyRange', this.valueRange)
      if(this.valueRange === 1) {
        this.$emit('on-save', [])
      } else {
        this.$emit('on-save', this.list)
      }
    }, 1000, {
      'leading': true,
      'trailing': false
    }),
    handelCancel() {
      this.$emit('update:rangeVisible', false)
    },
    onCheck(checkedKeys, e) {
      // console.log('onCheck', checkedKeys, e)
      this.list = []
      this.checkedKeys = checkedKeys
      // 去除父节点
      let removeParentArr = Array.from(e.checkedNodes)
      removeParentArr.forEach((item, index) => {
        if(item.data.props.dataRef.children.length === 0) {
          this.list.push({
            applyName: item.data.props.dataRef.title,
            applyId: item.data.props.dataRef.key
          })
        }
      })
      // 按顺序排列
      this.list.sort(sortFunc('applyId', sortArr))
    }
  }
}
</script>
<style lang="less" scoped>
  .search-box {
    margin-top: 20px;
    background: #f5f5f5;
    padding: 15px;
    display: flex;
    width: 100%;
    border: 1px solid #e6e6e6;
    min-height: 372px;
    .search-box-2 {
      display: flex;
      width: 100%;
    }
    .search-left {
      width: 350px;
      margin-right: 15px;
    }
    .search-right {
      width: 350px;
      padding-left: 15px;
      border-left: 1px solid #e7e7e7;
      .search-rig-li {
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        .sea-close-circle {
          margin-right: 10px;
        }
        .sea-close-circle:hover {
          color: #fe4037;
        }
      }
    }
  }
</style>