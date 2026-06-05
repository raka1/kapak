<script setup lang="ts">
import { ref, onMounted, type ComponentPublicInstance, watch, computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { change as changeTheme } from '@/utils/theme'
import {
  BIconArrowLeft,
  BIconBoxArrowLeft,
  BIconCart,
  BIconEnvelope,
  BIconGear,
  BIconHeart,
  BIconList,
  BIconMoon,
  BIconPeople,
  BIconSearch,
  BIconSun,
  BIconX,
} from 'bootstrap-icons-vue'
import 'bootstrap/js/dist/dropdown'
import 'bootstrap/js/dist/modal'
import NProgress from 'nprogress'
import login from '@/stores/login'
import cart from '@/stores/cart'

interface AutocompleteItem {
  keyword: string
  count: number
}

const route = useRoute()
const router = useRouter()
const autocompleteRef = ref<HTMLUListElement | null>(null)
const searchRef = ref<HTMLInputElement | null>(null)
const brandRef = ref<ComponentPublicInstance | null>(null)
const isDark = ref<boolean>(false)
const isFocused = ref(false)
const autocompleteItems = ref<AutocompleteItem[]>([])
const autocompleteSelect = ref(-1)
const autocompleteSelecting = ref(false)
const searchText = ref('')
const searchTextBehind = ref('')

let resizeTimeout: number | undefined

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

  if (!focus) {
    searchTextBehind.value = searchText.value
    autocompleteSelect.value = -1
  } else {
  }
}

async function getCart() {
  try {
    const response = await fetch(`/api/v1/cart/${login().username}`)
    const res = await response.json()

    cart().reset(res.body)
  } catch (error) {
    console.error(error)
  }
}

async function getAutocompleteItems() {
  try {
    const response = await fetch('/api/v1/item/autocompletes')
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
  const { key } = event

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

    searchText.value = String(autoCompletes.value[autocompleteSelect.value]?.keyword)

    return
  }

  const { ctrlKey, shiftKey, altKey, metaKey } = event

  const isControlKey = key.length > 1 && key !== 'Backspace' && key !== 'Delete'
  const isModifierActive = ctrlKey || shiftKey || altKey || metaKey

  if (isControlKey || isModifierActive) return

  autocompleteSelecting.value = false
  autocompleteSelect.value = -1
}

function applyTheme() {
  const brand = brandRef.value?.$el

  if (brand) {
    if (localStorage.getItem('theme') == 'dark') {
      isDark.value = true
      brand.style.backgroundImage = `url('/images/banner-secondary.png')`
    } else {
      isDark.value = false
      brand.style.backgroundImage = `url('/images/banner-primary.png')`
    }
  }
}

function toggleTheme() {
  changeTheme().then(applyTheme)
}

function resizeObserver() {
  if (resizeTimeout) clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(() => {
    // Set autocomplete position and size
    const autocomplete = autocompleteRef.value
    const search = searchRef.value

    if (autocomplete && search) {
      const rect = search.getBoundingClientRect()
      autocomplete.style.top = rect.bottom + 12 + 'px'
      autocomplete.style.left = rect.left + 'px'
      autocomplete.style.width = rect.width + 'px'
    }
  }, 200)
}

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

watch(
  () => login().username,
  () => {
    if (login().username) getCart()
  },
)

watch(
  () => route.query,
  () => {
    if (route.query.q && searchRef.value) {
      searchRef.value.value = String(route.query.q)
    }
  },
)

onMounted(() => {
  applyTheme()
  getAutocompleteItems()
  window.addEventListener('resize', resizeObserver)
  resizeObserver()
})
</script>

