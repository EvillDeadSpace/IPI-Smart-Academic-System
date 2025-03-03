package com.postgresql.SpringBoot_Service;

import com.postgresql.SpringBoot_Service.model.*;
import com.postgresql.SpringBoot_Service.repo.*;
import com.postgresql.SpringBoot_Service.util.GradeCalculator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/exams")
public class ExamController {

    @Autowired
    private ExamRepo examRepo;

    @Autowired
    private FacultyStudentRepo facultyStudentRepo;

    @Autowired
    private StudentExamRegistrationRepo registrationRepo;

    @Autowired
    private FacultyProfessorRepo professorRepo;

    // Get all exams
    @GetMapping
    public ResponseEntity<List<FacultyExam>> getAllExams() {
        return ResponseEntity.ok(examRepo.findAll());
    }

    // Create new exam (professor only)
    @PostMapping
    public ResponseEntity<?> createExam(@RequestBody FacultyExam exam) {
        try {
            return ResponseEntity.ok(examRepo.save(exam));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Register student for exam
    @PostMapping("/{examId}/register")
    public ResponseEntity<?> registerForExam(
            @PathVariable Long examId,
            @RequestBody Map<String, Long> request) {
        Long studentId = request.get("studentId");
        
        FacultyExam exam = examRepo.findById(examId)
            .orElseThrow(() -> new RuntimeException("Exam not found"));

        FacultyStudent student = facultyStudentRepo.findById(studentId)
            .orElseThrow(() -> new RuntimeException("Student not found"));

        if (registrationRepo.existsByStudentAndExam(student, exam)) {
            return ResponseEntity.badRequest()
                .body("Student already registered for this exam");
        }

        StudentExamRegistration registration = new StudentExamRegistration();
        registration.setStudent(student);
        registration.setExam(exam);
        registration.setRegistrationDate(LocalDateTime.now());
        registration.setStatus(StudentExamRegistration.RegistrationStatus.REGISTERED);

        return ResponseEntity.ok(registrationRepo.save(registration));
    }

    // Get student's registered exams
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<StudentExamRegistration>> getStudentExams(
            @PathVariable Long studentId) {
        FacultyStudent student = facultyStudentRepo.findById(studentId)
            .orElseThrow(() -> new RuntimeException("Student not found"));
        return ResponseEntity.ok(registrationRepo.findByStudent(student));
    }

    // Get professor's exams
    @GetMapping("/professor/{professorId}")
    public ResponseEntity<List<FacultyExam>> getProfessorExams(@PathVariable Long professorId) {
        FacultyProfessor professor = professorRepo.findById(professorId)
            .orElseThrow(() -> new RuntimeException("Professor not found"));
        return ResponseEntity.ok(examRepo.findByProfessor(professor));
    }

    // Update exam grade
    @PutMapping("/{registrationId}/grade")
    public ResponseEntity<?> updateGrade(
            @PathVariable Long registrationId,
            @RequestBody Map<String, Integer> request) {
        try {
            Integer points = request.get("points");
            if (points == null || points < 0 || points > 100) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Points must be between 0 and 100"));
            }
            
            StudentExamRegistration registration = registrationRepo.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));
                
            // Calculate grade from points
            int grade = GradeCalculator.calculateGrade(points);
            boolean isCompleted = GradeCalculator.isSubjectCompleted(grade);
            String gradeDescription = GradeCalculator.getGradeDescription(points);
                
            registration.setPoints(points);
            registration.setGrade(grade);
            registration.setStatus(isCompleted ? 
                StudentExamRegistration.RegistrationStatus.PASSED : 
                StudentExamRegistration.RegistrationStatus.FAILED);
                
            registration = registrationRepo.save(registration);
            
            Map<String, Object> response = new HashMap<>();
            response.put("points", points);
            response.put("grade", grade);
            response.put("status", registration.getStatus());
            response.put("description", gradeDescription);
            response.put("completed", isCompleted);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }
}
