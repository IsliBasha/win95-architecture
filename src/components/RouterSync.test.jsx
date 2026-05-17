import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { WindowStackProvider } from '../context/WindowStack.jsx';
import { useWindowStack } from '../context/windowStackContext.js';
import { RouterSync } from './RouterSync.jsx';

function Pathname() {
  const { pathname } = useLocation();
  return <output data-testid="pathname">{pathname}</output>;
}

function WindowState({ id }) {
  const { isClosed } = useWindowStack();
  return <output data-testid={`state-${id}`}>{isClosed(id) ? 'closed' : 'open'}</output>;
}

function OpenButton({ id }) {
  const { bringToFront } = useWindowStack();
  return <button type="button" onClick={() => bringToFront(id)}>open {id}</button>;
}

function TestApp({ initialEntries = ['/'] }) {
  return (
    <MemoryRouter initialEntries={initialEntries}>
      <WindowStackProvider
        initialOrder={['about', 'notes']}
        initialClosed={['about', 'notes']}
      >
        <RouterSync />
        <Pathname />
        <WindowState id="about" />
        <WindowState id="notes" />
        <OpenButton id="about" />
        <OpenButton id="notes" />
      </WindowStackProvider>
    </MemoryRouter>
  );
}

describe('RouterSync — URL → window state (mount)', () => {
  it('leaves all windows closed when URL is /', () => {
    render(<TestApp initialEntries={['/']} />);
    expect(screen.getByTestId('state-about')).toHaveTextContent('closed');
    expect(screen.getByTestId('state-notes')).toHaveTextContent('closed');
  });

  it('opens the notes window when URL starts at /notes (second ID)', () => {
    render(<TestApp initialEntries={['/notes']} />);
    expect(screen.getByTestId('state-notes')).toHaveTextContent('open');
  });

  it('opens the notes window when URL starts at /notes', () => {
    render(<TestApp initialEntries={['/notes']} />);
    expect(screen.getByTestId('state-notes')).toHaveTextContent('open');
  });

  it('ignores unknown path segments', () => {
    render(<TestApp initialEntries={['/unknown']} />);
    expect(screen.getByTestId('state-about')).toHaveTextContent('closed');
    expect(screen.getByTestId('state-notes')).toHaveTextContent('closed');
  });
});

describe('RouterSync — window state → URL', () => {
  it('URL stays / when no window is open', () => {
    render(<TestApp initialEntries={['/']} />);
    expect(screen.getByTestId('pathname')).toHaveTextContent('/');
  });

  it('URL updates to /about when about window is opened', async () => {
    const user = userEvent.setup();
    render(<TestApp initialEntries={['/']} />);

    await user.click(screen.getByRole('button', { name: 'open about' }));

    expect(screen.getByTestId('pathname')).toHaveTextContent('/about');
  });

  it('URL updates to /notes when notes window is opened', async () => {
    const user = userEvent.setup();
    render(<TestApp initialEntries={['/']} />);

    await user.click(screen.getByRole('button', { name: 'open notes' }));

    expect(screen.getByTestId('pathname')).toHaveTextContent('/notes');
  });

  it('URL updates when active window switches', async () => {
    const user = userEvent.setup();
    render(<TestApp initialEntries={['/']} />);

    await user.click(screen.getByRole('button', { name: 'open about' }));
    await user.click(screen.getByRole('button', { name: 'open notes' }));

    expect(screen.getByTestId('pathname')).toHaveTextContent('/notes');
  });
});
