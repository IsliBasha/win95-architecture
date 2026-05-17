import { useCallback, useEffect, useRef, useState } from 'react';

const FS = {
  '': {
    dirs: ['WINDOWS', 'PROGRA~1', 'TEMP'],
    files: ['AUTOEXEC.BAT', 'CONFIG.SYS', 'IO.SYS', 'MSDOS.SYS'],
  },
  'WINDOWS': {
    dirs: ['SYSTEM', 'FONTS', 'TEMP', 'MEDIA'],
    files: ['EXPLORER.EXE', 'NOTEPAD.EXE', 'REGEDIT.EXE', 'WIN.INI', 'SYSTEM.INI'],
  },
  'WINDOWS\\SYSTEM': {
    dirs: [],
    files: ['KERNEL32.DLL', 'USER32.DLL', 'GDI32.DLL', 'SHELL32.DLL'],
  },
  'WINDOWS\\FONTS': {
    dirs: [],
    files: ['ARIAL.TTF', 'TIMES.TTF', 'COURIER.TTF', 'COMIC.TTF'],
  },
  'WINDOWS\\TEMP': { dirs: [], files: [] },
  'WINDOWS\\MEDIA': {
    dirs: [],
    files: ['CHIMES.WAV', 'CHORD.WAV', 'DING.WAV', 'TADA.WAV'],
  },
  'PROGRA~1': {
    dirs: ['ACCESSORI', 'INTERNET'],
    files: [],
  },
  'PROGRA~1\\ACCESSORI': {
    dirs: [],
    files: ['CALC.EXE', 'MSPAINT.EXE', 'WORDPAD.EXE'],
  },
  'PROGRA~1\\INTERNET': {
    dirs: [],
    files: ['IEXPLORE.EXE'],
  },
  'TEMP': { dirs: [], files: [] },
};

const FILE_CONTENT = {
  'AUTOEXEC.BAT': [
    '@ECHO OFF',
    'PATH C:\\WINDOWS;C:\\WINDOWS\\COMMAND',
    'PROMPT $p$g',
    'SET TEMP=C:\\TEMP',
    'SET TMP=C:\\TEMP',
  ].join('\r\n'),
  'CONFIG.SYS': [
    'DEVICE=C:\\WINDOWS\\HIMEM.SYS',
    'DEVICE=C:\\WINDOWS\\EMM386.EXE NOEMS',
    'BUFFERS=40',
    'FILES=80',
    'DOS=HIGH,UMB',
    'LASTDRIVE=E',
  ].join('\r\n'),
  'WIN.INI': [
    '[windows]',
    'load=',
    'run=',
    'Beep=yes',
    'NullPort=None',
    '[Desktop]',
    'Wallpaper=(None)',
    'TileWallpaper=0',
  ].join('\r\n'),
};

function getPrompt(cwd) {
  return cwd ? `C:\\${cwd}>` : 'C:\\>';
}

function dirOutput(cwd) {
  const entry = FS[cwd] ?? { dirs: [], files: [] };
  const path = cwd ? `C:\\${cwd}` : 'C:\\';
  return [
    ` Volume in drive C is WIN95`,
    ` Volume Serial Number is 1995-0814`,
    ``,
    ` Directory of ${path}`,
    ``,
    `.                    <DIR>`,
    `..                   <DIR>`,
    ...entry.dirs.map((d) => `${d.padEnd(21)}<DIR>`),
    ...entry.files,
    ``,
    `       ${entry.dirs.length + 2} Dir(s)   ${entry.files.length} File(s)`,
  ].join('\n');
}

function treeOutput(cwd, indent = '') {
  const entry = FS[cwd] ?? { dirs: [], files: [] };
  const lines = [];
  entry.dirs.forEach((d, i) => {
    const isLast = i === entry.dirs.length - 1 && entry.files.length === 0;
    lines.push(`${indent}${isLast ? '└───' : '├───'}${d}`);
    const childKey = cwd ? `${cwd}\\${d}` : d;
    lines.push(...treeOutput(childKey, indent + (isLast ? '    ' : '│   ')));
  });
  return lines;
}

