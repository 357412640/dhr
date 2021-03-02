<template>
  <div class='base-setting-detail'>
    <div>
      <span>合同到期提醒：</span>
      <span style='color:#AAAAAA;padding:0px 6px;'>到期前</span>
      <!-- <Input type='number' style='width:100px'></Input> -->
      <InputNumber ref='day' min=1 v-model='day' :disabled='disabled'></InputNumber>
      <span style='color:#AAAAAA;padding:0px 6px;'>天提醒</span>
      <Button type="primary" @click='editDay' size="small">{{disabled ? '编辑' : '取消'}}</Button>
      <Button v-if='!disabled' type="warning" @click='savesettingday' size="small" style='margin-left:10px'>保存</Button>
    </div>
  </div>
</template>

<script>
import { getSettingDay, saveSettingDay } from '@/api/e-contract'

export default {
  data() {
    return {
      disabled: true,
      id: 0,
      day: 1,
      back: 0,
    }
  },
  methods: {
    getSettingDay() {
      let data = {}
      getSettingDay(data).then(res => {
        const data = res.data
        if (data.code === 200) {
          this.id = data.data.id
          this.day = this.back = data.data.bindValue
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })
    },
    editDay() {
      this.disabled = !this.disabled
      if (this.disabled) {
        this.$refs.day.blur()
        this.day = this.back
      } else {
        this.$refs.day.focus()
      }
    },
    savesettingday() {
      let data = {
        id: this.id,
        bindValue: this.day
      }
      saveSettingDay(data).then(res => {
        const data = res.data
        if (data.code === 200) {
          this.back = this.day
          this.$Message.success('保存成功！')
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })
    }
  },
  mounted() {
    this.getSettingDay()
  }
}
</script>

<style>
.base-setting-detail {
  padding: 20px;
}
</style>
