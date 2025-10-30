<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NProgress from 'nprogress'
import notyf, { error as noter } from '@/utils/notyf'

const router = useRouter()

// ref to give focus
const fo1Ref = ref<HTMLInputElement | null>(null)
const fo2Ref = ref<HTMLInputElement | null>(null)
const fo3Ref = ref<HTMLInputElement | null>(null)
const fo4Ref = ref<HTMLInputElement | null>(null)

// password
const spanPass1Ref = ref<HTMLSpanElement | null>(null)
const spanPass2Ref = ref<HTMLSpanElement | null>(null)
const passwordStrength = ref<number>(0)

const focus = ref<Array<boolean>>([])
const pageSignUp = ref<number>(0)
const emailM = ref<string>('')
const name1 = ref<string>('')
const name2 = ref<string>('')
const phone = ref<string>('')
const pass1 = ref<string>('')
const pass2 = ref<string>('')
const agreement = ref<boolean>(false)
const sendRef = ref<HTMLButtonElement | null>(null)

type propsType = {
  email: string
}

type emitType = {
  (event: 'getEmail', email: string): void
  (event: 'previousElementBorder', e: HTMLElement, s: string): void
  (event: 'OAuth2', loc: string): void
}

const props = defineProps<propsType>()
const emit = defineEmits<emitType>()

async function handleNext() {
  // pageSignUp.value = 2
  if (!emailM.value) {
    notyf.open({ message: 'You need to enter your email.' })
    return
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailM.value)) {
    emit('previousElementBorder', fo1Ref.value as HTMLElement, '#ff3f34')
    notyf.open({
      message: "<b>That doesn't look like a valid email.</b><br /> Try again?",
      duration: 3000,
    })
    return
  }

  if (sendRef.value) sendRef.value.classList.add('disabled')

  NProgress.start()

  try {
    const preresponse = await fetch('/email/check_email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: emailM.value,
      }),
    })
    const pre = await preresponse.json()

    if (pre.response == 'EMAIL_ALREADY_EXISTS') {
      emit('getEmail', emailM.value)
      notyf.open({
        message: '<b>Your email is already registered.</b><br /> Please login to continue.',
        duration: 3000,
      })
      router.replace('/login')
      return
    } else if (pre.response == 'SERVER_ERROR') throw new Error(`Response: ${pre.response}`)

    const response = await fetch('/email/send_verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: emailM.value,
      }),
    })
    const res = await response.json()

    if (res.response == 'SUCCESS') pageSignUp.value = 1
    else throw new Error(`Response: ${res.response}`)
  } catch (error) {
    noter(error)
  }

  if (sendRef.value) sendRef.value.classList.remove('disabled')
  NProgress.done()
}

async function resendCode() {
  NProgress.start()

  try {
    const response = await fetch('/email/send_verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: emailM.value,
      }),
    })
    const res = await response.json()

    if (res.response == 'SUCCESS')
      notyf.open({ message: "We've resent the verification code to your email." })
    else if (res.response == 'TOO_MANY_REQUESTS')
      notyf.open({
        message: `<b>Hold on!</b><br /> Please wait another ${res.time} ${res.time > 1 ? 'seconds' : 'second'} before resending the code.`,
        duration: 3000,
      })
    else throw new Error(`Response: ${res.response}`)
  } catch (error) {
    noter(error)
  }

  NProgress.done()
}

async function verifCode(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.value.length >= 6) {
    NProgress.start()
    target.setAttribute('disabled', '')

    try {
      const response = await fetch('/email/check_code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailM.value,
          code: target.value,
        }),
      })
      const res = await response.json()

      if (res.response == 'SUCCESS') pageSignUp.value = 2
      else if (res.response == 'INVALID_VERIFICATION_CODE') {
        emit('previousElementBorder', fo1Ref.value as HTMLElement, '#ff3f34')
        notyf.open({ message: 'It looks like the code is incorrect.' })
      } else throw new Error(`Response: ${res.response}`)
    } catch (error) {
      noter(error)
    }

    target.removeAttribute('disabled')
    target.value = ''
    NProgress.done()
  }
}

function removeAllPassClass(e: HTMLInputElement) {
  e.classList.remove('pass1')
  e.classList.remove('pass2')
  e.classList.remove('pass3')
  e.classList.remove('pass4')
  e.classList.remove('pass5')
  e.classList.remove('pass6')
}

