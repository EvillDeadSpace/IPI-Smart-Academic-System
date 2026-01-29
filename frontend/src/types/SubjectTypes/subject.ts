export interface BackendProfessor {
    id: number
    firstName: string
    lastName: string
    fullName: string
}

export interface BackendSubject {
    id: number
    name: string
    code: string
    ects: number
    semester: number
    isElective: boolean
    professor: BackendProfessor | null
}

export interface BackendScheduleResponse {
    student: {
        firstName: string
        lastName: string
        majorName: string
        currentYear: number
    }
    subjects: BackendSubject[]
    totalSubjects: number
    requiredSubjects: number
    electiveSubjects: number
}
