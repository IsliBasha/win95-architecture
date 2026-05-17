import { useCallback, useEffect, useRef, useState } from 'react';

const HOME_URL = 'home.microsoft.com/ie';
const LOADING_MS = 600;

function normalizeUrl(raw) {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '');
}

function PageLink({ url, onNavigate, children }) {
  return (
    <button type="button" className="ie-page__link" onClick={() => onNavigate(url)}>
      {children}
    </button>
  );
}

function MsnPage({ onNavigate }) {
  return (
    <div className="ie-page ie-page--msn">
      <div className="ie-page__banner">MSN.COM</div>
      <h2>The Microsoft Network</h2>
      <p>Welcome to MSN — your home on the internet.</p>
      <ul className="ie-page__links">
        <li><PageLink url="www.microsoft.com" onNavigate={onNavigate}>📰 Today's News</PageLink></li>
        <li><PageLink url="mail.msn.com" onNavigate={onNavigate}>📧 Hotmail — Free E-Mail</PageLink></li>
        <li><PageLink url="www.altavista.com" onNavigate={onNavigate}>🔍 Search the Web</PageLink></li>
        <li><PageLink url="chat.msn.com" onNavigate={onNavigate}>💬 Chat with Friends</PageLink></li>
        <li><PageLink url="shopping.msn.com" onNavigate={onNavigate}>🛒 Shopping Online</PageLink></li>
      </ul>
      <hr />
      <p className="ie-page__footer">© 1995 Microsoft Corporation. All rights reserved.</p>
    </div>
  );
}

function MicrosoftPage({ onNavigate }) {
  return (
    <div className="ie-page ie-page--microsoft">
      <div className="ie-page__banner">MICROSOFT.COM</div>
      <h2>Welcome to Microsoft</h2>
      <p>Where do you want to go today?</p>
      <ul className="ie-page__links">
        <li><PageLink url="download.microsoft.com" onNavigate={onNavigate}>💾 Download Windows 95</PageLink></li>
        <li><PageLink url="office.microsoft.com" onNavigate={onNavigate}>📦 Office 95 — Now Available</PageLink></li>
        <li><PageLink url="games.microsoft.com" onNavigate={onNavigate}>🎮 Microsoft Games</PageLink></li>
        <li><PageLink url="dev.microsoft.com" onNavigate={onNavigate}>🛠 Developer Tools</PageLink></li>
        <li><PageLink url="support.microsoft.com" onNavigate={onNavigate}>📞 Technical Support</PageLink></li>
      </ul>
      <hr />
      <p className="ie-page__footer">© 1995 Microsoft Corporation</p>
    </div>
  );
}

function YahooPage({ onNavigate }) {
  return (
    <div className="ie-page ie-page--yahoo">
      <div className="ie-page__banner">YAHOO!</div>
      <h2>Yahoo! — Yet Another Hierarchical Officious Oracle</h2>
      <p>The web's premier directory. Updated daily.</p>
      <ul className="ie-page__links">
        <li><PageLink url="arts.yahoo.com" onNavigate={onNavigate}>🎭 Arts</PageLink></li>
        <li><PageLink url="business.yahoo.com" onNavigate={onNavigate}>💼 Business and Economy</PageLink></li>
        <li><PageLink url="computers.yahoo.com" onNavigate={onNavigate}>🖥 Computers and Internet</PageLink></li>
        <li><PageLink url="education.yahoo.com" onNavigate={onNavigate}>🎓 Education</PageLink></li>
        <li><PageLink url="entertainment.yahoo.com" onNavigate={onNavigate}>🎬 Entertainment</PageLink></li>
        <li><PageLink url="government.yahoo.com" onNavigate={onNavigate}>🏛 Government</PageLink></li>
        <li><PageLink url="health.yahoo.com" onNavigate={onNavigate}>🏥 Health</PageLink></li>
        <li><PageLink url="news.yahoo.com" onNavigate={onNavigate}>📰 News and Media</PageLink></li>
        <li><PageLink url="sports.yahoo.com" onNavigate={onNavigate}>🏅 Recreation and Sports</PageLink></li>
        <li><PageLink url="science.yahoo.com" onNavigate={onNavigate}>🔬 Science</PageLink></li>
      </ul>
      <hr />
      <p className="ie-page__footer">© 1995 Yahoo! Inc.</p>
    </div>
  );
}

