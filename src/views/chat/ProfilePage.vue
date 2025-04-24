<template>
  <div class="profile-moments-page">
    <UserProfile :user="user" />
    <hr class="profile-divider" />
    <UserMoments :moments="moments" />
  </div>
</template>

<script setup lang="ts">
import UserProfile from './UserProfile/UserProfile.vue'
import UserMoments from './UserProfile/UserMoments.vue'
import { ref } from 'vue'
const user = ref({
  avatar: 'https://img1.baidu.com/it/u=1234567890,1234567890&fm=253&fmt=auto&app=138&f=JPEG?w=300&h=300',
  nickname: '我的昵称',
  mobile: '18888888888'
})
const moments = ref([
  {
    id: 1,
    content: 'Vue3项目紧红红恢复！',
    imgs: ['https://img2.baidu.com/it/u=1234567890,1234567890&fm=253&fmt=auto&app=120&f=JPEG?w=400&h=400'],
    time: '刚刚'
  }
])
</script>

<style scoped>
.profile-moments-page {
  width: 70%;
  min-width: 340px;
  max-width: 960px;
  margin: 32px auto 0 auto;
  background: #fff;
  border-radius: 12px;
  box-sizing: border-box;
}
.profile-divider {
  border: none;
  border-top: 1px solid #e5e6eb;
  margin: 0 32px 16px 32px;
}
</style>