function password() {
  const password = pass1.value

  if (passwordStrength.value) passwordStrength.value = 0

  if (password.length >= 8) passwordStrength.value++
  if (/[a-z]/.test(password)) passwordStrength.value++
  if (/[A-Z]/.test(password)) passwordStrength.value++
  if (/\d/.test(password)) passwordStrength.value++
  if (/[@$!%*?&#]/.test(password)) passwordStrength.value++

  // clean underline class first
  if (fo3Ref.value) {
    removeAllPassClass(fo3Ref.value)
    fo3Ref.value.style.borderColor = ''
  }

  switch (passwordStrength.value) {
    case 5:
      if (fo3Ref.value) fo3Ref.value.classList.add('pass6')
      if (spanPass1Ref.value) spanPass1Ref.value.style.borderColor = '#0be881'
      break
    case 4:
      if (fo3Ref.value) fo3Ref.value.classList.add('pass5')
      if (spanPass1Ref.value) spanPass1Ref.value.style.borderColor = '#ffa801'
      break
    case 3:
      if (fo3Ref.value) fo3Ref.value.classList.add('pass4')
      if (spanPass1Ref.value) spanPass1Ref.value.style.borderColor = '#ffd32a'
      break
    case 2:
      if (spanPass1Ref.value) spanPass1Ref.value.style.borderColor = '#ffdd59'
      if (fo3Ref.value) fo3Ref.value.classList.add('pass3')
      break
    case 1:
      if (spanPass1Ref.value) spanPass1Ref.value.style.borderColor = '#ff5e57'
      if (fo3Ref.value) fo3Ref.value.classList.add('pass2')
      break
    default:
      if (spanPass1Ref.value) spanPass1Ref.value.style.borderColor = '#ff3f34'
      if (fo3Ref.value) fo3Ref.value.classList.add('pass1')
      break
  }

  if (!password.length && spanPass1Ref.value) {
    spanPass1Ref.value.style.borderColor = 'var(--main-prim)'
    if (fo3Ref.value) removeAllPassClass(fo3Ref.value)
  }
}

function passwordCheck() {
  if (spanPass1Ref.value) spanPass1Ref.value.style.borderColor = 'var(--line-clickable)'
  if (fo3Ref.value) fo3Ref.value.style.borderColor = ''

  notyf.dismissAll()

  if (!pass1.value.length) return

  if (passwordStrength.value >= 0 && passwordStrength.value <= 2)
    notyf.open({
      message:
        '<b>Your password seems a bit weak.</b><br /> Try adding more characters, numbers, or special symbols to make it safer.',
      duration: 0,
      dismissible: true,
    })

  if (passwordStrength.value >= 3 && passwordStrength.value <= 4)
    notyf.open({
      message:
        '<b>Your password could be stronger.</b><br /> Try adding more characters, numbers, or special symbols to make it safer.',
      duration: 0,
      dismissible: true,
    })
}

function passwordVerify() {
  if (fo4Ref.value) {
    removeAllPassClass(fo4Ref.value)
    fo4Ref.value.style.borderColor = ''
  }

  if (pass1.value !== pass2.value) {
    if (spanPass2Ref.value) spanPass2Ref.value.style.borderColor = '#ff3f34'
    if (fo4Ref.value) fo4Ref.value.classList.add('pass1')
  } else if (pass1.value === pass2.value && passwordStrength.value < 5) {
    if (spanPass2Ref.value) spanPass2Ref.value.style.borderColor = '#ffdd59'
    if (fo4Ref.value) fo4Ref.value.classList.add('pass3')
  } else {
    if (spanPass2Ref.value) spanPass2Ref.value.style.borderColor = '#0be881'
    if (fo4Ref.value) fo4Ref.value.classList.add('pass6')
  }
}

function passwordVerifyCheck() {
  if (spanPass2Ref.value) spanPass2Ref.value.style.borderColor = 'var(--line-clickable)'
  if (fo4Ref.value) fo4Ref.value.style.borderColor = ''

  notyf.dismissAll()

  if (!pass2.value.length) return

  if (pass1.value !== pass2.value)
    notyf.open({
      message: "<b>Your passwords don't match.</b><br /> Please double-check and try again!",
      duration: 0,
      dismissible: true,
    })

  if (pass1.value === pass2.value && passwordStrength.value < 5)
    notyf.open({
      message:
        '<b>Your passwords match, but they could be stronger.</b><br /> Consider making them more secure!',
      duration: 0,
      dismissible: true,
    })
}

async function finish() {
  if (!name1.value) {
    emit('previousElementBorder', fo1Ref.value as HTMLElement, '#ff3f34')
    notyf.open({ message: 'You need to enter your first name.' })
    return
  }

  if (passwordStrength.value >= 0 && passwordStrength.value <= 2) {
    emit('previousElementBorder', fo3Ref.value as HTMLElement, '#ff3f34')
    notyf.open({
      message:
        '<b>Your password seems a bit weak.</b><br /> Try adding more characters, numbers, or special symbols to make it safer.',
      duration: 4000,
    })
    return
  }

  if (passwordStrength.value >= 3 && passwordStrength.value <= 4) {
    emit('previousElementBorder', fo3Ref.value as HTMLElement, '#ff3f34')
    notyf.open({
      message:
        '<b>Your password could be stronger.</b><br /> Try adding more characters, numbers, or special symbols to make it safer.',
      duration: 4000,
    })
    return
  }

  if (pass1.value !== pass2.value) {
    emit('previousElementBorder', fo3Ref.value as HTMLElement, '#ff3f34')
    emit('previousElementBorder', fo4Ref.value as HTMLElement, '#ff3f34')
    notyf.open({
      message: "<b>Your passwords don't match.</b><br /> Please double-check and try again!",
      duration: 3000,
    })
    return
  }

  if (!agreement.value) {
    notyf.open({
      message:
        "<b>Don't forget to check the box!</b><br /> By agreeing to our terms, you ensure a safe and secure experience.",
      duration: 4000,
    })
    return
  }

  NProgress.start()

  try {
    const response = await fetch('/auth/create_user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: name1.value,
        last_name: name2.value,
        email: emailM.value,
        phone_number: phone.value,
        password: pass1.value,
      }),
    })
    const res = await response.json()

    if (res.response == 'SUCCESS') {
      emit('getEmail', emailM.value)
      notyf.open({
        message:
          "<b>Congratulations! Your registration was successful.</b><br /> You're all set up and ready to go.",
        duration: 4000,
      })
      router.replace('/login')
    } else throw new Error(`Response: ${res.response}`)
  } catch (error) {
    noter(error)
  }

  NProgress.done()
}

