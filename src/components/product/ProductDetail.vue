<script setup lang="ts">
import { ref, onMounted, onBeforeMount, watch } from 'vue'
import { useRoute } from 'vue-router'
import login from '@/stores/login'
import cart from '@/stores/cart'
import notyf, { error as noter } from '@/utils/notyf'
import '@/assets/quantity.css'

const route = useRoute()

interface Product {
  _id: string
  name: string
  slug: string
  variants: Array<{
    name: string
    price: number
    stock: number
  }>
  description: string
  images: Array<string>
  category: string
  seller: {
    _id: string
    first_name: string
    last_name: string
    email: string
    username: string
  }
}

const product = ref<Product | null>(null)
const idx = ref(0)
const imageRef = ref<HTMLDivElement | null>(null)
const enlargedImageRef = ref<HTMLDivElement | null>(null)
const imageListRef = ref<HTMLDivElement[]>([])
const enlargedImageListRef = ref<HTMLDivElement[]>([])
const quantityFocused = ref(false)
const quantityString = ref('1')
const variant = ref(0)

type emitType = {
  (event: 'getShop', s: string, n: string): void
}

const emit = defineEmits<emitType>()

async function getProduct() {
  try {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    const seller = route.params.seller
    const slug = route.params.slug
    const response = await fetch(`/item/product/${seller}/${slug}`)
    product.value = await response.json()
    document.title = `${product.value?.name} | Kapak`
    emit(
      'getShop',
      product.value
        ? `${product.value.seller.first_name} ${product.value.seller.last_name ?? ''}`
        : '',
      product.value?.seller.username ?? '',
    )
    selectImage(imageRef.value, imageListRef.value, 0, product.value?.images[0] ?? '')
  } catch (error) {
    console.error(error)
  }
}

function resizeImage() {
  if (imageRef.value) {
    const width = imageRef.value.getBoundingClientRect().width

    imageRef.value.style.height = width + 'px'
  }
}

function selectImage(
  ref: HTMLElement | null,
  list: Array<HTMLElement>,
  index: number,
  image: string,
) {
  if (ref) {
    if (ref.style.backgroundColor) ref.style.backgroundColor = ''
    ref.style.backgroundImage = `url(data:image/jpg;base64,${image})`
  }
  const selectedElement = list.find((el) => el.classList.contains('selected'))
  selectedElement?.classList.remove('selected')
  list[index]?.classList.add('selected')
  if (list !== enlargedImageListRef.value) idx.value = index
}

function enlargeImage(e: MouseEvent) {
  const html = e.target as HTMLElement
  const image = html.style.backgroundImage

  if (enlargedImageRef.value && enlargedImageListRef.value) {
    enlargedImageRef.value.style.backgroundImage = image

    const width = enlargedImageRef.value.getBoundingClientRect().width
    enlargedImageRef.value.style.height = width + 'px'

    const selectedElement = enlargedImageListRef.value.find((el) =>
      el.classList.contains('selected'),
    )
    selectedElement?.classList.remove('selected')
    enlargedImageListRef.value[idx.value].classList.add('selected')
  }
}

function quantityInput(e: Event) {
  const input = e.target as HTMLInputElement
  let num = input.value.replace(/\D/g, '')
  num = num.replace(/^0+/, '') || '1'
  if (product.value && Number(num) > product.value.variants[variant.value].stock)
    num = product.value.variants[variant.value].stock.toString()

  quantityString.value = num
}

function increaseQuantity() {
  if (!product.value?.variants?.[0]) return

  const stock = product.value.variants[variant.value].stock
  const currentQty = Number(quantityString.value) || 1

  quantityString.value = Math.min(currentQty + 1, stock).toString()
}

function decreaseQuantity() {
  if (Number(quantityString.value) <= 1) return
  quantityString.value = (Number(quantityString.value) - 1).toString()
}

