import { useCallback, useState } from 'react';

const HOME_URL = 'home.microsoft.com/ie';

function normalizeUrl(raw) {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '');
}

function MsnPage() {
  return (
    <div className="ie-page ie-page--msn">
      <div className="ie-page__banner">MSN.COM</div>
      <h2>The Microsoft Network</h2>
      <p>Welcome to MSN — your home on the internet.</p>
      <ul className="ie-page__links">
        <li>📰 Today's News</li>
        <li>📧 Hotmail — Free E-Mail</li>
        <li>🔍 Search the Web</li>
        <li>💬 Chat with Friends</li>
        <li>🛒 Shopping Online</li>
      </ul>
      <hr />
      <p className="ie-page__footer">© 1995 Microsoft Corporation. All rights reserved.</p>
    </div>
  );
}

function MicrosoftPage() {
  return (
    <div className="ie-page ie-page--microsoft">
      <div className="ie-page__banner">MICROSOFT.COM</div>
      <h2>Welcome to Microsoft</h2>
      <p>
        Where do you want to go today?
      </p>
      <ul className="ie-page__links">
        <li>💾 Download Windows 95</li>
        <li>📦 Office 95 — Now Available</li>
        <li>🎮 Microsoft Games</li>
        <li>🛠 Developer Tools</li>
        <li>📞 Technical Support</li>
      </ul>
      <hr />
      <p className="ie-page__footer">© 1995 Microsoft Corporation</p>
    </div>
  );
}

function YahooPage() {
  return (
    <div className="ie-page ie-page--yahoo">
      <div className="ie-page__banner">YAHOO!</div>
      <h2>Yahoo! — Yet Another Hierarchical Officious Oracle</h2>
      <p>The web's premier directory. Updated daily.</p>
      <ul className="ie-page__links">
        <li>🎭 Arts</li>
        <li>💼 Business and Economy</li>
        <li>🖥 Computers and Internet</li>
        <li>🎓 Education</li>
        <li>🎬 Entertainment</li>
        <li>🏛 Government</li>
        <li>🏥 Health</li>
        <li>📰 News and Media</li>
        <li>🏅 Recreation and Sports</li>
        <li>🔬 Science</li>
      </ul>
      <hr />
      <p className="ie-page__footer">© 1995 Yahoo! Inc.</p>
    </div>
  );
}

function NetscapePage() {
  return (
    <div className="ie-page ie-page--netscape">
      <div className="ie-page__banner">NETSCAPE.COM</div>
      <h2>Netscape Communications</h2>
      <p>
        The leading web browser. Download Netscape Navigator 2.0 today!
      </p>
      <ul className="ie-page__links">
        <li>⬇ Download Navigator</li>
        <li>📚 Netcenter</li>
        <li>🔍 Net Search</li>
        <li>🗺 Net Directory</li>
        <li>💬 Netscape Forums</li>
      </ul>
      <hr />
      <p className="ie-page__footer">© 1995 Netscape Communications Corporation</p>
    </div>
  );
}

function GooglePage() {
  return (
    <div className="ie-page ie-page--google">
      <div className="ie-page__banner">GOOGLE.COM</div>
      <h2>Page Cannot Be Found</h2>
      <p>
        The page <strong>www.google.com</strong> cannot be displayed.
      </p>
      <p>
        This site does not appear to exist yet. Try checking back in 1998.
      </p>
      <ul className="ie-page__links">
        <li>• Check that the address is correct</li>
        <li>• The server may be temporarily unavailable</li>
        <li>• Try AltaVista or Yahoo! for search instead</li>
      </ul>
    </div>
  );
}

function AltaVistaPage() {
  return (
    <div className="ie-page ie-page--altavista">
      <div className="ie-page__banner">ALTAVISTA.COM</div>
      <h2>AltaVista — Search the Web</h2>
      <p>The most powerful and useful guide to the Net.</p>
      <div className="ie-page__search-box">
        [Search: ___________________________] [Search!]
      </div>
      <p style={{ marginTop: '8px' }}>Indexed over 16 billion words. Updated daily.</p>
      <hr />
      <p className="ie-page__footer">© 1995 Digital Equipment Corporation</p>
    </div>
  );
}

function ErrorPage({ url }) {
  return (
    <div className="ie-page ie-page--error">
      <h2>The page cannot be displayed</h2>
      <p>
        The page you are looking for is currently unavailable. The Web site might
        be experiencing technical difficulties, or you may need to adjust your
        browser settings.
      </p>
      <hr />
      <p>
        <strong>Cannot find server or DNS Error</strong>
      </p>
      <p>Internet Explorer cannot open the Internet site</p>
      <p>
        <strong>{url}</strong>
      </p>
      <ul>
        <li>The site may be temporarily unavailable. Try again later.</li>
        <li>
          If you typed the page address in the Address bar, make sure it is
          spelled correctly.
        </li>
        <li>
          To check your connection settings, click the <strong>Tools</strong>{' '}
          menu, and then click <strong>Internet Options</strong>.
        </li>
      </ul>
    </div>
  );
}

