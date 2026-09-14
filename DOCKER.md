# Forever E-Commerce Docker Setup Guide

This guide explains how to run, develop, and manage the Forever E-Commerce application using Docker and Docker Compose.

---

## 🏗️ Architecture

The project consists of 4 containerized services managed by Docker Compose:

| Service | Container Name | Technology | Port (Host:Container) | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend** | `forever-frontend` | React 18, Vite, Nginx Alpine | `5173:80` | Customer-facing storefront |
| **Admin** | `forever-admin` | React 18, Vite, Nginx Alpine | `5174:80` | Admin management dashboard |
| **Backend** | `forever-backend` | Node.js 20, Express | `4000:4000` | REST API service |
| **Mongo** | `forever-mongo` | MongoDB 7.0 | `27017:27017` | Local NoSQL database with volume persistence |

---

## 🚀 Quick Start (Production Mode)

### 1. Configure Environment Variables (Optional)
If you want to customize secrets or connect to Cloudinary/Stripe:
```bash
# Copy template to .env
cp .env.example .env
```
*(If no `.env` is provided, default dev secrets are applied automatically).*

### 2. Build and Start All Containers
```bash
docker compose up --build -d
```

### 3. Access Services
- **Storefront**: [http://localhost:5173](http://localhost:5173)
- **Admin Dashboard**: [http://localhost:5174](http://localhost:5174)
- **Backend Healthcheck**: [http://localhost:4000/](http://localhost:4000/)
- **MongoDB**: `localhost:27017`

---

## 🛠️ Development Mode (Live Reload / HMR)

If you want code changes to reflect instantly inside containers without rebuilding images:

```bash
docker compose -f docker-compose.dev.yml up --build
```
This mounts local source directories into the containers and runs Vite and Nodemon in watch mode.

---

## 📋 Common Docker Commands

### Check Running Containers & Health
```bash
docker compose ps
```

### View Live Logs
```bash
# All services
docker compose logs -f

# Specific service (e.g. backend or frontend)
docker compose logs -f backend
docker compose logs -f frontend
```

### Stop All Containers
```bash
docker compose down
```

### Stop All Containers & Reset Database Volume
```bash
docker compose down -v
```

### Rebuild a Specific Service
```bash
docker compose up -d --no-deps --build backend
```

### Access a Shell Inside a Container
```bash
# Backend container shell
docker exec -it forever-backend sh

# MongoDB shell
docker exec -it forever-mongo mongosh
```

---

## ⚙️ Environment Variables Reference

| Variable | Default | Purpose |
| :--- | :--- | :--- |
| `PORT` | `4000` | Backend listening port |
| `MONGODB_URI` | `mongodb://mongo:27017` | MongoDB connection string (set Atlas URI here if desired) |
| `ADMIN_EMAIL` | `admin@forever.com` | Default admin login email |
| `ADMIN_PASSWORD` | `adminpassword123` | Default admin login password |
| `JWT_SECRET` | *(secret)* | Secret key used to sign JWT tokens |
| `CLOUDINARY_NAME` | *(empty)* | Cloudinary cloud name for product images |
| `CLOUDINARY_API_KEY` | *(empty)* | Cloudinary API key |
| `CLOUDINARY_SECRET_KEY` | *(empty)* | Cloudinary secret key |
| `STRIPE_SECRET_KEY` | *(empty)* | Stripe payment gateway secret |
| `RAZORPAY_KEY_ID` | *(empty)* | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | *(empty)* | Razorpay secret key |
| `VITE_BACKEND_URL` | `http://localhost:4000` | URL used by web browsers to reach the backend API |
