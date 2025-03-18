import com.postgresql.SpringBoot_Service.model.Major;
import com.postgresql.SpringBoot_Service.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    List<Subject> findByMajorAndYear(Major major, Integer year);
}