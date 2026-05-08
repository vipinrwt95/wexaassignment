<div align="center">

# 📦 Wexa Assignment  
## Inventory Management System

**Assignment Started:** 10:44 AM, 7 May 2026

A full-stack inventory management application built using React, Node.js, Express, MongoDB, and JWT authentication.

</div>

---

## 🚀 Live Deployment

| Service | Platform |
|---|---|
| 🌐 Frontend | Vercel |
| ⚙️ Backend | Render |
| 🗄️ Database | MongoDB Atlas |

---

## 🧑‍💻 Tech Stack

### Frontend



---

## 📌 Project Overview

This project is a complete inventory management system where users can register, login, and manage their product stock.

The system supports:

- 🔐 User authentication
- 📦 Product CRUD
- 🧾 SKU-based product tracking
- 📊 Dashboard statistics
- ⚠️ Low stock detection
- ➕ Stock increment
- ➖ Stock decrement
- 🌍 Production deployment

---

## ✨ Features

### 🔐 Authentication

- User signup
- User login
- JWT token generation
- Protected APIs
- Token stored in localStorage
- Axios interceptor for authenticated requests

---

### 📦 Product Management

Users can create, update, delete, and view products.

Each product contains:

| Field | Description |
|---|---|
| Product Name | Name of the inventory item |
| SKU | Unique stock keeping unit |
| Description | Optional product description |
| Quantity on Hand | Current available stock |
| Cost Price | Product purchase cost |
| Selling Price | Product selling price |
| Low Stock Threshold | Minimum stock alert level |

---

### ✅ Validations

The following validations are implemented:

- Product name is required
- SKU is required
- Numeric fields are handled safely
- Empty optional numeric fields are not forcefully submitted

---

### 📉 Low Stock Logic

A product is marked as low stock when:
quantityOnHand <= lowStockThreshold
```

If `lowStockThreshold` is empty, the product is ignored from low stock alerts.

---

## 📊 Dashboard

The dashboard displays:

- Total number of products
- Total quantity available in inventory
- Low stock items
- Product inventory summary

---

## 🛠️ API Endpoints

### Auth APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login user |

---

### Product APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | Get all products |
| POST | `/api/products` | Create new product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| POST | `/api/products/:id/adjust-stock` | Increase or decrease stock |

---

## 📁 Frontend Structure

```txt
src/
├── api/
│   └── axios.ts
├── pages/
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── Dashboard.tsx
│   └── Products.tsx
├── components/
├── App.tsx
└── main.tsx
```

---

## 📁 Backend Structure

```txt
backend/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── server.js
└── package.json
```

---

## 🔗 Axios Configuration

```js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
```

---

## 🌍 Environment Variables

### Frontend `.env`

```env
VITE_API_BASE_URL=https://wexaassignment-backend.onrender.com
```

### Backend `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
```

---

## ▶️ Run Locally

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

---

## 🚀 Deployment Details

### Frontend

Frontend is deployed on **Vercel**.

Important setup:

```env
VITE_API_BASE_URL=https://wexaassignment-backend.onrender.com
```

### Backend

Backend is deployed on **Render**.

Backend handles:

- Authentication
- Product APIs
- MongoDB connection
- CORS setup
- Stock updates

---

## 🧩 Vercel SPA Routing Fix

For React Router support on Vercel, add this file:

### `vercel.json`

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## ⚠️ Important Note

Vite proxy works only in local development.

It works only with:

```bash
npm run dev
```

For production, the frontend must use the deployed backend URL using:

```env
VITE_API_BASE_URL
```

---

## 🧪 Testing Checklist

- User can signup
- User can login
- JWT token is stored
- Product can be created
- Product name validation works
- SKU validation works
- Product can be edited
- Product can be deleted
- Stock can be increased
- Stock can be decreased
- Low stock status appears correctly
- Frontend connects with deployed backend

---

## 🔮 Future Improvements

- Product search
- Product filters
- Pagination
- Product image upload
- Barcode support
- Supplier management
- Stock movement history
- Role-based access control
- Audit logs
- Export inventory as CSV
- Advanced dashboard analytics

---

## 📝 Final Summary

This assignment demonstrates a production-ready full-stack inventory management system.

The focus was on:

- Clean frontend structure
- Secure backend APIs
- JWT authentication
- MongoDB product storage
- Stock management
- Low stock detection
- Full deployment on Vercel and Render
- Environment-based production API configuration

<div align="center">

### ✅ Assignment Completed Successfully

</div>
