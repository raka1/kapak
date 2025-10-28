<script setup lang="ts">
import { ref, onMounted, type ComponentPublicInstance, watch, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { change as changeTheme } from '@/utils/theme'
import FontFaceObserver from 'fontfaceobserver'
import NProgress from 'nprogress'
import login from '@/stores/login'
import cart from '@/stores/cart'

interface AutocompleteItem {
  keyword: string
  count: number
}

const router = useRouter()
const autocompleteRef = ref<HTMLUListElement | null>(null)
const searchRef = ref<HTMLInputElement | null>(null)
const navRef = ref<HTMLElement | null>(null)
const themeIconRef = ref<HTMLAnchorElement | null>(null)
const brandRef = ref<ComponentPublicInstance | null>(null)
const isFocused = ref(false)
const autocompleteItems = ref<AutocompleteItem[]>([])
const autocompleteSelect = ref(-1)
const autocompleteSelecting = ref(false)
const searchText = ref('')
const searchTextBehind = ref('')

type emitType = {
  (event: 'getFocus', focus: boolean): void
  (event: 'getHeight', focus: number): void
}

const emit = defineEmits<emitType>()

const autoCompletes = computed<AutocompleteItem[]>(() => {
  const searchValue = searchTextBehind.value?.toLowerCase() || ''
  const items = autocompleteItems.value.slice().sort((a, b) => b.count - a.count)

  return items.filter((item) => item.keyword.startsWith(searchValue)).slice(0, 10)
})

function onSearch() {
  if (!searchText.value) return

  searchRef.value?.blur()
  handleFocus(false)
  router.push('/search?q=' + searchText.value)
}

function handleFocus(focus: boolean) {
  isFocused.value = focus
  emit('getFocus', focus)

  if (!focus) autocompleteSelect.value = -1
}

async function getCart() {
  try {
    const response = await fetch(`/api/cart/${login().username}`)
    const res = await response.json()

    cart().reset(res.body)
  } catch (error) {
    console.error(error)
  }
}

async function getAutocompleteItems() {
  try {
    const response = await fetch('/api/item/autocompletes')
    autocompleteItems.value = await response.json()
  } catch (error) {
    console.error(error)
  }
}

function clickAutocomplete(item: AutocompleteItem) {
  searchText.value = item.keyword
  onSearch()
}

function handleKeyDown(event: KeyboardEvent) {
  const key = (event as KeyboardEvent).key

  if (key === 'ArrowUp' || key === 'ArrowDown') {
    event.preventDefault()

    autocompleteSelecting.value = true

    if (key === 'ArrowUp') {
      autocompleteSelect.value =
        autocompleteSelect.value === -1
          ? autoCompletes.value.length - 1
          : (autocompleteSelect.value - 1 + autoCompletes.value.length) % autoCompletes.value.length
    } else {
      autocompleteSelect.value = (autocompleteSelect.value + 1) % autoCompletes.value.length
    }

    searchText.value = autoCompletes.value[autocompleteSelect.value].keyword

    return
  }
}

function handleKeyUp(event: KeyboardEvent) {
  const key = (event as KeyboardEvent).key

  if (key !== 'ArrowUp' && key !== 'ArrowDown') {
    autocompleteSelecting.value = false
    autocompleteSelect.value = -1
    searchTextBehind.value = searchText.value
  }
}

function applyTheme() {
  const themeIcon = themeIconRef.value
  const brand = brandRef.value?.$el

  if (themeIcon && brand) {
    const i1 = themeIcon.querySelectorAll('i')[0]
    const i2 = themeIcon.querySelectorAll('i')[1]

    if (localStorage.getItem('theme') == 'dark') {
      i1.classList.add('hidden')
      i2.classList.remove('hidden')
      brand.style.backgroundImage = `url('/src/assets/logo-secondary.png')`
    } else {
      i1.classList.remove('hidden')
      i2.classList.add('hidden')
      brand.style.backgroundImage = `url('/src/assets/logo-primary.png')`
    }
  }
}

function toggleTheme() {
  changeTheme().then(applyTheme)
}

async function logout() {
  NProgress.start()

  try {
    const response = await fetch('/api/auth/logout', {
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

watch(
  () => login().username,
  () => {
    if (login().username) getCart()
  },
)

onMounted(() => {
  const nav = navRef.value
  const themeIcon = themeIconRef.value
  const fontLoaded = new FontFaceObserver('PrimeIcons')

  emit('getHeight', nav?.offsetHeight as number)

  fontLoaded.load().then(() => {
    if (themeIcon) {
      const i1 = themeIcon.querySelectorAll('i')[0]
      const i2 = themeIcon.querySelectorAll('i')[1]
      const width = Math.max(i1.offsetWidth, i2.offsetWidth)

      themeIcon.style.width = width + 'px'

      applyTheme()
    }
  })

  // Set autocomplete position and size
  const autocomplete = autocompleteRef.value
  const search = searchRef.value

  if (autocomplete && search) {
    const rect = search.getBoundingClientRect()
    autocomplete.style.top = rect.bottom + 12 + 'px'
    autocomplete.style.left = rect.left + 'px'
    autocomplete.style.width = rect.width + 'px'

    getAutocompleteItems()
  }
})
</script>

<template>
  <nav ref="navRef" class="navbar fixed-top navbar-expand bg-body-primary">
    <div class="container-fluid container-little">
      <RouterLink class="navbar-brand" to="/" ref="brandRef" id="brand"></RouterLink>
      <div class="input-group" id="search">
        <input
          ref="searchRef"
          type="text"
          class="form-control"
          @focus="handleFocus(true)"
          @blur="handleFocus(false)"
          @keydown.enter="onSearch"
          @keydown.escape="searchRef?.blur()"
          @keydown="handleKeyDown($event)"
          @keyup="handleKeyUp($event)"
          placeholder="Search Kapak..."
          v-model="searchText"
        />
        <button class="btn" @click="onSearch">
          <i class="pi pi-search ps-2 pe-2"></i>
        </button>
      </div>
      <div class="d-flex ps-4">
        <RouterLink to="/cart" class="btn me-3 icons">
          <i class="pi pi-shopping-cart"></i>
          <span
            v-if="cart().total_all_quantity > 0"
            class="position-absolute top-20 start-100 translate-middle badge rounded-pill bg-danger"
          >
            {{ cart().total_all_quantity }}
          </span>
        </RouterLink>
        <RouterLink to="/chat" class="btn me-3 icons">
          <i class="pi pi-envelope"></i>
        </RouterLink>
        <div ref="themeIconRef" class="btn icons" @click.prevent="toggleTheme">
          <i class="pi pi-sun hidden"></i>
          <i class="pi pi-moon hidden"></i>
        </div>
        <div class="separator ms-4 me-4"></div>
        <div v-if="login().isLoginChecked">
          <div v-if="!login().username" style="margin-top: 0.1rem">
            <RouterLink to="/login" class="btn btn-sm me-2 pb-1">Login</RouterLink>
            <RouterLink to="/sign_up" class="btn btn-sm pb-1">Sign Up</RouterLink>
          </div>
          <div v-else>
            <div class="dropdown" id="profile">
              <div data-bs-toggle="dropdown"></div>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <RouterLink class="dropdown-item" to="/profile">
                    <i class="pi pi-user-edit"></i> <strong>{{ login().username }}</strong>
                  </RouterLink>
                </li>
                <li>
                  <RouterLink class="dropdown-item" to="/orders">
                    <i class="pi pi-list"></i> My Orders
                  </RouterLink>
                </li>
                <li>
                  <RouterLink class="dropdown-item" to="/wishlist">
                    <i class="pi pi-heart"></i> Wishlist
                  </RouterLink>
                </li>
                <li>
                  <RouterLink class="dropdown-item" to="/settings">
                    <i class="pi pi-cog"></i> Settings
                  </RouterLink>
                </li>
                <li><hr class="dropdown-divider" /></li>
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="logout">
                    <i class="pi pi-sign-out"></i> Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <ul ref="autocompleteRef" class="list-group" v-show="isFocused && autoCompletes.length">
    <li
      v-for="(item, index) in autoCompletes"
      :key="item.keyword"
      class="list-group-item border-0"
      :class="{
        select: index === autocompleteSelect,
        arrow: autocompleteSelecting,
      }"
      @mousedown="clickAutocomplete(item)"
      @mouseover="(autocompleteSelect = index), (autocompleteSelecting = false)"
    >
      {{ item.keyword }}
    </li>
  </ul>
</template>

<style scoped>
.container-little {
  margin-left: 1rem !important;
  margin-right: 1rem !important;
}

.navbar {
  background-color: var(--main-bg);
  border-bottom-width: 1px !important;
  border-bottom-style: solid !important;
  border-bottom-color: var(--line) !important;
  transition:
    background-color 0.15s ease-in-out,
    border-bottom-color 0.15s ease-in-out,
    color 0.15s ease-in-out;
}

#brand {
  background-image: url('@/assets/logo-primary.png');
  height: 2rem;
  width: 7rem;
  background-size: contain;
  background-repeat: no-repeat;
}

#search {
  width: calc(100% - 25rem) !important;
}

#search .btn::after {
  border-bottom: 1px solid var(--line-clickable);
  transition: border-bottom 0.15s ease-in-out;
}

#search .btn:hover::after {
  border-bottom: 1px solid var(--line-clickable);
}

