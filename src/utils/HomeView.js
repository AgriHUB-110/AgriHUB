// Importing necessary modules and supabase client
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase.js'

// Reactive properties
export const userEmail = ref('')
export const isLoggedIn = ref(false)

// Function to fetch user email
export const fetchUserEmail = async () => {
  try {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    userEmail.value = data.session?.user?.email || 'Not logged in'
    isLoggedIn.value = !!data.session
  } catch (error) {
    console.error('Error fetching user session:', error)
  }
}

// Function to handle user logout
export const onLogout = async () => {
  try {
    await supabase.auth.signOut()
    isLoggedIn.value = false
        // Refresh the page after logout
    window.location.reload()
  } catch (error) {
    console.error('Error logging out:', error)
  }
}

// Composable to use in HomeView
export const useHomeView = () => {
  onMounted(fetchUserEmail)
}
