<template>
  <div class="home tac">
    <!-- <h1>离线下载</h1> -->
    <input type="text" placeholder="请输入资源链接">
    <file-list class="list" />
  </div>
</template>

<script>
// @ is an alias to /src
import fileList from '@/components/fileList.vue';
export default {
  name: 'home',
  components: {
    fileList,
  },
};
</script>
<style lang="scss">
.home {
  width: 80%;
  margin: 0 auto;
  h1 {
    margin: 1rem;
    font-size: 2em;
  }
  input {
    width: 100%;
    line-height: 30px;
    padding: 5px;
    border-radius: 5px;
    border: 1px solid #f0f0f0;
    box-sizing: border-box;
  }
}
.list {
  margin: 1rem 0;
}
.tac {
  text-align: center;
}
</style>