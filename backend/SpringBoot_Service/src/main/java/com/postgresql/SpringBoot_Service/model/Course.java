package com.postgresql.SpringBoot_Service.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "courses")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String code; // e.g., "CS101"

    private String description;
    
    @Column(name = "ects_points")
    private Integer ectsPoints;

    @Column(name = "semester")
    private Integer semester;
}