function NetscapePage({ onNavigate }) {
  return (
    <div className="ie-page ie-page--netscape">
      <div className="ie-page__banner">NETSCAPE.COM</div>
      <h2>Netscape Communications</h2>
      <p>The leading web browser. Download Netscape Navigator 2.0 today!</p>
      <ul className="ie-page__links">
        <li><PageLink url="download.netscape.com" onNavigate={onNavigate}>⬇ Download Navigator</PageLink></li>
        <li><PageLink url="netcenter.netscape.com" onNavigate={onNavigate}>📚 Netcenter</PageLink></li>
        <li><PageLink url="search.netscape.com" onNavigate={onNavigate}>🔍 Net Search</PageLink></li>
        <li><PageLink url="www.yahoo.com" onNavigate={onNavigate}>🗺 Net Directory</PageLink></li>
        <li><PageLink url="forums.netscape.com" onNavigate={onNavigate}>💬 Netscape Forums</PageLink></li>
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
      <p>This site does not appear to exist yet. Try checking back in 1998.</p>
      <ul className="ie-page__links">
        <li>• Check that the address is correct</li>
        <li>• The server may be temporarily unavailable</li>
        <li>• Try AltaVista or Yahoo! for search instead</li>
      </ul>
    </div>
  );
}

function AltaVistaPage({ onNavigate }) {
  const [query, setQuery] = useState('');

  function handleSearch() {
    if (query.trim()) onNavigate(`search.altavista.com/search?q=${query}`);
  }

  return (
    <div className="ie-page ie-page--altavista">
      <div className="ie-page__banner">ALTAVISTA.COM</div>
      <h2>AltaVista — Search the Web</h2>
      <p>The most powerful and useful guide to the Net.</p>
      <div className="ie-page__search-row">
        <input
          className="ie-page__search-input"
          type="text"
          aria-label="AltaVista Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
        />
        <button type="button" className="win-btn" onClick={handleSearch}>
          Search!
        </button>
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
  'home.microsoft.com/ie': (nav) => <MsnPage onNavigate={nav} />,
  'www.microsoft.com': (nav) => <MicrosoftPage onNavigate={nav} />,
  'microsoft.com': (nav) => <MicrosoftPage onNavigate={nav} />,
  'www.yahoo.com': (nav) => <YahooPage onNavigate={nav} />,
  'yahoo.com': (nav) => <YahooPage onNavigate={nav} />,
  'www.netscape.com': (nav) => <NetscapePage onNavigate={nav} />,
  'netscape.com': (nav) => <NetscapePage onNavigate={nav} />,
  'www.google.com': () => <GooglePage />,
  'google.com': () => <GooglePage />,
  'www.altavista.com': (nav) => <AltaVistaPage onNavigate={nav} />,
  'altavista.com': (nav) => <AltaVistaPage onNavigate={nav} />,
};

function resolvePage(url, onNavigate) {
  const norm = normalizeUrl(url);
  const factory = ROUTES[norm];
  return factory ? factory(onNavigate) : <ErrorPage url={norm} />;
}

const MENU_ITEMS = ['File', 'Edit', 'View', 'Go', 'Favorites', 'Help'];

export function IExplorer() {
  const [history, setHistory] = useState([HOME_URL]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [addressInput, setAddressInput] = useState(HOME_URL);
  const [status, setStatus] = useState('Done');
  const timerRef = useRef(null);

  const currentUrl = history[historyIdx];
  const canGoBack = historyIdx > 0;
  const canGoForward = historyIdx < history.length - 1;

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const startLoading = useCallback(() => {
    setStatus('Opening page...');
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setStatus('Done'), LOADING_MS);
  }, []);

  const navigate = useCallback(
    (raw) => {
      const url = raw.trim() || HOME_URL;
      const newHistory = [...history.slice(0, historyIdx + 1), url];
      setHistory(newHistory);
      setHistoryIdx(newHistory.length - 1);
      setAddressInput(url);
      startLoading();
    },
    [history, historyIdx, startLoading],
  );

  const goBack = useCallback(() => {
    if (!canGoBack) return;
    const idx = historyIdx - 1;
    setHistoryIdx(idx);
    setAddressInput(history[idx]);
    startLoading();
  }, [canGoBack, history, historyIdx, startLoading]);

  const goForward = useCallback(() => {
    if (!canGoForward) return;
    const idx = historyIdx + 1;
    setHistoryIdx(idx);
    setAddressInput(history[idx]);
    startLoading();
  }, [canGoForward, history, historyIdx, startLoading]);

  const goHome = useCallback(() => navigate(HOME_URL), [navigate]);

  const handleAddressKey = useCallback(
    (e) => { if (e.key === 'Enter') navigate(addressInput); },
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
        {resolvePage(currentUrl, navigate)}
      </main>

      <div className="explorer-statusbar" role="status">
        {status}
      </div>
    </>
  );
}
