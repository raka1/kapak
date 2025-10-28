<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter, type RouteRecordNameGeneric } from 'vue-router'
import LoginPart from '@/components/login/LoginPart.vue'
import SignUpPart from '@/components/login/SignUpPart.vue'
import login from '@/stores/login'
import notyf from '@/utils/notyf'

const page = ref<RouteRecordNameGeneric | null>(null)
const backgrRef = ref<HTMLDivElement | null>(null)
const backgrLoaded = ref(false)
const route = useRoute()
const router = useRouter()
const email = ref('')

watch(
  () => route.name,
  (name) => {
    page.value = name
  },
  { immediate: true },
)

function setEmail(s: string) {
  email.value = s
}

function previousElementBorder(e: HTMLElement, s: string = '#000') {
  if (e) {
    e.style.setProperty('border-color', s, 'important')
    if (e.previousElementSibling)
      (e.previousElementSibling as HTMLElement).style.setProperty('border-color', s, 'important')
  }
}

async function OAuth2(s: string) {
  const width = 600
  const height = 600
  const left = (window.innerWidth - width) / 2
  const top = (window.innerHeight - height) / 2
  const windowF = `width=${width},height=${height},top=${top},left=${left},resizable=yes`

  if (s == 'facebook') {
    window.open('/api/oauth2/facebook', 'OAuth2', windowF)
  } else if (s == 'google') {
    window.open('/api/oauth2/google', 'OAuth2', windowF)
  }
}

function handler(e: MessageEvent) {
  if (e.origin == import.meta.env.VITE_API_URL && e.data.response == 'SUCCESS') {
    login().setUsername(e.data.body)
    router.go(-1)
  }

  if (e.origin == import.meta.env.VITE_API_URL && e.data.response == 'CONFLICT') {
    const methods = e.data.body

    notyf.dismissAll()
    notyf.open({
      message:
        '<b>Email already registered</b><br /> The email is already registered with a different authentication method.',
      duration: 3000,
    })
    notyf.open({
      message: '<b>Available authentication:</b><br />' + methods.join(', '),
      duration: 0,
      dismissible: true,
    })
  }

  if (e.origin == import.meta.env.VITE_API_URL && e.data.response == 'SERVER_ERROR')
    notyf.open({
      message: "<b>Something's wrong!</b><br /> Please try again later.",
      duration: 3000,
    })
}

onMounted(() => {
  window.addEventListener('message', handler)

  // backgr image onload
  const img = new Image()
  const src = 'https://picsum.photos/1100/600'

  img.src = src

  img.onload = () => {
    if (backgrRef.value) {
      backgrRef.value.style.backgroundImage = `url(${src})`
      backgrRef.value.classList.add('loaded')
      backgrLoaded.value = true
    }
  }

  // prevent enter login when already login
  if (login().username) router.replace('/')
})

onUnmounted(() => {
  window.removeEventListener('message', handler)
})
</script>

<template>
  <div id="box" class="rounded-4 uplift">
    <div ref="backgrRef" id="backgr" :class="[page, backgrLoaded ? 'loaded' : '']"></div>
    <div id="white-box" :class="page"></div>
    <transition name="fade" mode="out-in">
      <div v-if="page === 'Login'" class="login">
        <LoginPart
          :email="email"
          @getEmail="setEmail"
          @previousElementBorder="previousElementBorder"
          @OAuth2="OAuth2"
        />
      </div>
      <div v-else></div>
    </transition>
    <transition name="fade" mode="out-in">
      <div v-if="page === 'SignUp'" style="overflow: hidden">
        <SignUpPart
          :email="email"
          @getEmail="setEmail"
          @previousElementBorder="previousElementBorder"
          @OAuth2="OAuth2"
        />
      </div>
      <div v-else></div>
    </transition>
  </div>
</template>

<style scoped>
.shift-enter-active,
.shift-leave-active {
  transition:
    transform 0.15s ease-in-out,
    opacity 0.15s ease-in-out;
}

.shift-enter-from,
.shift-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.shift-enter-to,
.shift-leave-from {
  transform: translateX(0);
  opacity: 1;
}

#box {
  overflow: hidden;
  border: 1px solid var(--line);
  position: absolute;
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 30rem;
  width: 50rem;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

#backgr {
  position: absolute;
  left: 0;
  height: 30rem;
  width: 55rem;
  z-index: -1;
  transition:
    opacity 0.15s ease-in-out,
    transform 0.15s ease-in-out;
}

#backgr::after {
  position: absolute;
  content: '';
  background-color: var(--line-clickable);
  top: 0;
  left: 0;
  height: 30rem;
  width: 55rem;
  z-index: -1;
  opacity: 1;
  transition: opacity 0.15s ease-in-out;
}

#backgr.loaded::after {
  opacity: 0;
}

#backgr.Login {
  transform: translateX(0);
}

#backgr.SignUp {
  transform: translateX(-5rem);
}

#white-box {
  position: absolute;
  background-color: var(--main-bg);
  width: 50%;
  height: 100%;
  z-index: -1;
  transition: transform 0.15s ease-in-out;
}

#white-box.Login {
  transform: translateX(0);
}

#white-box.SignUp {
  transform: translateX(100%);
}

.login {
  padding: 0 3rem;
  padding-top: 5rem;
}

.input-group > .input-group-text {
  border-radius: 0;
  border: 0;
  border-bottom: 1px solid var(--line-clickable);
  color: var(--main-text);
  background-color: transparent;
  transition: border-bottom 0.15s ease-in-out;
}
</style>
