# QA Static Code Analysis & Test Execution Report

**Project:** Campus Lost & Found (`university-lost-found`)  
**Tech Stack:** React 19.3.1, React Router DOM 7.18.5, Tailwind CSS 4.3.5, Vite 8.3.6  
**Backend Target:** `https://lost-and-found-ozl2.onrender.com`  
**Date:** November 18, 2026  
**Overall QA Verdict:** **CONDITIONAL PASS (Ready for Staging; 3 High-Priority & 5 Medium-Priority Issues Identified)**

---

## 1. Executive Test Summary

| Test Category | Status | Defect Count | Critical Findings |
| :--- | :--- | :--- | :--- |
| **Smoke Testing** | PASS | 0 | All routes, protected guards, and API wrappers initialize properly. |
| **Model-Based Testing** | WARN | 2 | State desynchronization in `localStorage` claim decisions across devices. |
| **Integrity Testing** | FAIL | 3 | Committed `.env` file, missing logout cleanup, and dead code artifacts. |
| **Load & Performance** | FAIL | 2 | Full collection fetch ($O(N)$ payload) on `TrackClaim` & client-side pagination. |
| **Regression Testing** | WARN | 1 | Heuristic ownership check (`checkOwnership`) vulnerable to missing backend fields. |

---

## 2. Smoke Testing Results (Build & Core Path Verification)

Smoke tests evaluate whether the application's critical functionalities compile, mount, and execute without crashing.

* **ST-01: Application Bootstrap & Routing (`main.jsx`, `App.jsx`) — PASS**
  * `BrowserRouter` and `ToastProvider` wrap `<App/>` cleanly.
  * Legacy/alias redirects (`/login` $\rightarrow$ `/auth`, `/signup` $\rightarrow$ `/auth`, `/` $\rightarrow$ `/dashboard`, `/home` $\rightarrow$ `/dashboard`, `/browse-items` $\rightarrow$ `/items`, `/track-claims` $\rightarrow$ `/track-claim`) resolve without infinite loops.
* **ST-02: Authentication Guard (`ProtectedRoute.jsx`) — PASS**
  * Unauthenticated requests are intercepted via `isAuthenticated()` (checking `localStorage.getItem("campus_access_token")`) and redirected to `/auth` with `replace`.
* **ST-03: Multipart Report Submission (`ReportItem.jsx`) — PASS**
  * `apiRequest` in `src/services/api.js` properly detects `options.body instanceof FormData` and omits the `Content-Type: application/json` header, allowing the browser to attach the multipart boundary for image uploads.
* **ST-04: Global Error Handling & 401 Interceptor (`api.js`) — PASS**
  * Non-auth endpoints returning `HTTP 401` automatically purge `campus_access_token` and `campus_user` and redirect via `window.location.replace("/auth")`, while `/api/auth/` 401s preserve the backend error message ("Invalid email or password.").

---

## 3. Model-Based Testing (State Machines & Transition Analysis)

Model-based testing validates the finite state machines governing user sessions, items, and claims.

### Model A: Authentication & Profile State Machine
* **States:** `Unauthenticated` $\rightarrow$ `Authenticating` $\rightarrow$ `Authenticated (Full Profile)` OR `Authenticated (Fallback Profile)` $\rightarrow$ `Session Expired`.
* **Defect MB-01 (Medium) — Fallback Profile Breaks Ownership Model:**
  * **Location:** `src/services/authService.js` (Lines 52–68) & `src/pages/ItemDetails.jsx` (Lines 35–68).
  * **Analysis:** During `loginUser()`, if `requestProfile()` (`/api/user/me`) fails, the app catches the error and saves `fallbackUser = { email }` into `localStorage`. If the backend item payload only returns a numeric `userId` or `reporterId` (and not `reporterEmail`), `checkOwnership(item, user)` returns `null` because `user.id` is `undefined`.
  * **Result:** A reporter logged in under the fallback state sees the **"Claim This Item"** button on their own reported item instead of **"Manage Claims"**.

