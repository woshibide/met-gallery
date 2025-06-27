<template>
  <div>
    <div class="backdrop" v-if="isOpen" @click="$emit('close')"></div>
    <aside class="side-menu" :class="{ 'is-open': isOpen }">
      <div class="theme-toggle-container">
        <ClientOnly>
          <ColorScheme />
        </ClientOnly>
      </div>
      <ul class="nav-links">
        <li><NuxtLink to="/" @click="$emit('close')">home</NuxtLink></li>
        <li><NuxtLink to="/about" @click="$emit('close')">about</NuxtLink></li>
      </ul>
    </aside>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import ColorScheme from './ColorScheme.vue';

defineProps({
  isOpen: Boolean,
});
const emit = defineEmits(['close']);
</script>

<style scoped>
    .backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.2);
        z-index: 1099;
    }

    .side-menu {
        position: fixed;
        top: 0;
        left: -100%;
        width: 220px;
        max-width: 90vw;
        height: 100%;
        background: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(1rem) saturate(180%);
        -webkit-backdrop-filter: blur(1rem) saturate(180%);
        padding: var(--space-xl) var(--space-md);
        transition: left var(--transition-normal);
        z-index: 1100;
        display: flex;
        flex-direction: column;
    }

    .dark .side-menu {
        background: rgba(26, 26, 26, 0.7);
    }

    .side-menu.is-open {
        left: 0;
    }

    .nav-links {
        list-style: none;
        padding: 0;
        margin: var(--space-lg) 0 0 0;
    }

    .nav-links li {
        margin-bottom: var(--space-md);
    }

    .nav-links a {
        color: var(--text-secondary);
        text-decoration: none;
        font-size: 1.1rem;
        font-family: var(--director-regular, inherit);
        transition: color var(--transition-fast);
        display: block;
        padding: var(--space-xs) var(--space-sm);
        border-radius: var(--radius-md);
    }

    .nav-links a:hover, .nav-links .router-link-exact-active {
        color: var(--text-primary);
        background: var(--bg-secondary);
    }

    .theme-toggle-container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: var(--space-lg);
        padding: 0;
    }
</style>
