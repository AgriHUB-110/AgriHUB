<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase.js'

const router = useRouter() // Add router for navigation
const products = ref([]) // Reactive array to store products
const page = ref(1) // Current page
const perPage = ref(9) // Products per page
const total = ref(0) // Total products count
const search = ref('') // Search term
const cart = ref([]) // Cart array to store selected products

// Computed properties for pagination
const totalPages = computed(() => Math.ceil(total.value / perPage.value))
const start = computed(() => (page.value - 1) * perPage.value + 1)
const end = computed(() => Math.min(page.value * perPage.value, total.value))

// Fetch products from the Supabase database
const fetchProducts = async () => {
  try {
    // Build the query with optional search filtering
    let query = supabase
      .from('Product')
      .select('*', { count: 'exact' }) // Get products with count
      .range((page.value - 1) * perPage.value, page.value * perPage.value - 1) // Range for pagination

    if (search.value) {
      // Apply a search filter if the search term is not empty
      query = query.ilike('name', `%${search.value}%`)
    }

    const { data, count, error } = await query

    if (error) {
      console.error('Error fetching products:', error.message)
      return
    }

    products.value = data || [] // Update products
    total.value = count || 0 // Update total count
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

// Watch for changes in the page number and fetch products
watch(page, fetchProducts)

// Watch for changes in the search term and fetch products
watch(search, () => {
  page.value = 1 // Reset to the first page on search
  fetchProducts()
})

// Fetch products when the component is mounted
onMounted(() => {
  fetchProducts()
})

// Function to add product to cart and navigate to cart page
const addToCart = (product) => {
  cart.value.push(product)
  console.log('Product added to cart:', product)
  router.push('/cart') // Navigate to cart page
}
</script>

<template>
  <v-container>
    <!-- Search Bar -->
    <v-row class="d-flex justify-center">
      <v-col cols="12" md="8" class="text-center">
        <v-text-field
          class="mb-2 pb-2 mt-2"
          v-model="search"
          label="Search...."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
        ></v-text-field>
      </v-col>
    </v-row>
  </v-container>
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
    <v-pagination v-model="page" :length="totalPages"></v-pagination>

    <!-- Pagination Details -->
    <div>Showing {{ start }}-{{ end }} of {{ total }} results</div>

    <!-- Navigation Buttons -->
    <div class="mt-3">
      <v-btn
        class="mr-3"
        :disabled="page === 1"
        @click="page > 1 && page--"
        color="secondary"
      >
        Previous
      </v-btn>
      <v-btn
        :disabled="page === totalPages"
        @click="page < totalPages && page++"
        color="secondary"
      >
        Next
      </v-btn>
    </div>
  </v-container>
</template>
