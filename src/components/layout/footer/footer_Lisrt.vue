<script setup lang="ts">
  import {useContact} from './footer_List'
  const {contacts,technologies,currentYear} = useContact()

</script>

<template>
  <div class="recruitment-container">
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
    
    <!-- 版权信息 -->
    <div class="copyright">Copyright © {{ currentYear }}</div>
  </div>
</template>
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
  max-width: 100%;
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
  width: 60%;
  border: 1px solid #969696;
  margin: 0 auto;
  border-radius: $spacing-xsmall;
  margin-bottom: $spacing-large;
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
  justify-content: space-between; // 使每个 contact-column 之间有间距
  margin-bottom: $spacing-large;
  padding: 0 $spacing-medium; // 添加内边距

  .contact-column {
    display: flex;
    flex-direction: column;
    align-items: center; // 文字居中对齐
    justify-content: center; // 内容居中对齐
    width: 25%; // 设置固定宽度
    min-height: 100px; // 设置最小高度
    padding: $spacing-small; // 内边距
    background-color: #fff; // 柔和的背景颜色
    border: 1px solid $border-color;
    border-radius: $spacing-xsmall; // 圆角边框
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); // 添加默认阴影
    transition: box-shadow 0.3s ease, transform 0.3s ease; // 添加过渡效果
    margin: $spacing-xsmall;

    &:hover {
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2); // 鼠标悬停时增加阴影
      transform: translateY(-5px); // 鼠标悬停时向上移动
    }

    .contact-item {
      display: flex;
      justify-content: flex-start; // 标签和值左对齐
      align-items: center; // 内容居中对齐
      width: 100%;
      margin-bottom: $spacing-small; // 添加底部间距

      .contact-label {
        font-weight: bold;
        margin-right: $spacing-xsmall; // 标签和值之间添加间距
        color: $primary-color;
        font-size: 16px; // 调整字体大小
      }

      .contact-value {
        color: $text-color;
        font-size: 14px; // 调整字体大小
      }
    }
  }
}

// 响应式设计
@media (max-width: 900px) {
  .contact-section {
    flex-direction: column; // 在小屏幕上垂直排列
    align-items: center;
  }

  .contact-column {
    width: 80%; // 调整宽度
    margin-bottom: $spacing-medium; // 添加底部间距
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