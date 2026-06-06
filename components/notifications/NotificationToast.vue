<script setup lang="ts">
defineProps<{
  message: string | null
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <Transition name="toast-slide">
    <v-alert
      v-if="message"
      class="notification-toast"
      type="info"
      variant="elevated"
      border="start"
      closable
      @click:close="emit('close')"
    >
      {{ message }}
    </v-alert>
  </Transition>
</template>

<style scoped>
.notification-toast {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 3000;
  width: min(420px, calc(100vw - 32px));
}

.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.toast-slide-enter-from,
.toast-slide-leave-to {
  opacity: 0;
  transform: translateY(16px);
}
</style>
