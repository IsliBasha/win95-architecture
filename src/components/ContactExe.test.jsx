import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactExe } from './ContactExe.jsx';

describe('ContactExe — email app structure', () => {
  it('renders a menubar', () => {
    render(<ContactExe />);
    expect(screen.getByRole('menubar')).toBeInTheDocument();
  });

  it('renders a mail toolbar', () => {
    render(<ContactExe />);
    expect(screen.getByRole('toolbar')).toBeInTheDocument();
  });

  it('renders an Inbox folder in the sidebar', () => {
    render(<ContactExe />);
    expect(screen.getByRole('button', { name: /inbox/i })).toBeInTheDocument();
  });

  it('renders an email list (listbox)', () => {
    render(<ContactExe />);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('shows at least 3 emails in the inbox', () => {
    render(<ContactExe />);
    expect(screen.getAllByRole('option').length).toBeGreaterThanOrEqual(3);
  });

  it('shows a status bar', () => {
    render(<ContactExe />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('status bar shows unread count on mount', () => {
    render(<ContactExe />);
    expect(screen.getByRole('status')).toHaveTextContent(/unread/i);
  });
});

describe('ContactExe — email interaction', () => {
  it('clicking an email shows a reading pane', async () => {
    const user = userEvent.setup();
    render(<ContactExe />);
    await user.click(screen.getAllByRole('option')[0]);
    expect(screen.getByRole('article')).toBeInTheDocument();
  });

  it('reading pane has non-empty content after selecting an email', async () => {
    const user = userEvent.setup();
    render(<ContactExe />);
    await user.click(screen.getAllByRole('option')[0]);
    expect(screen.getByRole('article').textContent.trim().length).toBeGreaterThan(0);
  });

  it('clicking a different email switches the reading pane', async () => {
    const user = userEvent.setup();
    render(<ContactExe />);
    const options = screen.getAllByRole('option');
    await user.click(options[0]);
    const firstBody = screen.getByRole('article').textContent;
    await user.click(options[1]);
    const secondBody = screen.getByRole('article').textContent;
    expect(firstBody).not.toBe(secondBody);
  });

  it('selected email has aria-selected=true', async () => {
    const user = userEvent.setup();
    render(<ContactExe />);
    const options = screen.getAllByRole('option');
    await user.click(options[1]);
    expect(options[1]).toHaveAttribute('aria-selected', 'true');
    expect(options[0]).toHaveAttribute('aria-selected', 'false');
  });

  it('email list shows a From column header', () => {
    render(<ContactExe />);
    expect(screen.getByRole('columnheader', { name: /from/i })).toBeInTheDocument();
  });
});

describe('ContactExe — content constraints', () => {
  it('does not show a personal email address', () => {
    render(<ContactExe />);
    expect(screen.queryByText(/islibasha1@gmail\.com/i)).not.toBeInTheDocument();
  });

  it('does not show a LinkedIn link', () => {
    render(<ContactExe />);
    expect(screen.queryByRole('link', { name: /linkedin/i })).not.toBeInTheDocument();
  });

  it('does not contain a message compose textarea', () => {
    render(<ContactExe />);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
});
