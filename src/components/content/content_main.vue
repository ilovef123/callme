
<template>
  <button @click="goLogin">立即体验</button>
</template>
<script setup lang="ts">
  import { useRouter } from 'vue-router';
  const router = useRouter();
  function goLogin(){
      router.push({path:'/Login'})
  }
</script>

<style lang="scss" scoped>
@use './content_main.scss' as *; // 添加命名空间声明
</style>