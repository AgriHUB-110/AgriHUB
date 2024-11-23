<script setup>
import { ref } from 'vue'

const theme = ref('light')

function onClick() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}
</script>

<template>
  <v-responsive class="border rounded">
    <v-app>
      <v-app-bar
        class="px-3"
        :color="theme === 'dark' ? 'black' : 'light-green lighten-2'"
        flat
      >
        <v-spacer></v-spacer>
        <v-btn
          :prepend-icon="
            theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'
          "
          text="AgriHub"
          
          slim
          @click="onClick"
        ></v-btn>
      </v-app-bar>

      <v-main class="main-background">
        <v-container >
          <slot name="content"></slot>
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>
</template>
