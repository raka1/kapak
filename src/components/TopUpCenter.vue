<script setup lang="ts">
import { onMounted, ref } from 'vue'
import MobileTopUp from './top_up_center/MobileTopUp.vue'

const vTabRef = ref<HTMLDivElement | null>(null)
const tabContentRef = ref<HTMLDivElement | null>(null)

onMounted(() => {
  const tabContent = tabContentRef.value

  if (tabContent) tabContent.style.width = `calc(100% - 2rem - ${vTabRef.value?.offsetWidth}px)`
})
</script>

<template>
  <div id="top-up-center" class="rounded-4 mt-4 mb-4 uplift">
    <div class="cons">
      <h4 class="mt-3 mb-3">Top Up Center</h4>
      <div class="d-flex align-items-start mb-3">
        <div
          class="nav flex-column nav-pills me-3"
          ref="vTabRef"
          id="v-tab"
          aria-orientation="vertical"
        >
          <button
            class="nav-link active"
            id="v-mobile-tab"
            data-bs-toggle="pill"
            data-bs-target="#v-mobile"
            type="button"
          >
            <i class="pi pi-mobile"></i>&nbsp;&nbsp;Mobile
          </button>
          <button
            class="nav-link"
            id="v-data-plan-tab"
            data-bs-toggle="pill"
            data-bs-target="#v-data-plan"
            type="button"
          >
            <i class="pi pi-globe"></i>&nbsp;&nbsp;Data Plan
          </button>
          <button
            class="nav-link"
            id="v-electricity-token-tab"
            data-bs-toggle="pill"
            data-bs-target="#v-electricity-token"
            type="button"
          >
            <i class="pi pi-bolt"></i>&nbsp;&nbsp;Electricity Token
          </button>
          <button
            class="nav-link"
            id="v-games-tab"
            data-bs-toggle="pill"
            data-bs-target="#v-games"
            type="button"
          >
            <i class="pi pi-at"></i>&nbsp;&nbsp;Games
          </button>
        </div>
        <div ref="tabContentRef" class="tab-content">
          <div class="tab-pane fade show active" id="v-mobile"><MobileTopUp /></div>
          <div class="tab-pane fade" id="v-data-plan">Data Plan</div>
          <div class="tab-pane fade" id="v-electricity-token">Electricity Token</div>
          <div class="tab-pane fade" id="v-games">Games</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#top-up-center {
  overflow: auto;
  border: 1px solid var(--line);
  transition: border 0.15s ease-in-out;
  background-color: var(--main-bg);
  transition: all 0.15s ease-in-out;
}

.cons {
  margin-left: 1rem;
  margin-right: 1rem;
}

.nav-link {
  color: var(--main-text);
  border-radius: 0;
  border-right: 4px solid transparent;
  text-align: left;
}

.nav-link.active {
  color: var(--main-text);
  background-color: transparent;
  border-right: 4px solid var(--main-prim);
}
</style>
