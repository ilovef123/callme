<template>
  <div class="profile-moments-page">
    <!-- <UserProfile :user="user" /> -->
    <hr class="profile-divider" />
    <UserMoments :user="user" :moments="moments" @update:avatar="handleAvatarUpdate" />
  </div>
</template>

<script setup lang="ts">
import UserProfile from './UserProfile/UserProfile.vue'
import UserMoments from './UserProfile/UserMoments.vue'
import { ref, onMounted, onUnmounted, watch } from 'vue'
import axios from 'axios'

interface User {
  avatar: string;
  nickname: string;
  username: string;
  mobile: string;
  userId: string;
}

let userObj: User = {
  avatar: 'https://img1.baidu.com/it/u=1234567890,1234567890&fm=253&fmt=auto&app=138&f=JPEG?w=300&h=300',
  nickname: '未登录',
  username: '',
  mobile: '',
  userId: '680f6ea97e1d1de90dc7032e'
};

const local = localStorage.getItem('user');
if (local) {
  try {
    const u = JSON.parse(local);
    userObj = {
      avatar: u.avatar || u.avatarUrl || userObj.avatar,
      nickname: u.nickname || u.username || u.mobile || u.iphone || '未命名用户',
      username: u.username || '',
      mobile: u.mobile || u.iphone || '',
      userId: (u._id || u.userId || userObj.userId || '').toString()
    }
    if (!userObj.userId) userObj.userId = '680f6ea97e1d1de90dc7032e';
  } catch (e) {
    userObj.userId = '680f6ea97e1d1de90dc7032e';
  }
}
const user = ref<User>(userObj);

function setUser(userObj: User) {
  localStorage.setItem('user', JSON.stringify(userObj));
  window.dispatchEvent(new Event('storage'));
}

function handleAvatarUpdate(newUrl: string) {
  user.value.avatar = newUrl;
  setUser(user.value);
  fetchUserMoments(); // 头像变更后立即刷新动态，确保头像实时同步
}

const moments = ref<any[]>([])
async function fetchUserMoments() {
  console.log('【ProfilePage 调试】fetchUserMoments 请求参数 userId:', user.value.userId)
  const res = await axios.get('/api/moment/list', {
    params: { userId: user.value.userId }
  })
  console.log('【ProfilePage 调试】fetchUserMoments 接口返回:', res.data)
  moments.value = (res.data || []).map((item: any) => ({
    id: item._id,
    userId: item.userId,
    content: item.content,
    imgs: item.images || [],
    time: item.createdAt || '',
    avatar: item.avatar,
    username: item.username
  }));
  console.log('【ProfilePage 调试】moments.value:', moments.value)
}

onMounted(() => {
  fetchUserMoments();
  const handler = () => fetchUserMoments();
  window.addEventListener('userMomentsUpdated', handler);
});
onUnmounted(() => {
  window.removeEventListener('userMomentsUpdated', fetchUserMoments);
});
watch(() => user.value.userId, () => { fetchUserMoments() })
</script>

<style scoped>
.profile-moments-page {
  width: 100%;
  min-height: 100vh;
  background: #fff;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
}
.profile-divider {
  border: none;
  border-top: 1px solid #e5e6eb;
  margin: 0 32px 16px 32px;
}
:global(html, body, #app) {
  overflow-y: auto !important;
  height: auto !important;
}
</style>
