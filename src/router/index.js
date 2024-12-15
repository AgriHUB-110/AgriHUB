import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import HomeView from '@/views/system/HomeView.vue'
import ProfileView from '@/views/system/ProfileView.vue'
import { supabase } from '@/utils/supabase.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      beforeEnter: async (to, from, next) => {
        // Check if the user is logged in
        const { data } = await supabase.auth.getSession()
        // If a session exists, allow access to the profile view
        if (data.session) {
          next()
        } else {
          // If no session exists, redirect to login
          next('/login')
        }
      }
    },

    {
      path: '/',
      name: 'home',
      component: HomeView,
      beforeEnter: async (to, from, next) => {
        // Check if the user is logged in
        const { data } = await supabase.auth.getSession()
        // If a session exists, allow access to the home view
        if (data.session) {
          next()
        } else {
          // If no session exists, allow access to the home view
          next()
        }
      },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      beforeEnter: async (to, from, next) => {
        // Check if the user is logged in
        const { data } = await supabase.auth.getSession()
        // If a session exists, redirect to home
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
        // Check if the user is logged in
        const { data } = await supabase.auth.getSession()
        // If a session exists, redirect to home
        if (data.session) {
          next('/')
        } else {
          next()
        }
      },
    },
  ],
})

export default router
