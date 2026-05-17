import { useState } from 'react';

const INBOX = [
  {
    id: 1,
    from: 'Bill Gates',
    subject: 'Welcome to Windows 95!',
    date: 'Aug 24, 1995',
    body: `Dear User,

We are thrilled to bring you Windows 95 — the most advanced
personal computer operating system ever created.

With Windows 95, you get a whole new way to work. The Start
button puts everything at your fingertips, and the taskbar
keeps your open programs just a click away.

Enjoy the ride!

Best regards,
Bill Gates
Microsoft Corporation`,
  },
  {
    id: 2,
    from: 'Tech Support',
    subject: 'Paint.exe diagnostics passed',
    date: 'Sep 13, 1995',
    body: `Hello,

Your Paint application passed all diagnostics.
The pencil, eraser, fill, line, rect and ellipse tools
are fully operational.

Thank you for using Windows 95.

— Windows 95 Technical Support`,
  },
  {
    id: 3,
    from: 'Clippy',
    subject: "It looks like you're writing code",
    date: 'Sep 15, 1995',
    body: `Hi there!

It looks like you're building a Win95 desktop simulation.
Would you like help with that?

[ ] Get help writing the code
[ ] Just type the code myself
[x] Stop bothering me

— Clippy
   Microsoft Office Assistant`,
  },
];

const INITIALLY_UNREAD = new Set([2, 3]);

const TOOLBAR_BUTTONS = ['New', 'Reply', 'Forward', 'Delete'];

export function ContactExe() {
  const [selected, setSelected] = useState(null);
  const [readIds, setReadIds] = useState(
    () => new Set(INBOX.filter((e) => !INITIALLY_UNREAD.has(e.id)).map((e) => e.id)),
  );

  const unreadCount = INBOX.filter((e) => !readIds.has(e.id)).length;

  const handleSelect = (email) => {
    setSelected(email);
    setReadIds((prev) => new Set([...prev, email.id]));
  };

  return (
    <>
      <div className="explorer-menubar" role="menubar">
        {['File', 'Edit', 'View', 'Help'].map((item) => (
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

      <div className="mail-toolbar" role="toolbar" aria-label="Mail actions">
        {TOOLBAR_BUTTONS.map((label) => (
          <button key={label} type="button" className="win-btn mail-toolbar__btn">
            {label}
          </button>
        ))}
      </div>

      <div className="mail-layout">
        <nav className="mail-folders" aria-label="Mail folders">
          <button type="button" className="mail-folder mail-folder--active">
            Inbox{unreadCount > 0 ? ` (${unreadCount})` : ''}
          </button>
          <button type="button" className="mail-folder">
            Sent Items
          </button>
          <button type="button" className="mail-folder">
            Deleted Items
          </button>
        </nav>

        <div className="mail-right">
          <div className="mail-list-header" role="row">
            <span role="columnheader">From</span>
            <span role="columnheader">Subject</span>
            <span role="columnheader">Date</span>
          </div>

          <ul
            className="mail-list"
            role="listbox"
            aria-label="Inbox messages"
          >
            {INBOX.map((email) => (
              <li
                key={email.id}
                role="option"
                aria-selected={selected?.id === email.id}
                className={[
                  'mail-item',
                  !readIds.has(email.id) ? 'mail-item--unread' : '',
                  selected?.id === email.id ? 'mail-item--selected' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => handleSelect(email)}
              >
                <span className="mail-item__from">{email.from}</span>
                <span className="mail-item__subject">{email.subject}</span>
                <span className="mail-item__date">{email.date}</span>
              </li>
            ))}
          </ul>

          {selected && (
            <article
              className="mail-body"
              aria-label={`Message: ${selected.subject}`}
            >
              <div className="mail-body__headers">
                <div className="mail-body__header-row">
                  <span className="mail-body__label">From:</span>
                  <span>{selected.from}</span>
                </div>
                <div className="mail-body__header-row">
                  <span className="mail-body__label">Subject:</span>
                  <span>{selected.subject}</span>
                </div>
                <div className="mail-body__header-row">
                  <span className="mail-body__label">Date:</span>
                  <span>{selected.date}</span>
                </div>
              </div>
              <hr className="mail-body__divider" />
              <pre className="mail-body__text">{selected.body}</pre>
            </article>
          )}
        </div>
      </div>

      <div className="explorer-statusbar" role="status">
        {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
      </div>
    </>
  );
}
