<template>
  <div class="dynamic-box">
    <template v-if="hasPerm(54)">
      <h3 class="dy-title">人员类别范围</h3>
      <a-checkbox 
        :indeterminate="indeterminate"
        :checked="checkAll"
        @change="onCheckAllChange"
        class="dy-all-check">
        全选
      </a-checkbox>
      <a-checkbox-group 
        v-model="checkedList" 
        :options="plainOptions"
        @change="onChange" 
        class="dy-check-group">
        <template slot="label" slot-scope="option">
          {{option.name}}
        </template>
      </a-checkbox-group>
    </template>
    <h3 class="dy-title">更多设置</h3>
    <template v-if="hasPerm(55)">
      <div class="switch-box">
        <a-switch  :checked="checked"
          @change="onSwitchChange"
          style="margin-right: 20px;"/>
        <span>包含高管白名单人员</span>
      </div>
    </template>
  </div>
</template>
<script>
import {managementListPersonType, managementPersonType, managementBoss} from '@/api/auth-management'
let plainOptionsList = []
let comparisonList = []
export default {
  props: {
    id: {
      type: Number,
      default: null
    },
    haveBoss: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      checkedList: [],
      indeterminate: false,
      checkAll: false,
      plainOptions: [],
      checked: this.haveBoss === 1 ? true : false
    }
  },
  computed: {
    comparison: function() {
      let returnObj = {
        scopeId: this.id,
        addStr: '',
        delStr: '',
        saveStr: this.checkedList.join(',')
      }
      if(this.checkedList.length > comparisonList.length) {
        returnObj.addStr = this.checkedList.filter(item => {
          return !comparisonList.includes(item)
        }).join(',')
      } else if (this.checkedList.length < comparisonList.length) {
        returnObj.delStr = comparisonList.filter(item => {
          return !this.checkedList.includes(item)
        }).join(',')
      }
      return returnObj
    }
  },
  created() {
    this.managementListPersonType(1)
  },
  methods: {
    onChange(checkedList) {
      this.indeterminate = !!checkedList.length && checkedList.length < this.plainOptions.length
      this.checkAll = checkedList.length === this.plainOptions.length
      this.managementPersonType()
    },
    onCheckAllChange(e) {
      Object.assign(this, {
        checkedList: e.target.checked ?  plainOptionsList : [],
        indeterminate: false,
        checkAll: e.target.checked,
      })
      this.managementPersonType()
    },
    onSwitchChange(checked) {
      this.checked = checked
      let url = ''
      if (this.checked) {
        url = `enable/boss/${this.id}`
      } else {
        url = `disable/boss/${this.id}`
      }
      managementBoss(url).then(res => {
        if(res.data.code === 200) {
          this.$emit('on-have', this.checked ? 1 : 0)
        }
      })
      .catch(err => {
        console.log(err)
      })
    },
    managementListPersonType(origin) {
      const paramData = {
        id: this.id
      }
      managementListPersonType(paramData).then(res => {
        if(res.data.code === 200) {
          plainOptionsList = []
          this.checkedList = []
          comparisonList = []
          this.plainOptions = res.data.data
          for (let item of this.plainOptions) {
            plainOptionsList.push(item.value)
            if(item.isCheck === 1) {
              this.checkedList.push(item.value)
              comparisonList.push(item.value)
            }
          }
          if (origin === 1) {
            this.indeterminate = !!this.checkedList.length && this.checkedList.length < this.plainOptions.length
            this.checkAll = this.checkedList.length === this.plainOptions.length
          }
        }
      })
      .catch(err => {
        console.log(err)
      })
    },
    managementPersonType() {
      managementPersonType(this.comparison).then(res => {
        if(res.data.code === 200) {
          this.managementListPersonType()
        }
      })
      .catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .dynamic-box {
    padding: 0 20px;
    .dy-title {
      height: 30px;
      display: flex;
      align-items: center;
      border-left: 5px solid @primary-color;
      padding-left: 20px;
    }
    .dy-all-check {
      display: block;
      padding: 20px 0 20px 40px;
    }
    .dy-check-group {
      padding-left: 70px;
      padding-bottom: 20px;
    }
    .switch-box {
      padding: 20px 0 0 40px;
      display: flex;
      align-items: center;
    }
  }
</style>