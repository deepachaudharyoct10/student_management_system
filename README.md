# Student Management System

A full-stack web application to manage student records with photo upload support.

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite) + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | PostgreSQL |

---

## Features

- Add student with full details (name, course, year, DOB, email, mobile, gender, address)
- Upload student photo
- Edit / update student details
- View all students in a structured list
- Delete student record
- Auto-generated unique Admission Number (`ADM-YYYY-XXXX`)
- Search / filter students by name or course
- Form validation (frontend & backend)
- Responsive UI design

---

## Project Structure

```
student_management_system/
├── backend/                  # Node.js + Express API
│   ├── src/
│   │   ├── config/           # Database connection
│   │   ├── controllers/      # Route logic
│   │   ├── routes/           # API routes
│   │   └── middleware/       # Multer photo upload
│   ├── uploads/              # Stored student photos
│   ├── .env                  # Environment variables
│   └── package.json
│
├── frontend/                 # React application
│   ├── src/
│   │   ├── api/              # Axios API calls
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   └── App.jsx
│   └── package.json
│
└── README.md
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | Fetch all students (supports `?search=`) |
| GET | `/api/students/:id` | Fetch single student |
| POST | `/api/students` | Add new student (with photo) |
| PUT | `/api/students/:id` | Update student details |
| DELETE | `/api/students/:id` | Delete student |

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- PostgreSQL v14+
- npm v9+

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd student_management_system
```

### 2. Database Setup
Open PostgreSQL and run:
```sql
CREATE DATABASE student_management;
```

### 3. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=student_management
```

Start the backend:
```bash
npm run dev
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 5. Open in Browser
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

---

## Database Schema

```sql
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  admission_number VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  course VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  date_of_birth DATE NOT NULL,
  email VARCHAR(100) NOT NULL,
  mobile_number VARCHAR(15) NOT NULL,
  gender VARCHAR(10) NOT NULL,
  address TEXT NOT NULL,
  photo_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Screenshots

> Coming soon

---

## Author

Deepa Chaudhary
