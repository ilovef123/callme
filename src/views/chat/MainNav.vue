<template>
      <div class="user-avatar" @click="goProfile ? goProfile() : null">
      <img
        v-if="userAvatar"
        :src="getFullUrl(userAvatar)"
        alt="avatar"
        class="avatar-img"
        style="width: 48px; height: 48px;margin-top: 8px;"
      />
      <img
        v-else
        src="@/assets/images/logo.png"
        alt="logo"
        class="avatar-img logo-img"
        style="width: 48px; height: 48px;margin-top: 8px;"

      />
    </div>
  <div class="main-nav">
    <!-- 用户头像区 -->

    <!-- 导航栏 -->
    <div
      v-for="tab in tabs"
      :key="tab.value"
      :class="['nav-item', { active: tab.value === activeTab }]"
      @click="$emit('update:activeTab', tab.value)"
    >
      <component :is="tab.icon" theme="outline" size="28" :fill="tab.value === activeTab ? '#2d8cf0' : '#888'" />
      <!-- <span>{{ tab.label }}</span> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { Message, User, AddressBook, FriendsCircle } from '@icon-park/vue-next'
import { ref, onMounted, watch } from 'vue'

// goProfile 方法声明，防止模板报错
function goProfile() {
  // 可根据实际跳转逻辑补充
}

import getFullUrl from '@/utils/getFullUrl';

// 读取用户数据（假设localStorage有user对象）
const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
const userAvatar = ref(user.value.avatar || '')

// 监听 localStorage 变化，自动刷新头像
window.addEventListener('storage', () => {
  const updated = JSON.parse(localStorage.getItem('user') || '{}')
  user.value = updated
  userAvatar.value = updated.avatar || ''
})

// 页面内主动同步
watch(() => user.value.avatar, (val) => {
  userAvatar.value = val || ''
})

onMounted(() => {
  const updated = JSON.parse(localStorage.getItem('user') || '{}')
  user.value = updated
  userAvatar.value = updated.avatar || ''
})

const props = defineProps<{ activeTab: string }>()
const router = useRouter()

const tabs = [
  { label: '消息', value: 'chat', icon: Message },
  { label: '联系人', value: 'contacts', icon: AddressBook },
  { label: '动态', value: 'moments', icon: FriendsCircle },
  { label: '我的', value: 'profile', icon: User }
]
</script>

<style lang="scss">
@use './MainNav.scss' as *;
</style>