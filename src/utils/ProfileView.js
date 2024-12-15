// utils/ProfileView.js
import { ref, onMounted } from 'vue'
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

    const { data: userData, error: userError } = await supabase
      .from('User')
      .select('id')
      .eq('user_id', authUserId)
      .single()

    if (userError) {
      console.error('Error retrieving user table ID:', userError.message)
      return null
    }
    console.log('User Table ID:', userData.id)
    return userData.id
  } catch (err) {
    console.error('Unexpected error:', err)
    return null
  }
}

// Reactive reference for products
export const products = ref([])

// Retrieve Seller products
export const getSellerProducts = async () => {
  try {
    // Get the authenticated user's ID from the User table
    const userId = await getCurrentUserId()
    if (!userId) {
      console.warn('No authenticated user found.')
      return []
    }

    // Fetch products where `seller_id` matches the user's ID
    const { data: productData, error: productError } = await supabase
      .from('Product')
      .select('*')
      .eq('seller_id', userId)
      .order('date_added', { ascending: false })

    if (productError) {
      console.error('Error retrieving products:', productError.message)
      return []
    }

    // Bind the fetched products to the reactive reference
    products.value = productData

    return productData
  } catch (err) {
    console.error('Unexpected error:', err)
    return []
  }
}

// Fetch products on component mount
onMounted(async () => {
  products.value = await getSellerProducts()
})

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

  const dateAdded = new Date().toISOString()

  const { error } = await supabase.from('Product').insert([
    {
      name: formData.value.name,
      description: formData.value.description,
      price: formData.value.price,
      category: formData.value.category,
      stock: formData.value.stock,
      date_added: dateAdded,
      seller_id: userId,
      // image_path: formData.value.image_path,
    },
  ])

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
  }
}

export default {
  data() {
    return {
      modals: {
        myOrders: false,
      },
      orders: [
        { orderNo: "SO-136693", orderDate: "9/21/2017", billToName: "John", total: "$9,128.43", status: "Pending" },
        { orderNo: "SO-136692", orderDate: "9/21/2017", billToName: "John", total: "$9,128.43", status: "Pending" },
        { orderNo: "SO-136690", orderDate: "9/20/2017", billToName: "Jessica", total: "$4,262.32", status: "Pending" },
      ],
    };
  },
  methods: {
    closeModal(modalName) {
      this.modals[modalName] = false;
    },
    viewDetails(orderNo) {
      console.log(`Viewing details for order ${orderNo}`);
      // Implement order details view logic here
    },
    getStatusClass(status) {
      return {
        "text-warning font-weight-bold": status === "Pending",
        "text-success font-weight-bold": status === "Completed",
        "text-danger font-weight-bold": status === "Cancelled",
      };
    },
  }
}
