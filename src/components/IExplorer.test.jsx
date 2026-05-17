import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IExplorer } from './IExplorer.jsx';

describe('IExplorer — structure', () => {
  it('renders a menubar', () => {
    render(<IExplorer />);
    expect(screen.getByRole('menubar')).toBeInTheDocument();
  });

  it('renders a navigation toolbar', () => {
    render(<IExplorer />);
    expect(screen.getByRole('toolbar', { name: /navigation/i })).toBeInTheDocument();
  });

  it('renders Back button', () => {
    render(<IExplorer />);
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
  });

  it('renders Forward button', () => {
    render(<IExplorer />);
    expect(screen.getByRole('button', { name: /forward/i })).toBeInTheDocument();
  });

  it('renders Home button', () => {
    render(<IExplorer />);
    expect(screen.getByRole('button', { name: /home/i })).toBeInTheDocument();
  });

  it('renders an address bar', () => {
    render(<IExplorer />);
    expect(screen.getByRole('textbox', { name: /address/i })).toBeInTheDocument();
  });

  it('renders a status bar', () => {
    render(<IExplorer />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders browser content area', () => {
    render(<IExplorer />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});

describe('IExplorer — home page', () => {
  it('shows home page content on mount', () => {
    render(<IExplorer />);
    expect(screen.getByRole('main').textContent.length).toBeGreaterThan(0);
  });

  it('address bar shows default URL on mount', () => {
    render(<IExplorer />);
    const addr = screen.getByRole('textbox', { name: /address/i });
    expect(addr.value.length).toBeGreaterThan(0);
  });

  it('status bar shows Done on mount', () => {
    render(<IExplorer />);
    expect(screen.getByRole('status')).toHaveTextContent(/done/i);
  });
});

describe('IExplorer — navigation state', () => {
  it('Back button is disabled on initial page', () => {
    render(<IExplorer />);
    expect(screen.getByRole('button', { name: /back/i })).toBeDisabled();
  });

  it('Forward button is disabled on initial page', () => {
    render(<IExplorer />);
    expect(screen.getByRole('button', { name: /forward/i })).toBeDisabled();
  });

  it('navigating to a new URL enables Back button', async () => {
    const user = userEvent.setup();
    render(<IExplorer />);
    const addr = screen.getByRole('textbox', { name: /address/i });
    await user.clear(addr);
    await user.type(addr, 'www.microsoft.com');
    await user.keyboard('{Enter}');
    expect(screen.getByRole('button', { name: /back/i })).not.toBeDisabled();
  });

  it('clicking Back returns to previous page', async () => {
    const user = userEvent.setup();
    render(<IExplorer />);
    const addr = screen.getByRole('textbox', { name: /address/i });
    const homeBefore = screen.getByRole('main').textContent;
    await user.clear(addr);
    await user.type(addr, 'www.microsoft.com');
    await user.keyboard('{Enter}');
    await user.click(screen.getByRole('button', { name: /back/i }));
    expect(screen.getByRole('main').textContent).toBe(homeBefore);
  });

  it('clicking Forward is enabled after going Back', async () => {
    const user = userEvent.setup();
    render(<IExplorer />);
    const addr = screen.getByRole('textbox', { name: /address/i });
    await user.clear(addr);
    await user.type(addr, 'www.microsoft.com');
    await user.keyboard('{Enter}');
    await user.click(screen.getByRole('button', { name: /back/i }));
    expect(screen.getByRole('button', { name: /forward/i })).not.toBeDisabled();
  });

  it('Home button navigates back to the start page', async () => {
    const user = userEvent.setup();
    render(<IExplorer />);
    const homeBefore = screen.getByRole('main').textContent;
    const addr = screen.getByRole('textbox', { name: /address/i });
    await user.clear(addr);
    await user.type(addr, 'www.yahoo.com');
    await user.keyboard('{Enter}');
    await user.click(screen.getByRole('button', { name: /home/i }));
    expect(screen.getByRole('main').textContent).toBe(homeBefore);
  });
});

describe('IExplorer — page content', () => {
  it('unknown URL shows cannot be displayed page', async () => {
    const user = userEvent.setup();
    render(<IExplorer />);
    const addr = screen.getByRole('textbox', { name: /address/i });
    await user.clear(addr);
    await user.type(addr, 'www.definitely-not-real-1234.com');
    await user.keyboard('{Enter}');
    expect(screen.getByRole('main').textContent).toMatch(/cannot be displayed/i);
  });

  it('www.microsoft.com shows Microsoft page', async () => {
    const user = userEvent.setup();
    render(<IExplorer />);
    const addr = screen.getByRole('textbox', { name: /address/i });
    await user.clear(addr);
    await user.type(addr, 'www.microsoft.com');
    await user.keyboard('{Enter}');
    expect(screen.getByRole('main').textContent.toLowerCase()).toContain('microsoft');
  });

  it('www.yahoo.com shows Yahoo page', async () => {
    const user = userEvent.setup();
    render(<IExplorer />);
    const addr = screen.getByRole('textbox', { name: /address/i });
    await user.clear(addr);
    await user.type(addr, 'www.yahoo.com');
    await user.keyboard('{Enter}');
    expect(screen.getByRole('main').textContent.toLowerCase()).toContain('yahoo');
  });
});

describe('IExplorer — status bar loading', () => {
  it('shows "Opening page..." immediately when navigating via address bar', async () => {
    const user = userEvent.setup();
    render(<IExplorer />);
    const addr = screen.getByRole('textbox', { name: /address/i });
    await user.clear(addr);
    await user.type(addr, 'www.microsoft.com');
    await user.keyboard('{Enter}');
    expect(screen.getByRole('status')).toHaveTextContent(/opening page/i);
  });

  it('status bar returns to Done after the loading delay', async () => {
    const user = userEvent.setup();
    render(<IExplorer />);
    const addr = screen.getByRole('textbox', { name: /address/i });
    await user.clear(addr);
    await user.type(addr, 'www.microsoft.com');
    await user.keyboard('{Enter}');
    await waitFor(
      () => expect(screen.getByRole('status')).toHaveTextContent(/done/i),
      { timeout: 2000 },
    );
  });
});

describe('IExplorer — clickable page links', () => {
  it('MSN home page has a clickable Search the Web link that navigates to AltaVista', async () => {
    const user = userEvent.setup();
    render(<IExplorer />);
    const link = screen.getByRole('button', { name: /search the web/i });
    await user.click(link);
    expect(screen.getByRole('main').textContent.toLowerCase()).toContain('altavista');
  });

  it('clicking a page link enables the Back button', async () => {
    const user = userEvent.setup();
    render(<IExplorer />);
    const link = screen.getByRole('button', { name: /search the web/i });
    await user.click(link);
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /back/i })).not.toBeDisabled(),
    );
  });

  it('Netscape page has a clickable Net Directory link that navigates to Yahoo', async () => {
    const user = userEvent.setup();
    render(<IExplorer />);
    const addr = screen.getByRole('textbox', { name: /address/i });
    await user.clear(addr);
    await user.type(addr, 'www.netscape.com');
    await user.keyboard('{Enter}');
    const link = await screen.findByRole('button', { name: /net directory/i });
    await user.click(link);
    expect(screen.getByRole('main').textContent.toLowerCase()).toContain('yahoo');
  });
});

