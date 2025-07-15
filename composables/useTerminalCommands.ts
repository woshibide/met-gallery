// composables/useTerminalCommands.ts
import { useTerminalStore } from '~/stores/terminal';
import { useSearchStore } from '~/stores/search';

export function useTerminalCommands() {
  const terminalStore = useTerminalStore();
  const searchStore = useSearchStore();

  const commandHandlers: { [key: string]: (parts: string[]) => Promise<void> | void } = {
    help: () => {
      const helpOutput = `available commands:
  reboot        - reboot the system.
  ls            - list directory contents.
  whoami        - print effective userid.
  whoareyou     - display developer info.
  fetch [-q query] [count] - fetch artworks from the met.
  echo [text]   - display a line of text.
  clear         - clear the terminal screen.
  top           - display system processes.
  pwd           - print name of current/working directory.
  cd [dir]      - change the shell working directory.
  cat [file]    - concatenate and print files.
  ps            - report a snapshot of the current processes.`;
      terminalStore.addLog(helpOutput);
    },
    reboot: () => {
      terminalStore.addLog('rebooting...');
      terminalStore.rebooting = true;
    },
    ls: () => {
      const lsOutput = `app.config.ts           error.vue               package-lock.json       README.md
app.vue                 eslint.config.mjs       package.json            server
assets                  layouts                 pages                   stores
components              node_modules            plugins                 tsconfig.json
dist                    nuxt.config.ts          public`;
      terminalStore.addLog(lsOutput);
    },
    whoami: async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        if (!response.ok) throw new Error('failed to fetch ip');
        const data = await response.json();
        terminalStore.addLog(data.ip);
      } catch (error) {
        terminalStore.addLog('visitor');
      }
    },
    whoareyou: () => {
      const whoareyouOutput = `Pyotr Goloub, designer / developer. More about me here https://wshbd.com`;
      terminalStore.addLog(whoareyouOutput);
    },
    echo: (parts: string[]) => {
      terminalStore.addLog(parts.slice(1).join(' '));
    },
    clear: () => {
      terminalStore.clearLogs();
    },
    fetch: (parts: string[]) => {
      const count = parseInt(parts[1], 10) || 5;
      const qIndex = parts.indexOf('-q');
      let query = '';
      if (qIndex !== -1 && parts.length > qIndex + 1) {
        query = parts.slice(qIndex + 1).join(' ');
      }
      terminalStore.addLog(`fetching ${count} artworks...`);
      if (query) {
        terminalStore.addLog(`search term: ${query}`);
      }
      searchStore.setFetchParams({ count, query });
    },
    cd: (parts: string[]) => permissionDenied(parts[0]),
    top: () => {
      const topOutput = `
  PID   USER       PR  NI    VIRT    RES    SHR S  %CPU %MEM     TIME+ COMMAND
   1      you      20   0  169444   8684   5980 S   0.0  0.1   0:01.19 coping
  13    urmom      69  69  133337   6969   4200 R  13.3  6.9   1:33.77 receiving
   2     root      20   0       0      0      0 S   0.0  0.0   0:00.00 kthreadd
   3     root       0 -20       0      0      0 I   0.0  0.0   0:00.00 rcu_gp
   4     root       0 -20       0      0      0 I   0.0  0.0   0:00.00 rcu_par_gp
   6     root       0 -20       0      0      0 I   0.0  0.0   0:00.00 kworker/0:0h-kblockd
   9     root      20   0       0      0      0 I   0.0  0.0   0:00.09 kworker/0:1-events
   10    root      20   0       0      0      0 S   0.0  0.0   0:00.00 kdevtmpfs
   11    root       0 -20       0      0      0 I   0.0  0.0   0:00.00 netns
   12    root      20   0       0      0      0 S   0.0  0.0   0:00.00 kauditd
   13    root      20   0    2528    880    740 S   0.0  0.0   0:00.00 auditd
   14    root      20   0  320000   5000   3500 S   0.0  0.0   0:00.10 systemd-journal
   15    guest     20   0  120100   4500   3000 S   0.3  0.2   0:02.50 chrome
   16    guest     20   0  500200  25000  15000 S   1.2  1.5   0:15.00 code
   17    guest     20   0  230000  18000  10000 S   0.8 
`;
      terminalStore.addLog(topOutput);
    },
    pwd: (parts: string[]) => permissionDenied(parts[0]),
    cat: (parts: string[]) => permissionDenied(parts[0]),
    ps: (parts: string[]) => permissionDenied(parts[0]),
  };

  function permissionDenied(command: string) {
    terminalStore.addLog(`bash: ${command}: permission denied`);
  }

  return { commandHandlers };
}
