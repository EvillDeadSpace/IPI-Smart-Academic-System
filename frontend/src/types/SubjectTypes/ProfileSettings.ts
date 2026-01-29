interface Subject {
    id: number
    name: string
    code: string
    ects: number
    isElective: boolean
    year: number
    semester: number
}

export interface Major {
    id: number
    name: string
    subjects: Subject[]
}
