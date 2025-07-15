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
    component: () => import('../components/VerifyText.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/verify-page',
    name: 'VerifyPage',
    component: () => import('../components/VerifyPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/internal-link-analysis',
    name: 'InternalLinkAnalysis',
    component: () => import('../components/InternalLinkAnalysisPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/domain-analysis',
    name: 'DomainAnalysis',
    component: () => import('../components/DomainAnalysisPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/app',
    name: 'AppDashboard',
    component: () => import('../components/AppDashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../components/Register.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../components/Login.vue')
  },
  {
    path: '/admin',
    name: 'AdminPage',
    component: () => import('../components/AdminPage.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Navigation guard pour protéger les routes
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token') !== null
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
    next('/login')
  } else if (to.meta.requiresAdmin && !isAuthenticated) {
    // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
    next('/login')
  } else {
    next()
  }
})

export default router 