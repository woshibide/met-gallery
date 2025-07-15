import { useTerminalStore } from '~/stores/terminal';
import { useNotificationStore } from '~/stores/notification';

export default defineNuxtPlugin(() => {
  const terminalStore = useTerminalStore();
  const notificationStore = useNotificationStore();
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;

  const formatArgs = (args: any[]) => {
    return args.map(arg => {
      if (arg instanceof Error) {
        return arg.message;
      }
      if (typeof arg === 'object' && arg !== null) {
        try {
          return JSON.stringify(arg, null, 2);
        } catch (e) {
          return '[unserializable object]';
        }
      }
      return String(arg);
    }).join(' ');
  }

  console.log = (...args: any[]) => {
    originalConsoleLog.apply(console, args);

    const message = formatArgs(args);

    terminalStore.addLog(message);
  };

  console.error = (...args: any[]) => {
    originalConsoleError.apply(console, args);

    const message = formatArgs(args);
    const errorMessage = `error: ${message}`;
    
    terminalStore.addLog(errorMessage);
    notificationStore.showNotification(message, 'error');
  };
});
