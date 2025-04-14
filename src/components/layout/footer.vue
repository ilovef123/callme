<template>
  <div class="recruitment-container">
    <!-- 主标题 -->
    <h1 class="main-title">加入我们，成为 <span class="highlight">开源</span> 贡献者</h1>
    
   
    <!-- 主要内容 -->
    <div class="content">
       <!-- 副标题 -->
    <h2 class="subtitle">开源贡献者</h2>
    
    <!-- 作者 -->
    <div class="author">Heath</div>
    
      <p>
        我们致力于打造一个 <strong>多元化、充满活力的</strong> 开源生态及社区，
        使用的技术涵盖了如 {{ technologies.join('、') }} 等多个领域，
        无论你是刚开始探索开源，还是已经拥有丰富的开发经验，
        这里都有适合你的项目和机会！欢迎您加入我们！
      </p>
    </div>
    
    <!-- 联系信息 -->
    <div class="contact-section">
      <div class="contact-column">
        <div class="contact-label">E-Mail</div>
        <div class="contact-label">QQ-Group</div>
      </div>
      <div class="contact-column">
        <div class="contact-value">电子邮件 duwenhengmr@163.com</div>
        <div class="contact-value">QQ群 729158695</div>
      </div>
    </div>
    
    <!-- 版权信息 -->
    <div class="copyright">Copyright © {{ currentYear }} Linyu All Rights Reserved.</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const technologies = ref([
  'Vue', 'React', 'Flutter', 'Spring Boot', 'Tauri', 'Nuxt'
])

const currentYear = computed(() => new Date().getFullYear())
</script>

<style lang="scss">
// 颜色变量
$primary-color: #1890ff;
$text-color: #333;
$secondary-text: #666;
$muted-text: #888;
$border-color: #e8e8e8;

// 字体变量
$font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
$base-font-size: 16px;

// 间距变量
$spacing-large: 40px;
$spacing-medium: 30px;
$spacing-small: 15px;
$spacing-xsmall: 10px;

.recruitment-container {
  font-family: $font-family;
  max-width: 800px;
  margin: 0 auto;
  padding: $spacing-large $spacing-medium;
  color: $text-color;
  line-height: 1.6;
}

.main-title {
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  margin-bottom: $spacing-small;
  line-height: 1.3;
  
  .highlight {
    color: $primary-color;
  }
}



.content {
  border: 1px solid #969696;
  border-radius: $spacing-xsmall;
  margin-bottom: $spacing-xsmall;
  font-size: $base-font-size;
  text-align: justify;
  padding: $spacing-large;

  .subtitle {
    font-size: 24px;
    text-align: center;
    margin-bottom: $spacing-xsmall;
    font-weight: normal;
    color: $secondary-text;
  }
  .author {
    text-align: center;
    font-style: italic;
    margin-bottom: $spacing-medium;
    color: $muted-text;
  }
  strong {
    color: $primary-color;
    font-weight: bold;
  }
}

.contact-section {
  display: flex;
  justify-content: center;
  margin-bottom: $spacing-large;
  
  .contact-column {
    display: flex;
    flex-direction: column;
    
    &:first-child {
      text-align: right;
      padding-right: $spacing-small;
      border-right: 1px solid $border-color;
    }
    
    &:last-child {
      text-align: left;
      padding-left: $spacing-small;
    }
  }
  
  .contact-label {
    font-weight: bold;
    margin-bottom: $spacing-small;
    color: $primary-color;
  }
  
  .contact-value {
    margin-bottom: $spacing-small;
  }
}

// 版权信息
.copyright {
  text-align: center;
  font-size: 14px;
  color: $secondary-text;
  padding-top: $spacing-small;
  border-top: 1px solid $border-color;
}
</style>