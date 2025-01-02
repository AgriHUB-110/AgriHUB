<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/utils/supabase.js'
import { getCurrentUserId } from '@/utils/common_functions'

const orders = ref([])
const userRole = ref('buyer') // Assuming you have a way to determine the role (buyer or seller)
const selectedOrder = ref(null) // Store selected order for details modal

// Function to fetch orders
const fetchOrders = async () => {
  try {
    const userId = await getCurrentUserId()

    // Fetch orders where user_id matches the current user
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId) // Fetch orders for the logged-in user

    if (error) {
      console.error('Error fetching orders:', error.message)
      return
    }

    orders.value = data || []
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

// Call fetchOrders when component is mounted
onMounted(() => {
  fetchOrders()
})

// Function to update order status (for seller)
const updateOrderStatus = async (orderId, status) => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)

    if (error) {
      console.error('Error updating order status:', error.message)
      return
    }

    // Refresh orders after status update
    fetchOrders()
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

// Function to toggle the selected order for details
const showOrderDetails = (order) => {
  selectedOrder.value = selectedOrder.value === order ? null : order
}
</script>

<template>
  <v-container>
    <v-row>
      <!-- Display Orders -->
      <v-col v-for="order in orders" :key="order.id" cols="12" md="6">
        <v-card>
          <v-card-title>
            <span v-if="userRole === 'buyer'">Order #{{ order.id }}</span>
            <span v-if="userRole === 'seller'">Sale #{{ order.id }}</span>
          </v-card-title>
          <v-card-subtitle>
            <p><strong>Status:</strong> {{ order.status }}</p>
            <p>
              <strong>Date:</strong>
              {{ new Date(order.created_at).toLocaleDateString() }}
            </p>
          </v-card-subtitle>

          <v-card-text>
            <v-list>
              <v-list-item v-for="item in order.items" :key="item.product_id">
                <v-list-item-content>
                  <v-list-item-title>{{ item.product_name }}</v-list-item-title>
                  <v-list-item-subtitle
                    >Quantity: {{ item.quantity }}</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>

          <!-- Details Button -->
          <v-card-actions>
            <v-btn @click="showOrderDetails(order)" color="primary">Details</v-btn>
          </v-card-actions>

          <!-- Show Details for Selected Order -->
          <v-card-text v-if="selectedOrder === order">
            <v-list>
              <v-list-item v-for="item in order.items" :key="item.product_id">
                <v-list-item-content>
                  <v-list-item-title>{{ item.product_name }}</v-list-item-title>
                  <v-list-item-subtitle>Quantity: {{ item.quantity }}</v-list-item-subtitle>
                  <v-list-item-subtitle>Price: ${{ item.price }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>

          <v-card-actions v-if="userRole === 'seller'">
            <!-- Seller can update order status -->
            <v-btn
              v-if="order.status === 'Pending'"
              @click="updateOrderStatus(order.id, 'Shipped')"
              color="primary"
            >
              Mark as Shipped
            </v-btn>
            <v-btn
              v-if="order.status === 'Shipped'"
              @click="updateOrderStatus(order.id, 'Delivered')"
              color="success"
            >
              Mark as Delivered
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
