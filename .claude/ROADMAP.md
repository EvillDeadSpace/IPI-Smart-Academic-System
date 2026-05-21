# Assignment System — Roadmap

## Cilj
Dodati sistem zadaća (Assignment) gdje profesor kreira zadaću sa brojem bodova, student vidi zadaće po predmetima, profesor ocjenjuje predaje, a student prati bodove po predmetu na dashboardu. Zaključnu ocjenu profesor upisuje ručno u postojeći Grade model.

## Sistem bodovanja
- Ukupno: 100 bodova = 100% = zaključna ocjena
- Zadaće/parcijali: nose dio bodova (npr. 50) → kreira se kao `Assignment`
- Ispit: nosi ostatak bodova (npr. 50) → već postoji u `Grade` modelu
- 1 bod = 1% → ocjena se računa po postojećoj skali (54+=6, 63+=7, 72+=8, 81+=9, 90+=10)
- Zaključnu ocjenu profesor upisuje u postojeći `Grade` model (ne automatski)

---

## FAZA 1 — Baza (Prisma Schema + Migracija)
**Status: [x] Završeno**

- [x] Dodati `Assignment` model u `schema.prisma`
- [x] Dodati `AssignmentSubmission` model u `schema.prisma`
- [x] Dodati `SubmissionStatus` enum: `PENDING | GRADED`
- [x] Dodati relacije na `Subject`, `Professor`, `Student`
- [x] Pokrenuti `prisma db push` (uspješno sinhronizovano)

---

## FAZA 2 — Backend Service + Controller
**Status: [x] Završeno**

- [ ] Kreirati `assignment.service.ts`
  - [ ] `createAssignment(data)` — kreira zadaću
  - [ ] `getAssignmentsByProfessor(professorId)` — profesor vidi svoje zadaće + predaje
  - [ ] `getAssignmentsByStudent(email)` — student vidi zadaće za upisane predmete
  - [ ] `gradeSubmission(assignmentId, studentEmail, pointsEarned, feedback)` — profesor ocjenjuje
  - [ ] `getAssignmentProgressBySubject(email)` — bodovi po predmetu za progress bar
- [ ] Kreirati `assignment.controller.ts`
  - [ ] `POST /api/assignments` — kreiranje
  - [ ] `GET /api/assignments/professor/:id` — profesor
  - [ ] `GET /api/assignments/student/:email` — student
  - [ ] `POST /api/assignments/:id/grade` — ocjenjivanje: `{ studentEmail, pointsEarned, feedback }`
  - [ ] `GET /api/assignments/progress/:email` — bodovi po predmetu
- [ ] Kreirati `assignment.routes.ts`
- [ ] Registrovati rute u `routes/index.ts`

---

## FAZA 3 — Update getStudentProgress
**Status: [x] Završeno** (implementirano unutar Faze 2 kao poseban endpoint `GET /api/assignments/progress/:email`)

- [ ] Otvoriti `student.service.ts` → `getStudentProgress()`
- [ ] Dodati u response po predmetu:
  - `earnedPoints` — bodovi koje je student zaradio od zadaća
  - `maxPoints` — ukupno mogući bodovi od zadaća za taj predmet
- [ ] Struktura po predmetu:
  ```
  subjectEnrollments: [{
    id, name, code, ects,
    assignmentPoints: { earned: 37, max: 50 }
  }]
  ```

---

## FAZA 4 — Frontend: ProfessorBoard
**Status: [x] Završeno**

- [ ] Otvoriti `ProfessorBoard.tsx`
- [ ] Maknuti `weightPercent` iz `AssignmentFormData` tipa
- [ ] Dodati `maxPoints` i `type` polja u formu za kreiranje zadaće
- [ ] Ažurirati `handleCreateAssignment` → šalje na `POST /api/assignments`
- [ ] Dodati novu sekciju "Ocijeni predaje":
  - [ ] Lista svih zadaća profesora
  - [ ] Za svaku zadaću: studenti koji čekaju ocjenu (status PENDING)
  - [ ] Forma: `pointsEarned` input + `feedback` textarea + "Ocijeni" dugme
  - [ ] `POST /api/assignments/:id/grade` → refresh liste

---

## FAZA 5 — Frontend: Student Dashboard
**Status: [x] Završeno**

- [ ] Otvoriti `useDasboardFetch.tsx`
  - [ ] Dodati query: `GET /api/assignments/progress/:email`
- [ ] Otvoriti `Dashboard.tsx`
  - [ ] Dodati sekciju "Bodovi po predmetu" ispod Quick Stats
  - [ ] Za svaki predmet: progress bar `earned/max bodova`
  - [ ] Primjer: `Baze podataka ████████░░ 37/50 bodova`
- [ ] Ažurirati `ProgressShape` i `DashboardTypes` tipove

---

## FAZA 6 — Student Submission Flow (dodano)
**Status: [x] Završeno**

- [x] `s3Path` + `submittedAt` dodani na `AssignmentSubmission` model
- [x] `POST /api/assignments/:id/submit` endpoint
- [x] `useStudentAssignments.tsx` hook — fetch zadaća + submit na S3 + backend
- [x] `StudentAssignments.tsx` stranica — lista zadaća po predmetu, upload, status, ocjena + feedback
- [x] Ruta `/dashboard/assignments` dodana
- [x] Sidebar link "Zadaće" dodan (unificiran — stari "Zadaca" link uklonjen)
- [x] Profesor: "Preuzmi" dugme za svaki submission sa fajlom
- [x] Unified card: download profesorovog fajla + submit rješenja na istoj kartici

## FAZA 7 — Testiranje
**Status: [ ] Nije početo**

- [ ] Profesor kreira assignment — provjeri bazu (`Assignment` tablica)
- [ ] Student vidi assignment na svom panelu
- [ ] Profesor ocjenjuje studenta — provjeri `AssignmentSubmission` u bazi
- [ ] Student dashboard prikazuje bodove po predmetu
- [ ] Edge case: student nema nijednu ocijenjenu zadaću → progress bar prazan, ne puca

---

## Napomene

- `Assignment` je **novi model**, postojeći `Homework` (S3 download flow) se ne dira
- Zaključna ocjena se i dalje upisuje ručno u `Grade` model — ovo nije automatski
- `gradedById` u `AssignmentSubmission` = `professorId`
- Faze se rade **redom** — Faza 1 mora biti završena prije Faze 2
