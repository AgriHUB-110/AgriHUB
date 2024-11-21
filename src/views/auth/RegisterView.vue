<script setup>
import { ref } from 'vue'
const visiblePass = ref(false)
const visibleConfirmPass = ref(false)
import AppLayout from '@/components/layout/AppLayout.vue'
import {
  requiredValidator,
  emailValidator,
  passwordValidator,
  confirmedValidator,
} from '@/utils/validator'
const refVform = ref()

const formDataDefault = {
  firsname: '',
  lastname: '',
  email: '',
  password: '',
  confirmPassword: '',
}
const formData = ref({
  ...formDataDefault,
})

const onRegister = () => {
  // Your login logic here
  alert("Miss kita")
  // console.log('Login Successful')
}

const onFormSubmit = () => {
  refVform.value?.validate().then(({ valid }) => {
    if (valid) onRegister()
  })
}
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
            <!-- !! form -->
            <v-form ref="refVform" class="px-3 pb-3" @submit.prevent="onFormSubmit">
              <!-- !! first name -->
              <v-text-field
                v-model="formData.firstName"
                label="First Name"
                variant="outlined"
                :rules="[requiredValidator]"
              ></v-text-field>

              <!-- !! last name -->
              <v-text-field
                v-model="formData.lastName"
                label="Last Name"
                variant="outlined"
                class="mt-3"
                :rules="[requiredValidator]"
              ></v-text-field>

              <!-- !! Email -->
              <v-text-field
                v-model="formData.email"
                label="Email"
                variant="outlined"
                class="mt-3"
                :rules="[requiredValidator, emailValidator]"
              ></v-text-field>

              <!-- !! Password -->
              <v-text-field
                v-model="formData.password"
                :append-inner-icon="visiblePass ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visiblePass ? 'text' : 'password'"
                label="Password"
                variant="outlined"
                type="password"
                class="mt-3"
                @click:append-inner="visiblePass = !visiblePass"
                :rules="[requiredValidator, passwordValidator]"
              ></v-text-field>

              <!-- !! Confirm Password -->
              <v-text-field
                v-model="formData.confirmPassword"
                :append-inner-icon="
                  visibleConfirmPass ? 'mdi-eye-off' : 'mdi-eye'
                "
                :type="visibleConfirmPass ? 'text' : 'password'"
                label="Confirm Password"
                variant="outlined"
                type="password"
                class="mt-3"
                @click:append-inner="visibleConfirmPass = !visibleConfirmPass"
                :rules="[
                  requiredValidator,
                  confirmedValidator(
                    formData.confirmPassword,
                    formData.password,
                  ),
                ]"
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
