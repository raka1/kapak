<script setup lang="ts">
import Swiper from 'swiper'
import { ref, onMounted, onBeforeMount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'bootstrap/js/dist/modal'
import login from '@/stores/login'
import cart from '@/stores/cart'
import notyf, { error as noter } from '@/utils/notyf'
import '@/assets/quantity.css'
import { BIconArrowsExpand, BIconDash, BIconPlus, BIconX } from 'bootstrap-icons-vue'

const route = useRoute()
const router = useRouter()

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
const indexInEnlargedImage = ref(0)
const imageRef = ref<HTMLImageElement | null>(null)
const enlargedImageRef = ref<HTMLImageElement | null>(null)
const imageListRef = ref<HTMLDivElement[]>([])
const enlargedImageListRef = ref<HTMLDivElement[]>([])
const quantityFocused = ref(false)
const quantityString = ref('1')
const variant = ref(0)
const hidePreview = ref<boolean>(true)
const btnInPreview = ref(0)

const staticUrl = import.meta.env.VITE_STATIC_URL
const staticProductImagesUrl = `${staticUrl}/images/products/`

let enlargedSwiper: Swiper

type emitType = {
  (event: 'getShop', s: string, n: string): void
  (event: 'avaibility', b: boolean): void
}

const emit = defineEmits<emitType>()

async function getProduct() {
  try {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    const seller = route.params.seller
    const slug = route.params.slug
    const response = await fetch(`/api/v1/item/product/${seller}/${slug}`)
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
    emit('avaibility', false)
  }
}

function resizeImage() {
  if (imageRef.value) {
    const width = imageRef.value.getBoundingClientRect().width

    imageRef.value.style.height = width + 'px'
  }
}

function selectImage(
  ref: HTMLImageElement | null,
  list: Array<HTMLElement>,
  index: number,
  image: string,
) {
  if (ref) {
    if (ref.style.backgroundColor) ref.style.backgroundColor = ''
    ref.src = `${staticProductImagesUrl}${image}`
  }
  const selectedElement = list.find((el) => el.classList.contains('selected'))
  selectedElement?.classList.remove('selected')
  list[index]?.classList.add('selected')
  if (list !== enlargedImageListRef.value) indexInEnlargedImage.value = index
}

function enlargeImage(e: MouseEvent, index: number | undefined = undefined) {
  const img = e.target as HTMLImageElement
  const imgSrc = img.src

  if (enlargedImageRef.value && enlargedImageListRef.value) {
    enlargedImageRef.value.src = imgSrc

    const selectedElement = enlargedImageListRef.value.find((el) =>
      el.classList.contains('selected'),
    )
    selectedElement?.classList.remove('selected')
    enlargedImageListRef.value[indexInEnlargedImage.value]?.classList.add('selected')
  }

  // Enlarge image from mobile view/swiper
  if (index) {
    const selectedElement = enlargedImageListRef.value.find((el) =>
      el.classList.contains('selected'),
    )
    selectedElement?.classList.remove('selected')
    enlargedImageListRef.value[index]?.classList.add('selected')

    enlargedSwiper.slideTo(index)
  }
}

function quantityInput(e: Event) {
  const input = e.target as HTMLInputElement
  let num = input.value.replace(/\D/g, '')
  num = num.replace(/^0+/, '') || '1'
  if (product.value && Number(num) > Number(product.value.variants[variant.value]?.stock))
    num = product.value.variants[variant.value]?.stock?.toString() ?? '1'

  quantityString.value = num
}

function increaseQuantity() {
  if (!product.value?.variants?.[0]) return

  const stock: number = product.value.variants[variant.value]?.stock ?? 0
  const currentQty = Number(quantityString.value) || 1

  quantityString.value = Math.min(currentQty + 1, stock).toString()
}

function decreaseQuantity() {
  if (Number(quantityString.value) <= 1) return
  quantityString.value = (Number(quantityString.value) - 1).toString()
}

async function addToCart() {
  if (!login().username) {
    router.push('/login')
    return
  }

  try {
    const response = await fetch(`/api/v1/cart/${login().username}/items`, {
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
        const response = await fetch(`/api/v1/cart/${login().username}`)
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
        message: `<b>Quantity exceeds stock!</b><br /> Only ${product.value?.variants[variant.value]?.stock} items available. ${additional}`,
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

function showPreview(index: number) {
  hidePreview.value = false
  btnInPreview.value = index
}

watch(
  () => variant.value,
  () => {
    if (
      product.value &&
      Number(quantityString.value) > Number(product.value.variants[variant.value]?.stock)
    )
      quantityString.value = product.value.variants[variant.value]?.stock?.toString() ?? '1'
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

  new Swiper('#swiper-list', {
    modules: [Pagination],
    pagination: {
      el: '#swiper-pagination-list',
      type: 'fraction',
    },
  })

  enlargedSwiper = new Swiper('#swiper-enlarge', {
    modules: [Pagination],
    pagination: {
      el: '#swiper-pagination-enlarge',
      type: 'fraction',
    },
    on: {
      slideChange: function (swiper) {
        indexInEnlargedImage.value = swiper.realIndex
      },
    },
  })
})

onBeforeMount(() => {
  window.removeEventListener('resize', resizeImage)
})
</script>

<template>
  <!-- Bottom checkout preview for mobile view -->
  <nav class="navbar fixed-bottom bg-body-primary sm-show">
    <div class="row gx-2 mx-2">
      <div class="col-6" @click="showPreview(0)">
        <button class="btn btn-full-outline w-100"><BIconPlus /> Add to Cart</button>
      </div>
      <div class="col-6" @click="showPreview(1)">
        <button class="btn btn-full w-100">Buy Now</button>
      </div>
    </div>
  </nav>

  <div id="back-drop" :class="{ hidden: hidePreview }" @click="hidePreview = true"></div>

  <!-- Checkout preview modal for mobile view -->
  <div :class="{ hidden: hidePreview }" id="purchase-preview-wrapper">
    <div id="purchase-preview-close">
      <BIconX @click="hidePreview = true" />
    </div>
    <div class="row">
      <div class="col-5 position-relative">
        <img
          :src="product?.images[0] ? `${staticProductImagesUrl}${product.images[0]}` : ''"
          :alt="product ? product.name : 'Error when loading an image'"
          class="d-block w-100 h-100"
          data-bs-toggle="modal"
          data-bs-target="#imageModal"
          @click="enlargeImage($event, 0)"
        />
        <div
          class="position-absolute bottom-0 d-flex align-items-center justify-content-center"
          id="enlarge-icon"
        >
          <BIconArrowsExpand />
        </div>
      </div>
      <div class="col-7" style="margin-top: auto">
        <h5 class="text-truncate">
          {{
            product?.variants[variant]?.price !== undefined
              ? 'Rp' +
                Intl.NumberFormat('id-ID', { style: 'decimal' }).format(
                  Number(product.variants[variant]?.price),
                )
              : ''
          }}
        </h5>
        <div class="text-truncate">
          Stock:
          {{
            product?.variants[variant]?.stock !== undefined
              ? Intl.NumberFormat('id-ID', { style: 'decimal' }).format(
                  Number(product.variants[variant]?.stock),
                )
              : ''
          }}
        </div>
      </div>
    </div>
    <hr style="color: var(--line)" />
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
      <hr style="color: var(--line)" />
    </div>
    <div class="quantity input-group">
      <button class="btn" :class="{ focus: quantityFocused }" @click="decreaseQuantity">
        <BIconDash class="ps-2 pe-2" />
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
        <BIconPlus class="ps-2 pe-2" />
      </button>
    </div>
    <hr style="color: var(--line)" />
    <div class="d-grid">
      <button class="btn btn-full" v-if="btnInPreview == 0" @click="addToCart">Add to Cart</button>
      <RouterLink
        class="btn btn-full"
        v-if="btnInPreview == 1"
        :to="login().username ? '/cart/checkout' : '/login'"
        >Buy Now</RouterLink
      >
    </div>
  </div>

  <!-- Product detail and description -->
  <transition name="fade" mode="out-in">
    <nav
      v-if="product"
      style="--bs-breadcrumb-divider: '>'"
      aria-label="breadcrumb"
      class="mt-2 sm-hide"
    >
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
    <div v-else class="placeholder-glow mt-2 mb-3 sm-hide">
      <span class="placeholder" style="width: 15rem"></span>
    </div>
  </transition>
  <div class="row" id="product-container">
    <div id="image" class="col-12 col-md-3 sm-hide">
      <img
        class="rounded-2 pointer"
        ref="imageRef"
        :alt="product ? product.name : 'Product image'"
        id="show"
        data-bs-toggle="modal"
        data-bs-target="#imageModal"
        @click="enlargeImage($event)"
      />
      <div class="list list-horizontal">
        <div
          v-for="(image, index) in product?.images"
          class="rounded-2"
          :class="index == 0 ? 'selected' : ''"
          :key="index"
          :style="{ 'background-image': `url(${staticProductImagesUrl}${image})` }"
          ref="imageListRef"
          @click="selectImage(imageRef, imageListRef, index, image)"
        ></div>
      </div>
    </div>

    <!-- Image list for mobile -->
    <div class="col-12 swiper sm-show mb-4" id="swiper-list">
      <div class="swiper-wrapper">
        <div v-for="(image, index) in product?.images" :key="index" class="swiper-slide">
          <img
            :src="`${staticProductImagesUrl}${image}`"
            :alt="product ? product.name : 'Error when loading an image'"
            class="d-block w-100 pointer"
            data-bs-toggle="modal"
            data-bs-target="#imageModal"
            @click="enlargeImage($event, index)"
          />
        </div>
      </div>
      <div class="swiper-pagination" id="swiper-pagination-list"></div>
    </div>
    <!-- End of image list for mobile -->

    <div class="col-12 col-md-6">
      <transition name="fade" mode="out-in">
        <h3 v-if="product" class="text-truncate">
          {{ product?.name }}
          {{
            product && product.variants.length > 1 ? ' - ' + product?.variants[variant]?.name : ''
          }}
        </h3>
        <h3 v-else class="placeholder-glow"><span class="placeholder col-6"></span></h3>
      </transition>
      <transition name="fade" mode="out-in">
        <h3 v-if="product" class="mb-3 text-truncate">
          {{
            product?.variants[variant]?.price !== undefined
              ? 'Rp' +
                Intl.NumberFormat('id-ID', { style: 'decimal' }).format(
                  Number(product.variants[variant]?.price),
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
      <div v-if="product" class="col-12 col-md-3 position-relative sm-hide">
        <div class="sticky uplift rounded-2">
          <h5 class="mb-3">Quantity</h5>
          <div class="row">
            <div class="col-7">
              <div class="quantity input-group">
                <button class="btn" :class="{ focus: quantityFocused }" @click="decreaseQuantity">
                  <BIconDash class="ps-2 pe-2" />
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
                  <BIconPlus class="ps-2 pe-2" />
                </button>
              </div>
            </div>
            <div class="col-5 text-truncate" style="margin-top: 2px">
              Stock:
              {{
                product?.variants[variant]?.stock !== undefined
                  ? Intl.NumberFormat('id-ID', { style: 'decimal' }).format(
                      Number(product.variants[variant]?.stock),
                    )
                  : ''
              }}
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-3" style="margin-top: 1px">Subtotal</div>
            <h5 class="col-9 text-end text-truncate">
              {{
                product?.variants[variant]?.price !== undefined
                  ? 'Rp' +
                    Intl.NumberFormat('id-ID', { style: 'decimal' }).format(
                      Number(quantityString) * Number(product.variants[variant]?.price),
                    )
                  : ''
              }}
            </h5>
          </div>
          <div class="text-center">
            <button class="btn btn-sm btn-full-outline d-inline-block" @click="addToCart">
              <BIconPlus /> Add to Cart
            </button>
            <div class="separator d-inline-block"></div>
            <RouterLink
              class="btn btn-sm btn-full d-inline-block"
              :to="login().username ? '/cart/checkout' : '/login'"
              >Buy Now</RouterLink
            >
          </div>
        </div>
      </div>
    </transition>
  </div>

  <!-- Modal for image preview -->
  <div
    class="modal modal-lg"
    id="imageModal"
    tabindex="-1"
    aria-labelledby="imageModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-fullscreen-md-down">
      <div class="modal-content">
        <div class="modal-body">
          <div class="row">
            <div class="col-11">
              <h3 class="mb-4">{{ product?.name }}</h3>
            </div>
            <div class="col-1 d-flex justify-content-end">
              <span data-bs-dismiss="modal" style="cursor: pointer"><i class="bi bi-x"></i></span>
            </div>
          </div>
          <div class="row">
            <div class="col-12 col-md-9 d-flex justify-content-center mobile-centered">
              <img
                ref="enlargedImageRef"
                class="rounded-2 w-100 sm-hide"
                :alt="product ? product.name : 'Error when loading an image'"
              />
              <div class="col-12 swiper sm-show mb-4 sm-show" id="swiper-enlarge">
                <div class="swiper-wrapper">
                  <div v-for="(image, index) in product?.images" :key="index" class="swiper-slide">
                    <img
                      :src="`${staticProductImagesUrl}${image}`"
                      :alt="product ? product.name : 'Error when loading an image'"
                      class="d-block w-100"
                    />
                  </div>
                </div>
                <div class="swiper-pagination" id="swiper-pagination-enlarge"></div>
              </div>
            </div>
            <div
              class="col-12 col-md-3 justify-content-center list list-vertical list-horizontal-sm mobile-pull-down"
            >
              <div
                v-for="(image, index) in product?.images"
                class="rounded-2"
                :class="index == indexInEnlargedImage ? 'selected' : ''"
                :key="index"
                :style="{ 'background-image': `url(${staticProductImagesUrl}${image})` }"
                ref="enlargedImageListRef"
                :alt="product ? product.name : 'Error when loading an image'"
                @click="
                  (selectImage(enlargedImageRef, enlargedImageListRef, index, image),
                  enlargedSwiper.slideTo(index))
                "
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hidden {
  display: none;
}

#back-drop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.18);
  z-index: 1040;
}

#purchase-preview-wrapper {
  position: fixed;
  background-color: var(--main-bg);
  padding: 1rem;
  border-top-left-radius: 0.75rem;
  border-top-right-radius: 0.75rem;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index: 1050;
}

#purchase-preview-close {
  position: absolute;
  top: 0.5rem;
  right: 0.75rem;
  font-size: 1.25rem;
  color: var(--text);
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
  font-size: 1.25rem;
}

@media only screen and (min-width: 768px) {
  .navbar,
  #back-drop,
  #purchase-preview-wrapper {
    display: none;
  }
}

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

@media only screen and (max-width: 768px) {
  .list.list-horizontal-sm {
    grid-auto-flow: column;
    grid-auto-columns: 4rem;
    grid-auto-rows: initial;
    overflow-x: auto;
    overflow-y: initial;
  }

  .mobile-centered {
    position: absolute !important;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .mobile-pull-down {
    position: absolute;
    bottom: 2rem;
  }
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

.swiper-button-prev,
.swiper-button-next {
  color: var(--bs-gray-100);
  filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.2));
}

.swiper-pagination {
  color: var(--main-text);
  background-color: var(--main-bg);
  border-radius: 0.75rem;
  width: fit-content;
  padding: 0.25rem 0.75rem;
  left: 10px;
  opacity: 0.75;
}

@media only screen and (max-width: 768px) {
  .modal-content {
    background-color: var(--body-bg) !important;
  }

  .modal-body {
    overflow: hidden;
  }

  #enlarge-icon {
    display: table-cell;
    background-color: rgba(0, 0, 0, 0.18);
    right: 12.5px;
    border-radius: 0.25rem;
    height: 1.5rem;
    width: 1.5rem;
    pointer-events: none;
  }
}

@media only screen and (min-width: 768px) {
  #product-container {
    min-width: 1160px;
  }
}
</style>
