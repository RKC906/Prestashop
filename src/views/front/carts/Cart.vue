<template>
  <div class="cart-container">
    <h1>Votre Panier Anonyme</h1>

    <div v-if="isLoading" class="loading">Chargement du panier...</div>

    <div v-else-if="enrichedCartItems.length === 0" class="empty-cart">
      <p>Votre panier est vide.</p>
      <router-link to="/products" class="btn-shop">Découvrir nos produits</router-link>
    </div>

    <div v-else class="cart-content">
      <div class="cart-items-list">
        
        <div v-for="item in enrichedCartItems" :key="item.id_product" class="cart-item">
          <div class="item-image">
            <img 
              v-if="item.details?.id_default_image"
              :src="`/api/images/products/${item.id_product}/${item.details.id_default_image}`" 
              :alt="getLocalizedValue(item.details.name)" 
            />
          </div>

          <div class="item-details">
            <h3>{{ getLocalizedValue(item.details?.name) || 'Produit inconnu' }}</h3>
            <p class="unit-price">Prix unitaire : {{ parseFloat(item.details?.price || 0).toFixed(2) }} €</p>
          </div>

          <div class="item-quantity">
            <span>Quantité : <strong>{{ item.quantity }}</strong></span>
          </div>

          <div class="item-total-price">
            {{ (parseFloat(item.details?.price || 0) * item.quantity).toFixed(2) }} €
          </div>
        </div>

      </div>

      <div class="cart-summary">
        <h3>Résumé de la commande</h3>
        <div class="summary-row">
          <span>Articles ({{ totalArticles }}) :</span>
          <span>{{ cartTotal.toFixed(2) }} €</span>
        </div>
        <div class="summary-row">
          <span>Frais de port :</span>
          <span class="free">Gratuit</span>
        </div>
        <hr />
        <div class="summary-row total">
          <span>Total TTC :</span>
          <span>{{ cartTotal.toFixed(2) }} €</span>
        </div>

        <button @click="proceedToCheckout" class="checkout-btn">
          Passer à la caisse
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useCart } from '@/composables/useCart'
import { useProduct } from '@/composables/useProduct'

const { cartItems, totalArticles, isLoading: isCartLoading } = useCart()
const { fetchSingleProductRaw } = useProduct()

const enrichedCartItems = ref([])
const isLocalLoading = ref(false)

// Loader global combiné
const isLoading = computed(() => isCartLoading.value || isLocalLoading.value)

// Fonction d'aide pour le multilingue PrestaShop
const getLocalizedValue = (field) => {
  if (Array.isArray(field)) return field[0]?.value || ''
  return field
}

// CŒUR DU SYSTÈME : Le croisement des données
const enrichCartData = async () => {
  if (!cartItems.value || cartItems.value.length === 0) {
    enrichedCartItems.value = []
    return
  }

  isLocalLoading.value = true
  const enriched = []

  // On boucle sur chaque ID de produit présent dans le panier
  for (const item of cartItems.value) {
    // On va chercher les détails complets du produit (nom, prix, image)
    const details = await fetchSingleProductRaw(item.id_product)
    
    // On fusionne la ligne du panier originale avec ses détails fraîchement récupérés
    enriched.push({
      ...item,
      details: details // On injecte l'objet produit complet à l'intérieur de la ligne
    })
  }

  enrichedCartItems.value = enriched
  isLocalLoading.value = false
}

// Calcul du prix total global cumulé
const cartTotal = computed(() => {
  return enrichedCartItems.value.reduce((sum, item) => {
    const price = parseFloat(item.details?.price || 0)
    return sum + (price * parseInt(item.quantity))
  }, 0)
})

// On surveille le panier : s'il change (ajout, initialisation), on relance le croisement
watch(cartItems, () => {
  enrichCartData()
}, { deep: true })

onMounted(() => {
  enrichCartData()
})

const proceedToCheckout = () => {
  alert("Prochaine étape : Implémenter le tunnel de commande anonyme PrestaShop !")
}
</script>

<style scoped>
.cart-container { max-width: 1100px; margin: 40px auto; padding: 0 20px; }
.cart-content { display: flex; gap: 30px; margin-top: 30px; }
@media (max-width: 768px) { .cart-content { flex-direction: column; } }

.cart-items-list { flex: 2; display: flex; flex-direction: column; gap: 20px; }
.cart-item { display: flex; align-items: center; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); justify-content: space-between; }

.item-image img { width: 80px; height: 80px; object-fit: contain; }
.item-details { flex: 1; padding: 0 20px; }
.item-details h3 { margin: 0 0 5px 0; color: #2c3e50; }
.unit-price { color: #7f8c8d; margin: 0; font-size: 0.9em; }
.item-total-price { font-weight: bold; font-size: 1.2em; color: #2c3e50; min-width: 90px; text-align: right; }

.cart-summary { flex: 1; background: #f9f9f9; padding: 30px; border-radius: 8px; height: fit-content; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.summary-row { display: flex; justify-content: space-between; margin: 15px 0; color: #34495e; }
.summary-row.total { font-size: 1.3em; font-weight: bold; color: #2c3e50; }
.free { color: #27ae60; font-weight: bold; }
.checkout-btn { width: 100%; background: #3498db; color: white; border: none; padding: 14px; border-radius: 6px; font-size: 1.1em; font-weight: bold; cursor: pointer; margin-top: 20px; }
.checkout-btn:hover { background: #2980b9; }

.loading, .empty-cart { text-align: center; padding: 60px; background: white; border-radius: 8px; }
.btn-shop { display: inline-block; margin-top: 20px; background: #2c3e50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; }
</style>