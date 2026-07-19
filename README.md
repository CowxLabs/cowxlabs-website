# Cowx Labs — Software Solutions Site

A full-stack site for **Cowx Labs**, a software solutions company. It includes a
public marketing site plus role-based portals for **admins**, **employees**, and **clients**.

## Stack
- **Backend:** Node + Express, SQLite (`better-sqlite3`), JWT auth, bcrypt password hashing
- **Frontend:** React + Vite, React Router, Axios

## Features
- Public pages: Home, About, Services, Contact (with message submission)
- **Login** with role-based redirect (admin / employee / client)
- **Admin panel:** dashboard stats + full CRUD for users, clients, projects, tasks, invoices
- **Employee portal:** view assigned projects & tasks, update task status
- **Client portal:** view own projects, project tasks, and invoices
- Seed data so you can log in immediately

## Demo accounts
| Role     | Email                    | Password      |
|----------|--------------------------|---------------|
| Admin    | admin@cowxlabs.com       | admin123      |
| Employee | employee@cowxlabs.com    | employee123   |
| Client   | client@cowxlabs.com      | client123     |

## Getting started (Windows PowerShell)
npm scripts are blocked by the default PowerShell execution policy, so run commands
through `cmd /c` (or use Git Bash / Terminal).

```bash
# 1. install dependencies (backend + frontend)
cmd /c "cd backend && npm install"
cmd /c "cd frontend && npm install"

# 2. run dev servers (API on :4000, UI on :5173)
cmd /c "npm run dev"

# or separately:
cmd /c "cd backend && npm run dev"
cmd /c "cd frontend && npm run dev"
```

Then open http://localhost:5173 and log in with a demo account.

## Production build
```bash
cmd /c "npm run build"     # builds the React app into frontend/dist
cmd /c "npm run start"     # serves API + built frontend from http://localhost:4000
```

## Project layout
```
backend/
  server.js          # Express app, static serving in prod
  db.js              # SQLite schema + seed
  auth.js            # JWT + role middleware
  routes/            # auth, public, admin, employee, client
frontend/
  src/
    pages/           # public, login, admin, employee, client
    components/      # layouts, ui helpers, protected route
    auth/            # AuthContext
```

## Notes
- The JWT secret and token expiry live in `backend/.env` — change them for production.
- The database file is `backend/data/cowxlabs.db` (auto-created on first run).
