<style scoped>
  tr, td {
    background: #f8f8f9;
    border: 0px;
    text-align: center;
  }
</style>
<template>
    <div>
      <table border='0'>
        <tr v-for='item in row'>
          <td style='width:60px'></td>
          <td style='width:100px'></td>
          <td style='width:100px'></td>
          <td style='width:120px'></td>
          <td style='width:100px'></td>
          <td style='width:240px'>{{item.staff.deptChain}}</td>
          <td style='width:120px'>{{item.staff.posiDescr}}</td>
          <td style='width:140px'>{{item.staff.gmPosiLvl}}</td>
          <td style='width:100px'>{{item.staff.origHireDt}}</td>
          <td style='width:240px'>{{item.contractModeValue}}</td>
          <td style='width:240px'>{{item.subject}}</td>
          <td style='width:110px'>{{item.signTime}}</td>
          <td style='width:100px'>{{item.years}}</td>
          <td style='width:100px'>{{item.contractchildtype}}</td>
          <td style='width:100px'>{{item.postType}}</td>
          <td style='width:100px'>{{item.jobTime}}</td>
          <td style='width:100px'>{{item.testTime}}</td>
          <td style='width:120px'>{{item.starttime}}</td>
          <td style='width:140px'>{{item.futuretime}}</td>
          <td style='width:120px'>{{item.dimissionDt}}</td>
          <td style='width:160px'>{{item.oaNo}}</td>
          <td style='width:100px'>{{item.emplStatusDescr}}</td>
          <td style='width:120px'>{{statuss[item.status]['name']}}</td>
        </tr>
      </table>
    </div>
</template>
<script>
    export default {
        props: {
            row: Object,
            statuss: Array,
        }
    };
</script>
