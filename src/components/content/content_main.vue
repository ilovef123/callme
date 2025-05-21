<template>
  <button @click="goLogin" style="margin-top:20px;">立即体验</button>
  <!-- <CarouselPromo /> -->

</template>
<script setup lang="ts">
  import { useRouter } from 'vue-router';
  const router = useRouter();
  function goLogin(){
      router.push({path:'/login'})
  }
</script>

<style lang="scss" scoped>
@use './content_main.scss' as *; // 添加命名空间声明
</style>