package com.postgresql.SpringBoot_Service.repo;

import com.postgresql.SpringBoot_Service.model.FacultyStudent;
import com.postgresql.SpringBoot_Service.model.Faculty_users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface FacultyStudentRepo extends JpaRepository<FacultyStudent, Integer> {
    FacultyStudent findByFacultyUser(Faculty_users facultyUser);
}