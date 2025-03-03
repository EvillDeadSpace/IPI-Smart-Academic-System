package com.postgresql.SpringBoot_Service.repo;

import com.postgresql.SpringBoot_Service.model.FacultyExam;
import com.postgresql.SpringBoot_Service.model.FacultyProfessor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExamRepo extends JpaRepository<FacultyExam, Long> {
    List<FacultyExam> findByProfessor(FacultyProfessor professor);
}
