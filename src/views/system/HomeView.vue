<script setup>
import headerAH from '@/components/common/headerAH.vue'
import productList from '@/components/common/productList.vue'
</script>

<style scoped>
.v-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
}
</style>

<template>
  <headerAH>
    <template #responsive_nav>
      <!-- Main Content -->
      <v-main>
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
              <!-- !! items area -->
              <productList></productList>
              <!-- <v-card class="pa-5 glass-card">
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
              >
                Logout
              </v-btn>
            </v-card> -->

              <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </template>
  </headerAH>
</template>
