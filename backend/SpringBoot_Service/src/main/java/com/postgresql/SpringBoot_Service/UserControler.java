package com.postgresql.SpringBoot_Service;

import com.postgresql.SpringBoot_Service.LoginService.LoginRequest;
import com.postgresql.SpringBoot_Service.model.*;
import com.postgresql.SpringBoot_Service.repo.ExamRepo;
import com.postgresql.SpringBoot_Service.repo.FacultyProfessorRepo;
import com.postgresql.SpringBoot_Service.repo.FacultyStudentRepo;
import com.postgresql.SpringBoot_Service.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import com.postgresql.SpringBoot_Service.repo.EnrollmentRepo;
import com.postgresql.SpringBoot_Service.repo.GradeRepo;
import com.postgresql.SpringBoot_Service.repo.SubjectRepo;
import com.postgresql.SpringBoot_Service.model.Subject;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class UserControler {


    @Autowired
    FacultyProfessorRepo professorRepo;

    @Autowired
    UserRepo userRepo;

    @Autowired
    FacultyStudentRepo facultyStudentRepo;

    @Autowired
    EnrollmentRepo enrollmentRepo;

    @Autowired
    private GradeRepo gradeRepo;

    @Autowired
    private SubjectRepo subjectRepo;

    @PostMapping("/add_user")
    @Transactional
    public ResponseEntity<?> addUser(@RequestBody Faculty_users faculty_users) {
        try {
            if (faculty_users == null) {
                throw new IllegalArgumentException("Faculty_users objekat je null!");
            }

            // Validate user data
            if (userRepo.existsByEmail(faculty_users.getEmail())) {
                throw new IllegalArgumentException("Email je već u upotrebi!");
            }
            if (faculty_users.getIme() == null || faculty_users.getIme().isEmpty()) {
                throw new IllegalArgumentException("Ime je obavezno!");
            }
            if (faculty_users.getPrezime() == null || faculty_users.getPrezime().isEmpty()) {
                throw new IllegalArgumentException("Prezime je obavezno!");
            }
            if (faculty_users.getPassword() == null || faculty_users.getPassword().isEmpty()) {
                throw new IllegalArgumentException("Password je obavezan!");
            }
            if (faculty_users.getEmail() == null || faculty_users.getEmail().isEmpty()) {
                throw new IllegalArgumentException("Email je obavezan!");
            }
            
            // Save the user
            userRepo.save(faculty_users);

            // If it's a student, create basic student record and clear any existing enrollment
            if ("STUDENT".equalsIgnoreCase(faculty_users.getTipUsera())) {
                FacultyStudent facultyStudent = new FacultyStudent();
                facultyStudent.setFacultyUser(faculty_users);
                facultyStudent.setIndeks(String.valueOf(facultyStudent.getId()));
                facultyStudent = facultyStudentRepo.save(facultyStudent);

                // Clear any existing enrollment for this student
                Optional<StudentEnrollment> existingEnrollment = enrollmentRepo.findByStudent(facultyStudent);
                existingEnrollment.ifPresent(enrollment -> enrollmentRepo.delete(enrollment));
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Korisnik uspješno dodan");
            response.put("userId", faculty_users.getId());
            response.put("email", faculty_users.getEmail());
            response.put("tipUsera", faculty_users.getTipUsera());
            response.put("status", "enrollment_cleared");

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Došlo je do greške: " + e.getMessage()));
        }
    }

    //End point for adding student
    @PostMapping("/add_student")
    public void addStudent(@RequestParam Long facultyUserId, @RequestBody FacultyStudent facultyStudent) {
        Faculty_users facultyUser = userRepo.findById(facultyUserId)
                .orElseThrow(() -> new IllegalArgumentException("Faculty_user sa datim ID ne postoji!"));

        FacultyStudent existingFacultyStudent = facultyStudentRepo.findByFacultyUser(facultyUser);
        if (existingFacultyStudent != null) {
            // Update existing record
            existingFacultyStudent.setGodinaStudija(facultyStudent.getGodinaStudija());
            existingFacultyStudent.setSmjerStudija(facultyStudent.getSmjerStudija());
            existingFacultyStudent.setIndeks(String.valueOf(facultyUserId)); // Set indeks to faculty_user_id
            facultyStudentRepo.save(existingFacultyStudent);
            System.out.println(existingFacultyStudent + " je ažuriran u tabeli faculty_student");
        } else {
            // Insert new record
            facultyStudent.setFacultyUser(facultyUser);
            facultyStudent.setIndeks(String.valueOf(facultyUserId)); // Set indeks to faculty_user_id
            facultyStudentRepo.save(facultyStudent);
            System.out.println(facultyStudent + " je dodan u tabelu faculty_student");
        }
    }


    //endpoint to login
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginRequest(@RequestBody LoginRequest loginRequest) {
        Faculty_users user = userRepo.findByEmailAndPassword(loginRequest.getEmail(), loginRequest.getPassword());
        Map<String, String> response = new HashMap<>();
        if (user != null) {
            
            if (user.getTipUsera().equals("PROFESOR")){
                response.put("STATUS","PROFESOR" );
            }
            response.put("message", "Success");
            response.put("userEmail", user.getEmail());
            response.put("StudentName", user.getIme());
            response.put("TipUsera", user.getTipUsera());

            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Login failed");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @GetMapping("/professors")
    public ResponseEntity<List<Map<String, Object>>> getAllProfessors() {
        List<FacultyProfessor> professors = professorRepo.findAll();
        List<Map<String, Object>> professorDetails = professors.stream()
            .map(professor -> {
                Map<String, Object> details = new HashMap<>();
                details.put("id", professor.getId());
                details.put("name", professor.getKorisnik().getIme() + " " + professor.getKorisnik().getPrezime());
                details.put("email", professor.getKorisnik().getEmail());
                details.put("titula", professor.getTitula());
                details.put("kabinet", professor.getKabinet());
                return details;
            })
            .collect(java.util.stream.Collectors.toList());
        
        return ResponseEntity.ok(professorDetails);
    }

    @PostMapping("/add_professor")
    public ResponseEntity<?> addProfessor(@RequestParam Long facultyUserId, @RequestBody FacultyProfessor professor) {
        try {
            Faculty_users facultyUser = userRepo.findById(facultyUserId)
                    .orElseThrow(() -> new IllegalArgumentException("Faculty_user sa datim ID ne postoji!"));

            if (!"PROFESOR".equals(facultyUser.getTipUsera())) {
                return ResponseEntity.badRequest().body("User must be of type PROFESOR");
            }

            // Make sure to set the ID properly
            professor.setId(facultyUserId);
            professor.setKorisnik(facultyUser);
            professor.setSetupCompleted(false);
            
            FacultyProfessor savedProfessor = professorRepo.save(professor);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Professor successfully created");
            response.put("professorId", savedProfessor.getId());
            response.put("facultyUserId", facultyUser.getId());
            response.put("professorDetails", savedProfessor);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /*
    @GetMapping("/professors/email/{email}")
    public ResponseEntity<?> getProfessorByEmail(@PathVariable String email) {
        // ... remove this entire method ...
    }
    */

    @PutMapping("/professors/{id}")
    public ResponseEntity<?> updateProfessor(@PathVariable long id, @RequestBody Map<String, Object> updates) {
        try {
            FacultyProfessor professor = professorRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Professor not found with id: " + id));

            if (updates.containsKey("titula")) {
                professor.setTitula((String) updates.get("titula"));
            }
            if (updates.containsKey("kabinet")) {
                professor.setKabinet((String) updates.get("kabinet"));
            }
            if (updates.containsKey("subjects")) {
                List<String> subjects = (List<String>) updates.get("subjects");
                professor.setSubjects(subjects);
            }

            professorRepo.save(professor);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Professor updated successfully");
            response.put("professor", professor);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/students/{studentId}/points")
    public ResponseEntity<?> givePointsToStudent(
        @PathVariable Long studentId,  // Changed from int to Long
        @RequestBody Map<String, Object> request
    ) {
        try {
            Integer points = (Integer) request.get("points");
            Long subjectId = Long.valueOf(((Integer) request.get("subjectId")));  // Convert to Long
            Long professorId = Long.valueOf(((Integer) request.get("professorId")));  // Convert to Long

            // Validate points
            if (points < 0 || points > 100) {
                return ResponseEntity.badRequest().body("Points must be between 0 and 100");
            }

            // Find the student
            FacultyStudent student = facultyStudentRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

            // Find the professor
            FacultyProfessor professor = professorRepo.findById(professorId)
                .orElseThrow(() -> new RuntimeException("Professor not found"));

            // Find the subject
            Subject subject = subjectRepo.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

            // Create and save the grade
            Grade grade = new Grade();
            grade.setStudent(student);
            grade.setProfessor(professor);
            grade.setSubject(subject);
            grade.setPoints(points);
            gradeRepo.save(grade);

            return ResponseEntity.ok(Map.of("message", "Points updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