### Model B: Claim Lifecycle State Machine
* **States:** `UNCLAIMED` $\rightarrow$ `PENDING` (via `ClaimForm.jsx`) $\rightarrow$ `APPROVED` | `REJECTED` (via `ManageClaims.jsx` or `Notifications.jsx`).
* **Defect MB-02 (Medium) — Cross-Page & Cross-User State Desynchronization:**
  * **Location:** `src/pages/Notifications.jsx` (Lines 14–33, 189–212).
  * **Analysis:** `Notifications.jsx` persists claim review decisions in `localStorage` under `campus_claim_decisions` (`{ [claimId]: "APPROVED" | "REJECTED" }`) because notification objects lack live claim status.
  * **Result:** 
    1. If a reporter approves a claim inside `ManageClaims.jsx`, `campus_claim_decisions` in `localStorage` is **not** updated. Navigating to `Notifications.jsx` still renders the active **"Approve / Reject"** buttons for that already-decided claim.
    2. `logoutUser()` in `authService.js` does **not** clear `campus_claim_decisions`. If User B logs in on the same browser, they inherit User A's cached claim decision map.

---

## 4. Integrity Testing (Data, Security & Codebase Hygiene)

Integrity testing verifies data consistency, security boundaries, and repository cleanliness.

* **Defect INT-01 (High) — Environment File Committed to Archive:**
  * **Location:** `.env` (Root directory).
  * **Analysis:** Even though `.env` is listed in `.gitignore`, the `.env` file (`VITE_API_BASE_URL=https://lost-and-found-ozl2.onrender.com`) is packaged directly inside the repository archive.
* **Defect INT-02 (Medium) — Incomplete Session Cleanup on Logout:**
  * **Location:** `src/services/authService.js` (`logoutUser`, Lines 88–91).
  * **Analysis:** `logoutUser()` removes `campus_access_token` and `campus_user`, but leaves `campus_claim_decisions` in `localStorage`.
* **Defect INT-03 (Medium) — Dead Code & Orphaned Components:**
  * **Location:** `src/pages/Home.jsx` (24.4 KB), `src/components/Navbar.jsx` (7.2 KB), `src/data/items.js` (2.5 KB), `src/App.css` (0 bytes), `src/pages/ItemDetails.css` (not imported in `ItemDetails.jsx`), `src/components/ClaimForm.css` (not imported in `ClaimForm.jsx`).
  * **Analysis:** `App.jsx` redirects `/home` directly to `/dashboard` and uses `Sidebar.jsx` inside `MainLayout.jsx`. `Home.jsx`, `Navbar.jsx`, and `demoItems` (`src/data/items.js`) are never imported or rendered anywhere in the active routing tree, bloating the codebase.
* **Defect INT-04 (Low) — Client-Side MIME Type Bypass Risk:**
  * **Location:** `src/utils/items.js` (`validateImageFile`, Lines 20–32).
  * **Analysis:** Validation relies strictly on `file.type` (`["image/jpeg", "image/png", "image/webp"]`), which is derived from the OS file extension and can be spoofed. Magic-byte verification or strict backend validation is required.
* **Defect INT-05 (Low) — Timezone Drift on Date Boundary Validation:**
  * **Location:** `src/pages/ReportItem.jsx` (Line 69).
  * **Analysis:** `const today = new Date().toLocaleDateString("en-CA");` is used for `<input type="date" max={today} />`, whereas `ItemCard.jsx` computes relative days using `new Date(\`${eventDate}T00:00:00\`)` against `Date.now()`. Near midnight across UTC offsets, `Math.round((Date.now() - parsed.getTime()) / DAY)` can evaluate to `1` ("Yesterday") for an item reported today.

---

## 5. Load & Performance Testing Analysis

Static performance and scalability analysis under simulated high-volume campus usage (e.g., $2,000+$ reported items and $500+$ claims).

* **Defect LD-01 (High) — Redundant Full-Collection Fetch ($O(N)$ Over-Fetching) in `TrackClaim.jsx`:**
  * **Location:** `src/pages/TrackClaim.jsx` (Lines 47–74).
  * **Analysis:** To display the title and thumbnail for a user's 1 or 2 claims, `TrackClaim.jsx` fires `apiRequest("/api/items/")` in parallel with `/api/claims/` and builds an in-memory map (`itemsById`) of every item ever reported on campus.
  * **Impact:** As the items table grows to thousands of records, opening `TrackClaim` transfers megabytes of unnecessary JSON and blocks the main thread during map construction.
* **Defect LD-02 (High) — Absence of Pagination / Virtualization on Item & Report Lists:**
  * **Location:** `src/pages/Items.jsx` (Lines 71–85), `src/pages/ReportItem.jsx` (Lines 71–87), `src/pages/Dashboard.jsx` (Lines 97–102).
  * **Analysis:** All three pages fetch the entire `/api/items/` dataset in a single request and render all matching DOM nodes simultaneously (except `Dashboard.jsx`, which slices the top 5 *after* downloading and sorting the entire array in memory).
  * **Impact:** At $>500$ items, DOM node count and image requests (even with `loading="lazy"`) will degrade Largest Contentful Paint (LCP) and input responsiveness during search filtering (`Items.jsx` re-runs `.filter()` and `.join(" ")` across all items on every keystroke without debouncing).
