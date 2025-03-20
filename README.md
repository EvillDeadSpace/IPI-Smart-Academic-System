# IPI Akademija AI Assistant & Academic Management System 🎓

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen?logo=spring)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3.10-yellow?logo=python)](https://www.python.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue?logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-blue?logo=docker)](https://www.docker.com/)

## 📋 Overview

A comprehensive academic management system with an integrated AI assistant for IPI Akademija. The system combines student/professor management with intelligent chatbot capabilities, providing a complete solution for academic administration and support.

## 🚀 Features

### Academic Management
- 👨‍🎓 Student enrollment and management
- 👨‍🏫 Professor administration
- 📚 Course and subject management
- 📝 Exam registration and grading
- 📊 Academic progress tracking
- 🎯 Major/study program management

### AI Assistant
- 💬 Real-time chat interface
- 🔍 Natural Language Processing
- 🤖 Intelligent academic query handling
- 🌐 Bosnian language support

## 🛠 Tech Stack

### Spring Boot Backend
- Spring Boot 3.x
- Spring Data JPA
- PostgreSQL Database
- RESTful API architecture
- Cross-Origin Resource Sharing (CORS) configuration

### Frontend
- React 18.3.1 with TypeScript
- Vite
- Tailwind CSS
- React Router
- React Spring

### NLP Service
- Python 3.10
- Flask
- Mistral AI
- OpenAI embeddings
- spaCy (Croatian language model)

### Database
- PostgreSQL
- JPA/Hibernate ORM

## 🏗 Project Structure

```text
├── backend/
│   └── SpringBoot_Service/    # Academic management backend
├── frontend/                  # React TypeScript application
└── NLP/                      # Python NLP service
```

## 🚦 Getting Started

### Prerequisites
- JDK 17+
- Node.js 18+
- Python 3.10+
- PostgreSQL
- Docker and Docker Compose

### Database Setup
```sql
CREATE DATABASE faculty_database;
```

### Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
```

2. Configure PostgreSQL in `application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/faculty_database
spring.datasource.username=your_username
spring.datasource.password=your_password
```

3. Start services with Docker Compose:
```bash
docker-compose up --build
```

Services will be available at:
- Spring Boot Backend: http://localhost:8080
- Frontend: http://localhost:5173
- NLP Service: http://localhost:5000

## 💻 Development Setup

### Spring Boot Backend
```bash
cd backend/SpringBoot_Service
./mvnw spring-boot:run
```

### Frontend & NLP Service
[Previous setup instructions remain the same]

## 📝 API Endpoints

### Student Management
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
