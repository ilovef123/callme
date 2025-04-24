<template>
  <div class="moments-page-layout">
    <!-- 内容区居中和宽度控制 -->
    <div class="moments-center-area">
      <!-- 顶部用户信息区 -->
      <div class="moments-header">
        <div class="moments-header-info">
            <div class="moments-header-left">
                  <div class="avatar-wechat moments-header-avatar">我</div>
                  <div class="moments-header-nickname">我的朋友圈</div>
              </div>
              <button class="publish-btn" @click="addModalVisible = true">发布</button>
        </div>
      </div>

      <!-- 动态列表 -->
      <div class="moments-list-wrapper">
        <ul class="moments-list">
          <li v-for="moment in moments" :key="moment.id" class="moment-item">
            <div class="moment-content-wrapper">
              <div class="avatar-wechat moment-author-avatar" :style="{ backgroundColor: moment.color }">
                {{ moment.author[0] }}
              </div>
              <div class="moment-main">
                <div class="moment-author">{{ moment.author }}</div>
                <div class="moment-text selectable">{{ moment.content }}</div>
                <div v-if="moment.imgs && moment.imgs.length" class="moment-imgs">
                  <img v-for="(img, idx) in moment.imgs" :key="idx" :src="img" class="moment-img" alt="动态配图" />
                </div>
                <div class="moment-meta">
                  <span class="moment-time">{{ moment.time }}</span>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- 发布动态弹窗 -->
    <div v-if="addModalVisible" class="add-moment-modal" @click.self="addModalVisible = false">
      <div class="simple-upload-card">
        <div class="simple-upload-title">发布动态</div>
        <textarea v-model="addForm.content" class="simple-upload-textarea" placeholder="说点什么..." rows="3" />
        <input type="file" multiple accept="image/*" @change="onImgChange" class="simple-upload-input" />
        <div class="simple-upload-actions">
          <button class="simple-upload-btn" @click="addMoment">发布</button>
          <button class="simple-upload-btn cancel" @click="addModalVisible = false">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { moments, addModalVisible, addForm, addMoment, onImgChange } from './MomentsPage';
</script>

<style scoped lang="scss">
@import './MomentsPage.scss';
</style>