<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

interface Category {
  _id: number
  name: string
}

const selectedCategory = ref('')
const categories = ref<Category[]>([])
const minPrice = ref('')
const maxPrice = ref('')
const minPriceBefore = ref('')
const maxPriceBefore = ref('')
const minPriceFocused = ref(false)
const maxPriceFocused = ref(false)

function handleInput(which: 'min' | 'max') {
  let value
  let beforeValue

  if (which === 'min') {
    value = minPrice.value.replace(/\./g, '')
    beforeValue = minPriceBefore.value
  } else {
    value = maxPrice.value.replace(/\./g, '')
    beforeValue = maxPriceBefore.value
  }

  if (value === '') return

  if (isNaN(Number(value))) {
    if (which === 'min') minPrice.value = new Intl.NumberFormat('id-ID').format(Number(beforeValue))
    else maxPrice.value = new Intl.NumberFormat('id-ID').format(Number(beforeValue))
    return
  }

  if (which === 'min') minPrice.value = new Intl.NumberFormat('id-ID').format(Number(value))
  else maxPrice.value = new Intl.NumberFormat('id-ID').format(Number(value))
}

function handleKeyDownPrice(event: KeyboardEvent, value: string, which: 'min' | 'max') {
  const key = event.key

  if (!isNaN(Number(value.replace(/\./g, '')))) {
    if (which === 'min') minPriceBefore.value = value.replace(/\./g, '')
    else maxPriceBefore.value = value.replace(/\./g, '')
  }

  if (key === 'Enter') {
    updateUrlParams()
    return
  }
}

function updateUrlParams() {
  const query = { ...route.query }

  if (selectedCategory.value) query.ct = selectedCategory.value
  else delete query.ct

  if (minPrice.value) query.np = minPrice.value.replace(/\./g, '')
  else delete query.np

  if (maxPrice.value) query.xp = maxPrice.value.replace(/\./g, '')
  else delete query.xp

  router.replace({ query })
}

async function getCategories() {
  try {
    const response = await fetch('/item/categories')
    categories.value = await response.json()
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  getCategories()
  if (route.query.np) minPrice.value = String(route.query.np)
  if (route.query.xp) maxPrice.value = String(route.query.xp)
})
</script>

<template>
  <strong>Filter</strong>
  <div id="filter" class="rounded-4 mt-3 p-3 uplift">
    <div class="mb-2">
      <strong>Category</strong>
      <select v-model="selectedCategory" class="form-select mt-1" @change="updateUrlParams()">
        <option value="">All Categories</option>
        <option v-for="category in categories" :key="category._id" :value="category._id">
          {{ category.name }}
        </option>
      </select>
    </div>
    <div class="mb-2"><strong>Price</strong></div>
    <div>
      <label for="min-price">Min Price</label>
      <div class="input-group mb-2">
        <label
          for="min-price"
          class="input-group-text currency"
          :class="{ focused: minPriceFocused }"
        >
          Rp
        </label>
        <input
          v-model="minPrice"
          type="text"
          class="form-control"
          id="min-price"
          @input="handleInput('min')"
          @focus="minPriceFocused = true"
          @blur="updateUrlParams(), (minPriceFocused = false)"
          @keydown="handleKeyDownPrice($event, minPrice, 'min')"
        />
      </div>
      <label for="max-price">Max Price</label>
      <div class="input-group mb-2">
        <label
          for="max-price"
          class="input-group-text currency"
          :class="{ focused: maxPriceFocused }"
          >Rp</label
        >
        <input
          v-model="maxPrice"
          type="text"
          class="form-control"
          id="max-price"
          @input="handleInput('max')"
          @focus="maxPriceFocused = true"
          @blur="updateUrlParams(), (maxPriceFocused = false)"
          @keydown="handleKeyDownPrice($event, maxPrice, 'max')"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
#filter {
  background-color: var(--main-bg);
  transition:
    background-color 0.15s ease-in-out,
    color 0.15s ease-in-out;
}

.form-select {
  appearance: auto;
  padding: 0.375rem 0.75rem;
  background-color: var(--main-bg);
  border-color: var(--line-clickable);
  color: var(--main-text);
  background-image: none;
  transition:
    background-color 0.15s ease-in-out,
    border 0.15s ease-in-out,
    color 0.15s ease-in-out;
}

.currency {
  background-color: transparent;
  border: 0;
  border-radius: 0;
  border-bottom: 1px solid var(--line-clickable);
  color: var(--main-text);
  transition:
    border-bottom 0.15s ease-in-out,
    color 0.15s ease-in-out;
}

.currency.focused {
  border-bottom: 1px solid var(--main-prim);
}
</style>
