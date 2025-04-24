<template>
  <div class="main-nav">
    <div
      v-for="tab in tabs"
      :key="tab.value"
      :class="['nav-item', { active: tab.value === activeTab }]"
      @click="$emit('update:activeTab', tab.value)"
    >
      <i v-if="tab.icon">{{ tab.icon }}</i>
      <span>{{ tab.label }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
const props = defineProps<{ activeTab: string }>()
const tabs = [
  { label: '消息', value: 'chat', icon: '💬' },
  { label: '联系人', value: 'contacts', icon: '👥' },
  { label: '动态', value: 'moments', icon: '🌟' },
  { label: '我的', value: 'profile', icon: '👤' }
]
</script>

<style lang="scss" scoped>
@import './MainNav.scss';
</style>