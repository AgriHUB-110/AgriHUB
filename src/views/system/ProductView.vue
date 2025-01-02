<script setup>
import { ref, computed, onMounted } from 'vue'
import headerAH from '@/components/common/headerAH.vue'
import { supabase } from '@/utils/supabase.js'
import { getCurrentUserId } from '@/utils/common_functions.js'

// Computed property to check if the cart is empty
const isCartEmpty = computed(() => cart.value.length === 0)
const cart = ref([])
const checkoutDialog = ref(false)
const removedialog = ref(false)
const removeQuantity = ref(1)
const selectedItem = ref(null)
const selectedItems = ref([])
const selectAll = ref(false)
const checkoutConfirmationDialog = ref(false)
const successMessage = ref('') // For success notification
const errorMessage = ref('') // For error notification
const snackbarVisible = ref(false) // To control snackbar visibility
// Computed property for total amount
const totalAmount = computed(() =>
  selectedItems.value.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  ),
)

// Fetch cart products
const fetchCartProducts = async () => {
  const userId = await getCurrentUserId()
  const { data: cartItems } = await supabase
    .from('cart')
    .select('*')
    .eq('user_id', userId)

  const productIds = cartItems.map(item => item.product_id)
  const { data: products } = await supabase
    .from('Product')
    .select('*')
    .in('product_id', productIds)

  cart.value = products.map(product => ({
    ...product,
    quantity:
      cartItems.find(cartItem => cartItem.product_id === product.product_id)
        ?.quantity || 1,
  }))
}

// Open Remove Dialog
const openRemoveDialog = item => {
  selectedItem.value = item
  removeQuantity.value = 1
  removedialog.value = true
}

// Confirm Removal
// Function to confirm remove action
const confirmRemove = async () => {
  try {
    if (removeQuantity.value > selectedItem.value.quantity) {
      errorMessage.value = 'Quantity to remove exceeds available quantity.'
      snackbarVisible.value = true
      return
    }

    // Update the quantity locally
    selectedItem.value.quantity -= removeQuantity.value

    // If the quantity reaches 0, remove the item from the cart
    if (selectedItem.value.quantity === 0) {
      cart.value = cart.value.filter(
        item => item.product_id !== selectedItem.value.product_id,
      )
      // Remove the item from the database
      await supabase
        .from('cart')
        .delete()
        .eq('user_id', await getCurrentUserId())
        .eq('product_id', selectedItem.value.product_id)
    } else {
      // Otherwise, update the quantity in the database
      await supabase
        .from('cart')
        .update({ quantity: selectedItem.value.quantity })
        .eq('user_id', await getCurrentUserId())
        .eq('product_id', selectedItem.value.product_id)
    }

    successMessage.value = `Removed ${removeQuantity.value} items from the cart.`
    snackbarVisible.value = true // Show success snackbar
  } catch (err) {
    console.error('Unexpected error:', err)
    errorMessage.value = 'Failed to remove items. Please try again.'
    snackbarVisible.value = true // Show error snackbar
  } finally {
    // Close the dialog after update
    removedialog.value = false
  }
}

// Handle Checkbox Selection
const toggleSelection = item => {
  if (item.selected) {
    selectedItems.value.push(item)
  } else {
    selectedItems.value = selectedItems.value.filter(
      selected => selected.product_id !== item.product_id,
    )
  }
}

// const toggleSelectAll = () => {
//   if (selectAll.value) {
//     selectedItems.value = [...cart.value]
//     cart.value.forEach(item => (item.selected = true))
//   } else {
//     selectedItems.value = []
//     cart.value.forEach(item => (item.selected = false))
//   }
// }

