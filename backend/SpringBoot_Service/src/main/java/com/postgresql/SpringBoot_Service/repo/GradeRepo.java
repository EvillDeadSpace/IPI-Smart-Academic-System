package com.postgresql.SpringBoot_Service.repo;

import com.postgresql.SpringBoot_Service.model.Grade;
import com.postgresql.SpringBoot_Service.model.FacultyStudent;
import com.postgresql.SpringBoot_Service.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import java.util.List;

@RepositoryRestResource
public interface GradeRepo extends JpaRepository<Grade, Long> {  // Changed to Long
    List<Grade> findByStudent(FacultyStudent student);
    List<Grade> findBySubject(Subject subject);
}
