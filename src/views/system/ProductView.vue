<script setup>
import headerAH from '@/components/common/headerAH.vue'
</script>
<template>
  <headerAH>
    <template #responsive_nav>
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
  </headerAH>
</template>
