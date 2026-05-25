<template>
  <div class="product-detail-container">
    <router-link to="/home" class="back-btn">← Retour aux produits</router-link>

    <div v-if="isLoading" class="loading">Chargement...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    
    <div v-else-if="product" class="product-sheet">
      <div class="product-layout">
        
        <div class="product-image-section">
          <img 
            v-if="product.id_default_image"
            :src="`/api/images/products/${product.id}/${product.id_default_image}`" 
            :alt="getLocalizedValue(product.name)"
            class="main-product-img"
          />
          <div v-else class="no-image-placeholder">Aucun visuel disponible</div>
        </div>

        <div class="product-info-section">
          <h1 class="product-title">{{ getLocalizedValue(product.name) }}</h1>
          <p class="reference">Référence : {{ product.reference }}</p>
          
          <p class="price">{{ parseFloat(product.price).toFixed(2) }} €</p>
          
          <p class="stock" :class="{ 'out-of-stock': product.quantity <= 0 }">
            {{ product.quantity > 0 ? `En stock (${product.quantity} disponibles)` : 'Rupture de stock' }}
          </p>
        </div>

      </div>

      <div class="product-description">
        <h2>Description du produit</h2>
        <div v-html="getLocalizedValue(product.description)"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useProduct } from '@/composables/useProduct'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const { product, isLoading, error, fetchProducts } = useProduct()

const getLocalizedValue = (field) => {
  if (Array.isArray(field)) return field[0]?.value || ''
  return field
}

onMounted(() => {
  fetchProducts(props.id)
})
</script>

<style scoped>
.product-detail-container {
  max-width: 1000px;
  margin: 40px auto;
  padding: 0 20px;
}
.back-btn {
  display: inline-block;
  margin-bottom: 24px;
  color: #3498db;
  text-decoration: none;
}
.product-sheet {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
/* Flexbox pour aligner Image et Infos côte à côte */
.product-layout {
  display: flex;
  gap: 40px;
  margin-bottom: 40px;
}
@media (max-width: 768px) {
  .product-layout {
    flex-direction: column; /* Empilement sur mobile */
  }
}
.product-image-section {
  flex: 1;
  background: #fdfdfd;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 350px;
}
.main-product-img {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
}
.product-info-section {
  flex: 1;
}
.product-title {
  color: #2c3e50;
  margin-top: 0;
}
.reference {
  color: #7f8c8d;
}
.price {
  font-size: 2.5em;
  font-weight: bold;
  color: #e74c3c;
  margin: 20px 0;
}
.stock {
  font-weight: bold;
  color: #27ae60;
}
.stock.out-of-stock {
  color: #c0392b;
}
.product-description {
  border-top: 1px solid #eee;
  padding-top: 30px;
}
.product-description h2 {
  margin-bottom: 15px;
}
.loading, .error-message {
  text-align: center;
  font-size: 1.2em;
  padding: 40px;
}
</style>