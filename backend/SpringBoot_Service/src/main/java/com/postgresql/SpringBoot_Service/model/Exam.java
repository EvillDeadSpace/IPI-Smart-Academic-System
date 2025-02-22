package com.postgresql.SpringBoot_Service.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "exams")
public class Exam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne
    @JoinColumn(name = "professor_id", nullable = false)
    private FacultyProfessor professor;

    @Column(nullable = false)
    private LocalDateTime examDate;

    @Column(nullable = false)
    private String location;

    private Integer maxStudents;

    @Column(name = "registration_deadline")
    private LocalDateTime registrationDeadline;

    private String description;

    @Enumerated(EnumType.STRING)
    private ExamStatus status = ExamStatus.SCHEDULED;

    public enum ExamStatus {
        SCHEDULED,
        IN_PROGRESS,
        COMPLETED,
        CANCELLED
    }
}