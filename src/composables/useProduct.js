import { ref } from 'vue'
import { productService } from '@/services/productService'

export function useProducts() {
  const products = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  const fetchProducts = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await productService.getProducts()
      // PrestaShop encapsule les données dans un objet "products"
      // Si l'API est vide, il se peut que response.data soit vide ou ne contienne pas le tableau
      products.value = response.data.products || []
    } catch (err) {
      console.error(err)
      const status = err?.response?.status
      const reason = status ? ` (statut ${status})` : ''
      error.value = `Impossible de récupérer les produits PrestaShop${reason}. Vérifiez la configuration du proxy et la clé API.`
    } finally {
      isLoading.value = false
    }
  }

  return { products, isLoading, error, fetchProducts }
}

export function useProduct() {
  const product = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  const fetchSingleProductRaw = async (id) => {
    try {
      const response = await productService.getProductById(id)
      return response.data.product
    } catch (err) {
      console.error(`Impossible de charger le produit ${id}`, err)
      return null
    }
  }

  const fetchProductById = async (id) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await productService.getProductById(id)
      // PrestaShop renvoie l'objet encapsulé dans "product"
      product.value = response.data.product || null
    } catch (err) {
      console.error(err)
      error.value = 'Impossible de charger les détails du produit.'
    } finally {
      isLoading.value = false
    }
  }

  return { product, isLoading, error, fetchProductById, fetchSingleProductRaw }
}
