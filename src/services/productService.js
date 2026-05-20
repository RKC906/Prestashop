import api from './api'

export const productService = 
{
  getProducts() 
  {
    return api.get('/products?display=full')
  }
}