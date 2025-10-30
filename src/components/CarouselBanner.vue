<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface Images {
  name: string
  image: string
  status: boolean
}

const waitingCarouselsRef = ref<HTMLDivElement | null>(null)
const carousels = ref<Images[]>([])

async function getCarousels() {
  try {
    const response = await fetch('/item/banners')
    carousels.value = await response.json()
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  if (waitingCarouselsRef.value)
    waitingCarouselsRef.value.style.height = `calc(${waitingCarouselsRef.value?.offsetWidth / 4}px)`

  getCarousels()
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
    <div
      id="carousel-banner"
      class="carousel slide mt-4 rounded-4 uplift"
      data-bs-ride="carousel"
      v-else
    >
      <div class="carousel-indicators">
        <button
          v-for="(carousel, index) in carousels"
          :key="index"
          type="button"
          data-bs-target="#carousel-banner"
          :data-bs-slide-to="index"
          :class="index == 0 ? 'active' : ''"
        ></button>
      </div>
      <div class="carousel-inner rounded-4">
        <div
          v-for="(carousel, index) in carousels"
          :key="index"
          class="carousel-item"
          :class="index == 0 ? 'active' : ''"
        >
          <img
            :src="'data:image/jpg;base64,' + carousel.image"
            :alt="carousel.name"
            class="d-block w-100"
          />
        </div>
      </div>
      <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#carousel-banner"
        data-bs-slide="prev"
      >
        <i class="pi pi-chevron-left"></i>
        <span class="visually-hidden">Previous</span>
      </button>
      <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#carousel-banner"
        data-bs-slide="next"
      >
        <i class="pi pi-chevron-right"></i>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  </transition>
  <div style="text-align: right">
    <button id="see-all-promos" class="btn">See all</button>
  </div>
</template>

<style scoped>
#waiting-carousels {
  background-color: var(--line-clickable);
  height: 300px;
  width: 100%;
  transition: background-color 0.15s ease-in-out;
}

.carousel:hover > .carousel-control-prev,
.carousel:hover > .carousel-control-next {
  opacity: 1;
}

.carousel:hover > .carousel-control-prev {
  transform: translateX(-50%) translateY(-50%);
}
.carousel:hover > .carousel-control-next {
  transform: translateX(50%) translateY(-50%);
}

.carousel-control-prev {
  transform: translateX(calc(-50% + 1rem)) translateY(-50%);
}

.carousel-control-next {
  transform: translateX(calc(50% - 1rem)) translateY(-50%);
}

.carousel-control-prev,
.carousel-control-next {
  height: 3rem;
  width: 3rem;
  border-radius: 100%;
  background-color: var(--main-bg);
  color: var(--main-gray);
  opacity: 0;
  top: 50%;
  bottom: unset;
  box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.2);
  transition: all 0.15s ease-in-out;
}

.carousel-indicators {
  margin-left: unset;
  margin-right: 1rem;
  margin-bottom: 0.5rem;
  left: unset;
}

.carousel-indicators [data-bs-target] {
  height: 0.5rem;
  width: 0.5rem;
  border-radius: 100%;
}

#see-all-promos {
  display: inline-block;
}
</style>
