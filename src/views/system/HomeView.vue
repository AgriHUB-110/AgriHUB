<script setup>
import {
  useHomeView,
  userEmail,
  isLoggedIn,
  onLogout,
} from '@/utils/HomeView.js' // Importing the functions
import { useRouter } from 'vue-router'
import productList from '@/components/common/productList.vue'
import { ref } from 'vue'

useHomeView() // Initialize the setup
const router = useRouter()
const dialog = ref(false)
const selectedItem = ref(null)
const quantity = ref(1)
const paymentMethod = ref('')

const items = [
  { id: 1, name: 'Item 1', price: 10, image: 'image1.jpg', description: 'Description of item 1.' },
  { id: 2, name: 'Item 2', price: 20, image: 'image2.jpg', description: 'Description of item 2.' },
  { id: 3, name: 'Item 3', price: 30, image: 'image3.jpg', description: 'Description of item 3.' }
]

const openDialog = (item) => {
  selectedItem.value = item
  dialog.value = true
}

const addToCart = () => {
  // Handle adding to cart logic here
  console.log(`Added ${quantity.value} of ${selectedItem.value.name} to cart`)
  dialog.value = false
}

</script>

<style scoped>
.v-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  transition: transform 0.3s;
}
.v-card:hover {
  transform: scale(1.05);
}
.v-btn {
  transition: background-color 0.3s, transform 0.3s;
}
.v-btn:hover {
  background-color: #8BC34A;
  transform: translateY(-3px);
}
.v-carousel-item {
  transition: opacity 1s;
}
</style>

<template>
  <v-app>
    <v-main class="main-background">
      <div>
        <v-toolbar color="light-green-lighten-2">
          <v-toolbar-title>AgriHUB</v-toolbar-title>
          <v-btn><h5>About</h5></v-btn>
          <v-btn><h5>Projects</h5></v-btn>
          <v-btn><h5>Insights</h5></v-btn>
          <v-btn><h5>Locations</h5></v-btn>
          <v-btn :to="{ path: '/profile' }"><h5>Profile</h5></v-btn>
          <v-spacer></v-spacer>

          <v-btn
            v-if="!isLoggedIn"
            variant="outlined"
            class="rounded bg-white mr-5"
            :to="{ path: '/login' }"
          >
            <v-icon left>mdi-login</v-icon>
            Sign in
          </v-btn>
          <v-btn
            v-if="!isLoggedIn"
            variant="outlined"
            class="rounded mr-5"
            :to="{ path: '/register' }"
          >
            <v-icon left>mdi-account-plus</v-icon>
            Sign up
          </v-btn>
          <v-btn v-if="isLoggedIn" icon @click="onLogout">
            <v-icon>mdi-logout</v-icon>
          </v-btn>
        </v-toolbar>
      </div>
      <v-container fluid>
        <v-row class="d-flex justify-center">
          <v-col cols="12" md="8" class="text-center">
            <v-text-field
              class="mb-2 pb-2 mt-2"
              v-model="search"
              label="Search for files, plugins, and creators"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              hide-details
              single-line
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
      <v-container fluid>
        <v-row class="d-flex justify-center">
          <v-col cols="12" md="8" class="text-center">
            <!-- Items area -->
            <v-row>
              <v-col cols="12" md="4" v-for="item in items" :key="item.id">
                <v-card>
                  <v-img :src="item.image" height="200px"></v-img>
                  <v-card-title>{{ item.name }}</v-card-title>
                  <v-card-subtitle>Price: ${{ item.price }}</v-card-subtitle>
                  <v-card-text>{{ item.description }}</v-card-text>
                  <v-card-actions>
                    <v-btn color="primary" @click="openDialog(item)">
                      <v-icon left>mdi-cart-plus</v-icon>
                      Add to Cart
                    </v-btn>
                    <v-btn color="secondary" @click="openDialog(item)">
                      <v-icon left>mdi-cash-multiple</v-icon>
                      Buy Now
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
            <v-carousel hide-delimiters cycle interval="3000">
              <v-carousel-item v-for="i in 3" :key="i" :src="'image' + i + '.jpg'" cover>
                <v-row class="fill-height" align="center" justify="center">
                  <v-col class="text-center">
                    <h1>Slide {{ i }}</h1>
                    <h3>This is the slide {{ i }} description.</h3>
                  </v-col>
                </v-row>
              </v-carousel-item>
            </v-carousel>
            <br /><br />
            <productList></productList>
            <v-card class="pa-5 glass-card">
              <h1 class="text-h3 mb-3">Welcome to Our Site!</h1>
              <p class="mb-3">Logged in as: {{ userEmail }}</p>
              <p class="mb-5">
                Discover amazing content, connect with great people, and explore
                new opportunities with us. Sign up now to get started!
              </p>
              <v-btn color="primary" class="mr-4">Get Started</v-btn>
              <v-btn outlined color="secondary" class="mr-4">Learn More</v-btn>
              <v-btn
                v-if="isLoggedIn"
                outlined
                color="error"
                class="ma-4"
                @click="onLogout"
              >
                <v-icon left>mdi-logout</v-icon>
                Logout
              </v-btn>
            </v-card>

            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
          </v-col>
        </v-row>
      </v-container>

      <!-- Dialog for Add to Cart and Buy Now -->
      <v-dialog v-model="dialog" max-width="600px">
        <v-card>
          <v-card-title class="headline">{{ selectedItem?.name }}</v-card-title>
          <v-card-subtitle>Price: ${{ selectedItem?.price }}</v-card-subtitle>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field label="Quantity" type="number" v-model="quantity"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-select
                    v-model="paymentMethod"
                    :items="['Credit Card', 'Paypal', 'Cash on Delivery']"
                    label="Select Payment Method"
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="addToCart">
              <v-icon left>mdi-cart</v-icon>
              Add to Cart
            </v-btn>
            <v-btn color="secondary" @click="confirmPurchase">
              <v-icon left>mdi-cash</v-icon>
              Confirm Purchase
            </v-btn>
            <v-btn color="secondary" @click="dialog = false">
              <v-icon left>mdi-close-circle-outline</v-icon>
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>
