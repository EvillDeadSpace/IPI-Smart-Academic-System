package com.postgresql.SpringBoot_Service.repo;

import com.postgresql.SpringBoot_Service.model.Major;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MajorRepo extends JpaRepository<Major, Long> {
    Optional<Major> findByName(String name);
}
