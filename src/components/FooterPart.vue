<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div
    class="footer"
    :style="{ display: route.name === 'Login' || route.name === 'SignUp' ? 'none' : '' }"
  >
    <div class="footer-links mb-2">
      <RouterLink to="/about">About</RouterLink>
      <span class="mx-2">|</span>
      <RouterLink to="/contact">Contact</RouterLink>
      <span class="mx-2">|</span>
      <RouterLink to="/faq">FAQ</RouterLink>
    </div>
    <div class="footer-social mb-2">
      <a href="https://instagram.com/_tukangsate2" target="_blank">
        <i class="pi pi-instagram"></i>
      </a>
      <a href="https://www.facebook.com/Prevolver/" target="_blank">
        <i class="pi pi-facebook"></i>
      </a>
    </div>
    <div class="footer-contact mb-2 small">
      Email:
      <a href="mailto:p.raka56@outlook.com" class="footer-email">p.raka56@outlook.com</a>
    </div>
    <div class="container mb-3">© 2025 Kapak. All Rights Reserved.</div>
  </div>
</template>

<style scoped>
.footer {
  background: var(--main-bg);
  border-top: 1px solid var(--line);
  padding: 1.5rem 0 0.5rem 0;
  color: var(--main-text);
  font-size: 0.95rem;
  text-align: center;
}

.footer-links a {
  color: var(--main-text);
  margin: 0 0.5rem;
  text-decoration: none;
  transition: color 0.15s;
  opacity: 0.85;
}
.footer-links a:hover {
  color: var(--main-prim);
  text-decoration: underline;
  opacity: 1;
}

.footer-social a {
  display: inline-block;
  color: var(--main-text);
  margin: 0 0.5rem;
  font-size: 1.4rem;
  opacity: 0.7;
  transition:
    color 0.15s ease-in-out,
    opacity 0.15s ease-in-out,
    transform 0.15s ease-in-out;
}

.footer-social a:hover {
  color: var(--main-prim);
  opacity: 1;
  transform: translateY(-2px) scale(1.1);
}

.footer-contact {
  color: var(--main-text);
  opacity: 0.7;
}

.footer-email {
  color: var(--main-text);
  text-decoration: none;
  margin-left: 0.2rem;
  transition: color 0.15s;
}
.footer-email:hover {
  color: var(--main-prim);
  text-decoration: underline;
}

.container.mb-3 {
  opacity: 0.6;
  font-size: 0.92em;
}
</style>
