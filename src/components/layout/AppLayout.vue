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
      <v-app-bar
        class="px-3"
        :color="
          theme === 'light' ? 'light-green-lighten-3' : 'light-green-darken-4'
        "
      >
        <v-toolbar-title>
          <router-link
            class="text-decoration-none text-black"
            :to="{ path: '/' }"
          >
            <v-icon>mdi-leaf</v-icon>AgriHUB
          </router-link>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <div class="theme-switch" @click="onClick">
          <div
            :class="[
              'switch',
              theme === 'light' ? 'switch-light' : 'switch-dark',
            ]"
          ></div>
          <div
            :class="[
              'switch-handle',
              theme === 'light' ? 'handle-light' : 'handle-dark',
            ]"
          ></div>
        </div>
      </v-app-bar>

      <v-main class="main-background">
        <v-container fluid>
          <slot name="content"></slot>
        </v-container>
        <v-footer
          border
          app
          :color="
            theme === 'light' ? 'light-green-lighten-3' : 'light-green-darken-4'
          "
        >
          AgriHub2024
        </v-footer>
      </v-main>
    </v-app>
  </v-responsive>
</template>
<style scoped>
.v-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
}

.theme-switch {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  width: 50px;
  height: 25px;
  background-color: #ddd;
  border-radius: 25px;
  position: relative;
  transition: background-color 0.3s ease;
}

.theme-switch .switch {
  width: 100%;
  height: 100%;
  border-radius: 25px;
  transition: background-color 0.3s ease;
}

.theme-switch .switch-light {
  background-color: darkgreen; /* Light mode color */
}

.theme-switch .switch-dark {
  background-color: lightgreen; /* Dark mode color */
}

.theme-switch .switch-handle {
  width: 20px;
  height: 20px;
  background-color: #fff;
  border-radius: 50%;
  position: absolute;
  top: 2.5px;
  transition:
    left 0.3s ease,
    background-color 0.3s ease;
}

.theme-switch .handle-light {
  left: 2.5px; /* Position for light mode */
}

.theme-switch .handle-dark {
  left: 27.5px; /* Position for dark mode */
}

.theme-switch .switch-handle::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: lightgreen; /* Default color for light mode */
}

.theme-switch .switch-handle.handle-dark::before {
  background-color: darkgreen; /* Color for dark mode */
}
</style>
