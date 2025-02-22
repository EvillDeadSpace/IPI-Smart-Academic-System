package com.postgresql.SpringBoot_Service.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "student_exam_registrations")
public class StudentExamRegistration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private FacultyStudent student;

    @ManyToOne
    @JoinColumn(name = "exam_id", nullable = false)
    private FacultyExam exam;

    @Column(name = "registration_date", nullable = false)
    private LocalDateTime registrationDate;

    private Integer grade;

    @Enumerated(EnumType.STRING)
    private RegistrationStatus status = RegistrationStatus.REGISTERED;

    public enum RegistrationStatus {
        REGISTERED,
        WITHDRAWN,
        COMPLETED,
        FAILED,
        PASSED
    }
}
