<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface Price {
  cost: number
  nominal: number
}

interface Prefix {
  _id: string
  name: string
  image: string
  prefixes: Array<string>
}

const inputRef = ref<HTMLInputElement | null>(null)
const imRef = ref<HTMLImageElement | null>(null)
const valRefs = ref<HTMLDivElement[]>([])
const buyNowRef = ref<HTMLButtonElement | null>(null)
const prefixeList = ref<Prefix[]>([])
const prices = ref<Price[]>([])
const selectedPrice = ref<Price | null>(null)
const provider = ref('')

let get: boolean = false

async function getProviders() {
  try {
    const response = await fetch('/api/item/provider_prefixes')
    prefixeList.value = await response.json()
  } catch (error) {
    console.error(error)
  }
}

async function nominal(id: string) {
  try {
    const response = await fetch('/api/item/top_up_nominals/' + id)
    const nominal = await response.json()

    prices.value = nominal.prices
  } catch (error) {
    console.error(error)
  }
}

function prefix(e: Event) {
  const value = (e.target as HTMLInputElement).value

  if (value.length >= 4 && !get)
    for (let i = 0; i < prefixeList.value.length; i++) {
      const pre = prefixeList.value[i]
      const id = pre._id
      const name = pre.name
      const image = pre.image
      const prefixes = pre.prefixes

      const find = prefixes.find((str) => value.startsWith(str))

      if (find) {
        get = true
        imRef.value?.setAttribute('src', 'data:image/png;base64,' + image)
        provider.value = 'Provider: ' + name

        if (imRef.value && inputRef.value?.offsetHeight !== undefined)
          imRef.value.style.height = `${inputRef.value?.offsetHeight}px`

        nominal(id)
        break
      }
    }

  if (value.length < 4 && get) {
    imRef.value?.setAttribute('src', '')
    buyNowRef.value?.classList.add('disabled')
    selectedPrice.value = null
    provider.value = ''
    prices.value.length = 0
    get = false
  }
}

function clickVal(e: Event, price: Price) {
  const target = e.currentTarget as HTMLElement

  selectedPrice.value = price
  buyNowRef.value?.classList.remove('disabled')

  for (let i = 0; i < valRefs.value.length; i++) {
    const element = valRefs.value[i]

    if (element.classList.contains('selected')) element.classList.remove('selected')
  }

  target.classList.add('selected')
}

onMounted(getProviders)
</script>

<template>
  <transition name="fade" mode="out-in">
    <div v-if="!prefixeList.length">
      <h5 class="placeholder-glow"><span class="placeholder col-1"></span></h5>
      <div class="placeholder-glow"><span class="placeholder col-2"></span></div>
      <h2 class="placeholder-glow"><span class="placeholder col-12"></span></h2>
      <div class="text-end">
        <button
          class="btn btn-lg btn-full d-inline-block disabled placeholder"
          style="width: 7rem"
        ></button>
      </div>
    </div>
    <div v-else>
      <h5>Recharge</h5>
      <label for="phone-number">Phone Number</label>
      <div class="input-group">
        <input
          ref="inputRef"
          type="tel"
          class="form-control"
          id="phone-number"
          @input="prefix"
          placeholder="ex. 0838xxxxxxxx / 0856xxxxxxxx"
        />
        <img ref="imRef" id="im" />
      </div>
      <transition name="expand" tag="div"
        ><span v-if="provider">{{ provider }}</span></transition
      >
      <transition-group
        name="expand"
        tag="div"
        class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 mt-4"
      >
        <div v-for="(price, index) in prices" :key="index" class="col mb-3">
          <div ref="valRefs" class="val rounded-2" @click="clickVal($event, price)">
            <div>
              {{ Intl.NumberFormat('id-ID', { style: 'decimal' }).format(price.nominal) }}
            </div>
            <div>
              Price: Rp{{ Intl.NumberFormat('id-ID', { style: 'decimal' }).format(price.cost) }}
            </div>
          </div>
        </div>
      </transition-group>
      <div class="text-end" :style="selectedPrice ? 'margin-top: -1.2rem' : ''">
        <div class="d-inline-block" v-if="selectedPrice" style="transform: translateY(0.8rem)">
          <span style="font-size: 0.8rem">Total Price</span> <br />
          <span style="font-size: 1.2rem; color: var(--main-prim)">Rp{{ selectedPrice.cost }}</span>
        </div>
        <div class="separator d-inline-block" v-if="selectedPrice"></div>
        <button class="btn btn-lg btn-full d-inline-block disabled" ref="buyNowRef">Buy Now</button>
      </div>
    </div>
  </transition>
</template>

<style scoped>
/* start of tag transition */
.expand-enter-active,
.expand-leave-active {
  transition: max-height 0.15s ease-in-out;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 224px;
}
/* end of tag transition */

#im {
  padding: 4px 0;
  border-bottom: 1px solid var(--line-clickable);
  transition: border-bottom 0.15s ease-in-out;
}

#phone-number:focus ~ #im {
  border-bottom: 1px solid var(--main-prim);
}

.row {
  overflow: hidden;
}

.val {
  position: relative;
  border: 1px solid var(--line-clickable);
  cursor: pointer;
  transition: border 0.15s ease-in-out;
  height: 6rem;
}

.val:hover {
  border: 1px solid var(--main-prim);
}

.val.selected {
  border: 1px solid var(--main-prim);
}

.val.selected > div:nth-of-type(1) {
  color: var(--main-prim);
}

.val > div:nth-of-type(1) {
  position: absolute;
  font-weight: 500;
  font-size: 1.2rem;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: color 0.15s ease-in-out;
}

.val > div:nth-of-type(2) {
  position: absolute;
  font-size: 0.8rem;
  bottom: 2px;
  right: 4px;
}

.separator {
  height: 2.5rem;
  border-left: 1px solid var(--line);
  margin: 0 1rem;
  transform: translateY(1rem);
  transition: border-left 0.15s ease-in-out;
}
</style>
