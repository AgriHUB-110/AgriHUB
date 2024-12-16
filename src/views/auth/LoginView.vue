<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import { requiredValidator, emailValidator } from '@/utils/validator'
import { supabase, formActionDefault } from '@/utils/supabase.js'
import notif from '@/components/common/notif.vue'

const visiblePass = ref(false)
const refVform = ref()
const router = useRouter()

const formDataDefault = {
  email: '',
  password: '',
}
const formData = ref({
  ...formDataDefault,
})

const formAction = reactive({
  ...formActionDefault,
})

// Function to check user session
const checkSession = async () => {
  const { data } = await supabase.auth.getSession()
  if (data.session) {
    // If session exists, redirect to /Home
    // router.replace('/')
  }
}

// Function to handle login process
const onLogin = async () => {
  formAction.formProcess = true
  formAction.formErrorMessage = ''

  const { email, password } = formData.value
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    formAction.formErrorMessage = 'Login failed: ' + error.message
    formAction.formSuccessMessage = ''
    formAction.formProcess = false
  } else {
    formAction.formSuccessMessage = 'Logging in...'

    setTimeout(() => {
      formAction.formErrorMessage = ''
      formAction.formSuccessMessage = 'Login successful'
      formAction.formProcess = false
      router.replace('/')
    }, 2000) // 2-second delay
  }
}

// Function to handle form submission
const onFormSubmit = () => {
  refVform.value?.validate().then(({ valid }) => {
    if (valid) onLogin()
  })
}

// Check session on component mount
onMounted(() => {
  checkSession()
})
</script>

<template>
  <AppLayout>
    <template #content>
      <div class="glass-card1">
        <v-row class="d-flex justify-center">
          <v-col cols="12" md="8">
            <br /><br /><br />
            <v-img src="/images/Phase3.gif" height="375"></v-img>
          </v-col>
          <v-col cols="12" md="4" class="mx-auto">
            <v-card class="mx-auto" color="light-green-lighten-3" >
              <v-card-title>
                <v-img
                  src="/images/logo.jpg"
                  height="100"
                  class="my-2"
                  alt="Logo"
                ></v-img>
                <h2 class="my-3 text-center font-family: 'Monument Extended';">
                  AgriHub
                </h2></v-card-title
              >
              <v-divider class="my-2"></v-divider>

              <!-- Notification component to show success and error messages -->
              <notif
                :form-success-message="formAction.formSuccessMessage"
                :form-error-message="formAction.formErrorMessage"
              ></notif>
              <v-form
                ref="refVform"
                class="px-2 pb-3 mt-2"
                elevation="0"
                max-width="600"
                @submit.prevent="onFormSubmit"
              >
                <!-- Email input field with validation rules -->
                <v-text-field
                  v-model="formData.email"
                  label="Email"
                  variant="outlined"
                  :rules="[requiredValidator, emailValidator]"
                  prepend-inner-icon="mdi-email"
                ></v-text-field>

                <!-- Password input field with visibility toggle and validation rules -->
                <v-text-field
                  class="pt-3"
                  v-model="formData.password"
                  :append-inner-icon="visiblePass ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="visiblePass ? 'text' : 'password'"
                  @click:append-inner="visiblePass = !visiblePass"
                  label="Password"
                  variant="outlined"
                  :rules="[requiredValidator]"
                  prepend-inner-icon="mdi-lock-outline"
                ></v-text-field>

                <!-- Login button with loading state -->
                <v-divider class="my-2"></v-divider>
                <v-btn
                  block
                  variant="outlined"
                  rounded="xl"
                  size="x-large"
                  class="mt-2 mx-auto d-flex mb-5 mb-5 mdi mdi-login"
                  type="submit"
                  :disabled="formAction.formProcess"
                  :loading="formAction.formProcess"
                  >Login</v-btn
                >

                <p class="text-center mt-3">Forgot Password?</p>
                <br />
                <p class="text-center">
                  Don't have an account?
                  <RouterLink to="/register" class="text-primary"
                    >Sign up</RouterLink
                  >
                </p>
              </v-form>
           
            </v-card>
          </v-col>
        </v-row>
      </div>
    </template>
  </AppLayout>
</template>
