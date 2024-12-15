import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import HomeView from '@/views/system/HomeView.vue'
import ProfileView from '@/views/system/ProfileView.vue'
import CartView from '@/views/system/CartView.vue' // Import the cart page
import { supabase } from '@/utils/supabase.js'

const requireAuth = async (to, from, next) => {
  const { data } = await supabase.auth.getSession()
  if (data.session) {
    next()
  } else {
    next('/login')
  }
}

const redirectIfAuth = async (to, from, next) => {
  const { data } = await supabase.auth.getSession()
  if (data.session) {
    next('/')
  } else {
    next()
  }
}

const routes = [
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    beforeEnter: requireAuth,
  },
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    beforeEnter: redirectIfAuth,
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    beforeEnter: redirectIfAuth,
  },
  {
    path: '/cart', // Add the cart route
    name: 'cart',
    component: CartView, // Component for the cart page
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
