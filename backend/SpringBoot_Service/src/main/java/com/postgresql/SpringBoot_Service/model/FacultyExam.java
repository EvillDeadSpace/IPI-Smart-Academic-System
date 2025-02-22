package com.postgresql.SpringBoot_Service.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class FacultyExam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;  // Changed from Long to Integer

    private String subject;
    private LocalDateTime examTime;
    private String classroom;

    @ManyToOne
    @JoinColumn(name = "professor_id", nullable = false)
    private FacultyProfessor professor;

    // Getters and Setters
    public Integer getId() {  // Changed from Long to Integer
        return id;
    }

    public void setId(Integer id) {  // Changed from Long to Integer
        this.id = id;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public LocalDateTime getExamTime() {
        return examTime;
    }

    public void setExamTime(LocalDateTime examTime) {
        this.examTime = examTime;
    }

    public String getClassroom() {
        return classroom;
    }

    public void setClassroom(String classroom) {
        this.classroom = classroom;
    }

    public FacultyProfessor getProfessor() {
        return professor;
    }

    public void setProfessor(FacultyProfessor professor) {
        this.professor = professor;
    }
}