const ROUTES = {
  'home.microsoft.com/ie': () => <MsnPage />,
  'www.microsoft.com': () => <MicrosoftPage />,
  'microsoft.com': () => <MicrosoftPage />,
  'www.yahoo.com': () => <YahooPage />,
  'yahoo.com': () => <YahooPage />,
  'www.netscape.com': () => <NetscapePage />,
  'netscape.com': () => <NetscapePage />,
  'www.google.com': () => <GooglePage />,
  'google.com': () => <GooglePage />,
  'www.altavista.com': () => <AltaVistaPage />,
  'altavista.com': () => <AltaVistaPage />,
};

function resolvePage(url) {
  const norm = normalizeUrl(url);
  const factory = ROUTES[norm];
  return factory ? factory() : <ErrorPage url={norm} />;
}

const MENU_ITEMS = ['File', 'Edit', 'View', 'Go', 'Favorites', 'Help'];

export function IExplorer() {
  const [history, setHistory] = useState([HOME_URL]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [addressInput, setAddressInput] = useState(HOME_URL);

  const currentUrl = history[historyIdx];
  const canGoBack = historyIdx > 0;
  const canGoForward = historyIdx < history.length - 1;

  const navigate = useCallback(
    (raw) => {
      const url = raw.trim() || HOME_URL;
      const newHistory = [...history.slice(0, historyIdx + 1), url];
      setHistory(newHistory);
      setHistoryIdx(newHistory.length - 1);
      setAddressInput(url);
    },
    [history, historyIdx],
  );

  const goBack = useCallback(() => {
    if (!canGoBack) return;
    const idx = historyIdx - 1;
    setHistoryIdx(idx);
    setAddressInput(history[idx]);
  }, [canGoBack, history, historyIdx]);

  const goForward = useCallback(() => {
    if (!canGoForward) return;
    const idx = historyIdx + 1;
    setHistoryIdx(idx);
    setAddressInput(history[idx]);
  }, [canGoForward, history, historyIdx]);

  const goHome = useCallback(() => {
    navigate(HOME_URL);
  }, [navigate]);

  const handleAddressKey = useCallback(
    (e) => {
      if (e.key === 'Enter') navigate(addressInput);
    },
    [addressInput, navigate],
  );

  return (
    <>
      <div className="explorer-menubar" role="menubar">
        {MENU_ITEMS.map((item) => (
          <button key={item} type="button" className="explorer-menu-item" role="menuitem">
            {item}
          </button>
        ))}
      </div>

      <div className="ie-toolbar" role="toolbar" aria-label="Navigation">
        <button
          type="button"
          className="win-btn ie-toolbar__btn"
          onClick={goBack}
          disabled={!canGoBack}
          aria-label="Back"
        >
          ◀ Back
        </button>
        <button
          type="button"
          className="win-btn ie-toolbar__btn"
          onClick={goForward}
          disabled={!canGoForward}
          aria-label="Forward"
        >
          Forward ▶
        </button>
        <button
          type="button"
          className="win-btn ie-toolbar__btn"
          aria-label="Stop"
        >
          ■ Stop
        </button>
        <button
          type="button"
          className="win-btn ie-toolbar__btn"
          aria-label="Refresh"
        >
          ↻ Refresh
        </button>
        <button
          type="button"
          className="win-btn ie-toolbar__btn"
          onClick={goHome}
          aria-label="Home"
        >
          🏠 Home
        </button>
      </div>

      <div className="ie-address-bar">
        <label className="ie-address-bar__label" htmlFor="ie-address">
          Address
        </label>
        <input
          id="ie-address"
          className="ie-address-bar__input"
          type="text"
          value={addressInput}
          onChange={(e) => setAddressInput(e.target.value)}
          onKeyDown={handleAddressKey}
          aria-label="Address"
          autoComplete="off"
          spellCheck={false}
        />
        <button
          type="button"
          className="win-btn ie-address-bar__go"
          onClick={() => navigate(addressInput)}
        >
          Go
        </button>
      </div>

      <main className="ie-content" aria-label="Browser content">
        {resolvePage(currentUrl)}
      </main>

      <div className="explorer-statusbar" role="status">
        Done
      </div>
    </>
  );
}
