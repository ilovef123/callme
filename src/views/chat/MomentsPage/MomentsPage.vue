<template>
  <div class="moments-page-layout">
    <div class="moments-center-area">
      <!-- 顶部用户信息区 -->
      <div class="moments-header">
        <div class="moments-header-info">
          <div class="moments-header-left">
            <div class="moments-header-avatar">
              <img :src="getFullUrl(getAvatar(props.user) || getAvatar(localUser) || defaultAvatar)" alt="头像"
                style="width:48px;height:48px;border-radius:50%;object-fit:cover;box-shadow:0 2px 8px rgba(0,0,0,0.08);background:#fff;border:2px solid #e5e6eb;"
                @error="handleAvatarError" />
            </div>
            <div class="moments-header-nickname">{{ props.user?.username || localUser?.username || '未命名用户' }}</div>
          </div>
          <button class="publish-btn" @click="addModalVisible = true">发布</button>
        </div>
      </div>
      <!-- 动态列表 -->
      <div class="moments-list-wrapper">
        <ul class="moments-list">
          <li v-for="moment in moments" :key="moment.id" class="moment-item">
            <div class="moment-card">
              <div class="moment-card-header">
                <img class="avatar-wechat moment-author-avatar"
                     :src="getFullUrl(getAvatar(moment)) + '?t=' + Date.now()" alt="头像"
                     style="width:48px;height:48px;border-radius:50%;object-fit:cover;box-shadow:0 2px 8px rgba(0,0,0,0.08);background:#fff;border:2px solid #e5e6eb;"
                     @error="handleAvatarError" />
                <div class="moment-header-meta">
                  <span class="moment-author">{{ moment.username || '' }}</span>
                  <span class="moment-time" style="color:#bbb;font-size:13px;">{{ formatMomentTime(moment.time || moment.createdAt || moment.date || '', 'YYYY-MM-DD HH:mm') }}</span>
                </div>
              </div>
              <div v-if="(moment.images || moment.imgs || []).length" class="moment-imgs-carousel">
                <div class="carousel-wrapper">
                  <button v-if="(moment.images || moment.imgs || []).length > 1" class="carousel-btn left" @click.stop="moment.carouselIndex = ((moment.carouselIndex || 0) - 1 + (moment.images || moment.imgs || []).length) % (moment.images || moment.imgs || []).length">
                    <Left theme="outline" size="20" fill="#222" />
                  </button>
                  <div class="carousel-media-track">
                    <template v-for="(img, idx) in (moment.images || moment.imgs || [])" :key="idx">
                      <video v-if="isVideo(img)" v-show="(moment.carouselIndex||0) === idx" :src="getFullUrl(img)" class="moment-media" controls autoplay muted loop playsinline :style="carouselTrackStyle(moment, idx)" />
                      <img v-else v-show="(moment.carouselIndex||0) === idx" :src="getFullUrl(img)" class="moment-media" alt="动态配图" :style="carouselTrackStyle(moment, idx)" />
                    </template>
                  </div>
                  <button v-if="(moment.images || moment.imgs || []).length > 1" class="carousel-btn right" @click.stop="moment.carouselIndex = ((moment.carouselIndex || 0) + 1) % (moment.images || moment.imgs || []).length">
                    <Right theme="outline" size="20" fill="#222" />
                  </button>
                </div>
                <div class="carousel-dots" v-if="(moment.images || moment.imgs || []).length > 1">
                  <span v-for="(img, idx) in (moment.images || moment.imgs || [])" :key="idx" :class="['dot', {active: (moment.carouselIndex||0) === idx}]" @click.stop="moment.carouselIndex = idx"></span>
                </div>
              </div>
              <div class="moment-text selectable">{{ moment.content }}</div>
            </div>

          </li>
        </ul>
        <div v-if="!moments.length" class="moments-empty">暂无动态，快来发布第一条吧！</div>
      </div>
    </div>
    <!-- 发布动态弹窗 -->
    <div v-if="addModalVisible" class="add-moment-modal" @click.self="addModalVisible = false">
      <div class="simple-upload-card large">
        <div class="upload-header">
          <span>发布朋友圈</span>
          <button class="upload-close-btn" @click="addModalVisible = false">×</button>
        </div>
        <div class="upload-body">
          <textarea
            v-model="addForm.content"
            class="upload-textarea"
            placeholder="这一刻你想分享什么？（如生活感悟、趣事、照片...）"
            rows="5"
          />
          <div class="upload-img-preview moment-imgs">
            <template v-if="(addForm.imgs || []).length">
              <div v-for="(img, idx) in (addForm.imgs || [])" :key="idx" class="moment-img-wrapper" style="position:relative;display:inline-block;">
                <img :src="getFullUrl(img)" class="moment-img" alt="动态配图" />
                <button class="img-delete-btn" @click.stop="removeImg(idx)" title="删除图片">×</button>
              </div>
            </template>
            <template v-else>
              <div class="upload-img-empty">图片会显示在这里</div>
            </template>
          </div>
          <div class="upload-img-btn-row">
            <label class="upload-img-btn big">
              <input type="file" multiple accept="image/*" @change="onImgChange" hidden />
              <span>📷 选择图片（最多9张）</span>
            </label>
          </div>
        </div>
        <div class="upload-footer">
          <button class="upload-btn" @click="addMoment">发布动态</button>
          <button class="upload-btn cancel" @click="addModalVisible = false">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import axios from 'axios';
