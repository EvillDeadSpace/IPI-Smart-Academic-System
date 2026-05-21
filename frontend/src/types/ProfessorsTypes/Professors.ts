export interface SubjectInfo {
    id: number
    name: string
    code: string
    ects: number
    isElective: boolean
    year: number
    semester: number
}

export interface EnrolledStudent {
    id: number
    firstName: string
    lastName: string
    email: string
    indexNumber: string
    currentGrade?: number
    currentPoints?: number
    hasGrade: boolean
}

export interface SubjectWithStudents {
    subject: SubjectInfo
    students: EnrolledStudent[]
}

export interface GradeFormData {
    studentEmail: string
    studentName: string
    subjectId: number
    subjectName: string
    grade: number
    points: number
}

export interface ExamData {
    id: number
    subjectId: number
    examTime: string
    location: string | null
    maxPoints: number
    subject: {
        id: number
        name: string
        code: string
    }
}

export interface ExamFormData {
    subjectId: number
    examTime: string
    location: string
    maxPoints: number
}

export interface AssignmentFormData {
    subjectId: number
    dueDate: string
    title: string
    description: string
    type: string
    difficulty: string
    maxPoints: number
    file: File | null
}

export interface AssignmentSubmission {
    id: number
    s3Path: string | null
    pointsEarned: number
    feedback: string | null
    status: "PENDING" | "GRADED"
    submittedAt: string | null
    gradedAt: string | null
    student: {
        id: number
        firstName: string
        lastName: string
        email: string
        indexNumber: string
    }
}

export interface AssignmentData {
    id: number
    title: string
    description: string | null
    type: string
    difficulty: string
    dueDate: string
    maxPoints: number
    createdAt: string
    subject: {
        id: number
        name: string
        code: string
    }
    submissions: AssignmentSubmission[]
}

export interface GradeAssignmentFormData {
    assignmentId: number
    assignmentTitle: string
    maxPoints: number
    studentEmail: string
    studentName: string
    pointsEarned: number
    feedback: string
}

export interface SimilarityResult {
    message: string
    result: {
        matrix: number[][]
        score: number
    }
}
