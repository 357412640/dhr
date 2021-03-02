<template>
  <div class="custom-bread-crumb">
    <Breadcrumb :style="{fontSize: `${fontSize}px`}">
      <BreadcrumbItem v-for="item in list" :to="item.to" :key="`bread-crumb-${item.name}`">
        <common-icon style="margin-right: 4px;" :type="item.icon || ''"/>
        {{ showTitle(item) }}
        <template slot="separator">
          <span class="ive-my-icon-style">
            <Icon type="ios-arrow-forward" />
          </span>
        </template>
      </BreadcrumbItem>

    </Breadcrumb>
  </div>
</template>
<script>
import { showTitle } from '@/libs/util'
import CommonIcon from '_c/common-icon'
import './custom-bread-crumb.less'
export default {
  name: 'customBreadCrumb',
  components: {
    CommonIcon
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    fontSize: {
      type: Number,
      default: 14
    },
    showIcon: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    showTitle (item) {
      return showTitle(item, this)
    },
    isCustomIcon (iconName) {
      return iconName.indexOf('_') === 0
    },
    getCustomIconName (iconName) {
      return iconName.slice(1)
    }
  }
}
</script>

<style lang="less">
  .ive-my-icon-style {
    color:#515a6e;
  }
  /*.ivu-breadcrumb-item-separator {*/
  /*  margin: 0;*/
  /*}*/
  /*.custom-bread-crumb {*/
  /*  .ivu-breadcrumb a {*/
  /*    color: #323232;*/
  /*  }*/
  /*  .ivu-breadcrumb {*/
  /*    color: #323232;*/
  /*  }*/
  /*  .ivu-breadcrumb > span:last-child {*/
  /*    color: #2D8CF0;*/
  /*  }*/
  /*}*/
</style>
