<script setup lang="ts">
type Props = {
  page: string
}

defineProps<Props>()
</script>

<template>
  <div class="cons mt-2">
    <div class="cons-card uplift">
      <h2>{{ page }} Page Coming Soon</h2>
      <p class="text-muted">This page is under construction.<br />Stay tuned for updates!</p>
      <router-link to="/" class="btn btn-full"><i class="pi pi-home"></i> Back to Home</router-link>
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
  background-color: var(--main-bg);
  border: 1px solid var(--line);
  border-radius: 0.5rem;
  padding: 1.5rem;
}
</style>
