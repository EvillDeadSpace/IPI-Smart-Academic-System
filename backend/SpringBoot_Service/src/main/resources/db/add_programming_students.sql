-- First, make sure we have the Programiranje subject in the correct major
INSERT INTO subject (name, ects, major_id)
SELECT 'Programiranje', 6, m.id
FROM major m
WHERE m.name = 'Računarstvo i informatika'
AND NOT EXISTS (
    SELECT 1 FROM subject 
    WHERE name = 'Programiranje' 
    AND major_id = m.id
);

-- Add some example students (if they don't exist)
INSERT INTO faculty_users (ime, prezime, email, tip_usera, password)
VALUES 
    ('Adnan', 'Hodžić', 'adnan.hodzic@example.com', 'STUDENT', 'password123'),
    ('Emina', 'Kovačević', 'emina.kovacevic@example.com', 'STUDENT', 'password123'),
    ('Tarik', 'Mehić', 'tarik.mehic@example.com', 'STUDENT', 'password123'),
    ('Amina', 'Bašić', 'amina.basic@example.com', 'STUDENT', 'password123');

-- Create faculty_student records for these students
INSERT INTO faculty_student (faculty_user_id, godina_studija, smjer_studija)
SELECT fu.id, '1', 'Računarstvo i informatika'
FROM faculty_users fu
WHERE fu.email IN (
    'adnan.hodzic@example.com',
    'emina.kovacevic@example.com',
    'tarik.mehic@example.com',
    'amina.basic@example.com'
)
AND NOT EXISTS (
    SELECT 1 FROM faculty_student fs 
    WHERE fs.faculty_user_id = fu.id
);

-- Enroll students in Programiranje
INSERT INTO student_enrollment (student_id, major_id, year)
SELECT fs.id, m.id, '2023/2024'
FROM faculty_student fs
JOIN faculty_users fu ON fs.faculty_user_id = fu.id
JOIN major m ON m.name = 'Računarstvo i informatika'
WHERE fu.email IN (
    'adnan.hodzic@example.com',
    'emina.kovacevic@example.com',
    'tarik.mehic@example.com',
    'amina.basic@example.com'
)
AND NOT EXISTS (
    SELECT 1 FROM student_enrollment se 
    WHERE se.student_id = fs.id
);

-- Add some initial grades for these students in Programiranje
INSERT INTO grades (student_id, subject_id, points)
SELECT fs.id, s.id, 
    CASE 
        WHEN fu.email = 'adnan.hodzic@example.com' THEN 85
        WHEN fu.email = 'emina.kovacevic@example.com' THEN 92
        WHEN fu.email = 'tarik.mehic@example.com' THEN 78
        WHEN fu.email = 'amina.basic@example.com' THEN 88
    END
FROM faculty_student fs
JOIN faculty_users fu ON fs.faculty_user_id = fu.id
JOIN subject s ON s.name = 'Programiranje'
WHERE fu.email IN (
    'adnan.hodzic@example.com',
    'emina.kovacevic@example.com',
    'tarik.mehic@example.com',
    'amina.basic@example.com'
)
AND NOT EXISTS (
    SELECT 1 FROM grades g 
    WHERE g.student_id = fs.id 
    AND g.subject_id = s.id
);