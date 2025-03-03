package com.postgresql.SpringBoot_Service.repo;

import com.postgresql.SpringBoot_Service.model.FacultyProfessor;
import com.postgresql.SpringBoot_Service.model.Faculty_users;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FacultyProfessorRepo extends JpaRepository<FacultyProfessor, Long> {
    Optional<FacultyProfessor> findByKorisnik(Faculty_users korisnik);
}
