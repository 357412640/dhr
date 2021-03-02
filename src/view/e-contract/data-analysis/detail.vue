<template>
  <div class='analysis' style='text-align:center;margin-top:40px'>
    <div class='data_row'>已完成合同<br>{{this.analysis.ywc}}</div>
    <div class='data_row'>待签署合同<br>{{this.analysis.dqs}}</div>
    <div class='data_row'>待盖章合同<br>{{this.analysis.ygz}}</div>
  </div>
</template>

<script>
import { getDataAnalysis } from '@/api/e-contract'

export default {
  data() {
    return {
      analysis: {},
    }
  },
  methods: {
    getDataAnalysis() {
      getDataAnalysis({}).then(res => {
        const data = res.data
        if (data.code === 200) {
          
          this.analysis = data.data[0]
console.log(this.analysis)
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })     
    },
  },
  mounted() {
    this.getDataAnalysis()
  }
}
</script>

<style>
.analysis {
  padding: 20px;
}
.data_row {
font-size:20px;display:inline-block;text-align:center;
padding: 0px 40px;
}
</style>