describe('IExplorer — AltaVista search', () => {
  async function goToAltaVista(user) {
    const addr = screen.getByRole('textbox', { name: /address/i });
    await user.clear(addr);
    await user.type(addr, 'www.altavista.com');
    await user.keyboard('{Enter}');
  }

  it('AltaVista page has a search input', async () => {
    const user = userEvent.setup();
    render(<IExplorer />);
    await goToAltaVista(user);
    expect(screen.getByRole('textbox', { name: /altavista search/i })).toBeInTheDocument();
  });

  it('AltaVista page has a Search! button', async () => {
    const user = userEvent.setup();
    render(<IExplorer />);
    await goToAltaVista(user);
    expect(screen.getByRole('button', { name: /search!/i })).toBeInTheDocument();
  });

  it('pressing Enter in the AltaVista search box navigates to an error page with the query', async () => {
    const user = userEvent.setup();
    render(<IExplorer />);
    await goToAltaVista(user);
    const searchInput = screen.getByRole('textbox', { name: /altavista search/i });
    await user.clear(searchInput);
    await user.type(searchInput, 'windows 95');
    await user.keyboard('{Enter}');
    expect(screen.getByRole('main').textContent).toMatch(/windows\+95|windows 95/i);
  });

  it('clicking Search! navigates using the AltaVista query', async () => {
    const user = userEvent.setup();
    render(<IExplorer />);
    await goToAltaVista(user);
    const searchInput = screen.getByRole('textbox', { name: /altavista search/i });
    await user.clear(searchInput);
    await user.type(searchInput, 'netscape');
    await user.click(screen.getByRole('button', { name: /search!/i }));
    expect(screen.getByRole('main').textContent).toMatch(/netscape/i);
  });
});
