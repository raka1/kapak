<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ProductFilter from '@/components/product/ProductFilter.vue'
import Products from '@/components/product/ProductList.vue'

const filterRef = ref<HTMLDivElement | null>(null)

function resizeWatcher() {
  const width = window.innerWidth

  if (filterRef.value) {
    if (width < 768) {
      filterRef.value.style.display = 'none'
    } else {
      filterRef.value.style.display = ''
    }
  }
}

onMounted(() => {
  window.addEventListener('resize', resizeWatcher)
  resizeWatcher()
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeWatcher)
})
</script>

<template>
  <div class="row mt-4">
    <div class="col-md-4 col-lg-3 col-xl-2" ref="filterRef">
      <ProductFilter />
    </div>
    <div class="col-12 col-md-8 col-lg-9 col-xl-10">
      <Products />
    </div>
  </div>
</template>

<style scoped></style>
