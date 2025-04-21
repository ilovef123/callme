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
            <!-- <span class="error-message">测试红字</span> -->
            <div class="form-group input-error-group">
      <input v-model="formData.phone" type="text" placeholder="请输入手机号" autocomplete="off" :class="{ 'input-error': phoneError }" />
      <span class="error-message-inside" v-if="phoneError">{{ phoneError }}</span>
    </div>
    <div class="form-group input-error-group">
      <input v-model="formData.password" type="password" placeholder="请输入密码" autocomplete="off" :class="{ 'input-error': pwdError }" />
      <span class="error-message-inside" v-if="pwdError">{{ pwdError }}</span>
    </div>
    <div class="form-group input-error-group">
      <input v-model="formData.confirmPassword" type="password" placeholder="请确认密码" autocomplete="off" :class="{ 'input-error': confirmPwdError }" />
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
const formData = ref({
  phone: '',
  password: '',
  confirmPassword: ''
});
const msg = ref('');
const isError = ref(false);

const phoneError = ref('');
const pwdError = ref('');
const confirmPwdError = ref('');

const validate = () => {
  let valid = true;
  phoneError.value = '';
  pwdError.value = '';
  confirmPwdError.value = '';
  if (!/^1[3-9]\d{9}$/.test(formData.value.phone)) {
    phoneError.value = '手机号格式错误';
    valid = false;
  }
  if (!formData.value.password) {
    pwdError.value = '请输入密码';
    valid = false;
  } else if (formData.value.password.length < 6) {
    pwdError.value = '密码长度不能少于6位';
    valid = false;
  }
  if (formData.value.password !== formData.value.confirmPassword) {
    confirmPwdError.value = '两次密码不一致';
    valid = false;
  }
   // 这里加一行
   console.log('phoneError:', phoneError.value, 'pwdError:', pwdError.value, 'confirmPwdError:', confirmPwdError.value);
  return valid;
};

const handleRegister = async () => {
  msg.value = '';
  isError.value = false;
  if (!validate()) return;
  try {
    const res = await axios.post('http://localhost:3001/api/auth/register', {
      username: formData.value.phone,
      password: formData.value.password
    });
    msg.value = res.data.message || '注册成功';
    isError.value = false;
    // 可选：注册成功后自动跳转
    // router.push('/login');
  } catch (err: any) {
    msg.value = err.response?.data?.message || '注册失败';
    isError.value = true;
  }
};
</script>

<style lang="scss" src="./style.scss"></style>