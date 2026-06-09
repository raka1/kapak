<script lang="ts" setup>
import { BIconHouseFill, BIconHouse, BIconPersonFill, BIconPerson } from 'bootstrap-icons-vue'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <nav class="navbar fixed-bottom bg-body-primary">
    <div class="row row-cols-2">
      <RouterLink
        class="text-center"
        :to="{ name: 'Home' }"
        :class="{ active: route.name === 'Home' }"
      >
        <span v-if="route.name === 'Home'"><BIconHouseFill /></span>
        <span v-else><BIconHouse /></span>
      </RouterLink>
      <RouterLink
        class="text-center"
        :to="{ name: 'Profile' }"
        :class="{ active: route.name === 'Profile' }"
      >
        <span v-if="route.name === 'Profile'"><BIconPersonFill /></span>
        <span v-else><BIconPerson /></span>
      </RouterLink>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: none;
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

.navbar a {
  color: var(--text);
  transition: color 0.15s ease-in-out;
  position: relative;
}

.navbar a.active:after {
  content: '';
  border-radius: 15px;
  display: block;
  width: 50px;
  height: 30px;
  background: var(--main-prim);
  transition: width 0.15s ease-in-out;
  background-color: var(--main-prim);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.2;
}

@media only screen and (max-width: 768px) {
  .navbar {
    display: initial;
  }
}
</style>
