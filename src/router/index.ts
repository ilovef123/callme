import { createRouter, createWebHistory } from "vue-router";
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Root.vue'),
  },
  {
    path: '/discover',
    name: 'discover',
    component: () => import('@/views/discover/index.vue')
  }
];
const router = createRouter({
  history: createWebHistory(),
  linkActiveClass: 'active',
  routes
})
export default router