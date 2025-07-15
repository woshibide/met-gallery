<template>
  <div class="terminal-header" @mousedown="$emit('start-drag', $event)">
    <div class="header-left">
      <span :class="['status-indicator', { 'is-ok': apiStatus }]" title="api status"></span>
      <span>
        <!-- TODO: dropdown to choose other museum apis -->
        <NuxtLink to="https://metmuseum.github.io/" target="_blank" rel="noopener" id="api-link">[metmuseum.github.io]</NuxtLink>
      </span>
      <!-- show time with city and gmt offset for clarity -->
      <span class="time">{{ nycTime }}</span>
    </div>
    <div class="header-right">
      <button @click="$emit('decrease-font-size')" title="decrease font size" class="header-btn">-</button>
      <button @click="$emit('increase-font-size')" title="increase font size" class="header-btn">+</button>
      <button @click="toggleColorMode" title="toggle color scheme" class="header-btn">◐</button>
      <button @click="$emit('close')" class="close-btn" title="close terminal">×</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

defineEmits(['close', 'decrease-font-size', 'increase-font-size', 'start-drag']);

const colorMode = useColorMode();
const nycTime = ref('');
// format time as hh:mm:ss 
const apiStatus = ref(false);
let timeInterval = null;
let apiCheckInterval = null;

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
};

const updateTime = () => {
  // show only nyc and time for simplicity
  const now = new Date();
  const options = {
    timeZone: 'america/new_york',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };
  const time = now.toLocaleTimeString('en-us', options);
  nycTime.value = `NYC ${time}`;
};

const checkApiStatus = async () => {
  try {
    // directly check the met museum api with a simple query
    const metApiBase = 'https://collectionapi.metmuseum.org/public/collection/v1';
    const testQuery = 'cat'; // simple query that should always have results
    const response = await fetch(`${metApiBase}/search?q=${testQuery}&hasImages=true`);
    apiStatus.value = response.ok;
  } catch (error) {
    apiStatus.value = false;
    console.error('api status check failed:', error);
  }
};

onMounted(() => {
  updateTime();
  timeInterval = setInterval(updateTime, 1000);
  
  checkApiStatus();
  apiCheckInterval = setInterval(checkApiStatus, 30000); // check every 30 seconds
});

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval);
  }
  if (apiCheckInterval) {
    clearInterval(apiCheckInterval);
  }
});
</script>

<style scoped>
.terminal-header {
    background: #1e1e1e;
    padding: var(--space-xs) var(--space-sm);
    cursor: grab;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #333;
    font-size: 0.75rem;
}

.header-left {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
}

.header-right {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
}

.time {
    color: #aaa;
    white-space: nowrap;
}

.terminal-header:active {
    cursor: grabbing;
}

.close-btn, .header-btn {
    background: none;
    border: none;
    color: #e0e0e0;
    font-size: 1.2rem;
    cursor: pointer;
    line-height: 1;
}

.header-btn {
    font-size: 1rem;
    padding: 0 var(--space-xs);
}

#api-link {
  color: #aaa;
  text-decoration: none;
}

#api-link:hover {
  text-decoration: underline 2px solid;
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid currentColor;
  display: inline-block;
}

.status-indicator.is-ok {
  background-color: var(--accent-color);
  border-color: var(--accent-color);
  animation: bleep 1.5s infinite;
}

@keyframes bleep {
  0% {
    box-shadow: 0 0 0 0 #ff003566;
  }
  70% {
    box-shadow: 0 0 0 10px rgba(51, 255, 136, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(51, 255, 136, 0);
  }
}
</style>
