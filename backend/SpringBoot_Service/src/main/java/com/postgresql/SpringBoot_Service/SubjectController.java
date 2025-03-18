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
@CrossOrigin(origins = "http://localhost:5173") // Add this if you're using React
public class SubjectController {

    @Autowired
    private SubjectRepo subjectRepo;

    @Autowired
    private GradeRepo gradeRepo;

    @Autowired
    private FacultyStudentRepo facultyStudentRepo;

    @Autowired
    private FacultyProfessorRepo professorRepo;

    @Autowired
    private MajorRepo majorRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private EnrollmentRepo enrollmentRepo;  // Use this instead of StudentEnrollmentRepository

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

    @GetMapping("/by-year/{majorId}/{year}")
    public ResponseEntity<?> getSubjectsByYearAndMajor(
        @PathVariable Long majorId,
        @PathVariable Integer year
    ) {
        try {
            Major major = majorRepo.findById(majorId)
                .orElseThrow(() -> new RuntimeException("Major not found"));

            List<Subject> subjects = subjectRepo.findByMajorAndYear(major, year);
            
            Map<String, List<Map<String, Object>>> response = new HashMap<>();
            
            // Separate required and elective subjects
            List<Map<String, Object>> requiredSubjects = new ArrayList<>();
            List<Map<String, Object>> electiveSubjects = new ArrayList<>();

            for (Subject subject : subjects) {
                Map<String, Object> subjectMap = new HashMap<>();
                subjectMap.put("id", subject.getId());
                subjectMap.put("name", subject.getName());
                subjectMap.put("ects", subject.getEcts());
                
                if (Boolean.TRUE.equals(subject.getIsRequired())) {
                    requiredSubjects.add(subjectMap);
                } else {
                    electiveSubjects.add(subjectMap);
                }
            }

            response.put("required", requiredSubjects);
            response.put("elective", electiveSubjects);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/api/student/progress/{email}")
    public ResponseEntity<?> getStudentProgress(@PathVariable String email) {
        try {
            Faculty_users user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

            FacultyStudent student = facultyStudentRepo.findByFacultyUser(user);
            if (student == null) {
                throw new RuntimeException("Student not found");
            }

            // Get all enrollments for the student
            List<StudentEnrollment> enrollments = enrollmentRepo.findAllByStudent(student);
            if (enrollments.isEmpty()) {
                // Return basic student info even if no enrollments
                Map<String, Object> progress = new HashMap<>();
                progress.put("studentName", user.getIme() + " " + user.getPrezime());
                progress.put("email", email);
                progress.put("major", student.getSmjerStudija());
                progress.put("year", student.getGodinaStudija());
                progress.put("requiredSubjects", new ArrayList<>());
                progress.put("electiveSubjects", new ArrayList<>());
                progress.put("totalEcts", 0);
                progress.put("earnedEcts", 0);
                progress.put("progress", 0.0);
                return ResponseEntity.ok(progress);
            }

            // Get all grades for this student
            List<Grade> grades = gradeRepo.findByStudent(student);

            List<Map<String, Object>> requiredSubjects = new ArrayList<>();
            List<Map<String, Object>> electiveSubjects = new ArrayList<>();
            int totalEcts = 0;
            int earnedEcts = 0;

            for (StudentEnrollment enrollment : enrollments) {
                Subject subject = enrollment.getSubject();
                if (subject == null) continue;

                Map<String, Object> subjectInfo = new HashMap<>();
                subjectInfo.put("name", subject.getName());
                subjectInfo.put("ects", subject.getEcts());

                // Find grade for this subject if it exists
                Optional<Grade> grade = grades.stream()
                    .filter(g -> g.getSubject().getId().equals(subject.getId()))
                    .findFirst();

                if (grade.isPresent()) {
                    subjectInfo.put("grade", grade.get().getValue());
                    subjectInfo.put("points", grade.get().getPoints());
                    if (grade.get().getValue() >= 6) {
                        earnedEcts += subject.getEcts();
                    }
                } else {
                    subjectInfo.put("grade", "-");
                    subjectInfo.put("points", 0);
                }

                totalEcts += subject.getEcts();

                if (Boolean.TRUE.equals(subject.getIsRequired())) {
                    requiredSubjects.add(subjectInfo);
                } else {
                    electiveSubjects.add(subjectInfo);
                }
            }

            Map<String, Object> progress = new HashMap<>();
            progress.put("studentName", user.getIme() + " " + user.getPrezime());
            progress.put("email", email);
            progress.put("major", student.getSmjerStudija());
            progress.put("year", student.getGodinaStudija());
            progress.put("requiredSubjects", requiredSubjects);
            progress.put("electiveSubjects", electiveSubjects);
            progress.put("totalEcts", totalEcts);
            progress.put("earnedEcts", earnedEcts);
            progress.put("progress", totalEcts > 0 ? (earnedEcts * 100.0 / totalEcts) : 0);

            return ResponseEntity.ok(progress);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    private List<Map<String, Object>> mapSubjectsToResponse(List<Subject> subjects) {
        return subjects.stream()
            .map(subject -> {
                Map<String, Object> subjectMap = new HashMap<>();
                subjectMap.put("name", subject.getName());
                subjectMap.put("ects", subject.getEcts());
                // Add other subject details as needed
                return subjectMap;
            })
            .collect(Collectors.toList());
    }

    private int calculateTotalEcts(List<Subject> subjects) {
        return subjects.stream()
            .mapToInt(Subject::getEcts)
            .sum();
    }

    private int calculateEarnedEcts(List<Subject> subjects) {
        return subjects.stream()
            .filter(subject -> hasPassedSubject(subject))
            .mapToInt(Subject::getEcts)
            .sum();
    }

    private boolean hasPassedSubject(Subject subject) {
        // Implement your logic to determine if a student has passed the subject
        // This might involve checking grades or other criteria
        return false; // Placeholder
    }

    @GetMapping("/majors/with-subjects")
    public ResponseEntity<?> getMajorsWithSubjects() {
        try {
            List<Major> majors = majorRepo.findAll();
            List<Map<String, Object>> response = new ArrayList<>();

            for (Major major : majors) {
                Map<String, Object> majorData = new HashMap<>();
                majorData.put("id", major.getId());
                majorData.put("name", major.getName());

                // Get all subjects for this major
                List<Subject> majorSubjects = subjectRepo.findByMajor(major);
                
                // Transform subjects into the required format
                List<Map<String, Object>> subjectsList = majorSubjects.stream()
                    .map(subject -> {
                        Map<String, Object> subjectData = new HashMap<>();
                        subjectData.put("id", subject.getId());
                        subjectData.put("name", subject.getName());
                        subjectData.put("ects", subject.getEcts());
                        subjectData.put("isRequired", subject.getIsRequired());
                        subjectData.put("year", subject.getYear());
                        return subjectData;
                    })
                    .collect(Collectors.toList());

                majorData.put("subjects", subjectsList);
                response.add(majorData);
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
