# Public Kiosk View Plan

## Objective
Provide a read-only kiosk interface that displays real-time room availability across offices without requiring user authentication. The kiosk will run on shared displays in office lobbies and should auto-refresh, stay within booking constraints, and remain secure against unauthorized booking creation.

## Key Requirements
- **Read-only experience**: View upcoming availability, room status, and key amenities. No booking actions.
- **Auto-refresh**: Refresh availability every 60 seconds (configurable) without disrupting the kiosk layout.
- **Multi-office support**: Allow the kiosk to cycle through offices or focus on a single office.
- **Offline resilience**: Gracefully handle connectivity issues by showing the last known data timestamp and retrying quietly.
- **Security**: Use a scoped public token with rate limiting, CORS restrictions, and the ability to revoke kiosks individually.
- **Branding**: Full-screen layout compatible with TV displays, using Tailwind theming consistent with the member/admin UI.

## Architecture Overview
1. **Kiosk API Token**
   - Extend the database with a `kiosk_tokens` table (`id`, `name`, `token`, `office_id`, `is_active`, `last_used_at`).
   - Admin UI to generate and revoke tokens per kiosk device.
   - Middleware validates `X-Kiosk-Token` header and limits access to read-only routes.

2. **API Endpoint**
   - Route: `GET /api/v1/kiosks/availability` accepting query params:
     - `office_id` (optional) – filter by office.
     - `range` (default: `now` to `+4 hours`).
   - Response includes offices, rooms, amenities, and booking status grouped by timeslot for the requested window.
   - Utilizes existing availability service, ensuring business-hour and closure logic is reused.

3. **Frontend (Inertia + Vue)**
   - New public layout (`resources/js/Layouts/KioskLayout.vue`) optimized for fullscreen use.
   - Kiosk page components:
     - `KioskBoard.vue` – top-level board cycling through offices if multiple available.
     - `RoomStatusCard.vue` – shows room name, capacity, next booking, and amenity icons.
     - `AvailabilityTimeline.vue` – horizontal timeline highlighting busy/free segments.
   - Auto-refresh via `setInterval` or Vue `useIntervalFn`; show last refresh timestamp.
   - "No data" fallback with reconnect attempts and toast/indicator.

4. **Routing & Access**
   - Add `Route::middleware('kiosk')->get('/kiosk', ...)` that renders the Inertia view.
   - Kiosk guard reads token from query string on first load, stores in `localStorage`, and passes it via Axios headers.
   - Server ensures kiosk routes bypass standard auth while applying rate limiting (`ThrottleRequests` with custom key per token).

5. **Deployment Considerations**
   - Provide `.env` toggles for kiosk defaults (`KIOSK_REFRESH_SECONDS`, `KIOSK_DEFAULT_RANGE_MINUTES`).
   - Document steps to generate token and configure display devices.
   - Monitor kiosk usage via `last_used_at` column and scheduled pruning of inactive tokens.

## Implementation Steps
1. **Database & Model**
   - Create migration and `KioskToken` model with factory & seeder.
2. **Middleware**
   - Implement `EnsureKioskToken` middleware validating tokens and setting a guardable context (e.g., `Auth::setUser($kioskUser)` or dedicated container binding).
3. **API Controller**
   - Build `KioskAvailabilityController` that reuses `AvailabilityService` to fetch aggregated data per room.
4. **Frontend**
   - Scaffold Vue components under `resources/js/Pages/Kiosk`.
   - Add kiosk-specific CSS utilities (scroll snapping, auto-scaling typography).
5. **Admin UI Enhancements**
   - CRUD screens for kiosk tokens under `/admin/kiosks` with role-based permissions (`kiosk.manage`).
6. **Testing**
   - Feature tests for token validation and availability response structure.
   - Browser test (Laravel Dusk) verifying kiosk page renders and refreshes with mocked data.
7. **Docs**
   - Update README/handbook with kiosk setup instructions, token rotation policy, and troubleshooting tips.

## Open Questions
- Should kiosks cycle through multiple offices automatically or require manual selection? (Default to cycling with per-device configuration.)
- Do we need multi-language support on kiosk displays? (Out of scope for MVP, but plan translation keys.)
- How should we handle time zones in multi-region deployments? (Include timezone in response and render using browser locale.)

