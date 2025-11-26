# 🎓 IPI Smart Academic System - Backend API

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5.1-green?logo=express)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.17-2D3748?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://www.postgresql.org/)

RESTful API backend za akademski sistem sa Prisma ORM i Vercel serverless deploymentom.

## ✨ Features

- 🔐 **Dual Authentication** - Student i profesor login sistemi
- 👨‍🎓 **Student Management** - Enrollment, progress tracking, exam registration
- 👨‍🏫 **Professor Dashboard** - Subject management, grade entry, exam creation
- 📊 **Grade Management** - Automated grade calculation (5-10 scale)
- 📅 **Exam System** - Scheduling, registration, results processing
- 🗄️ **Prisma ORM** - Type-safe database access sa Accelerate connection pooling
- ☁️ **Serverless Ready** - Optimizovano za Vercel deployment

## 🛠️ Tech Stack

| Layer          | Technology        |
| -------------- | ----------------- |
| **Framework**  | Express 5.1.0     |
| **Language**   | TypeScript 5.6.3  |
| **ORM**        | Prisma 6.17.1     |
| **Database**   | PostgreSQL 16     |
| **Validation** | Zod               |
| **Hosting**    | Vercel Serverless |

## 📦 Installation

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Push database schema
npx prisma db push

# Seed database (optional)
npm run seed
```

## ⚙️ Configuration

Create `.env` file:

```env
# Database
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_ACCELERATE_KEY"

# Server
NODE_ENV=development
PORT=3001

# CORS (optional)
ALLOWED_ORIGINS=http://localhost:5173,https://your-frontend.netlify.app
```

## 🚀 Running Locally

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start

# Type checking
npx tsc --noEmit

# Run seed script
npm run seed
```

## 🌐 API Endpoints

### Authentication

| Method | Endpoint                       | Description             |
| ------ | ------------------------------ | ----------------------- |
| POST   | `/api/auth/login`              | Student/Professor login |
| POST   | `/api/auth/register/student`   | Register new student    |
| POST   | `/api/auth/register/professor` | Register new professor  |

**Login Request:**

```json
{
  "email": "student@example.com",
  "password": "password123"
}
```

**Login Response:**

```json
{
  "message": "Success",
  "userEmail": "student@example.com",
  "StudentName": "Marko Marković",
  "TipUsera": "STUDENT"
}
```

### Student Management

| Method | Endpoint                                          | Description              |
| ------ | ------------------------------------------------- | ------------------------ |
| GET    | `/api/students/:email`                            | Get student details      |
| GET    | `/api/students/:email/progress`                   | Academic progress report |
| GET    | `/api/students/:email/exams`                      | Enrolled exams           |
| POST   | `/api/students/:email/subjects/:subjectId/enroll` | Enroll in subject        |

### Professor Management

| Method | Endpoint                          | Description             |
| ------ | --------------------------------- | ----------------------- |
| GET    | `/api/professors/:email`          | Get professor details   |
| GET    | `/api/professors/:email/subjects` | Teaching subjects       |
| POST   | `/api/professors/setup`           | Setup professor account |
| POST   | `/api/professors/:email/subjects` | Assign subject          |

### Exam Management

| Method | Endpoint                  | Description               |
| ------ | ------------------------- | ------------------------- |
| GET    | `/api/exams`              | List all exams            |
| POST   | `/api/exams`              | Create new exam           |
| POST   | `/api/exams/:id/register` | Register student for exam |
| POST   | `/api/exams/:id/grade`    | Submit exam grade         |

**Create Exam Request:**

```json
{
  "subjectId": 1,
  "professorEmail": "profesor@ipi.com",
  "date": "2024-06-15",
  "description": "Parcijalni ispit"
}
```

### Grade Management

| Method | Endpoint                    | Description    |
| ------ | --------------------------- | -------------- |
| GET    | `/api/grades/:studentEmail` | Student grades |
| POST   | `/api/grades`               | Enter grade    |
| GET    | `/api/subjects/:id/grades`  | Subject grades |

### Utility Endpoints

| Method | Endpoint        | Description       |
| ------ | --------------- | ----------------- |
| GET    | `/api/health`   | Health check      |
| GET    | `/api/majors`   | List all majors   |
| GET    | `/api/subjects` | List all subjects |

## 📊 Database Schema

### Core Entities

