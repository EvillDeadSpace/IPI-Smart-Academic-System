<div align="center">

# 🔧 IPI Smart Academic System - Backend API

### *RESTful API with Express, Prisma & PostgreSQL for Serverless Deployment*

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5.1-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.17-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

**[🚀 Live API](https://ipi-smart-academic-system-dzhc.vercel.app)** • **[📚 Main Docs](../README.md)** • **[🔗 Prisma Schema](prisma/schema.prisma)**

</div>

---

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [📁 Project Structure](#-project-structure)
- [🌐 API Endpoints](#-api-endpoints)
- [💾 Database Schema](#-database-schema)
- [🔒 Authentication](#-authentication)
- [🚢 Deployment](#-deployment)

---

## 🎯 Overview

The **backend** is a modern **Node.js REST API** built with **Express 5** and **TypeScript**, providing a robust, type-safe foundation for the academic management system. It leverages **Prisma ORM** for database interactions with **PostgreSQL**, optimized for **serverless deployment** on Vercel.

### **🌟 Design Goals**

- **🔒 Security First** - Input validation, SQL injection protection, secure authentication
- **⚡ Performance** - Connection pooling via Prisma Accelerate, optimized queries
- **📊 Type Safety** - End-to-end TypeScript with Prisma Client
- **🧩 Modularity** - Clean architecture: Controllers → Services → Database
- **🚀 Scalability** - Serverless-ready, stateless design
- **🔧 Maintainability** - SOLID principles, clear separation of concerns

---

## ✨ Features

### **🔐 Dual Authentication System**

<table>
<tr>
<td width="50%">

**👨‍🎓 Student Login**
- Email/password authentication
- Student-specific data access
- Academic progress tracking
- Exam registration
- Grade viewing

</td>
<td width="50%">

**👨‍🏫 Professor Login**
- Separate professor credentials
- Subject assignment
- Exam creation & management
- Grade submission
- Student analytics

</td>
</tr>
</table>

### **📊 Core Functionalities**

- **👥 User Management** - CRUD operations for students, professors, admins
- **📚 Subject System** - Course catalog with ECTS credits, prerequisites, semesters
- **📝 Exam Scheduling** - Create exam sessions, manage registrations
- **✅ Grading Engine** - Automatic grade calculation (5-10 scale based on points)
- **📈 Progress Tracking** - Real-time ECTS calculation, year progression rules
- **🔗 Enrollment System** - Student-subject associations with validation
- **🎓 Major Configuration** - Study program management

### **🛡️ Validation & Error Handling**

- **Input Validation** - Zod schemas for request body validation
- **CORS Protection** - Configured allowed origins
- **SQL Injection Safe** - Parameterized queries via Prisma
- **Comprehensive Errors** - Structured error responses with status codes

---

## 🏗️ Architecture

### **Clean Architecture Pattern**

```
┌─────────────────────────────────────────────┐
│          🌐 Routes (Routing Layer)          │
│  Define HTTP endpoints & method handlers    │
└───────────────┬─────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────┐
│       🎮 Controllers (Request Handlers)      │
│  Parse requests, call services, send response│
└───────────────┬─────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────┐
│      🧠 Services (Business Logic)            │
│  Validate rules, orchestrate operations      │
└───────────────┬─────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────┐
│     💾 Prisma Client (Data Access)          │
│  Type-safe database queries                  │
└───────────────┬─────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────┐
│       📊 PostgreSQL (Database)               │
│  Persistent data storage                     │
└─────────────────────────────────────────────┘
```

### **Request Flow Example**

```typescript
// 1. Route definition (routes/studentRoutes.ts)
router.post('/enroll', studentController.enrollInSubject)

// 2. Controller (controllers/studentController.ts)
export const enrollInSubject = async (req: Request, res: Response) => {
  try {
    const { studentEmail, subjectId } = req.body
    const result = await enrollmentService.enroll(studentEmail, subjectId)
    res.status(201).json(result)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// 3. Service (services/enrollmentService.ts)
export const enroll = async (email: string, subjectId: number) => {
  // Validation logic
  const student = await prisma.student.findUnique({ where: { email } })
  if (!student) throw new Error('Student not found')
  
  // Business logic: Check ECTS limit, prerequisites, etc.
  const currentECTS = await calculateStudentECTS(student.id)
  if (currentECTS >= 60) throw new Error('ECTS limit exceeded')
  
  // Database operation
  return await prisma.studentEnrollment.create({
    data: { studentId: student.id, subjectId }
  })
}

// 4. Prisma query (auto-generated type-safe code)
// Returns typed data, prevents SQL injection
```

---

## 🛠️ Tech Stack

### **Core Technologies**

| Technology | Version | Purpose | Key Benefits |
|------------|---------|---------|--------------|
| ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white&style=flat-square) **Node.js** | 20+ | JavaScript Runtime | LTS support, ESM modules, async/await |
| ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white&style=flat-square) **TypeScript** | 5.6.3 | Language | Type safety, IntelliSense, compile-time checks |
| ![Express](https://img.shields.io/badge/-Express-000000?logo=express&logoColor=white&style=flat-square) **Express** | 5.1.0 | Web Framework | Minimalist, middleware-based, battle-tested |
| ![Prisma](https://img.shields.io/badge/-Prisma-2D3748?logo=prisma&logoColor=white&style=flat-square) **Prisma** | 6.17.1 | ORM | Type-safe queries, migrations, introspection |
| ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-336791?logo=postgresql&logoColor=white&style=flat-square) **PostgreSQL** | 16 | Database | ACID compliance, advanced features |

### **Libraries & Middleware**

| Package | Purpose |
|---------|---------|
| **cors** | Cross-Origin Resource Sharing |
| **dotenv** | Environment variable management |
| **zod** | Schema validation |
| **bcryptjs** | Password hashing (if implementing auth) |
| **jsonwebtoken** | JWT token generation/verification |

### **Database Tools**

| Tool | Purpose |
|------|---------|
| **Prisma Migrate** | Database schema migrations |
| **Prisma Studio** | Visual database browser |
| **Prisma Accelerate** | Connection pooling for serverless |

---

## 🚀 Getting Started

### **Prerequisites**

- **Node.js** 20+ and npm
- **PostgreSQL** 16+ (local or cloud)
- **Git** for version control

### **Installation**

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# This installs:
# - Express 5.1.0
# - Prisma 6.17.1
# - TypeScript 5.6.3
# - Zod, CORS, dotenv
# - All dev dependencies (ts-node, nodemon, @types/*)
```

### **Environment Configuration**

Create `.env` file in `backend/` directory:

```env
# Database Connection (Prisma Accelerate format)
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOi..."

# Alternative: Direct PostgreSQL connection
# DATABASE_URL="postgresql://user:password@localhost:5432/faculty_db"

# Server Configuration
NODE_ENV=development
PORT=3001

# CORS Settings (comma-separated origins)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# JWT Secret (for authentication)
JWT_SECRET=your_super_secret_key_change_in_production_minimum_32_characters

# Optional: Prisma Studio
PRISMA_STUDIO_PORT=5555
```

### **Database Setup**

```bash
# Generate Prisma Client from schema
npx prisma generate

# Apply schema to database (creates tables)
npx prisma db push

# Optional: Run migrations (for production)
npx prisma migrate dev --name init

# Optional: Seed database with test data
npm run seed
```

### **Running Development Server**

```bash
# Start server with hot-reload (nodemon + ts-node)
npm run dev

# Output:
# 🚀 Server running on http://localhost:3001
# 📊 Database connected
# ✅ CORS enabled for: http://localhost:5173
```

**What happens:**
1. TypeScript files compiled on-the-fly by `ts-node`
2. Express server listens on port **3001**
3. Prisma Client connects to database
4. Hot-reload via `nodemon` (detects file changes)
5. CORS middleware configured

### **Building for Production**

```bash
# Compile TypeScript to JavaScript
npm run build

# Output: dist/ directory with compiled JS

# Run production server
npm start
```

### **Database Management**

```bash
# Open Prisma Studio (visual database editor)
npx prisma studio
# → http://localhost:5555

# View database schema
npx prisma db pull

# Create migration
npx prisma migrate dev --name add_new_field

# Apply migrations (production)
npx prisma migrate deploy

# Reset database (⚠️ DELETES ALL DATA)
npx prisma migrate reset
```

---

## 📁 Project Structure

```
backend/
│
├── 📂 prisma/                    # Prisma ORM configuration
│   ├── schema.prisma            # Database schema definition
│   ├── migrations/              # Database migration history
│   │   ├── 20251015131059_init/
│   │   ├── 20251116_add_exams/
│   │   └── migration_lock.toml
│   ├── seed.ts                  # Database seeding script
│   ├── seed-new.ts              # Updated seed data
│   ├── enroll-student.ts        # Enrollment test script
│   ├── create-test-exams.ts     # Exam data seeding
│   └── test-available-exams.ts  # Exam query testing
│
├── 📂 src/                       # Source code
│   │
│   ├── 📂 controllers/          # Request handlers
│   │   ├── authController.ts          # Login/register
│   │   ├── studentController.ts       # Student operations
│   │   ├── professorController.ts     # Professor operations
│   │   ├── examController.ts          # Exam CRUD
│   │   ├── subjectController.ts       # Subject management
│   │   ├── enrollmentController.ts    # Student enrollment
│   │   ├── gradeController.ts         # Grading operations
│   │   └── adminController.ts         # Admin functions
│   │
│   ├── 📂 services/             # Business logic layer
│   │   ├── authService.ts             # Authentication logic
│   │   ├── studentService.ts          # Student business rules
│   │   ├── professorService.ts        # Professor operations
│   │   ├── examService.ts             # Exam scheduling logic
│   │   ├── enrollmentService.ts       # Enrollment validation
│   │   ├── gradeService.ts            # Grade calculations
│   │   └── progressService.ts         # Academic progress tracking
│   │
│   ├── 📂 routes/               # Express route definitions
│   │   ├── authRoutes.ts              # POST /api/auth/login
│   │   ├── studentRoutes.ts           # /api/student/*
│   │   ├── professorRoutes.ts         # /api/professor/*
│   │   ├── examRoutes.ts              # /api/exams/*
│   │   ├── subjectRoutes.ts           # /api/subjects/*
│   │   ├── enrollmentRoutes.ts        # /api/enrollments/*
│   │   └── adminRoutes.ts             # /api/admin/*
│   │
│   ├── 📂 types/                # TypeScript type definitions
│   │   ├── user.types.ts              # User, Student, Professor
│   │   ├── exam.types.ts              # Exam, Registration
│   │   ├── subject.types.ts           # Subject, Enrollment
│   │   ├── grade.types.ts             # Grade, GradeHistory
│   │   └── api.types.ts               # API request/response types
│   │
│   ├── 📂 utils/                # Utility functions
│   │   ├── gradeCalculator.ts         # Points → Grade conversion
│   │   ├── ectsCalculator.ts          # ECTS tracking
│   │   ├── validators.ts              # Zod validation schemas
│   │   ├── errorHandler.ts            # Centralized error handling
│   │   └── logger.ts                  # Logging utility
│   │
│   ├── 📂 config/               # Configuration files
│   │   ├── cors.ts                    # CORS middleware setup
│   │   ├── database.ts                # Prisma client instance
│   │   └── constants.ts               # App-wide constants
│   │
│   ├── 📄 app.ts                # Express app setup (middleware, routes)
│   └── 📄 server.ts             # HTTP server initialization
│
├── 📂 generated/                 # Prisma generated files
│   └── prisma/
│       ├── client.js            # Prisma Client library
│       ├── index.d.ts           # TypeScript definitions
│       └── schema.prisma        # Copied schema
│
├── 📂 api/                       # Vercel serverless entry point
│   └── index.ts                 # Exports Express app for Vercel
│
├── 📄 package.json              # Dependencies & scripts
├── 📄 tsconfig.json             # TypeScript configuration
├── 📄 vercel.json               # Vercel deployment config
├── 📄 .env                      # Environment variables (not in Git)
└── 📄 README.md                 # This file
```

---

## 🌐 API Endpoints

### **🔐 Authentication**

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/api/auth/login` | Student/Professor login | `{ email, password }` | `{ userType, email, token }` |
| POST | `/api/auth/register/student` | Register new student (Admin only) | `{ email, password, firstName, lastName, majorId }` | `{ id, email, userType }` |
| POST | `/api/auth/register/professor` | Register new professor (Admin only) | `{ email, password, firstName, lastName }` | `{ id, email, userType }` |
| POST | `/api/auth/logout` | Logout user | - | `{ message: "Logged out" }` |

**Login Request Example:**

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@example.com","password":"password123"}'
```

**Success Response:**

```json
{
  "userType": "STUDENT",
  "email": "student@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### **👨‍🎓 Student Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/student/progress/:email` | Get academic progress (ECTS, GPA, completed courses) | ✅ Student |
| POST | `/api/student/enroll` | Enroll in subject | ✅ Student |
| GET | `/api/student/exams/available` | List upcoming exams student can register for | ✅ Student |
| POST | `/api/student/exams/:examId/register` | Register for specific exam | ✅ Student |
| GET | `/api/student/grades/:email` | Get all grades | ✅ Student |
| GET | `/api/student/schedule/:email` | Get course schedule | ✅ Student |

**Progress Response Example:**

```json
{
  "student": {
    "email": "student@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "major": "Computer Science"
  },
  "progress": {
    "totalECTS": 45,
    "currentYear": 2,
    "gpa": 8.5,
    "completedCourses": 12,
    "enrolledCourses": 6
  },
  "subjects": [
    {
      "name": "Mathematics 1",
      "ects": 6,
      "grade": 9,
      "status": "PASSED"
    }
  ]
}
```

---

### **👨‍🏫 Professor Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/professor/exam` | Create new exam session | ✅ Professor |
| PUT | `/api/professor/exam/:examId` | Update exam details | ✅ Professor |
| DELETE | `/api/professor/exam/:examId` | Cancel exam | ✅ Professor |
| POST | `/api/professor/grade` | Submit student grade | ✅ Professor |
| GET | `/api/professor/students/:subjectId` | List students enrolled in subject | ✅ Professor |
| GET | `/api/professor/analytics/:subjectId` | Get subject performance statistics | ✅ Professor |

**Create Exam Request:**

```json
POST /api/professor/exam

{
  "subjectId": 5,
  "date": "2026-03-15",
  "time": "10:00",
  "location": "Amphitheater 101",
  "type": "FINAL",
  "maxStudents": 50
}
```

**Grade Submission Request:**

```json
POST /api/professor/grade

{
  "studentEmail": "student@example.com",
  "subjectId": 5,
  "examId": 12,
  "points": 85,
  "comment": "Excellent work"
}
```

**Grade Calculation:**
- 0-50 points → Grade 5 (FAIL)
- 51-60 → Grade 6
- 61-70 → Grade 7
- 71-80 → Grade 8
- 81-90 → Grade 9
- 91-100 → Grade 10

---

### **🛡️ Admin Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/admin/major` | Create study program | ✅ Admin |
| POST | `/api/admin/subject` | Add new subject to catalog | ✅ Admin |
| PUT | `/api/admin/subject/:subjectId` | Update subject details | ✅ Admin |
| GET | `/api/admin/users` | List all users (students, professors) | ✅ Admin |
| DELETE | `/api/admin/user/:userId` | Delete user account | ✅ Admin |
| GET | `/api/admin/analytics` | System-wide statistics | ✅ Admin |

**Create Subject Request:**

```json
POST /api/admin/subject

{
  "name": "Advanced Algorithms",
  "code": "CS301",
  "ects": 6,
  "semester": 3,
  "year": 2,
  "majorId": 1,
  "prerequisites": [2, 5]  // Subject IDs
}
```

---

### **📊 Subject & Enrollment Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/subjects` | List all subjects | ✅ |
| GET | `/api/subjects/:majorId` | Subjects for specific major | ✅ |
| POST | `/api/enrollments` | Enroll student in subject | ✅ Student |
| DELETE | `/api/enrollments/:enrollmentId` | Withdraw from subject | ✅ Student |
| GET | `/api/enrollments/student/:email` | Get student's enrolled subjects | ✅ Student |

---

## 💾 Database Schema

### **Entity Relationship Diagram**

```mermaid
erDiagram
    Student ||--o{ StudentEnrollment : enrolls
    Student ||--o{ Grade : receives
    Student ||--o{ ExamRegistration : registers
    Student }o--|| Major : belongs_to
    
    Professor ||--o{ SubjectAssignment : teaches
    Professor ||--o{ Exam : creates
    
    Subject ||--o{ StudentEnrollment : has
    Subject ||--o{ Grade : for
    Subject ||--o{ Exam : has
    Subject }o--|| Major : belongs_to
    
    Exam ||--o{ ExamRegistration : has
    Exam ||--o{ Grade : results_in
    
    Student {
        int id PK
        string email UK
        string password
        string firstName
        string lastName
        int majorId FK
        datetime createdAt
    }
    
    Professor {
        int id PK
        string email UK
        string password
        string firstName
        string lastName
        datetime createdAt
    }
    
    Subject {
        int id PK
        string name
        string code UK
        int ects
        int semester
        int year
        int majorId FK
    }
    
    Major {
        int id PK
        string name UK
        int duration
    }
    
    StudentEnrollment {
        int id PK
        int studentId FK
        int subjectId FK
        datetime enrolledAt
    }
    
    Exam {
        int id PK
        int subjectId FK
        int professorId FK
        datetime date
        string time
        string location
        string type
        int maxStudents
    }
    
    Grade {
        int id PK
        int studentId FK
        int subjectId FK
        int examId FK
        int grade
        int points
        datetime createdAt
    }
```

### **Key Tables**

#### **Student**
- Stores student account information
- Links to `Major` (study program)
- Password hashed with bcrypt

#### **Professor**
- Professor account details
- Can teach multiple subjects

#### **Subject**
- Course catalog
- ECTS credits, semester, year
- Belongs to a `Major`

#### **StudentEnrollment**
- Many-to-many relationship (Student ↔ Subject)
- Tracks which students are enrolled in which courses
- Created when student enrolls

#### **Exam**
- Exam sessions created by professors
- Links to `Subject` and `Professor`
- Has date, time, location, max capacity

#### **ExamRegistration**
- Tracks which students registered for which exams
- Created when student registers

#### **Grade**
- Final grades for students
- Links to `Student`, `Subject`, `Exam`
- Stores both numeric grade (5-10) and points (0-100)

### **Database Constraints**

- **Unique Constraints**: Student/Professor emails, Subject codes
- **Foreign Keys**: Cascading deletes where appropriate
- **Check Constraints**: Grade between 5-10, Points 0-100, ECTS > 0

---

## 🔒 Authentication & Authorization

### **JWT-Based Authentication**

```typescript
// Generate JWT token on login
import jwt from 'jsonwebtoken'

const generateToken = (userId: number, userType: string) => {
  return jwt.sign(
    { userId, userType },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  )
}

// Verify token middleware
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
}

// Role-based authorization
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!allowedRoles.includes(req.user.userType)) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    next()
  }
}
```

**Usage in Routes:**

```typescript
router.post('/exam', 
  authenticate, 
  requireRole(['PROFESOR']), 
  professorController.createExam
)
```

---

## 🚢 Deployment

### **Deploying to Vercel (Serverless)**

**Prerequisites:**
- Vercel account
- Neon/Supabase PostgreSQL database
- Prisma Accelerate configured

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Vercel Configuration** (`vercel.json`):

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "api/index.ts"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

**Serverless Entry Point** (`api/index.ts`):

```typescript
import app from '../src/app'

export default app
```

**Environment Variables in Vercel Dashboard:**
- `DATABASE_URL` - Prisma Accelerate connection string
- `JWT_SECRET` - Strong secret key
- `ALLOWED_ORIGINS` - Frontend URLs

---

### **Alternative: Deploying to Railway/Render**

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

**Set environment variables:**
```bash
railway variables set DATABASE_URL=postgresql://...
railway variables set JWT_SECRET=...
```

---

## 🧪 Testing

### **Running Seed Scripts**

```bash
# Seed database with test data
npm run seed

# This creates:
# - 2 majors (Computer Science, Electrical Engineering)
# - 10 subjects
# - 5 students
# - 3 professors
# - Subject assignments
# - Sample enrollments
```

### **Testing API Endpoints**

```bash
# Install HTTPie or use curl
npm install -g httpie

# Test login
http POST http://localhost:3001/api/auth/login email=student@example.com password=test123

# Test protected route (with token)
http GET http://localhost:3001/api/student/progress/student@example.com \
  Authorization:"Bearer YOUR_TOKEN_HERE"
```

---

## 📚 Additional Resources

- **[Prisma Documentation](https://www.prisma.io/docs)** - ORM guide
- **[Express Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)** - Security tips
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)** - Learn TypeScript
- **[PostgreSQL Tutorial](https://www.postgresql.org/docs/16/tutorial.html)** - Database fundamentals

---

<div align="center">

### ⚡ Powered by modern backend technologies

**Built with ❤️ for scalable, type-safe APIs**

[⬆ Back to Top](#-ipi-smart-academic-system---backend-api)

</div>
