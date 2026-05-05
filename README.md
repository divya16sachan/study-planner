# Study Planner

A full-stack productivity app for students that combines planning, focus, and personal organization in one place.

It includes:
- Secure authentication with email/password, OTP verification, and Google login
- Weekly routine planner (calendar-style)
- Personal notes (CRUD)
- Password reset via OTP email
- Profile updates (name, email, profile picture)
- Built-in focus tools (Pomodoro timer, flip clock, Spotify widget)
- Local productivity widgets (todos and daily habits)

## Monorepo Structure

```text
study-planner/
|- backend/    # Express + MongoDB API
|- frontend/   # React + Vite client
|- package.json
```

## Tech Stack

### Frontend
- React 19
- Vite 6
- React Router 7
- Zustand (state management)
- Tailwind CSS + Radix UI
- Axios
- Google OAuth (@react-oauth/google)

### Backend
- Node.js + Express 5
- MongoDB + Mongoose
- JWT (cookie-based auth)
- OTP service with hashed codes and TTL cleanup
- Brevo SMTP API (transactional email)
- Cloudinary + Multer (profile image uploads)

## Key Features

### Authentication and User Management
- Signup with OTP verification
- Login with email/password
- Google One Tap + Google Login flow
- Persistent session using httpOnly JWT cookie
- Logout endpoint
- User profile updates:
  - Update name
  - Update email with OTP verification
  - Update profile picture via Cloudinary upload

### Recovery and Security
- Password reset flow:
  1. Request OTP to email
  2. Submit OTP + new password
- OTPs are:
  - Hashed in database
  - Rate-limited (1 minute resend interval)
  - Auto-expired and auto-deleted using MongoDB TTL index

### Planner and Productivity
- Weekly calendar routines UI
- Notes with full CRUD on backend
- Pomodoro timer with sequence mode and sound/theme settings
- Local todo list (persisted in browser)
- Local daily habits with streak tracking (persisted in browser)

## Local Development Setup

### 1. Prerequisites
- Node.js 18+ (recommended)
- npm
- MongoDB connection string (local or Atlas)
- Cloudinary account (for profile photos)
- Brevo API key (for OTP emails)
- Google OAuth client ID (for Google login)

### 2. Install Dependencies
From project root:

```bash
npm run i
```

This installs dependencies for both frontend and backend.

### 3. Environment Variables
Create a .env file inside backend with the following values:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_connection_string

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

BREVO_API_KEY=your_brevo_api_key
EMAIL_SENDER=verified_sender@example.com

# Recommended for production cookie behavior
NODE_ENV=development

# Required by Google auth controller
GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

Create a .env file inside frontend with:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_OAUTH_CLIENT_ID=your_google_oauth_client_id
```

### 4. Run the App
Use two terminals.

Terminal 1 (backend):

```bash
cd backend
npm run dev
```

Terminal 2 (frontend):

```bash
cd frontend
npm run dev
```

Frontend: http://localhost:5173
Backend health check: http://localhost:5000/api/health

## API Overview

Base URL: /api

### Auth Routes
- POST /auth/send-signup-otp
- POST /auth/signup
- POST /auth/login
- POST /auth/logout
- GET /auth/me (protected)
- POST /auth/google-login

### User Routes
- POST /user/update-name (protected)
- POST /user/send-email-update-otp (protected)
- POST /user/update-email (protected)
- POST /user/update-profile-picture (protected, multipart file field: file)
- GET /user/:email

### Password Routes
- POST /password/request-reset-password-otp
- POST /password/reset-password

### Notes Routes (protected)
- GET /notes
- GET /notes/:id
- POST /notes
- PUT /notes/:id
- DELETE /notes/:id

### Routine Routes (protected)
Currently wired as:
- POST /routines
- GET /routines
- GET /routines/:id
- PUT /routines/:id
- DELETE /routines/:id

## Data Models (Backend)

### User
- name
- email (unique)
- password (nullable for Google users)
- picture
- googleId

### Otp
- email
- otp (hashed)
- purpose: signup | password_reset | email_update
- expiresAt (TTL indexed)
- lastSentAt

### Note
- userId
- title
- description
- timestamps

### Routine
- userId
- day arrays: Sun, Mon, Tue, Wed, Thu, Fri, Sat
- each day item: time, endTime, subject, description

## Frontend Routes
- / -> Home (requires auth)
- /login
- /signup
- /forgot-password
- /weekly-task

## Known Issues and Caveats

1. Routine route contract mismatch
- Frontend routine store calls endpoints like:
  - POST /routines/:day
  - PUT /routines/:day/:index
  - DELETE /routines/:day/:index
- Backend router currently exposes only /routines and /routines/:id.
- Result: routine write operations may fail unless backend routes are aligned with controller/store expectations.

2. Environment typing mismatch for Google auth
- Auth controller expects GOOGLE_CLIENT_ID in ENV.
- Backend env config does not currently enforce this key.
- Missing value can break Google token verification.

3. OAuth user checks rely on a non-schema field
- Some user update logic checks user.isOAuthUser, but this field is not defined in User schema.

4. No automated tests currently configured
- Root and backend test scripts are placeholders.

## Recommended Next Improvements

1. Align routine backend routes with current controller signatures and frontend calls.
2. Add GOOGLE_CLIENT_ID (and optional NODE_ENV) into backend env config validation.
3. Replace isOAuthUser checks with reliable condition (for example, boolean derived from googleId).
4. Add API tests (Supertest + Jest/Vitest) and frontend unit/integration coverage.
5. Add Docker and deployment docs.

## Available Scripts

### Root
- npm run i -> install frontend and backend dependencies

### Backend
- npm run dev -> run with nodemon
- npm start -> run with node

### Frontend
- npm run dev -> start Vite dev server
- npm run build -> build production bundle
- npm run preview -> preview production build
- npm run lint -> run ESLint

## Notes for Deployment

- Configure CORS CLIENT_URL to your deployed frontend domain.
- Use secure secrets and production-grade cookie settings.
- Ensure Brevo sender email is verified.
- Provide Cloudinary credentials for media uploads.
- Set VITE_API_BASE_URL to deployed backend API base.

## License

ISC (as currently declared in package metadata).
