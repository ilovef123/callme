<template>
  <div class="app-container">
  
    <div class="login-page">
        <div class="top-left-text">Call Me</div>
      <div class="login-container">
        <!-- 左侧品牌信息 -->
        <div class="brand-section">
          <div class="brand-content">
            <h1 class="brand-name">Me</h1>
            <p class="brand-slogan"><span class="chinese-slogan">用心交流</span> <br> Communicate with heart</p>
          </div>
        </div>
        
        <!-- 右侧登录表单 -->
        <div class="form-section">
          <form class="login-form" @submit.prevent="handleLogin">
            <h2 class="form-title">账号登录</h2>
            
            <div class="form-group">
              <input
                v-model="form.username"
                type="text"
                placeholder="请输入用户名"
                required
              >
            </div>
            
            <div class="form-group">
              <input
                v-model="form.password"
                type="password"
                placeholder="请输入密码"
                required
              >
            </div>
            
            <button type="submit" class="login-btn">进入</button>
            <div class="forgot-links">
              <a href="#" class="forgot-link">注册账号</a>
              <a href="#" class="forgot-password">忘记密码</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

interface LoginForm {
  username: string
  password: string
}

const form = reactive<LoginForm>({
  username: '',
  password: ''
})

const handleLogin = () => {
  console.log('登录信息:', form)
}
</script>

<style lang="scss" src="./style.scss"></style>