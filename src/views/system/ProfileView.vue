<script setup>
import { onMounted } from 'vue'
import {
  modals,
  showModal,
  closeModal,
  handleLogout,
  formData,
  formAction,
  getCurrentUserId,
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

// Logout function
const router = useRouter()
const logout = () => handleLogout(router)

// Load seller products when component is mounted
onMounted(async () => {
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
  <v-app>
    <v-main>
      <headerAH></headerAH>
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
                <v-list-item @click="showModal('addProduct')">
                  <v-list-item-icon>
                    <v-icon class="mdi mdi-archive-plus-outline"></v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Add Products to Sell</v-list-item-title>
                </v-list-item>

                <!-- My products -->
                <v-list-item @click="showModal('myProducts')">
                  <v-list-item-icon>
                    <v-icon class="mdi mdi-package"></v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>My Products</v-list-item-title>
                </v-list-item>

                <!-- Payment Method -->
                <v-list-item @click="showModal('paymentMethod')">
                  <v-list-item-icon>
                    <v-icon>mdi-credit-card</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Payment Method</v-list-item-title>
                </v-list-item>
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

      
  <!-- My Order Modal -->
  <v-dialog v-model="modals.myOrders" max-width="900">
    <v-card class="elevation-4">
      <!-- Modal Header -->
      <v-toolbar flat color="white" class="border-bottom">
        <v-toolbar-title class="text-h6 font-weight-bold">Order Status</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeModal('myOrders')">
          <v-icon color="grey">mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <!-- Modal Content -->
      <v-card-text class="py-4 px-6">
        <v-simple-table>
          <template v-slot:default>
            <!-- Table Header -->
            <thead>
              <tr>
                <th class="text-left text-grey darken-1 font-weight-bold">Order no.</th>
                <th class="text-left text-grey darken-1 font-weight-bold">Order date</th>
                <th class="text-left text-grey darken-1 font-weight-bold">Bill-to name</th>
                <th class="text-right text-grey darken-1 font-weight-bold">Total</th>
                <th class="text-left text-grey darken-1 font-weight-bold">Order status</th>
                <th class="text-left"></th>
              </tr>
            </thead>
            <!-- Table Body -->
            <tbody>
              <tr v-for="order in orders" :key="order.orderNo">
                <td>{{ order.orderNo }}</td>
                <td>{{ order.orderDate }}</td>
                <td>{{ order.billToName }}</td>
                <td class="text-right">{{ order.total }}</td>
                <td>
                  <span :class="getStatusClass(order.status)">
                    {{ order.status }}
                  </span>
                </td>
                <td>
                  <v-btn text small color="primary" @click="viewDetails(order.orderNo)">
                    <span class="text-caption font-weight-bold">› View details</span>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>

      <!-- Footer -->
      <v-card-actions class="justify-end px-6 py-3">
        <v-btn color="primary" @click="closeModal('myOrders')">
          Close
        </v-btn>
      </v-card-actions>
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
                        <v-btn color="primary" @click="viewDetails(product.id)">
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
<!--Order tracking modal-->
  <v-dialog v-model="modals.orderTracking" max-width="600">
    <v-card>
      <v-toolbar flat>
        <v-toolbar-title>Order Tracking</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeModal('orderTracking')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="trackingNumber"
                label="Enter Tracking Number"
                outlined
              ></v-text-field>
              <v-btn color="primary" @click="trackOrder">Track Order</v-btn>
            </v-col>
          </v-row>
          <v-row v-if="order">
            <v-col cols="12">
              <h3>Order Status: {{ order.status }}</h3>
              <v-timeline>
                <v-timeline-item
                  v-for="(event, index) in order.events"
                  :key="index"
                  :color="event.color"
                  :icon="event.icon"
                >
                  <template v-slot:opposite>
                    {{ event.date }}
                  </template>
                  {{ event.description }}
                </v-timeline-item>
              </v-timeline>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>

      </v-container>
    </v-main>
  </v-app>
</template>
