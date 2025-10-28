<script setup lang="ts">
import ProductFilter from '@/components/product/ProductFilter.vue'
import Products from '@/components/product/ProductList.vue'
</script>

<template>
  <div class="row mt-4">
    <div class="col-2">
      <ProductFilter />
    </div>
    <div class="col-10">
      <Products />
    </div>
  </div>
</template>

<style scoped></style>
