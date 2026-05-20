import { createRouter, createWebHistory } from 'vue-router'
import ProductsView from '@/views/front/ProductView.vue'
import Home from '@/views/front/Home.vue'

const routes = [
  {
    path: '/',
    redirect: '/home' // Redirige l'accueil vers les produits par défaut
  },
  {
    path: '/products',
    name: 'Products',
    component: ProductsView
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router