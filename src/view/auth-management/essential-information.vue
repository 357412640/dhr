<template>
  <div class="essential-box">
    <div class="search-left">
      <h3 class="dy-title">基本信息</h3>
      <a-descriptions :column="1"
        class="essential-desc">
        <a-descriptions-item label="编码">
          {{info.code}}
        </a-descriptions-item>
        <a-descriptions-item label="说明">
          <a-tooltip v-if="info.desc && info.desc.length > 13">
            <template slot="title">
              {{info.desc}}
            </template>
            <div class="desc">{{info.desc}}</div>
          </a-tooltip>
          <div v-else>{{info.desc}}</div>
        </a-descriptions-item>
        <a-descriptions-item label="创建用户">
          {{info.gmtCreateEmplid}}
        </a-descriptions-item>
        <a-descriptions-item label="创建时间">
          {{info.gmtCreate}}
        </a-descriptions-item>
        <a-descriptions-item label="更新用户">
          {{info.gmtModifiedEmplid}}
        </a-descriptions-item>
        <a-descriptions-item label="更新时间">
          {{info.gmtModified}}
        </a-descriptions-item>
      </a-descriptions>
    </div>
    <div class="search-right">
      <h3 class="dy-title">操作记录</h3>
      <a-timeline class="essential-timeline">
        <a-timeline-item v-for="(item, index) in logList"
          :key="item.id"
          :color="getColor(index)">
          {{item.gmtCreate}} {{item.gmtCreateUser}} {{item.log}}
        </a-timeline-item>
        
      </a-timeline>
    </div>
  </div>
</template>
<script>
import {managementEmpLogList} from '@/api/auth-management'
export default {
  props: {
    info: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      logList: []
    }
  },
  computed: {
    getColor: function() {
      return function(index) {
        if(index === 0) {
          return 'green'
        } else {
          return '#f5a623'
        }
      }
    }
  },
  created() {
    this.managementEmpLogList()
  },
  methods: {
    managementEmpLogList() {
      managementEmpLogList(this.info.id).then(res => {
        if(res.data.code === 200) {
          this.logList = res.data.data
        }
      })
      .catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
<style lang="less">
  .essential-timeline .ant-timeline-item-content {
    margin-left: 25px;
  }
  .essential-desc .ant-descriptions-row:nth-of-type(2) {
    .ant-descriptions-item {
      display: flex;
      .ant-descriptions-item-content {
        width: calc(~'100% - 42px');
      }
    }
  }
</style>
<style lang="less" scoped>
  .essential-box {
    padding: 0 20px 20px 20px;
    display: flex;
    .dy-title {
      height: 28px;
      display: flex;
      align-items: center;
      border-left: 5px solid @primary-color;
      padding-left: 20px;
    }
    .search-left {
      width: 360px;
      .essential-desc {
        padding-left: 25px;
        padding-top: 15px;
      }
    }
    .search-right {
      padding-left: 20px;
      border-left: 1px solid #e7e7e7;
      width: calc(~'100% - 360px');
      .essential-timeline {
        padding-top: 15px;
        margin-left: -2px;
      }
    }
  }
  .desc {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>