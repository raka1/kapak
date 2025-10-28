<script setup lang="ts">
import { watch } from 'vue'

interface Props {
  show: boolean
  title: string
  message: string
}

const props = defineProps<Props>()

type Emits = {
  (e: 'confirm'): void
  (e: 'cancel'): void
  (e: 'update:show', value: boolean): void
}

const emit = defineEmits<Emits>()

watch(
  () => props.show,
  (val) => {
    if (!val) close()
  },
)

function confirm() {
  emit('confirm')
  close()
}
function cancel() {
  emit('cancel')
  close()
}
function close() {
  emit('update:show', false)
}
</script>

<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="props.show" class="confirm-dialog-backdrop" @click.self="close">
        <div class="confirm-dialog-card uplift">
          <h4 class="mb-2">{{ props.title }}</h4>
          <div class="mb-3 text-muted">{{ props.message }}</div>
          <div class="d-flex justify-content-end gap-2">
            <button class="btn btn-full-outline" @click="cancel">Cancel</button>
            <button class="btn btn-full" @click="confirm">Yes</button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.confirm-dialog-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.18);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.confirm-dialog-card {
  background: var(--main-bg);
  color: var(--main-text);
  min-width: 320px;
  max-width: 90vw;
  border-radius: 1rem;
  padding: 2rem 1.5rem 1.2rem 1.5rem;
  animation: pop 0.18s cubic-bezier(0.4, 2, 0.6, 1) both;
}
@keyframes pop {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
