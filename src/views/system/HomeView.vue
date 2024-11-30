<script setup>
import { useHomeView, userEmail, isLoggedIn, onLogout } from '@/utils/HomeView.js';
import { useRouter } from 'vue-router';
import productList from '@/components/common/productList.vue';

useHomeView(); // Initialize the setup
const router = useRouter();
</script>

<style scoped>
.v-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
}
.v-row {
  margin-top: 16px;
}
.v-card-img {
  max-height: 200px;
  object-fit: cover;
}
</style>

<template>
  <v-app>
    <v-main class="main-background">
      <v-parallax src="/public/images/agri2.jpg">
        <v-toolbar color="light-green-lighten-2">
          <v-toolbar-title>AgriHUB</v-toolbar-title>
          <v-btn><h5>About</h5></v-btn>
          <v-btn><h5>Projects</h5></v-btn>
          <v-btn><h5>Insights</h5></v-btn>
          <v-btn><h5>Locations</h5></v-btn>
          <v-btn :to="{ path: '/profile' }"><h5>Profile</h5></v-btn>
          <v-spacer></v-spacer>
          <v-btn v-if="!isLoggedIn" variant="outlined" class="rounded bg-white mr-5" :to="{ path: '/login' }">
            Sign in
          </v-btn>
          <v-btn v-if="!isLoggedIn" variant="outlined" class="rounded mr-5" :to="{ path: '/register' }">
            Sign up
          </v-btn>
          <v-btn v-if="isLoggedIn" icon @click="onLogout">
            <v-icon>mdi-export</v-icon>
          </v-btn>
        </v-toolbar>
        <v-container fluid>
          <v-row class="d-flex justify-center">
            <v-col cols="12" md="8" class="text-center">
              <v-text-field
                class="mb-2 pb-2 mt-2"
                v-model="search"
                label="Search for files, plugins, and creators"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                hide-details
                single-line
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
        <v-container fluid>
          <v-row class="d-flex justify-center">
            <v-col cols="12" md="8" class="text-center">
              <!-- Items Area -->
              <v-carousel>
                <v-carousel-item>
                  <v-card outlined>
                    <v-img
                      src="/public/images/sweetcorn.jpg"
                      alt="Sweet Corn"
                      class="mx-auto mt-4"
                      height="200px"
                      max-width="80%"
                      cover
                    ></v-img>
                    <v-card-title class="text-center">Sweet Corn</v-card-title>
                    <v-card-subtitle class="text-center">Delicious and Fresh</v-card-subtitle>
                    <v-card-text class="text-center">Perfect for your next meal.</v-card-text>
                    <v-card-actions class="d-flex justify-center mb-4">
                      <v-btn color="primary">Buy</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-carousel-item>
                <v-carousel-item>
                  <v-card outlined>
                    <v-img
                      src="/public/images/coconut.jpg"
                      alt="Coconut"
                      class="mx-auto mt-4"
                      height="200px"
                      max-width="80%"
                      cover
                    ></v-img>
                    <v-card-title class="text-center">Coconut</v-card-title>
                    <v-card-subtitle class="text-center">Rich in Flavor</v-card-subtitle>
                    <v-card-text class="text-center">Add tropical taste to your dishes.</v-card-text>
                    <v-card-actions class="d-flex justify-center mb-4">
                      <v-btn color="primary">Buy</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-carousel-item>
                <v-carousel-item>
                  <v-card outlined>
                    <v-img
                      src="/public/images/palay.jpg"
                      alt="Palay"
                      class="mx-auto mt-4"
                      height="200px"
                      max-width="80%"
                      cover
                    ></v-img>
                    <v-card-title class="text-center">Palay</v-card-title>
                    <v-card-subtitle class="text-center">Quality Rice</v-card-subtitle>
                    <v-card-text class="text-center">High-quality palay for your needs.</v-card-text>
                    <v-card-actions class="d-flex justify-center mb-4">
                      <v-btn color="primary">Buy</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-carousel-item>
              </v-carousel>
              <br />
              <br />
              <productList></productList>
              <v-card class="pa-5 glass-card">
                <h1 class="text-h3 mb-3">Welcome to Our Site!</h1>
                <p class="mb-3">Logged in as: {{ userEmail }}</p>
                <p class="mb-5">
                  Discover amazing content, connect with great people, and explore new opportunities with us. Sign up
                  now to get started!
                </p>
                <v-btn color="primary" class="mr-4">Get Started</v-btn>
                <v-btn outlined color="secondary" class="mr-4">Learn More</v-btn>
                <v-btn v-if="isLoggedIn" outlined color="error" class="ma-4" @click="onLogout">
                  Logout
                </v-btn>
              </v-card>
              <br />
              <br />
            </v-col>
          </v-row>
        </v-container>
      </v-parallax>
      <v-footer border app color="light-green lighten-2">AgriHub2024</v-footer>
    </v-main>
  </v-app>
</template>
