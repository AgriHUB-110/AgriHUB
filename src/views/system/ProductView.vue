<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '@/utils/supabase.js';
import headerAH from '@/components/common/headerAH.vue';
import { getCurrentUserId } from '@/utils/common_functions.js';

const cart = ref([]); // Reactive array to store cart items

// Fetch products in the cart based on cart_id
const fetchCartProducts = async () => {
  try {
    const userId = await getCurrentUserId();
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
      .select('product_id, name, description, price, stock')
      .eq('product_id', cartId);

    if (cartError) {
      console.error('Error fetching cart products:', cartError.message);
      return;
    }

    cart.value = cartData || [];
  } catch (err) {
    console.error('Unexpected error:', err);
  }
};

// Remove a product from the cart
const removeFromCart = async (productId) => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      console.warn('No user ID found.');
      return;
    }

    // Fetch current cart_id from the User table
    const { data: userData, error: userError } = await supabase
      .from('User')
      .select('cart_id')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error fetching cart_id:', userError.message);
      return;
    }

    let cartId = userData?.cart_id;

    // Remove the product ID from cart_id
    if (cartId === productId) {
      cartId = null; // If it's a single product cart, clear the cart
    } else {
      console.warn('Product not in cart.');
      return;
    }

    // Update the User table with the updated cart_id
    const { error: updateError } = await supabase
      .from('User')
      .update({ cart_id: cartId })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating cart:', updateError.message);
      return;
    }

    // Update the cart array locally
    cart.value = cart.value.filter((item) => item.product_id !== productId);
    console.log('Product removed from cart:', productId);
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
        <h1 class="text-center mb-5">Your Cart</h1>
        <v-row>
          <v-col v-for="item in cart" :key="item.product_id" cols="12" sm="6" md="4">
            <v-card class="mx-auto" max-width="400">
              <v-card-title class="text-h6">{{ item.name }}</v-card-title>
              <v-card-subtitle class="text-body-2 text-muted">
                {{ item.description }}
              </v-card-subtitle>
              <v-card-text>
                <p><strong>Price:</strong> ${{ item.price }}</p>
                <p><strong>Stock:</strong> {{ item.stock }}</p>
              </v-card-text>
              <v-card-actions>
                <v-btn color="error" @click="removeFromCart(item.product_id)">
                  Remove
                </v-btn>
                <v-btn color="success">
                  Checkout
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </headerAH>
</template>
