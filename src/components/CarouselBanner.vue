<script setup lang="ts">
import Swiper from 'swiper'
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

interface Images {
  name: string
  image: string
  status: boolean
}

const waitingCarouselsRef = ref<HTMLDivElement | null>(null)
const carousels = ref<Images[]>([])

const staticUrl = import.meta.env.VITE_STATIC_URL
const staticBannerImagesUrl = `${staticUrl}/images/banners/`

async function getCarousels() {
  try {
    const response = await fetch('/api/v1/item/banners')
    carousels.value = await response.json()
  } catch (error) {
    console.error(error)
  }
}

function onBannerLoaded(index: number) {
  if (index == carousels.value.length - 1) {
    new Swiper('.swiper', {
      modules: [Navigation, Pagination, Autoplay],
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      observer: true,
      observeParents: true,
      observeSlideChildren: true,
      loop: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
      },
    })
  }
}

onMounted(async () => {
  if (waitingCarouselsRef.value)
    waitingCarouselsRef.value.style.height = `calc(${waitingCarouselsRef.value?.offsetWidth / 4}px)`

  await getCarousels()
})
</script>

<template>
  <transition name="fade" mode="out-in">
    <div
      ref="waitingCarouselsRef"
      id="waiting-carousels"
      class="rounded-4 mt-4"
      v-if="!carousels.length"
    ></div>
    <div class="swiper mt-4 rounded-4 uplift" v-else>
      <div class="swiper-wrapper">
        <div v-for="(carousel, index) in carousels" :key="index" class="swiper-slide">
          <RouterLink
            v-if="carousel.status"
            :to="{ name: 'Banner', params: { name: carousel.name } }"
          >
            <img
              :src="`${staticBannerImagesUrl}${carousel.image}`"
              :alt="carousel.name ? carousel.name : 'Error when loading a banner image'"
              @load="onBannerLoaded(index)"
              class="d-block w-100"
            />
          </RouterLink>
        </div>
      </div>

      <div class="swiper-pagination"></div>

      <div class="swiper-button-prev sm-hide"></div>
      <div class="swiper-button-next sm-hide"></div>
    </div>
  </transition>
  <div style="text-align: right">
    <RouterLink id="see-all-promos" class="btn" :to="{ name: 'AllBanners' }">See all</RouterLink>
  </div>
</template>

<style scoped>
#waiting-carousels {
  background-color: var(--line-clickable);
  height: 300px;
  width: 100%;
  transition: background-color 0.15s ease-in-out;
}

#see-all-promos {
  display: inline-block;
}

.swiper {
  --swiper-theme-color: var(--bs-gray-100);
  --swiper-pagination-color: var(--bs-gray-100);
}

.swiper:hover > .swiper-button-prev,
.swiper:hover > .swiper-button-next {
  opacity: 1;
}

.swiper:hover > .swiper-button-prev {
  transform: translateX(0);
}
.swiper:hover > .swiper-button-next {
  transform: translateX(0);
}

.swiper-button-prev,
.swiper-button-next {
  opacity: 0;
  transition: all 0.15s ease-in-out;
  color: var(--bs-gray-100);
  filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.2));
}

.swiper-button-prev {
  transform: translateX(50%);
}
.swiper-button-next {
  transform: translateX(-50%);
}
</style>
