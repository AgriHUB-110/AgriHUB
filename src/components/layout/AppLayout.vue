<script setup>
import { ref, onMounted } from 'vue'

const theme = ref(localStorage.getItem('theme') || 'light')

function onClick() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', theme.value)
}

onMounted(() => {
  document.body.className = theme.value
})
</script>

<template>
  <v-responsive class="border rounded">
    <v-app :theme="theme">
      <v-app-bar class="px-3" :color="theme === 'light' ? 'light-green-lighten-3' : 'light-green-darken-4'">
        <v-toolbar-title>
          <router-link
            class="text-decoration-none text-black"
            :to="{ path: '/' }"
          >
            <v-icon>mdi-leaf</v-icon>AgriHUB
          </router-link>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          text="Toggle Theme"
          slim
          @click="onClick"
        ></v-btn>
      </v-app-bar>

      <v-main class="main-background">
        <v-container fluid>
          <slot name="content"></slot>
        </v-container>
        <v-footer border app :color="theme === 'light' ? 'light-green-lighten-3' : 'light-green-darken-4'">
          AgriHub2024
        </v-footer>
      </v-main>
    </v-app>
  </v-responsive>
</template>
