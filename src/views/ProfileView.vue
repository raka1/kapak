<script setup lang="ts">
import NavigationBottom from '@/components/NavigationBottom.vue'
</script>

<template>
  <div>
    <h2 class="mb-4">Account</h2>
    <hr />
    <div class="row">
      <div class="col-6 d-grid">
        <RouterLink class="btn btn-full" to="/login">Login</RouterLink>
      </div>
      <div class="col-6 d-grid">
        <RouterLink class="btn btn-full-outline" to="/sign-up">Sign Up</RouterLink>
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
