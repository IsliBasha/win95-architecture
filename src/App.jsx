import { useCallback, useState } from 'react';
import { HashRouter } from 'react-router-dom';
import { WindowStackProvider } from './context/WindowStack.jsx';
import { RouterSync } from './components/RouterSync.jsx';
import { Window } from './components/Window.jsx';
import { Taskbar } from './components/Taskbar.jsx';
import { DesktopIcon } from './components/DesktopIcon.jsx';
import { ProjectCard } from './components/ProjectCard.jsx';
import { StackCmd } from './components/StackCmd.jsx';
import { Paint } from './components/Paint.jsx';
import { Minesweeper } from './components/Minesweeper.jsx';
import { Snake } from './components/Snake.jsx';
import { BSOD } from './components/BSOD.jsx';
import { BootSequence } from './components/BootSequence.jsx';
import { Screensaver } from './components/Screensaver.jsx';
import { ContextMenu } from './components/ContextMenu.jsx';
import { NotepadAbout } from './components/NotepadAbout.jsx';
import { ContactExe } from './components/ContactExe.jsx';
import { IExplorer } from './components/IExplorer.jsx';
import { Notes } from './components/Notes.jsx';
import { ReadmeViewer } from './components/ReadmeViewer.jsx';
import { useInactivity } from './hooks/useInactivity.js';
import { projects } from './data/projects.js';

const WINDOW_ORDER = [
  'about',
  'projects',
  'stack',
  'contact',
  'readme',
  'minesweeper',
  'snake',
  'paint',
  'ie',
  'notes',
];
const INITIALLY_CLOSED = [
  'about',
  'projects',
  'stack',
  'contact',
  'readme',
  'minesweeper',
  'snake',
  'paint',
  'ie',
  'notes',
];

const ICONS = [
  { kind: 'about',       label: 'about.txt',       target: 'about'       },
  { kind: 'projects',    label: 'projects',         target: 'projects'    },
  { kind: 'stack',       label: 'stack.cmd',        target: 'stack'       },
  { kind: 'contact',     label: 'email.exe',        target: 'contact'     },
  { kind: 'resume',      label: 'readme.txt',       target: 'readme'      },
  { kind: 'minesweeper', label: 'minesweeper.exe',  target: 'minesweeper' },
  { kind: 'snake',       label: 'snake.exe',        target: 'snake'       },
  { kind: 'paint',       label: 'paint.exe',        target: 'paint'       },
  { kind: 'ie',          label: 'iexplore.exe',     target: 'ie'          },
  { kind: 'notes',       label: 'notes.exe',        target: 'notes'       },
];

const ICON_H = 80;
const ICON_COL_W = 80;
const ICON_MARGIN = 16;

function iconPos(index) {
  const viewH = typeof window !== 'undefined' ? (window.innerHeight || 800) : 800;
  const perCol = Math.max(1, Math.floor((viewH - 40 - ICON_MARGIN) / ICON_H));
  return {
    x: ICON_MARGIN + Math.floor(index / perCol) * ICON_COL_W,
    y: ICON_MARGIN + (index % perCol) * ICON_H,
  };
}

function ProjectsExplorer({ projects: projectList }) {
  return (
    <>
      <div className="explorer-menubar" role="menubar">
        {['File', 'Edit', 'View', 'Help'].map((item) => (
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
      <div className="explorer-address-bar">
        <span className="explorer-address-label">Address</span>
        <div
          className="explorer-address-field"
          aria-label="Current location: C:\WIN95\FEATURES"
        >
          C:\WIN95\FEATURES
        </div>
      </div>
      <div className="explorer-body">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {projectList.map((p) => (
            <ProjectCard
              key={p.id}
              name={p.name}
              description={p.description}
              stack={p.stack}
              href={p.href}
              iconType={p.iconType}
            />
          ))}
        </div>
      </div>
      <div className="explorer-statusbar">{projectList.length} object(s)</div>
    </>
  );
}

function App() {
  const [screensaverOn, setScreensaverOn] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);

  const activateScreensaver = useCallback(() => setScreensaverOn(true), []);
  useInactivity(45_000, activateScreensaver);

  const handleContextMenu = useCallback((e) => {
    if (e.target.closest('.win95-window')) return;
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  }, []);

  return (
    <HashRouter>
    <WindowStackProvider
      initialOrder={WINDOW_ORDER}
      initialClosed={INITIALLY_CLOSED}
    >
      <RouterSync />
      {screensaverOn && (
        <Screensaver onDismiss={() => setScreensaverOn(false)} />
      )}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
        />
      )}
      <a href="#projects" className="skip-link">
        Skip to projects
      </a>
      <main className="desktop-area" onContextMenu={handleContextMenu}>
        <div className="desktop-icons" aria-label="Desktop shortcuts">
          {ICONS.map(({ kind, label, target }, i) => (
            <DesktopIcon
              key={target}
              kind={kind}
              label={label}
              target={target}
              defaultPos={iconPos(i)}
            />
          ))}
        </div>

        <Window
          id="about"
          title="about.txt"
          className="win-about"
          bootDelayMs={0}
          contentClassName="win-about__content"
        >
          <NotepadAbout />
        </Window>

        <Window
          id="projects"
          title="projects"
          className="win-projects"
          bootDelayMs={120}
          contentClassName="win-projects__content"
        >
          <ProjectsExplorer projects={projects} />
        </Window>

        <Window
          id="stack"
          title="stack.cmd"
          className="win-stack"
          bootDelayMs={240}
          contentClassName="win-stack__content"
        >
          <StackCmd />
        </Window>

        <Window
          id="contact"
          title="email.exe"
          className="win-contact"
          bootDelayMs={360}
          contentClassName="win-contact__content"
        >
          <ContactExe />
        </Window>

        <Window
          id="readme"
          title="readme.txt"
          className="win-resume"
          bootDelayMs={0}
          contentClassName="win-resume__content"
        >
          <ReadmeViewer />
        </Window>

        <Window
          id="minesweeper"
          title="minesweeper.exe"
          className="win-minesweeper"
          bootDelayMs={0}
          contentClassName="win-minesweeper__content"
        >
          <Minesweeper />
        </Window>

        <Window
          id="snake"
          title="snake.exe"
          className="win-snake"
          bootDelayMs={0}
          contentClassName="win-snake__content"
        >
          <Snake />
        </Window>

        <Window
          id="paint"
          title="paint.exe"
          className="win-paint"
          bootDelayMs={0}
          contentClassName="win-paint__content"
        >
          <Paint />
        </Window>

        <Window
          id="ie"
          title="Internet Explorer"
          className="win-ie"
          bootDelayMs={0}
          contentClassName="win-ie__content"
        >
          <IExplorer />
        </Window>

        <Window
          id="notes"
          title="notes.exe"
          className="win-notes"
          bootDelayMs={0}
          contentClassName="win-notes__content"
        >
          <Notes />
        </Window>
      </main>
      <Taskbar />
      <BSOD />
      <BootSequence />
    </WindowStackProvider>
    </HashRouter>
  );
}

export default App;
