-- First verify student exists and get their faculty_student ID
SELECT fs.id as student_id, fu.ime, fu.prezime, fs.godina_studija
FROM faculty_student fs 
JOIN faculty_users fu ON fs.faculty_user_id = fu.id
WHERE fu.email = 'mujo@gmail.com';

-- Find the subject ID for Web Programiranje
SELECT id, name, ects 
FROM subject 
WHERE name = 'Web Programiranje' 
AND major_id = (
    SELECT id FROM major WHERE name = 'Računarstvo i informatika'
);