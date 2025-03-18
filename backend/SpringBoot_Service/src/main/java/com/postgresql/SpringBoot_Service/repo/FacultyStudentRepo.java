package com.postgresql.SpringBoot_Service.repo;

import com.postgresql.SpringBoot_Service.model.FacultyStudent;
import com.postgresql.SpringBoot_Service.model.Faculty_users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

@RepositoryRestResource
public interface FacultyStudentRepo extends JpaRepository<FacultyStudent, Long> {
    FacultyStudent findByFacultyUser(Faculty_users facultyUser);
    List<FacultyStudent> findBySmjerStudija(String smjerStudija);
    
    @Query("SELECT fs FROM FacultyStudent fs WHERE fs.facultyUser.email = :email")
    Optional<FacultyStudent> findByFacultyUserEmail(@Param("email") String email);
}
