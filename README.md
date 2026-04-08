# Todo Coach App

A local-first PWA todo app built with React, TypeScript, and Vite. Tasks and settings are stored in browser `localStorage`, so the app stays on the device and can be installed on iPhone as a Home Screen web app.

## Features

- Add, edit, complete, and delete tasks
- Move unfinished tasks to tomorrow
- Show today's completion count and coaching copy
- Keep state in browser storage
- Cache the app shell for offline use

## Tech Stack

- React
- TypeScript
- Vite
- Vitest
- Testing Library

## Local Development

```bash
npm install
npm run dev
```

The Vite dev server runs on `http://localhost:5174`.

## Build and Test

```bash
npm test
npm run build
```

PWA service worker registration is enabled only in production builds. For install or offline checks, use a deployed HTTPS URL or a production preview.

## iPhone Install

See the [iPhone PWA install guide](./docs/iphone-pwa-install.md).

## Project Layout

- `src/` app code
- `public/manifest.webmanifest` PWA manifest
- `public/sw.js` service worker
- `public/icons/` app icons
