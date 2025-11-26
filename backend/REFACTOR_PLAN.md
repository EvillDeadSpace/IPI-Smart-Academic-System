# 🏗️ Backend Refactoring Plan

## 📂 Nova struktura:

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts        # Prisma setup
│   │   └── cors.ts            # CORS config
│   │
│   ├── routes/
│   │   ├── index.ts           # Main router
│   │   ├── auth.routes.ts     # /api/auth/* (login, register)
│   │   ├── student.routes.ts  # /api/students/*
│   │   ├── professor.routes.ts# /api/professors/*
│   │   ├── exam.routes.ts     # /api/exams/*
│   │   ├── enrollment.routes.ts# /api/enrollment/*
│   │   └── grade.routes.ts    # /api/grades/*
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── student.controller.ts
│   │   ├── professor.controller.ts
│   │   ├── exam.controller.ts
│   │   ├── enrollment.controller.ts
│   │   └── grade.controller.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── student.service.ts
│   │   ├── professor.service.ts
│   │   ├── exam.service.ts
│   │   ├── enrollment.service.ts
│   │   └── grade.service.ts
│   │
│   ├── middleware/
│   │   ├── errorHandler.ts
│   │   ├── validation.ts
│   │   └── auth.middleware.ts
│   │
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── student.types.ts
│   │   └── common.types.ts
│   │
│   ├── utils/
│   │   ├── response.ts
│   │   └── validation.ts
│   │
│   ├── app.ts               # Express app setup
│   └── server.ts            # Server entry point
│
├── prisma/
│   └── schema.prisma
│
├── package.json
└── tsconfig.json
```

## 🎯 Benefits:

✅ **Separation of Concerns** - svaka funkcija ima svoje mjesto
✅ **Easy to test** - svaki service/controller je nezavisan
✅ **Scalable** - lako dodaj nove feature-e
✅ **Clean Code** - čitljivo i održivo
✅ **Type Safety** - TypeScript na full
