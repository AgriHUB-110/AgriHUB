<script setup>
import { ref, onMounted } from 'vue'
import {
  modals,
  showModal,
  closeModal,
  formData,
  formAction,
  submitProduct,
  resetForm,
  getSellerProducts,
  products,
} from '@/utils/ProfileView.js'
import { useRouter } from 'vue-router'
import headerAH from '@/components/common/headerAH.vue'
import UserProfile from '@/components/common/userProfile.vue'
import { requiredValidator, integerValidator } from '@/utils/validator.js'
import notif from '@/components/common/notif.vue'
import { onLogout as handleLogout } from '@/utils/common_functions.js'
import myOrders from '@/components/common/myOrders.vue'
// Logout function
const router = useRouter()
const userType = ref('')

const checkUserType = () => {
  const storedUserType = localStorage.getItem('user_type')
  userType.value = storedUserType || '' // Set the user type from localStorage
}

// Load seller products when component is mounted
onMounted(async () => {
  checkUserType()
  await getSellerProducts()
})
</script>
<style>
.profile-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.v-list-item {
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.v-list-item:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>

<template>
  <headerAH>
    <template #responsive_nav>
      <v-app>
        <v-main>
          <v-container>
            <v-row justify="center">
              <v-col cols="12" md="8">
                <v-card class="profile-card pa-5">
                  <h1 class="text-h4 mb-4">Profile Settings</h1>
                  <v-list dense>
                    <!-- My profile -->
                    <v-list-item @click="showModal('myProfile')">
                      <v-list-item-icon>
                        <v-icon>mdi-account</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>My Profile</v-list-item-title>
                    </v-list-item>

                    <!-- My orders -->
                    <v-list-item @click="showModal('myOrders')">
                      <v-list-item-icon>
                        <v-icon>mdi-package-variant</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>My Orders</v-list-item-title>
                    </v-list-item>

                    <!-- Add products -->
                    <v-list-item
                      v-if="userType !== 'Buyer'"
                      @click="showModal('addProduct')"
                    >
                      <v-list-item-icon>
                        <v-icon class="mdi mdi-archive-plus-outline"></v-icon>
                      </v-list-item-icon>
                      <v-list-item-title
                        >Add Products to Sell</v-list-item-title
                      >
                    </v-list-item>

                    <!-- My products -->
                    <v-list-item
                      v-if="userType !== 'Buyer'"
                      @click="showModal('myProducts')"
                    >
                      <v-list-item-icon>
                        <v-icon class="mdi mdi-package"></v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>My Products</v-list-item-title>
                    </v-list-item>

                    <!-- Payment Method -->
                    <!-- <v-list-item @click="showModal('paymentMethod')">
                      <v-list-item-icon>
                        <v-icon>mdi-credit-card</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>Payment Method</v-list-item-title>
                    </v-list-item> -->
                    <!-- Oder tracking -->
                    <v-list-item @click="showModal('orderTracking')">
                      <v-list-item-icon>
                        <v-icon>mdi-truck-delivery</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>Order Tracking</v-list-item-title>
                    </v-list-item>
                    <!-- Wishlist -->
                    <!-- ! add in the future... -->
                    <!-- <v-list-item @click="showModal('wishlist')">
                  <v-list-item-icon>
                    <v-icon>mdi-heart</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Wishlist</v-list-item-title>
                </v-list-item> -->
                  </v-list>

                  <!-- Logout Button -->
                  <v-btn color="error" @click="handleLogout" class="mt-4">
                    Logout
                  </v-btn>
                </v-card>
              </v-col>
            </v-row>

            <!-- Modals -->

            <!-- My profile Modal -->
            <v-dialog v-model="modals.myProfile" max-width="600">
              <v-card>
                <v-toolbar flat>
                  <v-toolbar-title>My Profile</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn icon @click="closeModal('myProfile')">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-card-text>
                  <!-- My Profile content goes here. -->
                  <UserProfile></UserProfile>
                </v-card-text>
              </v-card>
            </v-dialog>

            <!-- My Orders Modal -->
            <v-dialog v-model="modals.myOrders" max-width="600">
              <v-card>
                <v-toolbar flat>
                  <v-toolbar-title>My Orders</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn icon @click="closeModal('myOrders')">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-toolbar>
             <myOrders></myOrders>
              </v-card>
            </v-dialog>

            <!-- Add Product Modal -->
            <v-dialog v-model="modals.addProduct" max-width="600">
              <v-card>
                <v-toolbar flat>
                  <v-toolbar-title>Add Products</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn icon @click="closeModal('addProduct')">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-card-text>
                  Add Products content goes here.
                  <notif
                    :form-success-message="formAction.formSuccessMessage"
                    :form-error-message="formAction.formErrorMessage"
                  ></notif>
                  <v-form @submit.prevent="submitProduct">
                    <v-text-field
                      label="Name"
                      v-model="formData.name"
                      :rules="[requiredValidator]"
                    ></v-text-field>
                    <v-text-field
                      label="Description"
                      v-model="formData.description"
                      :rules="[requiredValidator]"
                    ></v-text-field>
                    <v-text-field
                      label="Price"
                      v-model="formData.price"
                      :rules="[requiredValidator, integerValidator]"
                    ></v-text-field>
                    <v-text-field
                      label="Category"
                      v-model="formData.category"
                      :rules="[requiredValidator]"
                    ></v-text-field>
                    <v-text-field
                      label="Stock"
                      type="number"
                      v-model="formData.stock"
                      :rules="[requiredValidator, integerValidator]"
                    ></v-text-field>

                    <!-- <v-file-input
                  v-model="formData.image"
                  :rules="[requiredValidator]"
                  accept="image/*"
                >
                </v-file-input> -->
                    <v-btn type="submit" class="mt-3">Save</v-btn>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-dialog>

            <!-- My Products -->
            <v-dialog v-model="modals.myProducts" max-width="600">
              <v-card>
                <v-toolbar flat>
                  <v-toolbar-title>My Products</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn icon @click="closeModal('myProducts')">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-toolbar>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col
                        v-for="product in products"
                        :key="product.id"
                        cols="12"
                        md="4"
                      >
                        <v-card>
                          <v-card-title>{{ product.name }}</v-card-title>
                          <v-card-subtitle>{{
                            product.description
                          }}</v-card-subtitle>
                          <v-card-text>Price: ${{ product.price }}</v-card-text>

                          <v-card-actions>
                            <v-btn
                              color="primary"
                              @click="viewDetails(product.id)"
                            >
                              Details
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-container>

                  <!-- Handle no products -->
                  <div v-if="products.length === 0" class="text-center">
                    No products available.
                  </div>
                </v-card-text>
              </v-card>
            </v-dialog>

            <!-- Payment Method Modal -->
            <v-dialog v-model="modals.paymentMethod" max-width="600">
              <v-card class="elevation-10">
                <v-toolbar flat color="blue-grey lighten-4">
                  <v-toolbar-title>Payment Method</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn icon @click="closeModal('paymentMethod')">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-card-text class="pa-4">
                  <v-row>
                    <!-- Debit/Credit Card Option -->
                    <v-col cols="12" md="6">
                      <v-btn
                        tile
                        block
                        color="blue-grey lighten-2"
                        @click="selectPaymentMethod('Debit/Credit Card')"
                      >
                        <v-icon left>mdi-credit-card</v-icon>
                        Debit/Credit Card
                      </v-btn>
                    </v-col>

                    <!-- GCash Option -->
                    <v-col cols="12" md="6">
                      <v-btn
                        tile
                        block
                        color="blue-grey lighten-2"
                        @click="selectPaymentMethod('GCash')"
                      >
                        <v-icon left>mdi-phone-check</v-icon>
                        GCash
                      </v-btn>
                    </v-col>

                    <!-- Bank Transfer Option -->
                    <v-col cols="12" md="6">
                      <v-btn
                        tile
                        block
                        color="blue-grey lighten-2"
                        @click="selectPaymentMethod('Bank Transfer')"
                      >
                        <v-icon left>mdi-bank</v-icon>
                        Bank Transfer
                      </v-btn>
                    </v-col>

                    <!-- Cash on Delivery Option -->
                    <v-col cols="12" md="6">
                      <v-btn
                        tile
                        block
                        color="blue-grey lighten-2"
                        @click="selectPaymentMethod('Cash on Delivery')"
                      >
                        <v-icon left>mdi-cash</v-icon>
                        Cash on Delivery
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-dialog>

            <!-- Order Tracking Modal -->
            <v-dialog v-model="modals.orderTracking" max-width="600">
              <v-card>
                <v-toolbar flat>
                  <v-toolbar-title>Order Tracking</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn icon @click="closeModal('orderTracking')">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-card-text> Order Tracking content goes here. </v-card-text>
              </v-card>
            </v-dialog>

            <!-- Wishlist Modal -->
            <v-dialog v-model="modals.wishlist" max-width="600">
              <v-card>
                <v-toolbar flat>
                  <v-toolbar-title>Wishlist</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn icon @click="closeModal('wishlist')">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-card-text> Wishlist content goes here. </v-card-text>
              </v-card>
            </v-dialog>
          </v-container>
        </v-main>
      </v-app>
    </template>
  </headerAH>
</template>
