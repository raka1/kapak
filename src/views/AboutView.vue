<script setup lang="ts">
import theme from '@/stores/theme'
import { BIconHeart, BIconLock, BIconPhone, BIconSearch, BIconShop } from 'bootstrap-icons-vue'
</script>

<template>
  <div class="cons">
    <div class="cons-card my-4 rounded-4 uplift">
      <div class="text-center">
        <img
          :src="`/images/logo-${theme().currentTheme === 'dark' ? 'secondary' : 'primary'}.png`"
          alt="Logo"
          class="logo rounded-4 mb-2"
          style="width: 72px; height: 72px"
        />
      </div>
      <h2 class="fw-bold text-center mb-3">About Kapak</h2>
      <p>
        <strong>Kapak</strong> is a modern marketplace platform that makes it easy for you to
        search, buy, and sell products easily and safely. We are committed to providing the best
        shopping experience with fast search features, secure transactions, and responsive design.
      </p>
      <div>
        <h5 class="fw-bold">Featured Features</h5>
        <ul class="ps-4">
          <li class="pb-1"><BIconSearch /> Super fast product search</li>
          <li class="pb-1"><BIconShop /> Smart shopping cart</li>
          <li class="pb-1"><BIconLock /> Secure & trusted transactions</li>
          <li class="pb-1"><BIconPhone /> Responsive design on all devices</li>
        </ul>
      </div>
      <div class="text-center text-muted">
        <span>Made with <BIconHeart /> by Kapak Team, Powered by Rondeletia</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cons {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cons-card {
  background: var(--main-bg);
  padding: 2.5rem 2rem;
}
</style>
