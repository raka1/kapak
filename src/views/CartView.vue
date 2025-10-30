<script setup lang="ts">
import { ref, watch, computed, onUnmounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import login from '@/stores/login'
import cart from '@/stores/cart'
import Products from '@/components/product/ProductList.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import notyf, { error as noter } from '@/utils/notyf'
import '@/assets/quantity.css'

const router = useRouter()

const confirmAction = ref<null | (() => void)>(null)
const quantityFocused = ref<boolean[][]>([])
const showConfirm = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')

let quantityTimeout: ReturnType<typeof setTimeout> | null = null

async function handleCartUpdate(
  product: string,
  variant: number,
  payload: { action?: 'increase' | 'decrease'; quantity?: number },
) {
  try {
    const response = await fetch(`/cart/${login().username}/items/${product}/${variant}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const res = await response.json()
    refreshCartData()

    switch (res.response) {
      case 'ITEM_DELETED_FROM_CART':
        notyf.open({ message: 'Item deleted from cart!' })
        break
      case 'QUANTITY_EXCEEDS_STOCK':
        notyf.open({ message: 'Quantity exceeds stock!' })
        break
      case 'ITEM_UPDATED_ON_CART':
        break
      default:
        throw new Error(`Response: ${res.response}`)
    }
  } catch (error) {
    noter(error)
  }
}

async function refreshCartData() {
  try {
    const response = await fetch(`/cart/${login().username}`)
    const res = await response.json()
    cart().reset(res.body)
    console.log(quantityFocused.value)
  } catch (error) {
    console.error(error)
  }
}

async function quantityInput(e: Event, product: string, variant: number) {
  const target = e.target as HTMLInputElement

  if (quantityTimeout) clearTimeout(quantityTimeout)

  quantityTimeout = setTimeout(async () => {
    console.log(quantityFocused.value)
    await handleCartUpdate(product, variant, {
      quantity: Number(target.value),
    })
  }, 1000)
}

async function quantityInputEnter(e: Event, product: string, variant: number) {
  const target = e.target as HTMLInputElement

  if (quantityTimeout) clearTimeout(quantityTimeout)

  await handleCartUpdate(product, variant, {
    quantity: Number(target.value),
  })
}

async function changeQuantity(change: 'increase' | 'decrease', product: string, variant: number) {
  await handleCartUpdate(product, variant, { action: change })
}

async function handleDelete(product: string, variant: number) {
  try {
    const response = await fetch(`/cart/${login().username}/items/${product}/${variant}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await response.json()

    if (res.response == 'ITEM_DELETED_FROM_CART') refreshCartData()
    else new Error(`Response: ${res.response}`)
  } catch (error) {
    noter(error)
  }
}

async function deleteItem(product: string, variant: number) {
  confirmTitle.value = 'Delete Item'
  confirmMessage.value = 'Are you sure you want to delete this item?'
  confirmAction.value = () => handleDelete(product, variant)
  showConfirm.value = true
}

interface SelectAll {
  value: 'all'
  check: boolean
}

interface SelectSellerBody {
  value: {
    seller: string
  }
  check: boolean
}

interface SelectOneBody {
  value: {
    product: string
    variant: number
  }
  check: boolean
}

type SelectBody = SelectAll | SelectSellerBody | SelectOneBody

async function select(body: SelectBody) {
  const response = await fetch(`/cart/${login().username}/items/check`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const res = await response.json()

  if (res.response === 'ITEMS_CHECKED_UPDATED') refreshCartData()
}

async function selectSeller(event: Event, seller: string) {
  const target = event.target as HTMLInputElement
  const body = { value: { seller }, check: target.checked }

  select(body)
}

async function selectAll(event: Event) {
  const target = event.target as HTMLInputElement
  const body: SelectAll = { value: 'all', check: target.checked }

  select(body)
}

async function selectOne(event: Event, product: string, variant: number) {
  const target = event.target as HTMLInputElement
  const body = { value: { product, variant }, check: target.checked }

  select(body)
}

const hasCheckedItems = computed(() =>
  cart().cart.some((seller) => seller.items.some((item) => item.checked)),
)

async function handleDeleteChecked() {
  const checkedItems = cart().cart.flatMap((seller) =>
    seller.items
      .filter((item) => item.checked)
      .map((item) => ({
        product: item.product._id,
        variant: item.variant_index,
      })),
  )
  try {
    const response = await fetch(`/cart/${login().username}/items`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(checkedItems),
    })
    const res = await response.json()
    if (res.response === 'ITEMS_DELETED_FROM_CART') refreshCartData()
    else throw new Error(`Response: ${res.response}`)
  } catch (error) {
    noter(error)
  }
}

function deleteCheckedItems() {
  confirmTitle.value = 'Delete Selected Items'
  confirmMessage.value = 'Are you sure you want to delete all selected items?'
  confirmAction.value = handleDeleteChecked
  showConfirm.value = true
}

function selectedTotalPrice() {
  return cart().cart.reduce((total, seller) => {
    return (
      total +
      seller.items.reduce((sum, item) => {
        if (item.checked) {
          return sum + item.quantity * item.variant.price
        }
        return sum
      }, 0)
    )
  }, 0)
}

function onConfirm() {
  if (confirmAction.value) confirmAction.value()
  showConfirm.value = false
}

watch(
  [() => login().isLoginChecked, () => login().username],
  () => {
    if (login().isLoginChecked && !login().username) {
      login().setAfterLogin('/cart')
      router.replace('/login')
    }
  },
  { immediate: true },
)

watch(
  () => cart().cart,
  () => {
    if (cart().cart.length) {
      for (const index in cart().cart) {
        quantityFocused.value[index] = []

        for (const indexx in cart().cart[index].items) {
          quantityFocused.value[index][indexx] = false
        }
      }
    }
  },
  { immediate: true },
)

onUnmounted(() => {
  if (quantityTimeout) clearTimeout(quantityTimeout)
})
</script>

<template>
  <ConfirmDialog
    :show="showConfirm"
    :title="confirmTitle"
    :message="confirmMessage"
    @confirm="onConfirm"
    @cancel="showConfirm = false"
    @update:show="showConfirm = $event"
  />
  <div v-if="cart().total_all_quantity">
    <h3 class="my-4">Cart</h3>
    <div class="items form-check uplift rounded-4 my-2 py-2 px-5">
      <input
        class="form-check-input"
        type="checkbox"
        id="select-all"
        v-model="cart().select_all"
        @click="selectAll($event)"
      />
      <label class="form-check-label" for="select-all"> <b>Select all</b></label>
      <span v-if="hasCheckedItems" class="btn float-end" @click="deleteCheckedItems"
        ><i class="pi pi-trash"></i
      ></span>
    </div>
    <div
      class="items uplift rounded-4 my-2 py-3 px-4"
      v-for="(cart, index) in cart().cart"
      :key="index"
    >
      <div class="mb-2">
        <input
          class="form-check-input me-2 mb-2"
          type="checkbox"
          v-model="cart.seller.checked"
          @click="selectSeller($event, cart.seller._id)"
        />
        <b class="mb-3">{{ cart.seller.first_name }} {{ cart.seller.last_name }}</b>
      </div>
      <div
        v-for="(item, indexx) in cart.items"
        :key="indexx"
        class="d-grid pb-2"
        style="grid-template-columns: 0.5rem auto; gap: 1rem"
      >
        <div>
          <input
            class="form-check-input me-2 mb-2"
            type="checkbox"
            v-model="item.checked"
            @change="selectOne($event, item.product._id, item.variant_index)"
          />
        </div>
        <div>
          <div class="d-grid" style="grid-template-columns: 6rem auto; gap: 1rem">
            <RouterLink
              :to="`/${cart.seller.username}/${item.product.slug}`"
              class="align-top me-4 img-cart"
            >
              <img :src="'data:image/png;base64, ' + item.product.image" />
            </RouterLink>
            <div class="align-top">
              <div class="d-grid" style="grid-template-columns: auto 8rem; gap: 1rem">
                <RouterLink
                  :to="`/${cart.seller.username}/${item.product.slug}`"
                  style="color: var(--main-text); text-decoration: none"
                  >{{ item.product.name }}</RouterLink
                >
                <div class="text-end">
                  <b
                    >Rp{{
                      Intl.NumberFormat('id-ID', { style: 'decimal' }).format(item.variant.price)
                    }}</b
                  >
                </div>
              </div>
              <div class="text-muted">
                {{ item.variant.name ? item.variant.name : '&nbsp;' }}
              </div>
              <div class="d-flex mt-2 justify-content-end">
                <div class="btn me-4" @click="deleteItem(item.product._id, item.variant_index)">
                  <i class="align-middle pi pi-trash"></i>
                </div>
                <div class="quantity input-group justify-content-end" style="width: 7rem">
                  <button
                    class="btn"
                    :class="{ focus: quantityFocused[index][indexx] }"
                    @click="changeQuantity('decrease', item.product._id, item.variant_index)"
                  >
                    <i class="pi pi-minus ps-2 pe-2"></i>
                  </button>
                  <input
                    class="text-center"
                    :class="{ focus: quantityFocused[index][indexx] }"
                    type="text"
                    v-model="item.quantity"
                    @input="quantityInput($event, item.product._id, item.variant_index)"
                    @keyup.enter="quantityInputEnter($event, item.product._id, item.variant_index)"
                    @focus="quantityFocused[index][indexx] = true"
                    @blur="quantityFocused[index][indexx] = false"
                  />
                  <button
                    class="btn"
                    :class="{ focus: quantityFocused[index][indexx] }"
                    @click="changeQuantity('increase', item.product._id, item.variant_index)"
                  >
                    <i class="pi pi-plus ps-2 pe-2"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <hr
            style="color: var(--line); opacity: 1"
            class="mt-4"
            v-if="indexx !== cart.items.length - 1"
          />
        </div>
      </div>
    </div>
    <transition name="expand">
      <div
        v-if="selectedTotalPrice()"
        id="sub"
        class="items uplift rounded-4 my-2 py-3 px-4 text-end d-flex align-items-center justify-content-end"
      >
        <div class="d-inline-block">
          <i
            class="pi pi-shopping-cart me-2"
            style="color: var(--main-prim); font-size: 1.2rem"
          ></i>
          <b
            >Total ({{
              cart().cart.reduce((sum, s) => sum + s.items.filter((i) => i.checked).length, 0)
            }}
            item):</b
          >
          <span class="text-muted">
            Rp{{ Intl.NumberFormat('id-ID', { style: 'decimal' }).format(selectedTotalPrice()) }}
          </span>
          <div class="text-muted small mt-1">*Shipping fee not included</div>
        </div>
        <div class="separator d-inline-block"></div>
        <button class="btn btn-lg btn-full d-inline-block" ref="buyNowRef">
          Checkout <i class="pi pi-arrow-right ms-2"></i>
        </button>
      </div>
    </transition>
  </div>
  <div v-else id="empty-container" class="position-relative w-100 d-flex justify-content-center">
    <div id="empty" class="row">
      <div class="col-3"><img src="/images/cart.png" /></div>
      <div class="col-9">
        <h3>Oops, your cart is empty!</h3>
        <p>Time to treat yourself.</p>
        <button class="btn btn-full" @click="router.push('/')">Let's Shopping</button>
      </div>
    </div>
  </div>
  <h3 class="mb-4 mt-4">Recommendation</h3>
  <Products />
</template>

<style scoped>
.form-check-input:checked {
  background-color: var(--main-prim);
  border-color: var(--main-prim);
}

#empty {
  width: 35rem;
  padding: 8rem 0;
}

#empty img {
  height: 8rem;
  width: 8rem;
}

.items {
  background-color: var(--main-bg);
  border: 1px solid var(--line);
  transition:
    border 0.15s ease-in-out,
    background-color 0.15s ease-in-out;
}

.img-cart {
  width: 6rem;
  height: 6rem;
  overflow: hidden;
  border-radius: 0.5rem;
}

.img-cart img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.expand-enter-active,
.expand-leave-active {
  transition: max-height 0.15s ease-in-out;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  max-height: 0;
}
.expand-enter-to,
.expand-leave-from {
  max-height: 5.9rem;
}

#sub {
  overflow: hidden;
}

.separator {
  align-self: stretch;
  width: 0;
  border-left: 1px solid var(--line);
  margin: 0 1rem;
  transition: border-left 15s ease-in-out;
}
</style>
