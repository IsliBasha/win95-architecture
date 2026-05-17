import { afterEach, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App.jsx';

afterEach(() => {
  window.location.hash = '';
});

describe('App game desktop icons', () => {
  it('shows minesweeper and snake icons on the desktop', () => {
    render(<App />);
    expect(
      screen.getByRole('button', { name: /minesweeper\.exe/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /snake\.exe/i }),
    ).toBeInTheDocument();
  });

  it('does not render the minesweeper or snake windows on load', () => {
    render(<App />);
    expect(
      screen.queryByRole('region', { name: /minesweeper\.exe/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('region', { name: /snake\.exe/i }),
    ).not.toBeInTheDocument();
  });

  it('opens the minesweeper window only after its icon is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      screen.getByRole('button', { name: /minesweeper\.exe/i }),
    );

    expect(
      screen.getByRole('region', { name: /minesweeper\.exe/i }),
    ).toBeInTheDocument();
  });

  it('opens the snake window only after its icon is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /snake\.exe/i }));

    expect(
      screen.getByRole('region', { name: /snake\.exe/i }),
    ).toBeInTheDocument();
  });
});

describe('App initial desktop state', () => {
  it('does not render any of the content windows on load', () => {
    render(<App />);
    expect(
      screen.queryByRole('region', { name: 'projects' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('region', { name: 'stack.cmd' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('region', { name: 'email.exe' }),
    ).not.toBeInTheDocument();
  });

  it('renders a stack.cmd icon on the desktop', () => {
    render(<App />);
    expect(
      screen.getByRole('button', { name: 'stack.cmd' }),
    ).toBeInTheDocument();
  });

  it('opens the stack window only after the stack.cmd icon is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'stack.cmd' }));
    expect(
      screen.getByRole('region', { name: 'stack.cmd' }),
    ).toBeInTheDocument();
  });
});

describe('App desktop labels', () => {
  it('labels desktop icons with the correct filenames', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: 'projects' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'stack.cmd' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'projects.exe' })).not.toBeInTheDocument();
  });
});

describe('Menu bar items — decorative only', () => {
  it('clicking a menu item in the projects window does not open a dialog', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'projects' }));
    const [first] = screen.getAllByRole('menuitem');
    await user.click(first);
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('clicking a menu item in the contact window does not open a dialog', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'email.exe' }));
    const [first] = screen.getAllByRole('menuitem');
    await user.click(first);
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('clicking a menu item in the readme window does not open a dialog', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'readme.txt' }));
    const [first] = screen.getAllByRole('menuitem');
    await user.click(first);
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });
});

describe('Desktop icon — paint.exe', () => {
  it('renders a paint.exe icon on the desktop', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: 'paint.exe' })).toBeInTheDocument();
  });

  it('opens the paint window when the paint.exe icon is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'paint.exe' }));
    expect(screen.getByRole('region', { name: /paint\.exe/i })).toBeInTheDocument();
  });
});

describe('Desktop icon — readme.txt opens window', () => {
  it('readme.txt icon is a button (not a link) and opens the readme window', async () => {
    const user = userEvent.setup();
    render(<App />);
    const icon = screen.getByRole('button', { name: 'readme.txt' });
    expect(icon).toBeInTheDocument();
    await user.click(icon);
    expect(
      screen.getByRole('region', { name: /readme\.txt/i }),
    ).toBeInTheDocument();
  });
});
