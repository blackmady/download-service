<template>
  <div>
    <ul>
      <li>
        <div class="bg" :style="`width:${percent}%`"></div>
        <div class="item-title">
          xxx.jpg
        </div>
        <div class="item-operate">
          d
        </div>
        <div class="item-time">
          2019.2.13 - 2019.3.13
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
      percent:0,
    }
  },
  async mounted(){
    let list=await axios.get('/api/list/files');
  },
});
</script>
<style lang="scss" scoped>
ul{
  li{
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