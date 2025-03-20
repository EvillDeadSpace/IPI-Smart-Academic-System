package com.postgresql.SpringBoot_Service.repo;

import com.postgresql.SpringBoot_Service.model.StudentEnrollment;
import com.postgresql.SpringBoot_Service.model.FacultyStudent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;
import java.util.Optional;

@RepositoryRestResource
public interface EnrollmentRepo extends JpaRepository<StudentEnrollment, Long> {
    void deleteAllByStudent(FacultyStudent student);
    List<StudentEnrollment> findAllByStudent(FacultyStudent student);
}
