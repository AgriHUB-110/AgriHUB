<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { onLogout } from '@/utils/HomeView.js' // Ensure onLogout is properly implemented
import headerAH from '@/components/common/headerAH.vue'
import UserProfile from '@/components/common/userProfile.vue';

const router = useRouter()

// Modal visibility states
const modals = ref({
  myOrders: false,
  mySubscriptions: false,
  paymentMethod: false,
  orderTracking: false,
  wishlist: false,
  buyProducts: false,
  sellProducts: false,
  addProduct: false,
  myProducts: false,
})

const showModal = modal => {
  console.log(`Opening modal: ${modal}`)
  modals.value[modal] = true
}

const closeModal = modal => {
  modals.value[modal] = false
}

const handleLogout = async () => {
  try {
    await onLogout() // Call the logout function
    router.push('/') // Redirect to HomeView.vue after logout
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>

<style scoped>
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
                <!-- Buy products -->
                <v-list-item @click="showModal('buyProducts')">
                  <v-list-item-icon>
                    <v-icon>mdi-cart-plus</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Buy Products</v-list-item-title>
                </v-list-item>

                <!-- Add products -->
                <v-list-item @click="showModal('addProduct')">
                  <v-list-item-icon>
                    <v-icon class="mdi mdi-archive-plus-outline"></v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Add Products</v-list-item-title>
                </v-list-item>

                <!-- My products -->
                <v-list-item @click="showModal('myProducts')">
                  <v-list-item-icon>
                    <v-icon class="mdi mdi-package"></v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>My Products</v-list-item-title>
                </v-list-item>

                <!-- Sell products -->
                <v-list-item @click="showModal('sellProducts')">
                  <v-list-item-icon>
                    <v-icon>mdi-cash</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Sell Products</v-list-item-title>
                </v-list-item>
                <!-- My subscriptions -->
                <v-list-item @click="showModal('mySubscriptions')">
                  <v-list-item-icon>
                    <v-icon>mdi-receipt</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>My Subscription</v-list-item-title>
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
                <v-list-item @click="showModal('wishlist')">
                  <v-list-item-icon>
                    <v-icon>mdi-heart</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Wishlist</v-list-item-title>
                </v-list-item>
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
            <v-card-text> My Orders content goes here. </v-card-text>
          </v-card>
        </v-dialog>

        <!-- Buy Products Modal -->
        <v-dialog v-model="modals.buyProducts" max-width="600">
          <v-card>
            <v-toolbar flat>
              <v-toolbar-title>Buy Products</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon @click="closeModal('buyProducts')">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text> Buy Products content goes here. </v-card-text>
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
              <v-text-field label="Name"></v-text-field>
              <v-text-field label="Description"></v-text-field>
              <v-text-field label="Price"></v-text-field>
              <v-text-field label="Category"></v-text-field>
              <v-text-field label="Stock"></v-text-field>
              <v-file-input
                label="Upload Photo"
                accept="image/*"
                prepend-icon="mdi-camera"
                @change="uploadPhoto"
                required
              ></v-file-input>
              <v-btn type="submit">Save</v-btn>
            </v-card-text>
          </v-card>
        </v-dialog>

        <!-- My  products  -->
        <v-dialog v-model="modals.myProducts" max-width="600">
          <v-card>
            <v-toolbar flat>
              <v-toolbar-title>My Products</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon @click="closeModal('myProducts')">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text> Buy Products content goes here. </v-card-text>
          </v-card>
        </v-dialog>

        <!-- Sell Products Modal -->
        <v-dialog v-model="modals.sellProducts" max-width="600">
          <v-card>
            <v-toolbar flat>
              <v-toolbar-title>Sell Products</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon @click="closeModal('sellProducts')">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text> Sell Products content goes here. </v-card-text>
          </v-card>
        </v-dialog>

        <!-- My Subscriptions Modal -->
        <v-dialog v-model="modals.mySubscriptions" max-width="600">
          <v-card>
            <v-toolbar flat>
              <v-toolbar-title>My Subscription</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon @click="closeModal('mySubscriptions')">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text> My Subscriptions content goes here. </v-card-text>
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
          <v-btn tile block color="blue-grey lighten-2" @click="selectPaymentMethod('Debit/Credit Card')">
            <v-icon left>mdi-credit-card</v-icon>
            Debit/Credit Card
          </v-btn>
        </v-col>
        
        <!-- GCash Option -->
        <v-col cols="12" md="6">
          <v-btn tile block color="blue-grey lighten-2" @click="selectPaymentMethod('GCash')">
            <v-icon left>mdi-phone-check</v-icon>
            GCash
          </v-btn>
        </v-col>

        <!-- Bank Transfer Option -->
        <v-col cols="12" md="6">
          <v-btn tile block color="blue-grey lighten-2" @click="selectPaymentMethod('Bank Transfer')">
            <v-icon left>mdi-bank</v-icon>
            Bank Transfer
          </v-btn>
        </v-col>

        <!-- Cash on Delivery Option -->
        <v-col cols="12" md="6">
          <v-btn tile block color="blue-grey lighten-2" @click="selectPaymentMethod('Cash on Delivery')">
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
