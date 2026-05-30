<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import NavigationHead from '@/components/NavigationHead.vue'
import FooterPart from '@/components/FooterPart.vue'
import login from '@/stores/login'

const focus = ref(false)
const route = useRoute()
const router = useRouter()

function setFocus(e: boolean) {
  focus.value = e
}

const excludeRoutesForNavBar = ['Login', 'SignUp', 'Profile']
const includeRoutesForMobileSpacer = ['Home', 'Product']

onMounted(async () => {
  try {
    const response = await fetch('/api/v1/auth/auto_login')
    const res = await response.json()

    if (res.response == 'SUCCESS') {
      login().setUsername(res.body)
      if (route.name === 'Login' || route.name === 'SignUp') router.replace('/')
    } else login().setUsername('')
  } catch (error) {
    console.log(error)
  }
})
</script>

<template>
  <header>
    <NavigationHead
      @getFocus="setFocus"
      v-if="!excludeRoutesForNavBar.includes(route?.name as string)"
    />
  </header>
  <div class="view" :class="focus ? 'blur' : ''">
    <div class="container"><RouterView /></div>
  </div>
  <FooterPart v-if="!excludeRoutesForNavBar.includes(route?.name as string)" />
  <div
    class="spacer-for-mobile-view"
    v-if="includeRoutesForMobileSpacer.includes(route?.name as string)"
  ></div>
</template>

<style scoped>
.view {
  position: relative;
  min-height: 100vh;
  padding-top: 54px;
}

.view::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  pointer-events: none;
  z-index: 2;
  transition: all 0.15s ease-in-out;
}

.view.blur::after {
  pointer-events: initial;
  background-color: rgba(0, 0, 0, 0.18);
}

@media only screen and (max-width: 768px) {
  .spacer-for-mobile-view {
    height: 46px;
  }
}
</style>
