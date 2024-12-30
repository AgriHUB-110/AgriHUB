// Importing necessary modules and supabase client
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase.js'
import { isLoggedIn } from '@/utils/common_functions.js'
// Reactive properties
export const userEmail = ref('')

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



// Composable to use in HomeView
export const useHomeView = () => {
  onMounted(fetchUserEmail)
}
