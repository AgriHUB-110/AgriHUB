// utils/ProfileView.js
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase.js'
import { formActionDefault } from '@/utils/supabase.js'

// Modal visibility states
export const modals = ref({
  myOrders: false,
  paymentMethod: false,
  orderTracking: false,
  wishlist: false,
  addProduct: false,
  myProducts: false,
})

export const showModal = modal => {
  console.log(`Opening modal: ${modal}`)
  modals.value[modal] = true
}

export const closeModal = modal => {
  modals.value[modal] = false
}

export const handleLogout = async () => {
  const router = useRouter()
  try {
    await onLogout() // Call the logout function
    router.push('/') // Redirect to HomeView.vue after logout
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

// Reactive references for form data
export const formData = ref({
  name: '',
  description: '',
  price: '',
  category: '',
  stock: '',
})

export const formAction = ref({ ...formActionDefault })

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

    // Query the User table for the corresponding user ID
    const { data: userData, error: userError } = await supabase
      .from('User')
      .select('id') // Select the primary key (user table ID)
      .eq('user_id', authUserId) // Match the foreign key
      .single() // Fetch a single row

    if (userError) {
      console.error('Error retrieving user table ID:', userError.message)
      return null
    }
    console.log('User Table ID:', userData.id)
    return userData.id // Return the user table ID
  } catch (err) {
    console.error('Unexpected error:', err)
    return null
  }
}

// Function to handle form submission
export const submitProduct = async () => {
  formAction.value = { ...formActionDefault }
  formAction.value.formProcess = true

  const userId = await getCurrentUserId()
  if (!userId) {
    formAction.value.formErrorMessage = 'User not logged in.'
    formAction.value.formProcess = false
    return
  }

  // Get the current date and time
  const dateAdded = new Date().toISOString()

  // Insert data into Supabase Product table
  const { error } = await supabase.from('Product').insert([
    {
      name: formData.value.name,
      description: formData.value.description,
      price: formData.value.price,
      category: formData.value.category,
      stock: formData.value.stock,
      date_added: dateAdded, // Set the date_added field
      seller_id: userId, // Manually set the seller_id
      // image_path: imagePath, // Set the image_path field
    },
  ])

  // Handle response
  if (error) {
    formAction.value.formErrorMessage = error.message
    formAction.value.formStatus = error.status
  } else {
    formAction.value.formSuccessMessage = 'Product added successfully!'
    resetForm()
  }
  formAction.value.formProcess = false
}

// Function to reset the form
export const resetForm = () => {
  formData.value = {
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image_path: null,
  }
}
