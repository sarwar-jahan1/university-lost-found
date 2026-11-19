<div align="center">

# 🎒 Campus Lost & Found

**A modern web app that helps university students report, find and reclaim lost belongings.**

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white)
![Status](https://img.shields.io/badge/status-active-success)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [How It Works](#-how-it-works)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [API Reference](#-api-reference)
- [Routes](#-routes)
- [Deployment](#-deployment)
- [Known Limitations](#-known-limitations)
- [Contributing](#-contributing)

---

## 🔎 Overview

**Campus Lost & Found** is a single-page application (SPA) built for a university campus. Anyone who loses something can post a *Lost* report, anyone who finds something can post a *Found* report, and the real owner can submit a **claim** with private details that only they would know. The reporter then reviews each claim and **approves** or **rejects** it.

The frontend talks to a separate REST backend over JSON (and `multipart/form-data` for photos) and authenticates every request with a JWT bearer token.

---

## ✨ Features

### Reporting & Browsing
- 📝 **Report lost or found items** with title, location, date, description and an optional photo
- 🖼️ **Photo upload** with drag & drop, live preview and validation (JPG / PNG / WEBP, max 5 MB)
- 🔍 **Browse & search** all items with Lost / Found tabs and sorting (default, newest, oldest, name A–Z)
- 🔗 **Shareable filters**: search, status and sort live in the URL, so results survive refresh and the Back button
- ⌨️ Press <kbd>/</kbd> anywhere to jump to search
- 📄 **Item details** page with a full-size photo viewer and a one-click **Share** button
- 🧾 **My Reports** page to edit or delete the items you reported

### Claims
- 🙋 **Submit a claim** with a private description proving ownership
- 📬 **Track My Claims** with filters (All / Pending / Approved / Rejected) and status hints
- ✅ **Manage Claims** for the reporter: review every claim on an item and approve or reject with a confirmation step
- 🔒 A second claim cannot be approved once one is approved

### Notifications
- 🔔 In-app notification centre (new claim, claim approved, claim rejected)
- 🔴 **Unread badge** in the sidebar, refreshed every 60 seconds and instantly after reading
- ⚡ Approve or reject a claim **directly from a notification**
- Mark single / all notifications as read, filter by All / Unread

### Accounts & Experience
- 🔐 Sign Up / Sign In with a **password strength meter** and Caps Lock warning
- 🛡️ Protected routes, automatic redirect to Sign In when the session expires
- 👤 Profile page with copy-to-clipboard for email and user ID
- 📊 Dashboard with stats, recent reports, claims overview and notifications
- 💀 Skeleton loaders, toast messages and friendly error / empty states
- ♿ Accessibility: skip-to-content link, visible focus rings, ARIA labels, keyboard-closable dialogs
- 📱 Fully responsive layout with a mobile drawer navigation

---

## 🔄 How It Works

```
Student A finds a wallet                         Student B lost a wallet
        │                                                │
  Report Item (Found + photo)                     Browse Items → Item Details
        │                                                │
        │                                       "Claim This Item" + private proof
        │                                                │
        │            ┌── notification: "New claim" ◄─────┘
        ▼            ▼
  Notifications / Manage Claims
        │
  Approve  or  Reject
        │
        └──────────────► Track My Claims shows APPROVED / REJECTED
                         (Approved → contact the reporter to collect the item)
```

1. **Report**: the finder posts a *Found* item (or the owner posts a *Lost* one).
2. **Browse**: other students search the list and open an item.
3. **Claim**: the owner describes details only they would know (contents, marks, etc.).
4. **Review**: the reporter is notified, compares the claim and approves or rejects it.
5. **Collect**: an approved claimant arranges the handover with the reporter.

---

## 🧰 Tech Stack

| Area | Technology |
| --- | --- |
| UI library | **React 19** |
| Build tool | **Vite 8** (`@vitejs/plugin-react`) |
| Styling | **Tailwind CSS 4** (`@tailwindcss/vite`) + a small amount of custom CSS |
| Routing | **React Router DOM 7** |
| State | React hooks (`useState`, `useEffect`, `useMemo`, `useCallback`, context for toasts) |
| HTTP | Native `fetch` through a single wrapper (`src/services/api.js`) |
| Auth | JWT bearer token stored in `localStorage` |
| Linting | ESLint 10 with `react-hooks` and `react-refresh` plugins |

No state-management or HTTP libraries are used, which keeps the bundle small (about 109 kB gzipped JS).

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.19+ (or 22+) and **npm**
- A running instance of the Lost & Found backend API

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/sarwar-jahan1/university-lost-found.git
cd university-lost-found

# 2. Install dependencies
npm install

# 3. Create your environment file (see the next section)
echo "VITE_API_BASE_URL=https://your-backend-url" > .env

# 4. Start the dev server
npm run dev
```

Open **http://localhost:5173** in your browser.

> **Important:** the backend must allow the origin you run the app from in its **CORS** settings (for example `http://localhost:5173`). If you start Vite on another port, API calls will fail with a *"Cannot connect to backend"* error until that origin is allowed too.

---

## 🔐 Environment Variables

Create a `.env` file in the project root:

| Variable | Required | Description |
| --- | :---: | --- |
| `VITE_API_BASE_URL` | ✅ | Base URL of the backend API, without a trailing slash. Example: `https://lost-and-found-ozl2.onrender.com` |

- Vite only exposes variables that start with `VITE_`.
- `.env` is listed in `.gitignore` and must **not** be committed.
- Environment variables are baked in at build time, so rebuild after changing them.

---

## 📜 Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server with hot reload |
| `npm run build` | Create an optimized production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint on the whole project |

---

## 📁 Project Structure

```
university-lost-found/
├── public/                     # Static assets (favicon, icons)
├── src/
│   ├── main.jsx                # Entry: BrowserRouter + ToastProvider + <App/>
│   ├── App.jsx                 # Route table
│   ├── index.css               # Tailwind import, focus styles, animations
│   │
│   ├── layouts/
│   │   └── MainLayout.jsx      # Sidebar + page outlet + footer
│   │
│   ├── pages/
│   │   ├── Auth.jsx            # Sign In / Sign Up
│   │   ├── Dashboard.jsx       # Stats, recent items, claims, notifications
│   │   ├── Items.jsx           # Browse, search, filter, sort
│   │   ├── ItemDetails.jsx     # Item view, claim / manage / edit / delete
│   │   ├── ReportItem.jsx      # Report form with photo upload
│   │   ├── EditItem.jsx        # Edit a reported item
│   │   ├── MyReports.jsx       # Items reported from this device
│   │   ├── TrackClaim.jsx      # Claims submitted by the user
│   │   ├── ManageClaims.jsx    # Reporter reviews claims on one item
│   │   ├── Notifications.jsx   # Notification centre + inline approve/reject
│   │   ├── Profile.jsx         # Account details
│   │   └── NotFound.jsx        # 404
│   │
│   ├── components/
│   │   ├── Sidebar.jsx         # Navigation, unread badge, mobile drawer
│   │   ├── ProtectedRoute.jsx  # Redirects guests to /auth
│   │   ├── ItemCard.jsx        # Item tile used in lists
│   │   ├── ClaimForm.jsx       # Claim modal
│   │   ├── AuthHero.jsx        # Left panel of the auth page
│   │   └── ui/                 # ConfirmDialog, ItemImage, Skeleton, StatusBadge,
│   │                           # ToastProvider, ScrollManager, Icons
│   │
│   ├── services/               # All backend communication
│   │   ├── api.js              # apiRequest(): base URL, token, errors
│   │   ├── authService.js      # signup, signin, profile, logout
│   │   ├── claimService.js     # item claims, approve, reject
│   │   ├── itemService.js      # update, delete item
│   │   └── notificationService.js
│   │
│   ├── utils/
│   │   ├── items.js            # Image URL + upload validation
│   │   ├── claims.js           # Claim shape helpers, notification decisions
│   │   └── myItems.js          # Remembers items reported from this device
│   │
│   └── hooks/                  # useDocumentTitle, useModal
│
├── .env                        # VITE_API_BASE_URL (not committed)
├── vite.config.js
├── eslint.config.js
└── package.json
```

> `pages/Home.jsx`, `components/Navbar.jsx` and `data/items.js` (demo data) are not part of the routing tree and are currently unused.

---

## 🏗️ Architecture

The app follows a simple, layered flow. **Pages never call `fetch` directly**; everything goes through one wrapper.

```
 .env (VITE_API_BASE_URL)
        │
        ▼
 services/api.js ── apiRequest(endpoint, options)
        ▲
        │
 authService · claimService · itemService · notificationService
        ▲
        │
 Pages & components  →  useState  →  rendered UI
```

### What `apiRequest()` does

1. Reads the base URL from `VITE_API_BASE_URL`
2. Adds `Authorization: Bearer <token>` when a token exists
3. Sets `Content-Type: application/json` for JSON bodies (and leaves `FormData` alone so the browser can add the multipart boundary)
4. Sends the request with `fetch`
5. Parses the response and extracts a readable message from common error shapes (`message`, `detail`, `error`, `errors[]`, field errors)
6. Maps failures to clear messages:
   - **Network failure** → "Cannot connect to backend"
   - **401 on Sign In / Sign Up** → the backend's message (e.g. wrong password)
   - **401 elsewhere** → session cleared and user sent to `/auth`
   - **403 / 409 / 400** → the backend's own reason is shown

### Typical page pattern

```jsx
useEffect(() => {
  const load = async () => {
    try {
      setLoading(true);                       // skeleton loader
      const data = await apiRequest("/api/items/");
      setItems(normalize(data));              // map API fields to UI fields
    } catch (err) {
      setError(err.message);                  // friendly error + retry
    } finally {
      setLoading(false);
    }
  };
  load();
}, []);
```

### Authentication flow

1. `Auth.jsx` → `POST /api/auth/signin/` returns `accessToken`
2. Token is saved as `campus_access_token`; profile (`GET /api/user/me`) is saved as `campus_user`
3. Every later request carries the token automatically
4. `ProtectedRoute` guards all app pages; logout clears both keys

### Local storage keys

| Key | Purpose |
| --- | --- |
| `campus_access_token` | JWT used for API calls |
| `campus_user` | Cached profile (name, email, id) |
| `campus_my_items_<user>` | Ids of items reported from this device (for Edit / Delete / My Reports) |
| `campus_claim_decisions` | Claim decisions made from Notifications, so they stay visible after refresh |

---

## 🔌 API Reference

All endpoints are relative to `VITE_API_BASE_URL` and (except auth) require the bearer token.

### Auth & Profile

| Method | Endpoint | Used in | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/signup/` | `Auth.jsx` | Create an account (`name`, `email`, `password`) |
| `POST` | `/api/auth/signin/` | `Auth.jsx` | Sign in, returns `accessToken` |
| `GET` | `/api/user/me` | `Profile.jsx`, login | Current user (falls back to `/api/user/me/`) |

### Items

| Method | Endpoint | Used in | Description |
| --- | --- | --- | --- |
| `GET` | `/api/items/` | Items, Dashboard, ReportItem, MyReports, TrackClaim | List all items |
| `GET` | `/api/items/{id}/` | ItemDetails, EditItem | Single item |
| `POST` | `/api/items/` | ReportItem | Create item, **multipart/form-data**: `title`, `description`, `type` (`LOST`/`FOUND`), `location`, `eventDate`, optional `image` |
| `PUT` | `/api/items/{id}/` | EditItem | Update item (JSON, reporter only, photo not replaced) |
| `DELETE` | `/api/items/{id}/` | ItemDetails, MyReports | Delete item (reporter only) |

### Claims

| Method | Endpoint | Used in | Description |
| --- | --- | --- | --- |
| `POST` | `/api/claims/` | ClaimForm | Submit a claim (`itemId`, `description`) |
| `GET` | `/api/claims/` | TrackClaim, Dashboard | Claims submitted by the current user |
| `GET` | `/api/items/{itemId}/claims/` | ManageClaims | Claims received on an item |
| `POST` | `/api/claims/{id}/approve/` | ManageClaims, Notifications | Approve a claim |
| `POST` | `/api/claims/{id}/reject/` | ManageClaims, Notifications | Reject a claim |

### Notifications

| Method | Endpoint | Used in | Description |
| --- | --- | --- | --- |
| `GET` | `/api/notifications/` | Notifications, Dashboard, TrackClaim | List notifications (newest first) |
| `GET` | `/api/notifications/unread-count/` | Sidebar | Unread number → `{ unreadCount }` |
| `PATCH` | `/api/notifications/{id}/read/` | Notifications | Mark one as read |
| `PATCH` | `/api/notifications/read-all/` | Notifications | Mark all as read |

Notification types handled by the UI: `CLAIM_SUBMITTED`, `CLAIM_APPROVED`, `CLAIM_REJECTED`.

### Form limits

| Field | Limit |
| --- | --- |
| Title | 100 characters |
| Location | 150 characters |
| Description | 1000 characters |
| Photo | JPG, PNG or WEBP, up to 5 MB |
| Event date | Cannot be in the future |

---

## 🗺️ Routes

| Path | Page | Access |
| --- | --- | --- |
| `/auth` | Sign In / Sign Up (`/login`, `/signup` redirect here) | Public |
| `/dashboard` | Dashboard (`/` and `/home` redirect here) | Signed in |
| `/items` | Browse Items (`/browse-items` alias) | Signed in |
| `/items/:id` | Item Details | Signed in |
| `/items/:id/edit` | Edit Item | Signed in (reporter) |
| `/report-item` | Report an Item | Signed in |
| `/my-reports` | My Reports | Signed in |
| `/track-claim` | Track My Claims (`/track-claims` alias) | Signed in |
| `/manage-claims/:itemId` | Manage Claims for an item | Signed in (reporter) |
| `/notifications` | Notifications | Signed in |
| `/profile` | My Profile | Signed in |
| `*` | 404 Not Found | Signed in |

---

## 🌐 Deployment

The app is a static SPA, so it can be hosted on Netlify, Vercel, GitHub Pages, Cloudflare Pages and similar services.

### Netlify

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Publish directory | `dist` |
| Environment variable | `VITE_API_BASE_URL` = your backend URL |

**1. Single-page-app redirects.** Because React Router handles routing in the browser, refreshing a deep link such as `/dashboard` would return a 404. Create `public/_redirects` with:

```
/*    /index.html   200
```

**2. Allow your site in the backend CORS settings.** Add your deployed origin (for example `https://your-site.netlify.app`) to the backend's allowed origins, otherwise sign in will fail with *"Cannot connect to backend"*.

**3. Redeploy after changing environment variables**, since they are embedded at build time.

> If the backend runs on a free tier (for example Render), the first request after a period of inactivity can take up to a minute while the server wakes up.

---

## ⚠️ Known Limitations

These come from how the current backend API behaves and are handled in the UI where possible.

- **Reporter identity is not exposed by the API.** Items do not say who reported them, so the app remembers the ids of items you reported **on this device** (`campus_my_items_*`). Edit / Delete buttons and *My Reports* rely on that list. The backend still enforces who may edit, delete or review (403 otherwise). The *Manage claims* link is always reachable from an item page for the same reason.
- **Rejected claims can stay `PENDING` in the claims list.** The UI reads `CLAIM_APPROVED` / `CLAIM_REJECTED` notifications to show the real decision.
- **No "get single claim" endpoint**, so decisions made from *Notifications* are also cached on the device.
- **Lists are not paginated.** All items are fetched at once and filtered in the browser, which is fine for a campus-sized dataset but should move to server-side pagination as data grows.
- **Notification polling** runs every 60 seconds while the app is open.
- **Session token** is kept in `localStorage`, which is common for SPAs but is exposed to XSS if any is introduced.

---

## 🤝 Contributing

1. Fork the repository and create a branch: `git checkout -b feature/my-change`
2. Make your changes and run `npm run lint` and `npm run build`
3. Commit with a clear message: `git commit -m "Add: short description"`
4. Push the branch and open a Pull Request

Please keep all backend calls inside `src/services` and use `apiRequest` rather than calling `fetch` in components.

---

<div align="center">

Built to help belongings find their way home. 🏠

</div>
