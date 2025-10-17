# 👨‍🏫 Sistem Upravljanja Profesorima - Dokumentacija

## 🎯 Šta je urađeno?

Implementiran je **kompletan sistem za upravljanje profesorima** sa sledećim funkcionalnostima:

### 1. **Backend - Professor Endpoints**

Dodati endpoint-i za upravljanje profesorima:

- `GET /api/professors` - Dohvaća sve profesore sa njihovim predmetima
- `GET /api/professors/:id` - Dohvaća profesora po ID-u
- `GET /api/professors/email/:email` - Dohvaća profesora po email-u
- `POST /api/professors` - Kreira novog profesora
- `PUT /api/professors/:id/subjects` - Ažurira predmete profesora
- `DELETE /api/professors/:id` - Briše profesora

### 2. **Database Schema**

Ažurirana Prisma šema sa:

- **Professor model** - dodato `password` i `office` polje
- **ProfessorSubject model** - Many-to-Many veza između profesora i predmeta
- Relacija `Professor` ↔ `Subject` preko `ProfessorSubject` tabele

### 3. **Professor Login**

`POST /api/login` endpoint sada podržava i profesore:

- Vraća `TipUsera: "PROFESOR"` za profesore
- Uključuje `professorId` i listu `subjects` u odgovoru

### 4. **Admin Panel - Professor Management**

Nova komponenta `AdminProfessorManagement.tsx`:

- ✅ Prikaz svih profesora u grid-u
- ✅ Dodavanje novog profesora sa dodjelom predmeta
- ✅ Ažuriranje predmeta profesora
- ✅ Brisanje profesora
- ✅ Fancy UI sa animacijama (Framer Motion)
- ✅ Real-time pretraga predmeta sa checkbox selektorom

### 5. **ProfessorBoard - Filtriranje po Profesoru**

Ažuriran `ProfessorBoard.tsx`:

- **Automatski dohvaća profesorove predmete** pri loginu
- **Prikazuje samo studente upisane na profesorove predmete**
- **Statistika filtrirana po profesorovim predmetima**
- Admin shortcut (admin/admin) i dalje vidi SVE predmete

## 📋 Test Profesori

Kreirano 3 test profesora sa dodijeljenim predmetima:

| Email               | Password   | Ime                   | Predmeti                                 |
| ------------------- | ---------- | --------------------- | ---------------------------------------- |
| `mirko@faculty.com` | `mirko123` | Prof Mirko Mirkovic   | Web dizajn, Web programiranje            |
| `ana@faculty.com`   | `ana123`   | Dr Ana Anić           | Matematika (oba smjera)                  |
| `petar@faculty.com` | `petar123` | Docent Petar Petrović | Osnove programiranja, Operativni sistemi |

## 🚀 Kako testirati?

### 1. Pokretanje servera

```bash
cd backend
npx tsx server.ts
```

### 2. Testiranje Admin Panela

1. Otvori browser: `http://localhost:5173/admin/professors`
2. Vidjet ćeš sve profesore sa njihovim predmetima
3. Klikni "Dodaj Profesora":
   - Unesi ime, prezime, email, password
   - Odaberi titulu (Prof, Dr, Docent, Asistent)
   - Odaberi predmete koje će predavati
   - Klikni "Kreiraj"
4. Za ažuriranje predmeta, klikni ikonu edit (narandžasta) pored profesora
5. Za brisanje, klikni trash ikonu (crvena)

### 3. Testiranje Professor Login

```bash
# Test Mirko login
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"mirko@faculty.com","password":"mirko123"}'
```

Očekivani odgovor:

```json
{
  "message": "Success",
  "userEmail": "mirko@faculty.com",
  "StudentName": "Prof Mirko Mirkovic",
  "TipUsera": "PROFESOR",
  "professorId": 1,
  "subjects": [
    { "id": 10, "name": "Web dizajn", "code": "COMP-IP2" },
    { "id": 25, "name": "Web programiranje", "code": "COMP-R7" }
  ]
}
```

### 4. Testiranje ProfessorBoard

1. **Login kao Mirko:**

   - Email: `mirko@faculty.com`
   - Password: `mirko123`

2. **Navigate to /profesor:**

   - Vidjet ćeš samo predmete koje Mirko predaje (Web dizajn, Web programiranje)
   - Studenti prikazani su samo oni koji su upisali te predmete
   - Možeš dodavati/ažurirati ocjene za te studente

3. **Login kao Ana:**
   - Email: `ana@faculty.com`
   - Password: `ana123`
   - Vidjet ćeš samo Matematiku

## 🏗️ Arhitektura

