<template>
    <div class="app-container">
      <div class="login-page">
        <a class="top-left-text" href="/">Call Me</a>
        <div class="login-container">
          <!-- 左侧品牌信息 -->
          <div class="brand-section">
            <div class="brand-content">
              <h1 class="brand-name">Me</h1>
               <p class="brand-slogan" v-once>
                <span class="chinese-slogan">用心交流</span> 
                <br> Communicate with heart</p>
            </div>
          </div>
  
          <!-- 右侧找回密码表单 -->
          <div class="form-section">
            <form class="login-form">
              <h2 class="form-title">找回密码</h2>
  
              <div class="form-group">
                <input
                  type="tel"
                  placeholder="请输入绑定的手机号"
                  required
                />
                <span class="error-message">请输入手机号</span>
              </div>
  
              <div class="form-group">
                <input
                  type="text"
                  placeholder="请输入验证码"
                  required
                />
                <span class="error-message">请输入验证码</span>
              </div>
  
              <div class="form-group">
                <input
                  type="password"
                  placeholder="请输入新密码"
                  required
                />
                <span class="error-message">请输入新密码</span>
              </div>
  
              <button type="submit" class="submit-button">重置密码</button>
  
              <div class="form-footer">
                <router-link to="/register" class="form-link">返回登录</router-link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ForgotPassword',
  };
  </script>
  
  <style lang="scss" scoped>
  @import './style.scss'; // 引用通用样式
  </style>
  