#search input:focus ~ .btn::after {
  border-bottom: 1px solid var(--main-prim);
}

.dropdown-menu {
  background-color: var(--main-bg);
}

.dropdown-menu .dropdown-item {
  color: var(--main-text);
}

ul.list-group {
  position: fixed;
  z-index: 3;
  background-color: var(--main-bg);
  color: var(--main-text);
  border: 1px solid var(--line);
}

.list-group .list-group-item {
  cursor: pointer;
  background-color: var(--main-bg);
  color: var(--main-text);
  border-left: 4px solid transparent !important;
}

.list-group .list-group-item.select {
  background-color: var(--line);
}

.list-group .list-group-item.select.arrow {
  border-left: 4px solid var(--main-prim) !important;
}

.badge {
  font-size: 0.7rem;
  padding: 0.15rem 0.3rem;
}

.top-20 {
  top: 20%;
}

.icons {
  display: grid;
  place-items: center;
}

.icons > i {
  padding: 0.5rem 0;
  grid-area: 1 / 1;
  opacity: 1;
  transition: all 0.15s ease-in-out;
}

.icons > i.hidden {
  opacity: 0;
}

.separator {
  border-left: 1px solid var(--line);
  transition: border-left 0.15s ease-in-out;
}

/* login/logout */
#profile > div {
  background-color: var(--line-clickable);
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 100%;
  cursor: pointer;
  margin-top: 4px;
}

#profile .dropdown-item:active {
  background-color: var(--main-prim);
}
</style>
