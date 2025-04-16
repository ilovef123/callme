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
    path: '/login',
    name: 'login',
    component: () => import(/* webpackPrefetch: true */ '@/views/login/index.vue')
  }
];
const router = createRouter({
  history: createWebHistory(),
  linkActiveClass: 'active',
  routes
})
export default router