# Codebase Audit Report: Cricket Turf Booking Platform

## 1. Project Overview

### What the Project Does
The Cricket Turf Booking Platform is a full-stack web application designed for booking slot times on a cricket turf. Customers can view available 1-hour slots for the next 7 days, select multiple consecutive slots, and submit a booking request. The checkout process uses a manual UPI payment flow: customers scan a dynamically generated UPI QR code, pay the total amount, enter their 12-digit transaction UTR number, and submit.
An admin dashboard allows turf owners to view the customer name, phone, and UTR details for pending slots, and manually approve bookings (marking them "confirmed") or clear/cancel bookings (releasing the slots back to the public pool).

### Main Features Implemented
* **Interactive Slot Browser:** Calendar navigation for a 7-day range, with hourly slot availability grids.
* **Consecutive Selection Restraints:** Logic to prevent selecting disconnected time slots (only sequential slots are allowed to be added to the cart).
* **UPI Payment Modal:** QR Code generation using UPI string syntax (`upi://pay?pa=...`) and manual transaction (UTR) confirmation input.
* **Booking Verification & Cancellation:** Customers can query their booking using a Booking Group ID and phone number to selectively cancel their booked slots.
* **Admin Control Center:** Dashboard to block slots offline, clear bookings, and verify/approve pending payments.
* **Database Auto-Seeding:** Automated generator that creates slots between 6 AM and 11 PM for any date queried by traffic if they do not yet exist.

