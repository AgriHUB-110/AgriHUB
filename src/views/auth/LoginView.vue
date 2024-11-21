<script setup>
import { ref } from 'vue'
const visiblePass = ref(false)

import AppLayout from '@/components/layout/AppLayout.vue'
</script>

<template>
  <AppLayout>
    <template #content>
      <!-- ! 1 row -->
      <v-row class="d-flex justify-center">
        <!-- ! 1 col -->
        <v-col cols="12" md="6" class="mx-auto">
          <!-- !! v card -->
          <v-card class="glass-card border-thin" text="">
            <v-form class="px-3 pb-3" fast-fail @submit.prevent>
              <!-- !! Email -->
              <v-text-field label="Email" variant="outlined"></v-text-field>

              <!-- !! Password -->
              <v-text-field
                :append-inner-icon="visiblePass ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visiblePass ? 'text' : 'password'"
                @click:append-inner="visiblePass = !visiblePass"
                label="Password"
                variant="outlined"
                type="password"
              ></v-text-field>

              <v-btn
                block
                variant="outlined"
                rounded="xl"
                size="x-large"
                class="mt-2 mx-auto d-flex mb-5"
                type="submit"
                >Login</v-btn
              >
              <v-divider class="my-5"></v-divider>
              <p class="text-center mt-3">Forgot Password?</p>
              <br />
              <p class="text-center">
                Don't have an account?
                <RouterLink to="/register" class="text-primary"
                  >Sign up</RouterLink
                >
              </p>
              <br /> </v-form
          ></v-card>
        </v-col>
      </v-row>
    </template>
  </AppLayout>
</template>
