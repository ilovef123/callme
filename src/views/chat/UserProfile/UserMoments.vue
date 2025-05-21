<template>
  <div class="moments-center-area">
    <div class="moments-header">
      <div class="moments-header-info">
        <div class="moments-header-left">
          <div class="moments-header-avatar">
            <img :src="getFullUrl(getAvatar(props.user)) + '?t=' + Date.now()"
                 alt="头像"
                 style="width:48px;height:48px;border-radius:50%;object-fit:cover;box-shadow:0 2px 8px rgba(0,0,0,0.08);background:#fff;border:2px solid #e5e6eb;"
                 @error="e => { if(e && e.target) (e.target as HTMLImageElement).src = defaultAvatar; }"
            />
            <input ref="avatarInputRef" type="file" accept="image/*" style="display:none" @change="onAvatarChange" />
          </div>
          <div class="moments-header-nickname">{{ props.user?.username || '未命名用户' }}</div>
        </div>
        <div>
          <button class="publish-btn" style="margin-right:12px;" @click="triggerAvatarChange">更改头像</button>
          <button class="publish-btn" @click="triggerNicknameChange">更改昵称</button>
        </div>
      </div>
    </div>
    <div class="moments-list-wrapper">
      <ul v-if="myMoments.length > 0">
        <li v-for="(moment, idx) in myMoments" :key="moment.id || moment._id || idx" class="moment-item">
          <div class="moment-card">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <div class="moment-card-header">
              <img class="avatar-wechat moment-author-avatar"
                   :src="getFullUrl(getAvatar(moment)) || defaultAvatar"
                   alt="头像"
                   style="width:48px;height:48px;border-radius:50%;object-fit:cover;box-shadow:0 2px 8px rgba(0,0,0,0.08);background:#fff;border:2px solid #e5e6eb;"
                   @error="e => { if(e && e.target) (e.target as HTMLImageElement).src = defaultAvatar; }"
              />
              <div class="moment-header-meta">
                <!-- y<span class="moment-author">{{ moment.nickname || moment.username || '' }}</span> -->
                <div>
                  <span class="moment-username" style="color:#000;font-size:14px;font-weight: bold;">{{ moment.username || moment.user?.username || props.user?.username || '' }}</span>
                </div>
                <div>
                  <span class="moment-time" style="color:#bbb;font-size:13px;">{{ formatMomentTime(moment.time || '') }}</span>
                </div>
              </div>
            </div>
            <!-- 关闭 .moment-card-header 的 div -->
          </div>
          <!-- 关闭 flex 的 div -->
          <div v-if="(moment.images || moment.imgs || []).length" class="moment-imgs-carousel">
              <div class="carousel-wrapper">
                <button v-if="((moment.images || moment.imgs || []).length > 1)" class="carousel-btn left" @click.stop="moment.carouselIndex = ((moment.carouselIndex || 0) - 1 + (moment.images || moment.imgs || []).length) % (moment.images || moment.imgs || []).length">
                  <Left theme="outline" size="20" fill="#222" />
                </button>
                <div class="carousel-media-track">
                  <template v-for="(img, idx) in (moment.images || moment.imgs || [])" :key="idx">
                    <video v-if="isVideo(img)" v-show="(moment.carouselIndex || 0) === idx" :src="getFullUrl(img)" class="moment-media" controls autoplay muted loop playsinline :style="carouselTrackStyle(moment, idx)" />
                    <img v-else v-show="(moment.carouselIndex || 0) === idx" :src="getFullUrl(img)" class="moment-media" alt="动态配图" :style="carouselTrackStyle(moment, idx)" />
                  </template>
                </div>
                <button v-if="((moment.images || moment.imgs || []).length > 1)" class="carousel-btn right" @click.stop="moment.carouselIndex = ((moment.carouselIndex || 0) + 1) % (moment.images || moment.imgs || []).length">
                  <Right theme="outline" size="20" fill="#222" />
                </button>
              </div>
              <div class="carousel-dots" v-if="((moment.images || moment.imgs || []).length > 1)">
                <span v-for="(img, idx) in (moment.images || moment.imgs || [])" :key="idx" :class="['dot', {active: (moment.carouselIndex || 0) === idx}]" @click.stop="moment.carouselIndex = idx"></span>
              </div>
            </div>
            <div style="margin-top:8px;">
              <div class="moment-text selectable" style="margin-top:4px;">{{ (moment as any).content }}</div>
            </div>
            <button class="profile-action-btn" style="margin:8px 0 0 0;background:#ff4d4f;" @click="deleteMoment(String(moment._id || moment.id || ''))">删除</button>
          </div>
        </li>
      </ul>
      <div v-if="myMoments.length === 0" class="moments-empty">暂无动态</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits, computed, unref } from 'vue'
