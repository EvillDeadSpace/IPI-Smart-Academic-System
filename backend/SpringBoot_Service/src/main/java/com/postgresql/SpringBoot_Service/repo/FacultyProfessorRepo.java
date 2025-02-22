package com.postgresql.SpringBoot_Service.repo;

import com.postgresql.SpringBoot_Service.model.FacultyProfessor;
import com.postgresql.SpringBoot_Service.model.Faculty_users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Optional;

@RepositoryRestResource
public interface FacultyProfessorRepo extends JpaRepository<FacultyProfessor, Integer> {  // Changed from Long to Integer
    Optional<FacultyProfessor> findByKorisnik(Faculty_users korisnik);
}
