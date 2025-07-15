<script setup>
import { useNotificationStore } from '~/stores/notification'
import { storeToRefs } from 'pinia'

const notificationStore = useNotificationStore()
const { message, type, visible } = storeToRefs(notificationStore)
</script>

<template>
  <transition name="slide-fade">
    <div v-if="visible" :class="['notification', type]">
      <p>{{ message }}</p>
    </div>
  </transition>
</template>

<style scoped>
.notification {
  position: fixed;
  inset: auto 0 var(--space-xl) 0;
  margin: 0 auto;
  width: fit-content;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-md);
  color: var(--bg-primary);
  z-index: 1000;
  box-shadow: var(--shadow-sm);
  font-size: 0.8rem;
}

.notification p {
  font-family: var(--necto);
}

.notification.info,
.notification.warning,
.notification.error {
  background-color: var(--text-primary);
}


.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