// Handle Checkout
const handleCheckout = async () => {
  const userId = await getCurrentUserId()
  if (!userId) return

  try {
    // 1. Insert into orders table (create a new order)
    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total_price: totalAmount.value,
        status: 'Pending', // Assuming "pending" is the status
      })
      .select('id')
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError.message)
      return
    }

    // 2. Prepare the order items for insertion
    const orderItems = selectedItems.value.map(item => ({
      id: newOrder.id, // Link each item to the created order
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }))

    // 3. Insert all order items into the database at once
    const { error: itemsError } = await supabase
      .from('order_items')
      .upsert(orderItems, { onConflict: ['id', 'product_id'] }) // Prevent duplicates
    if (itemsError) {
      console.error('Error inserting order items:', itemsError.message)
      errorMessage.value = 'Failed to add items to the order. Please try ordering one at a time.'
      snackbarVisible.value = true
      return
    }

    // 4. Remove the selected items from the cart in the database
    const productIdsToRemove = selectedItems.value.map(item => item.product_id)
    await supabase
      .from('cart')
      .delete()
      .eq('user_id', userId)
      .in('product_id', productIdsToRemove)

    // 5. Remove the selected items locally from the cart state
    cart.value = cart.value.filter(item => !selectedItems.value.includes(item))

    // Clear selectedItems and selectAll
    selectedItems.value = []
    selectAll.value = false
    checkoutDialog.value = false
    checkoutConfirmationDialog.value = false

    successMessage.value = 'Order and items successfully added!'
    snackbarVisible.value = true
    console.log('Order and items successfully added.')
  } catch (error) {
    console.error('Unexpected error during checkout:', error)
    errorMessage.value = 'Failed to checkout. Please try again.'
    snackbarVisible.value = true
  }
}

onMounted(fetchCartProducts)
</script>

<style scoped>
.text-center {
  text-align: center;
}
.mb-5 {
  margin-bottom: 20px;
}
</style>

<template>
  <headerAH>
    <template #responsive_nav>
      <v-container>
        <h1 class="text-center mb-5">Your Cart</h1>

        <v-row>
          <v-col
            v-for="item in cart"
            :key="item.product_id"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card class="mx-auto" max-width="400">
              <v-card-title class="text-h6">{{ item.name }}</v-card-title>
              <v-card-subtitle class="text-body-2 text-muted">
                {{ item.description }}
              </v-card-subtitle>
              <v-card-text>
                <p><strong>Price:</strong> ${{ item.price }}</p>
                <p><strong>Stock:</strong> {{ item.stock }}</p>
                <p><strong>Quantity:</strong> {{ item.quantity }}</p>
                <v-checkbox
                  v-model="item.selected"
                  :label="'Select for checkout'"
                  @change="toggleSelection(item)"
                />
              </v-card-text>
              <v-card-actions>
                <v-btn color="error" @click="openRemoveDialog(item)">
                  Remove
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <!-- <v-checkbox
              v-model="selectAll"
              label="Select All"
              @change="toggleSelectAll"
            /> -->
            <h3>Total: ${{ totalAmount }}</h3>
            <v-btn
              color="success"
              @click="checkoutDialog = true"
              :disabled="isCartEmpty"
            >
              Checkout
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </headerAH>

  <!-- Checkout Confirmation Modal -->
  <v-dialog v-model="checkoutDialog" max-width="500">
    <v-card>
      <v-card-title class="text-h6">Confirm Checkout</v-card-title>
      <v-card-text>
        <p>
          Your total amount is <strong>${{ totalAmount }}</strong
          >.
        </p>
        <p>Are you sure you want to proceed with the purchase?</p>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="checkoutDialog = false">Cancel</v-btn>
        <v-btn color="primary" @click="checkoutConfirmationDialog = true"
          >Proceed</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Checkout Final Confirmation Modal -->
  <v-dialog v-model="checkoutConfirmationDialog" max-width="500">
    <v-card>
      <v-card-title class="text-h6">Final Confirmation</v-card-title>
      <v-card-text>
        <p>Your order will now be processed. Do you want to finalize it?</p>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="checkoutConfirmationDialog = false">Cancel</v-btn>
        <v-btn color="primary" @click="handleCheckout">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Remove Modal -->
  <v-dialog v-model="removedialog" max-width="500">
    <v-card>
      <v-card-title class="text-h6">Enter quantity to remove:</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="removeQuantity"
          type="number"
          label="Quantity"
          :min="1"
          :max="selectedItem?.quantity || 0"
          required
        ></v-text-field>
        <p>Are you sure you want to remove this quantity?</p>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="removedialog = false">Cancel</v-btn>
        <v-btn color="primary" @click="confirmRemove">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- Success/Error Snackbar inside the Card -->
  <v-snackbar v-model="snackbarVisible" timeout="3000" top>
    {{ successMessage || errorMessage }}
  </v-snackbar>
</template>
