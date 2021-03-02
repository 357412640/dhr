<template>
  <div class="drawer-box">
    <h3 class="border-left">基础信息</h3>
    <Form :model="newForm"
          style="padding: 0 10px"
          :label-width="80"
          label-position="left"
          :rules="ruleValidate"
          ref="newForm"
    >
      <FormItem label="所属应用" prop="appCode">
        <Select v-model="newForm.appCode" aria-placeholder="请选择" class="wid200">
          <template v-for="item in appList">
            <Option :value="item.appCode" :key="item.appCode">{{ item.appName }}</Option>
          </template>
        </Select>
      </FormItem>
      <FormItem label="角色编号" prop="roleCode">
        <Input v-model.trim="newForm.roleCode" placeholder="请输入" class="wid200"></Input>
      </FormItem>
      <FormItem label="角色名称" prop="roleName">
        <Input v-model.trim="newForm.roleName" placeholder="请输入" class="wid200"></Input>
      </FormItem>
      <FormItem label="状态">
        <i-switch v-model="newForm.status"></i-switch>
      </FormItem>
      <FormItem label="角色描述">
        <Input type="textarea" :rows="4" v-model.trim="newForm.remark" placeholder="请输入"></Input>
      </FormItem>
      <template v-if="newForm.gmtCreateEmplid || newForm.gmtCreate || newForm.gmtModifiedEmplid || newForm.gmtModified">
        <FormItem label="创建用户">
          <p class="p-style">{{ newForm.gmtCreateEmplid || '--' }}</p>
        </FormItem>
        <FormItem label="创建时间">
          <p class="p-style">{{ newForm.gmtCreate || '--' }}</p>
        </FormItem>
        <FormItem label="更新用户">
          <p class="p-style">{{ newForm.gmtModifiedEmplid || '--' }}</p>
        </FormItem>
        <FormItem label="更新时间">
          <p class="p-style">{{ newForm.gmtModified || '--' }}</p>
        </FormItem>
      </template>
    </Form>
    <div style="text-align: end;margin-right: 10px;margin-bottom: 10px">
      <Button @click="cancelNewRule" style="margin-right: 20px">取消</Button>
      <Button type="primary" @click="saveNewRule" :loading="saveLoading">保存</Button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "drawer-box",
    props: {
      roleDrawer: {
        type: Boolean,
        default: false
      },
      saveLoading: {
        type: Boolean,
        default: false
      },
      appList: {
        type: Array,
        default: []
      },
      data: {
        type: Object,
        default() {
          return {
            appName: '',
            appCode: '',
            roleCode: '',
            roleName: '',
            status: true,
            remark: ''
          }
        }
      },
      type: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        defaultData:{},
        newForm: {
          appName: '',
          appCode: '',
          roleCode: '',
          roleName: '',
          status: true,
          remark: ''
        },
        ruleValidate: {
          appCode: [
            {
              validator: (rule, val, callback) => {
                if (val === '' || val === undefined) {
                  callback(new Error('所属应用不能为空'))
                } else {
                  callback()
                }
              },
              trigger: 'change'
            }
          ],
          roleCode: [
            {
              validator: (rule, val, callback) => {
                if (!val) {
                  callback(new Error('角色编号不能为空'))
                } else if (/\/|<|>|\*|\?|:|"|\||\[|]|&|#|·|%|\+|\\/.test(val)) {
                  callback(new Error('名称不允许包含：/<>*?:" | [ ] & # · %+\\'))
                } else {
                  callback()
                }
              },
              trigger: 'change'
            }
          ],
          roleName: [
            {
              validator: (rule, val, callback) => {
                if (!val) {
                  callback(new Error('角色名称不能为空'))
                } else if (/\/|<|>|\*|\?|:|"|\||\[|]|&|#|·|%|\+|\\/.test(val)) {
                  callback(new Error('名称不允许包含：/<>*?:" | [ ] & # · %+\\'))
                } else {
                  callback()
                }
              },
              trigger: 'change'
            }
          ],
        }
      }
    },
    methods: {
      cancelNewRule() {
        this.$emit('hide')
      },
      saveNewRule() {
        if (this.saveLoading) {
          return
        } else {
          this.$refs['newForm'].validate(valid => {
            if (valid) {
              const data = {
                ...this.newForm
              }
              for (let i = 0; i < this.appList.length; i++) {
                let item = this.appList[i]
                if (data.appCode === item.appCode) {
                  data.appName = item.appName
                  break
                }
              }
              data.status = data.status ? 1 : 2
              this.$emit('on-save', data)
            }
          })
        }
      }
    },
    watch: {
      roleDrawer(newVal, oldVal) {
        if (!newVal) {
          if (this.type === 'edit') {
            const data = JSON.parse(JSON.stringify(this.defaultData))
            data.status = data.status === 1 || data.status === true
            this.newForm = data
          } else {
            this.newForm = {
              appName: '',
              appCode: '',
              roleCode: '',
              roleName: '',
              status: true,
              remark: ''
            }
            this.$refs['newForm'].resetFields()
          }
        }
      }
    },
    mounted() {
      this.defaultData = JSON.parse(JSON.stringify(this.data))
      const data = JSON.parse(JSON.stringify(this.data))
      data.status = data.status === 1 || data.status === true
      this.newForm = data
    }
  }
</script>

<style lang="less" scoped>
  .border-left {
    border-left: 2px solid #515a6e;
    padding-left: 5px;
    line-height: 16px;
    margin-bottom: 20px;
  }

  .wid200 {
    width: 200px;
  }
</style>
