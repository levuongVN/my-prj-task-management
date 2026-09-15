# Agents.md

This file is the working guide for AI agents modifying this repository.

## Token & Efficiency Rules

1. **Strict Context Boundary:** Only search and read files inside `src/features/<target-feature>/` first. Do NOT scan the entire project using broad glob searches unless explicit instructions require cross-feature modifications.
2. **Model Usage:** Use light models for simple UI/file tweaks. Do not prompt for deep reasoning on routine tasks.

## Project Overview

- Stack: React 19, TypeScript, Vite, Tailwind CSS v4, React Router, TanStack Query, Zustand, Axios, React Hook Form, Zod, Lucide React, react-hot-toast, and SignalR.
- This is a task management application with dashboard, tasks, projects, calendar, analytics, settings, authentication, device management, and notifications.
- The app uses the React Compiler. Do not add `useMemo` or `useCallback` by default. Add them only when they solve a measured or clear render/data-computation problem, or when required by an existing memoized child/component pattern.
- UI text is English. Do not introduce Vietnamese UI labels, toasts, or user-facing messages.

## Before Editing

1. Read the relevant files and understand the existing feature pattern before changing code.
2. Check `git status` and preserve unrelated user changes. Never reset, checkout, or revert work that was not made by you.
3. Search for existing components, hooks, services, types, and routes before creating new ones.
4. If backend behavior, endpoint shape, auth behavior, or product behavior is unclear, ask the user instead of guessing.
5. Keep changes focused. Do not refactor unrelated code while implementing a feature.

## Repository Structure

```text
src/
  app/                 App providers, including QueryClient and Toaster
  components/          App-level components such as ProtectedRoute
  contexts/            Theme context/provider
  features/            Feature modules
    auth/
    analytics/
    calendar/
    device/
    notification/
    project/
    settings/
    task/
    user/
  layouts/             Main authenticated layout, Topbar, Sidebar
  pages/               Route-level page components
  routes/              React Router configuration
  shared/
    components/        Reusable UI components
    hooks/              Shared hooks
    services/           Shared Axios client
    types/              Shared domain types
    utils/              Shared data adapters/utilities
```

Use this feature convention when adding code:

```text
src/features/<feature>/
  components/
  hooks/
  services/
  types/
  schemas/
  utils/
```

Use the existing naming and casing in the target feature. The calendar feature currently contains legacy `Hooks/` and `Services/` directories; do not rename them casually because imports and existing work depend on them.

## Data and API Rules

- Use the shared client from `src/shared/services/axios.ts` for authenticated REST requests:

```ts
import api from "../../../shared/services/axios";
```

- Do not create a second Axios client unless there is a concrete, documented reason.
- The REST base URL comes from `VITE_API_URL` in `.env`. Current development value:

```text
VITE_API_URL=http://localhost:5292/api
```

- The Axios request interceptor reads `localStorage.accessToken` and sends `Authorization: Bearer <token>`.
- The Axios response interceptor refreshes expired tokens using `localStorage.refreshToken`, shares concurrent refresh requests, updates stored user/token data, and redirects to `/login` when refresh fails.
- Do not hardcode API URLs in feature services.
- Keep request/response DTO types separate from UI/domain types when the backend shape differs.
- Transform backend data at the service/store/adapter boundary, not inside presentational components.

## Authentication

- Protected routes are mounted through `ProtectedRoute` and `MainLayout`.
- Auth tokens are stored under:
  - `accessToken`
  - `refreshToken`
  - `user`
- Login sends the device payload with a persistent fingerprint stored under `taskflow_device_fingerprint`.
- Do not log tokens, passwords, refresh tokens, or private user data.
- When changing logout or refresh behavior, verify both normal logout and expired-token behavior.

## Notification Feature

The notification UI is currently integrated into the notification bell in `Topbar`. Do not add a separate notification page unless explicitly requested.

### REST endpoints

All endpoints require authentication and are accessed through the shared Axios client:

