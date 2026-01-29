export interface SubjectEnrollment {
    subject: {
        id: number
        name: string
        code: string
    }
}

export type S3File = string

export interface Subject {
    id: number
    name: string
    code: string
}

export interface Homework {
    id: number
    title: string
    description: string
    subjectId: number
    dueDate: string
    status: 'pending' | 'submitted' | 'late'
    maxPoints: number
    earnedPoints?: number
}
