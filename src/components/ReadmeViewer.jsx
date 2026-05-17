export function ReadmeViewer() {
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
      <div className="notepad-body" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', lineHeight: 1.6 }}>
        <p className="mb-2 font-bold"># win95-desktop</p>
        <p className="mb-2">
          A browser-native Windows 95 desktop experience built with React 19.
        </p>
        <p className="mb-2 font-bold">## Features</p>
        <p className="mb-1">- Draggable, z-stacked windows with taskbar tracking</p>
        <p className="mb-1">- Start menu with program launcher</p>
        <p className="mb-1">- Right-click desktop context menu</p>
        <p className="mb-1">- Hyperspace screensaver (45s idle trigger)</p>
        <p className="mb-1">- BSOD easter egg</p>
        <p className="mb-1">- Fully playable Minesweeper &amp; Snake</p>
        <p className="mb-1">- Authentic boot splash with CRT overlay</p>
        <p className="mb-2">- Interactive DOS terminal (stack.cmd)</p>
        <p className="mb-2 font-bold">## Stack</p>
        <p className="mb-1">React 19 · Vite 6 · Tailwind CSS v4</p>
        <p className="mb-1">Vitest · Testing Library · jsdom</p>
        <p className="mb-2">124 tests · 15 test files</p>
        <p className="mb-2 font-bold">## License</p>
        <p>MIT</p>
      </div>
      <div className="notepad-statusbar">
        <span>readme.txt</span>
        <span>UTF-8</span>
      </div>
    </>
  );
}