```text
GET  /notifications?take=50
GET  /notifications/unread-count
POST /notifications/{id}/read
POST /notifications/read-all
```

### Backend DTO

```ts
interface NotificationDto {
  id: string;
  type: number; // 1 deadline approaching, 2 overdue, 3 meeting reminder
  title: string;
  message: string;
  taskId: string | null;
  projectId: string | null;
  meetingId: string | null;
  isRead: boolean;
  createdAt: string;
}
```

### Type mapping

- `1` maps to `task-deadline` and uses a deadline/alarm icon and blue styling.
- `2` maps to `task-overdue` and uses a red warning/overdue style.
- `3` maps to `meeting` and uses a calendar/meeting icon and amber styling.
- Always map DTO numeric types through `mapNotification` in `src/features/notification/types/index.ts` before rendering.
- Never assume the numeric backend type is already the UI string type.
- Unknown notification types should be ignored safely, not rendered with an undefined icon.

### State and realtime

- `useNotificationStore` in `src/features/notification/store/notificationStore.ts` is the single source of truth.
- Do not reintroduce independent `useState` notification instances in `Topbar` or `NotificationDropdown`.
- `MainLayout` loads the initial notification list and unread count.
- SignalR is started from the authenticated `MainLayout` and stopped on unmount/logout.
- The SignalR hub URL is derived from `VITE_API_URL` by removing the trailing `/api` and appending `/hubs/notification`.
- SignalR uses `@microsoft/signalr`, `withAutomaticReconnect()`, and:

```ts
accessTokenFactory: () => localStorage.getItem("accessToken") ?? ""
```

- Listen for `NotificationReceived` and pass the DTO through the same mapper used by REST data.
- A realtime notification must be prepended to the list, increment unread count, and show a toast.
- Read actions are optimistic but must revert state if the API request fails.
- Use Lucide React icons for notification toasts and UI. Do not use emoji as notification icons.
- Backend creates and deduplicates task notifications automatically via its recurring job. The frontend must not poll or create task notifications manually unless explicitly requested.

## React and Component Rules

- Prefer small feature components and hooks over large page components.
- Keep data fetching in hooks/services and presentation in components.
- Reuse existing shared components and design tokens before creating new primitives.
- Use `React.memo` only when the component is actually reused in a render-heavy path and its parent provides stable props.
- If memoizing a child, stabilize the relevant parent callbacks/data only when necessary.
- Use semantic buttons with `type="button"` unless a button intentionally submits a form.
- Preserve responsive behavior on desktop and mobile.
- Use Lucide icons instead of hand-built SVG or emoji for interface actions and status indicators.
- Keep comments short and explain non-obvious behavior only.
- Avoid adding compatibility layers or duplicate APIs without a concrete need.

## Styling and Theme

- Tailwind CSS v4 is configured through `@theme` and CSS variables in `src/index.css`.
- Preserve the existing dark/light theme system and use its variables/tokens.
- Avoid hardcoded colors when a theme token or existing utility is available.
- Check hover, focus, disabled, loading, empty, and error states in both themes.
- Keep dropdowns, modals, and responsive settings/navigation behavior consistent with existing components.

## Calendar Rules

- Calendar data is derived from tasks, projects, and meetings in `useCalendarPage` and `deriveCalendarEvents`.
- Existing calendar queries use TanStack Query with a five-minute `staleTime`.
- Do not add lazy loading or change calendar data-fetching strategy without first measuring the bundle/render problem and confirming the intended behavior.
- Preserve the existing separation between navigation, event creation, and detail-panel hooks.

## Verification

Run the narrowest useful checks after editing, then the full checks when practical:

```bash
npm run lint
npm run build
```

Useful direct checks:

```bash
npx tsc --noEmit -p tsconfig.app.json
npx vite build
```

If a check cannot run because of the environment, report the exact command and error. Do not claim a check passed if it was not run.

## Final Response

Report:

- What changed and the relevant files.
- Any backend/API assumptions or unresolved questions.
- Verification commands and their results.
- Any known limitations or follow-up work.

Keep the final response concise and factual.
