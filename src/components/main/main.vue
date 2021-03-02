<template>
  <Layout style="height: 100%" class="main">
    <Sider hide-trigger collapsible :width="256" :collapsed-width="64" v-model="collapsed" class="left-sider" :style="{overflow: 'hidden'}">
      <side-menu accordion ref="sideMenu" :active-name="activeName" :collapsed="collapsed" @on-select="turnToPage" :menu-list="menuList">
        <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
        <router-link :to="{ name: 'home'}">
          <div class="logo-con">
            <img v-show="!collapsed" :src="maxLogo" key="max-logo" class="logo" />
            <img v-show="collapsed" :src="minLogo" key="min-logo" />
          </div>
        </router-link>
      </side-menu>
    </Sider>
      <Layout style="overflow-x: auto;">
        <Header class="header-con" style="min-width: 960px">
          <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
            <user :message-unread-count="unreadCount" :user-avatar="userAvatar" :user-name="userName"/>
            <!--          <language v-if="$config.useI18n" @on-lang-change="setLocal" style="margin-right: 10px;" :lang="local"/>-->
            <!--          <error-store v-if="$config.plugin['error-store'] && $config.plugin['error-store'].showInHeader" :has-read="hasReadErrorPage" :count="errorCount"></error-store>-->
            <!--          <fullscreen v-model="isFullscreen" style="margin-right: 10px;"/>-->
          </header-bar>
        </Header>
        <div style="padding-top: 12px;min-width: 960px">
          <custom-bread-crumb show-icon style="margin-left: 20px;" :list="breadCrumbList"></custom-bread-crumb>
        </div>
        <Content class="main-content-con" style="padding-top: 0;min-width: 960px">
          <!--        侧边栏展开收起按钮-->
          <div class="collapsed-btn" @click="clickCollapsedChange">
        <span>
          <Icon :type="collapsedIcon" class="collapsed-icon"></Icon>
        </span>
          </div>
          <Layout class="main-layout-con" style="padding: 6px 20px 15px;">
            <!--          <div class="tag-nav-wrapper">-->
            <!--            <tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag"/>-->
            <!--          </div>-->
            <Content class="content-wrapper" style="padding: 0;background-color:#fff;">
              <!--            <keep-alive :include="cacheList">-->
              <router-view/>
              <!--            </keep-alive>-->
              <ABackTop :height="100" :bottom="80" :right="50" container=".content-wrapper"></ABackTop>
            </Content>
          </Layout>
        </Content>
      </Layout>
  </Layout>
</template>
<script>
import SideMenu from './components/side-menu'
import HeaderBar from './components/header-bar'
import TagsNav from './components/tags-nav'
import User from './components/user'
import ABackTop from './components/a-back-top'
import Fullscreen from './components/fullscreen'
import Language from './components/language'
import ErrorStore from './components/error-store'
import customBreadCrumb from './components/header-bar/custom-bread-crumb'
import { mapMutations, mapActions, mapGetters } from 'vuex'
import { getNewTagList, routeEqual } from '@/libs/util'
import routers from '@/router/routers'
import minLogo from '@/assets/images/logo-min.png'
import maxLogo from '@/assets/images/DHR-logo.png'
import './main.less'
export default {
  name: 'Main',
  components: {
    SideMenu,
    HeaderBar,
    Language,
    TagsNav,
    Fullscreen,
    ErrorStore,
    User,
    ABackTop,
    customBreadCrumb
  },
  data () {
    return {
      collapsed: false,
      minLogo,
      maxLogo,
      isFullscreen: false,
      collapsedIcon: 'ios-arrow-back',
      activeName: ''
    }
  },
  computed: {
    ...mapGetters([
      'errorCount'
    ]),
    tagNavList () {
      return this.$store.state.app.tagNavList
    },
    tagRouter () {
      return this.$store.state.app.tagRouter
    },
    userAvatar () {
      return this.$store.state.user.photoUrl
    },
    userName () {
      return this.$store.state.user.userName
    },
    cacheList () {
      const list = ['ParentView', ...this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []]
      return list
    },
    menuList () {
      return this.$store.getters.menuList
    },
    local () {
      return this.$store.state.app.local
    },
    hasReadErrorPage () {
      return this.$store.state.app.hasReadErrorPage
    },
    unreadCount () {
      return this.$store.state.user.unreadCount
    },
    breadCrumbList () {
      return this.$store.state.app.breadCrumbList
    }
  },
  methods: {
    ...mapMutations([
      'setBreadCrumb',
      'setTagNavList',
      'addTag',
      'setLocal',
      'setHomeRoute',
      'closeTag'
    ]),
    ...mapActions([
      'handleLogin',
      // 'getUnreadMessageCount'
    ]),
    turnToPage (route) {
      let { name, params, query } = {}
      if (typeof route === 'string') name = route
      else {
        name = route.name
        params = route.params
        query = route.query
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }
      this.$router.push({
        name,
        params,
        query
      })
    },
    handleCollapsedChange (state) {
      this.collapsed = state
      if (state) {
        this.collapsedIcon = 'ios-arrow-forward'
      } else {
        this.collapsedIcon = 'ios-arrow-back'
      }
    },
    handleCloseTag (res, type, route) {
      if (type !== 'others') {
        if (type === 'all') {
          this.turnToPage(this.$config.homeName)
        } else {
          if (routeEqual(this.$route, route)) {
            this.closeTag(route)
          }
        }
      }
      this.setTagNavList(res)
    },
    handleClick (item) {
      this.turnToPage(item)
    },
    clickCollapsedChange () {
      this.handleCollapsedChange(!this.collapsed)
    }
  },
  watch: {
    '$route' (newRoute) {
      const { name, query, params, meta } = newRoute
      this.addTag({
        route: { name, query, params, meta },
        type: 'push'
      })
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
      this.$refs.sideMenu.updateOpenName(newRoute.name)

      // 如果路由隐藏菜单，则跳转页面不显示
      if (!this.$route.meta.hideInMenu || name === 'home') {
        this.setBreadCrumb(newRoute)
        this.activeName = this.$route.name
      }
    }
  },
  mounted () {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    this.setTagNavList()
    this.setHomeRoute(routers)
    const { name, params, query, meta } = this.$route
    this.addTag({
      route: { name, params, query, meta }
    })
    this.setBreadCrumb(this.$route)
    // 设置初始语言
    this.setLocal(this.$i18n.locale)
    // 如果当前打开页面不在标签栏中，跳到homeName页
    if (!this.tagNavList.find(item => item.name === this.$route.name)) {
      this.$router.push({
        name: this.$config.homeName
      })
    }
    // 获取未读消息条数
    // this.getUnreadMessageCount()

    this.activeName = this.$route.name
  }
}
</script>

<style lang="less" scoped>
  .collapsed-btn {
    width: 10px;
    height: 60px;
    line-height: 60px;
    background-color: #2D8CF0;
    position: absolute;
    top: 50%;
    margin-top: -30px;
    z-index: 100;
    padding: 0;
    color: #fff;
    border-radius: 0 4px 4px 0;
    cursor: pointer;
    .collapsed-icon {
      font-size: 16px;
      margin-left: -3px;
    }
  }
</style>
