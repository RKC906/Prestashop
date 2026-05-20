import { createRouter, createWebHistory } from 'vue-router'
import ProductsView from '@/views/front/ProductView.vue'

const routes = [
  {
    path: '/products',
    name: 'Products',
    component: ProductsView
  },
  {
    path: '/',
    redirect: '/products' // Redirige l'accueil vers les produits par défaut
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router