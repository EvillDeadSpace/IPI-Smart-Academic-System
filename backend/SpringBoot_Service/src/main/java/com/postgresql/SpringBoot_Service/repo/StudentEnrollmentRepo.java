package com.postgresql.SpringBoot_Service.repo;

import com.postgresql.SpringBoot_Service.model.StudentEnrollment;
import com.postgresql.SpringBoot_Service.model.FacultyStudent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentEnrollmentRepo extends JpaRepository<StudentEnrollment, Integer> {
    Optional<StudentEnrollment> findByStudent(FacultyStudent student);
}