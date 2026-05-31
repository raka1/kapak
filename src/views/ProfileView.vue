<script setup lang="ts">
import NavigationBottom from '@/components/NavigationBottom.vue'
import NProgress from 'nprogress'
import login from '@/stores/login'
import cart from '@/stores/cart'
import NavigationHead from '@/components/NavigationHead.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import { BIconBoxArrowInLeft, BIconGear, BIconHeart, BIconList } from 'bootstrap-icons-vue'

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
  <div class="sm-show">
    <div v-if="login().username">
      <div class="position-absolute top-0 mt-4 mb-4 d-flex align-items-center">
        <span class="profile-image"></span>
        <strong class="profile-name">{{ login().username }}</strong>
      </div>
      <div class="list-group mt-3">
        <RouterLink class="list-group-item" to="/orders">
          <BIconList class="pe-2" /> My Orders
        </RouterLink>
        <RouterLink class="list-group-item" to="/wishlist">
          <BIconHeart class="pe-2" /> Wishlist
        </RouterLink>
        <RouterLink class="list-group-item" to="/settings">
          <BIconGear class="pe-2" /> Settings
        </RouterLink>
        <div class="list-group-item" @click.prevent="logout">
          <BIconBoxArrowInLeft class="pe-2" /> Logout
        </div>
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
  </div>
  <div class="sm-hide">
    <NavigationHead />
    <NotFoundView />
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

.list-group-item {
  background-color: var(--main-bg);
  color: var(--text);
  border: none;
  padding: 1rem;
  transition:
    background-color 0.15s,
    color 0.15s;
}
</style>
