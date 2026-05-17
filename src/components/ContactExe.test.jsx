import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ContactExe } from './ContactExe.jsx';

describe('ContactExe — demo branch', () => {
  it('renders a menubar', () => {
    render(<ContactExe />);
    expect(screen.getByRole('menubar')).toBeInTheDocument();
  });

  it('does not show a personal email address', () => {
    render(<ContactExe />);
    expect(screen.queryByText(/islibasha1@gmail\.com/i)).not.toBeInTheDocument();
  });

  it('does not show a LinkedIn link', () => {
    render(<ContactExe />);
    expect(screen.queryByRole('link', { name: /linkedin/i })).not.toBeInTheDocument();
  });

  it('links to the GitHub source repository', () => {
    render(<ContactExe />);
    const links = screen.getAllByRole('link');
    const githubLink = links.find((l) => l.href.includes('github.com'));
    expect(githubLink).toBeDefined();
  });

  it('does not contain a message textarea (no contact form)', () => {
    render(<ContactExe />);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('shows a Ready status bar', () => {
    render(<ContactExe />);
    expect(screen.getByText(/ready/i)).toBeInTheDocument();
  });
});
