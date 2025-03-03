package com.postgresql.SpringBoot_Service.repo;

import com.postgresql.SpringBoot_Service.model.Major;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface MajorRepo extends JpaRepository<Major, Long> {  // Changed from Integer to Long
}
