<template>
  <button
    @click="toggleTheme"
    class="theme-toggle"
    :aria-label="currentThemeLabel"
    :title="currentThemeLabel"
  >
    <svg
      v-if="$colorMode.value === 'light'"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <!-- moon icon for switching to dark mode -->
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <!-- sun icon for switching to light mode -->
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  </button>
</template>

<script setup>
const { $colorMode } = useNuxtApp()

// computed property for accessibility label
const currentThemeLabel = computed(() => {
  if ($colorMode.value === 'light') {
    return 'switch to dark mode'
  }
  return 'switch to light mode'
})

// function to toggle between light and dark themes
const toggleTheme = () => {
  if ($colorMode.preference === 'system') {
    // if currently using system preference, switch to opposite of current value
    $colorMode.preference = $colorMode.value === 'light' ? 'dark' : 'light'
  } else {
    // toggle between light and dark
    $colorMode.preference = $colorMode.preference === 'light' ? 'dark' : 'light'
  }
}
</script>

<style scoped>
.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: var(--text-primary);
}

.theme-toggle:hover {
  background-color: var(--hover-bg);
  transform: scale(1.05);
}

.theme-toggle:focus {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
}

.theme-toggle:active {
  transform: scale(0.95);
}

.theme-toggle svg {
  transition: all 0.3s ease;
}
</style>
