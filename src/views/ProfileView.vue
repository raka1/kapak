<script setup lang="ts">
import NavigationBottom from '@/components/NavigationBottom.vue'
import NProgress from 'nprogress'
import login from '@/stores/login'
import cart from '@/stores/cart'

async function logout() {
  NProgress.start()

  try {
    const response = await fetch('/api/v1/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const res = await response.json()

    if (res.response == 'SUCCESS') {
      login().setUsername('')
      cart().reset()
    }
  } catch (error) {
    console.error(error)
  }

  NProgress.done()
}
</script>

<template>
  <div v-if="login().username" class="box">
    <div class="position-absolute top-0 mt-4 mb-4 d-flex align-items-center">
      <span class="profile-image"></span>
      <strong class="profile-name">{{ login().username }}</strong>
    </div>
    <div class="menu-item">
      <RouterLink to="/orders"> <i class="pi pi-list"></i> My Orders </RouterLink>
    </div>
    <div class="menu-item">
      <RouterLink to="/wishlist"> <i class="pi pi-heart"></i> Wishlist </RouterLink>
    </div>
    <div class="menu-item">
      <RouterLink to="/settings"> <i class="pi pi-cog"></i> Settings </RouterLink>
    </div>
    <div class="menu-item">
      <div @click.prevent="logout"> <i class="pi pi-sign-out"></i> Logout </div>
    </div>
  </div>
  <div v-else class="box">
    <h2 class="mb-4">Account</h2>
    <hr style="color: var(--line)" />
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
.box {
  background-color: var(--main-bg);
  border-radius: 0.5rem;
  padding: 1.5rem;
}

button a {
  color: var(--text);
  text-decoration: none;
  transition: color 0.15s;
}

button.btn-full-outline a {
  color: var(--text);
}

.profile-image {
  background-color: var(--line-clickable);
  display: inline-block;
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 100%;
}

.profile-name {
  font-size: 1.25rem;
  margin-left: 0.5rem;
}

.menu-item {

}
</style>
