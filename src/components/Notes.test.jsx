import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Notes } from './Notes.jsx';

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
});

describe('Notes — structure', () => {
  it('renders a toolbar with New and Delete buttons', () => {
    render(<Notes />);
    const toolbar = screen.getByRole('toolbar', { name: /note actions/i });
    expect(within(toolbar).getByRole('button', { name: /new note/i })).toBeInTheDocument();
    expect(within(toolbar).getByRole('button', { name: /delete note/i })).toBeInTheDocument();
  });

  it('renders a listbox for notes', () => {
    render(<Notes />);
    expect(screen.getByRole('listbox', { name: /notes/i })).toBeInTheDocument();
  });

  it('renders a status bar', () => {
    render(<Notes />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('Delete button is disabled when no note is selected', () => {
    render(<Notes />);
    expect(screen.getByRole('button', { name: /delete note/i })).toBeDisabled();
  });

  it('does not render the editor when no note is selected', () => {
    render(<Notes />);
    expect(screen.queryByRole('textbox', { name: /title/i })).not.toBeInTheDocument();
  });
});

describe('Notes — create', () => {
  it('clicking New adds a note option to the list', async () => {
    const user = userEvent.setup();
    render(<Notes />);

    await user.click(screen.getByRole('button', { name: /new note/i }));

    expect(screen.getAllByRole('option')).toHaveLength(1);
  });

  it('clicking New twice adds two notes', async () => {
    const user = userEvent.setup();
    render(<Notes />);

    await user.click(screen.getByRole('button', { name: /new note/i }));
    await user.click(screen.getByRole('button', { name: /new note/i }));

    expect(screen.getAllByRole('option')).toHaveLength(2);
  });

  it('status bar updates after creating a note', async () => {
    const user = userEvent.setup();
    render(<Notes />);

    await user.click(screen.getByRole('button', { name: /new note/i }));

    expect(screen.getByRole('status')).toHaveTextContent('1');
  });
});

describe('Notes — read / select', () => {
  it('clicking a note shows the editor', async () => {
    const user = userEvent.setup();
    render(<Notes />);

    await user.click(screen.getByRole('button', { name: /new note/i }));
    const [option] = screen.getAllByRole('option');
    await user.click(option);

    expect(screen.getByRole('textbox', { name: /title/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /body/i })).toBeInTheDocument();
  });

  it('selected note has aria-selected=true', async () => {
    const user = userEvent.setup();
    render(<Notes />);

    await user.click(screen.getByRole('button', { name: /new note/i }));
    const [option] = screen.getAllByRole('option');
    await user.click(option);

    expect(option).toHaveAttribute('aria-selected', 'true');
  });

  it('no editor shown when list is empty', () => {
    render(<Notes />);
    expect(screen.queryByRole('textbox', { name: /title/i })).not.toBeInTheDocument();
  });
});

describe('Notes — update', () => {
  it('editing the title updates the option label in the list', async () => {
    const user = userEvent.setup();
    render(<Notes />);

    await user.click(screen.getByRole('button', { name: /new note/i }));
    const [option] = screen.getAllByRole('option');
    await user.click(option);

    const titleInput = screen.getByRole('textbox', { name: /title/i });
    await user.clear(titleInput);
    await user.type(titleInput, 'My First Note');

    expect(screen.getByRole('option', { name: /my first note/i })).toBeInTheDocument();
  });

  it('editing the body updates the textarea value', async () => {
    const user = userEvent.setup();
    render(<Notes />);

    await user.click(screen.getByRole('button', { name: /new note/i }));
    const [option] = screen.getAllByRole('option');
    await user.click(option);

    const body = screen.getByRole('textbox', { name: /body/i });
    await user.type(body, 'Hello World');

    expect(body).toHaveValue('Hello World');
  });
});

describe('Notes — delete', () => {
  it('Delete button is enabled when a note is selected', async () => {
    const user = userEvent.setup();
    render(<Notes />);

    await user.click(screen.getByRole('button', { name: /new note/i }));
    const [option] = screen.getAllByRole('option');
    await user.click(option);

    expect(screen.getByRole('button', { name: /delete note/i })).toBeEnabled();
  });

  it('deleting a note removes it from the list', async () => {
    const user = userEvent.setup();
    render(<Notes />);

    await user.click(screen.getByRole('button', { name: /new note/i }));
    const [option] = screen.getAllByRole('option');
    await user.click(option);
    await user.click(screen.getByRole('button', { name: /delete note/i }));

    expect(screen.queryAllByRole('option')).toHaveLength(0);
  });

  it('editor closes after deleting the only note', async () => {
    const user = userEvent.setup();
    render(<Notes />);

    await user.click(screen.getByRole('button', { name: /new note/i }));
    const [option] = screen.getAllByRole('option');
    await user.click(option);
    await user.click(screen.getByRole('button', { name: /delete note/i }));

    expect(screen.queryByRole('textbox', { name: /title/i })).not.toBeInTheDocument();
  });

  it('status bar shows 0 after all notes deleted', async () => {
    const user = userEvent.setup();
    render(<Notes />);

    await user.click(screen.getByRole('button', { name: /new note/i }));
    const [option] = screen.getAllByRole('option');
    await user.click(option);
    await user.click(screen.getByRole('button', { name: /delete note/i }));

    expect(screen.getByRole('status')).toHaveTextContent('0');
  });
});

describe('Notes — localStorage', () => {
  it('saves notes to localStorage when a note is created', async () => {
    const user = userEvent.setup();
    render(<Notes />);

    await user.click(screen.getByRole('button', { name: /new note/i }));

    const stored = JSON.parse(localStorage.getItem('win95-notes') || '[]');
    expect(stored).toHaveLength(1);
  });

  it('loads existing notes from localStorage on mount', () => {
    const seed = [
      { id: 'abc', title: 'Saved Note', body: 'Persisted body', updatedAt: Date.now() },
    ];
    localStorage.setItem('win95-notes', JSON.stringify(seed));

    render(<Notes />);

    expect(screen.getByRole('option', { name: /saved note/i })).toBeInTheDocument();
  });

  it('persists the win95-notes key in localStorage', async () => {
    const user = userEvent.setup();
    render(<Notes />);

    await user.click(screen.getByRole('button', { name: /new note/i }));

    expect(localStorage.getItem('win95-notes')).not.toBeNull();
  });
});
