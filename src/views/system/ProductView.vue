<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '@/utils/supabase.js';
import headerAH from '@/components/common/headerAH.vue';
import { getCurrentUserId } from '@/utils/common_functions.js'; // Ensure this is imported correctly

const cart = ref([]); // Reactive array to store cart items

// Fetch products in the cart based on cart_id
const fetchCartProducts = async () => {
  try {
    const userId = await getCurrentUserId(); // Get the current user ID
    if (!userId) {
      console.warn('No user ID found.');
      return;
    }

    // Fetch the cart_id from the User table
    const { data: userData, error: userError } = await supabase
      .from('User')
      .select('cart_id')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error fetching cart_id:', userError.message);
      return;
    }

    const cartId = userData?.cart_id;
    if (!cartId) {
      console.warn('No cart_id found for this user.');
      return;
    }

    // Fetch product details using the cart_id
    const { data: cartData, error: cartError } = await supabase
      .from('Product')
      .select('product_id, name, description')
      .eq('product_id', cartId); // Match the product_id with cart_id

    if (cartError) {
      console.error('Error fetching cart products:', cartError.message);
      return;
    }

    cart.value = cartData || []; // Update the cart array
  } catch (err) {
    console.error('Unexpected error:', err);
  }
};

// Fetch cart products when the component is mounted
onMounted(() => {
  fetchCartProducts();
});
</script>

<template>
  <headerAH>
    <template #responsive_nav>
      <v-container>
        <h1>Your Cart</h1>
        <v-row>
          <v-col v-for="item in cart" :key="item.product_id" cols="12" sm="6" md="4">
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
