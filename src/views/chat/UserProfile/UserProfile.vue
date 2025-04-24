<template>
    <div class="profile-header">
      <img class="profile-avatar" :src="user.avatar" alt="头像" />
      <div class="profile-info">
        <div class="profile-nickname">{{ user.nickname }}</div>
        <div class="profile-mobile">{{ user.mobile }}</div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps } from 'vue'
  const props = defineProps<{
    user: {
      avatar: string
      nickname: string
      mobile: string
    }
  }>()
  </script>
  
  <style scoped lang="scss">
    @import './UserProfile.scss';
</style>