<script setup>
import { ref, computed, onMounted } from 'vue';
import { supabase } from '@/utils/supabase.js';

const products = ref([]); // Reactive array to store products
const page = ref(1); // Current page
const perPage = ref(9); // Products per page
const total = ref(0); // Total products count

// Computed properties for pagination
const totalPages = computed(() => Math.ceil(total.value / perPage.value));
const start = computed(() => (page.value - 1) * perPage.value + 1);
const end = computed(() => Math.min(page.value * perPage.value, total.value));

// Fetch products from the Supabase database
const fetchProducts = async () => {
  try {
    const { data, count, error } = await supabase
      .from('Product')
      .select('*', { count: 'exact' }) // Get products with count
      .range((page.value - 1) * perPage.value, page.value * perPage.value - 1); // Range for pagination

    if (error) {
      console.error('Error fetching products:', error.message);
      return;
    }

    products.value = data || []; // Update products
    total.value = count || 0; // Update total count
  } catch (err) {
    console.error('Unexpected error:', err);
  }
};

// Fetch products when the component is mounted
onMounted(() => {
  fetchProducts();
});
</script>
<template>
  <v-container>
    <!-- Product Cards -->
    <v-row>
      <v-col
        v-for="product in products"
        :key="product.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card>
          <v-card-title>{{ product.name }}</v-card-title>
          <v-card-subtitle>{{ product.description }}</v-card-subtitle>
          <v-card-actions>
            <v-btn color="primary">Details</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Pagination -->
    <v-pagination
      v-model="page"
      :length="totalPages"
      @input="fetchProducts"
    ></v-pagination>

    <!-- Pagination Details -->
    <div>
      Showing {{ start }}-{{ end }} of {{ total }} results
    </div>

    <!-- Navigation Buttons -->
    <div class="mt-3">
      <v-btn
        class = "mr-3"
        :disabled="page === 1"
        @click="page > 1 && (page--, fetchProducts())"
        color="secondary"
      >
        Previous
      </v-btn>
      <v-btn
        :disabled="page === totalPages"
        @click="page < totalPages && (page++, fetchProducts())"
        color="secondary"
      >
        Next
      </v-btn>
    </div>
  </v-container>
</template>
