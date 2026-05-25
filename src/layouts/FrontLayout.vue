<template>
  <div class="front-layout">
    <NavBar />
    <RouterView />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import NavBar from '@/components/front/NavBar.vue'
import { useCart } from '@/composables/useCart'

const { initCart } = useCart()

onMounted(() => {
  initCart()
})
</script>
