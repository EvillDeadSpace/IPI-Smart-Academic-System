package com.postgresql.SpringBoot_Service.model;

import jakarta.persistence.*;
import java.util.Set;
import java.time.LocalDate;

@Entity
@Table(name = "student_enrollment")
public class StudentEnrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private FacultyStudent student;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;

    @Column(name = "enrollment_date")
    private LocalDate enrollmentDate;

    @ManyToOne
    @JoinColumn(name = "major_id")
    private Major major;

    private String year;

    @ManyToMany
    @JoinTable(
        name = "student_elective_subjects",
        joinColumns = @JoinColumn(name = "enrollment_id"),
        inverseJoinColumns = @JoinColumn(name = "subject_id")
    )
    private Set<Subject> electiveSubjects;

    // Add getter and setter for enrollmentDate
    public LocalDate getEnrollmentDate() {
        return enrollmentDate;
    }

    public void setEnrollmentDate(LocalDate enrollmentDate) {
        this.enrollmentDate = enrollmentDate;
    }

    // Existing getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Subject getSubject() {
        return subject;
    }

    public void setSubject(Subject subject) {
        this.subject = subject;
    }

    public FacultyStudent getStudent() {
        return student;
    }

    public void setStudent(FacultyStudent student) {
        this.student = student;
    }

    public Major getMajor() {
        return major;
    }

    public void setMajor(Major major) {
        this.major = major;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public Set<Subject> getElectiveSubjects() {
        return electiveSubjects;
    }

    public void setElectiveSubjects(Set<Subject> electiveSubjects) {
        this.electiveSubjects = electiveSubjects;
    }
}
