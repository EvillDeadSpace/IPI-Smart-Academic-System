package com.postgresql.SpringBoot_Service.model;

import com.postgresql.SpringBoot_Service.util.GradeCalculator;
import jakarta.persistence.*;

@Entity
@Table(name = "grades")
public class Grade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private FacultyStudent student;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;

    @ManyToOne
    @JoinColumn(name = "professor_id")
    private FacultyProfessor professor;

    private Integer points;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public FacultyStudent getStudent() {
        return student;
    }

    public void setStudent(FacultyStudent student) {
        this.student = student;
    }

    public Subject getSubject() {
        return subject;
    }

    public void setSubject(Subject subject) {
        this.subject = subject;
    }

    public Integer getPoints() {
        return points;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }

    public FacultyProfessor getProfessor() {
        return professor;
    }

    public void setProfessor(FacultyProfessor professor) {
        this.professor = professor;
    }

    public Integer getValue() {
        return GradeCalculator.calculateGrade(this.points);
    }
}
