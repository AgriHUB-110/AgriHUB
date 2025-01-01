import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase.js'



// Retrieve user table ID

export const getCurrentUserId = async () => {
  try {
    const { data: authData, error: authError } = await supabase.auth.getUser()

    if (authError) {
      console.error('Error retrieving authenticated user:', authError.message)
      return null
    }

    const authUserId = authData?.user?.id
    if (!authUserId) {
      console.warn('No authenticated user found.')
      return null
    }

    const { data: userData, error: userError } = await supabase
      .from('User')
      .select('id, user_type')
      .eq('user_id', authUserId)
      .single()

    if (userError) {
      console.error('Error retrieving user table ID:', userError.message)
      return null
    }
    console.log('User Table ID:', userData.id)
    console.log('User Type:', userData.user_type) 

     // Store user type in localStorage
     localStorage.setItem('user_type', userData.user_type)

    return userData.id
  } catch (err) {
    console.error('Unexpected error:', err)
    return null
  }
}


export const isLoggedIn = ref(false)

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
