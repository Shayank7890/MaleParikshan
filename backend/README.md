# 🏥 Male Parikshan — Backend API

Production-ready Node.js + Express + TypeScript backend for a men's health educational platform.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18+ |
| Framework | Express.js |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT + bcrypt |
| Validation | Zod |
| Security | Helmet, CORS, Rate Limiting |

---

## 📁 Project Structure

```
male-parikshan/
├── prisma/
│   ├── schema.prisma        # DB schema
│   └── seed.ts              # Seed modules
├── src/
│   ├── config/
│   │   ├── env.ts           # Environment config
│   │   └── prisma.ts        # Prisma client singleton
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── profile.controller.ts
│   │   ├── adult.controller.ts
│   │   ├── streak.controller.ts
│   │   ├── mood.controller.ts
│   │   ├── module.controller.ts
│   │   ├── chat.controller.ts
│   │   └── dashboard.controller.ts
│   ├── middleware/
│   │   ├── auth.ts          # JWT verification
│   │   ├── errorHandler.ts  # Global error handler
│   │   └── rateLimiter.ts   # Express rate limiter
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── profile.routes.ts
│   │   ├── adult.routes.ts
│   │   ├── streak.routes.ts
│   │   ├── mood.routes.ts
│   │   ├── module.routes.ts
│   │   ├── chat.routes.ts
│   │   └── dashboard.routes.ts
│   ├── utils/
│   │   ├── jwt.ts           # Token sign/verify
│   │   ├── response.ts      # Standardized responses
│   │   └── bmi.ts           # BMI & risk calculations
│   └── server.ts            # App entry point
├── .env.example
├── package.json
└── tsconfig.json
```

---

## ⚡ Quick Setup

### 1. Prerequisites
- Node.js 18+
- PostgreSQL running locally

### 2. Clone & Install

```bash
git clone <your-repo-url>
cd male-parikshan
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/male_parikshan"
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
ALLOWED_ORIGINS=http://localhost:3000
```

### 4. Create Database

```bash
# In psql or your PostgreSQL client:
CREATE DATABASE male_parikshan;
```

### 5. Run Migrations

```bash
npm run prisma:migrate
# When prompted, name your migration: "init"
```

### 6. Generate Prisma Client

```bash
npm run prisma:generate
```

### 7. Seed the Database (Optional)

```bash
npx ts-node prisma/seed.ts
```

### 8. Start the Server

```bash
# Development (hot reload)
npm run dev

# Production build
npm run build
npm start
```

✅ Server running at: `http://localhost:5000`

---

## 🔗 API Reference

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | ❌ | Register with email + password |
| POST | `/auth/login` | ❌ | Login, receive JWT |
| POST | `/auth/guest` | ❌ | Create anonymous guest session |

**Register Body:**
```json
{
  "email": "user@example.com",
  "password": "securepass123",
  "age": 25,
  "language": "English"
}
```

**Login Body:**
```json
{
  "email": "user@example.com",
  "password": "securepass123"
}
```

---

### Profile

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/profile/setup` | ✅ | Save health onboarding data |
| GET | `/profile/me` | ✅ | Get full profile |

**Profile Setup Body:**
```json
{
  "height": 175,
  "weight": 70,
  "sleepHours": 7,
  "activityLevel": "Moderate",
  "goals": ["lose weight", "build muscle"]
}
```

---

### Adult Mode

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/adult/enable` | ✅ | Enable adult mode (age ≥ 18 required) |

**Body:**
```json
{ "consentAccepted": true }
```

---

### Streak Tracker (NoFap / Self-Control)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/streak/setup` | ✅ | Initialize streak tracker |
| POST | `/streak/checkin` | ✅ | Daily check-in |
| GET | `/streak` | ✅ | Get streak data |

**Setup Body:**
```json
{ "targetDays": 90 }
```

**Check-in Body:**
```json
{
  "option": "stayed_consistent"
}
```
Options: `stayed_consistent` | `resisted_urges` | `relapsed`

---

### Mood Tracker

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/mood` | ✅ | Log today's mood |
| GET | `/mood/report` | ✅ | Get last 30 days mood report |

**Log Mood Body:**
```json
{
  "mood": "confident",
  "note": "Had a great workout today"
}
```
Mood options: `calm` | `angry` | `low` | `confident` | `neutral`

---

### Learning Modules

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/modules` | ✅ | List all accessible modules |
| POST | `/modules/progress` | ✅ | Mark module complete |

**Progress Body:**
```json
{
  "moduleId": "uuid-here",
  "completed": true
}
```

---

### AI Chat

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/chat` | ✅ | Send message, get AI response |
| GET | `/chat/history` | ✅ | Get conversation history |

**Chat Body:**
```json
{ "message": "How do I improve my sleep quality?" }
```

---

### Dashboard

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/dashboard` | ✅ | Get health summary |

**Response includes:**
- Health score (0–100)
- Current streak
- Today's mood
- Modules completed count
- Profile overview

---

## 🔐 Authentication

All protected routes require:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## 🛡 Security Features

- Passwords hashed with **bcrypt** (12 rounds)
- **JWT** tokens with configurable expiry
- **Helmet** for HTTP security headers
- **CORS** restricted to allowed origins
- **Rate limiting**: 100 req/15min globally, 10 req/15min on auth routes
- Input validation with **Zod** on all endpoints
- Sensitive fields excluded from responses

---

## 🚀 Deployment Notes

1. Set `NODE_ENV=production` in production
2. Use a strong random `JWT_SECRET` (32+ chars)
3. Use a managed PostgreSQL service (Railway, Supabase, AWS RDS, Neon)
4. Run `npm run build` then `npm start`
5. Use a process manager like **PM2**
6. Put behind **Nginx** or use a cloud load balancer
7. Set `ALLOWED_ORIGINS` to your actual frontend URL

```bash
# Production start with PM2
npm install -g pm2
npm run build
pm2 start dist/server.js --name male-parikshan
```
