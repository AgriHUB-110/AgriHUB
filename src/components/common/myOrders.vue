<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase.js'
import { getCurrentUserId, userType } from '@/utils/common_functions'

const orders = ref([])
const selectedOrder = ref(null) // Store selected order for details modal

// Function to fetch orders
const fetchOrders = async () => {
  try {
    const userId = await getCurrentUserId()

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      console.error('Error fetching orders:', error.message)
      return
    }

    orders.value = data || []
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

// Update product stock when the order is shipped
const updateProductTable = async (orderId) => {
  try {
    const { data: orderItems, error } = await supabase
      .from('order_items')
      .select('product_id, quantity')
      .eq('id', orderId)

    if (error) {
      console.error('Error fetching order items:', error.message)
      return
    }

    for (const item of orderItems) {
      const { data: product, error: productError } = await supabase
        .from('Product')
        .select('stock')
        .eq('product_id', item.product_id)
        .single()

      if (productError) {
        console.error('Error fetching product:', productError.message)
        continue
      }

      const newStock = product.stock - item.quantity

      if (newStock < 0) {
        console.warn(`Stock for product ID ${item.product_id} is insufficient.`)
        continue
      }

      const { error: updateError } = await supabase
        .from('Product')
        .update({ stock: newStock })
        .eq('product_id', item.product_id)

      if (updateError) {
        console.error('Error updating product stock:', updateError.message)
        continue
      }
    }
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

// Call fetchOrders when component is mounted
onMounted(() => {
  fetchOrders()
})

// Function to update order status
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

    // If status is "Shipped," update the product stock
    if (status === 'Shipped') {
      await updateProductTable(orderId)
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
            <span v-if="userType === 'Buyer'">Order #{{ order.id }}</span>
            <span v-if="userType === 'Seller'">Sale #{{ order.id }}</span>
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
                  <v-list-item-subtitle>
                    Quantity: {{ item.quantity }}
                  </v-list-item-subtitle>
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
                  <v-list-item-subtitle>
                    Quantity: {{ item.quantity }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    Price: ${{ item.price }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>

          <!-- Actions for Buyer and Seller -->
          <v-card-actions>
            <!-- Seller Actions -->
            <v-btn
              v-if="userType === 'Seller' && order.status === 'Pending'"
              @click="updateOrderStatus(order.id, 'Shipped')"
              color="primary"
            >
              Mark as Shipped
            </v-btn>
            <v-btn
              v-if="userType === 'Seller' && order.status === 'Shipped'"
              @click="updateOrderStatus(order.id, 'Delivered')"
              color="success"
            >
              Mark as Delivered
            </v-btn>

            <!-- Buyer Action -->
            <v-btn
              v-if="userType === 'Buyer' && order.status === 'Shipped'"
              @click="updateOrderStatus(order.id, 'Delivered')"
              color="success"
            >
              Mark as Received
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
