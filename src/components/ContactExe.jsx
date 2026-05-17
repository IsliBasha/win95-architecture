export function ContactExe() {
  return (
    <>
      <div className="explorer-menubar" role="menubar">
        {['File', 'Edit', 'Help'].map((item) => (
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
      <div className="contact-body">
        <ul className="contact-links">
          <li>
            <span className="contact-links__label">Source:</span>
            <a
              href="https://github.com/IsliBasha/isli-basha-portfolio"
              target="_blank"
              rel="noreferrer noopener"
            >
              github.com/IsliBasha/isli-basha-portfolio
            </a>
          </li>
          <li>
            <span className="contact-links__label">Branch:</span>
            <span>win95-demo</span>
          </li>
          <li>
            <span className="contact-links__label">License:</span>
            <span>MIT</span>
          </li>
        </ul>
      </div>
      <div className="explorer-statusbar">Ready</div>
    </>
  );
}
