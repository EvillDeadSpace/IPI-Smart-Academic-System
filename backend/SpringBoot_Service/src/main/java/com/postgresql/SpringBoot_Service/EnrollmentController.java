package com.postgresql.SpringBoot_Service;

import com.postgresql.SpringBoot_Service.model.*;
import com.postgresql.SpringBoot_Service.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/student")
public class EnrollmentController {

    @Autowired
    private UserRepo userRepo;
    
    @Autowired
    private FacultyStudentRepo facultyStudentRepo;
    
    @Autowired
    private SubjectRepo subjectRepo;
    
    @Autowired
    private EnrollmentRepo enrollmentRepo;

    @Autowired
    private MajorRepo majorRepo;

    @PostMapping("/enroll")
    @Transactional
    public ResponseEntity<?> enrollStudent(@RequestBody Map<String, Object> request) {
        try {
            String email = (String) request.get("email");
            String majorName = (String) request.get("majorName");
            Integer year = (Integer) request.get("year");
            List<Integer> subjectIds = (List<Integer>) request.get("subjects");

            // Validate input
            if (email == null || majorName == null || year == null || subjectIds == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Missing required fields"));
            }

            // Get the student
            Faculty_users user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

            FacultyStudent student = facultyStudentRepo.findByFacultyUser(user);
            if (student == null) {
                throw new RuntimeException("Student record not found");
            }

            // Find the major first
            Major major = majorRepo.findByName(majorName)
                .orElseThrow(() -> new RuntimeException("Major not found: " + majorName));

            // Update student information
            student.setGodinaStudija(String.valueOf(year));
            student.setSmjerStudija(majorName);
            facultyStudentRepo.save(student);

            // Clear existing enrollments in a separate transaction
            enrollmentRepo.deleteAllByStudent(student);

            // Create new enrollments
            List<StudentEnrollment> newEnrollments = new ArrayList<>();
            
            // Set the academic year (e.g., "2024/2025")
            String academicYear = String.format("%d/%d", LocalDate.now().getYear(), LocalDate.now().getYear() + 1);

            for (Integer subjectId : subjectIds) {
                Subject subject = subjectRepo.findById(subjectId.longValue())
                    .orElseThrow(() -> new RuntimeException("Subject not found: " + subjectId));

                StudentEnrollment enrollment = new StudentEnrollment();
                enrollment.setStudent(student);
                enrollment.setSubject(subject);
                enrollment.setEnrollmentDate(LocalDate.now());
                enrollment.setYear(academicYear);
                enrollment.setMajor(major);

                newEnrollments.add(enrollment);
            }

            // Save all enrollments
            enrollmentRepo.saveAll(newEnrollments);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Successfully enrolled");
            response.put("major", majorName);
            response.put("year", year);
            response.put("subjectsCount", subjectIds.size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // Log the full stack trace
            e.printStackTrace();
            
            // Return a more detailed error message
            String errorMessage = e.getMessage();
            if (e.getCause() != null) {
                errorMessage += " Caused by: " + e.getCause().getMessage();
            }
            
            return ResponseEntity.badRequest().body(Map.of(
                "error", errorMessage,
                "errorType", e.getClass().getSimpleName()
            ));
        }
    }
}
