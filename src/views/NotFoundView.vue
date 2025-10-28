<template>
  <div class="cons">
    <div class="cons-card uplift">
      <div style="font-size: 3rem">😕</div>
      <h1 class="mb-2 fw-bolder" style="color: var(--main-prim)">404</h1>
      <p class="mb-3 text-muted">Oops! The page you are looking for does not exist.</p>
      <router-link to="/" class="btn btn-full">
        <i class="pi pi-home"></i> Back to Home
      </router-link>
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
  border-radius: 1.5rem;
  padding: 2.5rem 2rem;
  max-width: 380px;
  width: 100%;
  text-align: center;
}
</style>
