# Windows 95 Desktop Mockup

A fully interactive Windows 95 desktop environment built with React — running entirely in the browser.

![Desktop screenshot](./screenshot.png)

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 19 |
| Routing | React Router v7 |
| Bundler | Vite 8 |
| Styling | Tailwind CSS v4 + custom Win95 CSS |
| Persistence | LocalStorage + Upstash Redis (REST API) |

---

## Apps on the Desktop

| Icon | App | Description |
|---|---|---|
| `readme.txt` | Notepad | README viewer |
| `notes.exe` | Notepad (CRUD) | Notes with local storage |
| `paint.exe` | MS Paint | Drawing canvas |
| `iexplore.exe` | Internet Explorer | Pseudo-web browser |
| `minesweeper.exe` | Minesweeper | Classic game |
| `snake.exe` | Snake | Classic game |
| `stack.cmd` | MS-DOS Prompt | CMD terminal |
| `email.exe` | Outlook Express | Retro contact form |

---

## Features

- Draggable, resizable windows with minimize/close/focus stack
- Boot sequence animation and BSOD easter egg
- Screensaver activates after 45 seconds of inactivity
- Right-click context menu on the desktop
- Deep-linkable URLs (e.g. `/#/minesweeper`)
- Visitor counter via Upstash Redis REST API

---

## Setup

```bash
git clone https://github.com/IsliBasha/isli-basha-portfolio.git
cd isli-basha-portfolio
git checkout win95-demo
npm install

# Optional: visitor counter
cp .env.example .env
# add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN

npm run dev
```
