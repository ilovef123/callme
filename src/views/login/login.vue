<template>
  <div class="app-container">
    <div class="login-page">
      <a class="top-left-text" href="/">Call Me</a>
      <div class="login-container">
        <!-- 左侧品牌信息 -->
        <div class="brand-section">
          <div class="brand-content">
            <h1 class="brand-name" v-once>Me</h1>
            <p class="brand-slogan" v-once>
              <span class="chinese-slogan">用心交流</span> <br> Communicate with heart
            </p>
          </div>
        </div>
        <!-- 右侧登录表单 -->
        <div class="form-section">
          <form class="login-form" @submit.prevent="handleLogin">
            <h2 class="form-title" v-once>账号登录</h2>
            <div class="form-group input-error-group">
      <input v-model="phone" type="text" placeholder="请输入手机号" autocomplete="off" :class="{ 'input-error': phoneError }" />
      <span class="error-message-inside" v-if="phoneError">{{ phoneError }}</span>
    </div>
    <div class="form-group input-error-group">
      <input v-model="password" type="password" placeholder="请输入密码" autocomplete="off" :class="{ 'input-error': pwdError }" />
      <span class="error-message-inside" v-if="pwdError">{{ pwdError }}</span>
    </div>
            <button type="submit" class="login-btn">进入</button>
            <div class="forgot-links">
              <router-link to="/register" class="forgot-link">注册账号</router-link>
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
const phone = ref('');
const password = ref('');
const msg = ref('');
const isError = ref(false);
const phoneError = ref('');
const pwdError = ref('');

// 校验
const validate = () => {
  let valid = true;
  phoneError.value = '';
  pwdError.value = '';
  if (!/^1[3-9]\d{9}$/.test(phone.value)) {
    phoneError.value = '手机号格式错误';
    valid = false;
  }
  if (!password.value) {
    pwdError.value = '请输入密码';
    valid = false;
  }
  return valid;
};

const handleLogin = async () => {
  msg.value = '';
  if (!validate()) return;
  try {
    const res = await axios.post('http://localhost:3001/api/auth/login', {
      username: phone.value,
      password: password.value
    });
    msg.value = res.data.message || '登录成功';
    isError.value = false;
    // 登录成功后可跳转首页
    // router.push('/home');
  } catch (err: any) {
    msg.value = err.response?.data?.message || '登录失败';
    isError.value = true;
  }
};
</script>

<style lang="scss" src="./style.scss"></style>