# Job Application Tracker

A full-stack job search CRM built with React, TypeScript, Express, and MongoDB. It helps candidates track applications, monitor pipeline status, and stay on top of follow-ups.

## Highlights

- Secure authentication with JWT-protected application data
- Application CRUD with company, role, status, compensation, location, notes, and job links
- Dashboard analytics with status cards and a visual pipeline breakdown
- Per-application resume attachment storage with download support
- Responsive React UI backed by TanStack Query and Zustand
- TypeScript across frontend and backend

## Tech Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS, TanStack Query, Zustand, Recharts
- Backend: Node.js, Express, TypeScript, MongoDB, Mongoose, JWT

## Local Development

```bash
npm run install:all
npm run dev:backend
npm run dev:frontend
```

Frontend runs on `http://localhost:5173` and the API runs on `http://localhost:5000/api`.

## Demo Account

The login page includes a **Try Demo** button that signs in with:

- Email: `demo@jobtracker.com`
- Password: `demo123`

Seed or refresh the demo account and sample applications with:

```bash
cd backend
npm run seed
```
