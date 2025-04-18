<template>
  <div class="app-container">
    <div class="login-page">
      <a class="top-left-text" href="/">Call Me</a>
      <div class="login-container">
        <!-- 左侧品牌信息 -->
        <div class="brand-section">
          <div class="brand-content">
            <h1 class="brand-name">Me</h1>
            <p class="brand-slogan">
              <span class="chinese-slogan">用心交流</span> <br />
              Communicate with heart
            </p>
          </div>
        </div>

        <!-- 右侧注册表单 -->
        <div class="form-section">
          <form class="login-form" @submit="handleSubmit">
            <h2 class="form-title">注册账号</h2>

            <div class="form-group">
              <input
                v-model="formData.phone"
                type="tel"
                placeholder="请输入手机号"
                required
              />
              <span class="error-message">请输入手机号</span>
            </div>

            <div class="form-group">
              <input
                v-model="formData.code"
                type="text"
                placeholder="请输入验证码"
                required
              />
              <span class="error-message">请输入验证码</span>
              <button
                type="button"
                class="send-code-btn"
                :disabled="countdown > 0"
                @click="sendCode"
              >
                {{ countdown > 0 ? `${countdown}s后重发` : '发送验证码' }}
              </button>
            </div>

            <div class="form-group">
              <input
                v-model="formData.password"
                type="password"
                placeholder="请输入密码"
                required
              />
              <span class="error-message">请输入密码</span>
            </div>

            <div class="form-group">
              <input
                v-model="formData.confirmPassword"
                type="password"
                placeholder="请确认密码"
                required
              />
              <span class="error-message">请确认密码</span>
            </div>

            <button type="submit" class="login-btn">注册</button>
            <div class="forgot-links">
              <router-link to="/register" class="forgot-link">登录账号</router-link>
              <router-link to="/forgotpassword" class="forgot-password">忘记密码</router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
  
<style lang="scss" src="./style.scss"></style>
<script setup lang="ts">
  import { ref } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  import type { FormInstance } from 'element-plus'; // 如果使用 Element Plus

  interface RegisterForm {
  phone: string;
  code: string;
  password: string;
  confirmPassword: string;
}

const formRef = ref<FormInstance>();
const formData = ref<RegisterForm>({
  phone: '',
  code: '',
  password: '',
  confirmPassword: ''
});

const countdown = ref(0);
const router = useRouter();

// 手机号验证正则
const phoneReg = /^1[3-9]\d{9}$/;

// 发送验证码
const sendCode = async () => {
  if (!phoneReg.test(formData.value.phone)) {
    return alert('手机号格式错误');
  }
  
  try {
    await axios.post('/api/send-code', { 
      phone: formData.value.phone 
    });
    startCountdown();
  } catch (error) {
    console.error('发送失败', error);
  }
};

// 倒计时逻辑
const startCountdown = () => {
  countdown.value = 60;
  const timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) clearInterval(timer);
  }, 1000);
};

// 表单提交
const handleSubmit = async (e: Event) => {
  e.preventDefault();
  
  if (formData.value.password !== formData.value.confirmPassword) {
    return alert('两次密码不一致');
  }

  try {
    const response = await axios.post<{ success: boolean }>('/api/register', {
      phone: formData.value.phone,
      code: formData.value.code,
      password: formData.value.password
    });

    if (response.data.success) {
      router.push('/login');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      alert(error.response?.data?.message || '注册失败');
    }
  }
};
</script>