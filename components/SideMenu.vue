<template>
  <div>
    <aside 
      class="side-menu" 
      :class="{ 'is-open': isOpen }" 
      :style="{ width: `${width}px` }"
      ref="sideMenuRef"
    >
      <div class="terminal-header" @mousedown="startDrag">
        <div class="header-left">
          <span>[wshbd.com]</span>
          <span class="time">{{ amsterdamTime }}</span>
        </div>
        <div class="header-right">
          <button @click="decreaseFontSize" title="decrease font size" class="header-btn">-</button>
          <button @click="increaseFontSize" title="increase font size" class="header-btn">+</button>
          <button @click="toggleColorMode" title="toggle color scheme" class="header-btn">◐</button>
          <button @click="$emit('close')" class="close-btn" title="close terminal">×</button>
        </div>
      </div>
      <div class="terminal-body" ref="terminalBodyRef" :style="{ fontSize: `${fontSize}rem` }">
        <div v-for="(log, index) in logs" :key="index" class="log-line">
          <span class="prompt">[@met-gallery ~]$</span> {{ log }}
        </div>
      </div>
      <div class="resizer" @mousedown="startResize"></div>
    </aside>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useTerminalStore } from '~/stores/terminal';

const colorMode = useColorMode();

const props = defineProps({
  isOpen: Boolean,
});
const emit = defineEmits(['close']);

const terminalStore = useTerminalStore();
const logs = computed(() => terminalStore.logs);

const sideMenuRef = ref(null);
const terminalBodyRef = ref(null);
const width = ref(350); // initial width
const minWidth = 220;
const fontSize = ref(0.9); // initial font size
const amsterdamTime = ref('');
let timeInterval = null;

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
};

const increaseFontSize = () => {
  fontSize.value += 0.1;
};

const decreaseFontSize = () => {
  if (fontSize.value > 0.5) { // set a minimum font size
    fontSize.value -= 0.1;
  }
};

const updateTime = () => {
  amsterdamTime.value = new Date().toLocaleString('en-us', {
    timeZone: 'europe/amsterdam',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZoneName: 'short',
  });
};

onMounted(() => {
  updateTime();
  timeInterval = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval);
  }
  stopResize(); // cleanup listeners
});

const startResize = (event) => {
  event.preventDefault();
  document.addEventListener('mousemove', doResize);
  document.addEventListener('mouseup', stopResize);
};

const doResize = (event) => {
  const newWidth = event.clientX;
  const maxWidth = window.innerWidth * 0.5; // 50vw
  if (newWidth > minWidth && newWidth < maxWidth) {
    width.value = newWidth;
  }
};

const stopResize = () => {
  document.removeEventListener('mousemove', doResize);
  document.removeEventListener('mouseup', stopResize);
};

const startDrag = (event) => {
  // functionality to drag the menu can be added here if needed
};

watch(() => logs.value.length, () => {
  // auto-scroll to bottom
  nextTick(() => {
    if (terminalBodyRef.value) {
      terminalBodyRef.value.scrollTop = terminalBodyRef.value.scrollHeight;
    }
  });
});

watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    nextTick(() => {
      if (terminalBodyRef.value) {
        terminalBodyRef.value.scrollTop = terminalBodyRef.value.scrollHeight;
      }
    });
  }
});
</script>

<style scoped>
    .side-menu {
        position: fixed;
        top: 0;
        left: -100%;
        height: 100%;
        background: rgba(10, 10, 10, 0.85);
        backdrop-filter: blur(1rem) saturate(180%);
        -webkit-backdrop-filter: blur(1rem) saturate(180%);
        transition: left var(--transition-normal);
        z-index: 1100;
        display: flex;
        flex-direction: column;
        color: #e0e0e0;
        font-family: 'Necto', monospace;
        border-right: 1px solid #333;
    }

    .dark .side-menu {
        background: rgba(10, 10, 10, 0.85);
    }

    .side-menu.is-open {
        left: 0;
    }

    .terminal-header {
        background: #1e1e1e;
        padding: var(--space-xs) var(--space-sm);
        cursor: grab;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #333;
        font-size: 0.9rem;
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
        font-size: 0.8rem;
        color: #aaa;
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

    .terminal-body {
        flex-grow: 1;
        overflow-y: auto;
        padding: var(--space-sm);
        white-space: pre-wrap;
        word-break: break-all;
    }

    .log-line {
      margin-bottom: var(--space-xs);
    }

    .prompt {
      color: var(--accent-color);
      margin-right: var(--space-sm);
    }

    .resizer {
        position: absolute;
        top: 0;
        right: -2px;
        width: 5px;
        height: 100%;
        cursor: col-resize;
        background: transparent;
    }

    /* scrollbar styles */
    .terminal-body::-webkit-scrollbar {
        width: 8px;
    }

    .terminal-body::-webkit-scrollbar-track {
        background: #1e1e1e;
    }

    .terminal-body::-webkit-scrollbar-thumb {
        background-color: #444;
        border-radius: 4px;
        border: 2px solid #1e1e1e;
    }
</style>
