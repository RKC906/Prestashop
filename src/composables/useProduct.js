import { ref } from 'vue'
import { productService } from '@/services/productService'

export function useProducts() 
{
  const products = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  const fetchProducts = async () => 
    {
    isLoading.value = true
    error.value = null
    try 
    {
      const response = await productService.getProducts()
      // PrestaShop encapsule les données dans un objet "products"
      // Si l'API est vide, il se peut que response.data soit vide ou ne contienne pas le tableau
      products.value = response.data.products || []
    } catch (err) 
    {
      console.error(err)
      error.value = "Impossible de récupérer les produits PrestaShop."
    } finally 
    {
      isLoading.value = false
    }
  }

  return { products, isLoading, error, fetchProducts }
}