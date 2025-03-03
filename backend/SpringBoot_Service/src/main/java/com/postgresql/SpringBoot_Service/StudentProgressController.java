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
            Faculty_users user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            FacultyStudent student = facultyStudentRepo.findByFacultyUser(user);
            if (student == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Student record not found"));
            }

            Optional<StudentEnrollment> enrollment = enrollmentRepo.findByStudent(student);
            List<Grade> grades = gradeRepo.findByStudent(student);

            Map<String, Object> response = new HashMap<>();
            
            // Basic Info
            response.put("studentName", user.getIme() + " " + user.getPrezime());
            response.put("email", user.getEmail());
            
            // Enrollment Info
            if (enrollment.isPresent()) {
                StudentEnrollment enr = enrollment.get();
                Major major = enr.getMajor();
                if (major != null) {
                    response.put("major", major.getName());
                    response.put("year", enr.getYear());
                    
                    // Calculate ECTS
                    int totalEcts = 0;
                    int earnedEcts = 0;
                    
                    // Required Subjects
                    List<Map<String, Object>> requiredSubjects = new ArrayList<>();
                    for (Subject subject : major.getRequiredSubjects()) {
                        Map<String, Object> subjectInfo = new HashMap<>();
                        subjectInfo.put("name", subject.getName());
                        subjectInfo.put("ects", subject.getEcts());
                        
                        Optional<Grade> grade = grades.stream()
                            .filter(g -> g.getSubject().getId().equals(subject.getId()))
                            .findFirst();

                        if (grade.isPresent()) {
                            int gradeValue = grade.get().getValue();
                            subjectInfo.put("grade", gradeValue);
                            subjectInfo.put("points", grade.get().getPoints());
                            subjectInfo.put("description", GradeCalculator.getGradeDescription(grade.get().getPoints()));
                            
                            if (GradeCalculator.isSubjectCompleted(gradeValue)) {
                                subjectInfo.put("status", "Completed");
                                earnedEcts += subject.getEcts();
                            } else {
                                subjectInfo.put("status", "Failed");
                            }
                        } else {
                            subjectInfo.put("grade", "-");
                            subjectInfo.put("points", "-");
                            subjectInfo.put("status", "Not Attempted");
                        }
                        
                        totalEcts += subject.getEcts();
                        requiredSubjects.add(subjectInfo);
                    }
                    
                    // Elective Subjects
                    List<Map<String, Object>> electiveSubjects = new ArrayList<>();
                    for (Subject subject : enr.getElectiveSubjects()) {
                        Map<String, Object> subjectInfo = new HashMap<>();
                        subjectInfo.put("name", subject.getName());
                        subjectInfo.put("ects", subject.getEcts());
                        
                        Optional<Grade> grade = grades.stream()
                            .filter(g -> g.getSubject().getId().equals(subject.getId()))
                            .findFirst();

                        if (grade.isPresent()) {
                            int gradeValue = grade.get().getValue();
                            subjectInfo.put("grade", gradeValue);
                            subjectInfo.put("points", grade.get().getPoints());
                            subjectInfo.put("description", GradeCalculator.getGradeDescription(grade.get().getPoints()));
                            
                            if (GradeCalculator.isSubjectCompleted(gradeValue)) {
                                subjectInfo.put("status", "Completed");
                                earnedEcts += subject.getEcts();
                            } else {
                                subjectInfo.put("status", "Failed");
                            }
                        } else {
                            subjectInfo.put("grade", "-");
                            subjectInfo.put("points", "-");
                            subjectInfo.put("status", "Not Attempted");
                        }
                        
                        totalEcts += subject.getEcts();
                        electiveSubjects.add(subjectInfo);
                    }
                    
                    response.put("requiredSubjects", requiredSubjects);
                    response.put("electiveSubjects", electiveSubjects);
                    response.put("totalEcts", totalEcts);
                    response.put("earnedEcts", earnedEcts);
                    response.put("progress", (double) earnedEcts / totalEcts * 100);
                }
            }

            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
