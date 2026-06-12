# ecommerce-v2

A full-stack e-commerce platform focused on delivering **affordable children’s products**, built with **React.js**, **Node.js**, and **PostgreSQL**, and deployed on **Render**.  
This application helps parents access budget-friendly goods while also highlighting **community donation drives** to support families in need.

---

## Features

### 🛒 Core E-commerce

- Browse affordable children’s products

### 👨‍👩‍👦 Family-Focused Features

- Curated categories for children’s essentials
- Budget-friendly catalog
- Built-in donation drive announcements

### 📦 Admin Tools

- Create, update, delete products
- Manage users & orders
- Publish donation drives

### 📱 Responsive UI

- Fully mobile-friendly
- Clean React component structure

---

## Tech Stack

### Frontend

- React.js
- React Hooks

### Backend

- Node.js
- Express.js

### Database

- PostgreSQL
- Render PostgreSQL instance

### Deployment

- Render Web Service (Frontend)
- Render Web Service (Backend)
- Render PostgreSQL Database

---

## Architecture

- The React frontend communicates with the backend API.
- The backend handles auth, product management, cart logic, and orders.
- PostgreSQL stores all application data.

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- PostgreSQL (local or cloud)
- Git

---

### Installation

1. Clone the repository:
   git clone https://github.com/Mhowey19/ecommerce-v2.git
   cd ecommerce-v2

Install dependencies:

npm install

Usage
Run the app locally:

# In one terminal, start the frontend

npm run dev

# In another terminal, start the backend

node server.js

If you want both at once, keep both processes running while you test signup/login.

---

## Deploying to Vercel

This repository supports Vercel static hosting with built-in serverless backend APIs.

1. In the Vercel dashboard, create a new project and point it to this repository.
2. Set the Build Command to `npm run build` and the Output Directory to `dist` (the included `vercel.json` already configures this).
3. No `VITE_API_URL` is required if you use the built-in Vercel serverless functions in `api/`.
   - If you want to call an external API instead, set `VITE_API_URL` to that external host.
4. Deploy — Vercel will publish the frontend and serve the `/api/*` routes automatically.

Notes:

- Vercel will serve the static frontend from `dist` and use the `api/` directory for backend routes.
- This repository also contains `server.js` for local/manual Node hosting, but Vercel will ignore it for static deployments.
- If using a separate backend, point `VITE_API_URL` at the deployed API.

Local build & preview

```bash
npm install
npm run build
npm run preview
```

---

## Deploying to Railway as a Monorepo

This repository can deploy as a single Railway service that builds the React frontend and runs the Express backend together.

1. In Railway, create a new project and connect this GitHub repository.
2. Railway will install dependencies and run `npm install`.
3. The repository includes a `Procfile` with:

```bash
web: npm run start:prod
```

4. Railway will use `postinstall` to run `npm run build`, so the frontend is built before the server starts.
5. Set the environment variable:
   - `DATABASE_URL` = your PostgreSQL connection string
   - Do not set `VITE_API_URL` if the frontend and backend are hosted together on Railway. The app uses same-origin API requests by default.
6. Deploy the service.

Notes:

- `npm run start:prod` starts `node server.js`.
- `server.js` serves the `dist` folder and API routes from the same host.
- If you prefer a separate backend service, set `VITE_API_URL` to the backend URL.
