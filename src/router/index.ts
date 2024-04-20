import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/home-view.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/websocket',
      name: 'websocket',
      component: () => import('@/views/websocket-view.vue')
    }
  ]
})

export default router
