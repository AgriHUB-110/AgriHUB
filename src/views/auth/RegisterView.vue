<script setup>
import { ref } from 'vue'
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
                v-model="userName"
                :rules="userNameRules"
                label="First Name"
                variant="outlined"
              ></v-text-field>

              <!-- !! last name -->
              <v-text-field
                v-model="userName"
                :rules="userNameRules"
                label="Last Name"
                variant="outlined"
              ></v-text-field>

              <!-- !! Email -->
              <v-text-field
                v-model="userName"
                :rules="userNameRules"
                label="Email"
                variant="outlined"
              ></v-text-field>

              <!-- !! Password -->
              <v-text-field
                v-model="password"
                :rules="passwordRules"
                label="Password"
                variant="outlined"
                type="password"
              ></v-text-field>

              <!-- !! Confirm Password -->
              <v-text-field
                v-model="password"
                :rules="passwordRules"
                label="Confirm Password"
                variant="outlined"
                type="password"
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
