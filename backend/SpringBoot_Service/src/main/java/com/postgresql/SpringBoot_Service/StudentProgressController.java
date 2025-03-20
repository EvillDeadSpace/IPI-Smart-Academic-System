package com.postgresql.SpringBoot_Service;

import com.postgresql.SpringBoot_Service.repo.UserRepo;
import com.postgresql.SpringBoot_Service.repo.FacultyStudentRepo;
import com.postgresql.SpringBoot_Service.repo.EnrollmentRepo;
import com.postgresql.SpringBoot_Service.repo.GradeRepo;
import com.postgresql.SpringBoot_Service.model.Faculty_users;
import com.postgresql.SpringBoot_Service.model.FacultyStudent;
import com.postgresql.SpringBoot_Service.model.StudentEnrollment;
import com.postgresql.SpringBoot_Service.model.Grade;
import com.postgresql.SpringBoot_Service.model.Subject;
import com.postgresql.SpringBoot_Service.model.Major;
import com.postgresql.SpringBoot_Service.util.GradeCalculator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/student/progress")
public class StudentProgressController {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private FacultyStudentRepo facultyStudentRepo;

    @Autowired
    private EnrollmentRepo enrollmentRepo;

    @Autowired
    private GradeRepo gradeRepo;

    @GetMapping("/{email}")
    public ResponseEntity<?> getStudentProgress(@PathVariable String email) {
        try {
            // Find user
            Faculty_users user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Find student
            FacultyStudent student = facultyStudentRepo.findByFacultyUser(user);
            if (student == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Student record not found"));
            }

            // Get enrollments and validate them
            List<StudentEnrollment> enrollments = enrollmentRepo.findAllByStudent(student);
            if (enrollments == null) {
                enrollments = new ArrayList<>();
            }

            List<Grade> grades = gradeRepo.findByStudent(student);
            if (grades == null) {
                grades = new ArrayList<>();
            }

            Map<String, Object> response = new HashMap<>();
            
            // Basic student info
            response.put("studentName", user.getIme() + " " + user.getPrezime());
            response.put("email", user.getEmail());
            response.put("major", student.getSmjerStudija());
            response.put("year", student.getGodinaStudija());

            int totalEcts = 0;
            int earnedEcts = 0;

            List<Map<String, Object>> requiredSubjects = new ArrayList<>();
            List<Map<String, Object>> electiveSubjects = new ArrayList<>();

            // Process each enrollment
            for (StudentEnrollment enrollment : enrollments) {
                Subject subject = enrollment.getSubject();
                
                // Skip if subject is null
                if (subject == null) {
                    continue;
                }

                Map<String, Object> subjectInfo = new HashMap<>();
                subjectInfo.put("name", subject.getName());
                subjectInfo.put("ects", subject.getEcts());
                
                // Find grade for this subject
                Optional<Grade> grade = grades.stream()
                    .filter(g -> g.getSubject() != null && g.getSubject().getId().equals(subject.getId()))
                    .findFirst();

                if (grade.isPresent()) {
                    subjectInfo.put("grade", grade.get().getValue());
                    subjectInfo.put("points", grade.get().getPoints());
                    subjectInfo.put("status", grade.get().getValue() >= 6 ? "Completed" : "Failed");
                    if (grade.get().getValue() >= 6) {
                        earnedEcts += subject.getEcts();
                    }
                } else {
                    subjectInfo.put("grade", "-");
                    subjectInfo.put("points", 0);
                    subjectInfo.put("status", "Not Attempted");
                }
                
                totalEcts += subject.getEcts();
                
                if (Boolean.TRUE.equals(subject.getIsRequired())) {
                    requiredSubjects.add(subjectInfo);
                } else {
                    electiveSubjects.add(subjectInfo);
                }
            }

            response.put("requiredSubjects", requiredSubjects);
            response.put("electiveSubjects", electiveSubjects);
            response.put("totalEcts", totalEcts);
            response.put("earnedEcts", earnedEcts);
            response.put("progress", totalEcts > 0 ? (earnedEcts * 100.0 / totalEcts) : 0);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
