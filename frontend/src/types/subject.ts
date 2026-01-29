interface Subject {
    id: number
    name: string
    ects: number
    isRequired: boolean
    year: number
}

export interface SubjectListProps {
    title: string
    subjects: Subject[]
    isElective?: boolean
    selectedElectives?: number[]
    onElectiveChange?: (subjectId: number) => void
}
