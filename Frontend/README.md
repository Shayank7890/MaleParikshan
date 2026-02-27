# Male Parikshan — Frontend

> Strong Body. Calm Mind. Responsible Man.

A complete production-ready frontend for the Male Parikshan men's health platform.

## Stack

- **React 18** + **TypeScript** (Vite)
- **Tailwind CSS** — dark theme, custom design system
- **React Router v6** — protected routes
- **Axios** — API integration with JWT interceptor
- **Recharts** — mood analytics charts
- **Zod** — form validation
- **Context API** — global auth state

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000
```

### 3. Run development server

```bash
npm run dev
```

App runs at `http://localhost:3000`

## Folder Structure

```
src/
├── pages/          # All page components
├── components/     # Shared UI components
├── layouts/        # AppLayout (sidebar nav)
├── services/       # Axios API service modules
├── context/        # AuthContext (JWT + user state)
├── hooks/          # useTranslation hook
├── types/          # TypeScript interfaces
├── routes/         # AppRouter + ProtectedRoute
├── locales/        # en.json + hi.json translations
└── main.tsx        # Entry point
```

## Pages & Routes

| Route | Page | Protected |
|-------|------|-----------|
| `/` | Landing | No |
| `/login` | Login | No |
| `/register` | Register | No |
| `/onboarding` | Onboarding | Yes |
| `/dashboard` | Dashboard | Yes |
| `/streak` | Streak Tracker | Yes |
| `/mood` | Mood Tracker | Yes |
| `/modules` | Learning Modules | Yes |
| `/chat` | AI Chat | Yes |
| `/adult` | Adult Mode | Yes (18+) |

## API Endpoints Used

```
POST /auth/register
POST /auth/login
POST /auth/guest
GET  /profile/me
POST /profile/setup
GET  /dashboard
POST /streak/setup
POST /streak/checkin
GET  /streak
POST /mood
GET  /mood/report
GET  /modules
POST /modules/progress
POST /chat
POST /adult/enable
```

## Authentication Flow

1. User visits `/` — can Login, Register, or Guest login
2. After auth, JWT stored in `localStorage`
3. All API calls attach `Authorization: Bearer <token>` header
4. 401 responses auto-logout and redirect to `/login`
5. After login, checks `/profile/me` — if incomplete → `/onboarding`

## Language Support

- English (default)
- Hindi (हिंदी)

Set during registration. Stored in user profile. Uses custom `useTranslation` hook with `src/locales/en.json` and `src/locales/hi.json`.

## Build for Production

```bash
npm run build
```

Output in `dist/` folder.