onMounted(() => {
  if (props.email) emailM.value = props.email
})
</script>

<template>
  <transition name="shift" mode="out-in">
    <div v-if="pageSignUp === 0" class="sign-up">
      <h3 class="mb-3">Sign Up</h3>
      <form @submit.prevent="handleNext">
        <div class="input-group mb-3">
          <span
            class="input-group-text"
            @click="fo1Ref?.focus()"
            :style="
              focus[0]
                ? 'border-bottom: 1px solid var(--main-prim)'
                : 'border-bottom: 1px solid var(--line-clickable)'
            "
            ><i class="pi pi-envelope"></i
          ></span>
          <input
            type="text"
            class="form-control"
            placeholder="Email address"
            ref="fo1Ref"
            v-model="emailM"
            @focus="(focus[0] = true), ((fo1Ref as HTMLInputElement).style.borderColor = '')"
            @blur="(focus[0] = false), ((fo1Ref as HTMLInputElement).style.borderColor = '')"
          />
        </div>
        <div class="row mb-4">
          <div class="col text-end">
            <button ref="sendRef" type="submit" class="btn btn-full">Next</button>
          </div>
        </div>
      </form>
      <div class="separator mb-4"></div>
      <div class="mb-2">Or sign up with:</div>
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
      <div class="text-center" style="margin-top: 5.3rem">
        Already have an account?
        <RouterLink
          replace
          to="/login"
          class="btn link"
          @click="emit('getEmail', emailM)"
          style="transform: translateY(-0.15rem)"
          >Login</RouterLink
        >
      </div>
    </div>
    <div v-else-if="pageSignUp === 1" class="sign-up-e">
      <div class="text-center mb-2" style="font-size: 5rem">
        <i class="pi pi-envelope"></i>
      </div>
      <h4 class="mb-3">Well Done!</h4>
      <div class="mb-3">
        A verification code has been sent to <b>{{ emailM }}</b
        >. Please check your inbox and enter the code below to proceed.
      </div>
      <div class="input-group mb-3">
        <span
          class="input-group-text"
          @click="fo1Ref?.focus()"
          :style="
            focus[0]
              ? 'border-bottom: 1px solid var(--main-prim)'
              : 'border-bottom: 1px solid var(--line-clickable)'
          "
          ><i class="pi pi-key"></i
        ></span>
        <input
          type="text"
          class="form-control"
          placeholder="Verification code"
          ref="fo1Ref"
          @input="verifCode"
          @focus="(focus[0] = true), ((fo1Ref as HTMLInputElement).style.borderColor = '')"
          @blur="(focus[0] = false), ((fo1Ref as HTMLInputElement).style.borderColor = '')"
        />
      </div>
      <div class="text-end">
        <button class="btn link" @click="resendCode()">Resend code</button>
      </div>
    </div>
    <div v-else-if="pageSignUp === 2" class="sign-up-f">
      <h4>Almost There!</h4>
      <div class="mb-3">Let's complete your profile.</div>
      <form @submit.prevent="finish">
        <div class="input-group mb-3">
          <span
            class="input-group-text"
            @click="fo1Ref?.focus()"
            :style="
              focus[0]
                ? 'border-bottom: 1px solid var(--main-prim)'
                : 'border-bottom: 1px solid var(--line-clickable)'
            "
            ><i class="pi pi-id-card"></i
          ></span>
          <input
            type="text"
            class="form-control"
            placeholder="First name"
            ref="fo1Ref"
            v-model="name1"
            @focus="(focus[0] = true), ((fo1Ref as HTMLInputElement).style.borderColor = '')"
            @blur="(focus[0] = false), ((fo1Ref as HTMLInputElement).style.borderColor = '')"
          />
          <input type="text" class="form-control" placeholder="Last name" v-model="name2" />
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
            ><i class="pi pi-phone"></i
          ></span>
          <input
            type="text"
            class="form-control"
            placeholder="Phone number"
            ref="fo2Ref"
            v-model="phone"
            @focus="(focus[1] = true), ((fo2Ref as HTMLInputElement).style.borderColor = '')"
            @blur="(focus[1] = false), ((fo2Ref as HTMLInputElement).style.borderColor = '')"
          />
        </div>
        <div class="input-group mb-3">
          <span class="input-group-text" ref="spanPass1Ref" @click="fo3Ref?.focus()">
            <i class="pi pi-key"></i>
          </span>
          <input
            type="password"
            class="form-control"
            placeholder="Password"
            ref="fo3Ref"
            v-model="pass1"
            @input="password"
            @focus="password"
            @blur="passwordCheck"
          />
        </div>
        <div class="input-group mb-3">
          <span class="input-group-text" ref="spanPass2Ref" @click="fo4Ref?.focus()">
            <i class="pi pi-key"> </i>
          </span>
          <input
            type="password"
            class="form-control"
            placeholder="Verify password"
            ref="fo4Ref"
            v-model="pass2"
            @input="passwordVerify"
            @focus="passwordVerify"
            @blur="passwordVerifyCheck"
          />
        </div>
        <div class="form-check mb-3">
          <input
            class="form-check-input"
            type="checkbox"
            value=""
            id="agreement"
            v-model="agreement"
          />
          <label class="form-check-label" for="agreement">
            I'm okay with the
            <RouterLink to="#" class="btn link" style="transform: translateY(-0.15rem)">
              terms of use
            </RouterLink>
            and
            <RouterLink to="#" class="btn link" style="transform: translateY(-0.15rem)">
              privacy policy </RouterLink
            >.
          </label>
        </div>
        <div class="row mb-4">
          <div class="col text-end">
            <button ref="sendRef" type="submit" class="btn btn-full">Let's go!</button>
          </div>
        </div>
      </form>
    </div>
  </transition>
</template>

<style scoped>
.sign-up {
  padding: 0 3rem;
  padding-top: 6rem;
}

.sign-up-e {
  padding: 0 3rem;
  padding-top: 3rem;
}

.sign-up-f {
  padding: 0 3rem;
  padding-top: 3rem;
}

.input-group > .input-group-text {
  border-radius: 0;
  border: 0;
  border-bottom: 1px solid var(--line-clickable);
  color: var(--main-text);
  background-color: transparent;
  transition: border-bottom 0.15s ease-in-out;
}

.input-group > .form-control.pass1:focus {
  border-color: #ff3f34 !important;
}

.input-group > .form-control.pass2:focus {
  border-color: #ff5e57 !important;
}

.input-group > .form-control.pass3:focus {
  border-color: #ffdd59 !important;
}

.input-group > .form-control.pass4:focus {
  border-color: #ffd32a !important;
}

.input-group > .form-control.pass5:focus {
  border-color: #ffa801 !important;
}

.input-group > .form-control.pass6:focus {
  border-color: #0be881 !important;
}

.separator {
  border-bottom: 1px solid var(--line);
}

.form-check-input {
  border-color: var(--line-clickable);
}

.form-check-input:focus {
  outline: none !important;
  box-shadow: none !important;
}
</style>
