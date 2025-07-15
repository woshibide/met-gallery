import { useTerminalStore } from '~/stores/terminal';

export default defineNuxtPlugin(() => {
  const terminalStore = useTerminalStore();
  const originalConsoleLog = console.log;

  console.log = (...args: any[]) => {
    originalConsoleLog.apply(console, args);

    const message = args.map(arg => {
      if (typeof arg === 'object' && arg !== null) {
        try {
          return JSON.stringify(arg, null, 2);
        } catch (e) {
          return '[unserializable object]';
        }
      }
      return String(arg);
    }).join(' ');

    terminalStore.addLog(message);
  };
});
