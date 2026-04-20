# 📘 Authentication System (POC) – Project Documentation

## 🚀 Overview

This project is a **secure authentication system** built using **Node.js, Express, MongoDB, and React**.
It demonstrates core backend and frontend development skills including authentication, authorization, API design, and state management.

---

## 🛠️ Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT (Access + Refresh Tokens)
* Joi (Validation)
* bcrypt (Password hashing)
* express-rate-limiting (100 req under 15 minute)

### Frontend

* React (Vite)
* Axios
* React Router DOM
* Context API
* React Toastify (Notifications)

---

## 🔐 Features

### Authentication

* User Registration
* User Login
* Logout functionality
* Secure password hashing (bcrypt)

### Security

* JWT Authentication (Access + Refresh Tokens)
* HTTP-only Cookies (prevents XSS)
* Refresh Token Rotation
* Input Validation (Joi)
* Global Error Handling
* Rate Limiting (for login)

### Authorization

* Protected Routes (Dashboard)
* Public Routes (Login/Register restriction)

### User Experience

* Auto Login after Register/Login
* Auto Token Refresh (Axios Interceptor)
* Toast Notifications
* Global Auth State using Context API

---
---

# 🚀 How to Run the Project

## 🐳 Step 1: Start Database (MongoDB using Docker)

Make sure Docker is installed, then run:

```bash
docker-compose up -d
```

👉 This will start the MongoDB container in the background.

---

## ⚙️ Step 2: Run Backend

```bash
cd backend
npm install
npm run dev
```

👉 Backend will start on:

```
http://localhost:5000
```

---

## 💻 Step 3: Run Frontend

```bash
cd frontend
npm install
npm run dev
```

👉 Frontend will start on:

```
http://localhost:5173
```

---

```bash
# Start DB
docker-compose up -d

# Run backend
cd backend
npm install
npm run dev

# Run frontend
cd frontend
npm install
npm run dev
```

---



## 📡 API Endpoints

### 🔹 Auth Routes

#### 1. Register

```
POST /api/auth/register
```

**Request:**

```json
{
  "username": "user123",
  "email": "user@gmail.com",
  "password": "123456"
}
```

**Response:**

```json
{
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "id": "...",
    "username": "user123",
    "email": "user@gmail.com"
  }
  "success": true
}
```

---

#### 2. Login

```
POST /api/auth/login
```
**Request:**

```json
{
  "email": "user@gmail.com",
  "password": "123456"
}
```

**Response:**

```json
{
  "statusCode": 201,
  "message": "login successful",
  "data": {
    "id": "...",
    "username": "user123",
    "email": "user@gmail.com"
  }
  "success": true
}
```

---

#### 3. Refresh Token

```
POST /api/auth/refresh
```
**Response:**

```json
{
    "statusCode": 200,
    "message": "Token refreshed successfully",
    "success": true
}
```

---

#### 4. Logout

```
POST /api/auth/logout
```
**Response:**

```json
{
    "statusCode": 200,
    "message": "Logged out successfully",
    "success": true
}
```

---

#### 5. Get Current User

```
GET /api/auth/me
```
**Response:**

```json
{
    "statusCode": 200,
    "message": "User info retrieved successfully",
    "data": "user123",
    "success": true
}
```

---

## 🔄 Authentication Flow

1. User registers/logs in
2. Server generates:

   * Access Token (short-lived)
   * Refresh Token (long-lived)
3. Tokens stored in **HTTP-only cookies**
4. Frontend calls `/me` to get user data
5. If access token expires:

   * Axios interceptor calls `/refresh`
   * New tokens issued automatically

---

## 🧠 Architecture

### Backend Structure

```
src/
├── controllers/
├── services/
├── models/
├── routes/
├── middlewares/
├── utils/
```

### Frontend Structure

```
src/
├── pages/
├── components/
├── context/
├── services/
```

---

## ⚙️ Key Implementations

### 🔹 Auth Context (Frontend)

* Manages global user state
* Calls `/me` only once
* Prevents unnecessary API calls

### 🔹 Axios Interceptor

* Handles 401 errors
* Automatically refreshes tokens
* Retries failed requests

### 🔹 Protected & Public Routes

* Restricts access based on authentication
* Prevents logged-in users from accessing login/register

---

## 🔐 Security Best Practices Used

* Password hashing with bcrypt
* HTTP-only cookies for tokens
* Token rotation strategy
* Input validation using Joi
* Centralized error handling
* CORS configuration with credentials



---

## 🌟 Conclusion

This project demonstrates:

* Full-stack development skills
* Secure authentication implementation
* Clean architecture and code structure
* Real-world production practices

---

## 👨‍💻 Author

Santanu Raj
