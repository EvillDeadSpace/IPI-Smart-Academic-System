package com.postgresql.SpringBoot_Service.repo;

import com.postgresql.SpringBoot_Service.model.Faculty_users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import java.util.Optional;

@RepositoryRestResource
public interface UserRepo extends JpaRepository<Faculty_users, Long> {
    Optional<Faculty_users> findByEmailAndTipUsera(String email, String tipUsera);
    Optional<Faculty_users> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    Faculty_users findByEmailAndPassword(String email, String password);
}
