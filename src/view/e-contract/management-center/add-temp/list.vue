<template>
  <div style="width: 100%; height: 100%">
    <iframe referrerpolicy='origin' :src='weburl' frameborder="0" width="100%" height="99%" class="iframe"></iframe>
  </div>
</template>

<script>
import { getTempUrl } from '@/api/e-contract'

export default {
  name: "iframe",
  data() {
    return {
      weburl: ''
    }
  },
  methods: {
    getTempUrl() {
      let data = {
        number: 'mobanguanliyuan'
      }
      getTempUrl(data).then(res => {
        const data = res.data
        if (data.code === 200) {
          this.weburl = data.data.resultStr
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })
    }
  },
  mounted() {
    this.getTempUrl()
  }
}
</script>
