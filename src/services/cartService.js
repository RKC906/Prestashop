import api from './api'

export const cartService = {
  // 1. Crée un tout nouveau panier vide pour un invité (id_customer = 0)
  createCart() {
    const cartData = {
      cart: {
        id_customer: 0,
        id_currency: 1, // Devise par défaut (ex: Euro)
        id_lang: 1,     // Langue par défaut
        associations: {
          cart_rows: [] // Vide au départ
        }
      }
    }
    return api.post('/carts', cartData)
  },

  // 2. Récupère le contenu d'un panier existant
  getCart(cartId) {
    return api.get(`/carts/${cartId}`)
  },

  // 3. Met à jour les produits à l'intérieur d'un panier
  updateCart(cartId, cartRows) {
    const cartData = {
      cart: {
        id: cartId,
        id_customer: 0,
        associations: {
          cart_rows: cartRows // Tableau contenant les [{id_product, id_product_attribute, quantity}]
        }
      }
    }
    // PrestaShop requiert un PUT pour modifier une ressource existante
    return api.put(`/carts/${cartId}`, cartData)
  }
}