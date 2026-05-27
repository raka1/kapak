<script setup lang="ts">
import NavigationBottom from '@/components/NavigationBottom.vue'
</script>

<template>
  <div>
    <h2 class="mb-4">Account</h2>
    <hr />
    <div class="row">
      <div class="col-6 d-grid">
        <button class="btn btn-full"><RouterLink to="/login">Login</RouterLink></button>
      </div>
      <div class="col-6 d-grid">
        <button class="btn btn-full-outline">
          <RouterLink to="/sign-up">Sign Up</RouterLink>
        </button>
      </div>
    </div>
  </div>
  <NavigationBottom />
</template>

<style scoped>
button a {
  color: var(--text);
  text-decoration: none;
  transition: color 0.15s;
}

button.btn-full-outline a {
  color: var(--text);
}
</style>
