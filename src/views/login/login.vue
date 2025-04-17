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
          
          <!-- 右侧注册表单 -->
          <div class="form-section">
            <form class="login-form">
              <h2 class="form-title">注册账号</h2>
              
              <div class="form-group">
                <input
                  type="tel"
                  placeholder="请输入手机号"
                  required
                >
                <span class="error-message">请输入手机号</span>
              </div>
              
              <div class="form-group">
                <input
                  type="text"
                  placeholder="请输入验证码"
                  required
                >
                <span class="error-message">请输入验证码</span>
                <button type="button" class="send-code-btn">
                  发送验证码
                </button>
              </div>
              
              <div class="form-group">
                <input
                  type="password"
                  placeholder="请输入密码"
                  required
                >
                <span class="error-message">请输入密码</span>
              </div>
              
              <div class="form-group">
                <input
                  type="password"
                  placeholder="请确认密码"
                  required
                >
                <span class="error-message">请确认密码</span>
              </div>
              
              <button type="submit" class="login-btn">注册</button>
              <div class="forgot-links">
                <router-link to="/register" class="forgot-link">登录账号</router-link>
                <a href="#" class="forgot-password">忘记密码</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <style lang="scss" src="./style.scss"></style>