<template>
  <div>
    <aside 
      class="side-menu" 
      :class="{ 'is-open': isOpen }" 
      :style="{ width: `${width}px` }"
      ref="sideMenuRef"
    >
      <TerminalHeader 
        @start-drag="startDrag"
        @decrease-font-size="decreaseFontSize"
        @increase-font-size="increaseFontSize"
        @close="$emit('close')"
      />
      <div class="terminal-body" ref="terminalBodyRef" :style="{ fontSize: `${fontSize}rem` }" @click="focusInput">
        <div v-for="(log, index) in logs" :key="index" class="log-line" v-html="formatLog(log)">
        </div>
        <div class="input-line">
          <span class="prompt">[@met-gallery ~]$</span>
          <input
            ref="commandInput"
            type="text"
            v-model="command"
            @keydown.enter="runCommand"
            @keydown.up.prevent="navigateHistory('up')"
            @keydown.down.prevent="navigateHistory('down')"
            class="terminal-input"
            autofocus
          />
        </div>
      </div>
      <div class="resizer" @mousedown="startResize"></div>
    </aside>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useTerminalStore } from '~/stores/terminal';
import TerminalHeader from './TerminalHeader.vue';

const props = defineProps({
  isOpen: Boolean,
});
const emit = defineEmits(['close']);

const terminalStore = useTerminalStore();
const logs = computed(() => terminalStore.logs);
const command = ref('');
const commandInput = ref(null);
const historyIndex = ref(-1);

watch(() => terminalStore.rebooting, (isRebooting) => {
  if (isRebooting) {
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
});

const sideMenuRef = ref(null);
const terminalBodyRef = ref(null);
const width = ref(420); // initial width
const minWidth = 220;
const fontSize = ref(0.9); // initial font size

const increaseFontSize = () => {
  fontSize.value += 0.1;
};

const decreaseFontSize = () => {
  if (fontSize.value > 0.5) { // set a minimum font size
    fontSize.value -= 0.1;
  }
};

const runCommand = () => {
  if (command.value.trim()) {
    terminalStore.executeCommand(command.value);
    command.value = '';
    historyIndex.value = -1; // reset history index
  }
};

const navigateHistory = (direction) => {
  const history = terminalStore.commandHistory;
  if (history.length === 0) return;

  if (direction === 'up') {
    if (historyIndex.value < history.length - 1) {
      historyIndex.value++;
    }
  } else { // down
    if (historyIndex.value > 0) {
      historyIndex.value--;
    } else {
      historyIndex.value = -1;
      command.value = '';
      return;
    }
  }
  command.value = history[historyIndex.value];
};

const formatLog = (log) => {
  if (log.startsWith('$ ')) {
    return `<span class="prompt">[@met-gallery ~]$</span> ${log.substring(2)}`;
  }
  return log.replace(/\n/g, '<br>');
};

const focusInput = () => {
  commandInput.value?.focus();
};

onMounted(() => {
  // any other onmounted logic can stay
});

onUnmounted(() => {
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

    .terminal-body {
        flex-grow: 1;
        overflow-y: auto;
        padding: var(--space-sm);
        white-space: pre-wrap;
        word-break: break-all;
        cursor: text;
    }

    .log-line {
      margin-bottom: var(--space-xs);
    }

    .prompt {
      color: var(--accent-color);
      margin-right: var(--space-sm);
    }

    .input-line {
      display: flex;
    }

    .terminal-input {
      flex-grow: 1;
      background: transparent;
      border: none;
      color: #e0e0e0;
      font-family: 'Necto', monospace;
      font-size: inherit;
      outline: none;
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
