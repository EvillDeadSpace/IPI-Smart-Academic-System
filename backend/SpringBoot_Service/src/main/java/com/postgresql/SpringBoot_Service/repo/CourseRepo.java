package com.postgresql.SpringBoot_Service.repo;

import com.postgresql.SpringBoot_Service.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepo extends JpaRepository<Course, Long> {
    boolean existsByCode(String code);
}