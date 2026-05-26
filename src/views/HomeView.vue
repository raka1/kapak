<script setup lang="ts">
import CarouselBanner from '@/components/CarouselBanner.vue'
import TopUpCenter from '@/components/TopUpCenter.vue'
import Products from '@/components/product/ProductList.vue'
</script>

<template>
  <nav class="navbar fixed-bottom bg-body-primary">

  </nav>

  <CarouselBanner />
  <TopUpCenter />
  <h3 class="mb-4 mt-4">Recommendation</h3>
  <Products />
</template>

<style scoped>
.navbar {
  display: none;
  background-color: var(--main-bg);
  border-bottom-width: 1px !important;
  border-bottom-style: solid !important;
  border-bottom-color: var(--line) !important;
  transition:
    background-color 0.15s ease-in-out,
    border-bottom-color 0.15s ease-in-out,
    color 0.15s ease-in-out;
}

@media only screen and (max-width: 768px) {
  .navbar {
    display: initial;
  }
}
</style>
