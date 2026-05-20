<template>
  <div class="products-container">
    <h1>Boutique PrestaShop</h1>

    <!-- États de chargement et d'erreur -->
    <div v-if="isLoading" class="loading">Chargement des produits...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>

    <!-- Grille des produits -->
    <div v-else class="products-grid">
      <ProductCard 
        v-for="product in products" 
        :key="product.id" 
        :product="product" 
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useProducts } from '@/composables/useProducts'
import ProductCard from '@/components/front/ProductCard.vue'

const { products, isLoading, error, fetchProducts } = useProducts()

// Déclenche l'appel API dès que la vue est chargée à l'écran
onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.products-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}
.loading, .error-message {
  text-align: center;
  padding: 40px;
  font-size: 1.2em;
}
.error-message {
  color: #e74c3c;
}
</style>