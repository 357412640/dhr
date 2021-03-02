<template>
  <div class="tab4-content-box">
    <div class="left">
      <h4 class="border-left">角色信息</h4>
      <p>
        <span>角色编号：</span>
        <span>{{ role.roleCode }}</span>
      </p>
      <p>
        <span>角色描述：</span>
        <span>{{ role.remark }}</span>
      </p>
      <p>
        <span>创建用户：</span>
        <span>{{ role.gmtCreateEmplid }}</span>
      </p>
      <p>
        <span>创建时间：</span>
        <span>{{ role.gmtCreate }}</span>
      </p>
      <p>
        <span>上次操作用户：</span>
        <span>{{ role.gmtModifiedEmplid }}</span>
      </p>
      <p>
        <span>上次操作时间：</span>
        <span>{{ role.gmtModified }}</span>
      </p>

    </div>
    <div class="right">
      <div style="position: absolute;padding-bottom: 20px">
        <h4 class="border-left">操作记录</h4>
        <Timeline>
          <template v-for="log in logList">
            <TimelineItem :key="log.id"
                          style="font-size: 16px;line-height: 20px"
            >{{ log.gmtCreate + log.gmtCreateUser + log.log }}</TimelineItem>
          </template>
        </Timeline>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "tab4-content",
    props: {
      logList: {
        type: Array,
        default: []
      },
      role: {
        type: Object,
        default() {
          return {}
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .tab4-content-box {
    height: 100%;
    padding: 10px 16px 0 23px;
    display: flex;
    .left {
      width: 33%;
      padding: 0 14px;
      border-right: 1px solid #dcdee2;
      overflow-y: auto;
      margin-bottom: 20px;
      /*height: calc(100vh - 52px);*/
    }
    .left > p {
      margin-bottom: 20px;
    }
    .right {
      width: 66%;
      padding: 0 14px 0 34px;
      overflow-y: auto;
      margin-bottom: 20px;
      height: 100%;
      position: relative;
    }
    .border-left {
      font-weight: 700;
      border-left: 2px solid #515a6e;
      padding-left: 5px;
      line-height: 16px;
      margin-bottom: 20px;
    }
  }
</style>
