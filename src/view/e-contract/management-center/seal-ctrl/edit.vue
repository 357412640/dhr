<template>
  <div class='seal-ctrl-edit'>
    <Form :label-width="80">
      <FormItem label="印章类型">
        <Select v-model='formData.sealTypeid' style='width:200px'>
          <Option v-for='item in sel1' :value="item.id" :key='item.id'>{{item.bindValue}}</Option>
        </Select>
      </FormItem>
      <FormItem label="法人单位">
        <Select v-model='formData.companyName' style='width:200px' @on-open-change='showComSel'>
          <Option v-for='item in sel2' :value="item.companyName" :key='item.id'>{{item.companyName}}</Option>
        </Select>
      </FormItem>
      <FormItem label="印章名称">
        <Input v-model='formData.name' placeholder="请输入印章名称" style='width:200px'></Input>
      </FormItem>
      <FormItem label="环绕文字">
        <Input v-model='formData.content' placeholder="请输入印章名称" style='width:200px'></Input>
      </FormItem>
      <FormItem label="信息编码">
        <Input v-model='formData.enterpriseCode' placeholder="请输入印章名称" style='width:200px'></Input>
      </FormItem>
      <FormItem label="企业标签">
        <Select v-model='formData.enterpriselabel' style='width:200px'>
          <Option v-for='item in sel3' :value="item" :key='item'>{{item}}</Option>
        </Select>
      </FormItem>
    </Form>
    <Row>
      <Col span='6'>
        <div>
          <Button :loading="loading" type="primary" style="margin-right:8px" @click='saveSeal'>确定</Button>
          <Button @click="toPage('seal_ctrl_list')">取消</Button>
        </div>
      </Col>
    </Row>

    <Modal v-model="comSelModal">
      <Input v-model="legalname" prefix="ios-search" placeholder="输入关键词搜索" style="width:80%" @on-change='getSealLegalname' />
      <div style='margin-top:20px;'>
        <div style='width:45%;display:inline-block;border-right:2px solid #e8eaec'>
          <div style='text-align:center;margin-bottom:10px'>待制章（{{sealComs.sealToBeMade.length}}）</div>
          <div style='height:200px;overflow-y:auto'>
            <RadioGroup v-model="formData.companyName">
              <Radio v-for='item in sealComs.sealToBeMade' :label="item" style='display:block;padding:2px 0px 2px 0px'>
                <span>{{item}}</span>
              </Radio>
            </RadioGroup>
          </div>
        </div>
        <div style='width:45%;display:inline-block;margin-left:5%'>
          <div style='text-align:center;margin-bottom:10px'>已制章（{{sealComs.sealMade.length}}）</div>
          <div style='height:200px;overflow-y:auto'>
            <div v-for='item in sealComs.sealMade' style='color:#c5c8ce;padding:2px 0px 2px 0px'>{{item}}</div>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { selectType, getCompanyList, insertSeal, getSealLegalname } from '@/api/e-contract'

export default {
  data() {
    return {
      comSelModal: false,
      loading: false,
      formData: { sealTypeid: 46 },
      sel1: [],
      sel2: [],
      sealComs: {},
      legalname: '',
      sel3: [
        '零售控股',
        '控股集团'
      ],
    }
  },
  methods: {
    getSealLegalname() {
      getSealLegalname({legalname: this.legalname}).then(res => {
        const data = res.data
        if (data.code === 200) {
          this.sealComs = data.data
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })
    },
    toPage (path) {
      this.$router.push({name: path})
    },
    getSelectType() {
      selectType({type:8}).then(res => {
        const data = res.data
        if (data.code === 200) {
          this.sel1 = data.data
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })

      getCompanyList({companyName:''}).then(res => {
        const data = res.data
        if (data.code === 200) {
          this.sel2 = data.data
        } else {
          this.$Message.error('获取失败：' + data.message)
        }
      })
    },
    saveSeal() {
      this.insertSeal()
    },
    insertSeal() {
      this.loading = true
      let data = this.formData
      insertSeal(data).then(res => {
        const data = res.data
        if (data.code === 200) {
          this.$Message.success('保存成功！')
          this.toPage('seal_ctrl_list')
        } else {
          this.$Message.error('保存失败：' + data.message)
        }

        this.loading = false
      })
    },
    showComSel(e) {
      if (e) {
        this.comSelModal = true
      }
    }
  },
  mounted() {
    this.getSelectType()
    this.getSealLegalname()
  }
}
</script>

<style>
.seal-ctrl-edit {
  padding: 20px;
}
</style>
