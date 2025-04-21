<script setup lang="ts">
  import {useMenu} from './header_List.ts'
  const {menus} = useMenu()
  import { ref, watchEffect } from 'vue'
  import { GithubOne, Moon, Sun ,Github,Browser} from '@icon-park/vue-next' // 添加Sun图标
// 主题状态
const darkMode = ref(localStorage.getItem('theme') === 'dark')

// 切换主题方法
const toggleDarkMode = () => {
  darkMode.value = !darkMode.value;
  localStorage.setItem('theme', darkMode.value ? 'dark' : 'light');
};

// 监听主题变化
// header_List.vue 修改部分
watchEffect(() => {
  if (darkMode.value) {
    document.documentElement.classList.add('dark')
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    document.documentElement.setAttribute('data-theme', 'light')
  }
})

</script>

<template>
  <header>
    <div class="logo">
      <a href="/">
        <img src="@/assets/images/logo.png" alt="Logo" class="logo-image" style="-webkit-user-drag: none">
      </a>
    </div>
    <div class="headerlist">
      <!-- 即兴网页 -->
      <router-link 
        v-for="(item, index) in menus" 
        :key="index"
        class="link"
        :to="item.key"
      >
        <span class="icon">
          <i>
            <component :is="darkMode ? item.iconNight : item.iconLight" theme="outline" size="26"/>
          </i>
        </span>
        <span class="txt">{{ item.name }}</span>
      </router-link>
      <!-- github跳转按钮 -->
      <a 
        href="https://github.com/ilovef123/callme" 
        target="_blank" 
        rel="noopener noreferrer"
        class="link"
      >
        <span class="icon">
          <i>
            <component :is="darkMode ? Github : GithubOne" theme="outline" size="26"/>
          </i>
            
        </span>
        <span class="txt">GitHub</span>
      </a>
      <!-- 黑暗模式切换 -->
      <button 
  class="link" 
  @click="toggleDarkMode"
  aria-label="切换主题"
>
  <span class="icon">
    <i>
      <component :is="darkMode ? Sun : Moon" theme="outline" size="26"/>
    </i>
  </span>
  <span class="txt">{{ darkMode ? '浅色' : '深色' }}</span>
</button>
    </div>
  </header>
</template>
<style scoped>

@import  './header.css'



</style>