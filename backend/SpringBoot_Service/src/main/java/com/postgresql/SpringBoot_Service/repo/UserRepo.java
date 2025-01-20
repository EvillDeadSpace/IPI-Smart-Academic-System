package com.postgresql.SpringBoot_Service.repo;

import com.postgresql.SpringBoot_Service.model.Faculty_users;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface UserRepo extends JpaRepository<Faculty_users, Integer> {
    boolean existsByEmail(String email);

    // Find by email and password
    Faculty_users findByEmailAndPassword(String email, String password);

}
