<script setup>
import { useHomeView, userEmail } from '@/utils/HomeView.js'

import { onLogout ,  isLoggedIn } from '@/utils/common_functions.js'
import { useRouter } from 'vue-router'
import productList from '@/components/common/productList.vue'
import headerAH from '@/components/common/headerAH.vue'

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
  <headerAH>
    <template #responsive_nav>
      <v-container fluid>
        <v-row class="d-flex justify-center">
          <v-col cols="12" md="8" class="text-center">
            <!-- !! items area -->
            <productList></productList>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </headerAH>
</template>
