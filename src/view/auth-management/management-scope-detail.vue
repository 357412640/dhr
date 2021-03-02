<template>
  <div class="scope-detail">
    <a-page-header
      style="borderBottom: 1px solid #e6e6e6;"
      :title="info.name"
      @back="handleBack"
    >
    </a-page-header>
    <div class="scope-content">
      <a-descriptions :column="5"
        class="scope-detail-descriptions">
        <a-descriptions-item label="编码">
          {{info.code}}
        </a-descriptions-item>
        <a-descriptions-item label="状态">
          <span class="icon-circular"
            :style="info.status ? 'background: #00d211;' : 'background: #e99882;'"></span>
            {{info.status ? '启用' : '停用'}}
        </a-descriptions-item>
        <!-- <a-descriptions-item label="创建用户">
          {{info.gmtCreateEmplid}}
        </a-descriptions-item> -->
        <a-descriptions-item label="创建时间">
          {{info.gmtCreate}}
        </a-descriptions-item>
        <!-- <a-descriptions-item label="更新用户">
          {{info.gmtModifiedEmplid}}
        </a-descriptions-item>
        <a-descriptions-item label="更新时间">
          {{info.gmtModified}}
        </a-descriptions-item> -->
        <a-descriptions-item label="说明">
          <a-tooltip v-if="info.desc && info.desc.length > 13">
            <template slot="title">
              {{info.desc}}
            </template>
            <div class="desc">{{info.desc}}</div>
          </a-tooltip>
          <div v-else>{{info.desc}}</div>
        </a-descriptions-item>
        <a-descriptions-item>
          <a href="javascript: void(0);"
            style="margin-left: 15px;"
            @click="visible = true"
            v-if="hasPerm(10)">修改基本信息</a>
        </a-descriptions-item>
      </a-descriptions>
    </div>
    <a-tabs default-active-key="1"
      :activeKey="activeKey"
      @change="onTabsChange">
      <a-tab-pane :key="1" tab="包含组织机构"
        v-if="hasPerm(51)">
        <organList v-if="activeKey === 1"
          :id="info.id"/>
      </a-tab-pane>
      <a-tab-pane :key="2" tab="动态约束"
        v-if="hasPerm(53)">
        <dynamic-constraints v-if="activeKey === 2"
          :id="info.id"
          :haveBoss="info.haveBoss"
          @on-have="onHave"/>
      </a-tab-pane>
      <a-tab-pane :key="3" tab="人员清单"
        v-if="hasPerm(57)">
        <personnel-list v-if="activeKey === 3"
          :id="info.id" />
      </a-tab-pane>
      <a-tab-pane :key="4" tab="基本信息"
        v-if="hasPerm(58)">
        <essentailInformation v-if="activeKey === 4"
          :info="info" />
      </a-tab-pane>
    </a-tabs>
    <manageScopeDrawer :visible.sync="visible"
      :info="info"
      @on-save="managementDetail">
      <template slot="gmtCreateEmplid" slot-scope="{info}">
        <a-form-item
          :colon="true"
          label="创建用户"
        >
          {{ info.gmtCreateEmplid }}
        </a-form-item>
      </template>
      <template slot="gmtCreate" slot-scope="{info}">
        <a-form-item
          :colon="true"
          label="创建时间"
        >
          {{ info.gmtCreate }}
        </a-form-item>
      </template>
      <template slot="gmtModifiedEmplid" slot-scope="{info}">
        <a-form-item
          :colon="true"
          label="更新用户"
        >
          {{ info.gmtModifiedEmplid }}
        </a-form-item>
      </template>
      <template slot="gmtModified" slot-scope="{info}">
        <a-form-item
          :colon="true"
          label="更新时间"
        >
          {{ info.gmtModified }}
        </a-form-item>
      </template>
    </manageScopeDrawer>
  </div>
</template>
<script>
import organList from './organList.vue'
import dynamicConstraints from './dynamic-constraints.vue'
import personnelList from './personnelList.vue'
import essentailInformation from './essential-information.vue'
import {managementDetail} from '@/api/auth-management'
import manageScopeDrawer from '@/components/manage-scope-drawer'
export default {
  data() {
    return {
      info: {},
      activeKey: 1,
      visible: false
    }
  },
  wathc: {
    '$routes': 'managementDetail'
  },
  components: {
    organList,
    dynamicConstraints,
    personnelList,
    essentailInformation,
    manageScopeDrawer
  },
  created() {
    this.managementDetail()
  },
  methods: {
    onTabsChange(activeKey) {
      this.activeKey = activeKey
    },
    managementDetail() {
      const paramData = {
        id: this.$route.params.id
      }
      managementDetail(paramData).then(res => {
        if(res.data.code === 200) {
          this.$set(this, 'info', res.data.data)
        }
      })
      .catch(err => {
        console.log(err)
      })
    },
    handleBack() {
      this.$router.go(-1)
    },
    onHave(e) {
      this.$set(this.info, 'haveBoss', e)
    }
  }
}
</script>
<style lang="less">
  .scope-content td {
    padding-bottom: 0;
  }
  .scope-detail-descriptions .ant-descriptions-item:nth-of-type(4) {
    display: flex;
    .ant-descriptions-item-content {
      width: calc(~'100% - 42px');
    }
  }
  .scope-detail .ant-page-header-heading-title {
    font-size: 16px;
  }
</style>
<style lang="less" scoped>
  .icon-circular {
    border-radius: 50%;
    width: 7px;
    height: 7px;
    background: #00d211;
    display: inline-block;
    margin-right: 5px;
  }
  .scope-content {
    padding: 20px 20px 5px;
  }
  .desc {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>