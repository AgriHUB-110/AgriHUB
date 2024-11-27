<script>

  export default {
    data() {
      return {
        products: [],
        page: 1,
        perPage: 9,
        total: 0,
      }
    },
    computed: {
      totalPages() {
        return Math.ceil(this.total / this.perPage)
      },
      start() {
        return (this.page - 1) * this.perPage + 1
      },
      end() {
        return Math.min(this.page * this.perPage, this.total)
      },
    },
    methods: {
      async fetchProducts() {
        const { data, count } = await supabase
          .from('products')
          .select('*', { count: 'exact' })
          .range((this.page - 1) * this.perPage, this.page * this.perPage - 1)

        this.products = data
        this.total = count
      },
    },
    mounted() {
      this.fetchProducts()
    },
  }
</script>


<template>
  <v-container>
    <v-row>
      <v-col
        v-for="product in products"
        :key="product.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card>
          <v-card-title>{{ product.name }}</v-card-title>
          <v-card-subtitle>{{ product.description }}</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
    <v-pagination
      v-model="page"
      :length="totalPages"
      @input="fetchProducts"
    ></v-pagination>
    <div>Showing {{ start }}-{{ end }} of {{ total }} results</div>
  </v-container>
</template>
