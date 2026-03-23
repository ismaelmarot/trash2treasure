# TRASH2TREASURE

<img src="/frontend/public/icon-192.png" alt="Icon Cap" width="150">

_**Trash2Treasure es una aplicación móvil de reciclaje comunitario donde los usuarios reportan objetos abandonados y otros usuarios pueden recolectarlos.**_

La app fomenta el reciclaje y la reutilización, permitiendo a los usuarios ganar puntos, completar desafíos y desbloquear logros mientras contribuyen a un entorno más limpio.

![Version](https://img.shields.io/badge/version-1.0.2-orange?style=for-the-badge)
&nbsp;&nbsp;&nbsp;&nbsp;
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://github.com/ismaelmarot/trash2treasure/blob/HEAD/LICENSE)
&nbsp;&nbsp;&nbsp;&nbsp;

---

## 🔗 LIVE DEMO

| Service | URL | Status |
|---------|-----|--------|
| 🌐 **Frontend (Vercel)** | [https://trash2treasure-app.vercel.app](https://trash2treasure-app.vercel.app) | ![Vercel](https://img.shields.io/badge/Deployed-Yes-brightgreen?style=flat-square) |
| ⚙️ **Backend (Render)** | [https://trash2treasure.onrender.com](https://trash2treasure.onrender.com) | ![Render](https://img.shields.io/badge/Deployed-Yes-brightgreen?style=flat-square) |

---

## 🛠️ INFRASTRUCTURE & SERVICES

| Service | Badge | Description |
|---------|-------|-------------|
| **Frontend Deployment** | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white) | Hosting del frontend React con CDN global y SSL automático |
| **Backend Deployment** | ![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=black) | Hosting del backend Node.js/Express con auto-deploy |
| **Database** | ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white) | Base de datos NoSQL en la nube (MongoDB Atlas) |
| **Image Storage** | ![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white) | Almacenamiento y transformación de imágenes |
| **Email Service** | ![SendGrid](https://img.shields.io/badge/SendGrid-1A82E2?style=for-the-badge&logo=sendgrid&logoColor=white) | Servicio de envío de emails transaccionales |
| **Analytics** | ![Vercel Analytics](https://img.shields.io/badge/Vercel_Analytics-000000?style=for-the-badge&logo=vercel&logoColor=white) | Analíticas de visitantes y rendimiento |
| **UX/UI Design** | ![Figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white) | Diseño de interfaces y prototipado |

### Design Tools
![Figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)

---

## 📋 BADGES

### Project Info
![Version](https://img.shields.io/badge/version-1.0.0-orange?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)
![Last Commit](https://img.shields.io/github/last-commit/ismaelmarot/trash2treasure?style=for-the-badge)

### Frontend Stack
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Styled Components](https://img.shields.io/badge/Styled--Components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white)

### Backend Stack
![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

---

## What It Does?

- **Reportar objetos abandonados**: Usuarios fotografían y reportan objetos que encuentran en la calle
- **Recolectar objetos**: Otros usuarios pueden marcar objetos como "recolectados" para incentivar el reciclaje
- **Sistema de puntos Eco Points**: Gana puntos por reportar y recolectar objetos
- **Desafíos diarios, semanales, mensuales y anuales**: Completa misiones para ganar estrellas y trofeos
- **Logros desbloqueables**: Desbloquea logros por alcanzar metas específicas
- **Ranking comunitario**: Compite con otros usuarios en el ranking de recicladores
- **Eco Score semanal**: Calificación de A+++ a G basada en tu actividad semanal
- **Sistema de niveles**: Progresa desde "Curioso Verde" hasta "Gaia Ascendido"
- **Categorías y familias**: Clasificación de objetos por tipo (electrónicos, orgánicos, construcción, etc.)

---

## 📑 TABLE OF CONTENT

1. [Highlights](#highlights)
2. [Core Features](#core-features)
3. [Technologies Stack](#technologies-stack)
4. [Codebase Layer Map](#codebase-layer-map)
5. [Installation](#installation)
6. [Usage](#usage)
7. [Project Structure](#project-structure)
8. [API Endpoints](#api-endpoints)
9. [Database Models](#database-models)
10. [Screenshots](#screenshots)
11. [Live Demo](#live-demo)
12. [Versions](#versions)

---

## 🌟 HIGHLIGHTS

- Full-stack application with React frontend and Express backend
- MongoDB database with Mongoose ODM
- Responsive mobile-first design
- JWT authentication system
- Real-time point calculation and challenge tracking
- Modular architecture with reusable components
- Fully typed with TypeScript
- Styled-components for CSS-in-JS
- CI/CD deployment with Vercel (frontend) and Render (backend)

---

## ✨ CORE FEATURES

| Feature | Description |
|---------|-------------|
| User authentication | Registro, login y gestión de perfil con JWT |
| Report items | Fotografiar y reportar objetos abandonados con ubicación |
| Collect items | Marcar objetos como recolectados para ganar puntos extra |
| Eco Points | Sistema de puntos por acciones de reporte y recolección |
| Challenges | Desafíos con recompensas de estrellas y trofeos |
| Achievements | Logros desbloqueables por métricas específicas |
| Eco Score | Calificación semanal de A+++ a G según actividad |
| Division levels | Sistema de niveles progresivos de reciclaje |
| Community ranking | Ranking de usuarios por puntos totales |
| Categories | Clasificación por tipo: electrónicos, orgánicos, construcción, etc. |
| Families | Agrupación: ECO, TECH, HEAVY, PACKAGING, REUSE |

---

## 🛠️ TECHNOLOGIES STACK

| Category | Library / Tool | Version |
|----------|---------------|---------|
| Frontend UI | React | ^18.2.0 |
| Frontend Language | TypeScript | ~5.3.0 |
| Frontend Build | Vite | ^5.0.0 |
| Frontend Styling | styled-components | ^6.0.0 |
| Frontend Icons | react-icons | ^5.0.0 |
| Backend Framework | Express | ^4.18.0 |
| Backend Language | Node.js | ^22.0.0 |
| Database | MongoDB + Mongoose | Latest |
| Authentication | JWT | ^9.0.0 |
| Image Upload | Cloudinary | Latest |
| Deployment Frontend | Vercel | - |
| Deployment Backend | Render | - |

---

## 🔄 CODEBASE LAYER MAP

```mermaid
flowchart TD
    A["Frontend<br/>React + Vite + TypeScript"]
    B["Backend<br/>Express + MongoDB"]
    C["External Services<br/>Cloudinary, JWT"]
    
    A --> B
    B --> C
    
    subgraph Frontend
        A1["screens/"] --> A2["components/"]
        A2 --> A3["hooks/"]
        A3 --> A4["constants/"]
    end
    
    subgraph Backend
        B1["routes/"] --> B2["db/models.js"]
        B2 --> B3["middleware/"]
    end
```

---

## 🚀 INSTALLATION

### Prerequisites

- Node.js >= 18
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/ismaelmarot/trash2treasure.git
cd trash2treasure
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Install backend dependencies

```bash
cd backend
npm install
```

### 4. Setup environment variables

**Copy the example files and configure your secrets:**

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

**Then edit each `.env` file with your own values:**

**Backend (/backend/.env)**
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 3000) |
| `MONGODB_URI` | MongoDB connection string (local or Atlas) |
| `JWT_SECRET` | Secret key for JWT tokens (generate a strong random string) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

**Frontend (/frontend/.env)**
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL |

> ⚠️ **Important:** Never commit your `.env` files to version control. They are already in `.gitignore`.

### 5. Run development servers

**Backend**
```bash
cd backend
npm run dev
```

**Frontend**
```bash
cd frontend
npm run dev
```

### 6. Access the app

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

---

## ⚙️ USAGE

### User Flow

| Step | Description |
|------|-------------|
| 1 | Regístrate o inicia sesión |
| 2 | Explora el mapa de objetos reportados |
| 3 | Reporta un objeto abandonado con foto y ubicación |
| 4 | Recolecta objetos de otros usuarios para ganar puntos extra |
| 5 | Consulta tu puntuación en la pantalla de Puntos |
| 6 | Completa desafíos diarios, semanales, mensuales y anuales |
| 7 | Desbloquea logros alcanzables |
| 8 | Sube de nivel y mejora tu Eco Score |

---

## 📂 PROJECT STRUCTURE

```
TRASH2TREASURE
├── frontend/                    # React + Vite frontend
│   ├── src/
│   │   ├── App.tsx            # Root component
│   │   ├── screens/          # Screen components
│   │   │   ├── HomeScreen/
│   │   │   ├── MapScreen/
│   │   │   ├── PointsScreen/
│   │   │   └── ProfileScreen/
│   │   ├── components/       # Reusable UI components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── constants/        # App constants (colors, categories)
│   │   ├── types/            # TypeScript definitions
│   │   └── utils/            # Utility functions
│   └── public/
│
├── backend/                    # Express + MongoDB backend
│   ├── routes/                # API routes
│   │   ├── auth.routes.js
│   │   ├── items.routes.js
│   │   ├── points.routes.js
│   │   └── user.routes.js
│   ├── db/
│   │   ├── models.js         # Mongoose schemas
│   │   └── mongo.js          # MongoDB connection
│   ├── middleware/
│   │   └── auth.js
│   └── index.js              # Express app entry
│
├── public/
│   └── icons/
│       └── app-icon.png
│
├── README.md
├── LICENSE
└── package.json
```

---

## 📂 KEY MODULE RELATIONSHIPS

```mermaid
flowchart TD
    
    A["src/App.tsx"]
    A --> B["screens/HomeScreen"]
    A --> C["screens/MapScreen"]
    A --> D["screens/PointsScreen"]
    A --> E["screens/ProfileScreen"]
    
    D --> F["components/AchievementModal"]
    D --> G["hooks/useAuth"]
    
    B --> H["api/items"]
    C --> H
    E --> I["api/user"]
    
    H --> J["backend/routes/items.routes.js"]
    I --> K["backend/routes/user.routes.js"]
    
    J --> L["db/models.js (Item, UserPoints)"]
    K --> L
    
    L --> M["MongoDB Atlas"]
```

---

## 🔌 API ENDPOINTS

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Registro de usuario |
| POST | /api/auth/login | Inicio de sesión |
| GET | /api/auth/me | Usuario actual |

### Items

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/items | Listar todos los items |
| POST | /api/items | Crear nuevo item (reportar) |
| GET | /api/items/:id | Obtener item por ID |
| PUT | /api/items/:id/collect | Marcar item como recolectado |

### Points

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/points/my-points | Obtener puntos y progreso del usuario |
| GET | /api/points/ranking | Obtener ranking de usuarios |
| POST | /api/points/add-report | Agregar puntos por reporte |
| POST | /api/points/add-collect | Agregar puntos por recolección |

### User

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/user/profile | Perfil del usuario |
| PUT | /api/user/profile | Actualizar perfil |

---

## 💾 DATABASE MODELS

### User

```javascript
{
  name: String,
  email: String (unique),
  password_hash: String,
  profile_image: String (Cloudinary URL),
  country: String,
  state: String,
  city: String,
  created_at: Date
}
```

### Item

```javascript
{
  user_id: ObjectId (ref: User),
  title: String,
  description: String,
  category: String,
  photos: [String],
  latitude: Number,
  longitude: Number,
  status: String (available | collected),
  collected_by: ObjectId (ref: User),
  created_at: Date
}
```

### UserPoints

```javascript
{
  user_id: ObjectId (ref: User),
  total_points: Number,
  total_reports: Number,
  total_collected: Number,
  division: String,
  category_points: Map,
  family_reports: Object,
  current_streak: Number,
  max_streak: Number,
  daily_reports: Number,
  weekly_reports: Number,
  monthly_reports: Number
}
```

### Achievement

```javascript
{
  user_id: ObjectId,
  achievement_id: String,
  name: String,
  description: String,
  icon: String,
  unlocked_at: Date
}
```

### UserChallengeProgress

```javascript
{
  user_id: ObjectId,
  challenge_id: String,
  period_start: Date,
  period_type: String (daily | weekly | monthly | annual),
  current_progress: Number,
  stars: Number,
  trophies: Number,
  completed: Boolean
}
```

---

## 📸 SCREENS

### Mobile Screenshots

*(Coming soon)*

---

## 🌍 LIVE DEMO

- **Frontend**: https://trash2treasure-app.vercel.app
- **Backend**: https://trash2treasure-api.onrender.com

---

## 📌 VERSIONS

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 22/03/2026 | Initial release - Core app with reporting, collecting, points, challenges, achievements, ranking, and Eco Score |

---

## 🔒 SECURITY

This project is designed to be safe for public deployment:

- **Environment Variables**: All sensitive data (API keys, database URLs, JWT secrets) are stored in `.env` files which are gitignored
- **Template Files**: `.env.example` files are provided as templates for configuration
- **No Hardcoded Secrets**: The codebase contains no hardcoded credentials
- **Password Hashing**: User passwords are hashed using bcrypt
- **JWT Authentication**: Secure token-based authentication with expiration

### For Production Deployment

1. Generate strong random values for all secrets
2. Use a secure MongoDB Atlas cluster with IP whitelist
3. Enable Cloudinary security features (unsigned uploads disabled)
4. Set up proper CORS configuration
5. Use HTTPS for all communications

---

## 📄 LICENSE

This project is licensed under the MIT License - see the [LICENSE](/trash2treasure/blob/main/LICENSE) file for details.

---

## 📬 CONTACT

Open to collaboration, feedback, and new opportunities.

[![GitHub](https://img.shields.io/badge/GitHub-ismaelmarot-181717?style=for-the-badge&logo=github)](https://github.com/ismaelmarot)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-ismael--marot-0077B5?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/ismael-marot)
[![Portfolio](https://img.shields.io/badge/Portfolio-ishmarot-FF5722?style=for-the-badge&logo=google-chrome)](https://ismaelmarot.github.io)
