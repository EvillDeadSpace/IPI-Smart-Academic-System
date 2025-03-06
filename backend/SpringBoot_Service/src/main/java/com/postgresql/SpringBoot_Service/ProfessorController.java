package com.postgresql.SpringBoot_Service;

import com.postgresql.SpringBoot_Service.model.FacultyProfessor;
import com.postgresql.SpringBoot_Service.model.Faculty_users;
import com.postgresql.SpringBoot_Service.repo.FacultyProfessorRepo;
import com.postgresql.SpringBoot_Service.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class ProfessorController {

    @Autowired
    private FacultyProfessorRepo professorRepo;

    @Autowired
    private UserRepo userRepo;

    @GetMapping("/professors/email/{email}")
    public ResponseEntity<?> getProfessorByEmail(@PathVariable String email) {
        try {
            // First, find the user
            Optional<Faculty_users> userOptional = userRepo.findByEmail(email);
            if (!userOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User not found"));
            }

            Faculty_users user = userOptional.get();

            // Check if user is professor
            if (!"PROFESOR".equals(user.getTipUsera())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "User is not a professor"));
            }

            // Find professor record
            Optional<FacultyProfessor> professorOptional = professorRepo.findByKorisnik(user);
            if (!professorOptional.isPresent()) {
                // Create professor record if it doesn't exist
                FacultyProfessor newProfessor = new FacultyProfessor();
                newProfessor.setKorisnik(user);
                newProfessor.setTitula("Professor");
                newProfessor.setKabinet("TBD");
                FacultyProfessor savedProfessor = professorRepo.save(newProfessor);
                
                Map<String, Object> response = new HashMap<>();
                response.put("id", savedProfessor.getId());
                response.put("name", user.getIme() + " " + user.getPrezime());
                response.put("email", user.getEmail());
                response.put("titula", savedProfessor.getTitula());
                response.put("kabinet", savedProfessor.getKabinet());
                response.put("setupCompleted", savedProfessor.isSetupCompleted());
                response.put("subjects", savedProfessor.getSubjects());
                
                return ResponseEntity.ok(response);
            }

            FacultyProfessor professor = professorOptional.get();

            Map<String, Object> response = new HashMap<>();
            response.put("id", professor.getId());
            response.put("name", user.getIme() + " " + user.getPrezime());
            response.put("email", user.getEmail());
            response.put("titula", professor.getTitula());
            response.put("kabinet", professor.getKabinet());
            response.put("setupCompleted", professor.isSetupCompleted());
            response.put("subjects", professor.getSubjects());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/professors/setup/{professorId}")
    public ResponseEntity<?> setupProfessorSubjects(
        @PathVariable Long professorId,
        @RequestBody Map<String, List<String>> request
    ) {
        try {
            // Log the incoming request
            System.out.println("Received setup request for professor ID: " + professorId);
            System.out.println("Request body: " + request);

            // Validate the request
            List<String> subjects = request.get("subjects");
            if (subjects == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Subjects list is required"));
            }

            // First check if user exists
            Faculty_users user = userRepo.findById(professorId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + professorId));

            // Check if user is professor
            if (!"PROFESOR".equals(user.getTipUsera())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "User is not a professor"));
            }

            // Find or create professor record
            FacultyProfessor professor = professorRepo.findById(professorId)
                .orElseGet(() -> {
                    FacultyProfessor newProfessor = new FacultyProfessor();
                    newProfessor.setId(professorId);
                    newProfessor.setKorisnik(user);
                    newProfessor.setTitula("Professor");
                    newProfessor.setKabinet("TBD");
                    return professorRepo.save(newProfessor);
                });
            
            // Update professor data
            professor.setSubjects(subjects);
            professor.setSetupCompleted(true);
            
            // Save and get updated professor
            professor = professorRepo.save(professor);
            
            // Prepare response
            Map<String, Object> response = new HashMap<>();
            response.put("id", professor.getId());
            response.put("subjects", professor.getSubjects());
            response.put("setupCompleted", professor.isSetupCompleted());
            
            System.out.println("Setup completed successfully for professor ID: " + professorId);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("Error in setup process: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal server error: " + e.getMessage()));
        }
    }
}
