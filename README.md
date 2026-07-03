# AdEarn

> **Earn rewards by engaging with ads** — a full-stack web application built with React, Node.js, Supabase, and Paystack.

---

## Tech Stack

| Layer      | Technology                     |
|------------|-------------------------------|
| Frontend   | React 18 + Vite + Tailwind CSS |
| Backend    | Node.js + Express              |
| Database   | Supabase (PostgreSQL)          |
| Auth       | Supabase Auth                  |
| Payments   | Paystack                       |
| Hosting    | Vercel (frontend) · Render (backend) |

---

## Project Structure

```
AdEarn/
├── client/          # React + Vite frontend
│   ├── src/
│   │   ├── lib/
│   │   │   ├── supabase.ts   # Supabase client (anon key)
│   │   │   └── api.ts        # Fetch wrapper for backend calls
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   ├── tailwind.config.js
│   └── vite.config.ts
├── server/          # Node.js + Express backend
│   ├── src/
│   │   ├── lib/
│   │   │   └── supabase.ts   # Supabase client (service role key)
│   │   ├── routes/
│   │   │   └── health.ts     # GET /api/health
│   │   └── index.ts          # Express app entry point
│   └── .env.example
└── shared/          # Shared types & constants
    ├── types/
    └── constants/
```

---

## Prerequisites

- **Node.js** >= 18
- **npm** >= 9
- A [Supabase](https://supabase.com) project
- A [Paystack](https://paystack.com) account

---

## Local Development

### 1. Clone & install dependencies

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 2. Configure environment variables

**Client** (`client/.env`):
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_PAYSTACK_PUBLIC_KEY=pk_test_...
VITE_API_BASE_URL=http://localhost:5000
```

**Server** (`server/.env`):
```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key
PAYSTACK_SECRET_KEY=sk_test_...
PAYSTACK_PUBLIC_KEY=pk_test_...
```

### 3. Start development servers

Open two terminals:

```bash
# Terminal 1 — backend
cd server
npm run dev
# → Running on http://localhost:5000

# Terminal 2 — frontend
cd client
npm run dev
# → Running on http://localhost:5173
```

### 4. Verify

- Open http://localhost:5173 — the app should load and display backend health status.
- Visit http://localhost:5000/api/health directly to check the API.

---

## API Endpoints

| Method | Path         | Description              |
|--------|--------------|--------------------------|
| GET    | /api/health  | Server health check      |

---

## Deployment

### Frontend → Firebase Hosting

1. **Install the Firebase CLI** (once):
   ```bash
   npm install -g firebase-tools
   ```

2. **Log in & initialise** (already done — `firebase.json` and `.firebaserc` are in the repo):
   ```bash
   firebase login
   ```

3. **Set your project ID** in [`.firebaserc`](.firebaserc):
   ```json
   { "projects": { "default": "your-firebase-project-id" } }
   ```

4. **Build the frontend**:
   ```bash
   cd client
   npm run build
   ```

5. **Deploy**:
   ```bash
   # From the project root
   firebase deploy --only hosting
   ```

6. Add all `VITE_*` environment variables in the [Firebase Console](https://console.firebase.google.com) under your project, **or** bake them into the Vite build step in CI by setting them as pipeline secrets before running `npm run build`.

### Backend → Render

1. Create a new **Web Service** in [Render](https://render.com).
2. Set **Root Directory** to `server`.
3. Build command: `npm install; npm run build`
4. Start command: `npm start`
5. Add all environment variables in Render dashboard.
6. Update `CLIENT_URL` to your Vercel deployment URL.

---

## Development Guidelines

- **Never commit `.env` files** — use `.env.example` as a template.
- The `shared/` directory is imported directly by both client and server via path aliases (`@shared`).
- Server uses the **Service Role** key (bypasses RLS) — keep it secret.
- Client uses the **Anon** key — safe to expose, rely on RLS.
