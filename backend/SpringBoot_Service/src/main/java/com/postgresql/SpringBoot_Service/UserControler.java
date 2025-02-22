package com.postgresql.SpringBoot_Service;

import com.postgresql.SpringBoot_Service.LoginService.LoginRequest;
import com.postgresql.SpringBoot_Service.model.FacultyExam;
import com.postgresql.SpringBoot_Service.model.FacultyProfessor;
import com.postgresql.SpringBoot_Service.model.FacultyStudent;
import com.postgresql.SpringBoot_Service.model.Faculty_users;
import com.postgresql.SpringBoot_Service.repo.ExamRepo;
import com.postgresql.SpringBoot_Service.repo.FacultyProfessorRepo;
import com.postgresql.SpringBoot_Service.repo.FacultyStudentRepo;
import com.postgresql.SpringBoot_Service.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class UserControler {


    @Autowired
    FacultyProfessorRepo professorRepo;

    @Autowired
    UserRepo userRepo;

    @Autowired
    FacultyStudentRepo facultyStudentRepo;

    @PostMapping("/add_user")
    public void addUser(@RequestBody Faculty_users faculty_users) {
        if (faculty_users != null) {
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
            

            userRepo.save(faculty_users);
            System.out.println(faculty_users + " je dodan u bazu podataka");

            //if user is student, add to faculty_student table
            if ("STUDENT".equalsIgnoreCase(faculty_users.getTipUsera())) {
                FacultyStudent facultyStudent = new FacultyStudent();
                // Postavi atribute za FacultyStudent
                facultyStudent.setGodinaStudija("Student treba upisati godinu"); // primjer
                facultyStudent.setSmjerStudija("Student treba upisati smjer"); // primjer
                facultyStudent.setIndeks(String.valueOf(facultyStudent.getId()));
                facultyStudent.setFacultyUser(faculty_users);

                facultyStudentRepo.save(facultyStudent);
                System.out.println(facultyStudent + " je dodan u tabelu faculty_student");
            }
        } else {
            throw new IllegalArgumentException("Faculty_users objekat je null!");
        }

    }

    //End point for adding student
    @PostMapping("/add_student")
    public void addStudent(@RequestParam int facultyUserId, @RequestBody FacultyStudent facultyStudent) {
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
    public ResponseEntity<?> addProfessor(@RequestParam int facultyUserId, @RequestBody FacultyProfessor professor) {
        try {
            Faculty_users facultyUser = userRepo.findById(facultyUserId)
                    .orElseThrow(() -> new IllegalArgumentException("Faculty_user sa datim ID ne postoji!"));

            if (!"PROFESOR".equals(facultyUser.getTipUsera())) {
                return ResponseEntity.badRequest().body("User must be of type PROFESOR");
            }

            professor.setKorisnik(facultyUser);
            FacultyProfessor savedProfessor = professorRepo.save(professor);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Professor successfully created");
            response.put("professorId", savedProfessor.getId());
            response.put("facultyUserId", facultyUser.getId());
            response.put("professorDetails", savedProfessor);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating professor: " + e.getMessage());
        }
    }

    @GetMapping("/professors/email/{email}")
    public ResponseEntity<?> getProfessorByEmail(@PathVariable String email) {
        try {
            // Option 1: Using findByEmail
            Faculty_users user = userRepo.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
            
            // Verify the user is a professor
            if (!"PROFESOR".equals(user.getTipUsera())) {
                throw new RuntimeException("User is not a professor");
            }

            // Then find the professor record
            FacultyProfessor professor = professorRepo.findByKorisnik(user)
                    .orElseThrow(() -> new RuntimeException("Professor record not found"));

            Map<String, Object> response = new HashMap<>();
            response.put("id", professor.getId());
            response.put("name", user.getIme() + " " + user.getPrezime());
            response.put("email", user.getEmail());
            response.put("titula", professor.getTitula());
            response.put("kabinet", professor.getKabinet());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/professors/{id}")
    public ResponseEntity<?> updateProfessor(@PathVariable int id, @RequestBody Map<String, String> updates) {
        try {
            FacultyProfessor professor = professorRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Professor not found with id: " + id));

            // Update professor details
            if (updates.containsKey("titula")) {
                professor.setTitula(updates.get("titula"));
            }
            if (updates.containsKey("kabinet")) {
                professor.setKabinet(updates.get("kabinet"));
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
}

