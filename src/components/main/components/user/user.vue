<template>
  <div class="user-avator-dropdown">
<!--    <Dropdown @on-click="handleClick" style="padding: 0;">-->
      <Avatar :src="userAvatar"/>
      <span style="margin-left: 5px;">{{ userName }}</span>
<!--      <Icon :size="18" type="md-arrow-dropdown" style="margin-bottom: 4px;"></Icon>-->
<!--      <DropdownMenu slot="list">-->
<!--        <DropdownItem name="logout">注销登录</DropdownItem>-->
<!--      </DropdownMenu>-->
<!--    </Dropdown>-->
    <!--<span style="padding: 5px 10px 6px;">登录时间：{{ loginTime }}</span>-->
  </div>
</template>

<script>
import './user.less'
// import { mapActions } from 'vuex'
export default {
  name: 'User',
  props: {
    userAvatar: {
      type: String,
      default: ''
    },
    userName: {
      type: String,
      default: ''
    },
    loginTime: {
      type: String,
      default: ''
    }
  },
  // methods: {
  //   ...mapActions([
  //     'handleLogOut'
  //   ]),
  //   handleClick (name) {
  //     switch (name) {
  //       case 'logout':
  //         this.handleLogOut().then(() => {
  //           this.$router.push({
  //             name: 'login'
  //           })
  //         })
  //         break
  //     }
  //   }
  // }
}
</script>
