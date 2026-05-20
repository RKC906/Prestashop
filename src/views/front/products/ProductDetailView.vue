<template>
  <div class="product-detail-container">
    <!-- Bouton pour retourner à la liste globale -->
    <router-link to="/home" class="back-btn">← Retour aux produits</router-link>

    <!-- Gestion des états visuels -->
    <div v-if="isLoading" class="loading">Chargement des détails du produit...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    
    <!-- Affichage de la fiche produit -->
    <div v-else-if="product" class="product-sheet">
      <h1 class="product-title">{{ getLocalizedValue(product.name) }}</h1>
      <p class="reference">Référence : {{ product.reference }}</p>
      
      <hr class="separator" />

      <div class="product-meta">
        <p class="price">{{ parseFloat(product.price).toFixed(2) }} €</p>
        <p class="stock" :class="{ 'out-of-stock': product.quantity <= 0 }">
          Stock disponible : {{ product.quantity }}
        </p>
      </div>

      <div class="product-description">
        <h2>Description</h2>
        <!-- v-html permet d'interpréter le code HTML envoyé par PrestaShop -->
        <div v-html="getLocalizedValue(product.description)"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useProduct } from '@/composables/useProduct'

// L'id provient directement de l'URL grâce au paramètre props: true du routeur
const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const { product, isLoading, error, fetchProductById } = useProduct()

// Extrait la chaîne de caractères du format multilingue PrestaShop
const getLocalizedValue = (field) => {
  if (Array.isArray(field)) {
    return field[0]?.value || ''
  }
  return field
}

// Charge le produit ciblé dès que le composant est inséré dans le DOM
onMounted(() => {
  fetchProductById(props.id)
})
</script>

<style scoped>
.product-detail-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
}
.back-btn {
  display: inline-block;
  margin-bottom: 24px;
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
}
.back-btn:hover {
  text-decoration: underline;
}
.product-sheet {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.product-title {
  margin-bottom: 8px;
  color: #2c3e50;
}
.reference {
  color: #7f8c8d;
  font-size: 0.9em;
  margin-bottom: 20px;
}
.separator {
  border: 0;
  border-top: 1px solid #eee;
  margin: 20px 0;
}
.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}
.price {
  font-size: 2.2em;
  font-weight: bold;
  color: #2c3e50;
  margin: 0;
}
.stock {
  color: #27ae60;
  font-weight: bold;
}
.stock.out-of-stock {
  color: #c0392b;
}
.product-description h2 {
  font-size: 1.4em;
  color: #2c3e50;
  margin-bottom: 12px;
}
.product-description div {
  line-height: 1.7;
  color: #34495e;
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