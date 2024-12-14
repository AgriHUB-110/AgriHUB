<script setup>
<<<<<<< HEAD
import { useHomeView, userEmail, isLoggedIn, onLogout, } from '@/utils/HomeView.js'
=======
import {
  useHomeView,
  userEmail,
  isLoggedIn,
  onLogout,
} from '@/utils/HomeView.js' // Importing the functions
>>>>>>> ac0b57573a0474a490b76cf4a206df46c656692d
import { useRouter } from 'vue-router'
import productList from '@/components/common/productList.vue'
useHomeView()
const router = useRouter()

const goToLocation = () => {
  window.open(
    'https://www.google.com/maps/place/Caraga+State+University+-+Main+Campus/@8.9554944,125.5931904,12z/data=!4m6!3m5!1s0x3301eac565a4abe5:0x87859279e2e3f66a!8m2!3d8.9574466!4d125.5974321!16zL20vMDkzaDJ2?entry=ttu&g_ep=EgoyMDI0MTIwMy4wIKXMDSoASAFQAw%3D%3D',
    '_blank',
  )
}
</script>
<template>
  <v-app>
    <v-main class="main-background">
      <v-container fluid>
        <v-toolbar color="light-green-lighten-2">
<<<<<<< HEAD
          <v-toolbar-title>
            <v-icon>mdi-leaf</v-icon> AgriHUB
          </v-toolbar-title>
          <v-btn class="mx-2">
=======
          <v-toolbar-title> <v-icon>mdi-leaf</v-icon> AgriHUB </v-toolbar-title>
          <v-btn>
>>>>>>> ac0b57573a0474a490b76cf4a206df46c656692d
            <v-icon left>mdi-information-outline</v-icon>
            <span>About</span>
          </v-btn>
          <v-btn class="mx-2">
            <v-icon left>mdi-file-outline</v-icon>
            <span>Projects</span>
          </v-btn>
          <v-btn class="mx-2">
            <v-icon left>mdi-lightbulb-outline</v-icon>
            <span>Insights</span>
          </v-btn>
          <v-btn @click="goToLocation" class="mx-2">
            <v-icon left>mdi-map-marker-outline</v-icon>
            <span>Locations</span>
          </v-btn>
          <v-btn :to="{ path: '/profile' }" class="mx-2">
            <v-icon left>mdi-account-outline</v-icon>
            <span>Profile</span>
          </v-btn>
          <v-spacer></v-spacer>
<<<<<<< HEAD
          <v-btn v-if="!isLoggedIn" variant="outlined" class="rounded bg-white mx-2" :to="{ path: '/login' }">
            Sign in
          </v-btn>
          <v-btn v-if="!isLoggedIn" variant="outlined" class="rounded mx-2" :to="{ path: '/register' }">
=======
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
>>>>>>> ac0b57573a0474a490b76cf4a206df46c656692d
            Sign up
          </v-btn>
          <v-btn v-if="isLoggedIn" icon @click="onLogout" class="mx-2">
            <v-icon>mdi-export</v-icon>
          </v-btn>
        </v-toolbar>
<<<<<<< HEAD

        <v-row justify="center">
          <v-col cols="12" sm="10" md="8" lg="6" xl="4" class="text-center">
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

        <v-row justify="center">
          <v-col cols="12" sm="10" md="8" lg="6" xl="4" class="text-center">
            <!-- Items Area -->
            <productList></productList>
=======
      </div>

      <v-container fluid>
        <v-row class="d-flex justify-center">
          <v-col cols="12" md="8" class="text-center">
            <!-- !! items area -->
            <productList></productList>
            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
>>>>>>> ac0b57573a0474a490b76cf4a206df46c656692d
          </v-col>
        </v-row>
        
        <v-footer border app color="light-green lighten-2">
          AgriHub2024
        </v-footer>
      </v-container>
    </v-main>
  </v-app>
</template>
