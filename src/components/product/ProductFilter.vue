<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { BIconChevronDown, BIconFilter, BIconX } from 'bootstrap-icons-vue'

const route = useRoute()
const router = useRouter()

interface Category {
  _id: number
  name: string
  slug: string
}

type emitType = {
  (event: 'toggleFilter', value: boolean): void
}

const selectedCategories = ref<string[]>([])
const categories = ref<Category[]>([])
const isShowMoreCategories = ref(false)
const minPrice = ref('')
const maxPrice = ref('')
const minPriceBefore = ref('')
const maxPriceBefore = ref('')
const minPriceFocused = ref(false)
const maxPriceFocused = ref(false)

const emit = defineEmits<emitType>()

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

function hideFilter() {
  emit('toggleFilter', false)
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

  if (selectedCategories.value.length) query.ct = selectedCategories.value.join(',')
  else delete query.ct

  if (minPrice.value) query.np = minPrice.value.replace(/\./g, '')
  else delete query.np

  if (maxPrice.value) query.xp = maxPrice.value.replace(/\./g, '')
  else delete query.xp

  router.replace({ query })
}

async function getCategories() {
  try {
    const response = await fetch('/api/v1/item/categories')
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
  <div id="back-drop" @click="hideFilter" class="sm-show"></div>

  <div class="mb-3 d-flex align-items-center sm-hide">
    <strong><BIconFilter />&nbsp;Filter</strong>
  </div>
  <div id="filter" class="rounded-4 p-3 uplift">
    <div id="filter-close" class="sm-show">
      <BIconX @click="hideFilter" />
    </div>
    <br class="sm-show" />
    <div class="mb-3">
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
          @blur="(updateUrlParams(), (minPriceFocused = false))"
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
          @blur="(updateUrlParams(), (maxPriceFocused = false))"
          @keydown="handleKeyDownPrice($event, maxPrice, 'max')"
        />
      </div>
    </div>
    <div class="mb-2"><strong>Based on Category</strong></div>
    <template v-for="category in categories" :key="category._id">
      <div class="form-check" v-if="isShowMoreCategories || categories.indexOf(category) < 4">
        <input
          class="form-check-input"
          type="checkbox"
          :id="`category-${category._id}`"
          :value="category.slug"
          v-model="selectedCategories"
          @change="updateUrlParams()"
        />
        <label class="form-check-label mb-2" :for="`category-${category._id}`">
          {{ category.name }}
        </label>
      </div>
    </template>
    <div
      class="d-flex align-items-center justify-content-center"
      v-if="!isShowMoreCategories"
      style="cursor: pointer"
      @click="isShowMoreCategories = true"
    >
      <strong>Show More</strong>&nbsp;<BIconChevronDown />
    </div>
  </div>
</template>

<style scoped>
#back-drop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.18);
  z-index: 1040;
}

#filter {
  background-color: var(--main-bg);
  border: 1px solid var(--line);
  transition:
    background-color 0.15s ease-in-out,
    color 0.15s ease-in-out;
}

@media only screen and (max-width: 768px) {
  #filter {
    border-radius: 0;
    width: 100vw;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 1050;
  }

  #filter-close {
    position: absolute;
    top: 0.5rem;
    right: 0.75rem;
    font-size: 1.25rem;
    color: var(--text);
  }
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
