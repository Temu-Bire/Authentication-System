# Authentication System

A full-stack authentication system built with **FastAPI** (Python backend) and **React + Vite + Tailwind CSS** (frontend), featuring JWT authentication, Google OAuth integration, session management, and rate limiting.

---

## Project Structure

```text
Authentication-System/
├── backend/                  # FastAPI backend service
│   ├── app/                  # Application code (routes, db, core, schemas, utils)
│   ├── requirements.txt      # Python dependencies
│   ├── .env.example          # Backend environment variables template
│   └── .gitignore
├── frontend/                 # React + Vite frontend application
│   ├── public/               # Static assets & icons
│   ├── src/                  # React source files (components, pages, api, routes)
│   ├── package.json          # Node.js dependencies & scripts
│   ├── vite.config.js        # Vite configuration
│   ├── .env.example          # Frontend environment variables template
│   └── .gitignore
└── README.md
```

---

## Getting Started

### 1. Backend Setup (FastAPI)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```bash
   # Windows (PowerShell)
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # macOS / Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables:
   - Copy `.env.example` to `.env` inside `backend/`:
     ```bash
     cp .env.example .env
     ```
   - Update `SECRET_KEY`, `DATABASE_URL`, and `GOOGLE_CLIENT_ID` with your settings.

5. Start the backend server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   The backend API will be available at `http://127.0.0.1:8000`. API docs can be viewed at `http://127.0.0.1:8000/docs`.

---

### 2. Frontend Setup (React + Vite)

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Check `.env` or copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Verify `VITE_GOOGLE_CLIENT_ID` and `VITE_API_URL` (defaults to `http://127.0.0.1:8000`).

4. Run the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend will be running at `http://localhost:5173`.

---

## Features

- **JWT Authentication**: Secure access tokens and refresh tokens.
- **Google OAuth**: Fast single sign-on with Google Sign-In.
- **Session Tracking**: View and revoke active user sessions.
- **Rate Limiting**: Protect authentication endpoints against abuse using SlowAPI.
- **Protected Routes**: Client-side route protection with token validation.
- **Tailwind CSS Styling**: Clean and modern user interface.
