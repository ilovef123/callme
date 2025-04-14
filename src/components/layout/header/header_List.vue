<script setup lang="ts">
  import {useMenu} from './header_List.ts'
  const {menus} = useMenu()

</script>

<template>
  <header>
    <div class="logo">
      <h1>LOGO</h1>
    </div>
    <div class="headerlist">
      <a 
        v-for="(item, index) in menus" 
        :key="index"
        href="#" 
        class="link"
      >
        <span class="icon">
          <i><component :is="item.icon"/></i>
        </span>
        <span class="txt">{{ item.name }}</span>
      </a>
    </div>
  </header>
</template>
<style scoped>
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    height: 60px;
    background-color: #fff;
    box-shadow: 0 6px 12px -2px rgba(184, 233, 255, 0.8);
    /* background: linear-gradient(rgb(255, 255, 255) 80%, rgb(184, 233, 255) 100%); */
  }

  /* 右导航栏样式 */
  header .headerlist{
    display: flex;
    align-items: center;
    justify-content: center;
    /* min-height: 100svh;
    background: #e8e8e8; */
  }
  .headerlist .link {
      position: relative;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 70px;
      height: 50px;
      color: #222;
      z-index: 1;
      overflow: hidden;
      transform-origin: center left;
      transition: width 0.2s ease-in;
    }

    .headerlist .link::before {
      position: absolute;
      content: "";
      display: block;
      width: 100%;
      height: 100%;
      background: #eee;
      top: 0;
      z-index: -1;
      border-radius: 8px;
      transform: translateX(100%);
      transform-origin: center right;
      transition: transform 0.2s ease-in;
    }

    .headerlist .link:hover {
      width: 130px;
    }

    .headerlist .link:hover::before {
      transform: translateX(0);
    }

    .headerlist .link .icon {
      width: 28px;
      height: 28px;
      display: block;
      flex-shrink: 0;
      position: absolute;
      left: 18px;
    }

    .headerlist .link .icon i {
      font-size: 26px;
    }

    .headerlist .link .txt {
      display: block;
      width: 100%;
      text-indent: 28px;
      text-align: center;
      transform: translateX(100%);
      transform-origin: center right;
      transition: transform 0.2s ease-in;
    }

    .headerlist .link:hover .txt {
      transform: translateX(0);
    }
</style>