import axios from 'axios'

interface Moment {
  id?: string;
  _id?: string;
  author?: string;
  color?: string;
  content?: string;
  imgs?: string[];
  images?: string[];
  time?: string;
  carouselIndex?: number;
  avatar?: string;
  username?: string;
  userId?: string;
  nickname?: string;
  user?: { userId?: string; username?: string };
}

// 判断是否为视频链接
function isVideo(url: string): boolean {
  return /\.(mp4|webm|ogg|mov|avi)$/i.test(url)
}

// 轮播图样式
function carouselTrackStyle(moment: Moment, idx: number) {
  const active = (moment.carouselIndex || 0) === idx;
  return {
    transition: 'transform 0.45s cubic-bezier(.23,1,.32,1)' as const,
    transform: 'translateX(' + (((idx - (moment.carouselIndex || 0)) * 100)) + '%)',
    position: 'absolute' as const,
    top: '0' as const,
    left: '0' as const,
    width: '100%' as const,
    height: '100%' as const,
    opacity: active ? '1' as const : '0' as const,
    zIndex: active ? '2' as const : '1' as const
  };
}

// 先定义 props
const props = defineProps<{
  user: { username?: string; userId?: string; avatar?: string };
  moments: Moment[];
}>()

function triggerNicknameChange() {
  const newName = prompt('请输入新的昵称：', props.user.username || '');
  if (!newName || newName === props.user.username) return;
  if (!props.user.userId) return alert('用户信息异常，无法修改昵称！');
  axios.post('/api/user/updateNickname', {
    userId: props.user.userId,
    nickname: newName
  }).then(res => {
    if (res.data && res.data.success) {
      alert('昵称修改成功！');
      // 自动拉取最新用户信息并更新前端显示
      axios.get('/api/user/detail', {
        params: { userId: props.user.userId }
      }).then(resp => {
        if (resp.data && resp.data.user) {
          props.user.username = resp.data.user.username;
          // 同步 localStorage，确保全局昵称一致
          const localUser = JSON.parse(localStorage.getItem('user') || '{}');
          localUser.nickname = resp.data.user.username;
          localUser.username = resp.data.user.username;
          localStorage.setItem('user', JSON.stringify(localUser));
          // 派发全局事件，通知其他页面刷新用户信息
          window.dispatchEvent(new Event('userInfoUpdated'));
        }
      });

    } else {
      alert(res.data.message || '昵称修改失败');
    }
  }).catch(() => {
    alert('请求失败，稍后重试');
  });
}

// 时间格式化函数
function formatMomentTime(time: string | number | Date) {
  if (!time) return '';
  const date = new Date(time);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return y + '-' + m + '-' + d + ' ' + hh + ':' + mm;
}


import getFullUrl from '@/utils/getFullUrl';

function getAvatar(obj: any) {
  if (!obj) return '';
  return obj.avatar || '';
}

import logoImg from '@/assets/images/logo.png';
const defaultAvatar = logoImg // 可替换为你自己的 logo 头像

// 头像上传相关，只保留一份
const avatarInputRef = ref<HTMLInputElement | null>(null)
const emits = defineEmits(['update:avatar'])
const avatarUrl = ref(props.user?.avatar || '')
watch(() => props.user?.avatar, (val) => { avatarUrl.value = val || '' }, { immediate: true })
function triggerAvatarChange() {
  avatarInputRef.value?.click()
}

// 只显示当前用户自己的动态，严格用 userId 匹配并转字符串避免类型问题
const myMoments = computed<Moment[]>(() => {
  return (props.moments as Moment[] || []).filter(m => String(m.userId) === String(props.user?.userId));
});

