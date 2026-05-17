import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StackCmd } from './StackCmd.jsx';

async function cmd(user, text) {
  await user.type(screen.getByRole('textbox'), text);
  await user.keyboard('{Enter}');
}

describe('StackCmd — structure', () => {
  it('renders a terminal log region', () => {
    render(<StackCmd />);
    expect(screen.getByRole('log')).toBeInTheDocument();
  });

  it('shows Windows 95 banner on mount', () => {
    render(<StackCmd />);
    expect(screen.getByRole('log')).toHaveTextContent(/Windows 95/i);
  });

  it('shows a C:\\ prompt on mount', () => {
    render(<StackCmd />);
    expect(screen.getByRole('log')).toHaveTextContent('C:\\>');
  });

  it('does not show personal portfolio content on mount', () => {
    render(<StackCmd />);
    const text = screen.getByRole('log').textContent;
    expect(text).not.toMatch(/ISLI/);
    expect(text).not.toMatch(/Tirana|Albania/);
  });

  it('does not pre-render the tech stack on mount', () => {
    render(<StackCmd />);
    const text = screen.getByRole('log').textContent;
    expect(text).not.toMatch(/React|Vite|Vitest|TypeScript/);
  });
});

describe('StackCmd — commands', () => {
  it('ver outputs the Windows 95 version string', async () => {
    const user = userEvent.setup();
    render(<StackCmd />);
    await cmd(user, 'ver');
    expect(screen.getByRole('log')).toHaveTextContent(/Windows 95/i);
  });

  it('dir at root lists WINDOWS directory', async () => {
    const user = userEvent.setup();
    render(<StackCmd />);
    await cmd(user, 'dir');
    expect(screen.getByRole('log')).toHaveTextContent('WINDOWS');
  });

  it('dir at root lists standard system files', async () => {
    const user = userEvent.setup();
    render(<StackCmd />);
    await cmd(user, 'dir');
    const log = screen.getByRole('log');
    expect(log).toHaveTextContent(/AUTOEXEC/i);
    expect(log).toHaveTextContent(/CONFIG/i);
  });

  it('cls clears all terminal output', async () => {
    const user = userEvent.setup();
    render(<StackCmd />);
    await cmd(user, 'cls');
    expect(screen.getByRole('log')).not.toHaveTextContent(/Windows 95/i);
  });

  it('help lists DIR, CLS, HELP and VER', async () => {
    const user = userEvent.setup();
    render(<StackCmd />);
    await cmd(user, 'help');
    const log = screen.getByRole('log');
    expect(log).toHaveTextContent('DIR');
    expect(log).toHaveTextContent('CLS');
    expect(log).toHaveTextContent('HELP');
    expect(log).toHaveTextContent('VER');
  });

  it('echo outputs the given text', async () => {
    const user = userEvent.setup();
    render(<StackCmd />);
    await cmd(user, 'echo hello windows 95');
    expect(screen.getByRole('log')).toHaveTextContent('hello windows 95');
  });

  it('unknown command shows not-recognized error', async () => {
    const user = userEvent.setup();
    render(<StackCmd />);
    await cmd(user, 'blorp');
    expect(screen.getByRole('log')).toHaveTextContent(/not recognized/i);
  });

  it('cd WINDOWS changes the prompt to C:\\WINDOWS>', async () => {
    const user = userEvent.setup();
    render(<StackCmd />);
    await cmd(user, 'cd WINDOWS');
    expect(screen.getByRole('log')).toHaveTextContent('C:\\WINDOWS>');
  });

  it('cd .. from WINDOWS returns to C:\\>', async () => {
    const user = userEvent.setup();
    render(<StackCmd />);
    await cmd(user, 'cd WINDOWS');
    await cmd(user, 'cd ..');
    expect(screen.getByRole('log')).toHaveTextContent('C:\\>');
  });

  it('cd into unknown directory shows error', async () => {
    const user = userEvent.setup();
    render(<StackCmd />);
    await cmd(user, 'cd FAKEPLACE');
    expect(screen.getByRole('log')).toHaveTextContent(/cannot find/i);
  });

  it('dir inside WINDOWS shows SYSTEM directory', async () => {
    const user = userEvent.setup();
    render(<StackCmd />);
    await cmd(user, 'cd WINDOWS');
    await cmd(user, 'dir');
    expect(screen.getByRole('log')).toHaveTextContent('SYSTEM');
  });
});
