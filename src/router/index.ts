import { createRouter, createWebHashHistory } from "vue-router";
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Root.vue'),
    // children:子组件
  }
];
const router = createRouter({
  history: createWebHashHistory(),
  linkActiveClass: 'active',
  routes
})
export default router