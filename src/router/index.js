import { createRouter, createWebHistory } from 'vue-router'
import ProductsView from '@/views/front/products/ProductView.vue'
import ProductDetailView from '@/views/front/products/ProductDetailView.vue'
import Home from '@/views/front/Home.vue'
import FrontLayout from '@/layouts/FrontLayout.vue'

const routes = [
  {
    path: '/front',
    component: FrontLayout,
    children: [
      {
        path: '',
        redirect: '/front/home' // Redirige l'accueil vers les produits par défaut
      },
      {
        path: 'home',
        name: 'Home',
        component: Home
      },
      {
        path: 'products',
        name: 'Products',
        component: ProductsView
      },
      {
        path: 'products/:id',
        name: 'ProductDetailView',
        component: ProductDetailView,
        props: true
      },
      {
        path: 'cart',
        name: 'Cart',
        component: () => import('@/views/front/carts/Cart.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router