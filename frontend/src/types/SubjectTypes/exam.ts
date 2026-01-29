export interface Exam {
    id: number
    subjectId: number
    examTime: string
    location: string | null
    maxPoints: number
    subject: {
        id: number
        name: string
        code: string
        ects: number
    }
    professor: {
        id: number
        firstName: string
        lastName: string
        title: string | null
    }
    isRegistered?: boolean
    registrationId?: number
    grade?: number
}

export interface ExamRegistration {
    id: number
    examId: number
    studentId: number
    registrationDate: string
    status: string
    exam: Exam
}
