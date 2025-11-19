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
