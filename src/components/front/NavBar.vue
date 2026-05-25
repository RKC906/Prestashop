<template>
  <nav class="navbar">
    <router-link to="/front/home">Boutique</router-link>

    <router-link to="/front/cart" class="cart-link">
      🛒 Panier <span v-if="totalArticles > 0" class="badge">{{ totalArticles }}</span>
    </router-link>
  </nav>
</template>

<script setup>
import { useCart } from '@/composables/useCart'

const { totalArticles } = useCart()
</script>

<style scoped>
.navbar { display: flex; justify-content: space-between; padding: 20px; background: #2c3e50; color: white; }
.navbar a { color: white; text-decoration: none; margin-right: 15px; }
.badge { background: #e74c3c; color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.8em; }
</style>