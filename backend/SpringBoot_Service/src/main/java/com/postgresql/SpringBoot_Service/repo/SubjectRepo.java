package com.postgresql.SpringBoot_Service.repo;

import com.postgresql.SpringBoot_Service.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SubjectRepo extends JpaRepository<Subject, Long> {
    Optional<Subject> findByName(String name);
}
