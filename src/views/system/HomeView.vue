<script setup>
import {
  useHomeView,
  userEmail,
  isLoggedIn,
  onLogout,
} from '@/utils/HomeView.js' // Importing the functions
import { useRouter } from 'vue-router'
import productList from '@/components/common/productList.vue'

useHomeView() // Initialize the setup
const router = useRouter()
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
      <v-toolbar color="light-green-lighten-2">
        <v-toolbar-title>AgriHUB</v-toolbar-title>
        <v-btn><h5>About</h5></v-btn>
        <v-btn><h5>Projects</h5></v-btn>
        <v-btn><h5>Insights</h5></v-btn>
        <v-btn><h5>Locations</h5></v-btn>
        <v-btn :to="{ path: '/profile' }"><h5>Profile</h5></v-btn>
        <v-spacer></v-spacer>

        <v-btn
          v-if="!isLoggedIn"
          variant="outlined"
          class="rounded bg-white mr-5"
          :to="{ path: '/login' }"
        >
          Sign in
        </v-btn>
        <v-btn
          v-if="!isLoggedIn"
          variant="outlined"
          class="rounded mr-5"
          :to="{ path: '/register' }"
        >
          Sign up
        </v-btn>
        <v-btn v-if="isLoggedIn" icon @click="onLogout">
          <v-icon>mdi-export</v-icon>
        </v-btn>
      </v-toolbar>

      <v-container fluid class="bg-light-green-lighten-2">
        <v-row class="d-flex justify-center">
          <v-divider :thickness="2"></v-divider>
          <v-col cols="12" md="8" class="text-center">
            <v-text-field
              class="mb-5 pb-5 mt-5"
              v-model="search"
              label="Search for files, plugins, and creators"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              hide-details
              single-line
            ></v-text-field>

            <!-- !! items area -->
            <!-- <v-row>
              <v-col cols="4">
                <v-card text="Image here" variant="outlined"></v-card>
              </v-col>
              <v-col cols="4">
                <v-card text="Image here" variant="outlined"></v-card>
              </v-col>
              <v-col cols="4">
                <v-card text="Image here" variant="outlined"></v-card>
              </v-col>
            </v-row> -->

<productList></productList>

            <v-card class="pa-5">
              <h1 class="text-h3 mb-3">Welcome to Our Site!</h1>
              <p class="mb-3">Logged in as: {{ userEmail }}</p>
              <p class="mb-5">
                Discover amazing content, connect with great people, and explore
                new opportunities with us. Sign up now to get started!
              </p>
              <v-btn color="primary" class="mr-4">Get Started</v-btn>
              <v-btn outlined color="secondary" class="mr-4">Learn More</v-btn>
              <v-btn
                v-if="isLoggedIn"
                outlined
                color="error"
                class="ma-4"
                @click="onLogout"
                >Logout</v-btn
              >
            </v-card>

            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
