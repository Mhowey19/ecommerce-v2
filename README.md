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

Install backend dependencies:

cd backend
npm install


Install frontend dependencies:

cd ../frontend
npm install


Usage
Start Backend
cd backend
npm run dev

Start Frontend
cd frontend
npm run dev

---

## Deploying to Vercel

This repository builds a static frontend (`vite build` → `dist`). To deploy the frontend on Vercel:

1. In the Vercel dashboard, create a new project and point it to this repository.
2. Set the Build Command to `npm run build` and the Output Directory to `dist` (the included `vercel.json` already configures this).
3. Add an environment variable `VITE_API_URL` with the public URL of your backend API (e.g. `https://your-backend.example.com`).
   - If you do not have a separate backend deployed, this app's API routes will fail on Vercel because this project is configured as a static frontend build.
4. Deploy — Vercel will run the build and publish the static site.

Notes:
- This repository includes an Express `server.js` used for local development only. Vercel will serve the frontend statically; `server.js` is not executed in this deployment.
- The frontend needs a running backend at the `VITE_API_URL` host. If you do not deploy the backend separately, requests like `/api/login` will fail with 405 or return HTML.
- To host the backend separately, use a Node-compatible host (Render, Heroku, Railway, etc.) and point `VITE_API_URL` to that service.
- If you want to host both frontend and backend on Vercel, convert the server routes in `server.js` into Vercel Serverless Functions under an `api/` directory.

Local build & preview

```bash
npm install
npm run build
npm run preview
```

