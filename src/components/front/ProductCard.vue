<template>
  <div class="product-card">
    <h3>{{ getLocalizedValue(product.name) }}</h3>
    <p class="price">{{ parseFloat(product.price).toFixed(2) }} €</p>
    <p class="reference">Réf : {{ product.reference }}</p>
  </div>
</template>

<script setup>
defineProps({
  product: {
    type: Object,
    required: true
  }
})

const getLocalizedValue = (field) => {
  if (Array.isArray(field)) {
    return field[0]?.value || ''
  }
  return field
}
</script>

<style scoped>
.product-card {
  border: 1px solid #eee;
  padding: 16px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.price {
  font-weight: bold;
  color: #2c3e50;
  font-size: 1.2em;
}
.reference {
  font-size: 0.85em;
  color: #7f8c8d;
}
</style>