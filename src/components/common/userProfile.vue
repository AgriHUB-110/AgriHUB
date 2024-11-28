<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '@/utils/supabase.js';

const user = ref(null);
const isEditing = ref(false);
const formData = ref({});

async function fetchUserProfile() {
  const { data: authData } = await supabase.auth.getSession();
  const userId = authData.session.user.id;

  const { data, error } = await supabase
    .from('User')
    .select()
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
  } else {
    user.value = data;
    formData.value = { ...data };
  }
}

async function updateUserProfile() {
  const { data: authData } = await supabase.auth.getSession();
  const userId = authData.session.user.id;

  const { error } = await supabase
    .from('User')
    .update(formData.value)
    .eq('user_id', userId);

  if (error) {
    console.error('Error updating user profile:', error);
  } else {
    user.value = { ...formData.value };
    isEditing.value = false;
  }
}

onMounted(() => {
  fetchUserProfile();
});
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
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>First Name</v-list-item-title>
              <v-list-item-subtitle>{{ user.first_name }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Last Name</v-list-item-title>
              <v-list-item-subtitle>{{ user.last_name }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Email</v-list-item-title>
              <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Address</v-list-item-title>
              <v-list-item-subtitle>{{ user.address }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>City</v-list-item-title>
              <v-list-item-subtitle>{{ user.city }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>State</v-list-item-title>
              <v-list-item-subtitle>{{ user.state }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Zip Code</v-list-item-title>
              <v-list-item-subtitle>{{ user.zip_code }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Country</v-list-item-title>
              <v-list-item-subtitle>{{ user.country }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Phone</v-list-item-title>
              <v-list-item-subtitle>{{ user.phone }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-btn @click="isEditing = true">Edit</v-btn>
      </v-card-text>
      <v-card-text v-else-if="isEditing">
        <v-form @submit.prevent="updateUserProfile">
          <v-text-field v-model="formData.first_name" label="First Name"></v-text-field>
          <v-text-field v-model="formData.last_name" label="Last Name"></v-text-field>
          <v-text-field v-model="formData.email" label="Email"></v-text-field>
          <v-text-field v-model="formData.address" label="Address"></v-text-field>
          <v-text-field v-model="formData.city" label="City"></v-text-field>
          <v-text-field v-model="formData.state" label="State"></v-text-field>
          <v-text-field v-model="formData.zip_code" label="Zip Code"></v-text-field>
          <v-text-field v-model="formData.country" label="Country"></v-text-field>
          <v-text-field v-model="formData.phone" label="Phone"></v-text-field>
          <v-btn type="submit">Save</v-btn>
          <v-btn @click="isEditing = false">Cancel</v-btn>
        </v-form>
      </v-card-text>
      <v-card-text v-else>
        Loading...
      </v-card-text>
    </v-card>
  </v-container>
</template>
