<template>
  <div class="app-container">
    <div class="login-page">
      <a class="top-left-text" href="/">Call Me</a>
      <div class="login-container">
        <!-- 左侧品牌信息 -->
        <div class="brand-section">
          <div class="brand-content">
            <h1 class="brand-name" v-once>Me</h1>
            <p class="brand-slogan" v-once><span class="chinese-slogan">用心交流</span> <br> Communicate with heart</p>
          </div>
        </div>
        
        <!-- 右侧登录表单 -->
        <div class="form-section">
          <form class="login-form">
            <h2 class="form-title" v-once>账号登录</h2>
            
            <div class="form-group">
              <input
               
                type="text"
                placeholder="请输入用户名"
                required
              >
            </div>
            
            <div class="form-group">
              <input
                
                type="password"
                placeholder="请输入密码"
                required
              >
            </div>
            
            <button type="submit" class="login-btn">进入</button>
            <div class="forgot-links">
              <!-- 移除注释 -->
              <router-link to="/login" class="forgot-link">注册账号</router-link>
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
  import { useRouter } from 'vue-router'

  interface LoginForm {
    username: string
    password: string
  }

  const form = reactive<LoginForm>({
    username: '',
    password: ''
  })

  const router = useRouter()

  const handleLogin = () => {
    console.log('登录信息:', form)
  }

  // 移除未使用的 goLogin 函数
  // function goLogin(){
  //     router.push({path:'/login'})
  // }
</script>

<style lang="scss" src="./style.scss"></style>