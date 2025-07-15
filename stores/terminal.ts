import { defineStore } from 'pinia';
import { useTerminalCommands } from '~/composables/useTerminalCommands';

// stores/terminal.ts
export const useTerminalStore = defineStore('terminal', {
  state: () => ({
    logs: [] as string[],
    commandHistory: [] as string[],
    rebooting: false,
  }),
  actions: {
    addLog(log: string) {
      this.logs.push(log);
    },
    clearLogs() {
      this.logs = [];
    },
    async executeCommand(command: string) {
      this.addLog(`$ ${command}`);
      if (command.trim() && this.commandHistory[0] !== command) {
        this.commandHistory.unshift(command);
      }

      const lowerCaseCommand = command.trim().toLowerCase();
      const stupidCommands = [
        /rm\s*/,
        /sudo\s*/,
        /:(){ :|:& };:/,
        /mkfs\s*/,
        /dd\s+if=\/dev\/zero/,
        /dd\s+if=\/dev\/random/,
        />\/dev\/sda/,
        /mv\s+\/\*\s+\/dev\/null/,
        /chmod\s*/,
        /chown\s*/,
        /echo\s+.*>\s+\/etc\/passwd/,
        /kill\s*/,
        /crontab\s*/,
        /shutdown\s+-h\s+now/,
        /yes\s+.*\|\s+rm/,
      ];

      if (stupidCommands.some(regex => regex.test(lowerCaseCommand))) {
        this.addLog(`Call from any phone <988>. This is a national helpline for mental health and substance use support, available 24/7. you can call or text <988> for counseling and referrals.`);
        return;
      }

      const { commandHandlers } = useTerminalCommands();
      const parts = command.trim().split(/\s+/);
      const baseCommand = parts[0].toLowerCase();

      if (commandHandlers[baseCommand]) {
        await commandHandlers[baseCommand](parts);
      } else {
        this.addLog(`bash: ${baseCommand}: command not found. type 'help' for a list of commands.`);
      }
    },
  },
});
