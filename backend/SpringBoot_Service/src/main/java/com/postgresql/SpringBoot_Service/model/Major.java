package com.postgresql.SpringBoot_Service.model;

import jakarta.persistence.*;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
@Table(name = "major")
public class Major {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Changed from Integer to Long

    private String name;

    @OneToMany(mappedBy = "major", fetch = FetchType.EAGER)
    private Set<Subject> subjects;

    public Set<Subject> getRequiredSubjects() {
        if (subjects == null) {
            return Set.of();
        }
        return subjects.stream()
                .filter(subject -> subject.getIsRequired() != null && subject.getIsRequired())
                .collect(Collectors.toSet());
    }

    public Long getId() {  // Changed from Integer to Long
        return id;
    }

    public void setId(Long id) {  // Changed from Integer to Long
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Subject> getSubjects() {
        return subjects;
    }

    public void setSubjects(Set<Subject> subjects) {
        this.subjects = subjects;
    }
}
