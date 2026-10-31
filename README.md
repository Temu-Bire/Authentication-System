# NexusAuth - Full-Stack Authentication & Security Suite

An enterprise-ready authentication system built with **FastAPI** (Python backend) and **React + Vite + Tailwind CSS** (frontend), featuring high-trust cyber-glassmorphism design, JWT token pairs, Google OAuth 2.0, active session isolation, password recovery, in-app password management, and security audit logs.

---

## Project Architecture

```text
Authentication-System/
├── backend/                       # FastAPI modular backend
│   ├── app/
│   │   ├── main.py                # Entrypoint & v1 API router mounting
│   │   ├── core/                  # Security (direct bcrypt), JWT, config, exceptions, logging
│   │   ├── db/                    # SQLAlchemy engine, Base, and session dependencies
│   │   ├── models/                # User, Session, Role, AuditLog, PasswordResetToken
│   │   ├── schemas/               # Pydantic request/response schemas
│   │   ├── dependencies/          # Authentication & Authorization guards
│   │   ├── services/              # Business logic (AuthService, UserService, OAuthService)
│   │   ├── repositories/          # Data access layer (UserRepository, OAuthRepository)
│   │   ├── routers/               # HTTP endpoints (auth, users, admin)
│   │   ├── utils/                 # Password complexity validator & email helper
│   │   └── middleware/            # SlowAPI rate limiting
│   ├── migrations/                # Alembic database migrations
│   ├── tests/                     # Unit and integration test suites
│   ├── requirements.txt           # Python dependencies
│   └── alembic.ini
│
├── frontend/                      # React 19 + Vite frontend application
│   ├── src/
│   │   ├── context/               # AuthContext & useAuth() reactive state hook
│   │   ├── components/            # Navbar, custom SVG iconography (Icons.jsx)
│   │   ├── pages/                 # Login, Register, ForgotPassword, ResetPassword, Dashboard, Sessions
│   │   ├── routes/                # ProtectedRoute wrapper
│   │   └── api/                   # Axios interceptor with token refresh exchange
│   ├── index.html                 # Vite HTML entry point
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## Key Features

- **High-Trust Dark Glassmorphic UI**: Ambient mesh gradient, glowing accents, leading input icons, and custom SVG iconography.
- **Interactive Password Controls**: Visibility toggles (show/hide), dynamic 4-segment strength meters, and live requirement checklists.
- **Centralized State Management**: Powered by React `AuthContext` and custom `useAuth()` hook for instant cross-component updates.
- **Security Command Center (Dashboard)**:
  - Account Security Score progress ring.
  - Profile identity overview (email, authentication provider, IP).
  - In-app **Password Change** section with old password verification.
  - **Security Activity Timeline** fed from real-time audit logs.
- **Active Session Management**:
  - Automatically parses client devices (e.g., *Chrome on Windows*, *Safari on iPhone*).
  - Current device radar pulse indicator.
  - Suspicious login alert banner for unverified IP addresses.
  - Granular single session and bulk remote session termination with confirmation.
- **Password Recovery Flow**:
  - Request recovery instructions via `POST /auth/forgot-password`.
  - Set new password with cryptographic token via `POST /auth/reset-password` (automatically revokes remote sessions).
- **Hardened Security & Rate Limiting**:
  - Direct `bcrypt` password salting and hashing.
  - Brute-force account lockout after 5 failed attempts for 15 minutes.
  - SlowAPI rate limits on `/auth/login`, `/auth/register`, and `/auth/refresh`.
  - Secured endpoints: `/users` and `/auth/activity` protected with Bearer token authentication.

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

4. Configure environment variables (`.env`):
   ```bash
   cp .env.example .env
   ```
   Configure `SECRET_KEY`, `DATABASE_URL`, and `GOOGLE_CLIENT_ID`.

5. Start the backend development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   - API endpoints: [http://127.0.0.1:8000](http://127.0.0.1:8000)
   - Interactive Swagger docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

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

3. Verify environment variables in `.env`:
   ```env
   VITE_API_URL=http://127.0.0.1:8000
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The application will be live at [http://localhost:5173](http://localhost:5173).
