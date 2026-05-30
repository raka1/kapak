<script setup lang="ts">
import { ref } from 'vue'
import ProductDetail from '@/components/product/ProductDetail.vue'
import Products from '@/components/product/ProductList.vue'
import NotFoundView from './NotFoundView.vue'

const shop = ref<string | null>(null)
const shopname = ref<string | null>(null)
const isAvailable = ref<boolean>(true)

function setShop(s: string, n: string) {
  shop.value = s
  shopname.value = n
}
</script>
<template>
  <template v-if="isAvailable"
    ><ProductDetail @getShop="setShop" @avaibility="isAvailable = $event" />
    <transition name="fade">
      <h3 v-if="shop" class="mb-4 mt-4">More from {{ shop }}</h3>
    </transition>
    <Products v-if="shop" :shopname="shopname" />
    <h3 class="mb-4 mt-4">May love these too</h3>
    <Products
  /></template>
  <NotFoundView v-else />
</template>
