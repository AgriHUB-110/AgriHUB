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
import { supabase, formActionDefault } from '@/utils/supabase.js'
import notif from '@/components/common/notif.vue'
const refVform = ref()

const formDataDefault = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  confirmPassword: '',
}
const formData = ref({
  ...formDataDefault,
})

const formAction = ref({
  ...formActionDefault,
})

const onRegister = async () => {
  // Your login logic here
  // alert('Miss kita')
  formAction.value = { ...formActionDefault }
  formAction.value.formProcess = true
  const { data, error } = await supabase.auth.signUp({
    email: formData.value.email,
    password: formData.value.password,
    options: {
      data: {
        firstname: formData.value.firstname,
        lastname: formData.value.lastname,
      },
    },
  })

  if (error) {
    console.log(error)
    formAction.value.formErrorMessage = error.message
    formAction.value.formStatus = error.status
  } else if (data) {
    console.log(data)
    formAction.value.formSuccessMessage = 'Successfully Registered :)'
    refVform.value?.reset()
  }

  formAction.value.formProcess = false
}

const onFormSubmit = () => {
  refVform.value?.validate().then(({ valid }) => {
    if (valid) onRegister()
  })
}

// Function to check user session
const checkSession = async () => {
  const { data } = await supabase.auth.getSession()
  if (data.session) {
    // If session exists, redirect to /Home
    router.replace('/Home')
  }
}
</script>

<template>
  <AppLayout>
    <template #content>
      <!-- ! 1 row -->
      <br /><br />
      <v-row class="d-flex justify-center">
        <!-- ! 1 col -->
        <v-col cols="12" md="10" class="mx-auto glass-card">
          <v-card-title>
            <v-img
              src="/public/images/logo.jpg"
              height="200"
              class="my-2"
            ></v-img>
            <h2 class="my-3 text-center">AgriHub</h2></v-card-title
          >
          <h2 class="my-2 text-center"><b>Registration Form</b></h2>
          <v-divider class="my-2"></v-divider>
          <!-- !! v card -->

          <notif
            :form-success-message="formAction.formSuccessMessage"
            :form-error-message="formAction.formErrorMessage"
          ></notif>
          <!-- !! form -->
          <v-form
            ref="refVform"
            class="px-3 pb-3 pt-5"
            @submit.prevent="onFormSubmit"
          >
            <v-row>
              <v-col cols="12" md="6">
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
                <!-- !! usertype -->
                <v-text-field
                  v-model="formData.lastName"
                  label="User Type"
                  variant="outlined"
                  class="mt-3"
                  :rules="[requiredValidator]"
                ></v-text-field>

                <!-- !! address -->
                <v-text-field
                  v-model="formData.email"
                  label="Address"
                  variant="outlined"
                  class="mt-3"
                  :rules="[requiredValidator, emailValidator]"
                ></v-text-field>
                <!-- !! country-->
                <v-text-field
                  v-model="formData.email"
                  label="Country"
                  variant="outlined"
                  class="mt-3"
                  @click:append-inner="visiblePass = !visiblePass"
                  :rules="[requiredValidator, emailValidator]"
                ></v-text-field>
                <v-text-field
                  v-model="formData.phone"
                  label="Zip-code"
                  variant="outlined"
                  class="mt-3"
                  :rules="[requiredValidator]"
                  
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <!-- !! city -->
                <v-text-field
                  v-model="formData.firstName"
                  label="City"
                  variant="outlined"
                  :rules="[requiredValidator]"
                ></v-text-field>

                <!-- !! state -->
                <v-text-field
                  v-model="formData.lastName"
                  label="State"
                  variant="outlined"
                  class="mt-3"
                  :rules="[requiredValidator]"
                ></v-text-field>

                <v-text-field
                  v-model="formData.email"
                  label="Email"
                  variant="outlined"
                  class="mt-3"
                  :rules="[requiredValidator, emailValidator]"
                  prepend-inner-icon="mdi-email"
                ></v-text-field>

                <v-text-field
                  v-model="formData.phone"
                  label="Phone"
                  variant="outlined"
                  class="mt-3"
                  :rules="[requiredValidator]"
                  prepend-inner-icon="mdi-phone"
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
              </v-col>
            </v-row>
            <v-divider class="my-2"></v-divider>
            <v-btn
              block
              variant="outlined"
              rounded="xl"
              size="x-large"
              class="mt-2"
              type="submit"
              :disabled="formAction.formProcess"
              :loading="formAction.formProcess"
              ><span class="mdi mdi-account-plus"><b>Register</b></span></v-btn
            >
            <p class="text-center mt-3">Forgot Password?</p>

            <p class="text-center">
              Already have an account?
              <RouterLink to="/" class="text-primary">Login</RouterLink>
            </p>
          </v-form>
        </v-col>
      </v-row>
      <br /><br />
      <v-footer border app color="light-green lighten-2">AgriHub2024</v-footer>
    </template>
  </AppLayout>
</template>