console.log('【UserMoments 调试】props.moments:', props.moments)
console.log('【UserMoments 调试】props.user:', props.user)
console.log('【UserMoments 调试】myMoments:', myMoments.value)
if (props.moments && props.moments.length > 0 && myMoments.value.length === 0) {
  console.warn('【UserMoments 警告】props.moments 有数据，但 myMoments 过滤后为空！请检查过滤条件 userId:', props.user?.userId);
}

// 头像上传相关
async function onAvatarChange(event: Event) {
  console.log('[头像上传] props.user:', props.user);
  let userId = props.user && props.user.userId;
  if (!userId) {
    // 兜底：尝试从 localStorage 获取 userId
    try {
      const localUser = JSON.parse(localStorage.getItem('user') || '{}');
      userId = localUser._id || localUser.userId || '';
    } catch (e) {}
  }
  if (!userId) {
    alert('用户信息异常，无法上传头像！');
    return;
  }
  // 强制同步 userId 到 props.user，避免后续逻辑出错
  props.user.userId = userId;
  if (typeof props.user.userId !== 'string' || !props.user.userId.match(/^\w{24}$/)) {
    alert('userId 异常，当前 userId: ' + props.user.userId);
    return;
  }
  console.log('[头像上传] 当前 user:', props.user);
  console.log('[头像上传] userId:', props.user.userId, typeof props.user.userId);
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  console.log('[头像上传] userId:', props.user.userId, 'file:', file);
  const formData = new FormData();
  formData.append('avatar', file);
  formData.append('userId', props.user.userId);
  try {
    const res = await axios.post('/api/user/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    console.log('[头像上传] 接口响应:', res);
    if (res.data.success && res.data.avatarUrl) {
      if (res.data.success) {
        avatarUrl.value = res.data.avatarUrl;
        // 更新所有本人动态的头像字段
        if (props.moments && Array.isArray(props.moments) && props.user && props.user.userId) {
          props.moments.forEach((m: any) => {
            if (m.userId === props.user.userId) {
              m.avatar = res.data.avatarUrl;
            }
          });
        }
        emits('update:avatar', res.data.avatarUrl);
      } else {
        // 加时间戳防止缓存
        const newUrl = res.data.avatarUrl + '?t=' + Date.now();
        // 更新 localStorage（便于刷新后同步）
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.avatar = newUrl;
        localStorage.setItem('user', JSON.stringify(user));
      }
    } else {
      alert('头像上传失败：' + (res.data.message || '未知错误'));
    }
  } catch (err) {
    const e = err as any;
    if (e.response) {
      // 服务器有响应，但返回错误状态码
      console.error('[头像上传] 服务器响应错误:', e.response.status, e.response.data);
      alert('头像上传失败：' + (e.response.data.message || '服务器错误'));
    } else if (e.request) {
      // 请求已发出但无响应
      console.error('[头像上传] 请求无响应:', e.request);
      alert('头像上传失败，请检查网络或稍后重试');
    } else {
      // 其它错误
      console.error('[头像上传] 发生错误:', e.message);
      alert('头像上传失败：' + e.message);
    }
  }
}
// 发布动态成功后也触发刷新
function onMomentAddSuccess() {
  window.dispatchEvent(new Event('userMomentsUpdated'));
}

// 删除动态
async function deleteMoment(id: string) {
  if (!id) return alert('动态ID异常，无法删除');
  if (!confirm('确定要删除这条动态吗？')) return;
  try {
    const res = await axios.delete(`/api/moment/delete/${id}`);
    if (res.data && res.data.success) {
      alert('删除成功');
      // 重新拉取动态列表
      window.dispatchEvent(new Event('userMomentsUpdated'));
    } else {
      alert(res.data.message || '删除失败');
    }
  } catch (e) {
    const err = e as any;
    if (err.response && err.response.data && err.response.data.message) {
      alert('删除失败: ' + err.response.data.message);
    } else {
      alert('请求失败，稍后重试');
    }
  }
}

</script>


<style scoped lang="scss">
@use './UserMoments.scss' as *;
</style>