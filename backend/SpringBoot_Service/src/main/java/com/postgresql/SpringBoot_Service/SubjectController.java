package com.postgresql.SpringBoot_Service;

import com.postgresql.SpringBoot_Service.model.*;
import com.postgresql.SpringBoot_Service.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/subjects")
@CrossOrigin(origins = "http://localhost:3000") // Add this if you're using React
public class SubjectController {

    @Autowired
    private SubjectRepo subjectRepo;

    @Autowired
    private GradeRepo gradeRepo;

    @Autowired
    private FacultyStudentRepo facultyStudentRepo;

    @Autowired
    private FacultyProfessorRepo professorRepo;

    @GetMapping("/{subjectName}/students")
    public ResponseEntity<?> getStudentsForSubject(@PathVariable String subjectName) {
        try {
            // First, find the subject
            Subject subject = subjectRepo.findByName(subjectName)
                .orElseThrow(() -> new RuntimeException("Subject not found: " + subjectName));

            // Find all grades for this subject
            List<Grade> grades = gradeRepo.findBySubject(subject);

            // Transform the data into the format expected by the frontend
            List<Map<String, Object>> studentList = grades.stream()
                .map(grade -> {
                    FacultyStudent student = grade.getStudent();
                    Faculty_users user = student.getFacultyUser();
                    
                    Map<String, Object> studentInfo = new HashMap<>();
                    studentInfo.put("id", student.getId());
                    studentInfo.put("ime", user.getIme());
                    studentInfo.put("prezime", user.getPrezime());
                    studentInfo.put("indeks", student.getId().toString()); // or another field that represents the student index
                    studentInfo.put("points", grade.getPoints());
                    studentInfo.put("subject", subjectName);
                    
                    return studentInfo;
                })
                .collect(Collectors.toList());

            // Also get students who are enrolled but don't have grades yet
            List<FacultyStudent> allStudents = facultyStudentRepo.findBySmjerStudija("Računarstvo i informatika");
            
            for (FacultyStudent student : allStudents) {
                // Check if student already has a grade
                boolean hasGrade = grades.stream()
                    .anyMatch(g -> g.getStudent().getId().equals(student.getId()));
                
                if (!hasGrade) {
                    Faculty_users user = student.getFacultyUser();
                    Map<String, Object> studentInfo = new HashMap<>();
                    studentInfo.put("id", student.getId());
                    studentInfo.put("ime", user.getIme());
                    studentInfo.put("prezime", user.getPrezime());
                    studentInfo.put("indeks", student.getId().toString());
                    studentInfo.put("points", null);
                    studentInfo.put("subject", subjectName);
                    
                    studentList.add(studentInfo);
                }
            }

            return ResponseEntity.ok(studentList);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Map<String, Object>>> getAllSubjects() {
        List<Subject> subjects = subjectRepo.findAll();
        List<Map<String, Object>> subjectList = subjects.stream()
            .map(subject -> {
                Map<String, Object> subjectMap = new HashMap<>();
                subjectMap.put("id", subject.getId());
                subjectMap.put("name", subject.getName());
                return subjectMap;
            })
            .collect(Collectors.toList());
        return ResponseEntity.ok(subjectList);
    }

    @PostMapping("/professors/setup/{professorId}")
    public ResponseEntity<?> setupProfessorSubjects(
        @PathVariable Long professorId,
        @RequestBody Map<String, List<String>> request
    ) {
        try {
            List<String> subjects = request.get("subjects");
            FacultyProfessor professor = professorRepo.findById(professorId)
                .orElseThrow(() -> new RuntimeException("Professor not found"));
            
            // Update professor's subjects
            professor.setSubjects(subjects);
            professorRepo.save(professor);
            
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
