-- First remove any potential duplicate entries
DELETE FROM grades a USING grades b
WHERE a.student_id = b.student_id 
AND a.subject_id = b.subject_id 
AND a.id > b.id;

-- Add unique constraint
ALTER TABLE grades
ADD CONSTRAINT unique_student_subject UNIQUE (student_id, subject_id);





--this is working fine
---- First, get the student_id
WITH student_id AS (
    SELECT fs.id
    FROM faculty_student fs 
    JOIN faculty_users fu ON fs.faculty_user_id = fu.id
    WHERE fu.email = 'a@a.com'
),
subject_id AS (
    SELECT id
    FROM subject 
    WHERE name = 'Programiranje' 
    AND major_id = (
        SELECT id FROM major 
        WHERE name = 'Računarstvo i informatika'
    )
)
-- Now insert or update the grade
INSERT INTO grades (student_id, subject_id, points)
SELECT 
    (SELECT id FROM student_id),
    (SELECT id FROM subject_id),
    85
WHERE EXISTS (SELECT 1 FROM student_id) AND EXISTS (SELECT 1 FROM subject_id)
ON CONFLICT ON CONSTRAINT unique_student_subject
DO UPDATE SET points = 85;

-- Verify the result
SELECT fu.email, fu.ime, fu.prezime, s.name as subject_name, g.points
FROM grades g
JOIN faculty_student fs ON g.student_id = fs.id
JOIN faculty_users fu ON fs.faculty_user_id = fu.id
JOIN subject s ON g.subject_id = s.id
WHERE fu.email = 'a@a.com' AND s.name = 'Programiranje';