import type { PropType } from 'vue';
import { Left, Right } from '@icon-park/vue-next';
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'; // 引入 dayjs

interface User { 
  avatar?: string; 
  username?: string 
  createdAt?: string
}

interface Moment {
  id: string;
  author: string;
  color: string;
  content: string;
  imgs?: string[];
  images?: string[];
  time: string;
  carouselIndex?: number;
  avatar?: string;
  username?: string;
  userId?: string;
  createdAt?: string;
  date?: string;
}

const props = withDefaults(defineProps<{
  user?: User 
}>(), {
  user: () => ({})
})

const localUser = JSON.parse(localStorage.getItem('user') || '{}');
import logoImg from '@/assets/images/logo.png';
const defaultAvatar = logoImg; // 未上传头像时用 logo 兜底

import getFullUrl from '@/utils/getFullUrl';

function isVideo(url: string): boolean {
  return /\.(mp4|webm|ogg|mov|avi)$/i.test(url)
}

// moments 类型声明，避免 v-for 推断为 never
const moments = ref<Moment[]>([])

async function fetchMoments() {
  try {
    const res = await axios.get('/api/moment/list');
    moments.value = res.data;
  } catch (e) {
    moments.value = [];
  }
}

onMounted(() => {
  fetchMoments();
  // 监听全局用户信息更新事件，实现动态刷新
  window.addEventListener('userInfoUpdated', fetchMoments);
});

onUnmounted(() => {
  window.removeEventListener('userInfoUpdated', fetchMoments);
});

// 为每条 moment 添加 carouselIndex 属性（响应式）
watch(moments, (ms) => {
  (ms || []).forEach((m: Moment) => {
    if (typeof m.carouselIndex !== 'number') m.carouselIndex = 0;
  });
}, { immediate: true, deep: true });

const route = useRoute();

onMounted(() => {
  // 打印所有动态的 avatar 字段，方便调试
  console.log('【调试】moments.value:', (moments.value || []).map(m => m.avatar));
  nextTick(() => {
    (moments.value || []).forEach((m: Moment) => {
      if (typeof m.carouselIndex !== 'number') m.carouselIndex = 0;
    });
  });
});
watch(() => route.fullPath, () => {});

// 兼容 imgs/images 的轮播样式
function carouselTrackStyle(moment: any, idx: number) {
  const active = (moment.carouselIndex || 0) === idx;
  return {
    transition: 'transform 0.45s cubic-bezier(.23,1,.32,1)',
    transform: `translateX(${((idx - (moment.carouselIndex || 0)) * 100)}%)`,
    position: 'absolute' as const,
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    opacity: active ? 1 : 0,
    zIndex: active ? 2 : 1
  };
}

function getAvatar(obj: any) {
  if (!obj) return '';
  return obj.avatar || '';
}

function handleAvatarError(e: Event) {
  const t = e.target as HTMLImageElement | null;
  if (t) t.src = defaultAvatar;
}

// 发布动态弹窗与表单逻辑
const addModalVisible = ref(false)
const addForm = ref({ content: '', imgs: [] as string[], files: null as null | FileList })

function onImgChange(e: Event) {
  const files = (e.target as HTMLInputElement).files;
  if (files) {
    addForm.value.files = files; // 保存 FileList 用于发布
    addForm.value.imgs = Array.from(files).map(file => window.URL.createObjectURL(file)); // 只做预览
  }
}

function removeImg(idx: number) {
  addForm.value.imgs.splice(idx, 1)
}

async function addMoment() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  // 兼容 userId 和 _id
  const uid = user.userId || user._id;
  if (!uid) {
    alert('请先登录后再发布动态');
    return;
  }
  if (!addForm.value.content) {
    alert('内容不能为空');
    return;
  }
  const formData = new FormData();
  formData.append('userId', uid);
  formData.append('content', addForm.value.content);
  if (addForm.value.files) {
    Array.from(addForm.value.files).forEach(file => formData.append('imgs', file));
  }
  try {
    await axios.post('/api/moment/add', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    alert('发布成功');
    addModalVisible.value = false;
    addForm.value.content = '';
    addForm.value.imgs = [];
    addForm.value.files = null;
    // 发布后自动刷新动态列表
    await fetchMoments();
  } catch (e) {
    alert('发布失败');
  }
}

// 兼容 formatMomentTime 支持格式化字符串
function formatMomentTime(time: string, format = 'YYYY-MM-DD HH:mm'): string {
  if (!time) return '';
  const d = dayjs(time);
  return d.isValid() ? d.format(format) : '';
}

console.log('moments:', moments.value)
</script>

<style lang="scss">
@use './MomentsPage.scss' as *;
.moments-page-layout {
  display: flex;
  justify-content: center;
  padding: 20px;
}
.moment-publish textarea {
  flex: 1;
  min-height: 48px;
  resize: vertical;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #eee;
}
.moment-publish button {
  padding: 8px 18px;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.moments-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.moment-item {
  background: #fff;
  border-radius: 8px;
  padding:0x 18px;
}
.moment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 7px;
  color: #888;
  font-size: 13px;
}
.moment-content {
  font-size: 15px;
  margin-bottom: 6px;
}
.moment-images {
  display: flex;
  gap: 6px;
}
.moment-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #eee;
}

</style>
