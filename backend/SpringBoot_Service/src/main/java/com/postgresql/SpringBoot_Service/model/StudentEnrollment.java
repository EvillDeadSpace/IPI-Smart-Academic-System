package com.postgresql.SpringBoot_Service.model;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "student_enrollment")
public class StudentEnrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "student_id")
    private FacultyStudent student;

    @ManyToOne
    @JoinColumn(name = "major_id")
    private Major major;

    private String year;

    @ManyToMany
    @JoinTable(
        name = "enrollment_elective_subjects",
        joinColumns = @JoinColumn(name = "enrollment_id"),
        inverseJoinColumns = @JoinColumn(name = "subject_id")
    )
    private Set<Subject> electiveSubjects;

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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
