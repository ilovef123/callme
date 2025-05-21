<template>
  <div class="app-container">
    <div class="login-page">
      <a class="top-left-text" href="/">Call Me</a>
      <div class="login-container">
        <div class="brand-section">
          <div class="brand-content">
            <h1 class="brand-name">Me</h1>
            <p class="brand-slogan">
              <span class="chinese-slogan">用心交流</span> <br />
              Communicate with heart
            </p>
          </div>
        </div>
        <div class="form-section">
          <form class="login-form" @submit.prevent="handleRegister">
            <h2 class="form-title">注册账号</h2>
            <div class="form-group input-error-group">
              <input v-model="form.iphone" type="text" placeholder="请输入手机号" autocomplete="off" :class="{ 'input-error': phoneError }" />
              <span class="error-message-inside" v-if="phoneError">{{ phoneError }}</span>
            </div>
            <div class="form-group input-error-group">
              <input v-model="form.username" type="text" placeholder="请输入昵称" autocomplete="off" :class="{ 'input-error': usernameError }" />
              <span class="error-message-inside" v-if="usernameError">{{ usernameError }}</span>
            </div>
            <div class="form-group input-error-group">
              <input v-model="form.password" type="password" placeholder="请输入密码" autocomplete="off" :class="{ 'input-error': pwdError }" />
              <span class="error-message-inside" v-if="pwdError">{{ pwdError }}</span>
            </div>
            <div class="form-group input-error-group">
              <input v-model="form.confirmPassword" type="password" placeholder="请确认密码" autocomplete="off" :class="{ 'input-error': confirmPwdError }" />
              <span class="error-message-inside" v-if="confirmPwdError">{{ confirmPwdError }}</span>
            </div>
            <button type="submit" class="login-btn">注册</button>
            <div class="forgot-links">
              <router-link to="/login" class="forgot-link">登录账号</router-link>
              <router-link to="/forgotpassword" class="forgot-password">忘记密码</router-link>
            </div>
            <p v-if="msg" :class="{ error: isError }" style="text-align:center">{{ msg }}</p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const form = ref({
  iphone: '',
  username: '',
  password: '',
  confirmPassword: ''
});
const msg = ref('');
const isError = ref(false);
const phoneError = ref('');
const usernameError = ref('');
const pwdError = ref('');
const confirmPwdError = ref('');

const handleRegister = async () => {
  phoneError.value = '';
  usernameError.value = '';
  pwdError.value = '';
  confirmPwdError.value = '';
  msg.value = '';
  isError.value = false;

  if (!/^1[3-9]\d{9}$/.test(form.value.iphone)) {
    phoneError.value = '请输入有效的手机号';
    isError.value = true;
    return;
  }
  if (!form.value.username) {
    usernameError.value = '昵称不能为空';
    isError.value = true;
    return;
  }
  if (!form.value.password || form.value.password.length < 6) {
    pwdError.value = '密码不能少于6位';
    isError.value = true;
    return;
  }
  if (form.value.password !== form.value.confirmPassword) {
    confirmPwdError.value = '两次输入的密码不一致';
    isError.value = true;
    return;
  }
  try {
    const res = await axios.post('/api/auth/register', {
      iphone: form.value.iphone,
      username: form.value.username,
      password: form.value.password
    });
    if (res.data.success) {
      // 注册成功后自动登录
      const loginRes = await axios.post('/api/auth/login', {
        iphone: form.value.iphone,
        password: form.value.password
      });
      if (loginRes.data.success) {
        localStorage.setItem('user', JSON.stringify(loginRes.data.user));
        router.push('/chat');
      } else {
        msg.value = '注册成功，请手动登录';
        setTimeout(() => router.push('/login'), 1000);
      }
    } else {
      msg.value = res.data.message || '注册失败';
      isError.value = true;
    }
  } catch (e) {
    msg.value = '网络或服务器错误';
    isError.value = true;
  }
};
</script>

<style lang="scss">
@use './style.scss' as *;

.error-message-inside {
  color: #ff5a5a;
  font-size: 13px;
  display: block;
  margin: 0px 0 0 0;
  text-align: center;
  white-space: normal;
  overflow: visible;
  text-overflow: unset;
}
</style>