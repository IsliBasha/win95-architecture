export function NotepadAbout() {
  return (
    <>
      <div className="explorer-menubar" role="menubar">
        {['File', 'Edit', 'Format', 'View', 'Help'].map((item) => (
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
      <div className="notepad-body">
        <h2 className="font-bold mb-2" style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem' }}>
          ~/ about win95-desktop
        </h2>
        <p className="mb-2">
          A browser-native Win95 desktop built in React 19. Every window
          is draggable, z-stacked, and tracked by the taskbar. Right-click
          the desktop for a context menu.
        </p>
        <p className="mb-2">
          Open Minesweeper or Snake from the Start menu. Leave it idle
          for 45 seconds — the screensaver kicks in. Find the BSOD trigger
          if you can.
        </p>
        <p>
          Built with React 19, Vite 6, Tailwind CSS v4, and pure CSS for
          all the chrome and animations. 124 tests, 15 test files.
        </p>
      </div>
      <div className="notepad-statusbar">
        <span>about.txt</span>
        <span>UTF-8</span>
      </div>
    </>
  );
}
