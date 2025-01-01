<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/utils/supabase.js';
import headerAH from '@/components/common/headerAH.vue';
import { getCurrentUserId } from '@/utils/common_functions.js';
import { mdiCart, mdiCreditCard, mdiDelete } from '@mdi/js'; // Import Material Design Icons

const router = useRouter();
const cart = ref([]);
const removeQuantity = ref(1);
const removeDialog = ref(false);
const selectedProduct = ref(null);
const checkoutDialog = ref(false);
const shippingAddress = ref('');
const selectedPaymentMethod = ref('credit');

const fetchCartProducts = async () => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      console.warn('No user ID found.');
      return;
    }

    const { data: userData, error: userError } = await supabase
      .from('User')
      .select('cart_id')
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

    const { data: cartData, error: cartError } = await supabase
      .from('Product')
      .select('product_id, name, description, price, stock')
      .in('product_id', cartIds);

    if (cartError) {
      console.error('Error fetching cart products:', cartError.message);
      return;
    }

    cart.value = cartData.map(product => {
      const quantity = cartIds.find(item => item[0] === product.product_id)?.[1] || 1;
      return { ...product, quantity };
    }).filter(item => item.quantity > 0);
  } catch (err) {
    console.error('Unexpected error:', err);
  }
};

const removeFromCart = async (product, quantity) => {
  if (quantity > 1) {
    selectedProduct.value = product;
    removeDialog.value = true;
  } else {
    await updateCart(product.product_id, 1);
    removeDialog.value = false;
  }
};

const updateCart = async (productId, quantityToRemove) => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      console.warn('No user ID found.');
      return;
    }

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
    const productIndex = cartIds.findIndex(item => item[0] === productId);
    if (productIndex !== -1) {
      const currentQuantity = cartIds[productIndex][1];
      const newQuantity = currentQuantity - quantityToRemove;

      if (newQuantity > 0) {
        cartIds[productIndex][1] = newQuantity;
      } else {
        cartIds.splice(productIndex, 1);
      }
    }

    const { error: updateError } = await supabase
      .from('User')
      .update({ cart_id: cartIds })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating cart:', updateError.message);
      return;
    }

    if (quantityToRemove === selectedProduct.value.quantity) {
      cart.value = cart.value.filter(item => item.product_id !== productId);
    } else {
      const product = cart.value.find(item => item.product_id === productId);
      if (product) {
        product.quantity -= quantityToRemove;
      }
    }

    cart.value = cart.value.filter(item => item.quantity > 0);
    removeDialog.value = false;
  } catch (err) {
    console.error('Unexpected error:', err);
  }
};

const goToCheckout = () => {
  checkoutDialog.value = true;
};

const placeOrder = () => {
  console.log('Order placed with address:', shippingAddress.value);
  router.push({ name: 'OrderConfirmationPage' });
};

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
            <v-card class="mx-auto my-3" max-width="400">
              <v-img :src="item.image" alt="Product image" height="200px"></v-img>
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
                  <v-icon left>{{ mdiDelete }}</v-icon> Remove
                </v-btn>
                <v-btn color="success" @click="goToCheckout">
                  <v-icon left>{{ mdiCart }}</v-icon> Checkout
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </headerAH>

  <!-- Checkout Modal -->
  <v-dialog v-model="checkoutDialog" max-width="800">
    <v-card>
      <v-card-title class="text-h6"><v-icon left>{{ mdiCreditCard }}</v-icon> Checkout</v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
            v-model="shippingAddress"
            label="Shipping Address"
            required
          ></v-text-field>

          <v-select
            v-model="selectedPaymentMethod"
            :items="['credit', 'debit', 'paypal']"
            label="Payment Method"
            required
          ></v-select>

          <v-divider></v-divider>

          <v-row>
            <v-col v-for="item in cart" :key="item.product_id" cols="12">
              <v-card class="mx-auto my-3" max-width="600">
                <v-img :src="item.image" alt="Product image" height="200px"></v-img>
                <v-card-title class="text-h6">{{ item.name }}</v-card-title>
                <v-card-text>
                  <p><strong>Price:</strong> ${{ item.price }}</p>
                  <p><strong>Stock:</strong> {{ item.stock }}</p>
                  <p><strong>Quantity:</strong> {{ item.quantity }}</p>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
       <v-btn text @click="checkoutDialog = false" prepend-icon="mdi-close">
  Cancel
</v-btn>

        <v-btn color="primary" @click="placeOrder" prepend-icon="mdi-cart">
  Place Order
</v-btn>

      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Remove Quantity Dialog -->
  <v-dialog v-model="removeDialog" max-width="400">
    <v-card>
      <v-card-title class="text-h6"><v-icon left>{{ mdiDelete }}</v-icon> Remove Quantity</v-card-title>
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
