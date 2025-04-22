import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackPrefetch: true */ '@/views/Root.vue'),
  },
  {
    path: '/discover',
    name: 'discover',
    component: () => import(/* webpackPrefetch: true */ '@/views/discover/index.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackPrefetch: true */ '@/views/login/index.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackPrefetch: true */ '@/views/login/login.vue')
  },
  {
    path: '/forgotpassword',
    name: 'ForgotPassword',
    component: () => import(/* webpackPrefetch: true */ '@/views/login/forgotPassword.vue')
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import(/* webpackPrefetch: true */ '@/views/chat/chatPage.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  linkActiveClass: 'active',
  routes
});

export default router;