# SecureHub

A full-stack admin dashboard with JWT authentication, role-based access control, and a custom-built behavioral friction tracker — built to demonstrate real backend, database, and security fundamentals beyond a typical frontend-only portfolio project.

**Live demo:** [fastidious-bonbon-e4e3ef.netlify.app](https://fastidious-bonbon-e4e3ef.netlify.app)
**API:** [securehub-production.up.railway.app](https://securehub-production.up.railway.app/docs)
**Repo:** [github.com/fauz-del/SecureHub](https://github.com/fauz-del/SecureHub)

Demo credentials:
| Role | Email | Password |
|---|---|---|
| Admin | admin@securehub.com | admin123 |
| Standard | user@securehub.com | user123 |

---

## Why I built this

Most junior portfolio projects fetch data from a public API and render it — that demonstrates frontend skills but nothing else. I wanted to build something that proved I understood the full picture: how authentication actually works under the hood, how to design a relational database with real foreign key relationships, how to deploy a Python backend separately from a React frontend, and how to think about a product from a user's perspective rather than just a developer's.

The behavioral tracker in particular came out of an interest in the psychology of how people interact with broken or confusing interfaces. Commercial tools like Hotjar and FullStory charge real money for this exact functionality — I wanted to understand and build the core mechanism myself rather than just plugging in a third-party script.

## Screenshots

**Dashboard**
![Dashboard](./screenshots/dashboard.jpg)

**Records management**
![Records](./screenshots/records.jpg)

**Behavior tracker**
![Behavior Tracker](./screenshots/behavior-tracker.jpg)

## Features

- **JWT authentication** — bcrypt-hashed passwords, signed tokens, automatic logout on expiry
- **Role-based access control** — admins see all records and friction reports; standard users see only their own data, enforced on both frontend routes and backend endpoints
- **Full CRUD** — create, read, update, delete business records with role-aware filtering
- **Behavioral friction tracker** — passively detects rage clicks (3+ clicks on the same element within 1.5 seconds) and input abandonment (a field focused then left empty), batches events client-side, and reports them to an admin-only dashboard
- **Live deployment** — separate frontend and backend deployments talking to a persistent cloud database

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Tailwind CSS, Vite |
| Backend | FastAPI (Python), PyJWT, bcrypt |
| Database | PostgreSQL (Neon, persistent cloud) |
| Frontend hosting | Netlify |
| Backend hosting | Railway |

## Architecture

```
SecureHub/
├── frontend/
│   ├── src/
│   │   ├── pages/          Login, Dashboard, Records, Behavior
│   │   ├── components/     Sidebar, StatCard, RecordsTable, Badge
│   │   ├── auth/           AuthContext, PrivateRoute
│   │   ├── tracker/         behaviorTracker.ts
│   │   └── api/             client.ts, auth.ts, records.ts, behavior.ts
└── backend/
    ├── main.py              App entry, CORS config
    ├── database.py          SQLAlchemy engine, session
    ├── models.py            ORM models (User, BusinessRecord, BehaviorEvent)
    ├── auth_utils.py        JWT creation, bcrypt hashing, route guards
    └── routes/               auth.py, records.py, behavior.py
```

Three related tables — `users`, `business_records`, and `behavior_events` — connected via foreign keys, with role checks enforced server-side on every protected route, not just hidden in the UI.

## How the behavioral tracker works

A click listener tracks timestamps per element; three or more clicks on the same element within 1.5 seconds is logged as a rage click, signaling the user expected feedback that didn't come. A focus/blur listener watches form inputs; if a field is focused and left empty, it's logged as input abandonment, signaling unclear labeling or an unexpected field. Events are batched in memory and flushed after 3 seconds of inactivity (or on page unload) rather than sent individually, to avoid creating excessive network traffic.

## Problems I ran into

Getting this deployed properly was its own project. A few of the bigger issues:

- **The original backend host (Render) had a 50-second cold start** on its free tier. Login requests would time out before the server woke up, and my error handling was reporting that as "invalid credentials" instead of a network timeout — which made the bug far harder to diagnose than it needed to be. I eventually migrated the backend to Railway, which doesn't sleep on the free tier, and fixed the error handling to distinguish network failures from actual auth failures.
- **Neon's pooled connection was dropping mid-query** (`SSL connection has been closed unexpectedly`) under Railway. Fixed by adding `pool_pre_ping=True` and `pool_recycle=300` to the SQLAlchemy engine, which tests and refreshes connections before they go stale.
- **FastAPI's automatic trailing-slash redirect was silently stripping the Authorization header.** A request to `/records` was getting 307-redirected to `/records/`, and the browser wasn't always forwarding the auth header on that redirect — so authenticated requests were returning empty results with no clear error. Fixed by disabling `redirect_slashes` and aligning the frontend's API calls with the backend's exact route paths.
- **The most basic one:** after switching infrastructure, I spent a while debugging CORS and environment variables before realizing the actual production database simply had no seed data in it. A good reminder to verify the data layer before chasing more complex theories.

## Security implementation

- Passwords hashed with bcrypt (work factor 12), never stored in plain text
- JWT tokens signed with HS256, expire after 24 hours, stored in sessionStorage
- Backend dependency injection (`require_admin`) enforces role checks independent of anything the frontend sends
- Axios interceptor auto-logs out on a 401 response
- CORS scoped to known origins in production

## Running locally

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Set `VITE_API_URL` in `frontend/.env` to point at your backend (`http://localhost:8000` for local dev).

## What's next

- A Users management page for admins
- Pagination improvements on the records table
- Email verification on registration
