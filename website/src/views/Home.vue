<template>
  <div class="home tac">
    <!-- <h1>离线下载</h1> -->
    <div class="search">
      <input type="text" placeholder="请输入资源链接" v-model="url" />
      <button @click="ok">确定</button>
    </div>
    <file-list class="list" v-if="showList" />
  </div>
</template>

<script>
// @ is an alias to /src
import fileList from '@/components/fileList.vue';
import axios from 'axios'
import {utils} from '@/utils'
export default {
  name: 'home',
  data(){
    return {
      url:'',
      percent:{},
      showList:true,
    }
  },
  components: {
    fileList,
  },
  mounted(){
    // this.getPercent()
  },
  methods:{
    async ok(){
      let res=await axios.post('/api/download',{url:this.url})
      // this.getPercent(res.data.data.sid)
      this.showList=false
      await utils.sleep(1000)
      this.showList=true
      console.log(res.data)
    },
    async getPercent(){
      let res=await axios.post('/api/percent')
      this.percent=res.data.data||{}
      await utils.sleep(3000)
      await this.getPercent()
    }
  }
};
</script>
<style lang="scss">
.flex1{
  flex:1
}
.search{
  width:100%;
  display: flex;
  line-height: 40px;
  height: 40px;
  border-radius: 5px;
  border: 1px solid #f0f0f0;
  box-sizing: border-box;
  input{
    flex:1;
    line-height: 100%;
    padding: 5px;
    border-radius: 5px;
    border: 0;
    height: 100%;
    box-sizing: border-box;
  }
  button{
    width:3rem;
  }
}
.home {
  width: 80%;
  margin: 0 auto;
  h1 {
    margin: 1rem;
    font-size: 2em;
  }
}
.list {
  margin: 1rem 0;
}
.tac {
  text-align: center;
}
</style>