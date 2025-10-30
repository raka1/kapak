<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router'
import { ref, onMounted, watch } from 'vue'
import NavigationHead from '@/components/NavigationHead.vue'
import FooterPart from '@/components/FooterPart.vue'
import login from '@/stores/login'

const viewRef = ref<HTMLDivElement | null>(null)
const nav = ref<InstanceType<typeof NavigationHead> | null>(null)
const focus = ref(false)
const navHeight = ref(0)
const route = useRoute()
const router = useRouter()

function setFocus(e: boolean) {
  focus.value = e
}

function setHeight(e: number) {
  navHeight.value = e
}

watch(
  () => route.name,
  (name) => {
    if (viewRef.value && name !== 'Login' && name !== 'SignUp')
      viewRef.value.style.paddingTop = `${navHeight.value}px`
    else if (viewRef.value) viewRef.value.style.paddingTop = '0'
  },
)

onMounted(async () => {
  try {
    const response = await fetch('/api/auth/auto_login')
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
      @getHeight="setHeight"
      ref="nav"
      v-if="route?.name !== 'Login' && route?.name !== 'SignUp'"
    />
  </header>
  <div ref="viewRef" class="view" :class="focus ? 'blur' : ''">
    <div class="container"><RouterView /></div>
  </div>
  <FooterPart />
</template>

<style scoped>
.view {
  position: relative;
  min-height: 100vh;
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
</style>