async function addToCart() {
  try {
    const response = await fetch(`/cart/${login().username}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product: product.value?._id,
        variant: variant.value,
        quantity: Number(quantityString.value),
        seller: product.value?.seller._id,
      }),
    })
    const res = await response.json()

    if (res.response === 'ITEM_ADDED_TO_CART') {
      try {
        const response = await fetch(`/cart/${login().username}`)
        const res = await response.json()

        cart().reset(res.body)

        notyf.open({ message: 'Item added to cart successfully!' })
      } catch (error) {
        noter(error)
      }
    } else if (res.response === 'QUANTITY_EXCEEDS_STOCK') {
      const quantity = res.body.quantity
      const additional =
        quantity === 1
          ? `You already have the item in your cart.`
          : `You already have ${quantity} of these items in your cart.`

      notyf.open({
        message: `<b>Quantity exceeds stock!</b><br /> Only ${product.value?.variants[variant.value].stock} items available. ${additional}`,
        duration: 3000,
      })
    } else if (res.response === 'ITEM_NOT_FOUND') {
      notyf.open({
        message: '<b>Item not found!</b><br /> Please try again later.',
        duration: 3000,
      })
    } else {
      notyf.open({
        message: "<b>Something's wrong!</b><br /> Please try again later.",
        duration: 3000,
      })
    }
  } catch (error) {
    noter(error)
  }
}

watch(
  () => variant.value,
  () => {
    if (product.value && Number(quantityString.value) > product.value.variants[variant.value].stock)
      quantityString.value = product.value.variants[variant.value].stock.toString()
  },
)

watch(
  () => route.path,
  () => {
    variant.value = 0
    product.value = null
    getProduct()
  },
)

onMounted(() => {
  window.addEventListener('resize', resizeImage)
  resizeImage()
  getProduct()
})

onBeforeMount(() => {
  window.removeEventListener('resize', resizeImage)
})
</script>

<template>
  <transition name="fade" mode="out-in">
    <nav v-if="product" style="--bs-breadcrumb-divider: '>'" aria-label="breadcrumb" class="mt-2">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <RouterLink class="breadcrumb-item" to="/">Home</RouterLink>
        </li>
        <li class="breadcrumb-item">
          <RouterLink class="breadcrumb-item" to="#">{{ product?.category }}</RouterLink>
        </li>
        <li class="breadcrumb-item">
          <RouterLink class="breadcrumb-item" :to="route.path">{{ product?.name }}</RouterLink>
        </li>
      </ol>
    </nav>
    <div v-else class="placeholder-glow mt-2 mb-3">
      <span class="placeholder" style="width: 15rem"></span>
    </div>
  </transition>
  <div class="row">
    <div id="image" class="col-3">
      <div
        class="rounded-2 pointer"
        ref="imageRef"
        id="show"
        data-bs-toggle="modal"
        data-bs-target="#imageModal"
        @click="enlargeImage($event)"
        style="background-color: var(--line-clickable)"
      ></div>
      <div class="list list-horizontal">
        <div
          v-for="(image, index) in product?.images"
          class="rounded-2"
          :class="index == 0 ? 'selected' : ''"
          :key="index"
          :style="{ 'background-image': `url(data:image/jpg;base64,${image})` }"
          ref="imageListRef"
          @click="selectImage(imageRef, imageListRef, index, image)"
        ></div>
      </div>
    </div>
    <div class="col-6">
      <transition name="fade" mode="out-in">
        <h3 v-if="product">
          {{ product?.name }}
          {{
            product && product.variants.length > 1 ? ' - ' + product?.variants[variant].name : ''
          }}
        </h3>
        <h3 v-else class="placeholder-glow"><span class="placeholder col-6"></span></h3>
      </transition>
      <transition name="fade" mode="out-in">
        <h3 v-if="product" class="mb-3">
          {{
            product?.variants[variant].price !== undefined
              ? 'Rp' +
                Intl.NumberFormat('id-ID', { style: 'decimal' }).format(
                  product.variants[variant].price,
                )
              : ''
          }}
        </h3>
        <h3 v-else class="placeholder-glow"><span class="placeholder col-3"></span></h3>
      </transition>
      <transition name="fade" mode="out-in">
        <div v-if="product && product.variants.length > 1">
          <div class="mb-1">
            <strong>Choose variant:</strong>
          </div>
          <div id="variant-list" class="mb-3">
            <button
              v-for="(v, index) in product?.variants"
              :key="index"
              class="btn btn-full-outline me-1 mb-1 uplift"
              :class="{
                active: index == variant,
              }"
              @click="variant = index"
            >
              {{ v.name }}
            </button>
          </div>
        </div>
        <div v-else></div>
      </transition>
      <transition name="fade" mode="out-in">
        <p v-if="product">{{ product?.description }}</p>
        <p v-else class="placeholder-glow">
          <span class="placeholder col-12"></span>
          <span class="placeholder col-12"></span>
          <span class="placeholder col-12"></span>
          <span class="placeholder col-12"></span>
          <span class="placeholder col-6"></span>
        </p>
      </transition>
    </div>
    <transition name="fade">
      <div v-if="product" class="col-3 position-relative">
        <div class="sticky uplift rounded-2">
          <h5 class="mb-3">Quantity</h5>
          <div class="row">
            <div class="col-7">
              <div class="quantity input-group">
                <button class="btn" :class="{ focus: quantityFocused }" @click="decreaseQuantity">
                  <i class="pi pi-minus ps-2 pe-2"></i>
                </button>
                <input
                  class="text-center"
                  :class="{ focus: quantityFocused }"
                  type="text"
                  v-model="quantityString"
                  @input="quantityInput"
                  @focus="quantityFocused = true"
                  @blur="quantityFocused = false"
                />
                <button class="btn" :class="{ focus: quantityFocused }" @click="increaseQuantity">
                  <i class="pi pi-plus ps-2 pe-2"></i>
                </button>
              </div>
            </div>
            <div class="col-5" style="margin-top: 2px">
              Stock:
              {{
                product?.variants[variant].stock !== undefined
                  ? Intl.NumberFormat('id-ID', { style: 'decimal' }).format(
                      product.variants[variant].stock,
                    )
                  : ''
              }}
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-3" style="margin-top: 1px">Subtotal</div>
            <h5 class="col-9 text-end">
              {{
                product?.variants[variant].price !== undefined
                  ? 'Rp' +
                    Intl.NumberFormat('id-ID', { style: 'decimal' }).format(
                      Number(quantityString) * product.variants[variant].price,
                    )
                  : ''
              }}
            </h5>
          </div>
          <div class="text-center">
            <button
              class="btn btn-sm btn-full-outline d-inline-block"
              ref="buyNowRef"
              @click="addToCart"
            >
              <i class="pi pi-plus button"></i> Add to Cart
            </button>
            <div class="separator d-inline-block"></div>
            <button class="btn btn-sm btn-full d-inline-block" ref="buyNowRef">Buy Now</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
  <div
    class="modal modal-lg"
    id="imageModal"
    tabindex="-1"
    aria-labelledby="imageModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body">
          <div class="row">
            <div class="col-11">
              <h3 class="mb-4">{{ product?.name }}</h3>
            </div>
            <div class="col-1 d-flex justify-content-end">
              <span data-bs-dismiss="modal" style="cursor: pointer"
                ><i class="pi pi-times"></i
              ></span>
            </div>
          </div>
          <div class="row">
            <div class="col-9 d-flex justify-content-center">
              <div ref="enlargedImageRef" class="rounded-2"></div>
            </div>
            <div class="col-3 justify-content-center list list-vertical">
              <div
                v-for="(image, index) in product?.images"
                class="rounded-2"
                :class="index == idx ? 'selected' : ''"
                :key="index"
                :style="{ 'background-image': `url(data:image/jpg;base64,${image})` }"
                ref="enlargedImageListRef"
                @click="selectImage(enlargedImageRef, enlargedImageListRef, index, image)"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.breadcrumb .breadcrumb-item {
  color: var(--main-prim);
  text-decoration: none;
}

.breadcrumb .breadcrumb-item:hover {
  text-decoration: underline;
}

.breadcrumb-item + .breadcrumb-item::before {
  color: var(--main-text);
}

i.button {
  vertical-align: middle;
  margin-top: -4px;
}

i.cart {
  vertical-align: middle;
}

#variant-list button {
  background-color: var(--main-bg);
}

#variant-list button:hover {
  background-color: var(--main-prim);
}

#variant-list button.active {
  color: var(--bs-white);
  background-color: var(--main-prim);
}

.separator {
  height: 2rem;
  border-left: 1px solid var(--line);
  margin: 0 1rem;
  transform: translateY(0.75rem);
  transition: border-left 0.15s ease-in-out;
}

#image,
#imageModal div.row > div:nth-of-type(1) {
  position: relative;
}

#image #show,
#imageModal div.row > div:nth-of-type(1) > div {
  background-repeat: no-repeat;
  background-size: contain;
  width: 100%;
  max-height: 25rem;
  max-width: 25rem;
  margin-bottom: 0.75rem;
}

#image #show.pointer {
  cursor: pointer;
}

.sticky {
  position: sticky;
  top: 5rem;
  border: 1px solid var(--line);
  padding: 1rem;
  background-color: var(--main-bg);
  transition: border 0.15s ease-in-out;
}

.list {
  display: grid;
  gap: 0.75rem;
}

.list.list-horizontal {
  grid-auto-flow: column;
  grid-auto-columns: 4rem;
  overflow-x: auto;
}

.list.list-vertical {
  grid-auto-flow: row;
  grid-auto-rows: 4rem;
  overflow-y: auto;
}

.list div {
  cursor: pointer;
  background-size: 4rem 4rem;
  width: 4rem;
  height: 4rem;
}

.list div.selected {
  border: 1px solid var(--main-prim);
}
</style>
