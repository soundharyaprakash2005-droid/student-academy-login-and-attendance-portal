# Internship Academy — Admin Panel

A full-stack admin panel: **FastAPI + MongoDB** backend and a **sky blue / white** themed frontend (vanilla HTML/CSS/JS, no build step).

## Project structure

```
backend/
  main.py                 # FastAPI entry point — serves the API and the frontend
  requirements.txt
  config/
    database.py           # MongoDB connection (in-memory fallback when Mongo is down)
    seed.py               # Sample data seeded on first run
  admin/                  # Users module      → /api/admins
  roles/                  # Roles module      → /api/roles
  system_settings/        # Settings module   → /api/settings
  dashboard/              # Stats module      → /api/dashboard/stats
  utils/response.py       # Consistent {success, message, data} envelopes

frontend/
  index.html              # Dashboard
  users.html              # User management (CRUD)
  roles.html              # Role management (CRUD)
  settings.html           # System settings
  css/style.css           # "Clear Sky" design system (tokens, cards, animations)
  css/responsive.css
  js/api.js               # Fetch client for the backend API
  js/ui.js                # Shared shell (sidebar/topbar), toasts, modals, helpers
  js/dashboard.js  js/users.js  js/roles.js  js/settings.js
```

`frontend123/` is the old UI, kept only for reference — safe to delete.

## Run it

**Easiest:** double-click **`run.bat`** — it starts the server and opens the app in your browser automatically (picking a free port if 8000 is busy).

Or from a terminal:

```bash
cd backend
pip install -r requirements.txt
python main.py
```

The backend serves the frontend and the API together; your browser opens on the right URL.
Interactive API docs: add **/docs** to that URL.

> ⚠️ Do **not** open the `.html` files by double-clicking them — without the server
> the styling, scripts and data won't load. Always start the app with `run.bat`
> (or `python main.py`) and use the browser tab it opens.

- With MongoDB running on `localhost:27017`, data is persistent (database `internship_academy`).
- Without MongoDB, an in-memory store is used automatically (data resets on restart).
- Configure via `.env`: `MONGODB_URL`, `DATABASE_NAME`.
