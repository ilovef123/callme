<template>
  <div class="profile-header">
    <div class="profile-header-left">
      <label class="avatar-upload-label" @click="triggerAvatarChange">
        <img :src="getFullUrl(avatarUrl) + '?t=' + Date.now() || defaultAvatar" class="profile-avatar" alt="头像" />
        <div class="avatar-upload-mask">更换头像</div>
        <input ref="avatarInput" type="file" accept="image/*" style="display:none" @change="onAvatarChange" />
      </label>
      <div class="profile-nickname">{{ props.user.nickname }}</div>
    </div>
    <div class="profile-header-right">
      <div class="profile-mobile">{{ props.user.mobile }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 统一补全资源 URL，支持绝对和相对路径
function getFullUrl(url: string) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  if (url.startsWith('data:image/')) return url // 兼容 base64
  return url.startsWith('/') ? 'http://localhost:3001' + url : 'http://localhost:3001/' + url
}
const defaultAvatar = '/default-avatar.png' // 可替换为你自己的默认头像路径

import { ref, watch, defineProps, defineEmits } from 'vue'
import axios from 'axios'
const props = defineProps<{
  user: {
    avatar: string
    nickname: string
    mobile: string
    userId?: string
  }
}>()
const emits = defineEmits(['update:avatar'])

const avatarUrl = ref(props.user.avatar)

async function onAvatarChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file || !props.user.userId) return;
  const formData = new FormData();
  formData.append('avatar', file);
  formData.append('userId', props.user.userId);
  try {
    const res = await axios.post('http://localhost:3001/api/user/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    if (res.data.success) {
      avatarUrl.value = res.data.avatarUrl;
      emits('update:avatar', res.data.avatarUrl);
    } else {
      alert('头像上传失败：' + (res.data.message || '未知错误'));
    }
  } catch (err) {
    alert('头像上传失败');
  }
}

// 响应父组件头像变更
watch(() => props.user.avatar, (val) => {
  avatarUrl.value = val;
})
const avatarInput = ref<HTMLInputElement | null>(null)
function triggerAvatarChange() {
  if (avatarInput.value) {
    avatarInput.value.value = '' // 清空上次选择，确保可重复上传同一文件
    avatarInput.value.click();
  }
}
</script>

<style scoped lang="scss">
@import './UserProfile.scss';
.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 40px 16px 40px;
  background: #fff;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 2px 12px rgba(0,0,0,0.03);
  min-height: 96px;
  margin-bottom: 0;
}
.profile-header-left {
  display: flex;
  align-items: center;
  gap: 22px;
}
.profile-nickname {
  font-size: 22px;
  font-weight: 600;
  color: #222;
}
.profile-header-right {
  display: flex;
  align-items: center;
  gap: 18px;
}
.profile-mobile {
  font-size: 15px;
  color: #888;
  background: #f7f8fa;
  padding: 6px 16px;
  border-radius: 16px;
  font-weight: 500;
}
.avatar-upload-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.avatar-upload-label {
  position: relative;
  display: inline-block;
  cursor: pointer;
}
.profile-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  background: #eee;
  border: 2px solid #e5e6eb;
  transition: box-shadow 0.2s;
}
.avatar-upload-mask {
  display: none;
  position: absolute;
  left: 0; top: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.35);
  color: #fff;
  font-size: 14px;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.avatar-upload-label:hover .avatar-upload-mask {
  display: flex;
  pointer-events: auto;
}
</style>