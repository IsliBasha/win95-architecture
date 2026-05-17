import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWindowStack } from '../context/windowStackContext.js';

const WINDOW_IDS = new Set([
  'projects', 'stack', 'contact', 'readme',
  'minesweeper', 'snake', 'paint', 'ie', 'notes',
]);

export function RouterSync() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { bringToFront, openWindows } = useWindowStack();

  // On mount: open the window named in the URL
  useEffect(() => {
    const id = pathname.replace(/^\//, '');
    if (id && WINDOW_IDS.has(id)) {
      bringToFront(id);
    }
  // Only run on mount — intentionally ignoring deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep URL in sync with the active window
  useEffect(() => {
    const active = openWindows.find((w) => w.active && !w.hidden);
    const next = active ? `/${active.id}` : '/';
    if (pathname !== next) {
      navigate(next, { replace: true });
    }
  }, [openWindows, navigate, pathname]);

  return null;
}
