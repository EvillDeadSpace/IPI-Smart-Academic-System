-- First create the faculty_professors table
CREATE TABLE IF NOT EXISTS faculty_professors (
    id BIGINT PRIMARY KEY,
    predmet_id BIGINT,
    titula VARCHAR(255),
    kabinet VARCHAR(255)
);

-- Then create the courses table if it doesn't exist
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL
);

-- Create the exams table
CREATE TABLE IF NOT EXISTS exams (
    id SERIAL PRIMARY KEY,
    professor_id BIGINT NOT NULL,
    subject VARCHAR(255) NOT NULL,
    exam_date TIMESTAMP NOT NULL,
    classroom VARCHAR(255) NOT NULL,
    max_points INTEGER NOT NULL DEFAULT 100,
    status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED',
    course_id BIGINT,
    max_students INTEGER,
    registration_deadline TIMESTAMP,
    description VARCHAR(255),
    FOREIGN KEY (professor_id) REFERENCES faculty_professors(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Create the student_exam_registration table
CREATE TABLE IF NOT EXISTS student_exam_registration (
    id SERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL,
    exam_id BIGINT NOT NULL,
    points INTEGER,
    grade INTEGER,
    registration_date TIMESTAMP,
    status VARCHAR(50),
    FOREIGN KEY (exam_id) REFERENCES exams(id)
);

-- Create professor_subjects table for the many-to-many relationship
CREATE TABLE IF NOT EXISTS professor_subjects (
    professor_id BIGINT NOT NULL,
    subject VARCHAR(255),
    FOREIGN KEY (professor_id) REFERENCES faculty_professors(id)
);