* **Defect LD-03 (Low) — Unpaused Background Polling in `Sidebar.jsx`:**
  * **Location:** `src/components/Sidebar.jsx` (Lines 232–255).
  * **Analysis:** `window.setInterval(refresh, 60000)` polls `/api/notifications/unread-count/` every 60 seconds AND on every route change (`location.pathname`), even when the browser tab is hidden (`document.visibilityState === "hidden"`).
  * **Impact:** $500$ students leaving tabs open in the background generates $30,000\text{ requests/hour}$ against the Render backend instance.

---

## 6. Regression Testing Matrix & Vulnerabilities

This suite targets fragile logic paths that are highly susceptible to breaking when backend schemas or React dependencies evolve.

| Test ID | Target Module | Regression Scenario | Current Behavior / Risk | Severity |
| :--- | :--- | :--- | :--- | :--- |
| **REG-01** | `ItemDetails.jsx` (`checkOwnership`) | Backend changes item owner field name or omits email/ID in `/api/items/:id/`. | Iterates through 12 guessed keys (`OWNER_KEYS`). If no match is comparable, returns `null`, showing "Claim This Item" to the item's own creator. | **Medium** |
| **REG-02** | `ClaimForm.jsx` (`handleSubmit`) | Backend switches from numeric primary keys (`123`) to numeric-prefixed strings or BigInts. | `const numericId = Number(itemId)` converts large integers ($> 2^{53}-1$) with precision loss or whitespace strings (`" "`) to `0`. | **Low** |
| **REG-03** | `authService.js` (`requestProfile`) | Backend `/api/user/me` returns 404/500 and fallback `/api/user/me/` also fails. | Double network penalty on every profile load before throwing error. | **Low** |
| **REG-04** | `ReportItem.jsx` (`normalizeItem`) | Backend returns `type: "lost"` (lowercase) or `status: "FOUND"` on newly created item POST response. | `ReportItem.jsx` checks `item.type === "LOST" ? "Lost" : "Found"` strictly case-sensitively (unlike `Items.jsx` which uses `.toUpperCase()`), mislabeling lowercase `"lost"` as `"Found"`. | **Medium** |
| **REG-05** | `ManageClaims.jsx` (`hasApproved`) | Backend returns `"ACCEPTED"` instead of `"APPROVED"` for an approved claim. | `FINAL_STATUSES` includes `"ACCEPTED"`, so buttons hide for that claim, but `hasApproved` strictly checks `=== "APPROVED"`, allowing a second claim on the same item to be approved. | **Medium** |

---

## 7. Prioritized Remediation Plan for Developers

1. **Fix `ReportItem.jsx` Normalization Inconsistency (REG-04):**
   Update `normalizeItem` in `src/pages/ReportItem.jsx` (Line 11) to use `String(item.type || item.status || "").toUpperCase() === "LOST" ? "Lost" : "Found"` to match `Items.jsx` and `Dashboard.jsx`.
2. **Fix `ManageClaims.jsx` Multiple-Approval Guard (REG-05):**
   Change `hasApproved` in `src/pages/ManageClaims.jsx` (Line 121) to check `["APPROVED", "ACCEPTED"].includes(String(claim.status || "").toUpperCase())`.
3. **Sync Claim Decisions & Purge on Logout (MB-02 / INT-02):**
   Export `saveDecision` from `Notifications.jsx` (or move to `src/utils/claims.js`), call it inside `ManageClaims.jsx` when approving/rejecting, and remove `DECISIONS_KEY` (`campus_claim_decisions`) inside `logoutUser()` in `src/services/authService.js`.
4. **Eliminate Full Items Fetch in `TrackClaim.jsx` (LD-01):**
   Fetch only missing item details via `Promise.all` on unique `itemId`s from the user's claims list (`/api/items/${id}/`), or include nested item summaries in the `/api/claims/` backend serializer.
5. **Clean Up Unused Files (INT-03):**
   Remove unused `src/pages/Home.jsx`, `src/components/Navbar.jsx`, `src/data/items.js`, `src/App.css`, `src/pages/ItemDetails.css`, and `src/components/ClaimForm.css` (or wire them into the router/components if intended for public landing view).