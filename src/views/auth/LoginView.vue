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

const checkSession = async () => {
  const { data } = await supabase.auth.getSession()
  if (data.session) {
    // Session exists, route to /Home
    router.replace('/Home')
  }
}

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
      router.replace('/Home')
    }, 2000)  // 2-second delay
  }
}


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
      <v-row class="d-flex justify-center">
        <v-col cols="12" md="6" class="mx-auto">
          <v-card class="glass-card border-thin" text="">
            <notif
              :form-success-message="formAction.formSuccessMessage"
              :form-error-message="formAction.formErrorMessage"
            ></notif>

            <v-form
              ref="refVform"
              class="px-3 pb-5 mt-5"
              @submit.prevent="onFormSubmit"
            >
              <v-text-field
                v-model="formData.email"
                label="Email"
                variant="outlined"
                :rules="[requiredValidator, emailValidator]"
              ></v-text-field>

              <v-text-field
                class="pt-3"
                v-model="formData.password"
                :append-inner-icon="visiblePass ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visiblePass ? 'text' : 'password'"
                @click:append-inner="visiblePass = !visiblePass"
                label="Password"
                variant="outlined"
                :rules="[requiredValidator]"
              ></v-text-field>

              <v-btn
                block
                variant="outlined"
                rounded="xl"
                size="x-large"
                class="mt-2 mx-auto d-flex mb-5"
                type="submit"
                :disabled="formAction.formProcess"
                :loading="formAction.formProcess"
                >Login</v-btn
              >

              <v-divider class="my-5"></v-divider>
              <p class="text-center mt-3">Forgot Password?</p>
              <br />
              <p class="text-center">
                Don't have an account?
                <RouterLink to="/register" class="text-primary"
                  >Sign up</RouterLink>
              </p>
              <br />
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </AppLayout>
</template>
