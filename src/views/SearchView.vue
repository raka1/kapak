<script setup lang="ts">
import { ref } from 'vue'
import ProductFilter from '@/components/product/ProductFilter.vue'
import Products from '@/components/product/ProductList.vue'

const isFilterShown = ref<boolean>(false)

function toggleFilter(value: boolean) {
  isFilterShown.value = value
}
</script>

<template>
  <div class="row mt-4">
    <div class="col-md-4 col-lg-3 col-xl-2 always-show-on-desktop" v-show="isFilterShown">
      <ProductFilter @toggleFilter="toggleFilter" />
    </div>
    <div class="col-12 col-md-8 col-lg-9 col-xl-10">
      <Products @toggleFilter="toggleFilter" />
    </div>
  </div>
</template>

<style>
@media only screen and (min-width: 768px) {
  .always-show-on-desktop {
    display: initial !important;
  }
}
</style>
