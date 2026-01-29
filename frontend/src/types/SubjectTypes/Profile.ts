interface Subject {
    id: number
    name: string
    ects: number
    semester: string
    academicYear: string
}

export interface Grade {
    id: number
    grade: number
    points: number
    subject: {
        id: number
        name: string
        ects: number
        isElective: boolean
    }
}

export interface StudentProgress {
    student: {
        id: number
        firstName: string
        lastName: string
        email: string
        indexNumber: string
        currentYear: number
        status: string
    }
    major: {
        id: number
        name: string
        code: string
        duration: number
    }
    progress: {
        currentYear: number
        totalECTSEarned: number
        enrolledECTS: number
        passedSubjects: number
        totalSubjects: number
        canProgressToNextYear: boolean
        nextYear: number | null
        ectsNeededForNextYear: number
    }
    yearEnrollments: unknown[]
    subjectEnrollments: Subject[]
}
