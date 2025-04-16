
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


<style>
</style>