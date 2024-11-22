<script setup>
import { ref } from 'vue'
const visiblePass = ref(false)
import AppLayout from '@/components/layout/AppLayout.vue'
import { requiredValidator, emailValidator } from '@/utils/validator'
// import notif from '@/components/common/notif.vue'
const refVform = ref()

const formDataDefault = {
  email: '',
  password: '',
}
const formData = ref({
  ...formDataDefault,
})

const onLogin = () => {
  // Your login logic here
  alert('Miss kita')
  // console.log('Login Successful')
}

const onFormSubmit = () => {
  refVform.value?.validate().then(({ valid }) => {
    if (valid) onLogin()
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
            <!-- <notif
              :form-success-message="formAction.formSuccessMessage"
              :form-error-message="formAction.formErrorMessage"
            ></notif> -->

            <v-form
              ref="refVform"
              class="px-3 pb-5 mt-5"
              @submit.prevent="onFormSubmit"
            >
              <!-- !! Email -->
              <v-text-field
                v-model="formData.email"
                label="Email"
                variant="outlined"
                :rules="[requiredValidator, emailValidator]"
              ></v-text-field>

              <!-- !! Password -->
              <v-text-field
                class="pt-3"
                v-model="formData.password"
                :append-inner-icon="visiblePass ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visiblePass ? 'text' : 'password'"
                @click:append-inner="visiblePass = !visiblePass"
                label="Password"
                variant="outlined"
                type="password"
                :rules="[requiredValidator]"
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
