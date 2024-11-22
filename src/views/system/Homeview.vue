

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase.js'  // Importing the supabase client

const router = useRouter()
const userEmail = ref('')

const fetchUserEmail = async () => {
  const { data, error } = await supabase.auth.getSession()
  if (error) {
    console.error('Error fetching user session:', error)
    return
  }
  userEmail.value = data.session?.user?.email || 'Not logged in'
}

const onLogout = async () => {
  await supabase.auth.signOut()
  router.replace('/')
}

onMounted(() => {
  fetchUserEmail()
})


const checkSession = async () => {
  const { data } = await supabase.auth.getSession()
  if (data.session) {
    // Session exists, route to /Home
    if (router.currentRoute.value.path === '/' || router.currentRoute.value.path === '/register') {
      router.replace('/Home')
    }
  } else {
    // No session, if trying to access /Home, redirect to /
    if (router.currentRoute.value.path === '/Home') {
      router.replace('/')
    }
  }
}

</script>

<style scoped>
.v-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
}
</style>

<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row class="d-flex justify-center">
          <v-col cols="12" md="8" class="text-center">
            <v-card class="pa-5">
              <h1 class="text-h3 mb-3">Welcome to Our Site!</h1>
              <p class="mb-3">Logged in as: {{ userEmail }}</p>
              <p class="mb-5">
                Discover amazing content, connect with great people, and explore new opportunities with us. Sign up now to get started!
              </p>
              <v-btn color="primary" class="mr-4">Get Started</v-btn>
              <v-btn outlined color="secondary" class="mr-4">Learn More</v-btn>
              <v-btn outlined color="error" class="ma-4" @click="onLogout">Logout</v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
