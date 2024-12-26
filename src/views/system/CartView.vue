<script setup>
import { ref } from 'vue';

const cart = ref([
  // Sample data
  { id: 1, name: 'Product 1', description: 'Description 1' },
  { id: 2, name: 'Product 2', description: 'Description 2' },
]);

</script>

<template>
  <v-container>
    <h1>Your Cart</h1>
    <v-row>
      <v-col v-for="item in cart" :key="item.id" cols="12" sm="6" md="4">

        <v-card>
          <v-card-title>{{ item.name }}</v-card-title>
          <v-card-subtitle>{{ item.description }}</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const cart = ref([]) // Your cart array (use same method to populate as in main component)
</script>
