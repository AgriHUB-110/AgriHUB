<!--template>
  <v-toolbar color="light-green-lighten-2">
    <v-toolbar-title>
      <router-link
      class="text-decoration-none text-black"
      :to="{ path: '/' }"> AgriHUB</router-link>
    </v-toolbar-title>
  </v-toolbar>
</template-->

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  useHomeView,
  userEmail,
  isLoggedIn as userIsLoggedIn,
  onLogout as handleLogout,
} from '@/utils/HomeView.js'

const drawer = ref(false)
const theme = ref('light')
const router = useRouter()
const isLoggedIn = userIsLoggedIn // Use the imported isLoggedIn function
useHomeView() // Initialize the setup

const items = ref([
  { title: 'About', value: 'about' },
  { title: 'Projects', value: 'projects' },
  { title: 'Insights', value: 'insights' },
  { title: 'Locations', value: 'locations' },
  { title: 'Profile', value: 'profile' },
])

const onClick = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

const navigate = path => {
  // Implement navigation logic
  console.log(`Navigating to ${path}`)
}

const onLogout = () => {
  handleLogout()
  console.log('Logging out')
}

const mainBackgroundClass = computed(() => {
  return theme.value === 'light'
    ? 'main-light-background'
    : 'main-dark-background'
})
</script>

<style scoped>
.v-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
}
</style>

<template>
  <v-responsive class="border rounded">
    <v-app :theme="theme">
      <!-- App Bar -->
      <v-app-bar
        class="px-3"
        :color="theme === 'light' ? 'light-green-lighten-2' : 'green-darken-4'"
        flat
      >
        <v-app-bar-nav-icon
          variant="text"
          @click.stop="drawer = !drawer"
        ></v-app-bar-nav-icon>
        <v-toolbar-title
          ><router-link
            class="text-decoration-none text-black"
            :to="{ path: '/' }"
            ><v-icon>mdi-leaf</v-icon>AgriHUB</router-link
          ></v-toolbar-title
        >

        <v-spacer></v-spacer>
        <v-btn
          :prepend-icon="
            theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'
          "
          text
          slim
          @click="onClick"
          class="d-none d-md-flex"
        >
        </v-btn>
        <v-btn
          v-if="!isLoggedIn"
          variant="outlined"
          class="rounded bg-white mr-5 d-none d-md-flex"
          :to="{ path: '/login' }"
        >
          Sign in
        </v-btn>
        <v-btn
          v-if="!isLoggedIn"
          variant="outlined"
          class="rounded mr-5 d-none d-md-flex"
          :to="{ path: '/register' }"
        >
          Sign up
        </v-btn>
      </v-app-bar>

      <!-- Mobile Navigation Drawer -->
      <v-navigation-drawer
        v-model="drawer"
        :location="$vuetify.display.mobile ? 'bottom' : undefined"
        temporary
      >
        <v-list>
          <v-list-item :to="{ path: '/profile' }">
            <v-list-item-title><h5>Profile</h5></v-list-item-title>
          </v-list-item>
          <v-list-item :to="{ path: '/product' }">
            <v-list-item-title><h5>Product</h5></v-list-item-title>
          </v-list-item>
          <v-list-item :to="{ path: '/' }">
              <v-list-item-title><h5>Home</h5></v-list-item-title>
            </v-list-item>

          <v-list-item @click="navigate('about')">
            <v-list-item-title><h5>About</h5></v-list-item-title>
          </v-list-item>

          <v-list-item @click="navigate('insights')">
            <v-list-item-title><h5>Insights</h5></v-list-item-title>
          </v-list-item>

          <v-list-item v-if="!isLoggedIn" :to="{ path: '/login' }">
            <v-list-item-title>Sign in</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="!isLoggedIn" :to="{ path: '/register' }">
            <v-list-item-title>Sign up</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="isLoggedIn" @click="onLogout">
            <v-list-item-title
              ><v-icon>mdi-export</v-icon> Log out</v-list-item-title
            >
          </v-list-item>
          <v-list-item>
            <v-btn
              :prepend-icon="
                theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'
              "
              text
              slim
              @click="onClick"
            >
            
            </v-btn>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <!-- Main Content -->
      <v-main>
        <v-container fluid>
          <!-- Here you use the named slot -->
          <slot name="responsive_nav"></slot>
        </v-container>
      </v-main>
      <v-footer
        border
        app
        :color="theme === 'light' ? 'light-green lighten-2' : 'green-darken-4'"
      >
        AgriHub2024
      </v-footer>
    </v-app>
  </v-responsive>
</template>