<template>
  <nav ref="navRef" class="navbar fixed-top bg-body-primary">
    <div class="container-fluid container-little">
      <RouterLink class="navbar-brand" to="/" ref="brandRef" id="brand"></RouterLink>
      <button
        class="btn"
        id="back"
        @click="$router.back()"
        :class="{ hidden: route.name == 'Home' }"
      >
        <BIconArrowLeft />
      </button>
      <div
        class="input-group"
        id="search"
        :class="{ home: route.name == 'Home', login: login().username }"
      >
        <input
          ref="searchRef"
          type="text"
          class="form-control"
          @focus="handleFocus(true)"
          @blur="handleFocus(false)"
          @keydown.enter="onSearch"
          @keydown.escape="searchRef?.blur()"
          @keydown="handleKeyDown($event)"
          @input="
            ((searchText = ($event.target as HTMLInputElement).value),
            (searchTextBehind = ($event.target as HTMLInputElement).value))
          "
          placeholder="Search Kapak..."
        />
        <button class="btn" @click="onSearch" style="width: 2rem">
          <BIconSearch />
        </button>
      </div>
      <div class="d-flex ps-4">
        <RouterLink to="/cart" class="btn icons me-3">
          <BIconCart />
          <span
            v-if="cart().total_all_quantity > 0"
            class="position-absolute top-20 start-100 translate-middle badge rounded-pill bg-danger"
          >
            {{ cart().total_all_quantity }}
          </span>
        </RouterLink>
        <RouterLink to="/chat" class="btn icons me-3">
          <BIconEnvelope />
        </RouterLink>
        <div class="btn icons" @click.prevent="toggleTheme">
          <BIconMoon v-if="isDark" />
          <BIconSun v-else />
        </div>
        <div class="separator ms-4 me-4 sm-hide"></div>
        <div v-if="login().isLoginChecked" class="sm-hide">
          <div v-if="!login().username" class="">
            <RouterLink
              to="/login"
              class="btn btn-sm me-2"
              style="height: 2.2rem; align-content: center"
              >Login</RouterLink
            >
            <RouterLink
              to="/sign-up"
              class="btn btn-sm"
              style="height: 2.2rem; align-content: center"
              >Sign Up</RouterLink
            >
          </div>
          <div v-else>
            <div class="dropdown" id="profile">
              <div data-bs-toggle="dropdown"></div>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <div class="dropdown-item">
                    <BIconPeople /> <strong>{{ login().username }}</strong>
                  </div>
                </li>
                <li>
                  <RouterLink class="dropdown-item" to="/orders">
                    <BIconList /> My Orders
                  </RouterLink>
                </li>
                <li>
                  <RouterLink class="dropdown-item" to="/wishlist">
                    <BIconHeart /> Wishlist
                  </RouterLink>
                </li>
                <li>
                  <RouterLink class="dropdown-item" to="/settings">
                    <BIconGear /> Settings
                  </RouterLink>
                </li>
                <li>
                  <hr class="dropdown-divider" />
                </li>
                <li>
                  <a
                    class="dropdown-item"
                    href="#"
                    data-bs-toggle="modal"
                    data-bs-target="#logoutModal"
                  >
                    <BIconBoxArrowLeft /> Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <div
    class="modal"
    id="logoutModal"
    tabindex="-1"
    aria-labelledby="logoutModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body">
          <div class="row">
            <div class="col-11">
              <h3 class="mb-4">Logout</h3>
            </div>
            <div class="col-1 d-flex justify-content-end">
              <span data-bs-dismiss="modal" style="cursor: pointer"><BIconX /></span>
            </div>
          </div>
          <p>Are you sure you want to logout?</p>
          <div class="text-end">
            <button class="btn btn-full-outline me-2" data-bs-dismiss="modal">Cancel</button>
            <button class="btn btn-full" @click.prevent="logout" data-bs-dismiss="modal">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

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
      @mouseover="((autocompleteSelect = index), (autocompleteSelecting = false))"
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
  height: 2rem;
  width: 7rem;
  background-size: contain;
  background-repeat: no-repeat;
}

@media only screen and (max-width: 768px) {
  #brand {
    display: none;
  }
}

#back {
  margin-right: 0.5rem;
  height: 2.2rem;
  display: none;
}

#search {
  width: calc(100% - 24rem) !important;
}

#search.login {
  width: calc(100% - 20rem) !important;
}

.icons {
  display: flex;
  align-items: center;
  width: 1.1rem;
  height: 2.2rem;
}

.hidden {
  display: none !important;
}

@media only screen and (max-width: 768px) {
  #search {
    width: calc(100% - 9rem) !important;
  }

  #search.home {
    width: calc(100% - 7rem) !important;
  }

  #back {
    display: initial;
  }
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

.dropdown-menu .dropdown-item:hover,
.dropdown-menu .dropdown-item:focus {
  background-color: var(--line) !important;
}

.dropdown-item .dropdown-item:active {
  background-color: transparent !important;
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
