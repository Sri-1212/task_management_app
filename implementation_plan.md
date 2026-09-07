# Implementation Plan - TaskVerse (Zero-Gravity Task Management App)

Building a full-stack futuristic Task Management Application ("TaskVerse") with anti-gravity glassmorphism visual identity, drag-and-drop Kanban board, real-time Socket.IO synchronization, JWT auth (access/refresh tokens), dashboard analytics, sci-fi command palette, and interactive physics & particle effects.

---

## 1. Project Setup & Architecture
- **Root**: Clean repository structure with `client/` and `server/`.
- **Client**: React 19 + TypeScript + Vite + Tailwind CSS + Framer Motion + `@dnd-kit` + `zustand` + `lucide-react` + `recharts` + `canvas-confetti` + `axios` + `socket.io-client`.
- **Server**: Node.js + Express (TypeScript), JWT auth (access + refresh tokens with HTTP-only cookies), Mongoose DB model (with flexible MongoDB connection string and automatic fallback datastore so it runs out-of-the-box in dev), Socket.IO integration for live board sync and user presence.

---

## 2. Server Implementation (Backend)
1. **Config & Types**: `tsconfig.json`, `package.json`, environment configurations.
2. **Models**:
   - `User`: `name`, `email`, `passwordHash`, `role` (`user` | `admin`), `avatar`, `resetPasswordToken`, `resetPasswordExpires`.
   - `Task`: `title`, `description`, `status` (`todo` | `in-progress` | `done`), `priority` (`low` | `medium` | `high`), `dueDate`, `tags`, `subtasks` (`[{ id, title, completed }]`), `owner` (ref User), `order`.
3. **Auth System**:
   - JWT access token (short lived) & refresh token (stored HTTP-only cookie or headers).
   - Endpoints: `/api/auth/register`, `/api/auth/login`, `/api/auth/refresh`, `/api/auth/logout`, `/api/auth/forgot-password`, `/api/auth/reset-password/:token`.
4. **Task CRUD Endpoints**:
   - `GET /api/tasks` (with filter by status/priority/tag, search, sort).
   - `POST /api/tasks`, `GET /api/tasks/:id`, `PATCH /api/tasks/:id`, `DELETE /api/tasks/:id`.
   - `PATCH /api/tasks/:id/status` (fast status & position move endpoint).
5. **User Endpoints**:
   - `GET /api/users/me`, `PATCH /api/users/me`.
6. **Socket.IO Integration**:
   - Auth handshake with JWT.
   - Live events broadcasting: `task:created`, `task:updated`, `task:deleted`, `task:moved`, `user:presence`.

---

## 3. Client Implementation (Frontend)
1. **Design System & Tailwind Config**:
   - Custom Tailwind tokens: `#05050a` space bg, electric violet `#8b5cf6`, cyan `#22d3ee`, hot magenta `#f0abfc`, neon green `#10b981`.
   - Glassmorphism utility classes (`backdrop-blur-md`, subtle 1px neon borders, ambient glow shadows).
   - Sora / Inter font integration.
   - Daylight mode / Dark mode themes.
2. **Core Components**:
   - `GlassCard`: Frosted glass wrapper with 3D hover tilt & ambient particle/glow effect.
   - `Button`: Ripple effect, glowing gradient borders, holographic hover state.
   - `Badge`: Glowing priority badges (red pulse high, amber medium, green low).
   - `Modal`: Floating glass portal modal with Framer Motion entry.
   - `Toast`: Holographic floating notifications.
3. **State Management (`zustand`)**:
   - `authStore`: login/register/logout/user profile state.
   - `taskStore`: list of tasks, filters, active task, drag actions, optimistic updates.
   - `socketStore`: Socket connection state, live user presence map.
   - `themeStore`: Dark / Daylight theme state.
4. **Pages & Views**:
   - **Auth Pages**: Animated cosmic background with floating holographic login/register forms.
   - **Board Page (Kanban)**: 3-column drag-and-drop board with floating cards, micro-interactions, magnetic snaps, search & filter toolbar.
   - **Task Detail & Form Modal**: Full subtask checklist, tags editor, priority radio pills, due date selector.
   - **Dashboard Page**: Real-time stats with animated Recharts (radial progress, priority breakdown bar chart, weekly completion graph).
   - **Sci-Fi Command Palette (`Cmd+K` / `Ctrl+K`)**: Quick launcher for creating tasks, jumping pages, or searching tasks.
   - **Mobile View**: Responsive tab navigation, swipeable card stack, floating action button with glowing orbit ring.

---

## 4. Verification & Testing
- Test backend endpoints.
- Test frontend build (`npm run build`).
- Verify multi-tab live sync via Socket.IO.
- Verify responsive layout across mobile (375px), tablet (768px), and desktop (1280px+).

---

## 5. Documentation
- Comprehensive README with setup guide, API endpoints, environment variables, architecture overview, and instructions.
