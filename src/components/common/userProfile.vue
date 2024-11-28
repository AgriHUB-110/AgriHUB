<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '@/utils/supabase.js';

const user = ref(null);

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
      <v-card-text v-if="user">
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
              <v-list-item-title>User Type</v-list-item-title>
              <v-list-item-subtitle>{{ user.user_type }}</v-list-item-subtitle>
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
      </v-card-text>
      <v-card-text v-else>
        Loading...
      </v-card-text>
    </v-card>
  </v-container>
</template>
