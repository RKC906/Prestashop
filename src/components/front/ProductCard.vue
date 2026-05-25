<template>
  <div class="product-card">
    <div class="product-image-container">
      <img 
        v-if="product.id_default_image"
        :src="`/api/images/products/${product.id}/${product.id_default_image}`" 
        :alt="getLocalizedValue(product.name)"
        class="product-img"
        loading="lazy"
      />
      <div v-else class="no-image">Pas d'image</div>
    </div>

    <div class="product-info">
      <h3>{{ getLocalizedValue(product.name) }}</h3>
      <p class="price">{{ parseFloat(product.price).toFixed(2) }} €</p>
      
      <router-link 
        :to="{ name: 'ProductDetailView', params: { id: product.id } }" 
        class="detail-link"
      >
        Voir les détails
      </router-link>
    </div>
  </div>
</template>

<script setup>
defineProps({
  product: {
    type: Object,
    required: true
  }
})

const getLocalizedValue = (field) => {
  if (Array.isArray(field)) return field[0]?.value || ''
  return field
}
</script>

<style scoped>
.product-card {
  border: 1px solid #eee;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  overflow: hidden; /* Pour que l'image respecte les bords arrondis */
  display: flex;
  flex-direction: column;
}
.product-image-container {
  width: 100%;
  height: 200px;
  background-color: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
}
.product-img {
  width: 100%;
  height: 100%;
  object-fit: contain; /* Évite de déformer l'image du produit */
  padding: 10px;
}
.no-image {
  color: #95a5a6;
  font-size: 0.9em;
}
.product-info {
  padding: 16px;
}
.price {
  font-weight: bold;
  color: #2c3e50;
  font-size: 1.2em;
  margin: 10px 0;
}
.detail-link {
  display: inline-block;
  margin-top: 10px;
  color: #3498db;
  text-decoration: none;
}
</style>