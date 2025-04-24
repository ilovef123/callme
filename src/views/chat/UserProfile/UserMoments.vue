<template>
    <div class="moments-list-wrapper">
      <ul class="moments-list">
        <li v-for="moment in moments" :key="moment.id" class="moment-item">
          <div class="moment-main">
            <div class="moment-text">{{ moment.content }}</div>
            <div v-if="moment.imgs && moment.imgs.length" class="moment-imgs">
              <img v-for="(img, idx) in moment.imgs" :key="idx" :src="img" class="moment-img" alt="配图" />
            </div>
            <div class="moment-meta">
              <span class="moment-time">{{ moment.time }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps } from 'vue'
  const props = defineProps<{
    moments: Array<{
      id: number
      content: string
      imgs: string[]
      time: string
    }>
  }>()
  </script>
  
  <style scoped lang="scss">
  @import './UserMoments.scss';
  </style>