# 🎓 IPI Smart Academic System

> Modern academic management system with integrated AI chatbot for student services

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.17-2D3748)](https://www.prisma.io/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Overview

IPI Smart Academic System is a comprehensive 3-tier academic management platform designed for universities and educational institutions. It combines traditional student information system features with modern AI-powered assistance through an integrated chatbot.

**Live Demo:**

- Frontend: [Netlify/Vercel URL]
- Backend API: https://ipi-smart-academic-system-dzhc.vercel.app
- NLP Service: https://amartubic.pythonanywhere.com

## ✨ Features

### 👨‍🎓 Student Portal

- 📊 **Academic Progress Tracking** - Real-time ECTS, grades, and course completion
- � **Course Enrollment** - Smart enrollment with validation (required courses, ECTS limits, progression rules)
- 📅 **Exam Registration** - Browse upcoming exams and register online
- 💬 **AI Assistant** - 24/7 chatbot for academic queries powered by Mistral AI

### 👨‍🏫 Professor Dashboard

- � **Exam Scheduling** - Create and manage exam sessions
- ✅ **Grading System** - Record grades with automatic calculation (ECTS-based)
- 📈 **Student Overview** - Track student performance per subject

### 🔧 Admin Panel

- � **User Management** - Register students and professors
- � **Major & Subject Setup** - Configure study programs and curricula
- 📊 **System Analytics** - Monitor platform usage

### 🤖 AI Chatbot (NLP Service)

- Natural language understanding for academic queries
- Knowledge base with faculty information, enrollment rules, and procedures
- Powered by Mistral AI via GitHub Models API
- Typing animation and conversational UI

## 🏗️ Architecture

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   Frontend      │──────│   Backend API   │──────│   PostgreSQL    │
│   React + Vite  │ HTTP │ Express + Prisma│      │ (Accelerate)    │
└─────────────────┘      └─────────────────┘      └─────────────────┘
         │
         │ HTTP
         ▼
┌─────────────────┐
│  NLP Service    │
│  Flask + Mistral│
└─────────────────┘
```

**3-Tier Architecture:**

- **Presentation Layer**: React 18 SPA with TypeScript
- **Application Layer**: Node.js/Express REST API with clean architecture (controllers → services → database)
- **Data Layer**: PostgreSQL with Prisma ORM (Prisma Accelerate for serverless)
- **AI Layer**: Python Flask microservice with Mistral LLM integration

## 🛠️ Tech Stack

| Layer        | Technology                           | Purpose                             |
| ------------ | ------------------------------------ | ----------------------------------- |
| **Frontend** | React 18, TypeScript, Vite           | Modern SPA with fast dev experience |
|              | React Router, TailwindCSS            | Routing and styling                 |
|              | Framer Motion, Lottie                | Animations                          |
| **Backend**  | Node.js 20, Express 5, TypeScript    | RESTful API server                  |
|              | Prisma 6.17                          | Type-safe ORM                       |
|              | PostgreSQL                           | Relational database                 |
| **NLP**      | Python 3.x, Flask                    | AI microservice                     |
|              | Mistral AI                           | LLM for chatbot                     |
| **DevOps**   | Vercel (backend), Netlify (frontend) | Serverless deployment               |
|              | GitHub Actions                       | CI/CD                               |
|              | Docker                               | Local containerization              |

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ and npm
- Python 3.10+
- PostgreSQL (or use Prisma Accelerate)
- Git

### Quick Start (Local Development)

1. **Clone the repository**

```bash
git clone https://github.com/EvillDeadSpace/IPI-Smart-Academic-System.git
cd IPI-Smart-Academic-System
```

2. **Setup Backend**

```bash
cd backend
npm install
cp .env.example .env  # Configure DATABASE_URL
npx prisma generate
npx prisma db push
npm run seed  # Load sample data
npm run dev  # Starts on http://localhost:3001
```

3. **Setup Frontend**

```bash
cd frontend
npm install
npm run dev  # Starts on http://localhost:5173
```

4. **Setup NLP Service (Optional)**

```bash
cd NLP
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
# Configure .env with GITHUB_TOKEN
python main.py  # Starts on http://localhost:5000
```

5. **Access the application**

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api/health
- NLP API: http://localhost:5000/status

### Environment Variables

Create `.env` files in each directory:

**Backend (`backend/.env`):**

```env
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_KEY"
NODE_ENV=development
PORT=3001
```

**Frontend (`frontend/.env`):**

```env
VITE_BACKEND_URL=http://localhost:3001
VITE_NLP_URL=http://localhost:5000
```

**NLP (`NLP/.env`):**

```env
GITHUB_TOKEN=your_github_token_here
OPEN_API_KEY_MISTRAL=your_mistral_key
```

## 📁 Project Structure

```
IPI-Smart-Academic-System/
├── frontend/              # React + Vite SPA
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── contexts/     # React contexts
│   │   ├── constants/    # Config (BACKEND_URL)
│   │   └── types/        # TypeScript types
│   └── README.md
│
├── backend/              # Express API + Prisma
│   ├── src/
│   │   ├── controllers/  # HTTP handlers
│   │   ├── services/     # Business logic
│   │   ├── routes/       # API routes
│   │   ├── types/        # DTO types
│   │   ├── utils/        # Helpers (ResponseUtil)
│   │   └── config/       # CORS, database
│   ├── prisma/
│   │   ├── schema.prisma # Database schema
│   │   └── main.ts       # Seed script
│   ├── api/
│   │   └── index.ts      # Vercel serverless entry
│   └── README.md
│
├── NLP/                  # Flask NLP service
│   ├── app/
│   │   ├── routes.py     # API endpoints
│   │   ├── services.py   # Mistral AI integration
│   │   └── nlp_utils.py  # NLP helpers
│   ├── fakultetski_sadržaj.txt  # Knowledge base
│   └── README.md
│
└── docker-compose.yml    # Local development setup
```

## 🌐 Deployment

### Backend (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables:
   - `DATABASE_URL` (Prisma Accelerate connection)
4. Deploy automatically on push to `main`

**Build settings:**

- Build Command: `npm install && npx prisma generate`
- Output Directory: (default)
- Entry: `api/index.ts`

### Frontend (Netlify/Vercel)

1. Build command: `npm run build`
2. Publish directory: `dist`
3. Set `VITE_BACKEND_URL` to production backend URL

### NLP Service (PythonAnywhere)

1. Upload code to PythonAnywhere
2. Configure WSGI file to point to Flask app
3. Set environment variables in `.env`

## � Documentation

- [Backend API Documentation](./backend/README.md) - REST API endpoints, database schema
- [Frontend Guide](./frontend/README.md) - Component structure, routing
- [NLP Service](./NLP/README.md) - Chatbot setup, knowledge base management

## 🧪 Testing

```bash
# Backend
cd backend
npm run test          # Unit tests
npm run test:e2e      # Integration tests
npx tsc --noEmit      # Type check

# Frontend
cd frontend
npm run test
npm run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

**Code Standards:**

- TypeScript strict mode
- ESLint + Prettier
- Conventional commits
- Unit tests for business logic

## � Authors

- **Amar Tubić** - [EvillDeadSpace](https://github.com/EvillDeadSpace)

## 🙏 Acknowledgments

- Mistral AI for LLM capabilities
- Prisma team for excellent ORM
- Vercel for serverless hosting
- Academic institution faculty for domain knowledge

---

**Built with ❤️ for modern academic institutions**

- `POST /add_student` - Register new student
- `GET /student/{email}` - Get student details
- `GET /api/subjects/student/{email}` - Get student's subjects

### Professor Management

- `GET /professors` - List all professors
- `POST /add_professor` - Add new professor
- `GET /professors/email/{email}` - Get professor details

### Exam Management

- `POST /api/exams` - Create new exam
- `GET /api/exams` - List all exams
- `POST /api/exams/{examId}/register` - Register for exam

## 🔑 Environment Variables

Required environment variables:

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `OPEN_API_KEY_MISTRAL`
- `OPEN_API_KEY_OPENAI`

## 📊 Database Schema

Key entities:

- `faculty_users` - User management
- `faculty_professors` - Professor details
- `faculty_student` - Student information
- `exams` - Exam management
- `student_exam_registration` - Exam registrations

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Contact

For any inquiries, please reach out to:

- Email: amartubic1@gmail.com
