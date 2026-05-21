export type ProgressShape = {
    progress: {
        passedSubjects: number
        totalSubjects: number
        totalECTSEarned: number
        enrolledECTS: number
    }
}

export type GradeShape = { grade: number }

export type AssignmentProgressItem = {
    subjectId: number
    subjectName: string
    subjectCode: string
    assignmentPoints: {
        earned: number
        max: number
        graded: number
        total: number
    }
}
