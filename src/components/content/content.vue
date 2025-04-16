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
      
      <p>
        我们致力于打造一个 <strong>多元化、充满活力的</strong> 开源生态及社区，
        使用的技术涵盖了如 {{technologies.join('、') }} 等多个领域，
        无论你是刚开始探索开源，还是已经拥有丰富的开发经验，
        这里都有适合你的项目和机会！欢迎您加入我们！
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