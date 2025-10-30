<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

interface Product {
  name: string
  slug: string
  price: number
  description: string
  images: string
  seller: string
}

const products = ref<Product[]>([])
const woodsRef = ref<HTMLElement | null>(null)
const defaultLimit = ref(30)
const skipStep = ref(0)
const hasMore = ref(true)
const isLoadingMore = ref(false)
const isMounted = ref(false)

type propsType = {
  shopname?: string | null
}

const props = defineProps<propsType>()

function buildQuery(params: Record<string, unknown>) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value))
    }
  })
  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

async function getProducts() {
  try {
    const params: Record<string, unknown> = {
      skip: skipStep.value * defaultLimit.value,
      limit: defaultLimit.value,
    }

    // Search query and filter
    if (route.name == 'Search' && route.query.q) {
      params.q = route.query.q

      if (route.query.np) params.np = route.query.np
      if (route.query.xp) params.xp = route.query.xp
    }

    // List by shop
    if (props.shopname) params.shop = props.shopname

    const response = await fetch(`/item/products${buildQuery(params)}`)
    products.value = await response.json()

    if (products.value.length < defaultLimit.value) hasMore.value = false
    else skipStep.value++
  } catch (error) {
    console.error(error)
  }
}

async function loadMore() {
  try {
    isLoadingMore.value = true
    const params: Record<string, unknown> = {
      skip: skipStep.value * defaultLimit.value,
      limit: defaultLimit.value,
    }
    if (route.name == 'Search' && route.query.q) params.q = route.query.q
    if (props.shopname) params.shop = props.shopname

    const response = await fetch(`/item/products${buildQuery(params)}`)
    const newProducts = await response.json()
    products.value.push(...newProducts)

    if (newProducts.length < defaultLimit.value) hasMore.value = false
    else skipStep.value++
  } catch (error) {
    console.error(error)
  } finally {
    isLoadingMore.value = false
  }
}

watch([() => route.query, () => props.shopname], () => {
  getProducts()
})

function woodsController() {
  const woods = woodsRef.value
  if (!woods) return

  // When scrolling, the img is getting zoomer
  const scrollY = window.scrollY || window.pageYOffset
  woods.style.transform = `scale(${1 + scrollY / 1000}) translateY(-${1 * scrollY}px)`
  woods.style.opacity = `${Math.max(0, 0.6 + scrollY / 850)}`
}

watch(
  [() => products.value.length, () => isMounted.value],
  () => {
    if (!products.value.length && isMounted.value)
      document.addEventListener('scroll', woodsController)
    else document.removeEventListener('scroll', woodsController)
  },
  { immediate: true },
)

onMounted(() => {
  getProducts()
  isMounted.value = true
})
</script>

<template>
  <transition name="fade" mode="out-in">
    <div
      v-if="products.length && isMounted"
      class="row"
      :class="route.name == 'Search' ? 'row-cols-5' : 'row-cols-6'"
    >
      <div v-for="(product, index) in products" :key="index">
        <RouterLink
          :to="`/${product.seller}/${product.slug}`"
          class="card mb-4 uplift"
          :title="product.name"
        >
          <img :src="'data:image/png;base64, ' + product.images" class="card-img-top" />
          <div class="card-body">
            <div class="text-ellipsis">{{ product.name }}</div>
            <div style="font-weight: bold">
              Rp{{ Intl.NumberFormat('id-ID', { style: 'decimal' }).format(product.price) }}
            </div>
          </div>
        </RouterLink>
      </div>
      <template v-if="isLoadingMore">
        <div v-for="n in route.name == 'Search' ? 5 : 6" :key="'loading-' + n">
          <div class="card mb-4 uplift">
            <div class="card-img-top waiting-img-top"></div>
            <div class="card-body">
              <div class="placeholder-glow"><span class="placeholder col-12"></span></div>
              <div class="placeholder-glow">
                <span class="placeholder col-6"></span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div v-else-if="!products.length && isMounted">
      <div>Oh no, it seems we're lost in the Kapak Woods.</div>
      <div>Try searching with other keywords!</div>
      <img src="/images/woods.png" alt="Woods" id="woods" ref="woodsRef" />
    </div>
    <div v-else class="row" :class="route.name == 'Search' ? 'row-cols-5' : 'row-cols-6'">
      <div v-for="n in route.name == 'Search' ? 5 : 6" :key="n">
        <div class="card mb-4 uplift">
          <div class="card-img-top waiting-img-top"></div>
          <div class="card-body">
            <div class="placeholder-glow"><span class="placeholder col-12"></span></div>
            <div class="placeholder-glow">
              <span class="placeholder col-6"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
  <transition>
    <button
      name="fade"
      v-if="products.length && hasMore"
      :disabled="isLoadingMore"
      class="btn-load-more mx-auto my-4 rounded-pill"
      @click="loadMore"
    >
      <span>Load More</span>
      <i class="pi pi-angle-down"></i>
    </button>
  </transition>
</template>

<style scoped>
.waiting-img-top {
  background-color: var(--line-clickable);
  aspect-ratio: 1/1;
  width: 100%;
  display: block;
}

.card {
  cursor: pointer;
  background-color: var(--main-bg);
  border-color: var(--line);
  text-decoration: none;
  transition: all 0.15s ease-in-out;
}

.card-body {
  color: var(--main-text);
}

.text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-load-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: var(--main-prim);
  color: #fff;
  font-weight: 600;
  font-size: 1.08rem;
  border: none;
  padding: 0.7rem 2.2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
  cursor: pointer;
  transition:
    background 0.15s,
    box-shadow 0.15s,
    transform 0.13s;
  outline: none;
}
.btn-load-more:hover,
.btn-load-more:focus {
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.13);
  transform: translateY(-2px) scale(1.03);
}

.btn-load-more i {
  transform: translateY(0.1rem);
}

#woods {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index: -1;
  opacity: 0.6;
}
</style>
