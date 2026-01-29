export interface Subject {
    id: number
    name: string
    code: string
    ects: number
}

export interface Professor {
    id: number
    firstName: string
    lastName: string
    email: string
    title: string
    office: string | null
    subjects: Subject[]
}

export interface ProfessorFormData {
    firstName: string
    lastName: string
    email: string
    password: string
    title: string
    office: string
    subjectIds: number[]
}
