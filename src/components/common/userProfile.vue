<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase.js'

const user = ref(null)
const isEditing = ref(false)
const formData = ref({})

async function fetchUserProfile() {
  const { data: authData } = await supabase.auth.getSession()
  const userId = authData.session.user.id

  const { data, error } = await supabase
    .from('User')
    .select()
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
  } else {
    user.value = data
    formData.value = { ...data }
  }
}

async function updateUserProfile() {
  const { data: authData } = await supabase.auth.getSession()
  const userId = authData.session.user.id

  const { error } = await supabase
    .from('User')
    .update(formData.value)
    .eq('user_id', userId)

  if (error) {
    console.error('Error updating user profile:', error)
  } else {
    user.value = { ...formData.value }
    isEditing.value = false
  }
}

onMounted(() => {
  fetchUserProfile()
})
</script>

<style scoped>
.v-container {
  max-width: 600px;
  margin: auto;
}
</style>

<template>
  <v-container>
    <v-card>
      <v-card-title>User Profile</v-card-title>
      <v-card-text v-if="user && !isEditing">
        <v-list>
          <!-- First name -->
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                <v-icon left>mdi-account-circle</v-icon>
                First Name
              </v-list-item-title>
              <v-list-item-subtitle>{{ user.first_name }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <!-- Last name -->
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                <v-icon left>mdi-account-circle</v-icon>
                Last Name
              </v-list-item-title>
              <v-list-item-subtitle>{{ user.last_name }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <!-- Email -->
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                <v-icon left>mdi-email</v-icon>
                Email
              </v-list-item-title>
              <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <!-- Address -->
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                <v-icon left>mdi-home-map-marker</v-icon>
                Address
              </v-list-item-title>
              <v-list-item-subtitle>{{ user.address }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <!-- City -->
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                <v-icon left>mdi-city</v-icon>
                City
              </v-list-item-title>
              <v-list-item-subtitle>{{ user.city }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                <v-icon left>mdi-map-marker</v-icon>
                State
              </v-list-item-title>
              <v-list-item-subtitle>{{ user.state }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <!-- Zip code -->
            <v-list-item-content>
              <v-list-item-title>
                <v-icon left>mdi-postage-stamp</v-icon>
                Zip Code
              </v-list-item-title>
              <v-list-item-subtitle>{{ user.zip_code }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <!-- Country -->
            <v-list-item-content>
              <v-list-item-title>
                <v-icon left>mdi-flag</v-icon>
                Country
              </v-list-item-title>
              <v-list-item-subtitle>{{ user.country }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <!-- Phone -->
            <v-list-item-content>
              <v-list-item-title>
                <v-icon left>mdi-phone</v-icon>
                Phone
              </v-list-item-title>
              <v-list-item-subtitle>{{ user.phone }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <!-- User type -->
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              <v-icon left>mdi-account-group</v-icon>
              User Type
            </v-list-item-title>
            <v-list-item-subtitle>{{ user.user_type }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-btn @click="isEditing = true">
          <v-icon left>mdi-pencil</v-icon>
          Edit
        </v-btn>
      </v-card-text>
      <v-card-text v-else-if="isEditing">
        <v-form @submit.prevent="updateUserProfile">
          <v-text-field
            v-model="formData.first_name"
            label="First Name"
            prepend-inner-icon="mdi-account-circle"
          ></v-text-field>
          <v-text-field
            v-model="formData.last_name"
            label="Last Name"
            prepend-inner-icon="mdi-account-circle"
          ></v-text-field>
          <v-text-field
            v-model="formData.email"
            label="Email"
            prepend-inner-icon="mdi-email"
          ></v-text-field>
          <v-text-field
            v-model="formData.address"
            label="Address"
            prepend-inner-icon="mdi-home-map-marker"
          ></v-text-field>
          <v-text-field
            v-model="formData.city"
            label="City"
            prepend-inner-icon="mdi-city"
          ></v-text-field>
          <v-text-field
            v-model="formData.state"
            label="State"
            prepend-inner-icon="mdi-map-marker"
          ></v-text-field>
          <v-text-field
            v-model="formData.zip_code"
            label="Zip Code"
            prepend-inner-icon="mdi-postage-stamp"
          ></v-text-field>
          <v-text-field
            v-model="formData.country"
            label="Country"
            prepend-inner-icon="mdi-flag"
          ></v-text-field>
          <v-text-field
            v-model="formData.phone"
            label="Phone"
            prepend-inner-icon="mdi-phone"
          ></v-text-field>
          <v-radio-group
            v-model="formData.user_type"
            :rules="[requiredValidator]"
            label="User Type"
            class="mt-3"
          >
            <v-radio label="Buyer" value="Buyer"></v-radio>
            <v-radio label="Seller" value="Seller"></v-radio>
          </v-radio-group>

          <v-btn type="submit">
            <v-icon left>mdi-content-save</v-icon>
            Save
          </v-btn>
          <v-btn @click="isEditing = false">
            <v-icon left>mdi-cancel</v-icon>
            Cancel
          </v-btn>
        </v-form>
      </v-card-text>
      <v-card-text v-else> Loading... </v-card-text>
    </v-card>
  </v-container>
</template>
