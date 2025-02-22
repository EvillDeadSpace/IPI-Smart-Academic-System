package com.postgresql.SpringBoot_Service.repo;

import com.postgresql.SpringBoot_Service.model.StudentExamRegistration;
import com.postgresql.SpringBoot_Service.model.FacultyStudent;
import com.postgresql.SpringBoot_Service.model.FacultyExam;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StudentExamRegistrationRepo extends JpaRepository<StudentExamRegistration, Integer > {
    List<StudentExamRegistration> findByStudent(FacultyStudent student);
    List<StudentExamRegistration> findByExam(FacultyExam exam);
    boolean existsByStudentAndExam(FacultyStudent student, FacultyExam exam);
}
