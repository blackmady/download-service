<template>
  <div>
    <ul>
      <li v-for="item in list" :key="item.id">
        <!-- <div class="bg"></div> -->
        <div class="item-title">
          {{item.filename}}
        </div>
        <div class="item-operate">
          <span v-if="item.status=='0'">正在下载...</span>
          <span v-if="item.status=='2'">下载失败</span>
          <a v-if="item.status=='1'" :href="`/download/${item.sid}`" :download="item.filename">下载</a>
        </div>
        <div class="item-time">
          {{item.createdAt | formatTime('yyyy-MM-dd')}} - 2019.3.13
        </div>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
export default Vue.extend({
  data(){
    return {
      list:[]
    }
  },
  async mounted(){
    let res=await axios.get('/api/_list/files');
    this.list=res.data.data
  },
  methods:{
  }
});
</script>
<style lang="scss" scoped>
ul{
  li{
    margin-top:.3rem;
    border:1px solid #f0f0f0;
    border-radius: 5px;
    display: flex;
    line-height: 30px;
    font-size:.8em;
    position: relative;
    .bg{
      z-index: -1;
      position: absolute;
      top:0;
      left:0;
      height:100%;
      background:#9cd7ff;
    }
    .item-{
      &title{
        flex:1;
        text-align: left;
        padding:0 .3rem;
      }
      &operate{
        width:20%;
      }
      &time{
        width:20%
      }
    }
  }
}
</style>