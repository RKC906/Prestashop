import { ref, computed } from 'vue'
import { cartService } from '@/services/cartService'

// On définit l'état à l'extérieur de la fonction pour qu'il soit partagé 
// entre TOUS les composants (comme un mini-Store Pinia/Vuex)
const cartId = ref(localStorage.getItem('prestashop_cart_id') || null)
const cartItems = ref([]) // Stocke les lignes du panier : [{ id_product, quantity }]
const isLoading = ref(false)

export function useCart() 
{
  
  // Initialise le panier au démarrage de l'application
  const initCart = async () => {
    if (!cartId.value) return
    
    isLoading.value = true
    try {
      const response = await cartService.getCart(cartId.value)
      // PrestaShop renvoie les lignes dans associations.cart_rows
      cartItems.value = response.data.cart.associations.cart_rows || []
    } catch (err) {
      console.error("Panier expiré ou introuvable sur le serveur. Réinitialisation.")
      clearCart()
    } finally {
      isLoading.value = false
    }
  }

  // Ajoute un produit au panier
  const addProductToCart = async (productId, quantity = 1) => {
    isLoading.value = true
    try {
      // Étape A : Si aucun panier n'existe en LocalStorage, on le crée sur PrestaShop
      if (!cartId.value) {
        const response = await cartService.createCart()
        cartId.value = response.data.cart.id
        localStorage.setItem('prestashop_cart_id', cartId.value)
      }

      // Étape B : On prépare les nouvelles lignes du panier
      const updatedRows = [...cartItems.value]
      const existingProductIndex = updatedRows.findIndex(item => item.id_product === productId)

      if (existingProductIndex !== -map) {
        // Si le produit est déjà là, on augmente sa quantité
        const currentQty = parseInt(updatedRows[existingProductIndex].quantity)
        updatedRows[existingProductIndex].quantity = currentQty + quantity
      } else {
        // Sinon on ajoute une nouvelle ligne
        updatedRows.push({
          id_product: productId,
          id_product_attribute: 0, // 0 si pas de déclinaison (taille/couleur)
          quantity: quantity
        })
      }

      // Étape C : On envoie la mise à jour à PrestaShop
      const updateResponse = await cartService.updateCart(cartId.value, updatedRows)
      cartItems.value = updateResponse.data.cart.associations.cart_rows || []

    } catch (err) {
      console.error("Erreur lors de l'ajout au panier :", err)
    } finally {
      isLoading.value = false
    }
  }

  // Nettoie le panier (Utile après une commande)
  const clearCart = () => {
    cartId.value = null
    cartItems.value = []
    localStorage.removeItem('prestashop_cart_id')
  }

  // Permet d'afficher facilement le nombre total d'articles dans la barre de navigation
  const totalArticles = computed(() => {
    return cartItems.value.reduce((total, item) => total + parseInt(item.quantity), 0)
  })

  return {
    cartId,
    cartItems,
    isLoading,
    initCart,
    addProductToCart,
    clearCart,
    totalArticles
  }
}