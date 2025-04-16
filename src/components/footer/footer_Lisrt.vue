<script setup lang="ts">
  import {useContact} from './footer_List'
  const {contacts,technologies,currentYear} = useContact()

</script>

<template>
  <div class="recruitment-container">
    
    
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



// 版权信息
.copyright {
  text-align: center;
  font-size: 14px;
  color: var(--text-color) !important;
  padding-top: $spacing-small;
  border-top: 1px solid $border-color;
}
</style>