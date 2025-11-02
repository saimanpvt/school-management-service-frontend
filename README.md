# School Management - Next.js Frontend (TypeScript)

This repository is a frontend-only Next.js (TypeScript) scaffold for the School Management system. It expects a separate backend API (express/mongo) that implements the RBAC and endpoints described by the project spec.

What's included
- Next.js (TypeScript)
- Tailwind CSS
- Axios-based API client template
- React Query (TanStack Query) for data fetching
- ESLint & Prettier
- .env.example for backend URL configuration
- Sample pages and components (auth, dashboard, role-aware layout)

Getting started

1. Install dependencies

```powershell
npm install
```

2. Copy environment variables

```powershell
cp .env.example .env.local; # on Windows PowerShell use Copy-Item .env.example .env.local
```

3. Run dev server

```powershell
npm run dev
```

Notes
- This is a frontend scaffold only. Point `NEXT_PUBLIC_API_URL` in `.env.local` to your backend API.
- Add authentication flows (login, token refresh) to integrate with the backend.
