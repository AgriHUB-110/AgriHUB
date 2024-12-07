import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import HomeView from '@/views/system/HomeView.vue'
import ProfileView from '@/views/system/ProfileView.vue'
import ProductView from '@/views/system/ProductView.vue' // Import the ProductView component
import { supabase } from '@/utils/supabase.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      beforeEnter: async (to, from, next) => {
        const { data } = await supabase.auth.getSession()
        if (data.session) {
          next()
        } else {
          next()
        }
      },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      beforeEnter: async (to, from, next) => {
        const { data } = await supabase.auth.getSession()
        if (data.session) {
          next('/')
        } else {
          next()
        }
      },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      beforeEnter: async (to, from, next) => {
        const { data } = await supabase.auth.getSession()
        if (data.session) {
          next('/')
        } else {
          next()
        }
      },
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      beforeEnter: async (to, from, next) => {
        const { data } = await supabase.auth.getSession()
        if (data.session) {
          next()
        } else {
          next('/login')
        }
      }
    },
    {
      path: '/product',
      name: 'product',
      component: ProductView, // Add the product route
      beforeEnter: async (to, from, next) => {
        const { data } = await supabase.auth.getSession()
        if (data.session) {
          next()
        } else {
          next('/login')
        }
      }
    }
  ],
})

export default router

