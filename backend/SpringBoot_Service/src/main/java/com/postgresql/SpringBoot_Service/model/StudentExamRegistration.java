package com.postgresql.SpringBoot_Service.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "student_exam_registration")
public class StudentExamRegistration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Changed from Integer to Long

    @ManyToOne
    @JoinColumn(name = "student_id")
    private FacultyStudent student;

    @ManyToOne
    @JoinColumn(name = "exam_id")
    private FacultyExam exam;

    private Integer points;
    private Integer grade;

    @Column(name = "registration_date")
    private LocalDateTime registrationDate;

    @Enumerated(EnumType.STRING)
    private RegistrationStatus status;

    public enum RegistrationStatus {
        REGISTERED,
        PASSED,
        FAILED
    }
}
