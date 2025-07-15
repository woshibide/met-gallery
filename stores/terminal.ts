import { defineStore } from 'pinia';

// stores/terminal.ts
export const useTerminalStore = defineStore('terminal', {
  state: () => ({
    logs: [] as string[],
  }),
  actions: {
    addLog(message: string) {
      // limit the number of logs to prevent memory issues
      if (this.logs.length > 500) {
        this.logs.shift();
      }
      this.logs.push(message);
    },
    clearLogs() {
      this.logs = [];
    },
  },
});
