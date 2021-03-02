<template>
  <div class='main'>
    <common-header :title="query.name" :back="true"></common-header>
    <!-- <div class="title-box">
      <Button type="text" class="left" @click="toPage('/view/basic_setting/file-attendance/')"><Icon type="ios-arrow-back" size="20" /> {{query.name}}</Button>
    </div> -->
    <Row style='margin-top:20px'>
      <Col span='4' offset='1'>
        <span class='htitle'>员工编号：{{query.emplid}}</span>
      </Col>
      <Col span='4'>
        <span class='htitle'>班次：{{query.workTimeName}}</span>
      </Col>
      <Col span='4'>
        <span class='htitle'>入职日期：{{query.origHireDt}}</span>
      </Col>
      <Col span='4'>
        <span class='htitle'>离职日期：<span v-if='query.dimissionDt'>{{query.dimissionDt}}</span><span v-else>--</span></span>
      </Col>
    </Row>
    <Tabs class='da-tabs' :value="tabVal">
      <TabPane label="考勤数据" name="name1" v-if="hasPerm(65)">
        <tab1-content :pemplid='query.emplid'></tab1-content>
      </TabPane>
      <TabPane label="假期余额" name="name2" v-if="hasPerm(66)">
        <tab2-content :pemplid='query.emplid'></tab2-content>
      </TabPane>
      <TabPane label="考勤申请记录" name="name3" v-if="hasPerm(67)">
        <tab3-content :pemplid='query.emplid'></tab3-content>
      </TabPane>
      <TabPane label="基本信息" name="name4" v-if="hasPerm(69)">
        <tab4-content :pemplid='query.emplid'></tab4-content>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import CommonHeader from '@/components/header'
import Tab1Content from './component/tab1-content'
import Tab2Content from './component/tab2-content'
import Tab3Content from './component/tab3-content'
import Tab4Content from './component/tab4-content'

export default {
  name: 'attendance-detail',
  components: {
    CommonHeader,
    Tab1Content,
    Tab2Content,
    Tab3Content,
    Tab4Content
  },
  methods: {
    toPage (path) {
      this.$router.push(path)
    },
  },
  data() {
    return {
      query: {},
      tabVal: ''
    }
  },
  created() {
    this.query = JSON.parse(this.$route.params.info)
    if (this.hasPerm(65)) {
      this.tabVal = 'name1'
    } else if (this.hasPerm(66)) {
      this.tabVal = 'name2'
    } else if (this.hasPerm(67)) {
      this.tabVal = 'name3'
    } else if (this.hasPerm(69)) {
      this.tabVal = 'name4'
    }
  }
}
</script>

<style scoped>
.main {
  padding: 0px 20px;
}
.htitle {
  font-size: 14px;
}
.da-tabs {
  margin-top: 16px;
}
.title-box{
  overflow: hidden;
  height: 32px;
  margin-bottom: 10px;
  .left{
    float: left;
    font-size: 14px;
    font-weight: 700;
  }
}
</style>