### Tech Stack
* **Framework:** [Next.js v16.2.9](file:///Users/gourav/Desktop/development/Cricket-Turf-Booking-Platform/package.json#L18) (App Router)
* **Library:** [React v19.2.4](file:///Users/gourav/Desktop/development/Cricket-Turf-Booking-Platform/package.json#L22) (with `reactCompiler: true` active in `next.config.mjs`)
* **Styling:** CSS Modules with Vanilla CSS, with Tailwind CSS v4 and PostCSS pre-configured.
* **Database:** PostgreSQL (utilizing the `pg` client driver, interfacing with a Neon Postgres cloud instance).
* **QR Generation:** `qrcode.react` for rendering client-side SVG QR codes.

---

## 2. Repository Walkthrough

### Tree View of Project Structure
```
.
├── .env                         # Environment variables (DB credentials, UPI configuration)
├── .gitignore                   # Git exclusion settings
├── AGENTS.md                    # Custom Next.js instructions
├── CLAUDE.md                    # Environment run scripts instructions
├── README.md                    # Default boilerplate README
├── app/                         # App router pages and API paths
│   ├── layout.js                # Global page wrapping (injects fonts and base styles)
│   ├── globals.css              # Global styling settings & custom CSS variables
│   ├── page.js                  # Main customer-facing booking dashboard
│   ├── page.module.css          # Styles for the customer main page
│   ├── favicon.ico              # Website icon
│   ├── admin/                   # Admin portal paths
│   │   ├── page.js              # Admin Dashboard table
│   │   ├── page.module.css      # CSS module for Admin dashboard
│   │   └── login/               # Admin verification entry
│   │       ├── page.js          # Admin Login screen (unsecured password check)
│   │       └── page.module.css  # Styles for login screen
│   ├── cancel/                  # Booking cancellation panel
│   │   ├── page.js              # Customer cancellation screen
│   │   └── page.module.css      # Styles for cancellation screen
│   └── api/                     # Backend API endpoints
│       ├── admin/
│       │   └── bookings/
│       │       └── route.js     # Admin write actions: Approve (PATCH), Block (POST), Clear (DELETE)
│       ├── bookings/
│       │   └── route.js         # Booking transactions: Create (POST), Cancel (DELETE), Find (GET)
│       ├── config/
│       │   └── route.js         # API fetching UPI configuration (ID and Name)
│       └── slots/
│           └── route.js         # API fetching slots (Public slot list or detailed Admin view)
├── components/                  # Reusable client components
│   ├── BookingModal.js          # Customer checkout overlay (Info & QR payment)
│   ├── BookingModal.module.css  # Styles for checkout modal
│   ├── DatePicker.js            # Date selector (7-day range)
│   ├── DatePicker.module.css    # Styles for date selector
│   ├── SlotGrid.js              # Visual time-slot matrix
│   ├── SlotGrid.module.css      # Styles for time-slot matrix
│   ├── SuccessModal.js          # Post-checkout overlay displaying Group ID
│   └── SuccessModal.module.css  # Styles for success overlay
├── lib/                         # Server-side helper modules
│   ├── db.js                    # PostgreSQL connection pool setup
│   └── slot-utils.js            # Slot auto-seeding business logic
├── scripts/                     # Standalone CLI tools/migration scripts
│   ├── init-db.js               # Creates database and base tables
│   ├── seed.js                  # Seeds database with slots for 7 days ahead
│   ├── update-db.js             # Schema migration adding group IDs
│   ├── update-db-upi.js         # Schema migration adding payment status and transaction UTR
│   └── update-prices.js         # CLI tool to batch update existing slot pricing
├── eslint.config.mjs            # ESLint config
├── jsconfig.json                # Project alias configurations (e.g. "@/*")
├── next.config.mjs              # Compiler options
├── postcss.config.mjs           # CSS processing configuration
├── package.json                 # Dependency versioning and scripts
└── package-lock.json            # Lock file
```

### Folder Purpose & Component Connections

1. **Database Layer (`lib/` & `scripts/`):**
   * [db.js](file:///Users/gourav/Desktop/development/Cricket-Turf-Booking-Platform/lib/db.js) initializes the database connection pool using environment credentials in `.env`.
   * [slot-utils.js](file:///Users/gourav/Desktop/development/Cricket-Turf-Booking-Platform/lib/slot-utils.js) provides the logic to pre-populate slot records in the database.
   * CLI tools in `scripts/` are used to establish schema, migrate columns for payment data (`status`, `transaction_id`), and run seeding routines.

2. **Backend API Endpoints (`app/api/`):**
   * `api/config` retrieves settings stored on the host server (`UPI_ID`, `UPI_NAME`).
   * `api/slots` handles calendar queries. It executes auto-seeding if the date doesn't exist. If provided with a correct `adminPassword` query parameter, it performs a SQL `LEFT JOIN` on `bookings` to expose user identities and transaction details.
   * `api/bookings` manages the creation of bookings. `POST` implements a database Transaction (`BEGIN` ... `COMMIT`) to block the selected slots atomically, preventing double-bookings. `DELETE` processes customer-initiated cancellations.
   * `api/admin/bookings` provides administrative privileges: `PATCH` updates booking status, `POST` inserts offline blocking rows, and `DELETE` clears bookings (which deletes the row).

3. **Frontend Views (`app/` & `components/`):**
   * The **Booking Interface ([app/page.js](file:///Users/gourav/Desktop/development/Cricket-Turf-Booking-Platform/app/page.js))** is the root component. It manages states for selected date, slots, and cart items.
   * **DatePicker** and **SlotGrid** feed date changes and slot selections back to the root page state.
   * When checking out, the root opens **BookingModal**, which queries `/api/config` to display a pay-to QR code. The modal receives customer parameters, posts them to `/api/bookings`, and fires a callback to trigger **SuccessModal** showing the generated unique `bookingGroupId`.
   * **CancelPage** is a separate client module that lets customers search, filter, and release booked slots by requesting `DELETE` on `/api/bookings`.
   * **AdminDashboard** manages state for slot updates. It loads credential keys from `localStorage` to authorize detail-rich queries from `/api/slots` and authorize modifications through `/api/admin/bookings`.

---

## 3. Feature Audit

* **Turf Slot Browsing**
  * **Status:** Complete
  * **Files:**
    * [app/page.js](file:///Users/gourav/Desktop/development/Cricket-Turf-Booking-Platform/app/page.js)
    * [components/DatePicker.js](file:///Users/gourav/Desktop/development/Cricket-Turf-Booking-Platform/components/DatePicker.js)
    * [components/SlotGrid.js](file:///Users/gourav/Desktop/development/Cricket-Turf-Booking-Platform/components/SlotGrid.js)
    * [app/api/slots/route.js](file:///Users/gourav/Desktop/development/Cricket-Turf-Booking-Platform/app/api/slots/route.js)
  * **Notes:** Allows selecting days from a dropdown and renders time-slot tiles showing slot ranges, prices, and booking status.

* **Consecutive Slot Selection**
  * **Status:** Complete
  * **Files:**
    * [app/page.js](file:///Users/gourav/Desktop/development/Cricket-Turf-Booking-Platform/app/page.js#L45-L76)
    * [components/SlotGrid.js](file:///Users/gourav/Desktop/development/Cricket-Turf-Booking-Platform/components/SlotGrid.js)
  * **Notes:** Frontend selection logic checks slot time adjacency. If a non-consecutive slot is clicked, the selection is reset to start a new sequence from that slot.

* **Manual UPI Checkout (QR Code)**
  * **Status:** Complete
  * **Files:**
    * [components/BookingModal.js](file:///Users/gourav/Desktop/development/Cricket-Turf-Booking-Platform/components/BookingModal.js)
    * [app/api/config/route.js](file:///Users/gourav/Desktop/development/Cricket-Turf-Booking-Platform/app/api/config/route.js)
  * **Notes:** Displays a QR code matching standard UPI protocol templates (`upi://pay?pa=...`) using owner settings. Captures user inputs (Name, Phone, 12-digit UTR verification code).

* **Atomic Double-Booking Protection**
  * **Status:** Complete
  * **Files:**
    * [app/api/bookings/route.js](file:///Users/gourav/Desktop/development/Cricket-Turf-Booking-Platform/app/api/bookings/route.js#L6-L56)
  * **Notes:** Uses a PostgreSQL transaction block (`BEGIN` / `COMMIT` / `ROLLBACK`). It queries slot availability inside the transaction and cancels if any of the target slots are already booked (`is_booked = TRUE`), preventing race conditions.

* **Booking Cancellation**
  * **Status:** Complete (but with critical design issues)
  * **Files:**
    * [app/cancel/page.js](file:///Users/gourav/Desktop/development/Cricket-Turf-Booking-Platform/app/cancel/page.js)
    * [app/api/bookings/route.js](file:///Users/gourav/Desktop/development/Cricket-Turf-Booking-Platform/app/api/bookings/route.js#L58-L96)
  * **Notes:** Customers search for bookings via ID and phone number, select individual slots, and execute cancellation. However, this triggers a **hard delete** on the database booking record, completely wiping the transaction history.

* **Admin Panel & Login**
  * **Status:** Broken / Insecure
  * **Files:**
    * [app/admin/page.js](file:///Users/gourav/Desktop/development/Cricket-Turf-Booking-Platform/app/admin/page.js)
    * [app/admin/login/page.js](file:///Users/gourav/Desktop/development/Cricket-Turf-Booking-Platform/app/admin/login/page.js)
    * [app/api/admin/bookings/route.js](file:///Users/gourav/Desktop/development/Cricket-Turf-Booking-Platform/app/api/admin/bookings/route.js)
  * **Notes:** Has no backend session, cookies, or JWT verification. Admin authentication relies entirely on reading a plain-text password from `localStorage` and passing it as a query parameter in URLs. If the password is wrong, the server degrades the slots list query to public view instead of returning a 401, resulting in broken table views. Additionally, compilation fails due to ESLint hoisting and navigation link errors.

---

## 4. Architecture Audit

### Data Flow
1. **Calendar Browsing:** The browser makes a `GET` request to `/api/slots?date=YYYY-MM-DD`. The server queries the database. If no slots are found for that date, it automatically seeds them (from 6 AM to 11 PM) before returning the slots payload.
2. **Booking Attempt:** The user fills out checkout details in the modal. This triggers a `POST` request to `/api/bookings` with slot IDs, customer name, phone number, and transaction UTR.
3. **Database Transaction:** The server starts a transaction block (`BEGIN`). It checks slot availability. If available, it inserts a pending booking row for each slot and blocks the slots (`is_booked = TRUE`).
4. **Verification Flow:** The bookings are initially flagged as `pending`. The admin fetches slot details (which include customer names and transaction UTRs if authorized with the password) and chooses to either confirm the booking (updates status to `confirmed`) or cancel/delete it to release the slots.

### State Management
* Fully localized React state (`useState`) within individual pages and components.
* No unified caching (such as TanStack Query or SWR) is used, causing manual, raw HTTP requests inside `useEffect` hooks. Re-fetches are triggered via imperatively calling state-updating functions.

### Component Hierarchy
```
Home (app/page.js)
  ├── DatePicker (components/DatePicker.js)
  ├── SlotGrid (components/SlotGrid.js)
  ├── BookingModal (components/BookingModal.js)
  │     └── QRCodeSVG (qrcode.react)
  └── SuccessModal (components/SuccessModal.js)

AdminDashboard (app/admin/page.js)
  └── DatePicker (components/DatePicker.js)

AdminLoginPage (app/admin/login/page.js)

CancelPage (app/cancel/page.js)
```

### Major Architectural Problems
1. **Database Client Pool Exhaustion:**
   * [lib/db.js](file:///Users/gourav/Desktop/development/Cricket-Turf-Booking-Platform/lib/db.js) instantiates a global connection pool. In serverless deployment setups (like Vercel), each incoming server request or function initialization creates a separate runtime. This can quickly exhaust database connection limits on Neon under load.
2. **Destruction of Audit Trails (Hard Deletes):**
   * Customer cancellations and admin removals execute hard SQL `DELETE` statements on the database. Because the database enforces a `slot_id UNIQUE` constraint on the `bookings` table, rows must be permanently deleted to free up the slot for future bookings. The system loses all financial history of cancelled sessions and payments.
3. **Absence of Real Authentication:**
   * Route authorization relies on local storage reading and parameter-passing over raw URL queries. Anyone can view dashboard frameworks simply by typing `/admin` (resulting in broken UI components because the server silently drops booking details when the password query is empty).
4. **No UTR Unique Constraints:**
   * The UPI booking logic does not validate the structure of the UTR transaction number or prevent duplicate entries. Users can enter identical transaction proofs multiple times to book multiple sessions for free.

---

## 5. Code Quality Audit

### Duplicate Code
* **Raw SQL Execution:** Raw SQL query strings are scattered inside Next.js route files instead of being housed in a clean Data Access Layer (DAL) or service wrapper.
* **Component Selectors:** Date dropdown navigation logic is implemented on pages independently.

### Dead Code / Unused Assets
* **Unused Dependencies:** `razorpay` is defined in [package.json](file:///Users/gourav/Desktop/development/Cricket-Turf-Booking-Platform/package.json#L21) but is never imported or used.
* **Boilerplate Assets:** Multiple template SVGs inside `/public` (`globe.svg`, `window.svg`, `file.svg`) are unused.

### Bad Naming & Logic Fragility
* **Lexical Hoisting Violations:**
  * In [app/page.js](file:///Users/gourav/Desktop/development/Cricket-Turf-Booking-Platform/app/page.js#L20) and [app/admin/page.js](file:///Users/gourav/Desktop/development/Cricket-Turf-Booking-Platform/app/admin/page.js#L26), functions like `fetchSlots` are called inside hooks before they are declared as variables, causing ESLint compiler failures.
* **Pricing Synchronization Gap:**
  * [lib/slot-utils.js](file:///Users/gourav/Desktop/development/Cricket-Turf-Booking-Platform/lib/slot-utils.js#L16) hardcodes slot prices at `10.00`. Running the script [scripts/update-prices.js](file:///Users/gourav/Desktop/development/Cricket-Turf-Booking-Platform/scripts/update-prices.js) updates current records, but any newly generated future dates seeded via traffic will revert to the outdated hardcoded ₹10.00 rate.

---

## 6. Problems & Risks

### Critical (Must Fix Immediately to Launch/Build)
1. **ESLint Failures Block Compilation:** The project cannot build for production (`next build` fails) due to lexical hoisting violations (`fetchSlots` used before declaration) and bad routing links (`<a>` elements instead of `<Link>`).
2. **Insecure Cleartext Admin Login:** Storing the administrative password inside `localStorage` and passing it over raw URL queries exposes the owner's system to trivial security intercepts.

### High (Causes Architectural and Business Failures)
1. **Permanent Wiping of Auditing Records:** Executing SQL `DELETE` queries on cancellation deletes all booking histories. Turf owners have no ledger of refunds, transaction volumes, or cancelled bookings.
2. **No UTR Integrity checks:** Lack of uniqueness checks on UTR IDs (`transaction_id`) in `bookings` allows users to submit the same payment proof multiple times to block turf times for free.
3. **Price Drift in Auto-Seeder:** Out-of-sync hardcoded defaults (`₹10.00` in slot-utils vs updated script values) results in newly created dates being offered at cheaper rates than intended.

### Medium (Affects Performance and Clean Maintenance)
1. **Database Client Pool Leakage:** Lacks serverless pool configurations (e.g., transaction/connection caps), exposing the database to connection starvation on scale.
2. **Synchronous SetState inside UseEffect:** Triggers React state updates (`setSelectedSlots([])`) directly during effects, causing redundant, heavy render cycles.
3. **Stale Blocked Slots:** "Pending" slots that fail payment verification block other customers indefinitely unless manually removed by the administrator.

### Low (Aesthetics and Configuration Upgrades)
1. **Generic Design Language:** The visual design is basic and native-looking. It lacks premium aesthetics like smooth animations, micro-interactions, dark mode, or refined responsive modals.
2. **Rigid Slot Hours:** 6 AM to 11 PM timings are hardcoded inside backend utility modules, requiring development edits to adjust the turf's hours of operation.

---

## 7. Continue or Rewrite?

### Recommendation: Refactor and Partial Rewrite
A full system rewrite is **not recommended** because the core database transactions, consecutive booking checks, and page relationships are valid. Instead, we should proceed with a target-focused **Refactor and Partial Rewrite**:

* **Why?**
  * The API schema and query mechanics can be modified in-place to shift from hard deletes to status flags.
  * The frontend files are clean enough to be visually upgraded and fixed without discarding existing logic.
  * The login system needs a partial rewrite to integrate secure HTTP-Only cookie verification, middleware redirection, and credential security.
  * The hoisting errors and Next.js compiler issues can be solved with minor structural refactoring.

---

## 8. Next Steps

Below are the top 10 most critical actions required to resolve these issues:

1. **Resolve ESLint Compile Errors:** Refactor arrow functions (hoist them or put them inside `useCallback`), and swap HTML `<a>` tags with Next.js `<Link>` components to get the build passing.
2. **Introduce Cookie-Based Admin Authentication:** Replace the plain-text `localStorage` system with secure HTTP-Only cookie tokens, and apply Next.js Middleware to shield `/admin` paths.
3. **Eliminate Hard Deletes (Audit Trail Preservation):** Relax the `slot_id UNIQUE` constraint on the `bookings` table (or migrate cancelled records to a historical logging table) so that cancellation is a status flag (e.g. `'cancelled'`) rather than a database row delete.
4. **Implement UTR Validation and Uniqueness Checks:** Add server-side regex format checking for 12-digit UPI UTR strings, and add a database unique constraint on `transaction_id` to prevent payment double-spending fraud.
5. **Synchronize Auto-Seeding Prices:** Move the default slot price configuration to environment settings or a database config record, ensuring the auto-seeder uses the current active price.
6. **Apply Serverless Database Connection Limits:** Configure the PostgreSQL pool connection boundaries in `lib/db.js` using appropriate sizing or an external connection pool manager to avoid client crashes.
7. **Clean Unused Dependencies:** Remove the unused `razorpay` npm package and clean up boilerplate icons in `/public`.
8. **Add Pending Slot Expiry Mechanism:** Create a script or cron job path to automatically release slots that have been stuck in `pending` status for more than 20 minutes.
9. **Upgrade Frontend UI/UX to Premium Design:** Redesign the layouts with premium CSS Module variables, glassmorphism card designs, loading spinners, state transition animations, and improved styling.
10. **Build a Data Access Layer (DAL):** Move raw database querying logic out of the Next.js API routes into a separate services directory (e.g., `lib/services/`) to clean up API logic.
