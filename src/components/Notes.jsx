import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'win95-notes';

function loadNotes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function makeNote() {
  return { id: crypto.randomUUID(), title: 'New Note', body: '', updatedAt: Date.now() };
}

export function Notes() {
  const [notes, setNotes] = useState(loadNotes);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  const selected = notes.find((n) => n.id === selectedId) ?? null;

  const handleNew = useCallback(() => {
    const note = makeNote();
    setNotes((prev) => [note, ...prev]);
    setSelectedId(note.id);
  }, []);

  const handleDelete = useCallback(() => {
    if (!selectedId) return;
    setNotes((prev) => prev.filter((n) => n.id !== selectedId));
    setSelectedId(null);
  }, [selectedId]);

  const handleSelect = useCallback((id) => {
    setSelectedId(id);
  }, []);

  const handleTitleChange = useCallback((e) => {
    const value = e.target.value;
    setNotes((prev) =>
      prev.map((n) =>
        n.id === selectedId ? { ...n, title: value, updatedAt: Date.now() } : n,
      ),
    );
  }, [selectedId]);

  const handleBodyChange = useCallback((e) => {
    const value = e.target.value;
    setNotes((prev) =>
      prev.map((n) =>
        n.id === selectedId ? { ...n, body: value, updatedAt: Date.now() } : n,
      ),
    );
  }, [selectedId]);

  return (
    <div className="notes-app">
      <div
        role="toolbar"
        aria-label="Note actions"
        className="notes-toolbar"
      >
        <button
          type="button"
          className="win-btn notes-toolbar__btn"
          aria-label="New note"
          onClick={handleNew}
        >
          New
        </button>
        <button
          type="button"
          className="win-btn notes-toolbar__btn"
          aria-label="Delete note"
          disabled={!selectedId}
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>

      <div className="notes-body">
        <div
          role="listbox"
          aria-label="Notes"
          className="notes-list"
        >
          {notes.map((note) => (
            <div
              key={note.id}
              role="option"
              aria-selected={note.id === selectedId}
              className={`notes-list__item${note.id === selectedId ? ' notes-list__item--selected' : ''}`}
              onClick={() => handleSelect(note.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleSelect(note.id);
              }}
              tabIndex={0}
            >
              {note.title || 'Untitled'}
            </div>
          ))}
        </div>

        {selected && (
          <div className="notes-editor">
            <input
              className="notes-editor__title"
              aria-label="Title"
              type="text"
              value={selected.title}
              onChange={handleTitleChange}
            />
            <textarea
              className="notes-editor__body"
              aria-label="Body"
              value={selected.body}
              onChange={handleBodyChange}
            />
          </div>
        )}
      </div>

      <div role="status" className="notes-statusbar">
        {notes.length} note{notes.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
