<script setup>
import {
  useHomeView,
  userEmail,
  isLoggedIn,
  onLogout,
} from '@/utils/HomeView.js'
import { useRouter } from 'vue-router'
import productList from '@/components/common/productList.vue'
import { ref } from 'vue'
useHomeView()
const router = useRouter()

const dialog = ref(false) // Modal visibility state

const goToLocation = () => {
  window.open(
    'https://www.google.com/maps/place/Caraga+State+University+-+Main+Campus/@8.9554944,125.5931904,12z/data=!4m6!3m5!1s0x3301eac565a4abe5:0x87859279e2e3f66a!8m2!3d8.9574466!4d125.5974321!16zL20vMDkzaDJ2?entry=ttu&g_ep=EgoyMDI0MTIwMy4wIKXMDSoASAFQAw%3D%3D',
    '_blank',
  )
}

const showAbout = () => {
  dialog.value = true // Show the modal
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
    <v-main class="main-background">
      <div>
        <v-toolbar color="light-green-lighten-2">
          <v-toolbar-title> <v-icon>mdi-leaf</v-icon> AgriHUB </v-toolbar-title>
          <v-btn @click="showAbout">
            <v-icon left>mdi-information-outline</v-icon>
            <h5>About</h5>
          </v-btn>
          <v-btn>
            <v-icon left>mdi-file-outline</v-icon>
            <h5>Projects</h5>
          </v-btn>
          <v-btn>
            <v-icon left>mdi-lightbulb-outline</v-icon>
            <h5>Insights</h5>
          </v-btn>
          <v-btn @click="goToLocation">
            <v-icon left>mdi-map-marker-outline</v-icon>
            <h5>Locations</h5>
          </v-btn>
          <v-btn :to="{ path: '/profile' }">
            <v-icon left>mdi-account-outline</v-icon>
            <h5>Profile</h5>
          </v-btn>
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
      </div>

      <v-container fluid>
        <v-row class="d-flex justify-center">
          <v-col cols="12" md="8" class="text-center">
            <!-- !! items area -->
            <productList></productList>
            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
          </v-col>
        </v-row>
      </v-container>
      <!-- Modal for About -->
    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title class="headline">About AgriHUB</v-card-title>
        <v-card-text>
          <p>AgriHUB is an innovative project focused on enhancing agricultural practices through technology.</p>
          <v-img src="/public/images/agri2.jpg" class="mb-4"></v-img> <!-- Replace with your image path -->
          <p>AgriHub is an online marketplace for buying and selling agricultural products. It includes secure payment gateways, robust logistics support, and location-based services for fast transactions and deliveries. This platform expands market reach, enhances convenience, and boosts sales, empowering farmers and businesses to optimize operations and achieve higher profitability. By connecting buyers with nearby sellers, it reduces delivery times and improves customer satisfaction..</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
      <v-footer border app color="light-green lighten-2">AgriHub2024</v-footer>
    </v-main>

  </v-app>
</template>
