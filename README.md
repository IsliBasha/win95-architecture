# Isli Basha — Windows 95 Desktop

A fully interactive Windows 95 desktop environment built with React, running entirely in the browser.

![App screenshot](./screenshot.png)

---

## Teknologjitë e Përdorura / Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 19 |
| Routing | React Router v7 |
| Bundler | Vite 8 |
| Styling | Tailwind CSS v4 + custom Win95 CSS |
| Persistence | LocalStorage + Upstash Redis (REST API) |
| Testing | Vitest + Testing Library (172 teste) |

---

## Kërkesat e Projektit / Project Requirements

### Komponentët React (15+ komponentë)

| Komponent | Qëllimi |
|---|---|
| `Window` | Dritare e lëvizshme dhe e ndryshueshmë në madhësi, me minimize/close |
| `Taskbar` | Shirit i poshtëm me orën dhe butonat e dritareve të hapura |
| `DesktopIcon` | Ikona desktopi e tërhequr me mouse (drag & drop) |
| `Notes` | Aplikacion shënimesh me CRUD të plotë dhe ruajtje LocalStorage |
| `ContactExe` | Formë kontakti me validim dhe feedback vizual |
| `ProjectCard` | Kartë projekti për listimin e projekteve |
| `StackCmd` | Terminal CMD me listimin e stack-ut teknologjik |
| `Minesweeper` | Lojë Minesweeper e plotë |
| `Snake` | Lojë Snake me kontroll tastiere |
| `Paint` | Aplikacion vizatimi me canvas |
| `IExplorer` | Simulator Internet Explorer |
| `BootSequence` | Animacion nisje Windows 95 |
| `Screensaver` | Ekran-mbrojtës me aktivizim automatik pas 45s mosaktiviteti |
| `BSOD` | Blue Screen of Death i aktivizueshëm |
| `ContextMenu` | Meny me klik të djathtë në desktop |

### `useState` dhe `useEffect`

- **`useState`** — menaxhon gjendjen e dritareve, shënimeve, screensaver-it, lojërave dhe formave
- **`useEffect`** — sinkronizon shënimet me LocalStorage, menaxhon tastierën dhe rishikimin pas inaktivitetit

Custom hooks të implementuar:

```
src/hooks/
├── useClock.js           — orë me përditësim çdo sekondë
├── useIconPosition.js    — pozicion ikone i ruajtur në LocalStorage
├── useInactivity.js      — dëgjon mungesën e aktivitetit për screensaver
├── useInView.js          — vëzhgon dukshmërinë e elementit
├── useVisitorCount.js    — merr numrin e vizitorëve nga API
└── useWindowPosition.js  — gjurmon dhe ruan pozicionin e dritares
```

### Formë për Input të Dhënash

**`ContactExe`** — formë kontakti me:
- Fusha: emri, email-i, mesazhi
- Validim në klient
- Feedback vizual pas dërgimit

**`Notes`** — formë editimi shënimesh me:
- Titull dhe trup teksti i redaktueshëm inline
- Ruajtje automatike me çdo ndryshim gjendjes

### Listimi i Dhënave

- **`ProjectsExplorer`** — liston projektet nga `src/data/projects.js` në ndërfaqen Windows Explorer
- **`StackCmd`** — liston stack-un teknologjik si komanda CMD
- **`Notes`** — liston të gjitha shënimet ekzistuese në panel anësor

### CRUD Bazë — `Notes.exe`

| Operacioni | Implementimi |
|---|---|
| **Create** | Butoni "New Note" krijon shënim me `crypto.randomUUID()` |
| **Read** | Shënimet ngarkohen nga LocalStorage me nisjen e aplikacionit |
| **Update** | Titull dhe trup redaktohen inline; ruhen automatikisht me `useEffect` |
| **Delete** | Butoni "Delete" fshin shënimin e zgjedhur dhe rivendos seleksionin |

### Navigim me React Router

`HashRouter` + `RouterSync` sinkronizon URL-në me gjendjen e dritareve:

```
/#/projects        → hap dritaren e projekteve
/#/contact         → hap dritaren e kontaktit
/#/stack           → hap terminalin CMD
/#/minesweeper     → hap Minesweeper
/#/snake           → hap Snake
/#/paint           → hap Paint
```

Navigimi funksionon me deep link — URL-ja mund të ndahet dhe gjendja ruhet.

### Ruajtja e Dhënave

**LocalStorage** — `Notes.exe` ruan dhe ngarkon të gjitha shënimet:

```js
const STORAGE_KEY = 'win95-notes';
useEffect(() => { saveNotes(notes); }, [notes]);
```

**Upstash Redis REST API** — `VisitorCounter` tregon numrin real të vizitorëve duke bërë kërkesë HTTP te API.

### Strukturë e Pastër e Projektit

```
src/
├── components/      # Komponentët UI (15+ komponentë)
├── context/         # WindowStack context (renditja e dritareve)
├── data/            # Të dhëna statike (projects, stack)
├── hooks/           # Custom React hooks (6 hooks)
├── lib/             # Logjika e lojërave dhe utilitet
└── styles/          # CSS Win95 dhe variablat globale
```

---

## Instalimi / Setup

```bash
# Klono projektin
git clone https://github.com/IsliBasha/isli-basha-portfolio.git
cd isli-basha-portfolio
git checkout win95-demo

# Instalo varësitë
npm install

# (Opsionale) Konfiguro Upstash Redis për numrin e vizitorëve
cp .env.example .env
# shto UPSTASH_REDIS_REST_URL dhe UPSTASH_REDIS_REST_TOKEN

# Nis serverin e zhvillimit
npm run dev
```

---

## Testimi

```bash
npm test
```

Testet mbulojnë komponentët, hooks, logjikën e lojërave dhe funksionet ndihmëse — gjithsej **172 teste**.

---

## Aplikacionet / Apps

| Ikona | Aplikacioni | Përshkrimi |
|---|---|---|
| `projects` | File Explorer | Showcase i projekteve |
| `stack.cmd` | MS-DOS Prompt | Terminal me stack-un teknologjik |
| `email.exe` | Outlook Express | Formë kontakti retro |
| `readme.txt` | Notepad | Shfletues README |
| `notes.exe` | Notepad (CRUD) | Shënime me ruajtje lokale |
| `paint.exe` | MS Paint | Kanavacë vizatimi |
| `iexplore.exe` | Internet Explorer | Shfletues pseudo-web |
| `minesweeper.exe` | Minesweeper | Lojë klasike |
| `snake.exe` | Snake | Lojë klasike |

---

## Autorët / Authors

- **Isli Basha** — [GitHub](https://github.com/IsliBasha)
- **Sidrit Halili**
- **Serxhio Lekgegaj**
- **Helena Petro**
- **Aksel Mana**