function processCommand(raw, cwd) {
  const trimmed = raw.trim();
  if (!trimmed) return { output: '' };

  const [cmd, ...rest] = trimmed.split(/\s+/);
  const arg = rest.join(' ');

  switch (cmd.toLowerCase()) {
    case 'cls':
      return { clear: true };

    case 'ver':
      return { output: '\nMicrosoft(R) Windows 95\n   (C)Copyright Microsoft Corp 1981-1995.\n' };

    case 'dir':
      return { output: dirOutput(cwd) };

    case 'cd': {
      if (!arg || arg === '\\' || arg === '/') return { output: '', newCwd: '' };
      if (arg === '..') {
        const parent = cwd.includes('\\') ? cwd.slice(0, cwd.lastIndexOf('\\')) : '';
        return { output: '', newCwd: parent };
      }
      const target = cwd ? `${cwd}\\${arg.toUpperCase()}` : arg.toUpperCase();
      if (target in FS) return { output: '', newCwd: target };
      return { output: 'The system cannot find the path specified.' };
    }

    case 'help':
      return {
        output: [
          'For more information on a specific command, type HELP command-name',
          '',
          'CD       Displays the name of or changes the current directory.',
          'CLS      Clears the screen.',
          'DATE     Displays or sets the date.',
          'DIR      Displays a list of files and subdirectories in a directory.',
          'ECHO     Displays messages, or turns command-echoing on or off.',
          'HELP     Provides Help information for Windows commands.',
          'MEM      Displays the amount of used and free memory.',
          'TIME     Displays or sets the system time.',
          'TREE     Graphically displays the folder structure.',
          'TYPE     Displays the contents of a text file.',
          'VER      Displays the Windows version.',
        ].join('\n'),
      };

    case 'echo':
      return { output: arg || '' };

    case 'date': {
      const d = new Date();
      const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
      return {
        output: `Current date is ${day} ${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}-${d.getFullYear()}`,
      };
    }

    case 'time': {
      const t = new Date();
      return {
        output: `Current time is ${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}:${String(t.getSeconds()).padStart(2, '0')}.${String(t.getMilliseconds()).padStart(2, '0').slice(0, 2)}`,
      };
    }

    case 'mem':
      return {
        output: [
          '',
          'Memory Type        Total     Used    Free',
          '--------------  --------  ------  ------',
          'Conventional         640K    121K    519K',
          'Upper                 63K     55K      8K',
          'Extended (XMS)    64,512K     0K  64,512K',
          '--------------  --------  ------  ------',
          'Total memory      65,215K    176K  65,039K',
          '',
          'Largest executable program size    519K (531,424 bytes)',
          'MS-DOS is resident in the high memory area.',
        ].join('\n'),
      };

    case 'tree': {
      const path = cwd ? `C:\\${cwd}` : 'C:\\';
      return {
        output: [
          `Folder PATH listing for volume WIN95`,
          `Volume serial number is 1995-0814`,
          `${path}`,
          ...treeOutput(cwd),
        ].join('\n'),
      };
    }

    case 'type': {
      const name = arg.toUpperCase();
      if (name in FILE_CONTENT) return { output: FILE_CONTENT[name] };
      return { output: `File not found - ${arg || '(none)'}` };
    }

    default:
      return {
        output: `'${cmd}' is not recognized as an internal or external command,\noperable program or batch file.`,
      };
  }
}

const INITIAL_LINES = [
  'Microsoft(R) Windows 95',
  '   (C)Copyright Microsoft Corp 1981-1995.',
  '',
];

export function StackCmd() {
  const [lines, setLines] = useState(INITIAL_LINES);
  const [input, setInput] = useState('');
  const [cwd, setCwd] = useState('');
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  const outputRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const el = outputRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const runCommand = useCallback(
    (raw) => {
      const result = processCommand(raw, cwd);

      if (result.clear) {
        setLines([]);
      } else {
        setLines((prev) => [
          ...prev,
          `${getPrompt(cwd)}${raw}`,
          ...(result.output ? result.output.split('\n') : []),
        ]);
      }

      if (result.newCwd !== undefined) setCwd(result.newCwd);

      setHistoryIdx(-1);
      if (raw.trim()) setCmdHistory((prev) => [raw.trim(), ...prev]);
      setInput('');
    },
    [cwd],
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        runCommand(input);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const nextIdx = Math.min(historyIdx + 1, cmdHistory.length - 1);
        if (nextIdx >= 0) {
          setHistoryIdx(nextIdx);
          setInput(cmdHistory[nextIdx]);
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIdx = historyIdx - 1;
        setHistoryIdx(Math.max(nextIdx, -1));
        setInput(nextIdx < 0 ? '' : cmdHistory[nextIdx]);
      }
    },
    [input, cmdHistory, historyIdx, runCommand],
  );

  return (
    <>
      <div className="explorer-menubar" role="menubar">
        {['Edit', 'View', 'Help'].map((item) => (
          <button
            key={item}
            type="button"
            className="explorer-menu-item"
            role="menuitem"
          >
            {item}
          </button>
        ))}
      </div>
      <div
        ref={outputRef}
        className="stack-cmd__output"
        onClick={() => inputRef.current?.focus()}
        aria-label="Terminal. Type help for available commands."
        role="log"
        aria-live="polite"
      >
        {lines.map((line, i) => (
          <div key={i} className="stack-cmd__line">
            {line || ' '}
          </div>
        ))}
        <div className="stack-cmd__prompt-row">
          <span className="stack-cmd__prompt" aria-hidden="true">
            {getPrompt(cwd)}
          </span>
          <input
            ref={inputRef}
            className="stack-cmd__input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-label={`Terminal prompt: ${getPrompt(cwd)}`}
          />
        </div>
      </div>
    </>
  );
}
