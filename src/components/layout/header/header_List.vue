<script setup lang="ts">
  import {useMenu} from './header_List.ts'
  const {menus} = useMenu()
  import { ref, watchEffect } from 'vue'
  import { GithubOne, Moon, Sun ,Github,Browser} from '@icon-park/vue-next' // 添加Sun图标
// 主题状态
const darkMode = ref(localStorage.getItem('theme') === 'dark')

// 切换主题方法
const toggleDarkMode = () => {
  darkMode.value = !darkMode.value
  localStorage.setItem('theme', darkMode.value ? 'dark' : 'light')
}

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
        <img src="@/assets/images/logo.png" alt="Logo" class="logo-image">
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

header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  background-color: var(--header-bg);
  box-shadow: 0 6px 12px -2px rgba(184, 233, 255, 0.8);
  /* transition: background-color 0.3s ease; */
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

  /* 右导航栏样式 */
  header .headerlist{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px; /* 添加导航项间距 */
    /* min-height: 100svh;
    background: #e8e8e8; */
    margin-right: 26px;
  }
  .headerlist .link {
      position: relative;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 70px;
      height: 50px;
      color: #222;
      z-index: 1;
      overflow: hidden;
      transform-origin: center left;
      transition: width 0.2s ease-in;
    }

    .headerlist .link::before {
      position: absolute;
      content: "";
      display: block;
      width: 100%;
      height: 100%;
      /* background: #eee; */
      background:var(--header-right-bg);
      top: 0;
      z-index: -1;
      border-radius: 8px;
      transform: translateX(100%);
      transform-origin: center right;
      transition: transform 0.2s ease-in;
    }

    .headerlist .link:hover {
      width: 130px;
    }

    .headerlist .link:hover::before {
      transform: translateX(0);
    }

    .headerlist .link .icon {
      width: 28px;
      height: 28px;
      display: block;
      flex-shrink: 0;
      position: absolute;
      left: 18px;
    }

    .headerlist .link .icon i {
      font-size: 26px;
      color: var(--text-color);
      transition: color 0.3s ease;
    }

    .headerlist .link .txt {
      display: block;
      width: 100%;
      text-indent: 28px;
      text-align: center;
      transform: translateX(100%);
      transform-origin: center right;
      transition: transform 0.2s ease-in;
    }

    .headerlist .link:hover .txt {
      transform: translateX(0);
    }
    .logo-image{
      width: 105px;
    }
    button{
      border: 0;
      background: none;
      position: relative;
      top: 4px;
    }
    button a{
      text-decoration: none;
      color: var(--text-color) !important;
      font-size: 15px;
    }
    .headerlist .link svg {
      fill: currentColor;
      stroke: currentColor;
}   


</style>