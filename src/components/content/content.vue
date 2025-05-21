<script setup lang="ts">
  import {useContact} from './content'
  import Content_main from './content_main.vue'
  const {contacts,technologies,currentYear} = useContact()

</script>

<template>

  <div class="recruitment-container">
    <Content_main />
    <!-- 主标题 -->
    <h1 class="main-title">成为 <span class="highlight">开源</span> 贡献者</h1>
    
    <!-- 主要内容 -->
    <div class="content">
      <!-- 副标题 -->
      <h2 class="subtitle">开源贡献者</h2>
      
      <!-- 作者 -->
      <div class="author">Heath</div>
      
      <p style="text-align: center;font-size: 18px;">
          本项目基于 Vue3 + Vite 构建，采用 TypeScript 实现组件化开发。
          <br>
          集成了现代化的聊天、动态（朋友圈）、登录等功能。
      
      </p>

    </div>
    
    <!-- 联系信息 -->
    <div class="contact-section">
      <div class="contact-column" v-for="(contact, index) in contacts" :key="index">
        <div class="contact-item">
          <div class="contact-label">姓名：</div>
          <div class="contact-value">{{ contact.name }}</div>
        </div>
        <div class="contact-item">
          <div class="contact-label">邮箱：</div>
          <div class="contact-value">{{ contact.email }}</div>
        </div>
        <div class="contact-item">
          <div class="contact-label">电话：</div>
          <div class="contact-value">{{ contact.phone }}</div>
        </div>
      </div>
    </div>
    
    
  </div>
</template>
<style lang="scss" scoped>
@use './content.scss' as *; // 添加命名空间声明
</style>