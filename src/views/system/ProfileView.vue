<script setup>
import { useRouter } from 'vue-router'
import { onLogout } from '@/utils/HomeView.js' // Ensure onLogout function is imported correctly

const router = useRouter()

const handleLogout = async () => {
  await onLogout() // Call the logout function
  router.push('/') // Redirect to HomeView.vue after logout
}
</script>

<style scoped>
.profile-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.v-list-item {
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.v-list-item:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>

<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="8">
            <v-card class="profile-card pa-5">
              <h1 class="text-h4 mb-4">Profile Settings</h1>
              <v-list dense>
                <v-list-item link href="/myprofile">
                  <v-list-item-icon>
                    <v-icon>mdi-account</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>My Profile</v-list-item-title>
                </v-list-item>
                <v-list-item link href="/paymentmethod">
                  <v-list-item-icon>
                    <v-icon>mdi-credit-card</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Payment Method</v-list-item-title>
                </v-list-item>
                <v-list-item link href="/ordertracking">
                  <v-list-item-icon>
                    <v-icon>mdi-truck-delivery</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Order Tracking</v-list-item-title>
                </v-list-item>
                <v-list-item link href="/wishlist">
                  <v-list-item-icon>
                    <v-icon>mdi-heart</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Wishlist</v-list-item-title>
                </v-list-item>
              </v-list>
              <!-- Logout Button -->
              <v-btn color="error" @click="handleLogout" class="mt-4">
                Logout
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
