<script setup>
import { ref } from 'vue'
const visiblePass = ref(false)
const visibleConfirmPass = ref(false)
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
              <!-- !! first name -->
              <v-text-field
                label="First Name"
                variant="outlined"
              ></v-text-field>

              <!-- !! last name -->
              <v-text-field label="Last Name" variant="outlined"></v-text-field>

              <!-- !! Email -->
              <v-text-field label="Email" variant="outlined"></v-text-field>

              <!-- !! Password -->
              <v-text-field
                :append-inner-icon="visiblePass ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visiblePass ? 'text' : 'password'"
                label="Password"
                variant="outlined"
                type="password"
                @click:append-inner="visiblePass = !visiblePass"
              ></v-text-field>

              <!-- !! Confirm Password -->
              <v-text-field
                :append-inner-icon="visibleConfirmPass ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visibleConfirmPass ? 'text' : 'password'"
                label="Confirm Password"
                variant="outlined"
                type="password"
                @click:append-inner="visibleConfirmPass = !visibleConfirmPass"
              ></v-text-field>

              <v-btn
                block
                variant="outlined"
                rounded="xl"
                size="x-large"
                class="mt-2"
                type="submit"
                >Register</v-btn
              >
              <p class="text-center mt-3">Forgot Password?</p>
              <br />
              <p class="text-center">
                Already have an account?
                <RouterLink to="/" class="text-primary">Login</RouterLink>
              </p>
              <br /> </v-form
          ></v-card>
        </v-col> </v-row
    ></template>
  </AppLayout>
</template>
