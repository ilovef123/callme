import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/css/global.css'
import '@/assets/fonts.scss'
// import 'element-plus/theme-chalk/dark/css-vars.css'
createApp(App).use(router).use(ElementPlus).mount('#app')

// 检测系统主题偏好
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
const savedTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light')
document.documentElement.classList.toggle('dark', savedTheme === 'dark')
