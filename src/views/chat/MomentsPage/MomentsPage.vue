<template>
  <div class="moments-page-layout">
    <div class="moments-center-area">
      <!-- 顶部用户信息区 -->
      <div class="moments-header">
        <div class="moments-header-info">
          <div class="moments-header-left">
            <div class="avatar-wechat moments-header-avatar">
              <img
  :src="getFullUrl(user?.avatar || localUser?.avatar || defaultAvatar)"
  alt="头像"
  style="width:48px;height:48px;border-radius:50%;object-fit:cover;box-shadow:0 2px 8px rgba(0,0,0,0.08);background:#fff;border:2px solid #e5e6eb;"
  @error="e => { if(e.target) (e.target as HTMLImageElement).src = defaultAvatar }"
/>
</div>
            <div class="moments-header-nickname">动态</div>
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
      <div class="avatar-wechat moment-author-avatar">
  <img :src="getFullUrl(moment.avatar) + '?t=' + Date.now()"
  alt="头像"
  style="width:40px;height:40px;border-radius:50%;object-fit:cover;box-shadow:0 2px 8px rgba(0,0,0,0.08);background:#fff;border:2px solid #e5e6eb;"
  @error="e => e.target.src = defaultAvatar"
/>
</div>
      <div class="moment-header-meta">
        <span class="moment-author">{{ moment.username }}</span>
        <span class="moment-time">{{ moment.time }}</span>
      </div>
    </div>
    <div v-if="moment.imgs && moment.imgs.length" class="moment-imgs-carousel">
      <div class="carousel-wrapper">
        <button v-if="moment.imgs.length > 1" class="carousel-btn left" @click.stop="moment.carouselIndex = (moment.carouselIndex - 1 + moment.imgs.length) % moment.imgs.length">
  <Left theme="outline" size="20" fill="#222" />
</button>
        <div class="carousel-media-track">
  <template v-for="(img, idx) in moment.imgs" :key="idx">
    <video v-if="isVideo(img)" v-show="(moment.carouselIndex||0) === idx" :src="img" class="moment-media" controls autoplay muted loop playsinline :style="carouselTrackStyle(moment, idx)" />
    <img v-else v-show="(moment.carouselIndex||0) === idx" :src="img" class="moment-media" alt="动态配图" :style="carouselTrackStyle(moment, idx)" />
  </template>
</div>
        <button v-if="moment.imgs.length > 1" class="carousel-btn right" @click.stop="moment.carouselIndex = (moment.carouselIndex + 1) % moment.imgs.length">
  <Right theme="outline" size="20" fill="#222" />
</button>
      </div>
      <div class="carousel-dots" v-if="moment.imgs.length > 1">
        <span v-for="(img, idx) in moment.imgs" :key="idx" :class="['dot', {active: (moment.carouselIndex||0) === idx}]" @click.stop="moment.carouselIndex = idx"></span>
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
  <template v-if="addForm.imgs && addForm.imgs.length">
    <div v-for="(img, idx) in addForm.imgs" :key="idx" class="moment-img-wrapper" style="position:relative;display:inline-block;">
  <img :src="img" class="moment-img" alt="动态配图" />
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
// 保证顶部头像多级兜底
const localUser = JSON.parse(localStorage.getItem('user') || '{}');
import logoImg from '@/assets/images/logo.png';
const defaultAvatar = logoImg; // 未上传头像时用 logo 兜底
function getFullUrl(url: string) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('data:image/')) return url; // 兼容 base64
  return url.startsWith('/') ? 'http://localhost:3001' + url : 'http://localhost:3001/' + url;
};

import { moments, addModalVisible, addForm, addMoment, onImgChange, fetchMoments, carouselIndex, carouselPrev, carouselNext, carouselGo, removeImg, carouselTrackStyle } from './MomentsPage';
import { onMounted, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { Left, Right } from '@icon-park/vue-next';

// 判断是否为视频文件
function isVideo(url: string): boolean {
  return /\.mp4$|\.webm$|\.ogg$|\.mov$/i.test(url);
}

// 为每条 moment 添加 carouselIndex 属性（响应式）
watch(moments, (ms) => {
  ms.forEach((m: any) => {
    if (typeof m.carouselIndex !== 'number') m.carouselIndex = 0;
  });
}, { immediate: true, deep: true });

const route = useRoute();

onMounted(async () => {
  await fetchMoments();
  // 打印所有动态的 avatar 字段，方便调试
  console.log('【调试】moments.value:', moments.value.map(m => m.avatar));
  nextTick(() => {
    moments.value.forEach((m: any) => {
      if (typeof m.carouselIndex !== 'number') m.carouselIndex = 0;
    });
  });
});
watch(() => route.fullPath, fetchMoments);
</script>

<style lang="scss">
@import './MomentsPage.scss';
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
