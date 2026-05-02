# Campus Notifications Microservice

A campus notification platform where students get real-time updates for placements, events, and results. Built as part of a hiring evaluation — covers a priority inbox algorithm (Stage 1) and a React frontend (Stage 2), both wired up to a logging middleware that ships every significant action as a structured log.

---

## Folder Structure

```
RA2311003010801/
├── logging_middleware/       reusable Log() package used across both apps
├── notification_app_be/      Stage 1 — priority inbox algorithm (Node.js)
├── notification_app_fe/      Stage 2 — React frontend (Vite, port 3000)
└── notification_system_design.md
```

---

## Setup

Each subfolder has its own `package.json`. Run `npm install` in each one before running anything.

Both apps need a `.env` file in their respective folders. The variables needed are listed in `.env.example` in each folder.

---

## Stage 1 — Priority Inbox Algorithm

The idea: fetch all notifications from the API, score them by type and recency, return the top N.

Scoring uses `typeWeight * Math.exp(-0.1 * hoursAgo)` where Placement = 3, Result = 2, Event = 1. A min-heap of size N keeps things efficient as new notifications stream in.

```bash
cd notification_app_be
npm install
node --env-file=.env src/index.js 10
```

Replace `10` with `15` or `20` to change how many you want back.

---

## Stage 2 — React Frontend

React + Vite app running on `localhost:3000`. Two pages:

- **All Notifications** — full list, paginated, filterable by type (Placement / Result / Event), mark all read button
- **Priority Inbox** — top N notifications ranked by priority score, adjustable between 5 / 10 / 15 / 20, with type filter

Unread notifications are visually distinct from already-viewed ones. Viewed state persists in localStorage so it survives page refresh.

```bash
cd notification_app_fe
npm install
npm run dev
```

Then open `http://localhost:3000`.

### Screenshots

![DESKTOP SCREENSHOT - ALL NOTIFICATIONS PAGE](https://github.com/shubhankar05sarkar/RA2311003010801/blob/ea7f18693866205ef42ed3d21f686eb336d3d21d/all-notifications-desktop.jpeg)

![DESKTOP SCREENSHOT - PRIORITY INBOX PAGE](https://github.com/shubhankar05sarkar/RA2311003010801/blob/ea7f18693866205ef42ed3d21f686eb336d3d21d/priority-notifications-desktop.jpeg)

![MOBILE SCREENSHOT - ALL NOTIFICATIONS PAGE](https://github.com/shubhankar05sarkar/RA2311003010801/blob/ea7f18693866205ef42ed3d21f686eb336d3d21d/all-notifications-mobile.jpeg)

![MOBILE SCREENSHOT - PRIORITY INBOX PAGE](https://github.com/shubhankar05sarkar/RA2311003010801/blob/ea7f18693866205ef42ed3d21f686eb336d3d21d/priority-notifications-mobile.jpeg)

---

## Logging Middleware

Every significant action in both apps calls `Log(stack, level, package, message)` which posts a structured entry to the evaluation server. The middleware handles auth token fetching and expiry automatically.

Used as a local file dependency — no npm publish needed.
