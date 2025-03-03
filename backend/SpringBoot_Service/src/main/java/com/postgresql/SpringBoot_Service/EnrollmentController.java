package com.postgresql.SpringBoot_Service;

import com.postgresql.SpringBoot_Service.model.*;
import com.postgresql.SpringBoot_Service.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.HashSet;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/student")  // Add this base path
public class EnrollmentController {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private FacultyStudentRepo studentRepo;

    @Autowired
    private EnrollmentRepo enrollmentRepo;

    @Autowired
    private MajorRepo majorRepo;

    @Autowired
    private SubjectRepo subjectRepo;

    @GetMapping("/debug/{email}")
    public ResponseEntity<?> debugStudentEnrollment(@PathVariable String email) {
        try {
            Faculty_users user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            FacultyStudent student = studentRepo.findByFacultyUser(user);
            if (student == null) {
                return ResponseEntity.ok(Map.of("status", "No student record found"));
            }

            Optional<StudentEnrollment> enrollment = enrollmentRepo.findByStudent(student);
            if (enrollment.isPresent()) {
                return ResponseEntity.ok(Map.of(
                    "status", "Student has enrollment",
                    "enrollmentId", enrollment.get().getId(),
                    "major", enrollment.get().getMajor().getName(),
                    "year", enrollment.get().getYear()
                ));
            } else {
                return ResponseEntity.ok(Map.of("status", "Student exists but has no enrollment"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/clear-enrollment/{email}")
    @Transactional
    public ResponseEntity<?> clearEnrollment(@PathVariable String email) {
        try {
            Faculty_users user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            FacultyStudent student = studentRepo.findByFacultyUser(user);
            if (student == null) {
                return ResponseEntity.ok(Map.of("status", "No student record found"));
            }

            Optional<StudentEnrollment> enrollment = enrollmentRepo.findByStudent(student);
            if (enrollment.isPresent()) {
                enrollmentRepo.delete(enrollment.get());
                return ResponseEntity.ok(Map.of("status", "Enrollment cleared successfully"));
            } else {
                return ResponseEntity.ok(Map.of("status", "No enrollment found to clear"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/enroll")
    @Transactional
    public ResponseEntity<?> enrollStudent(@RequestBody Map<String, Object> request) {
        try {
            // Validate request data
            if (request.get("email") == null || request.get("majorId") == null || 
                request.get("year") == null || request.get("electiveSubjects") == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Missing required fields"));
            }

            String email = (String) request.get("email");
            Long majorId = Long.valueOf(request.get("majorId").toString());
            String year = request.get("year").toString();
            @SuppressWarnings("unchecked")
            List<Long> electiveSubjectIds = ((List<Integer>) request.get("electiveSubjects"))
                .stream()
                .map(id -> Long.valueOf(id.toString()))
                .collect(Collectors.toList());

            // Find user and student
            Faculty_users user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
            
            FacultyStudent student = studentRepo.findByFacultyUser(user);
            if (student == null) {
                throw new RuntimeException("Student not found for user: " + email);
            }

            // Check if student is already enrolled
            Optional<StudentEnrollment> existingEnrollment = enrollmentRepo.findByStudent(student);
            if (existingEnrollment.isPresent()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Student is already enrolled. Please contact administration to modify enrollment."));
            }

            // Find major
            Major major = majorRepo.findById(majorId)
                .orElseThrow(() -> new RuntimeException("Major not found with id: " + majorId));

            // Create new enrollment
            StudentEnrollment enrollment = new StudentEnrollment();
            enrollment.setStudent(student);
            enrollment.setMajor(major);
            enrollment.setYear(year);
            enrollment.setElectiveSubjects(new HashSet<>());

            // Save enrollment
            StudentEnrollment savedEnrollment = enrollmentRepo.save(enrollment);

            // Add elective subjects
            for (Long subjectId : electiveSubjectIds) {
                Subject subject = subjectRepo.findById(subjectId)
                    .orElseThrow(() -> new RuntimeException("Subject not found with id: " + subjectId));
                savedEnrollment.getElectiveSubjects().add(subject);
            }

            // Save again with subjects
            savedEnrollment = enrollmentRepo.save(savedEnrollment);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Enrollment successful");
            response.put("enrollmentId", savedEnrollment.getId());
            response.put("studentName", user.getIme() + " " + user.getPrezime());
            response.put("major", major.getName());
            response.put("year", year);
            response.put("electiveSubjects", electiveSubjectIds);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
}