```
┌─────────────────────────────────────────────┐
│           Frontend (React)                  │
├─────────────────────────────────────────────┤
│  AdminProfessorManagement                   │
│  - Kreiranje profesora                      │
│  - Dodjela predmeta                          │
│  - Ažuriranje/brisanje                       │
├─────────────────────────────────────────────┤
│  ProfessorBoard                              │
│  - Filtriranje po profesoru                 │
│  - Prikaz studenata                          │
│  - Ocjenjivanje                              │
└─────────────────────────────────────────────┘
              ↕ HTTP API (REST)
┌─────────────────────────────────────────────┐
│         Backend (Express + Prisma)          │
├─────────────────────────────────────────────┤
│  /api/professors/*                           │
│  - CRUD operacije                            │
│  - Dodjela predmeta                          │
├─────────────────────────────────────────────┤
│  /api/login                                  │
│  - Student + Professor auth                 │
└─────────────────────────────────────────────┘
              ↕ Prisma ORM
┌─────────────────────────────────────────────┐
│         PostgreSQL Database                  │
├─────────────────────────────────────────────┤
│  Professor ↔ ProfessorSubject ↔ Subject    │
│  Professor → Grade                           │
└─────────────────────────────────────────────┘
```

## 📂 Novi/Izmijenjeni Fajlovi

### Backend

- `backend/prisma/schema.prisma` - Ažurirana šema (Professor, ProfessorSubject)
- `backend/server.ts` - Dodati professor endpoints
- `backend/scripts/seed-professors.ts` - Seed skripta za test profesore
- `backend/scripts/update-professors.ts` - Update skripta za predmete

### Frontend

- `frontend/src/components/Dashboard/AdminProfessorManagement.tsx` - **NOVO** - Admin panel za profesore
- `frontend/src/components/Dashboard/ProfessorBoard.tsx` - Ažurirano - Filtriranje po profesoru
- `frontend/src/App.tsx` - Dodana ruta `/admin/professors`
- `frontend/src/constants/storage.ts` - Exportovan `BACKEND_URL`

## 🔐 Security Notes (Production)

⚠️ **Za produkciju, treba dodati:**

1. **Password Hashing:**

   ```typescript
   import bcrypt from "bcrypt";

   // Pri kreiranju profesora
   const hashedPassword = await bcrypt.hash(password, 10);

   // Pri login-u
   const isValid = await bcrypt.compare(password, professor.password);
   ```

2. **JWT Tokens:**

   - Umjesto slanja cijelog objekta, koristi JWT token
   - Token sadrži `professorId` i `email`

3. **Role-Based Access Control:**

   - Middleware za zaštitu professor endpoint-a
   - Samo admini mogu kreirati/brisati profesore

4. **Input Validation:**
   - Email validation
   - Password strength requirements
   - Subject ID validation

## 🎨 UI Features

### AdminProfessorManagement

- 📊 Grid layout sa karticama profesora
- ✨ Framer Motion animacije (fade-in, hover effects)
- 🎨 Color-coded badges za predmete
- 🔍 Modal za kreiranje/ažuriranje
- ✅ Checkbox selector za predmete
- 🗑️ Confirm dialog prije brisanja

### ProfessorBoard

- 📈 Live statistika (filtrirana po profesoru)
- 📋 Tabela sa studentima po predmetima
- 🎯 Status badges (ocijenjeno/nije ocijenjeno)
- ⚡ Real-time refresh nakon unosa ocjene
- 🎨 Smooth hover effects i transitions

## 🐛 Troubleshooting

### Problem: Backend ne vraća profesore

**Rješenje:**

```bash
# Provjeri da li su profesori u bazi
npx tsx backend/scripts/seed-professors.ts

# Provjeri endpoint
curl http://localhost:3001/api/professors
```

### Problem: ProfessorBoard prikazuje sve predmete

**Rješenje:**

- Provjeri da li je profesor pravilno ulogovan
- Provjeri browser console za greške
- Provjeri da li profesor ima dodijeljene predmete:
  ```bash
  curl http://localhost:3001/api/professors/email/mirko@faculty.com
  ```

### Problem: Ne mogu dodati profesora

**Rješenje:**

- Provjeri da li email već postoji u bazi
- Provjeri da li su svi obavezni podaci uneseni
- Provjeri backend console za SQL greške

## 📝 TODO (Opciono)

- [ ] Export profesora u CSV/Excel
- [ ] Bulk import profesora
- [ ] Email notifikacije za profesore
- [ ] Schedule predavanja (časovi)
- [ ] Profesor analytics dashboard
- [ ] Multi-semester support
- [ ] Professor availability calendar

## 🎉 Zaključak

Sistem je potpuno funkcionalan! Profesori mogu:

1. ✅ Biti dodani preko Admin panela
2. ✅ Imati dodijeljene predmete
3. ✅ Logovat se sa svojim kredencijalima
4. ✅ Vidjeti samo svoje studente i predmete
5. ✅ Dodavati i ažurirati ocjene

Sve je spremno za dalji razvoj ili produkciju (uz sigurnosne izmjene)! 🚀
