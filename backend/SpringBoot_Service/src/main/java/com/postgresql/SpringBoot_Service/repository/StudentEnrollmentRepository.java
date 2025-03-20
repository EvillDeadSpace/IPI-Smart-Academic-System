import com.postgresql.SpringBoot_Service.model.FacultyStudent;
import com.postgresql.SpringBoot_Service.model.StudentEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentEnrollmentRepository extends JpaRepository<StudentEnrollment, Long> {
    List<StudentEnrollment> findAllByStudent(FacultyStudent student);
    void deleteAllByStudent(FacultyStudent student);
}
