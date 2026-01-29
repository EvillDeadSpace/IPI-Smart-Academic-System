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
    maxPoints: number
    file: File | null
}
