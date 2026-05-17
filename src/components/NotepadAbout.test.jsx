import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NotepadAbout } from './NotepadAbout.jsx';

describe('NotepadAbout — demo branch', () => {
  it('renders the about.txt label in the status bar', () => {
    render(<NotepadAbout />);
    expect(screen.getByText('about.txt')).toBeInTheDocument();
  });

  it('renders a notepad menubar', () => {
    render(<NotepadAbout />);
    expect(screen.getByRole('menubar')).toBeInTheDocument();
  });

  it('describes the Win95 Desktop project (not a personal portfolio)', () => {
    render(<NotepadAbout />);
    expect(screen.getAllByText(/win95/i).length).toBeGreaterThan(0);
  });

  it('does not mention Tirana or Albania (no personal location)', () => {
    render(<NotepadAbout />);
    expect(screen.queryByText(/Tirana/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Albania/i)).not.toBeInTheDocument();
  });

  it('does not mention edge computing as a personal interest', () => {
    render(<NotepadAbout />);
    expect(screen.queryByText(/edge computing/i)).not.toBeInTheDocument();
  });
});
