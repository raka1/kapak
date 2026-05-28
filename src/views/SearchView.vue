<script setup lang="ts">
import ProductFilter from '@/components/product/ProductFilter.vue'
import Products from '@/components/product/ProductList.vue'
</script>

<template>
  <div class="row mt-4">
    <div class="col-md-4 col-lg-3 col-xl-2 sm-hide">
      <ProductFilter />
    </div>
    <div class="col-12 col-md-8 col-lg-9 col-xl-10">
      <Products />
    </div>
  </div>
</template>
