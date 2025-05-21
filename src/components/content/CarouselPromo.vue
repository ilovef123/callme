<template>
  <div class="promo-list">
    <div class="promo-card" v-for="(item, idx) in promoData" :key="idx">
      <img :src="item.img" class="promo-img" :alt="item.title" />
      <div class="promo-info">
        <div class="promo-title">{{ item.title }}</div>
        <div class="promo-techs">
          <span v-for="tech in item.techs" :key="tech" class="promo-tech">{{ tech }}</span>
        </div>
        <!-- <button class="promo-btn" @click="item.action && item.action()">{{ item.button }}</button> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import msgImg from '@/assets/images/chat.jpg';
import momentImg from '@/assets/images/moment.jpg';
import loginImg from '@/assets/images/login.jpg';

interface PromoItem {
  img: string;
  title: string;
  button: string;
  action: () => Window | null;
  techs?: string[]; 
}

const promoData: PromoItem[] = [
  {
    img: msgImg,
    title: '聊天',  
    techs: ['Vue3', 'Vite', 'WebSocket', 'SpringBoot'],
    button: 'Github →',
    action: () => window.open('https://github.com/', '_blank')
  },
  {
    img: momentImg,
    title: '动态',
    techs: ['React', 'Vite', 'WebSocket'],
    button: 'Github →',
    action: () => window.open('https://github.com/', '_blank')
  },
  {
    img: loginImg,
    title: '登录',
    techs: ['Qt', 'Flutter', 'WebSocket'],
    button: 'Github →',
    action: () => window.open('https://github.com/', '_blank')
  }
];
</script>

<style scoped lang="scss">
.promo-list {
  display: flex;
  flex-direction: column;
  gap: 38px;
  align-items: center;
  width: 100%;
}
.promo-card {
  width: 92%;
  max-width: 900px;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 4px 32px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 30px 36px;
  gap: 32px;
}
.promo-img {
  width: 375px;
  height: 220px;
  object-fit: cover;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(64,158,255,0.10);
  background: #f7f8fa;
}
.promo-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 18px;
  justify-content: center;
}
.promo-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 6px;
}
.promo-techs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}
.promo-tech {
  background: #eaf4ff;
  color: #409eff;
  border-radius: 8px;
  padding: 4px 12px;
  font-size: 15px;
  font-weight: 500;
}
.promo-btn {
  margin-top: 10px;
  padding: 8px 28px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(90deg,#409eff,#66b1ff);
  color: #fff;
  border: none;
  border-radius: 24px;
  box-shadow: 0 2px 8px rgba(64,158,255,0.12);
  cursor: pointer;
  transition: background 0.2s;
}
.promo-btn:hover {
  background: linear-gradient(90deg,#337ecc,#409eff);
}
</style>