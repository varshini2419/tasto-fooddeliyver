# Tasto - Campus Food Delivery App

## Description
Tasto is a full-stack, production-ready campus food delivery application built to streamline ordering and delivery for students and staff. It features dedicated portals for Customers, Delivery Partners, and Administrators, with real-time tracking, specific college area validation (e.g., SRKR College), and isolated restaurant menus.

## Tech Stack
- **Frontend:** React, Vite, TailwindCSS, Lucide React, React Router Dom
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT (JSON Web Tokens) & bcryptjs

## How to Run Locally

### Prerequisites
- Node.js (v18+)
- MongoDB running locally or a MongoDB Atlas URI

### 1. Clone the Repository
```bash
git clone https://github.com/varshini2419/tasto-fooddeliyver.git
cd tasto-fooddeliyver
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/tasto
JWT_SECRET=your_super_secret_key
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal and navigate to the client folder:
```bash
cd client
npm install
```
Start the Vite development server:
```bash
npm run dev
```

## Demo Credentials

You can test the application using the following pre-seeded demo accounts:

### Admin Portal (`/admin`)
- **Phone:** `9999999999`
- **Password:** `admin123`

### Customer Portal (`/restaurants`)
- **Phone:** `8888888888`
- **Password:** `user123`

### Delivery Partner Portal (`/delivery`)
- **Phone:** `7777777771`
- **Password:** `delivery123`
