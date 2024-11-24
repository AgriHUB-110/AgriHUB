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
 phoneNumberValidator,
} from '@/utils/validator'
import { supabase, formActionDefault } from '@/utils/supabase.js'
import notif from '@/components/common/notif.vue'
const refVform = ref()

const formDataDefault = {
  first_name: '',
  last_name: '',
  user_type: '',
  address: '',
  country: '',
  zip_code: '',
  city: '',
  state: '',
  email: '',
  phone: '',
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
  formAction.value = { ...formActionDefault }
  formAction.value.formProcess = true

  // First, sign up the user with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: formData.value.email,
    password: formData.value.password,
    options: {
      data: {
        first_name: formData.value.first_name,
        last_name: formData.value.last_name,
      },
    },
  })

  if (authError) {
    console.log(authError)
    formAction.value.formErrorMessage = authError.message
    formAction.value.formStatus = authError.status
    formAction.value.formProcess = false
    return
  }

  // Then, insert the user data into your User table
  const { error: userError } = await supabase
    .from('User')
    .insert([
      {
        user_id: authData.user.id, // FK to auth.users
        first_name: formData.value.first_name,
        last_name: formData.value.last_name,
        user_type: formData.value.user_type,
        address: formData.value.address,
        country: formData.value.country,
        zip_code: formData.value.zip_code,
        city: formData.value.city,
        state: formData.value.state,
        email: formData.value.email,
        phone: formData.value.phone
      }
    ])

  if (userError) {
    console.log(userError)
    formAction.value.formErrorMessage = "Error creating user profile"
    formAction.value.formStatus = userError.status
  } else {
    formAction.value.formSuccessMessage = 'Successfully Registered :)'
    refVform.value?.reset()
    formData.value = { ...formDataDefault }
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
    // router.replace('/')
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
            <h2 class="my-3 text-center">AgriHub</h2>
          </v-card-title>
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
                  v-model="formData.first_name"
                  label="First Name"
                  variant="outlined"
                  :rules="[requiredValidator]"
                ></v-text-field>

                <!-- !! last name -->
                <v-text-field
                  v-model="formData.last_name"
                  label="Last Name"
                  variant="outlined"
                  class="mt-3"
                  :rules="[requiredValidator]"
                ></v-text-field>
                <!-- !! usertype -->
                <v-text-field
                  v-model="formData.user_type"
                  label="User Type"
                  variant="outlined"
                  class="mt-3"
                  :rules="[requiredValidator]"
                ></v-text-field>

                <!-- !! address -->
                <v-text-field
                  v-model="formData.address"
                  label="Address"
                  variant="outlined"
                  class="mt-3"
                  :rules="[requiredValidator]"
                ></v-text-field>
                <!-- !! country-->
                <v-text-field
                  v-model="formData.country"
                  label="Country"
                  variant="outlined"
                  class="mt-3"
                  :rules="[requiredValidator]"
                ></v-text-field>
                <!-- !! zip code -->
                <v-text-field
                  v-model="formData.zip_code"
                  label="Zip-code"
                  variant="outlined"
                  class="mt-3"
                  :rules="[requiredValidator]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <!-- !! city -->
                <v-text-field
                  v-model="formData.city"
                  label="City"
                  variant="outlined"
                  :rules="[requiredValidator]"
                ></v-text-field>

                <!-- !! state -->
                <v-text-field
                  v-model="formData.state"
                  label="State"
                  variant="outlined"
                  class="mt-3"
                  :rules="[requiredValidator]"
                ></v-text-field>
                <!-- !! email -->
                <v-text-field
                  v-model="formData.email"
                  label="Email"
                  variant="outlined"
                  class="mt-3"
                  :rules="[requiredValidator, emailValidator]"
                  prepend-inner-icon="mdi-email"
                ></v-text-field>
                <!-- !! phone -->
                <v-text-field
                  v-model="formData.phone"
                  label="Phone"
                  variant="outlined"
                  class="mt-3"
                  :rules="[requiredValidator, phoneNumberValidator]"
                  prepend-inner-icon="mdi-phone"
                ></v-text-field>
                <!-- !! Password -->
                <v-text-field
                  v-model="formData.password"
                  :append-inner-icon="visiblePass ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="visiblePass ? 'text' : 'password'"
                  label="Password"
                  variant="outlined"
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
            ><span class="mdi mdi-account-plus"><b>Register</b></span></v-btn>
            <p class="text-center mt-3">Forgot Password?</p>

            <p class="text-center">
              Already have an account?
              <RouterLink to="/login" class="text-primary">Login</RouterLink>
            </p>
          </v-form>
        </v-col>
      </v-row>
      <br /><br />
      <v-footer border app color="light-green lighten-2">AgriHub2024</v-footer>
    </template>
  </AppLayout>
</template>
