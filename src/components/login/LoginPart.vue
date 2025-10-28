<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import NProgress from 'nProgress'
import login from '@/stores/login'
import cart from '@/stores/cart'
import notyf, { error as noter } from '@/utils/notyf'

const router = useRouter()

// ref to give focus
const fo1Ref = ref<HTMLInputElement | null>(null)
const fo2Ref = ref<HTMLInputElement | null>(null)

const loginRef = ref<HTMLButtonElement | null>(null)
const focus = ref<Array<boolean>>([])
const usernameM = ref<string>('')
const passwordM = ref<string>('')

type propsType = {
  email: string
}

type emitType = {
  (event: 'getEmail', s: string): void
  (event: 'previousElementBorder', e: HTMLElement, s: string): void
  (event: 'OAuth2', s: string): void
}

const props = defineProps<propsType>()
const emit = defineEmits<emitType>()

async function handleLogin() {
  if (loginRef.value) loginRef.value.classList.add('disabled')

  if (!usernameM.value) {
    if (loginRef.value) loginRef.value.classList.remove('disabled')
    emit('previousElementBorder', fo1Ref.value as HTMLElement, '#ff3f34')
    notyf.open({ message: 'You need to enter your username or email.' })
    return
  }

  if (!passwordM.value) {
    if (loginRef.value) loginRef.value.classList.remove('disabled')
    emit('previousElementBorder', fo2Ref.value as HTMLElement, '#ff3f34')
    notyf.open({
      message: "<b>I'm sure the password must be somewhere.</b><br /> Let's check again!",
      duration: 3000,
    })
    return
  }

  NProgress.start()

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: usernameM.value,
        password: passwordM.value,
      }),
    })
    const res = await response.json()

    switch (res.response) {
      case 'SUCCESS':
        login().setUsername(res.body)

        try {
          const response = await fetch(`/api/cart/${login().username}`)
          const res = await response.json()

          cart().reset(res.body)
        } catch (error) {
          console.error(error)
        }

        if (login().afterLogin) router.replace(login().afterLogin)
        else router.go(-1)
        break
      case 'INVALID_PASSWORD':
        emit('previousElementBorder', fo2Ref.value as HTMLElement, '#ff3f34')
        notyf.open({
          message: '<b>The password you entered is incorrect.</b><br /> Please try again.',
          duration: 3000,
        })
        break
      case 'USER_NOT_FOUND':
        emit('previousElementBorder', fo1Ref.value as HTMLElement, '#ff3f34')
        notyf.open({
          message:
            "<b>We couldn't find an account with that username or email.</b><br /> Please check and try again.",
          duration: 3000,
        })
        break
      case 'CONFLICT':
        const methods = res.body

        notyf.dismissAll()

        emit('previousElementBorder', fo1Ref.value as HTMLElement, '#ff3f34')
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
        break
      case 'USER_INACTIVE':
        emit('previousElementBorder', fo1Ref.value as HTMLElement, '#ff3f34')
        notyf.open({
          message:
            '<b>Your account is inactive.</b><br /> Please contact the administrator for further assistance.',
          duration: 3000,
        })
        break
      case 'USER_BANNED':
        emit('previousElementBorder', fo1Ref.value as HTMLElement, '#ff3f34')
        notyf.open({
          message:
            '<b>Your account has been banned.</b><br /> Please contact the administrator for further assistance.',
          duration: 3000,
        })
        break
      default:
        throw new Error(`Response: ${res.response}`)
    }
  } catch (error) {
    noter(error)
  }

  if (loginRef.value) loginRef.value.classList.remove('disabled')
  NProgress.done()
}

onMounted(() => {
  if (props.email) usernameM.value = props.email
})
</script>

<template>
  <h3 class="mb-3">Login</h3>
  <form @submit.prevent="handleLogin">
    <div class="input-group mb-3">
      <span
        class="input-group-text"
        @click="fo1Ref?.focus()"
        :style="
          focus[0]
            ? 'border-bottom: 1px solid var(--main-prim)'
            : 'border-bottom: 1px solid var(--line-clickable)'
        "
        ><i class="pi pi-user"></i
      ></span>
      <input
        type="text"
        class="form-control"
        placeholder="Username / Email"
        ref="fo1Ref"
        v-model="usernameM"
        @focus="(focus[0] = true), ((fo1Ref as HTMLInputElement).style.borderColor = '')"
        @blur="(focus[0] = false), ((fo1Ref as HTMLInputElement).style.borderColor = '')"
      />
    </div>
    <div class="input-group mb-3">
      <span
        class="input-group-text"
        @click="fo2Ref?.focus()"
        :style="
          focus[1]
            ? 'border-bottom: 1px solid var(--main-prim)'
            : 'border-bottom: 1px solid var(--line-clickable)'
        "
        ><i class="pi pi-key"></i
      ></span>
      <input
        type="password"
        class="form-control"
        placeholder="Password"
        ref="fo2Ref"
        v-model="passwordM"
        @focus="(focus[1] = true), ((fo2Ref as HTMLInputElement).style.borderColor = '')"
        @blur="(focus[1] = false), ((fo2Ref as HTMLInputElement).style.borderColor = '')"
      />
    </div>
    <div class="row mb-4">
      <div class="col"><RouterLink to="#" class="btn link">Forgot password?</RouterLink></div>
      <div class="col text-end">
        <button ref="loginRef" type="submit" class="btn btn-full">Login</button>
      </div>
    </div>
  </form>
  <div class="separator mb-4"></div>
  <div class="mb-2">Or login with:</div>
  <div>
    <button
      class="btn btn-full me-2"
      @click="emit('OAuth2', 'google')"
      style="transform: translateY(0.06rem)"
    >
      <i class="pi pi-google"></i> Google
    </button>
    <button class="btn btn-full" @click="emit('OAuth2', 'facebook')">
      <i class="pi pi-facebook" style="transform: translateY(0.06rem)"></i> Facebook
    </button>
  </div>
  <div class="text-center mt-5">
    Need an account?
    <RouterLink
      replace
      to="/sign_up"
      class="btn link"
      @click="emit('getEmail', usernameM)"
      style="transform: translateY(-0.15rem)"
    >
      Sign up
    </RouterLink>
  </div>
</template>

<style scoped>
.input-group > .input-group-text {
  border-radius: 0;
  border: 0;
  border-bottom: 1px solid var(--line-clickable);
  color: var(--main-text);
  background-color: transparent;
  transition: border-bottom 0.15s ease-in-out;
}

.separator {
  border-bottom: 1px solid var(--line);
}
</style>
