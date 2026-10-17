# Vizus Frontend

React single-page app for **Vizus**, an eye clinic with an optical shop: online appointment booking, a product catalog with checkout, and a full admin panel.

> Portfolio project: a redesign concept built around the existing [vizus.bg](https://vizus.bg). Backend: [vizus-backend](https://github.com/Veselin47/Vizus).

![Home page](docs/screenshots/home.png)

## Features

**Public site**
- Product catalog with category filters, cart, and Stripe Checkout
- Delivery step with contact details and three options: clinic pickup, Econt office, or Econt to address (live city and office lookup)
- Appointment booking in three steps: doctor, date, time slot (only free slots are shown)
- Email confirmation link for every booking
- Team page with doctor profiles and working hours
- Fully responsive, with a mobile menu

**Admin panel** (role-protected)
- CRUD for products, categories and doctors, with image upload
- Appointments list with search, status/doctor/date filters and status changes

## Tech stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · React Router · TanStack Query · Zustand · Axios · Framer Motion · Lucide

## Getting started

Prerequisites: Node.js (LTS) and the [backend](https://github.com/Veselin47/vizus-backend) running on `https://localhost:7144`.

```bash
npm install
npm run dev
```

The app runs on `http://localhost:5173`. That port is allowed by the backend's CORS policy, so keep it.

The API address is set in `src/api/axiosClient.ts` (`API_BASE_URL`).

## Project structure

```
src/
├── api/          # Axios client and one module per backend resource
├── components/   # layout, ui and product components
├── pages/        # route pages, admin/ for the admin panel
├── store/        # Zustand stores: auth, cart, toasts
├── types/        # TypeScript types matching backend DTOs
├── hooks/        # reusable hooks
└── utils/
```

## Design notes

- The JWT is stored in Zustand (persisted) and attached to every request by an Axios interceptor.
- The cart lives on the client; the server re-reads prices and stock when the order is created, so prices sent by the browser are never trusted.
- Server state (products, doctors, slots) is handled by TanStack Query, which handles caching and refetching after mutations.

## Known limitations

- No automated tests yet
- No handling of expired tokens (the user stays "logged in" in the UI after the token expires)
- Not deployed yet
