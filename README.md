# Full Stack Django + React Authentication System

## Overview
This is a full-stack authentication system built using **Django REST Framework (backend)** and **React (frontend)**.

It supports:
- User Registration
- JWT Authentication (Login/Protected routes)
- Google Login (OAuth token verification)
- Facebook Login (Graph API integration)
- Password Reset via Email

---

##  Tech Stack

### Backend
- Django
- Django REST Framework
- SimpleJWT
- Google Auth Library
- Requests (Facebook API)
- Django Email System
- django-cors-headers

### Frontend
- React (Vite)
- Axios
- JWT handling
- Google & Facebook Login integration

---

##  Features

### 1. User Authentication
- Register new user
- Login with JWT tokens
- Protected API routes

### 2. Google Login
- OAuth token verification using Google
- User auto-creation if not exists
- JWT token generation

### 3. Facebook Login
- Facebook Graph API integration
- Fetch user details (name, email)
- Auto user creation
- JWT authentication

### 4. Password Reset System
- Forgot password via email
- Secure token generation
- Password reset link sent to frontend
- Token validation and password update

---
## 5. CORS Setup (Important)

- install django-cors-headers