```prisma
model Student {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String
  surname   String
  majorId   Int
  year      Int

  major           Major                      @relation(...)
  enrollments     StudentEnrollment[]
  examRegistrations StudentExamRegistration[]
  grades          Grade[]
}

model Professor {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String
  surname   String

  subjects  Subject[]
  exams     Exam[]
}

model Subject {
  id          Int     @id @default(autoincrement())
  name        String
  semester    Int
  ects        Int
  professorId Int?

  professor   Professor? @relation(...)
  enrollments StudentEnrollment[]
  exams       Exam[]
}

model Exam {
  id          Int      @id @default(autoincrement())
  subjectId   Int
  professorId Int
  date        DateTime
  description String?

  subject      Subject                     @relation(...)
  professor    Professor                   @relation(...)
  registrations StudentExamRegistration[]
}

model Grade {
  id        Int    @id @default(autoincrement())
  studentId Int
  subjectId Int
  grade     Int    // 5-10 scale

  student Student @relation(...)
  subject Subject @relation(...)
}
```

## 🏗️ Architecture

```
backend/
├── src/
│   ├── app.ts              # Express app factory
│   ├── server.ts           # Development entry point
│   │
│   ├── config/
│   │   ├── cors.ts         # CORS configuration
│   │   └── database.ts     # Prisma client singleton
│   │
│   ├── controllers/        # HTTP request handlers
│   │   ├── auth.controller.ts
│   │   ├── student.controller.ts
│   │   ├── professor.controller.ts
│   │   ├── exam.controller.ts
│   │   └── grade.controller.ts
│   │
│   ├── services/           # Business logic layer
│   │   ├── auth.service.ts
│   │   ├── student.service.ts
│   │   ├── professor.service.ts
│   │   └── exam.service.ts
│   │
│   ├── routes/             # Route definitions
│   │   └── index.ts
│   │
│   ├── types/              # TypeScript interfaces
│   │   ├── auth.types.ts
│   │   └── common.types.ts
│   │
│   └── utils/              # Helper functions
│       └── response.ts     # ResponseUtil class
│
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── main.ts             # Seed script
│   └── migrations/         # Migration history
│
├── api/
│   └── index.ts            # Vercel serverless entry
│
└── vercel.json             # Vercel config
```

### Design Patterns

**Clean Architecture:**

- Controllers → Services → Database
- Separation of concerns (HTTP layer vs business logic)
- Dependency injection ready

**Response Utilities:**

```typescript
// Centralized response formatting
ResponseUtil.success(res, data, "Student created");
ResponseUtil.error(res, error, 500);
ResponseUtil.notFound(res, "Student not found");
```

**Type Safety:**

```typescript
// DTOs for API contracts
interface LoginRequest {
  email: string;
  password: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
```

## ☁️ Deployment (Vercel)

### Configuration

**vercel.json:**

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
      "dest": "/api/index.ts"
    }
  ]
}
```

**api/index.ts (Serverless Entry):**

```typescript
import { createApp } from "../src/app";

// Export Express app (no listen() call for serverless)
export default createApp();
```

### Environment Setup

1. Set environment variables in Vercel:

   - `DATABASE_URL` (Prisma Accelerate connection string)

2. Build settings:

   - Build Command: `npm install && npx prisma generate`
   - Output Directory: (default)

3. Deploy:

```bash
vercel --prod
```

### Module System

**Important:** Codebase uses **CommonJS** for Vercel compatibility:

**tsconfig.json:**

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "moduleResolution": "node"
    // No .js extensions in imports
  }
}
```

**package.json:**

```json
{
  // NO "type": "module"
}
```

## 🧪 Testing

```bash
# Unit tests (if configured)
npm run test

# Type checking
npx tsc --noEmit

# Lint
npm run lint
```

## 🔍 Troubleshooting

### "Module not found" errors

- Run `npx prisma generate` after schema changes
- Ensure `@prisma/client` is installed

### Database connection issues

- Check `DATABASE_URL` is set correctly
- Prisma Accelerate requires specific connection string format
- Use `prisma://` protocol for Accelerate

### Vercel deployment fails

- Ensure `api/index.ts` exports app without `listen()`
- Check `vercel.json` points to correct entry point
- Run `npx prisma generate` in build command

### CORS errors

- Add frontend URL to `ALLOWED_ORIGINS` in `.env`
- Check `config/cors.ts` configuration

## 📚 Scripts

```json
{
  "dev": "nodemon src/server.ts", // Development server
  "build": "tsc", // Compile TypeScript
  "start": "node dist/server.js", // Production server
  "seed": "ts-node prisma/main.ts", // Seed database
  "prisma:generate": "prisma generate", // Generate Prisma Client
  "prisma:push": "prisma db push", // Push schema to DB
  "prisma:studio": "prisma studio" // Open Prisma Studio GUI
}
```

## 🤝 Contributing

1. Branch naming: `feature/student-enrollment`, `fix/login-bug`
2. Follow TypeScript strict mode
3. Use Prisma migrations for schema changes
4. Add JSDoc comments for public methods
5. Test endpoints with Postman/curl before PR

## 📄 License

See [main README](../README.md) for license information.

---

**Production API:** https://ipi-smart-academic-system-dzhc.vercel.app
