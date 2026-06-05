# ✈️ SkyBook Airlines

> A full-stack flight booking web application — book flights, manage reservations, check in, and more.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, React Router v7, Axios |
| **Backend** | Spring Boot 3.2.5, Java 21, Spring Security, JWT |
| **Database** | MySQL 8 |
| **Auth** | JWT (stateless, BCrypt password hashing) |
| **Hosting** | Vercel (frontend) + Railway (backend + MySQL) |

---

## 📁 Project Structure

```
skybook-web/
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── pages/     # Login, Register, Dashboard, BookingForm, etc.
│   │   ├── components/# Navbar
│   │   └── api.js     # Axios API client
│   └── .env.example   # Required environment variables
└── backend/           # Spring Boot app
    ├── src/main/java/com/skybook/
    │   ├── controller/  # REST endpoints
    │   ├── service/     # Business logic
    │   ├── model/       # JPA entities
    │   ├── repository/  # Spring Data JPA
    │   ├── security/    # JWT + Spring Security
    │   └── dto/         # Request/Response objects
    └── application.properties.example  # Required env vars
```

---

## 🚀 Local Development Setup

### Prerequisites
- Java 21+
- Maven 3.9+
- Node.js 20+
- MySQL 8

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/skybook-web.git
cd skybook-web
```

### 2. Set up the Database
```sql
CREATE DATABASE skybook_db;
```

### 3. Configure the Backend
```bash
cd backend
cp application.properties.example src/main/resources/application.properties
# Edit application.properties with your local DB credentials
```

### 4. Run the Backend
```bash
# Windows
build.bat
start.bat

# Or with Maven directly
mvn spring-boot:run
```
Backend runs on **http://localhost:8080**

### 5. Configure the Frontend
```bash
cd frontend
cp .env.example .env
# Edit .env if needed
npm install
npm run dev
```
Frontend runs on **http://localhost:5173**

---

## 🔐 Environment Variables

### Backend (`backend/src/main/resources/application.properties`)
| Variable | Description | Example |
|----------|-------------|---------|
| `DB_URL` | MySQL JDBC URL | `jdbc:mysql://localhost:3306/skybook_db` |
| `DB_USERNAME` | MySQL user | `root` |
| `DB_PASSWORD` | MySQL password | *(empty for local)* |
| `JWT_SECRET` | JWT signing key (min 32 chars) | *(generate a strong secret)* |
| `JWT_EXPIRATION` | Token TTL in ms | `86400000` (24h) |
| `ALLOWED_ORIGINS` | Frontend URL for CORS | `http://localhost:5173` |

### Frontend (`frontend/.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8080/api` |

---

## 📦 Features

- ✅ User registration & login (JWT auth)
- ✅ Browse & search flights (by origin, destination, date)
- ✅ Book flights with seat selection
- ✅ View & cancel bookings
- ✅ Self check-in
- ✅ Profile management
- ✅ Admin panel (manage flights & users)

---

## 🌐 Deployment

| Layer | Platform | Auto-deploys from |
|-------|----------|------------------|
| Frontend | [Vercel](https://vercel.com) | `main` branch push |
| Backend | [Railway](https://railway.app) | `main` branch push |
| Database | Railway MySQL plugin | — |

See the deployment guides in [docs/deployment.md](docs/deployment.md) for step-by-step instructions.

---

## 📄 License

MIT — feel free to use and adapt.
