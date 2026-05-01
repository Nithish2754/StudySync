# 📚 StudySync — AI-Powered Study Planner & Pomodoro App

A full-stack MERN productivity platform built for students. Features a Pomodoro timer, smart study planner, weekly timetable, analytics dashboard, and notes — all in a stunning glassmorphism UI.

---

## 🚀 Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | React 19, Vite, Framer Motion, Recharts         |
| Backend   | Node.js, Express.js                             |
| Database  | MongoDB Atlas (Mongoose)                        |
| Auth      | JWT + bcryptjs                                  |
| Styling   | Vanilla CSS (glassmorphism design system)       |
| State     | React Context API                               |
| HTTP      | Axios with JWT interceptors                     |

---

## 📁 Folder Structure

```
StudySync/
├── server/
│   ├── models/          # Mongoose schemas (User, Task, PomodoroSession, Note, Timetable)
│   ├── routes/          # Express route files
│   ├── controllers/     # Business logic controllers
│   ├── middleware/      # Auth + Error middleware
│   ├── index.js         # Express entry point
│   └── .env             # Environment variables
├── client/
│   ├── src/
│   │   ├── context/     # AuthContext + ThemeContext
│   │   ├── pages/       # All 9 pages
│   │   ├── components/  # Layout (Sidebar, Topbar) + UI components
│   │   └── utils/       # Axios API instance
│   └── .env             # VITE_API_URL
├── start_app.bat        # One-click startup (Windows)
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. MongoDB Atlas
1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com) and create a free cluster
2. Create a database user with username + password
3. Whitelist your IP (or use `0.0.0.0/0` for development)
4. Copy your connection string (Drivers → Node.js)

### 2. Configure Environment Variables

Edit `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/studysync
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

### 3. Install Dependencies

```bash
# Install server deps
cd server
npm install

# Install client deps
cd ../client
npm install --legacy-peer-deps
```

### 4. Start the App

**Option A — One-click (Windows):**
```
Double-click start_app.bat
```

**Option B — Manual:**
```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

App runs at:
- Frontend → **http://localhost:3000**
- Backend API → **http://localhost:5000/api**

---

## 🔌 API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET  | `/api/auth/me` | Get current user |

### Tasks
| Method | Route | Description |
|--------|-------|-------------|
| GET    | `/api/tasks` | Get all tasks (filterable) |
| POST   | `/api/tasks` | Create task |
| PUT    | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

### Pomodoro
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/pomodoro/session` | Log a session |
| GET  | `/api/pomodoro/sessions` | Get history |
| GET  | `/api/pomodoro/today` | Today's summary |

### Notes
| Method | Route | Description |
|--------|-------|-------------|
| GET    | `/api/notes` | Get all notes |
| POST   | `/api/notes` | Create note |
| PUT    | `/api/notes/:id` | Update note |
| DELETE | `/api/notes/:id` | Delete note |

### Timetable
| Method | Route | Description |
|--------|-------|-------------|
| GET    | `/api/timetable` | Get user's timetable |
| POST   | `/api/timetable` | Add time block |
| PUT    | `/api/timetable/:blockId` | Update block |
| DELETE | `/api/timetable/:blockId` | Delete block |

### Analytics
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/analytics/dashboard` | Dashboard stats |
| GET | `/api/analytics/weekly` | Weekly breakdown |

---

## 🌐 Deployment

### 1. Frontend → Netlify (Recommended)
1. Push your code to GitHub.
2. Create a new site on [Netlify](https://www.netlify.com/).
3. Connect your repository.
4. Set the Base Directory to `client`.
5. Build Command: `npm run build`
6. Publish Directory: `client/dist`
7. Add Environment Variable: `VITE_API_URL=https://your-backend-url.vercel.app/api`
*(Note: A `netlify.toml` and `_redirects` file are already included for React Router support!)*

### 2. Frontend → Vercel (Alternative)
1. Create a new project on [Vercel](https://vercel.com).
2. Import your repository and set the Root Directory to `client`.
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Add Environment Variable: `VITE_API_URL=https://your-backend-url.vercel.app/api`
*(Note: A `vercel.json` file is already included for React Router support!)*

### 3. Backend → Vercel (Serverless API)
1. Create a new project on [Vercel](https://vercel.com).
2. Import your repository and set the Root Directory to `server`.
3. Override the Build Command: `npm install`
4. Add all environment variables from `server/.env` (`MONGO_URI`, `JWT_SECRET`, etc.).
5. Add `CLIENT_URL=https://your-frontend-url.netlify.app` to allow CORS.
*(Note: A `vercel.json` file is already included in the server folder to host Express as Serverless Functions!)*

---

## ✨ Features

- 🔐 JWT Authentication (login/register/logout)
- 🍅 Pomodoro Timer with SVG ring animation, session history, auto-switch
- 📋 Study Planner with priority, deadlines, search & filter
- 📅 Weekly Timetable with color-coded blocks
- 📊 Analytics with area, bar, pie & line charts
- 📝 Notes with pin, color coding, search
- 👤 Profile page with theme toggle & settings
- 🌙 Dark / Light mode
- 📱 Fully responsive design

---

## 👨‍💻 Author

Built with ❤️ using the MERN stack for students who want to study smarter.
