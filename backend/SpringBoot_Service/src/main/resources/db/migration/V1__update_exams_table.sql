ALTER TABLE exams
ADD COLUMN IF NOT EXISTS course_id bigint,
ADD COLUMN IF NOT EXISTS max_students integer,
ADD COLUMN IF NOT EXISTS registration_deadline timestamp,
ADD COLUMN IF NOT EXISTS description varchar(255),
ADD CONSTRAINT fk_course FOREIGN KEY (course_id) REFERENCES courses(id);