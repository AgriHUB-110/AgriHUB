<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '@/utils/supabase.js';
import headerAH from '@/components/common/headerAH.vue';
import { getCurrentUserId } from '@/utils/common_functions.js';

// Cart stores the products and quantities (2D array)
const cart = ref([]);

// Variable to store the quantity to remove when prompted
const removeQuantity = ref(1);
const removeDialog = ref(false);
const selectedProduct = ref(null); // Selected product for removal

// Fetch products in the cart based on cart_id array
const fetchCartProducts = async () => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      console.warn('No user ID found.');
      return;
    }

    // Fetch the cart_id (as an array) from the User table
    const { data: userData, error: userError } = await supabase
      .from('User')
      .select('cart_id') // cart_id should be an array column
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error fetching cart_id:', userError.message);
      return;
    }

    const cartIds = userData?.cart_id || [];
    if (cartIds.length === 0) {
      console.warn('No products in the cart.');
      return;
    }

    // Fetch products in the cart using the cart_ids
    const { data: cartData, error: cartError } = await supabase
      .from('Product')
      .select('product_id, name, description, price, stock')
      .in('product_id', cartIds); // Fetch products whose IDs are in cartIds array

    if (cartError) {
      console.error('Error fetching cart products:', cartError.message);
      return;
    }

    // Map cart data with quantities stored in cart_ids (2D array structure)
    cart.value = cartData.map(product => {
      const quantity = cartIds.find(item => item[0] === product.product_id)?.[1] || 1;
      return { ...product, quantity };
    }).filter(item => item.quantity > 0); // Filter out items with 0 quantity

  } catch (err) {
    console.error('Unexpected error:', err);
  }
};


// Remove a product from the cart (decrease quantity or remove entirely)
const removeFromCart = async (product, quantity) => {
  try {
    // If quantity is more than 1, ask for confirmation
    if (quantity > 1) {
      selectedProduct.value = product;
      removeDialog.value = true;
    } else {
      await updateCart(product.product_id, 1); // Directly remove if quantity is 1
      removeDialog.value = false; // Close dialog after removing product
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
};

// Update the cart: subtract quantity or remove product entirely
const updateCart = async (productId, quantityToRemove) => {
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

    let cartIds = userData?.cart_id || [];

    // Find the product in the cart and update the quantity or remove it entirely
    const productIndex = cartIds.findIndex(item => item[0] === productId);
    if (productIndex !== -1) {
      const currentQuantity = cartIds[productIndex][1];
      const newQuantity = currentQuantity - quantityToRemove;

      if (newQuantity > 0) {
        // Update quantity if it's more than 0
        cartIds[productIndex][1] = newQuantity;
      } else {
        // Remove product if quantity is 0 or less
        cartIds.splice(productIndex, 1);
      }
    }

    // Update the User table with the updated cart_id array
    const { error: updateError } = await supabase
      .from('User')
      .update({ cart_id: cartIds })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating cart:', updateError.message);
      return;
    }

    // Update the cart array locally by modifying the quantity or removing the product
    if (quantityToRemove === selectedProduct.value.quantity) {
      cart.value = cart.value.filter(item => item.product_id !== productId); // Remove product entirely
    } else {
      const product = cart.value.find(item => item.product_id === productId);
      if (product) {
        product.quantity -= quantityToRemove;
      }
    }

    // Filter out items with quantity 0
    cart.value = cart.value.filter(item => item.quantity > 0);

    console.log('Product quantity updated in cart:', productId);
    removeDialog.value = false; // Close dialog after successful update
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
                <p><strong>Quantity:</strong> {{ item.quantity }}</p>
              </v-card-text>
              <v-card-actions>
                <v-btn color="error" @click="removeFromCart(item, item.quantity)">
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

  <!-- Prompt dialog for quantity removal -->
  <v-dialog v-model="removeDialog" max-width="400">
    <v-card>
      <v-card-title class="text-h6">Remove Quantity</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="removeQuantity"
          type="number"
          min="1"
          :max="selectedProduct?.quantity"
          label="Quantity to remove"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="removeDialog = false">Cancel</v-btn>
        <v-btn
          color="primary"
          @click="updateCart(selectedProduct.product_id, removeQuantity)"
        >
          Remove
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
