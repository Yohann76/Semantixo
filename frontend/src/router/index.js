import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../components/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/verify-text',
    name: 'VerifyText',
    component: () => import('../components/VerifyText.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router 