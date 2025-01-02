<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { supabase } from '@/utils/supabase.js'
import { getCurrentUserId } from '@/utils/common_functions'
import { formActionDefault } from '@/utils/supabase.js'
const products = ref([])
const page = ref(1)
const perPage = ref(9)
const total = ref(0)
const search = ref('')
const selectedProduct = ref(null)
const showAddToCartModal = ref(false)
const addQuantity = ref(1) // Quantity to add
const errorMessage = ref('')
const successMessage = ref('') // For success notification
const snackbarVisible = ref(false) // To control snackbar visibility

// Computed properties for pagination
const totalPages = computed(() => Math.ceil(total.value / perPage.value))
const start = computed(() => (page.value - 1) * perPage.value + 1)
const end = computed(() => Math.min(page.value * perPage.value, total.value))

// Fetch products
const fetchProducts = async () => {
  try {
    let query = supabase
      .from('Product')
      .select('product_id, name, description, price, stock', {
        count: 'exact',
      })
      .range((page.value - 1) * perPage.value, page.value * perPage.value - 1)

    if (search.value) {
      query = query.ilike('name', `%${search.value}%`)
    }

    const { data, count, error } = await query

    if (error) {
      console.error('Error fetching products:', error.message)
      return
    }

    products.value = data || []
    total.value = count || 0
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

// Watchers
watch(page, fetchProducts)
watch(search, () => {
  page.value = 1
  fetchProducts()
})

// Mounted hook
onMounted(() => {
  fetchProducts()
})

// Function to prepare add-to-cart action
const prepareAddToCart = product => {
  selectedProduct.value = product
  addQuantity.value = 1
  showAddToCartModal.value = true
}

// Function to confirm add-to-cart action
const confirmAddToCart = async () => {
  try {
    if (
      addQuantity.value < 1 ||
      addQuantity.value > selectedProduct.value.stock
    ) {
      errorMessage.value = `Invalid quantity. Please ensure it's between 1 and the available stock (${selectedProduct.value.stock}).`
      console.warn(errorMessage.value)
      return
    }

    const userId = await getCurrentUserId()
    if (!userId) {
      errorMessage.value = 'Please Sign in first'
      console.warn('Unable to add to cart. No user ID found.')
      return
    }

    // Check if the product is already in the cart
    const { data: cartData, error: cartError } = await supabase
      .from('cart')
      .select('id, quantity')
      .eq('user_id', userId)
      .eq('product_id', selectedProduct.value.product_id)
      .maybeSingle()

    if (cartError && cartError.details !== 'Results contain 0 rows') {
      console.error('Error fetching cart data:', cartError.message)
      return
    }

    if (cartData) {
      // Update existing cart item if within stock limit
      const newQuantity = cartData.quantity + addQuantity.value
      if (newQuantity > selectedProduct.value.stock) {
        errorMessage.value = 'Quantity exceeds available stock.'
        console.warn(errorMessage.value)
        return
      }

      const { error: updateError } = await supabase
        .from('cart')
        .update({ quantity: newQuantity })
        .eq('id', cartData.id)

      if (updateError) {
        console.error('Error updating cart:', updateError.message)
        return
      }
    } else {
      // Insert new cart item if none exists
      const { error: insertError } = await supabase.from('cart').insert({
        user_id: userId,
        product_id: selectedProduct.value.product_id,
        quantity: addQuantity.value,
      })

      if (insertError) {
        console.error('Error adding to cart:', insertError.message)
        return
      }
    }
    successMessage.value = `${selectedProduct.value.name} has been added to your cart!`
    snackbarVisible.value = true // Show snackbar
    console.log(
      'Product added to cart:',
      selectedProduct.value.name,
      'Quantity:',
      addQuantity.value,
    )
    showAddToCartModal.value = false
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}
</script>

<template>
  <v-container>
    <!-- Search Bar -->
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="search"
          label="Search Products"
          placeholder="Enter product name..."
          outlined
          clearable
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Product Cards -->
    <v-row>
      <v-col
        v-for="product in products"
        :key="product.product_id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card>
          <v-card-title>{{ product.name }}</v-card-title>
          <v-card-subtitle>{{ product.description }}</v-card-subtitle>
          <v-card-text>
            <p><strong>Price:</strong> ${{ product.price }}</p>
            <p><strong>Stock:</strong> {{ product.stock }}</p>
          </v-card-text>
          <v-card-actions>
            <v-btn color="success" @click="prepareAddToCart(product)">
              Add to Cart
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Pagination -->
    <v-pagination
      v-model="page"
      :length="totalPages"
      :total-visible="5"
      @input="onPageChange"
    ></v-pagination>
  </v-container>

  <!-- Add to Cart Modal -->
  <v-dialog v-model="showAddToCartModal" max-width="500">
    <v-card>
      <v-alert v-if="errorMessage" type="error" dismissible>
        {{ errorMessage }}
      </v-alert>
      <v-card-title>Add to Cart</v-card-title>
      <v-card-subtitle>
        Add quantity for <strong>{{ selectedProduct?.name }}</strong
        >.
      </v-card-subtitle>
      <v-card-text>
        <p><strong>Description:</strong> {{ selectedProduct?.description }}</p>
        <p><strong>Price:</strong> ${{ selectedProduct?.price }}</p>
        <p><strong>Available Stock:</strong> {{ selectedProduct?.stock }}</p>
        <v-text-field
          v-model="addQuantity"
          type="number"
          label="Quantity"
          :max="selectedProduct?.stock"
          :min="1"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="confirmAddToCart">Confirm</v-btn>
        <v-btn color="secondary" @click="showAddToCartModal = false"
          >Cancel</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Success Snackbar -->
  <v-snackbar v-model="snackbarVisible" timeout="3000" top>
    {{ successMessage }}
  </v-snackbar>
</template>
