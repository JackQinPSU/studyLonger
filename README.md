# StudyLonger — Minimalist Study Tracking App

🌐 **Live Website:** https://study-longer.vercel.app/

StudyLonger is a minimalist study tracking app that helps you build consistent habits, measure your weekly/monthly focus time, and visualizes progress with clean charts.

Built with:
- **React + Vite** (frontend)
- **Node + Express** (backend)
- **Prisma ORM + PostgreSQL** (database)
- **Recharts** for data visualization

---

## ✨ Features

- ⏱ Start/End study sessions with 1 click
- 📊 Weekly + Monthly time graphs
- 🧠 Subject-based breakdowns (Pie chart)
- 🔐 Email + password authentication
- 🍪 Secure cookie-based sessions
- 🌐 Works locally & deployable to Render / Railway / Vercel

---

## 🛠 Tech Stack

### **Frontend**
- React
- Vite
- TailwindCSS
- Recharts

### **Backend**
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- bcrypt (password hashing)
- cookie-parser (auth cookies)
- CORS enabled for frontend communication

---

## 📦 Project Structure

```
studyLonger/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── index.js        # Express server entry
│   │   ├── prisma.js       # Prisma client
│   │   └── middleware/
│   │       └── requireAuth.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   └── services/
    └── package.json
```

---

## 🚀 Getting Started (Local Dev)

### **1. Clone Repo**
```sh
git clone https://github.com/YOUR_USERNAME/studyLonger.git
cd studyLonger
```

### **2. Setup Backend**

#### Install deps:
```sh
cd backend
npm install
```

#### Configure `.env`:
```
DATABASE_URL="postgresql://<user>:<pass>@localhost:5432/<db>"
CORS_ORIGIN="http://localhost:5173"
NODE_ENV=development
```

#### Push schema + generate client:
```sh
npx prisma migrate dev --name init
```

#### Run backend:
```sh
npm run dev
```

Backend runs at:
```
http://localhost:3000
```

---

### **3. Setup Frontend**

#### Install deps:
```sh
cd ../frontend
npm install
```

#### Create `.env`:
```
VITE_API_URL="http://localhost:3000"
```

#### Run dev:
```sh
npm run dev
```

Frontend runs at:
```
http://localhost:5173
```

---

## 🔐 Authentication Flow

- Client sends POST `/api/auth/login`
- Backend validates credentials with Prisma
- Secure `sessionToken` cookie is set
- Frontend includes `credentials: "include"` on fetch requests
- Auth middleware verifies token for protected routes

---

## 📡 API Endpoints (Backend)

### **Auth**
| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Verify session |

### **Users**
| Method | Route | Description |
|---|---|---|
| POST | `/api/users/createUser` | Register user |

### **Sessions**
| Method | Route | Description |
|---|---|---|
| POST | `/api/sessions/create` | Start study session |
| PATCH | `/api/sessions/:id/end` | End study session |
| GET | `/api/sessions/` | List sessions |

---

## 🌍 Deployment Notes

You can deploy using:

- **Render (Backend + DB)**
- **Railway (Backend + DB)**
- **Vercel (Frontend)**

Set environment variables:

```
DATABASE_URL=...
NODE_ENV=production
CORS_ORIGIN="https://your-frontend-domain.com"
```

For Vercel, set:
```
VITE_API_URL="https://your-backend-domain.com"
```

---

## 🧪 Future Improvements

- Custom session durations
- Productivity streaks
- OAuth login (Google/GitHub)
- Dark mode UI
- Mobile app (React Native)

---

## 📜 License

MIT License © 2026 — Your Name Here
