package com.postgresql.SpringBoot_Service.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.postgresql.SpringBoot_Service.model.Faculty_users;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface UserRepo extends JpaRepository<Faculty_users, Integer> {
    boolean existsByEmail(String email);
}
