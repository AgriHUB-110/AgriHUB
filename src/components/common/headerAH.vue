<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  useHomeView,
  userEmail,
} from '@/utils/HomeView.js'

import { onLogout as handleLogout,  isLoggedIn as userIsLoggedIn } from '@/utils/common_functions.js'
const drawer = ref(false)
const theme = ref('')
const router = useRouter()
const isLoggedIn = userIsLoggedIn // Use the imported isLoggedIn function
useHomeView() // Initialize the setup

const items = ref([
  { title: 'About', value: 'about' },
  { title: 'Projects', value: 'projects' },
  { title: 'Insights', value: 'insights' },
  { title: 'Locations', value: 'locations' },
  { title: 'Profile', value: 'profile' },
])

const showAboutModal = ref(false)
const showInsightsModal = ref(false)

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

const navigate = path => {
  // Implement navigation logic
  console.log(`Navigating to ${path}`)
}

const onLogout = () => {
  handleLogout()
  console.log('Logging out')
}

const mainBackgroundClass = computed(() => {
  return theme.value === 'light'
    ? 'main-light-background'
    : 'main-dark-background'
})
</script>

<template>
  <v-responsive class="border rounded">
    <v-app :theme="theme">
      <!-- App Bar -->
      <v-app-bar
        class="px-3"
        :color="theme === 'light' ? 'light-green-lighten-2' : 'green-darken-4'"
        flat
      >
        <v-app-bar-nav-icon
          variant="text"
          @click.stop="drawer = !drawer"
        ></v-app-bar-nav-icon>
        <v-toolbar-title>
          <router-link
            class="text-decoration-none text-black"
            :to="{ path: '/' }"
          >
            <v-icon>mdi-leaf</v-icon> AgriHUB
          </router-link>
        </v-toolbar-title>

        <v-spacer></v-spacer>
        <div class="theme-switch" @click="toggleTheme">
          <div
            :class="[
              'switch',
              theme === 'light' ? 'switch-light' : 'switch-dark',
            ]"
          ></div>
          <div
            :class="[
              'switch-handle',
              theme === 'light' ? 'handle-light' : 'handle-dark',
            ]"
          ></div>
        </div>
      </v-app-bar>

      <!-- Mobile Navigation Drawer -->
      <v-navigation-drawer
        v-model="drawer"
        :location="$vuetify.display.mobile ? 'bottom' : undefined"
        temporary
      >
        <v-list>
          <v-list-item :to="{ path: '/profile' }">
            <v-list-item-title>
              <v-icon left>mdi-account</v-icon> Profile
            </v-list-item-title>
          </v-list-item>
          <v-list-item :to="{ path: '/product' }">
            <v-list-item-title>
              <v-icon left>mdi-cart</v-icon> Product
            </v-list-item-title>
          </v-list-item>
          <v-list-item :to="{ path: '/' }">
            <v-list-item-title>
              <v-icon left>mdi-home</v-icon> Home
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="showAboutModal = true">
            <v-list-item-title>
              <v-icon left>mdi-information</v-icon> About
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="showInsightsModal = true">
            <v-list-item-title>
              <v-icon left>mdi-lightbulb</v-icon> Insights
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-if="!isLoggedIn" :to="{ path: '/login' }">
            <v-list-item-title>
              <v-icon left>mdi-login</v-icon> Sign in
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-if="!isLoggedIn" :to="{ path: '/register' }">
            <v-list-item-title>
              <v-icon left>mdi-account-plus</v-icon> Sign up
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-if="isLoggedIn" @click="onLogout">
            <v-list-item-title>
              <v-icon>mdi-export</v-icon> Log out
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <!-- About Modal -->
      <v-dialog v-model="showAboutModal" max-width="1000">
        <v-card color="light-green-lighten-2">
          <v-card-title class="headline">About</v-card-title>

          <v-card-text>
            <p>
              The Agri Hub Inventory Management System is designed to optimize
              the management and distribution of agricultural products. By
              leveraging advanced technologies, our system ensures efficient
              inventory tracking, quality control, and seamless order
              processing. Our goal is to empower farmers, suppliers, and
              distributors with the tools they need to enhance productivity,
              reduce waste, and improve market access.
            </p>
            <p>
              <strong>Key Features:</strong>
            </p>
            <ul>
              <li>
                <strong>Real-Time Inventory Tracking:</strong> Monitor stock
                levels in real-time to prevent overstocking and stockouts.
              </li>
              <li>
                <strong>Order Management:</strong> Efficiently handle incoming
                orders and track their status from processing to delivery.
              </li>
              <li>
                <strong>Quality Control:</strong> Regular inspections and
                monitoring to maintain high standards of product quality.
              </li>
              <li>
                <strong>Supplier and Buyer Management:</strong> Manage
                relationships with suppliers and buyers to streamline
                operations.
              </li>
              <li>
                <strong>Data Analytics:</strong> Gain insights into sales
                trends, inventory turnover, and future demand to make informed
                decisions.
              </li>
            </ul>
            <p>
              <strong>Mission:</strong> Our mission is to support the
              agricultural sector by providing a robust inventory management
              solution that enhances efficiency, sustainability, and
              profitability.
            </p>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="showAboutModal = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Insights Modal -->
      <v-dialog v-model="showInsightsModal" max-width="1000">
        <v-card color="light-green-lighten-2">
          <v-card-title class="headline">Insights</v-card-title>
          <v-card-text>
            <p><strong>Agri Hub Insights:</strong></p>

            <p><strong>Stock Level Analysis:</strong></p>
            <ul>
              <li>
                <strong>Current Stock Levels:</strong> Real-time data on the
                quantity of each product in inventory.
              </li>
              <li>
                <strong>Stock Turnover Rates:</strong> Analysis of how quickly
                products are sold and restocked, helping to identify fast-moving
                and slow-moving items.
              </li>
            </ul>

            <p><strong>Sales Trends:</strong></p>
            <ul>
              <li>
                <strong>Historical Sales Data:</strong> Insights into past sales
                performance, highlighting peak seasons and high-demand products.
              </li>
              <li>
                <strong>Forecasting:</strong> Predictive analytics to forecast
                future sales trends and optimize stock levels.
              </li>
            </ul>

            <p><strong>Quality Control Metrics:</strong></p>
            <ul>
              <li>
                <strong>Inspection Reports:</strong> Detailed reports on the
                quality of products, including any issues identified during
                inspections.
              </li>
              <li>
                <strong>Expiry Tracking:</strong> Data on the shelf life of
                perishable items and recommendations for managing near-expiry
                products.
              </li>
            </ul>

            <p><strong>Supplier Performance:</strong></p>
            <ul>
              <li>
                <strong>Supplier Ratings:</strong> Evaluation of suppliers based
                on delivery times, product quality, and reliability.
              </li>
              <li>
                <strong>Order History:</strong> Insights into past orders from
                each supplier, helping to identify the best sources for
                high-quality products.
              </li>
            </ul>

            <p><strong>Market Analysis:</strong></p>
            <ul>
              <li>
                <strong>Pricing Trends:</strong> Analysis of market prices for
                different products to help set competitive prices.
              </li>
              <li>
                <strong>Demand Forecasting:</strong> Insights into market demand
                to guide planting and harvesting decisions.
              </li>
            </ul>

            <p><strong>Sustainability Insights:</strong></p>
            <ul>
              <li>
                <strong>Resource Usage:</strong> Data on water, energy, and
                other resources used in production and storage.
              </li>
              <li>
                <strong>Sustainable Practices:</strong> Recommendations for
                reducing resource consumption and adopting more sustainable
                practices.
              </li>
            </ul>

            <p>
              By leveraging these insights, users can optimize their inventory
              management, improve operational efficiency, and make data-driven
              decisions that enhance profitability and sustainability.
            </p>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="showInsightsModal = false"
              >Close</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Main Content -->
      <v-main>
        <v-container fluid>
          <!-- Here you use the named slot -->
          <slot name="responsive_nav"></slot>
        </v-container>
      </v-main>
      <v-footer
        border
        app
        :color="theme === 'light' ? 'light-green lighten-2' : 'green-darken-4'"
      >
        AgriHub2024
      </v-footer>
    </v-app>
  </v-responsive>
</template>

<style scoped>
.v-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
}

.theme-switch {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  width: 50px;
  height: 25px;
  background-color: #ddd;
  border-radius: 25px;
  position: relative;
  transition: background-color 0.3s ease;
}

.theme-switch .switch {
  width: 100%;
  height: 100%;
  border-radius: 25px;
  transition: background-color 0.3s ease;
}

.theme-switch .switch-light {
  background-color: darkgreen; /* Light mode color */
}

.theme-switch .switch-dark {
  background-color: lightgreen; /* Dark mode color */
}

.theme-switch .switch-handle {
  width: 20px;
  height: 20px;
  background-color: #fff;
  border-radius: 50%;
  position: absolute;
  top: 2.5px;
  transition:
    left 0.3s ease,
    background-color 0.3s ease;
}

.theme-switch .handle-light {
  left: 2.5px; /* Position for light mode */
}

.theme-switch .handle-dark {
  left: 27.5px; /* Position for dark mode */
}

.theme-switch .switch-handle::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: lightgreen; /* Default color for light mode */
}

.theme-switch .switch-handle.handle-dark::before {
  background-color: darkgreen; /* Color for dark mode */
}
</style>
